type CatalogImageRule = [pattern: RegExp, url: string];

const catalogImageRules: CatalogImageRule[] = [
  [/премиальная активная эссенция возрождения/, "https://kocosmetic.com/cdn/shop/files/hubislab-premium-active-revival-essence-50-ml_7e5d0060-44f4-44cd-ac40-d4c44f7c9cf4.heic?v=1735051429&width=720&format=webp"],
  [/b-tol|botulinum/, "https://kocosmetic.com/cdn/shop/files/HUBISLAB_Premium-Active-Botol-Ampoule.webp?v=1735051061&width=720"],
  [/chamomile complex 70|комплексом ромашки|chamomy/, "https://kocosmetic.com/cdn/shop/files/hubislab-chamomile-complex-70-ampoule-50-ml_1.heic?v=1735054738&width=720&format=webp"],
  [/hyaluron complex 65|гиалуроновым комплексом/, "https://kocosmetic.com/cdn/shop/files/2021.06.24_HUBISLAB_07_02-1-scaled.heic?v=1735052768&width=720&format=webp"],
  [/derma max brilliance|brilliance serum/, "https://kocosmetic.com/cdn/shop/files/DermaMaxBrillianceSerum50ml_c92660a7-ee8e-4e9c-b791-800ac4a6d21f.heic?v=1735051768&width=720&format=webp"],
  [/derma max brightening clinic/, "https://kocosmetic.com/cdn/shop/files/Derma_Max_Brightening_Clinic_cream_50G_2.png?v=1784910780&width=720"],
  [/purifying cleansing gel/, "https://kocosmetic.com/cdn/shop/files/Purifying_cleansing_Gel_120ml.webp?v=1735052024&width=720"],
  [/active control solution|решение для активного контроля/, "https://kocosmetic.com/cdn/shop/files/HUBISLAB-active-control-solution-120ml__43622_1.heic?v=1740652898&width=720&format=webp"],
  [/tea tree complex 60|чайного дерева/, "https://kocosmetic.com/cdn/shop/files/HUBISLAB_Tea-Tree-Complex-60-Ampoule3_1.heic?v=1735052202&width=720&format=webp"],
  [/a\.c clearing purifying gel/, "https://kocosmetic.com/cdn/shop/files/Hubis_Lab_A.C_Clearing_Purifying_Gel_-_Soin_Anti-Acn_15ml.webp?v=1737387325&width=720"],
  [/active control cream|крем для активного контроля/, "https://kocosmetic.com/cdn/shop/files/Hubis_Lab_Active_Control_Cream_40G_Soin_Anti-Acn.webp?v=1735052215&width=720"],
  [/axcne.*cream mask/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230517/371476666de74217519e9e6a34e08081.png"],
  [/axcne.*modeling pack/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20260601/0ef0fef89af449c32baa4a2c8d52037a.jpg"],
  [/exogar.*modeling pack/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20260601/dce8c052ec9d4875a6f87b26f11ef69b.jpg"],
  [/axcne.*ampoule/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20250619/03cef2ae0d8fc516e260bebae1a612d0.png"],
  [/hyccine.*ampoule/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230927/0da9b5f88ad05c30927fa88f52bba22b.png"],
  [/phyderma/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230512/4eaa6394c6794b7402900325f20fdcf9.png"],
  [/phyball mask/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230512/d97456112df4b957c18f2a7fe683f4e3.png"],
  [/phyton serum/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230807/75c18c38e40f7f992c6cc3c54aefcf0a.png"],
  [/veloof.*(varriel|cream)/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230512/4733186a2ce8049f650f914d67b9957f.png"],
  [/hyccine.*cream/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230914/78d3fb040993e61dd018d65face7e0ae.jpg"],
  [/collamelt.*10/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230517/371476666de74217519e9e6a34e08081.png"],
  [/collamelt.*5/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230517/cffbca6313f51d1fd824b4e798bae0a1.png"],
  [/glow ?pot/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20240307/d481888912ef850e957a424a16d78147.jpg"],
  [/hyonic.*film mist/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20260911/dd9663a1d72a52a461e2fe9c72534f7a.jpg"],
  [/hyonic.*(liquid|aero) film/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20260916/1c581e96e7c8573e93848adbffd2f906.png"],
  [/axcne.*(protosan|porex)/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20260429/48a53622b302d0118bf6e6b4d8503595.jpg"],
  [/axcne.*seba(fix|fix)/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20260429/1fdf3823499d82eeae9e75df0f4c03f5.jpg"],
  [/axcne.*solavid/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20260514/a69f50ee8b8f935b6787b0fed6e7a867.jpg"],
  [/normalizing.*(booster|pad)/, "https://ecimg.cafe24img.com/pg289b35685386077/vemontes/web/product/big/20230811/9ff7171d90d82294a08cfa82143042c2.png"],
  [/physun guard/, "https://en.vemontes.com/SkinImg/line/img2-5.jpg"],
];

function normalizeCatalogName(name: string) {
  return name.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

export function getCatalogImage(name: string, fallback: string) {
  const normalizedName = normalizeCatalogName(name);
  return catalogImageRules.find(([pattern]) => pattern.test(normalizedName))?.[1] ?? fallback;
}

export function isRemoteCatalogImage(image: string) {
  return /^https?:\/\//i.test(image);
}
