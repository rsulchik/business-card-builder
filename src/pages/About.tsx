import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import aboutBg from "@/assets/about-beauty.jpg";
import { useLanguage } from "@/i18n";

const principles = ["principle1", "principle2", "principle3"] as const;

export default function About() {
  const { t } = useLanguage();
  const principleTexts = ["principle1Text", "principle2Text", "principle3Text"] as const;

  return (
    <>
      <section className="px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.24em] text-accent">{t("aboutEyebrow")}</p>
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <h1 className="whitespace-pre-line text-balance font-display text-3xl leading-[0.88] tracking-[-0.04em] md:text-5xl lg:text-9xl">{t("aboutHeading")}</h1>
            <p className="max-w-md text-sm leading-7 text-muted-foreground lg:pb-2">{t("aboutIntro")}</p>
          </div>
        </div>
      </section>

      <div className="h-[55svh] min-h-[420px] overflow-hidden">
        <img src={aboutBg} alt="Lumière studiýasynda botaniki kosmetika bilen taýýarlyk işleri" className="h-full w-full object-cover" />
      </div>

      <section className="px-6 py-20 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">{t("ourBeginning")}</p>
          <div className="space-y-7">
            <h2 className="font-display text-4xl leading-tight md:text-3xl">{t("beginningHeading")}</h2>
            <div className="grid gap-7 pt-4 text-sm leading-7 text-muted-foreground md:grid-cols-2">
              <p>{t("beginningText1")}</p>
              <p>{t("beginningText2")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-12 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">{t("principlesTitle")}</p>
          <div className="grid gap-10 md:grid-cols-3">
            {principles.map((principle, index) => (
              <article key={principle} className="border-t border-foreground/25 pt-6">
                <p className="mb-8 text-[10px] tracking-[0.2em] text-accent">0{index + 1}</p>
                <h2 className="font-display text-3xl leading-tight">{t(principle)}</h2>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">{t(principleTexts[index])}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-6 py-24 text-center text-primary-foreground md:px-10 md:py-32">
        <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-primary-foreground/55">Lumière Cosmetics</p>
        <h2 className="mx-auto max-w-4xl font-display text-3xl leading-[0.98] md:text-5xl">{t("aboutCta")}</h2>
        <Link to="/collections/core" className="mt-10 inline-flex items-center gap-4 border border-primary-foreground/50 px-7 py-4 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-primary-foreground hover:text-primary">{t("explore")} <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </>
  );
}
