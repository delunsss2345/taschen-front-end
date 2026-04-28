"use client";

import { cn } from "@/lib/utils";
import { A11y, Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { bannerService } from "@/services/banner.service";
import type { Banner } from "@/types/response/banner.response";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

type SlideItem = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bookImage: string;
  bgClass: string;
  tag: string;
};

const bgClasses = [
  "bg-[#f3f3f3] text-zinc-900",
  "bg-[#e5e7eb] text-zinc-900",
  "bg-[#d1d5db] text-zinc-900",
  "bg-[#c4b5a0] text-zinc-900",
  "bg-[#b8c5d4] text-zinc-900",
];

const defaultSlides: SlideItem[] = [];

const HeroSlides = ({ slides }: { slides: SlideItem[] }) => {
  return (
    <>
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
        loop={slides.length > 1}
        className="hero-swiper w-full"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className={cn("relative w-full py-16 md:py-28", s.bgClass)}>
              <div className="container-main grid grid-cols-1 items-center gap-10 md:grid-cols-2">
                <div className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left">
                  <span className="mb-4 text-xs font-bold uppercase tracking-[0.3em] opacity-50">
                    {s.tag}
                  </span>
                  <h2 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-6xl">
                    {s.title}
                  </h2>
                  <p className="mt-6 max-w-md text-lg text-zinc-600">
                    {s.subtitle}
                  </p>

                  <div className="mt-10">
                    <Link
                      href={s.href}
                      className="inline-flex h-12 items-center justify-center border-2 border-zinc-900 bg-zinc-900 px-8 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-zinc-900"
                    >
                      {s.cta}
                    </Link>
                  </div>
                </div>

                <div className="order-1 flex justify-center md:order-2 md:justify-end">
                  <div className="relative w-full max-w-[560px] overflow-hidden rounded-xl shadow-2xl">
                    <div className="relative w-full h-[460px]">
                      <Image
                        src={s.bookImage}
                        alt={s.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 560px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

const Hero = () => {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const banners = await bannerService.getAllBanners();
        if (banners.length > 0) {
          setSlides(mapBannersToSlides(banners));
        } else {
          setSlides(defaultSlides);
        }
      } catch {
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <section className="relative flex h-[400px] w-full items-center justify-center border-b border-zinc-100 bg-[#f3f3f3]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <span className="text-sm text-zinc-400">Đang tải banner...</span>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden border-b border-zinc-100">
      <HeroSlides slides={slides} />
    </section>
  );
};

function mapBannersToSlides(banners: Banner[]) {
  return banners.map((banner, index) => ({
    id: String(banner.id),
    title: banner.name,
    subtitle: banner.subtitle,
    cta: "Khám phá ngay",
    href: "/books",
    bookImage: banner.imageUrl,
    bgClass: bgClasses[index % bgClasses.length],
    tag: banner.tag,
  }));
}

export default Hero;
