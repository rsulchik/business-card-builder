import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Truck, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { useLanguage } from "@/i18n";
import { getProductName } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { money, priceLabel, reconcileCart, textFor, validCustomer, type Customer, type OrderReceipt } from "@/lib/commerce";

export default function Checkout() {
  const { user, isLoading: authLoading } = useAuth();
  const { items, removePurchased } = useCart();
  const { products, isLoading, error: catalogError, reload } = useCatalog();
  const { language } = useLanguage();
  const tr = (ru: string, en: string, tm: string) => textFor(language, ru, en, tm);
  const [customer, setCustomer] = useState<Customer>({ name: "", phone: "", email: "", country: "", city: "", address: "", note: "", consent: false });
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const request = useRef<{ key: string; fingerprint: string } | null>(null);
  useEffect(() => { if (user?.email) setCustomer(c => ({ ...c, email: c.email || user.email || "" })); }, [user?.email]);
  const lines = reconcileCart(items, products);
  const invalid = lines.some(line => line.unavailable);
  const subtotal = lines.reduce((sum, line) => sum + Math.round((line.product?.price ?? 0) * 100) * line.quantity, 0) / 100;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (locked.current || invalid || isLoading || catalogError || !user) return;
    const normalized = Object.fromEntries(Object.entries(customer).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])) as Customer;
    if (!validCustomer(normalized)) return setError(tr("Проверьте контакты, адрес и согласие на обработку заказа.", "Check your contact details, address and consent.", "Habarlaşmak maglumatlaryny, salgyny we razylygy barlaň."));
    locked.current = true; setBusy(true); setError("");
    const submitted = lines.map(l => ({ slug: l.slug, quantity: l.quantity, unit_price: l.product!.price }));
    const fingerprint = JSON.stringify({ user: user.id, customer: normalized, items: submitted, subtotal });
    try {
      // Keep the same key after a network timeout or page reload. No personal data is stored.
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fingerprint)))).map(x => x.toString(16).padStart(2,"0")).join("");
      const storageKey = `checkout-request:${user.id}`;
      if (!request.current) { try { request.current = JSON.parse(sessionStorage.getItem(storageKey) || "null"); } catch { /* Session storage may be disabled. */ } }
      if (request.current?.fingerprint !== hash) request.current = { key: crypto.randomUUID(), fingerprint: hash };
      try { sessionStorage.setItem(storageKey, JSON.stringify(request.current)); } catch { /* In-memory retries still work. */ }
      const { data, error: resultError } = await supabase.rpc("place_order", { p_request_id: request.current.key, p_customer: normalized, p_items: submitted, p_expected_total: subtotal });
      if (resultError) throw resultError;
      const result = data as unknown as OrderReceipt;
      if (!result?.id || !result.order_number) throw new Error("INVALID_RESPONSE");
      setReceipt(result);
      removePurchased(submitted);
      try { sessionStorage.removeItem(storageKey); } catch { /* Optional storage. */ }
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err ? String(err.message) : "";
      if (/PRICE_CHANGED|PRODUCT_UNAVAILABLE|PRICE_REVIEW/.test(message)) {
        setError(tr("Цена или доступность изменились. Проверьте обновлённый заказ перед повторной отправкой.", "Price or availability changed. Review the updated order before submitting again.", "Baha ýa-da elýeterlilik üýtgedi. Täzelenen sargydy barlaň."));
        await reload();
      } else if (message.includes("ORDER_LIMIT")) setError(tr("Слишком много заказов за час. Повторите позже.", "Too many orders this hour. Try again later.", "Bir sagatda sargyt köp. Soňrak synanyşyň."));
      else setError(tr("Не удалось подтвердить заказ. Корзина сохранена — повторите отправку. Повторная попытка не создаст дубликат.", "Could not confirm the order. Your basket is safe. Retry to recover the same order without duplicates.", "Sargydy tassyklap bolmady. Sebet saklandy. Gaýtadan synanyşyň."));
    } finally { locked.current = false; setBusy(false); }
  };
  const field = (key: Exclude<keyof Customer,"consent"|"note">, label: string, autoComplete: string, maxLength: number, type = "text") => <label className="block text-sm">{label}<input required type={type} autoComplete={autoComplete} maxLength={maxLength} value={customer[key]} onChange={e => setCustomer(c => ({ ...c, [key]: e.target.value }))} className="mt-2 h-12 w-full border border-border bg-white px-3 text-base focus:outline-foreground" /></label>;
  if (receipt) return <section className="mx-auto max-w-2xl px-6 py-20 text-center"><CheckCircle2 className="mx-auto mb-6 h-12 w-12" /><h1 className="text-3xl">{tr("Заказ принят", "Order received", "Sargyt kabul edildi")} № {receipt.order_number}</h1><p className="mt-5 leading-7">{tr("Ожидает подтверждения. Менеджер свяжется с вами, чтобы согласовать доставку и итоговую сумму. Оплата при получении.", "Awaiting confirmation. Our manager will contact you to agree delivery and the final amount. Pay on delivery.", "Tassyklama garaşylýar. Dolandyryjy eltip bermegi we jemi bahany ylalaşmak üçin habarlaşar. Töleg kabul edilende.")}</p><p className="my-6 text-xl">{money(receipt.subtotal)} <span className="block mt-2 text-sm text-muted-foreground">{tr("Товары, без доставки", "Products, excluding delivery", "Eltip bermezden önümler")}</span></p><Link to="/orders" className="inline-block bg-primary px-6 py-3 text-primary-foreground">{tr("Мои заказы", "My orders", "Sargytlarym")}</Link></section>;
  if (!items.length) return <section className="px-6 py-20 text-center"><h1 className="text-3xl">{tr("Корзина пуста", "Your basket is empty", "Sebediňiz boş")}</h1><Link to="/shop" className="mt-6 inline-block underline">{tr("В каталог", "Browse products", "Önümlere geç")}</Link></section>;
  return <section className="mx-auto max-w-6xl px-6 py-12 md:py-16"><Link to="/cart" className="text-sm underline">{tr("Назад в корзину", "Back to basket", "Sebede dolan")}</Link><h1 className="mt-6 text-3xl md:text-4xl">{tr("Оформление заказа", "Checkout", "Sargydy resmileşdirmek")}</h1>
    <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]"><form onSubmit={submit} className="space-y-8">
      {!authLoading && !user ? <div className="border border-border p-6"><p className="mb-4">{tr("Войдите, чтобы оформить заказ и отслеживать его в кабинете.", "Sign in to place and track your order.", "Sargyt etmek we yzarlamak üçin hasabyňyza giriň.")}</p><Link to="/login" state={{from:"/checkout"}} className="underline">{tr("Войти", "Sign in", "Giriş")}</Link> · <Link to="/register" state={{from:"/checkout"}} className="underline">{tr("Создать аккаунт", "Create account", "Hasap döret")}</Link></div> : null}
      <fieldset disabled={busy || !user || authLoading} className="space-y-8 disabled:opacity-60"><legend className="mb-5 text-xl">{tr("Контакты и адрес", "Contact & address", "Habarlaşmak we salgy")}</legend>
      <div className="grid gap-5 sm:grid-cols-2">{field("name",tr("Имя и фамилия","Full name","Ady we familiýasy"),"name",100)}{field("phone",tr("Телефон","Phone","Telefon"),"tel",24,"tel")}{field("email","Email","email",254,"email")}{field("country",tr("Страна","Country","Ýurt"),"country-name",80)}{field("city",tr("Город","City","Şäher"),"address-level2",100)}</div>
      {field("address",tr("Улица, дом, квартира","Street, building, apartment","Köçe, jaý, öý"),"street-address",300)}
      <label className="block text-sm">{tr("Комментарий к заказу (необязательно)","Order note (optional)","Sargyt belligi (hökmany däl)")}<textarea maxLength={1000} rows={3} value={customer.note} onChange={e=>setCustomer(c=>({...c,note:e.target.value}))} className="mt-2 w-full border border-border p-3 text-base" /></label>
      <div className="space-y-4 border-y border-border py-6"><p className="flex items-center gap-3"><Wallet className="h-5 w-5" />{tr("Оплата при получении","Pay on delivery","Kabul edilende töleg")}</p><p className="flex items-start gap-3 text-sm leading-6"><Truck className="mt-1 h-5 w-5 shrink-0" />{tr("Возможность, срок и стоимость доставки по вашему адресу подтвердит менеджер. Доставка не включена в сумму товаров.","Our manager will confirm availability, timing and delivery charges for your address. Delivery is not included in the product subtotal.","Siziň salgyňyza eltip bermegiň mümkinçiligini, möhletini we bahasyny dolandyryjy tassyklar. Eltip bermek önümleriň bahasyna girmeýär.")}</p></div>
      <label className="flex items-start gap-3 text-sm leading-6"><input required type="checkbox" checked={customer.consent} onChange={e=>setCustomer(c=>({...c,consent:e.target.checked}))} className="mt-1 h-4 w-4 shrink-0" />{tr("Разрешаю использовать мои контакты и адрес для обработки и доставки этого заказа.","I agree to use of my contact details and address to process and deliver this order.","Bu sargydy işlemek we eltip bermek üçin maglumatlarymy ulanmaga razy.")}</label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button disabled={busy || invalid || isLoading || !!catalogError} type="submit" className="w-full bg-primary px-6 py-4 text-primary-foreground disabled:opacity-40">{busy ? tr("Отправляем…","Submitting…","Iberilýär…") : tr("Подтвердить заказ • оплата при получении","Place order • pay on delivery","Sargyt et • kabul edilende töleg")}</button></fieldset>
    </form><aside className="order-first self-start border border-border p-6 lg:order-last lg:sticky lg:top-28"><h2 className="mb-6 text-xl">{tr("Ваш заказ","Your order","Sargydyňyz")}</h2>{(isLoading || catalogError) && <p role="status" className="mb-4 text-sm">{tr("Проверяем каталог. При ошибке обновите страницу.","Checking catalog. If loading fails, refresh the page.","Katalog barlanýar. Ýalňyşlyk bolsa sahypany täzeläň.")}</p>}<ul className="space-y-5">{lines.map(line=><li key={line.slug} className="flex gap-4"><img src={line.product?.image} alt="" className="h-20 w-20 object-contain"/><div className="min-w-0 flex-1"><p className="text-sm">{line.product ? getProductName(line.product,language) : line.slug}</p><p className="mt-2 text-sm">{line.quantity} × {line.product ? priceLabel(line.product, language) : "—"}</p>{line.unavailable && <p className="mt-1 text-sm text-destructive">{tr("Недоступно для заказа. Удалите из корзины.","Unavailable. Remove from your basket.","Elýeterli däl. Sebetden aýyryň.")}</p>}</div></li>)}</ul><div className="mt-6 border-t border-border pt-6"><div className="flex justify-between gap-4"><span>{tr("Товары","Products","Önümler")}</span><strong>{invalid ? "—" : money(subtotal)}</strong></div><p className="mt-3 text-sm text-muted-foreground">{tr("Доставка — после согласования","Delivery — to be confirmed","Eltip bermek — ylalaşylandan soň")}</p></div></aside></div>
  </section>;
}
