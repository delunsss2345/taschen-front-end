import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as React from "react";

const BookDetail = () => {
  const book = {
    title: "Los Angeles. Portrait of a City",
    price: 70,
    currency: "US$",
    category: ["Home", "Books", "Photography"],
    coverAlt: "Los Angeles. Portrait of a City book cover",
    coverIndexText: "1 / 9",
    editionLabel: "XL",
    seriesTitle: "Portrait of a City",
    editionNote: "Edition: Multilingual (English, French, German)",
    availability: "Availability: In Stock",
    description:
      "Explore the City of Angels from beaches to barrios, from tiny frontier town to glittering urban metropolis and entertainment capital of the world. This suitably sun-drenched tribute to Los Angeles packs page after page with stunning photographs to capture the life and reinventions of L.A. from the 1880s to the present day.",
    specs: "Hardcover, 25 × 34 cm, 4.22 kg, 572 pages",
    rating: 4.8,
    ratingCount: 7,
    quote: "A photographic celebration of L.A.",
    quoteSource: "Los Angeles Times",
    editions: [
      { id: "berlin", label: "Berlin" },
      { id: "newyork", label: "New York" },
      { id: "sanfrancisco", label: "San Francisco" },
      { id: "paris", label: "Paris" },
      { id: "london", label: "London" },
    ],
  };

  const [qty, setQty] = React.useState<number>(1);
  const [selectedEdition, setSelectedEdition] = React.useState(
    book.editions[0]?.id ?? ""
  );

  const crumbs = [...book.category, book.title];

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[var(--container-main)] px-6 py-6">
        <nav className="text-sm text-muted-foreground">
          {crumbs.map((c, idx) => (
            <span key={`${c}-${idx}`}>
              {idx > 0 && <span className="mx-2">/</span>}
              <span
                className={idx === crumbs.length - 1 ? "text-foreground" : ""}
              >
                {c}
              </span>
            </span>
          ))}
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left: Cover */}
          <div className="lg:col-span-7">
            <Card className="relative overflow-hidden border shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-11">
                  <div className="relative aspect-[4/3] w-full ">
                    {/* <img
                      src="https://images.unsplash.com/photo-1520694478161-2c3b1a8bfa6f?auto=format&fit=crop&w=1600&q=80"
                      alt={book.coverAlt}
                      className="h-full w-full object-cover"
                    /> */}
                    <div className="pointer-events-none absolute inset-0  to-black/30" />
                  </div>
                </div>

                <div className="hidden lg:col-span-1 lg:flex lg:items-center lg:justify-center">
                  <button
                    type="button"
                    aria-label="Next image"
                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-muted-foreground shadow-sm transition hover:text-foreground"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="py-3 text-center text-sm text-muted-foreground">
                {book.coverIndexText}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 items-center justify-center rounded-md border bg-white px-3 text-sm font-medium">
                  {book.editionLabel}
                </span>
                <div>
                  <h1 className="text-3xl font-semibold leading-tight">
                    {book.title}
                  </h1>
                  <div className="mt-3 text-xl font-semibold">
                    {book.currency} {book.price}
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label="Add to wishlist"
                className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white text-muted-foreground shadow-sm transition hover:text-foreground"
              >
                ♡
              </button>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium text-muted-foreground">
                {book.seriesTitle}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex gap-2">
                  {book.editions.map((ed) => {
                    const active = ed.id === selectedEdition;
                    return (
                      <button
                        key={ed.id}
                        type="button"
                        onClick={() => setSelectedEdition(ed.id)}
                        className={[
                          "h-14 w-14 overflow-hidden rounded-md border bg-muted/60 transition",
                          active
                            ? "border-foreground/40 ring-1 ring-foreground/20"
                            : "hover:border-foreground/20",
                        ].join(" ")}
                        title={ed.label}
                      >
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-muted-foreground">
                          {ed.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="inline-flex items-center rounded-md border bg-white">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 rounded-none px-3"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    -
                  </Button>
                  <Input
                    value={qty}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      setQty(Number.isFinite(n) && n > 0 ? n : 1);
                    }}
                    className="h-10 w-16 rounded-none border-x text-center"
                    inputMode="numeric"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 rounded-none px-3"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </Button>
                </div>

                <Button className="h-10 rounded-md px-6">Add to Cart</Button>
              </div>

              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <div>{book.editionNote}</div>
                <div>{book.availability}</div>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-sm leading-6 text-foreground/90">
                  {book.description}
                </p>
                <p className="text-sm text-muted-foreground">{book.specs}</p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-foreground">
                    <span aria-hidden>★</span>
                    <span aria-hidden>★</span>
                    <span aria-hidden>★</span>
                    <span aria-hidden>★</span>
                    <span aria-hidden>★</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {book.ratingCount} Ratings
                    <span className="mx-2">·</span>
                    <button
                      type="button"
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      View Ratings and Reviews
                    </button>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="font-medium">“{book.quote}”</div>
                  <div className="mt-1 text-muted-foreground">
                    — {book.quoteSource}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center lg:hidden">
          <button
            type="button"
            aria-label="Next image"
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-muted-foreground shadow-sm transition hover:text-foreground"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
