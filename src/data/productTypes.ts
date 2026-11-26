import type { Language } from "@/i18n";

export const productTypes = [
  { key: "ampoules", ru: "Ампулы", en: "Ampoules", tm: "Ampulalar" },
  { key: "gel", ru: "Гель", en: "Gel", tm: "Gel" },
  { key: "cream", ru: "Крем", en: "Cream", tm: "Krem" },
  { key: "cushion", ru: "Кушон", en: "Cushion", tm: "Kuşon" },
  { key: "masks", ru: "Маски", en: "Masks", tm: "Maskalar" },
  { key: "mist", ru: "Мист", en: "Mist", tm: "Mist" },
  { key: "kit", ru: "Набор", en: "Set", tm: "Toplum" },
  { key: "peel", ru: "Пилинг", en: "Peel", tm: "Piling" },
  { key: "sunscreen", ru: "Солнце защитный крем", en: "Sunscreen", tm: "Günden goraýan krem" },
  { key: "serum", ru: "Сыворотка", en: "Serum", tm: "Serum" },
  { key: "toner", ru: "Тонер", en: "Toner", tm: "Toner" },
  { key: "tonic", ru: "Тоник", en: "Tonic", tm: "Tonik" },
  { key: "essence", ru: "Эссенция", en: "Essence", tm: "Essensiýa" },
  { key: "other", ru: "Другое", en: "Other", tm: "Beýleki" },
];

export function productTypeLabel(type: string | undefined, language: Language) {
  return productTypes.find(item => item.ru === type)?.[language];
}
