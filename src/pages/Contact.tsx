import { useState } from "react";
import { ArrowRight } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n";

export default function Contact() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: t("messageSentTitle"), description: t("messageSentText") });
    setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const labelClass = "mb-2 block text-[10px] font-medium uppercase tracking-[0.13em] text-foreground";
  const inputClass = "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:ring-0";

  return (
    <>
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1300px]">
          <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.24em] text-accent">{t("contactEyebrow")}</p>
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <div>
              <h1 className="whitespace-pre-line font-display text-7xl leading-[0.85] tracking-[-0.04em] md:text-9xl">{t("contactHeading")}</h1>
              <p className="mt-8 max-w-md text-sm leading-7 text-muted-foreground">{t("contactText")}</p>
              <div className="mt-12 border-t border-border pt-6">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("responseTime")}</p>
                <p className="mt-3 font-display text-3xl">{t("responseTimeText")}</p>
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{t("productHelp")}</p>
                <a href="/shop#beauty-recommender" className="mt-3 inline-flex items-center gap-3 font-display text-3xl transition-opacity hover:opacity-60">{t("smartAdvisor")} <ArrowRight className="h-5 w-5" /></a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-secondary p-6 md:p-10 lg:p-12">
              <h2 className="mb-10 font-display text-4xl">{t("contactFormHeading")}</h2>
              <div className="space-y-7">
                <div className="grid gap-7 sm:grid-cols-2">
                  <div><label htmlFor="firstName" className={labelClass}>{t("firstName")} <span className="text-accent">({t("required")})</span></label><input id="firstName" required value={form.firstName} onChange={update("firstName")} className={inputClass} /></div>
                  <div><label htmlFor="lastName" className={labelClass}>{t("lastName")} <span className="text-accent">({t("required")})</span></label><input id="lastName" required value={form.lastName} onChange={update("lastName")} className={inputClass} /></div>
                </div>
                <div><label htmlFor="email" className={labelClass}>{t("email")} <span className="text-accent">({t("required")})</span></label><input id="email" required type="email" autoComplete="email" value={form.email} onChange={update("email")} className={inputClass} /></div>
                <div><label htmlFor="subject" className={labelClass}>{t("subject")} <span className="text-accent">({t("required")})</span></label><input id="subject" required value={form.subject} onChange={update("subject")} className={inputClass} /></div>
                <div><label htmlFor="message" className={labelClass}>{t("message")} <span className="text-accent">({t("required")})</span></label><textarea id="message" required value={form.message} onChange={update("message")} className={`${inputClass} h-28 resize-vertical`} /></div>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-4 bg-primary px-7 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? t("sending") : t("send")}<ArrowRight className="h-4 w-4" /></button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <NewsletterSignup />
    </>
  );
}
