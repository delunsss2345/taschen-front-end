import useTranslator from "@/hooks/use-translator";

const QuoteRandom = () => {
  const { t } = useTranslator();
  return (
    <section className="w-full bg-[#7f7690]">
      <div className="mx-auto grid max-w-[var(--container-main)] grid-cols-12 gap-8 px-10 py-20">
        <div className="col-span-12 flex flex-col justify-center md:col-span-7">
          <span className="mb-6 text-sm font-medium text-white">
            {t("quote.sectionLabel")}
          </span>

          <p className="max-w-[720px] text-2xl font-light leading-relaxed text-white md:text-3xl">
            {t("quote.textStart")} <em>{t("quote.textEm")}</em>
            {t("quote.textEnd")}
          </p>

          <cite className="mt-4 block text-lg italic text-white">
            {t("quote.cite")}
          </cite>
        </div>

        <div className="col-span-12 flex justify-center md:col-span-5">
          <div className="flex flex-col items-center text-white">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80"
              alt={t("quote.imageAlt")}
              className="mb-6 w-[560px] shadow-2xl"
            />

            <div className="text-sm font-semibold">{t("common.badge.new")}</div>
            <div className="mt-1 text-base font-medium">
              {t("quote.productTitle")}
            </div>
            <div className="mt-6 text-base font-semibold">
              {t("quote.productPrice")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteRandom;
