import useTranslator from "@/hooks/use-translator";
import type { BookMiniMalist } from "@/types/book.type";

const Grid = ({ items }: { items: BookMiniMalist[] }) => {
  const { t } = useTranslator();
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[var(--container-main)] px-6 py-16">
        <h2 className="text-center text-2xl font-extrabold text-zinc-900">
          {t("grid.title")}
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-x-12 gap-y-14 md:grid-cols-4">
          {items.map((it) => (
            <a
              key={it?.id}
              href="#"
              className="group flex flex-col items-center text-center"
            >
              <div className="relative">
                <img
                  src={it?.image}
                  alt={it?.title}
                  className="h-[260px] w-[260px] object-cover shadow-md transition group-hover:shadow-lg md:h-[300px] md:w-[300px]"
                />
              </div>

              <div className="mt-6 text-sm font-semibold tracking-wide text-zinc-900">
                {it?.badge}
              </div>

              <div className="mt-2 text-base font-semibold text-zinc-900">
                {it?.title}
              </div>

              {it?.subtitle ? (
                <div className="mt-1 text-sm text-zinc-800">{it?.subtitle}</div>
              ) : null}

              <div className="mt-8 text-sm font-semibold text-zinc-700">
                {it?.price}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Grid;
