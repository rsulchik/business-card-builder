import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/i18n";
import { money, textFor, type Customer, type OrderItem } from "@/lib/commerce";
import type { Tables } from "@/integrations/supabase/types";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export default function Orders({ admin = false }: { admin?: boolean }) {
  const { user, isLoading: authLoading } = useAuth();
  const { language } = useLanguage();
  const tr = (ru:string,en:string,tm:string) => textFor(language,ru,en,tm);
  const statusName = (status: string) => ({pending:tr("Ожидает подтверждения","Awaiting confirmation","Tassyklama garaşylýar"),confirmed:tr("Подтверждён","Confirmed","Tassyklandy"),shipped:tr("Отправлен","Shipped","Iberildi"),delivered:tr("Доставлен","Delivered","Eltildi"),cancelled:tr("Отменён","Cancelled","Ýatyryldy")}[status] || status);
  const [orders,setOrders] = useState<Tables<"orders">[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [saving,setSaving] = useState<string|null>(null);
  const [refresh,setRefresh] = useState(0);
  useEffect(()=>{
    if (!user) { setOrders([]); setLoading(false); return; }
    let active=true; setLoading(true); setError("");
    let query=supabase.from("orders").select("*").order("created_at",{ascending:false}).limit(100);
    if (!admin) query=query.eq("user_id",user.id);
    void query.then(({data,error:readError})=>{if(active){setOrders(data||[]);setError(readError ? "load" : "");setLoading(false);}});
    return ()=>{active=false;};
  },[user?.id,admin,refresh]);
  const update = async (id:string,status:string)=>{
    setSaving(id);setError("");
    const {data,error:updateError}=await supabase.from("orders").update({status}).eq("id",id).select("id,status").single();
    if(updateError || !data) setError("save"); else setOrders(current=>current.map(o=>o.id===id?{...o,status:data.status}:o));
    setSaving(null);
  };
  if(authLoading) return null;
  if(!user) return <section className="p-10 text-center"><Link to="/login" state={{from:"/orders"}} className="underline">{tr("Войдите, чтобы увидеть заказы","Sign in to view your orders","Sargytlary görmek üçin giriň")}</Link></section>;
  return <section className={admin?"my-10 border-b border-border pb-10":"mx-auto max-w-5xl px-6 py-14"}><div className="mb-8 flex items-center justify-between gap-5"><h1 className="text-3xl">{admin?tr("Заказы покупателей","Customer orders","Müşderileriň sargytlary"):tr("Мои заказы","My orders","Sargytlarym")}</h1><button onClick={()=>setRefresh(n=>n+1)} className="text-sm underline">{tr("Обновить","Refresh","Täzele")}</button></div>
    {error && <p role="alert" className="mb-6 text-destructive">{tr("Не удалось загрузить или сохранить заказ. Повторите попытку.","Could not load or update orders. Please retry.","Sargytlary ýüklemek ýa-da saklamak başartmady. Gaýtadan synanyşyň.")}</p>}
    {loading?<p>{tr("Загружаем заказы…","Loading orders…","Sargytlar ýüklenýär…")}</p>:!orders.length&&!error?<p>{tr("Заказов пока нет.","No orders yet.","Entek sargyt ýok.")} <Link to="/shop" className="underline">{tr("В каталог","Shop","Dükana")}</Link></p>:null}
    <div className="space-y-6">{orders.map(order=>{const customer=order.customer as unknown as Customer;const items=order.items as unknown as OrderItem[];return <article key={order.id} className="border border-border p-5 md:p-7"><div className="flex flex-wrap justify-between gap-4"><div><h2 className="text-xl">№ {order.order_number}</h2><p className="mt-2 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString(language==="ru"?"ru-RU":"en-GB")}</p></div><p className="text-sm">{statusName(order.status)}</p></div><ul className="my-6 space-y-3">{items.map(item=><li key={item.slug} className="flex justify-between gap-5 text-sm"><span>{language==="ru"?item.name_ru:language==="tm"?item.name_tm:item.name_en} × {item.quantity}</span><span className="shrink-0">{money(item.unit_price*item.quantity)}</span></li>)}</ul><p className="border-t border-border pt-4 font-medium">{money(order.subtotal)} <span className="text-sm font-normal">{tr("без доставки · оплата при получении","excluding delivery · pay on delivery","eltip bermezden · kabul edilende töleg")}</span></p><details className="mt-5 text-sm"><summary className="cursor-pointer">{tr("Контакты и доставка","Contact & delivery","Habarlaşmak we eltip bermek")}</summary><div className="mt-3 space-y-2 leading-6"><p>{customer.name} · {customer.phone}</p><p className="break-words">{customer.email}</p><p>{customer.country}, {customer.city}, {customer.address}</p>{customer.note&&<p>{customer.note}</p>}<p className="text-muted-foreground">{tr("Стоимость и срок доставки согласуются с менеджером.","Delivery charge and timing are agreed with the manager.","Eltip bermegiň bahasy we möhleti dolandyryjy bilen ylalaşylýar.")}</p></div></details>{admin&&<label className="mt-5 block text-sm">{tr("Статус заказа","Order status","Sargydyň ýagdaýy")}<select disabled={saving===order.id} value={order.status} onChange={e=>void update(order.id,e.target.value)} className="ml-3 border border-border p-2">{statuses.map(s=><option key={s} value={s}>{statusName(s)}</option>)}</select></label>}</article>})}</div><p className="mt-6 text-sm text-muted-foreground">{orders.length===100?tr("Показаны последние 100 заказов.","Showing the latest 100 orders.","Soňky 100 sargyt görkezilýär."):""}</p>
  </section>;
}
