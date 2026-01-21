import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Card() {
  return (
    <section className="w-full max-w-md bg-background text-foreground">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Your Shopping Cart</h2>

        <div className="mt-4 flex gap-4">
          <div className="relative h-16 w-16 overflow-hidden border"></div>

          <div className="flex-1">
            <p className="text-sm leading-5">
              David Bailey, Eighties. Art Edition No. 101–200, ‘Jerry Hall and
              Jacques Henri Lartigue’, 1983
            </p>

            <p className="mt-2 text-sm font-semibold">US$ 3,000</p>

            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Edition:</span> English
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-none"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="flex h-8 w-12 items-center justify-center border text-sm">
                1
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Availability: In Stock
            </p>

            <button className="mt-3 text-sm underline underline-offset-4">
              Remove
            </button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-muted-foreground">1 item</span>
          <span className="text-base font-semibold">US$ 3,000</span>
        </div>

        <Button variant="outline" className="mt-4 w-fit rounded-none">
          Go to Shopping Cart
        </Button>
      </div>
    </section>
  );
}
