import { money, priceLabel, textFor } from "@/lib/commerce";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { getProductName, type Product } from "@/data/products";
import { useLanguage } from "@/i18n";
import { brandCollections } from "@/data/brandCollections";
import "./home.css";

const film = "HoV4vUBeDN0";
const cdn = "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/upload/category/editor/";
const lines = [
  { name: "AXCNE", photo: cdn + "2025/07/17/21b9bd7f9415f530b3762a85c13a0508.png", ids: [59, 94, 95] },
  { name: "EXODUO", photo: cdn + "2023/05/30/8b38867903752055be722e9656c45c79.jpg", ids: [5, 100, 101] },
];
const copy = {
  ru: ["Подборки", "Уход за кожей", "Наборы", "Выбор редакции", "Коллекция VEMONTES", "Весь каталог", "Пауза", "Смотреть видео", "Назад", "Далее"],
  en: ["Collections", "Skincare", "Discovery sets", "Editor's selection", "The VEMONTES collection", "Shop all", "Pause", "Play film", "Previous", "Next"],
  tm: ["Toplumlar", "Deri idegi", "Önüm toplumlary", "Saýlanan önümler", "VEMONTES toplumy", "Ähli önümler", "Sakla", "Wideony gör", "Yza", "Öňe"],
};

function Film({ labels }: { labels: string[] }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [enabled, setEnabled] = useState(() => !matchMedia("(prefers-reduced-motion: reduce)").matches);
  const host = "https://www.youtube.com";
  const send = (message: object) => frame.current?.contentWindow?.postMessage(JSON.stringify(message), host);
  useEffect(() => {
    if (!enabled || failed) return;
    const listen = () => send({ event: "listening", id: "home-film", channel: "widget" });
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || e.origin !== host || typeof e.data !== "string") return;
      let msg; try { msg = JSON.parse(e.data); } catch { return; }
      if (msg.event === "onReady") {
        ["onStateChange", "onError"].forEach(name => send({ event: "command", func: "addEventListener", args: [name] }));
      }
      if (msg.event === "onError") setFailed(true);
      const state = msg.event === "onStateChange" ? msg.info : msg.info?.playerState;
      if (state === 1 || state === 2 || state === 0) setPlaying(state === 1);
    };
    window.addEventListener("message", onMessage);
    const timer = window.setInterval(listen, 900);
    return () => { clearInterval(timer); window.removeEventListener("message", onMessage); };
  }, [enabled, failed]);
  return <section className="film" aria-label="VEMONTES">
    {enabled && !failed && <iframe ref={frame} id="home-film" title="VEMONTES brand film" allow="autoplay; encrypted-media; fullscreen" referrerPolicy="strict-origin-when-cross-origin"
      src={host + "/embed/" + film + "?autoplay=1&mute=1&playsinline=1&loop=1&playlist=" + film + "&controls=0&enablejsapi=1&origin=" + encodeURIComponent(location.origin)} />}
    <div className="film-tools">
      {!failed && <button type="button" aria-label={labels[playing ? 6 : 7]} onClick={() => {
        if (!enabled) setEnabled(true); else send({ event: "command", func: playing ? "pauseVideo" : "playVideo", args: [] });
      }}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button>}
      <a href={"https://youtu.be/" + film} target="_blank" rel="noreferrer">YouTube ↗</a>
    </div>
  </section>;
}

export default function Index() {
  const { language } = useLanguage();
  const { products } = useCatalog();
  const labels = copy[language];
  const rail = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const lastInteraction = useRef(0);
  const dragging = useRef(false);
  const moveSelection = (direction: number) => {
    const element = rail.current;
    if (!element || element.children.length < 2) return;
    const step = (element.children[1] as HTMLElement).offsetLeft - (element.children[0] as HTMLElement).offsetLeft;
    const end = element.scrollWidth - element.clientWidth;
    const atEnd = element.scrollLeft >= end - 2;
    const atStart = element.scrollLeft <= 2;
    const left = direction > 0 && atEnd ? 0 : direction < 0 && atStart ? end : element.scrollLeft + direction * step;
    element.scrollTo({ left, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      const element = rail.current;
      if (!element || document.hidden) return;
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= innerHeight || dragging.current || element.querySelector("a:focus-visible") || Date.now() - lastInteraction.current < 4000) return;
      moveSelection(1);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused]);
  const find = (ids: number[]) => ids.flatMap(id => products.find(p => p.slug.endsWith("-" + id)) ?? []);
  const tile = (p: Product) => <Link key={p.slug} to={"/product/" + p.slug} className="home-tile">
    <img src={p.image} loading="lazy" alt={getProductName(p, language)}/><strong>{getProductName(p, language)}</strong><span>{priceLabel(p, language)}</span>
  </Link>;
  return <div className="vem-home">
    <Film labels={labels}/>
    <section id="collections" className="home-wrap scroll-mt-20"><h1>{labels[0]}</h1><div className="home-promos">
      {brandCollections.map(collection => (
        <Link to={"/shop?collection=" + collection.key} key={collection.key}>
          <img src={collection.banner} alt="" loading="lazy"/>
          <strong>{collection.name}</strong>
        </Link>
      ))}
    </div></section>
    <section className="home-wrap"><div className="home-heading">
      <button aria-label={labels[8]} onClick={() => { lastInteraction.current = Date.now(); moveSelection(-1); }}><ChevronLeft/></button>
      <div><h2>{labels[3]}</h2><p>{labels[4]}</p></div>
      <button aria-label={labels[9]} onClick={() => { lastInteraction.current = Date.now(); moveSelection(1); }}><ChevronRight/></button>
      <button aria-label={language === "ru" ? "Автопрокрутка" : language === "en" ? "Auto-scroll" : "Awtomatiki süýşürmek"} aria-pressed={!paused} onClick={() => setPaused(value => !value)}>
        {paused ? <Play size={17}/> : <Pause size={17}/>}
      </button>
    </div><div ref={rail} className="home-rail"
      onPointerDown={() => { dragging.current = true; lastInteraction.current = Date.now(); }}
      onPointerUp={() => { dragging.current = false; lastInteraction.current = Date.now(); }}
      onPointerCancel={() => { dragging.current = false; }}
      onPointerLeave={() => { dragging.current = false; }}
      onWheel={() => { lastInteraction.current = Date.now(); }}>
      {find([116,97,94,61,1,95,83,93]).map(tile)}
    </div></section>
    {lines.map(line => <section className="home-line" key={line.name}><img className="line-banner" src={line.photo} alt={line.name} loading="lazy"/><div className="line-detail"><h2>{line.name}</h2><div className="line-products">{find(line.ids).map(tile)}</div><Link to="/shop">{labels[5]}</Link></div></section>)}
  </div>;
}
