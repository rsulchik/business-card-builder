export interface CatalogProduct {
  slug: string;
  name: string;
  price: number;
  description: string;
  tags: string[];
}

export const availableCatalog: CatalogProduct[] = [
  {
    slug: "radiance-renewal-serum",
    name: "Ýagtylyk üçin täzeleýji serum",
    price: 48,
    description: "Gialuron kislotasy, niasinamid we ösümlik ekstraktlary bolan ýüpek ýaly gündelik serum. Çyglandyryjy kremiň we makýažyň astyna aňsat ulanylýar, derini çygly, tekiz we tebigy ýagty edýär.",
    tags: ["skincare", "hydration", "glow", "daily-routine"],
  },
  {
    slug: "velvet-cloud-moisturizer",
    name: "Mäkäm Bulut çyglandyryjy krem",
    price: 36,
    description: "Skwalan, şi ýagy we ýulaf ekstrakty bolan ýumşak, rahatlyk berýän ýüz kremi. Mäkäm dokumasy agyrlık duýdurman erýär, uzak wagt rahatlyk we täze, çygly görünüş berýär.",
    tags: ["skincare", "hydration", "gentle-care", "daily-routine"],
  },
  {
    slug: "rose-quartz-facial-oil",
    name: "Gülgüne kwars ýüz ýagy",
    price: 42,
    description: "Itburnu, jojoba we limnantes ýaglarynyň ýeňil garyndysy derini ýagly duýgy galdyrman çyg saklaýar. Çyglandyryjy kremiň üstüne birnäçe damja basylýar we deriň ýumşak, ýagty görünmegine ýardam edýär.",
    tags: ["skincare", "hydration", "glow"],
  },
  {
    slug: "botanical-clay-mask",
    name: "Ösümlikli lýaý maskasy",
    price: 28,
    description: "Ýumşak kaolin lýaýy bilen ýaşyl çaýy we romashkany birleşdirýän ýuwulýan krem maska. Deriniň üstündeki hapalary arassalaýar, deriň rahat, ýumşak we täze bolmagyny üpjün edýär.",
    tags: ["skincare", "gentle-care", "even-tone"],
  },
  {
    slug: "silk-veil-lip-tint",
    name: "Ýüpek Perde dodaý boýagy",
    price: 24,
    description: "Gündelik ulanyş üçin amatly gülgüne-kahweýi reňkdäki, agyrlygy duýulmaýan dodaý boýagy. Ýumşak atlas ýaly tamamlanýar; reňki ýeňil ýa-da birnäçe gatlap ulanyp bolýar.",
    tags: ["makeup", "lip-color", "gift"],
  },
  {
    slug: "mineral-glow-highlighter",
    name: "Mineral ýagtylyk haýlaýteri",
    price: 32,
    description: "Inçe öwülen şampan reňkli haýlaýter ýagtylygy inje ýaly ýumşak şöhle bilen yzyna gaýtarýar. Ýaňak çykyntlaryna, gaş astyndaky süňklere we gözüň içki burçlaryna ulanylýar.",
    tags: ["makeup", "glow", "gift"],
  },
  {
    slug: "petal-soft-cream-blush",
    name: "Gülýaprak ýaly ýumşak krem allık",
    price: 28,
    description: "Yly şaftaly-gülgüne reňkdäki, aňsat garyşýan krem allık. Balzam ýaly dokumasy barmak ujumlary bilen ýaňaklara aňsat ýaýraýar we tebigy gülgüne şöhle döredýär.",
    tags: ["makeup", "cheek-color", "gift"],
  },
  {
    slug: "daily-dew-skin-set",
    name: "Gündelik Şebnem deri toplumy",
    price: 58,
    description: "Ýumşak krem arassalaýjy, Ýagtylyk üçin täzeleýji serum we Mäkäm Bulut çyglandyryjy kremden ybarat doly üç basgançakly ideg. Ýönekeý irler, rahat agşamlar we gözel çyglandyrylan deri üçin döredildi.",
    tags: ["skincare", "hydration", "glow", "gentle-care", "daily-routine", "gift"],
  },
];
