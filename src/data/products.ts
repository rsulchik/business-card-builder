import radianceRenewalSerum from "@/assets/products/radiance-renewal-serum.jpg";
import velvetCloudMoisturizer from "@/assets/products/velvet-cloud-moisturizer.jpg";
import roseQuartzFacialOil from "@/assets/products/rose-quartz-facial-oil.jpg";
import botanicalClayMask from "@/assets/products/botanical-clay-mask.jpg";
import silkVeilLipTint from "@/assets/products/silk-veil-lip-tint.jpg";
import mineralGlowHighlighter from "@/assets/products/mineral-glow-highlighter.jpg";
import petalSoftCreamBlush from "@/assets/products/petal-soft-cream-blush.jpg";
import botanicalLashBrowSerum from "@/assets/products/botanical-lash-brow-serum.jpg";
import dailyDewSkinSet from "@/assets/products/daily-dew-skin-set.jpg";
import type { Language } from "@/i18n";
import { importedCatalog } from "@/data/catalogImport";

export type ProductCategory = "skincare" | "makeup" | "sets";

export interface Product {
  brand?: string;
  isFamilyPhoto?: boolean;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: ProductCategory;
  badge?: "sale" | "sold-out";
  availability?: string;
  nameRu?: string;
  nameEn?: string;
  descriptionRu?: string;
  descriptionEn?: string;
  availabilityRu?: string;
  availabilityEn?: string;
  sortOrder?: number;
}

export const categoryLabels: Record<ProductCategory, string> = {
  skincare: "Deri idegi",
  makeup: "Makýaž",
  sets: "Gözelik toplumlary",
};

const productTranslations: Record<string, { ru: { name: string; description: string; availability?: string }; en: { name: string; description: string; availability?: string } }> = {
  "radiance-renewal-serum": {
    ru: { name: "Сыворотка для сияния", description: "Шёлковистая ежедневная сыворотка с гиалуроновой кислотой, ниацинамидом и растительными экстрактами. Легко наносится под крем и макияж, оставляя кожу увлажнённой, гладкой и сияющей." },
    en: { name: "Radiance Renewal Serum", description: "A silky daily serum with hyaluronic acid, niacinamide and botanical extracts. Easy to wear under moisturiser and makeup for hydrated, smooth, naturally radiant skin." },
  },
  "velvet-cloud-moisturizer": {
    ru: { name: "Увлажняющий крем Velvet Cloud", description: "Мягкий комфортный крем для лица со скваланом, маслом ши и экстрактом овса. Насыщенная текстура тает без тяжести, даря коже длительный комфорт и свежий увлажнённый вид." },
    en: { name: "Velvet Cloud Moisturizer", description: "A soft, comforting face cream with squalane, shea butter and oat extract. Its rich texture melts without heaviness for lasting comfort and a fresh, dewy finish." },
  },
  "rose-quartz-facial-oil": {
    ru: { name: "Масло для лица Rose Quartz", description: "Лёгкая смесь масел шиповника, жожоба и лимнанта, которая удерживает влагу без жирного ощущения. Нанесите несколько капель поверх крема для мягкой, сияющей кожи." },
    en: { name: "Rose Quartz Facial Oil", description: "A light blend of rosehip, jojoba and meadowfoam oils that helps lock in moisture without a greasy feel. Press a few drops over moisturiser for soft, radiant skin." },
  },
  "botanical-clay-mask": {
    ru: { name: "Ботаническая глиняная маска", description: "Смываемая кремовая маска с мягкой каолиновой глиной, зелёным чаем и ромашкой. Очищает поверхность кожи и оставляет её спокойной, мягкой и свежей." },
    en: { name: "Botanical Clay Mask", description: "A rinse-off cream mask combining gentle kaolin clay with green tea and chamomile. Cleanses the surface of skin and leaves it calm, soft and fresh." },
  },
  "silk-veil-lip-tint": {
    ru: { name: "Тинт для губ Silk Veil", description: "Невесомый розово-коричневый тинт для губ на каждый день. Мягкий сатиновый финиш легко наносится, а цвет можно оставить прозрачным или наслаивать." },
    en: { name: "Silk Veil Lip Tint", description: "An effortless rose-brown lip tint for every day. Its soft satin finish glides on easily and can be worn sheer or layered for more colour." },
  },
  "mineral-glow-highlighter": {
    ru: { name: "Хайлайтер Mineral Glow", description: "Тонко измельчённый хайлайтер оттенка шампанского мягко отражает свет. Наносите на скулы, подбровную дугу или внутренние уголки глаз." },
    en: { name: "Mineral Glow Highlighter", description: "A finely milled champagne highlighter that reflects light with a soft, candlelit glow. Sweep over cheekbones, brow bones and inner corners." , availability: "Only 4 left"},
  },
  "petal-soft-cream-blush": {
    ru: { name: "Кремовые румяна Petal Soft", description: "Легко растушёвываемые кремовые румяна персиково-розового оттенка. Бальзамная текстура тает от тепла пальцев и создаёт естественный румянец." },
    en: { name: "Petal Soft Cream Blush", description: "An easy-to-blend cream blush in a peachy rose shade. Its balm-like texture melts in with fingertips for a natural, skin-like flush." },
  },
  "botanical-lash-brow-serum": {
    ru: { name: "Ботаническая сыворотка для ресниц и бровей", description: "Лёгкая сыворотка с пептидами, пантенолом и растительными экстрактами для вечернего ухода. Точная щёточка помогает нанести её по линии ресниц и на брови." },
    en: { name: "Botanical Lash & Brow Serum", description: "A lightweight care serum with peptides, panthenol and botanical extracts. The precise brush makes evening application along the lash line and brows easy." },
  },
  "daily-dew-skin-set": {
    ru: { name: "Набор ухода Daily Dew", description: "Полный трёхступенчатый ритуал: мягкое кремовое очищение, сыворотка для сияния и увлажняющий крем Velvet Cloud. Для простого утра, спокойного вечера и увлажнённой кожи." },
    en: { name: "Daily Dew Skin Set", description: "A complete three-step ritual with a gentle cream cleanser, Radiance Renewal Serum and Velvet Cloud Moisturizer. Made for easy mornings, calm evenings and dewy skin." },
  },
};

export function getProductName(product: Product, language: Language) {
  if (language === "tm") return product.name;
  return language === "ru"
    ? product.nameRu ?? productTranslations[product.slug]?.ru.name ?? product.name
    : product.nameEn ?? productTranslations[product.slug]?.en.name ?? product.name;
}

export function getProductDescription(product: Product, language: Language) {
  if (language === "tm") return product.description;
  return language === "ru"
    ? product.descriptionRu ?? productTranslations[product.slug]?.ru.description ?? product.description
    : product.descriptionEn ?? productTranslations[product.slug]?.en.description ?? product.description;
}

export function getProductAvailability(product: Product, language: Language) {
  if (!product.availability) return undefined;
  if (language === "tm") return product.availability;
  return language === "ru"
    ? product.availabilityRu ?? productTranslations[product.slug]?.ru.availability ?? "Осталось всего 4"
    : product.availabilityEn ?? productTranslations[product.slug]?.en.availability ?? "Only 4 left";
}

export function getCategoryLabel(category: ProductCategory, language: Language) {
  if (language === "tm") return categoryLabels[category];
  return language === "ru"
    ? { skincare: "Уход за кожей", makeup: "Макияж", sets: "Наборы красоты" }[category]
    : { skincare: "Skincare", makeup: "Makeup", sets: "Beauty sets" }[category];
}

const coreProducts: Product[] = [
  {
    slug: "radiance-renewal-serum",
    name: "Ýagtylyk üçin täzeleýji serum",
    price: 48,
    image: radianceRenewalSerum,
    category: "skincare",
    description: "Gialuron kislotasy, niasinamid we ösümlik ekstraktlary bolan ýüpek ýaly gündelik serum. Çyglandyryjy kremiň we makýažyň astyna aňsat ulanylýar, derini çygly, tekiz we tebigy ýagty edýär.",
  },
  {
    slug: "velvet-cloud-moisturizer",
    name: "Mäkäm Bulut çyglandyryjy krem",
    price: 36,
    image: velvetCloudMoisturizer,
    category: "skincare",
    description: "Skwalan, şi ýagy we ýulaf ekstrakty bolan ýumşak, rahatlyk berýän ýüz kremi. Mäkäm dokumasy agyrlık duýdurman erýär, uzak wagt rahatlyk we täze, çygly görünüş berýär.",
  },
  {
    slug: "rose-quartz-facial-oil",
    name: "Gülgüne kwars ýüz ýagy",
    price: 42,
    image: roseQuartzFacialOil,
    category: "skincare",
    description: "Itburnu, jojoba we limnantes ýaglarynyň ýeňil garyndysy derini ýagly duýgy galdyrman çyg saklaýar. Çyglandyryjy kremiň üstüne birnäçe damja basyň, deriňiz ýumşak we içerden ýagty görünsün.",
  },
  {
    slug: "botanical-clay-mask",
    name: "Ösümlikli lýaý maskasy",
    price: 28,
    originalPrice: 36,
    image: botanicalClayMask,
    category: "skincare",
    badge: "sale",
    description: "Ýumşak kaolin lýaýy bilen ýaşyl çaýy we romashkany birleşdirýän ýuwulýan krem maska. Deriniň üstündeki hapalary arassalaýar, deriň rahat, ýumşak we täze bolmagyny üpjün edýär.",
  },
  {
    slug: "silk-veil-lip-tint",
    name: "Ýüpek Perde dodaý boýagy",
    price: 24,
    image: silkVeilLipTint,
    category: "makeup",
    description: "Gündelik ulanyş üçin amatly gülgüne-kahweýi reňkdäki, agyrlygy duýulmaýan dodaý boýagy. Ýumşak atlas ýaly tamamlanýan formulasy aňsat sürülýär; reňki ýeňil ýa-da birnäçe gatlap ulanyp bolýar.",
  },
  {
    slug: "mineral-glow-highlighter",
    name: "Mineral ýagtylyk haýlaýteri",
    price: 32,
    image: mineralGlowHighlighter,
    category: "makeup",
    availability: "Diňe 4 sany galdy",
    description: "Inçe öwülen şampan reňkli haýlaýter ýagtylygy inje ýaly ýumşak şöhle bilen yzyna gaýtarýar. Äbsuňsyz ýagtylyk üçin ýaňak çykyntlaryna, gaş astyndaky süňklere we gözüň içki burçlaryna ulanyň.",
  },
  {
    slug: "petal-soft-cream-blush",
    name: "Gülýaprak ýaly ýumşak krem allık",
    price: 28,
    image: petalSoftCreamBlush,
    category: "makeup",
    description: "Yly şaftaly-gülgüne reňkdäki, aňsat garyşýan krem allık. Balzam ýaly dokumasy barmak ujumlary bilen ýaňaklara aňsat ýaýraýar we deri ýaly ýumşak tamamlanýan tebigy gülgüne şöhle döredýär.",
  },
  {
    slug: "botanical-lash-brow-serum",
    name: "Kirpik we gaş üçin ösümlikli serum",
    price: 34,
    image: botanicalLashBrowSerum,
    category: "skincare",
    badge: "sold-out",
    description: "Peptidler, pantenol we ösümlik ekstraktlary bolan ýeňil ideg serumi. Takyk çotga agşam idegiňizde serumi kirpik çyzgysyna we gaşlaryň üstüne aňsat sürtmäge mümkinçilik berýär.",
  },
  {
    slug: "daily-dew-skin-set",
    name: "Gündelik Şebnem deri toplumy",
    price: 58,
    image: dailyDewSkinSet,
    category: "sets",
    description: "Ýumşak krem arassalaýjy, Ýagtylyk üçin täzeleýji serum we Mäkäm Bulut çyglandyryjy kremden ybarat doly üç basgançakly ideg. Ýönekeý irler, rahat agşamlar we gözel çyglandyrylan deri üçin döredildi.",
  },
];

export const products: Product[] = [...coreProducts, ...importedCatalog];

export const featuredProducts = [
  products.find(p => p.slug === "daily-dew-skin-set")!,
  products.find(p => p.slug === "velvet-cloud-moisturizer")!,
  products.find(p => p.slug === "mineral-glow-highlighter")!,
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getRelatedProducts(slug: string, count = 3): Product[] {
  return products.filter(p => p.slug !== slug && p.badge !== "sold-out").slice(0, count);
}
