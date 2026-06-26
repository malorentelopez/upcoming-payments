import { getTranslations } from "next-intl/server";

const FAQ_KEYS = ["what", "bank", "free", "privacy", "delete"] as const;

export async function LandingFaq() {
  const t = await getTranslations("landing.faq");

  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-24 md:px-10">
      <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">
        {t("title")}
      </h2>
      <div className="space-y-3">
        {FAQ_KEYS.map((key) => (
          <details
            key={key}
            className="group rounded-2xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur"
          >
            <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {t(`items.${key}.question`)}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t(`items.${key}.answer`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
