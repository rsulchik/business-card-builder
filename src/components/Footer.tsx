import { Mail, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n";
import "./Footer.css";

const labels = {
  ru: { info: "Информация о магазине", brand: "Магазин", catalog: "Каталог", support: "Поддержка", write: "Написать в магазин", advisor: "Помощь с выбором", payment: "Информация об оплате", paymentHelp: "Задать вопрос об оплате", links: "Связь", film: "Видео VEMONTES на YouTube" },
  en: { info: "Basic Online Store Information", brand: "Store name", catalog: "Catalog", support: "Customer Service", write: "Contact the store", advisor: "Product advice", payment: "Payment Information", paymentHelp: "Ask about payment", links: "Connect", film: "VEMONTES film on YouTube" },
  tm: { info: "Dükan barada maglumat", brand: "Dükanyň ady", catalog: "Katalog", support: "Müşderi hyzmaty", write: "Dükana ýazmak", advisor: "Önüm saýlamakda kömek", payment: "Töleg barada maglumat", paymentHelp: "Töleg barada sorag bermek", links: "Habarlaşyk", film: "YouTube-da VEMONTES wideosy" },
};

export default function Footer() {
  const { language, t } = useLanguage();
  const l = labels[language];
  return (
    <footer className="store-footer">
      <div className="store-footer-inner">
        <div className="store-footer-columns">
          <section>
            <nav aria-label={l.info}>
              <Link to="/about">{t("about")}</Link>
              <Link to="/shop">{t("shop")}</Link>
              <Link to="/collections/core">{t("collections")}</Link>
              <Link to="/contact">{t("contact")}</Link>
            </nav>
            <h2>{l.info}</h2>
            <p><b>{l.brand}</b> Lumière Cosmetics</p>
            <p><b>{l.catalog}</b> <Link to="/shop?category=skincare">{t("skincare")}</Link> · <Link to="/shop?category=makeup">{t("makeup")}</Link> · <Link to="/collections/sets-and-pairs">{t("sets")}</Link></p>
          </section>
          <section>
            <h2>{l.support}</h2>
            <p><b>{t("contact")}</b><br/><Link to="/contact">{l.write}</Link></p>
            <p><b>{l.advisor}</b><br/><Link to="/shop#beauty-recommender">{t("getAdvice")}</Link></p>
          </section>
          <section>
            <h2>{l.payment}</h2>
            <p>{t("checkoutSoon")}</p>
            <Link to="/contact">{l.paymentHelp}</Link>
          </section>
        </div>
        <div className="store-footer-bottom">
          <p>© {new Date().getFullYear()} Lumière Cosmetics. {t("rights")}</p>
          <div><b>{l.links}</b><Link to="/contact" aria-label={l.write} title={l.write}><Mail/></Link><a href="https://youtu.be/HoV4vUBeDN0" target="_blank" rel="noreferrer" aria-label={l.film} title={l.film}><Youtube/></a></div>
        </div>
      </div>
    </footer>
  );
}
