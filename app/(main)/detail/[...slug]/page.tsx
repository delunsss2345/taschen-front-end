"use client";

import { Heart, Minus, Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import BookCard from "@/app/(main)/_components/BookCard";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const formatPrice = (price: number) => `US$ ${price}`;

const relatedTitles = [
  {
    title: "Modern Tree Houses",
    subtitle: "Green Architecture",
    price: 95,
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "100 Contemporary",
    subtitle: "Wood Houses",
    price: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Green Architecture",
    subtitle: "Now!",
    price: 110,
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "LO-TEK Design",
    subtitle: "By Radical Indigenousism",
    price: 85,
    imageUrl:
      "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&w=600&q=80",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1455885666463-212af60f0096?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2400&q=85",
];

export default function DetailPage() {
  const [qty, setQty] = React.useState(1);
  const [active, setActive] = React.useState(0);
  const [readMoreOpen, setReadMoreOpen] = React.useState(true);
  const [reviewsOpen, setReviewsOpen] = React.useState(false);

  return (
    <div className="w-full bg-white text-neutral-900">
      <div className="mx-auto max-w-[1540px] px-6 py-3">
        {/* breadcrumb */}
        <nav className="text-[12px] tracking-wide text-neutral-500">
          <span>Home</span> <span className="mx-2 text-neutral-300">|</span>
          <span>Books</span> <span className="mx-2 text-neutral-300">|</span>
          <span>Architecture &amp; Design</span> <span className="mx-2 text-neutral-300">|</span>
          <span className="text-neutral-900">Homes for Our Time. Sustainable Living</span>
        </nav>

        <div className="mt-10 grid grid-cols-1 gap-12 xl:grid-cols-12">
          {/* LEFT: gallery */}
          <section className="xl:col-span-7">
            <div className="bg-white p-6">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-sm">
                <Image
                  src={gallery[active]}
                  alt="Product image"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1280px) 55vw, 100vw"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[12px] text-neutral-500">
                {active + 1} / {gallery.length}
              </p>

              {/* thumbs */}
              <div className="flex gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(i)}
                    className={[
                      "relative h-14 w-12 overflow-hidden rounded-sm border transition",
                      i === active ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-400",
                    ].join(" ")}
                    aria-label={`Open image ${i + 1}`}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="48px" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: info */}
          <section className="xl:col-span-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold tracking-widest text-red-600">NEW</span>
                  <span className="rounded-sm border border-neutral-200 px-2 py-1 text-[12px] tracking-wide text-neutral-700">
                    XL
                  </span>
                </div>

                <h1 className="mt-4 font-serif text-[34px] leading-[1.1] tracking-tight">
                  Homes for Our Time.
                  <br />
                  Sustainable Living
                </h1>

                <p className="mt-4 text-[22px] tracking-tight text-neutral-900">{formatPrice(80)}</p>
              </div>

              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 hover:border-neutral-400"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 space-y-2 text-[13px] leading-6 text-neutral-700">
              <p>Edition: Multilingual (English, French, German)</p>
              <p>Availability: In Stock</p>
            </div>

            <div className="mt-8 space-y-5 text-[15px] leading-7 text-neutral-800">
              <p>
                <span className="font-semibold text-neutral-900">The future of resourceful living:</span>{" "}
                these cutting-edge examples of <span className="font-semibold text-neutral-900">green buildings</span>{" "}
                combine innovative design with eco-friendly solutions.
              </p>
              <p className="text-neutral-500">Hardcover, 24.6 × 37.2 cm, 496 pages</p>
            </div>

            {/* ---- Variant selector (UI only) ---- */}
            <div className="mt-8">
              <p className="mb-3 text-[13px] font-medium text-neutral-700">Size</p>
              <div className="flex flex-wrap gap-2">
                {["36", "37", "38", "39W", "39", "40", "41", "42", "43", "44"].map(
                  (variant) => (
                    <button
                      key={variant}
                      type="button"
                      className={[
                        "flex h-12 min-w-[60px] items-center justify-center rounded-sm border px-3 text-[13px] transition",
                        variant === "43"
                          ? "border-neutral-900 bg-neutral-900 font-semibold text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400",
                      ].join(" ")}
                    >
                      {variant}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="inline-flex items-center rounded-sm border border-neutral-200">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-none px-3"
                  onClick={() => setQty((p) => Math.max(1, p - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  className="h-10 w-14 rounded-none border-x border-neutral-200 text-center text-[13px]"
                  value={qty}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setQty(Number.isFinite(next) && next > 0 ? next : 1);
                  }}
                />

                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-none px-3"
                  onClick={() => setQty((p) => p + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button className="h-10 rounded-sm bg-neutral-900 px-6 text-[13px] font-medium tracking-wide hover:bg-neutral-800">
                Add to Cart
              </Button>
            </div>

            <Button
              variant="outline"
              className="mt-8 h-10 rounded-sm border-neutral-200 px-5 text-[13px] tracking-wide text-neutral-900 hover:border-neutral-400"
            >
              Leave a review
            </Button>

            <blockquote className="mt-10 border-l border-neutral-200 pl-6 text-[18px] leading-7 text-neutral-900">
              “Today, the term ‘sustainability’ concerns not only the environmental cost of operating a home,
              but also that of building it.”
              <footer className="mt-3 text-[13px] text-neutral-500">— Philip Jodidio</footer>
            </blockquote>
          </section>
        </div>
      </div>

      {/* collapsibles */}
      <section className="border-t border-neutral-200">
        <Collapsible open={readMoreOpen} onOpenChange={setReadMoreOpen}>
          <CollapsibleTrigger className="mx-auto flex w-full max-w-[1240px] items-center justify-center gap-3 px-6 py-6 text-[13px] font-medium tracking-widest text-neutral-900">
            <span className="uppercase">Read more</span>
            <span className="text-neutral-500">{readMoreOpen ? "—" : "+"}</span>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-6 pb-10 lg:grid-cols-2">
              <div className="space-y-4 text-[15px] leading-7 text-neutral-800">
                <h2 className="font-serif text-[26px] leading-tight">The Future of Housing</h2>
                <p className="text-neutral-600">
                  The latest trends in green residential architecture from around the world.
                </p>
                <p>
                  Travel across continents and climates to experience architecture that&apos;s rewriting
                  sustainability rules.
                </p>
              </div>

              <div className="space-y-5 text-[15px] leading-7 text-neutral-800">
                <div>
                  <h3 className="font-semibold">The author</h3>
                  <p className="mt-2 text-neutral-700">
                    <strong>Philip Jodidio</strong> studied art history and economics at Harvard and edited
                    Connaissance des Arts for over 20 years.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Product details</h3>
                  <p className="mt-2 text-neutral-700">Hardcover, 24.6 × 37.2 cm, 496 pages</p>
                  <p className="text-neutral-700">ISBN 978-3-8365-9689-3</p>
                  <Link href="#" className="mt-2 inline-block text-neutral-900 underline underline-offset-4">
                    Download product images here
                  </Link>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={reviewsOpen} onOpenChange={setReviewsOpen} className="border-t border-neutral-200">
          <CollapsibleTrigger className="mx-auto flex w-full max-w-[1240px] items-center justify-center gap-3 px-6 py-6 text-[13px] font-medium tracking-widest text-neutral-900">
            <span className="uppercase">Customer reviews</span>
            <span className="text-neutral-500">{reviewsOpen ? "—" : "+"}</span>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="mx-auto max-w-[1240px] px-6 pb-10">
              <div className="space-y-3">
                <p className="font-serif text-[22px]">0 Ratings</p>
                <p className="text-[14px] text-neutral-600">
                  No reviews have been posted for this item yet. Be the first to rate this product.
                </p>
                <Button variant="outline" className="h-10 rounded-sm border-neutral-200 px-6 text-[13px]">
                  Submit a review
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* related */}
      <section className="border-t border-neutral-200 py-14">
        <div className="mx-auto max-w-[1540px] px-6">
          <h2 className="mb-12 text-center font-serif text-[32px] leading-none">
            You may also like
          </h2>

          <div className="grid gap-x-14 gap-y-16 sm:grid-cols-2 xl:grid-cols-4 place-items-start">
            {relatedTitles.map((book) => (
              <BookCard
                key={`${book.title}-${book.subtitle}`}
                title={book.title}
                subtitle={book.subtitle}
                price={book.price}
                imageUrl={book.imageUrl}
                badge="NEW"         // hoặc XL/XXL/ADULTS ONLY
                variant="compact"
                href="/detail/related-book"
              // bỏ mx-auto để grid tự canh đều
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}