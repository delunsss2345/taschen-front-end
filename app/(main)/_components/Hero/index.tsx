"use client";

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
  cta: string;
  href: string;
  bookImage: string;
};

const HeroSlides = ({
  slides,
  activeIndex,
  onSlideChange,
}: {
  slides: SlideItem[];
  activeIndex: number;
  onSlideChange: (index: number) => void;
}) => {
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
        onSlideChangeTransitionStart={(swiper: { realIndex: number }) => onSlideChange(swiper.realIndex)}
        initialSlide={activeIndex}
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className="relative w-full h-[640px]">
              <Image
                src={s.bookImage}
                alt={s.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={s.id === slides[0]?.id}
              />
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
  const [activeIndex, setActiveIndex] = useState(0);

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
      <section className="flex w-full flex-col border-b border-zinc-100 bg-[#f3f3f3]">
        <div className="flex h-[540px] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            <span className="text-sm text-zinc-400">Đang tải banner...</span>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[activeIndex];

  return (
    <section className="flex w-full flex-col border-b border-zinc-100">
      <HeroSlides
        slides={slides}
        activeIndex={activeIndex}
        onSlideChange={setActiveIndex}
      />
      <div className="container-main py-8 flex flex-col items-center gap-4">
        <h2 className="font-serif text-2xl font-medium leading-tight text-zinc-900 sm:text-4xl">
          {currentSlide.title}
        </h2>
        <Link
          href={currentSlide.href}
          className="inline-flex h-10 items-center justify-center border-2 border-zinc-900 bg-zinc-900 px-6 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-zinc-900"
        >
          {currentSlide.cta}
        </Link>
      </div>
    </section>
  );
};

const defaultSlides: SlideItem[] = [];

function mapBannersToSlides(banners: Banner[]) {
  return banners.map((banner) => ({
    id: String(banner.id),
    title: banner.name,
    cta: "Khám phá ngay",
    href: "/books",
    bookImage: banner.imageUrl,
  }));
}

export default Hero;
