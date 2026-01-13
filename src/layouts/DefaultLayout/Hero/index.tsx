import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type SlideItem = {
  id: string;
  title: string;
  cta: string;
  href: string;
  image: string;
};

const slides: SlideItem[] = [
  {
    id: "1",
    title: "Massimo Listri. Italian Palaces",
    cta: "Discover Now",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "2",
    title: "New Releases",
    cta: "Shop Now",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "3",
    title: "Limited Editions",
    cta: "Explore",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=80",
  },
];

const Hero = () => {
  return (
    <section className="w-full">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        navigation
        pagination={{ clickable: true }}
        loop
        className="w-full"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className="w-full">
              <div className="relative h-[620px] w-full overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
              </div>

              <div className="border-t bg-white ">
                <div className="mx-auto flex max-w-[var(--container-main)] flex-col items-center justify-center gap-3 px-6 py-10">
                  <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
                    {s.title}
                  </h2>

                  <a
                    href={s.href}
                    className="inline-flex h-9 items-center justify-center rounded-sm border border-zinc-300 px-5 text-sm text-zinc-900 hover:bg-zinc-50"
                  >
                    {s.cta}
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
