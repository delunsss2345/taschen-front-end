"use client";

import useTranslator from "@/hooks/use-translator";
import { cn } from "@/lib/utils";
import { A11y, Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

type SlideItem = {
  id: string;
  title: string;
  cta: string;
  href: string;
  bookImage: string;
  bgClass: string;
};

const slides: SlideItem[] = [
  {
    id: "1",
    title: "The Gourmand's Mushroom",
    cta: "Discover Now",
    href: "/detail/1",
    bookImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    bgClass: "bg-[#f3f3f3] text-zinc-900",
  },
  {
    id: "2",
    title: "Frida Kahlo. The Complete Paintings",
    cta: "Discover Now",
    href: "/detail/2",
    bookImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    bgClass: "bg-[#e5e7eb] text-zinc-900",
  },
  {
    id: "3",
    title: "Caravaggio. The Complete Works",
    cta: "Discover Now",
    href: "/detail/3",
    bookImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    bgClass: "bg-[#d1d5db] text-zinc-900",
  },
];

const Hero = () => {
  const { t } = useTranslator();

  return (
    <section className="relative w-full overflow-hidden border-b border-zinc-100">
      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #000;
          opacity: 0.2;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #000;
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: #000;
          transform: scale(0.7);
        }
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-weight: bold;
        }
      `}</style>

      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        loop
        className="hero-swiper w-full"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className={cn("relative w-full py-12 md:py-20", s.bgClass)}>
              <div className="container-main grid grid-cols-1 items-center gap-10 md:grid-cols-2">

                <div className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left">
                  <span className="mb-4 text-xs font-bold uppercase tracking-[0.3em] opacity-50">
                    Featured Edition
                  </span>
                  <h2 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-6xl">
                    {s.title}
                  </h2>
                  <p className="mt-6 max-w-md text-lg text-zinc-600">
                    Explore the definitive collection of masterpieces, curated for the modern connoisseur.
                  </p>

                  <div className="mt-10">
                    <a
                      href={s.href}
                      className="inline-flex h-12 items-center justify-center border-2 border-zinc-900 bg-zinc-900 px-8 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-zinc-900"
                    >
                      {s.cta}
                    </a>
                  </div>
                </div>

                <div className="order-1 flex justify-center md:order-2 md:justify-end">
                  <div className="relative group/book">
                    <div
                      className="relative h-[350px] w-[240px] shadow-2xl transition-transform duration-1000 ease-out sm:h-[450px] sm:w-[310px]"
                      style={{
                        transform: "perspective(1500px) rotateY(-8deg) rotateX(2deg)",
                        boxShadow: "-15px 20px 40px rgba(0,0,0,0.2)",
                      }}
                    >
                      {/* Spine giả lập nhẹ */}
                      <div className="absolute left-0 top-0 z-10 h-full w-[10px] bg-black/10" />

                      <img
                        src={s.bookImage}
                        alt={s.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {/* Đổ bóng mặt bàn mờ */}
                    <div className="absolute -bottom-6 left-1/2 h-4 w-[90%] -translate-x-1/2 rounded-[100%] bg-black/10 blur-xl" />
                  </div>
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