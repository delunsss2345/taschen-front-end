"use client";

import Link from "next/link";

import BookCard from "@/app/(main)/_components/BookCard";
import { Button } from "@/components/ui/button";

const WishlistPage = () => {
    return (
        <div className="mx-auto w-full max-w-[var(--container-main)] px-6 py-8">
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight">Your Wishlist</h1>
                <Button variant="outline" className="h-10 rounded-sm px-4 text-base">
                    Add all to cart
                </Button>
            </div>

            <p className="mt-4 text-base">
                To permanently save your wishlist please{" "}
                <Link href="/login" className="underline underline-offset-4">
                    log in
                </Link>{" "}
                or{" "}
                <Link href="/register" className="underline underline-offset-4">
                    register
                </Link>
                .
            </p>

            <div className="mt-10 grid grid-cols-4">
                <BookCard
                    title="Homes for Our Time."
                    subtitle="Sustainable Living"
                    price={80}
                    imageUrl="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80"
                    href="/detail/homes-for-our-time-sustainable-living"
                />
            </div>
        </div>
    );
};

export default WishlistPage;