"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import useTranslator from "@/hooks/use-translator";

const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});



const CartSheet = () => {
    const { t } = useTranslator();
    const [qty, setQty] = React.useState(1);

    const price = 1000;
    const subtotal = price * qty;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-sm px-2 hover:bg-muted"
                    aria-label={t("header.aria.cart")}
                >
                    <ShoppingBag className="h-5 w-5" />
                    <span className="text-sm">1</span>
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-1/3 min-w-[420px] max-w-[720px] p-0"
            >
                <div className="flex h-full flex-col">
                    <SheetHeader className="border-b px-6 py-5 sm:px-8">
                        <SheetTitle className="text-base font-semibold sm:text-sm">
                            Your Shopping Cart
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
                        <div className="flex gap-3 sm:gap-4">
                            {/* Thumbnail 70x106 */}
                            <div className="h-[106px] w-[70px] shrink-0 overflow-hidden rounded-sm border bg-muted/30" />

                            <div className="flex-1 space-y-2">
                                <div>
                                    <p className="text-sm font-medium sm:text-base">
                                        Sophia by Eisenstaedt
                                    </p>
                                    <p className="mt-1 text-base font-semibold sm:text-lg">
                                        {currency.format(price)}
                                    </p>
                                </div>

                                <p className="text-xs sm:text-sm">Edition: English</p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-sm"
                                        onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>

                                    <div className="min-w-[52px] border px-3 py-1.5 text-center text-xs sm:text-sm">
                                        {qty}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-sm"
                                        onClick={() => setQty((prev) => prev + 1)}
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <p className="text-xs sm:text-sm">Availability: In Stock</p>

                                <button
                                    type="button"
                                    className="text-left text-xs underline underline-offset-4 sm:text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <Separator className="my-5" />
                    </div>

                    <div className="border-t px-6 py-5 sm:px-8">
                        <div className="mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm sm:text-base">
                            <p>Subtotal</p>
                            <p>1 Item</p>
                            <p className="justify-self-end text-xl font-semibold sm:text-2xl">
                                {currency.format(subtotal)}
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="h-10 rounded-sm px-6 text-sm sm:text-base"
                        >
                            <Link href="/cart">Go to Shopping Cart</Link>
                        </Button>
                    </div>
                </div>
            </SheetContent>

        </Sheet>
    );
};

export default CartSheet;