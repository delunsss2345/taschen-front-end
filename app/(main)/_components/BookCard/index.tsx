'use client'

import { useAddToCartMutation } from "@/features/cart";
import { useGuestCartStore } from "@/features/cart/store/guest-cart.store";
import { useAuthStore } from "@/features/auth";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type BookCardVariant = "default" | "compact";

type BookCardProps = {
    bookId?: number;
    title: string;
    author: string;
    price: number;
    stockQuantity?: number;
    categories?: string[];
    imageUrl?: string;
    href?: string;
    variant?: BookCardVariant;
    className?: string;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const S: Record<BookCardVariant, { title: string; author: string }> = {
    default: { title: "text-[18px]", author: "text-[14px]" },
    compact: { title: "text-[15px]", author: "text-[13px]" },
};

const CATEGORY_COLORS = [
    { bg: "bg-rose-100", text: "text-rose-700" },
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-emerald-100", text: "text-emerald-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-cyan-100", text: "text-cyan-700" },
    { bg: "bg-orange-100", text: "text-orange-700" },
    { bg: "bg-pink-100", text: "text-pink-700" },
    { bg: "bg-teal-100", text: "text-teal-700" },
    { bg: "bg-indigo-100", text: "text-indigo-700" },
];

function getCategoryColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
    return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

export default function BookCard({
    bookId,
    title,
    author,
    price,
    stockQuantity,
    categories,
    imageUrl,
    href,
    variant = "default",
    className,
}: BookCardProps) {
    const router = useRouter();
    const currentUser = useAuthStore((s) => s.currentUser);
    const addToCartMutation = useAddToCartMutation();
    const guestCart = useGuestCartStore();

    const style = S[variant];
    const outOfStock = stockQuantity !== undefined && stockQuantity === 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!bookId) return;

        if (!currentUser?.id) {
            guestCart.addItem({
                bookId,
                quantity: 1,
                bookTitle: title,
                coverImage: imageUrl,
                imageUrl,
                unitPrice: price,
            });
            toast.success("Đã thêm vào giỏ hàng");
            return;
        }
        if (currentUser.roles.includes("GUEST")) {
            toast.error("Tài khoản GUEST không được phép thêm vào giỏ hàng");
            return;
        }

        try {
            await addToCartMutation.mutateAsync({
                userId: currentUser.id,
                payload: { bookId, quantity: 1 },
            });
            toast.success("Đã thêm vào giỏ hàng");
        } catch {
            toast.error("Không thể thêm vào giỏ hàng");
        }
    };

    const inner = (
        <article className={cn("group/card flex flex-col h-full bg-white transition-all duration-300", className)}>
            {/* Image */}
            <figure className={cn(
                "relative w-full aspect-2/3 overflow-hidden rounded-md bg-neutral-50 shrink-0",
                "transition-all duration-500 group-hover/card:shadow-lg group-hover/card:shadow-neutral-200/60"
            )}>
                {imageUrl ? (
                    <img
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                        src={imageUrl}
                        alt={`${title} cover`}
                        loading="lazy"
                        draggable={false}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                        No image
                    </div>
                )}

                {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <span className="rounded-full bg-neutral-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                            Hết hàng
                        </span>
                    </div>
                )}
            </figure>

            {/* Info */}
            <div className="flex flex-col grow mt-3 gap-2">
                <h3 className={cn("font-serif font-semibold leading-tight text-neutral-900 line-clamp-2", style.title)}>
                    {title}
                </h3>

                <p className={cn("italic text-neutral-400 line-clamp-1", style.author)}>
                    {author}
                </p>

                {categories && categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {categories.slice(0, 3).map((cat) => {
                            const color = getCategoryColor(cat);
                            return (
                                <span
                                    key={cat}
                                    className={cn(
                                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                        color.bg, color.text
                                    )}
                                >
                                    {cat}
                                </span>
                            );
                        })}
                    </div>
                )}

                <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
                        {formatPrice(price)}
                    </span>
                    {stockQuantity !== undefined && !outOfStock && (
                        <span className="text-[11px] text-neutral-400">
                            Còn {stockQuantity}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    disabled={outOfStock || addToCartMutation.isPending}
                    onClick={handleAddToCart}
                    className={cn(
                        "w-full py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm",
                        "border border-zinc-900 bg-transparent text-zinc-900",
                        "transition-colors duration-200 cursor-pointer",
                        "hover:bg-zinc-900 hover:text-white",
                        "disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-400"
                    )}
                >
                    {outOfStock
                        ? "Hết hàng"
                        : addToCartMutation.isPending
                        ? "Đang thêm..."
                        : "Thêm vào giỏ hàng"}
                </button>
            </div>
        </article>
    );

    if (!href) return <div className="h-full">{inner}</div>;

    return (
        <div
            onClick={() => router.push(href)}
            className="group block h-full cursor-pointer"
            aria-label={`${title} — ${author}`}
        >
            {inner}
        </div>
    );
}
