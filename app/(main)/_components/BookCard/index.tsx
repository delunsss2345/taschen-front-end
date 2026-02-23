import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type BookCardVariant = "default" | "compact";

type BookCardProps = {
    title: string;
    subtitle: string;
    price: number;
    currency?: string;
    badge?: string;
    imageUrl?: string;
    href?: string;
    variant?: BookCardVariant;
    className?: string;
    bookVariantId: number;
};

const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: currency === 'US$' ? 'USD' : 'VND' }).format(price);

const S: Record<BookCardVariant, { figure: string; title: string; subtitle: string }> = {
    default: {
        figure: "h-[380px]",
        title: "text-[22px]",
        subtitle: "text-[18px]",
    },
    compact: {
        figure: "h-[280px]",
        title: "text-[18px]",
        subtitle: "text-[16px]",
    },
};

function CardInner({
    title,
    subtitle,
    price,
    currency = "US$",
    badge,
    imageUrl,
    variant = "default",
    className,
    bookVariantId
}: BookCardProps) {
    const style = S[variant];
    return (
        <article className={cn("group/card flex flex-col h-full bg-white p-2 transition-all duration-300", className)}>
            {/* Container Ảnh: Thêm shadow nhẹ và hiệu ứng zoom */}
            <figure className={cn(
                "relative overflow-hidden rounded-md bg-neutral-50 transition-all duration-500",
                "group-hover/card:shadow-xl group-hover/card:shadow-neutral-200/50",
                style.figure
            )}>
                {imageUrl ? (
                    <img
                        className="h-full w-full object-contain p-4 transition-transform duration-700 ease-out group-hover/card:scale-110"
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

                {/* Badge: Bo góc và chỉnh lại vị trí cho sang hơn */}
                {badge && (
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900 shadow-sm border border-neutral-100 rounded-full">
                            {badge}
                        </span>
                    </div>
                )}
            </figure>

            {/* Thông tin Text: Căn chỉnh lại khoảng cách */}
            <div className="flex flex-col flex-grow mt-6 px-2 text-center">
                <h3 className={cn("font-serif leading-tight text-neutral-900 line-clamp-2", style.title)}>
                    <strong className="font-semibold tracking-tight">{title}</strong>
                </h3>
                <p className={cn("mt-2 leading-relaxed text-neutral-500 line-clamp-1 italic", style.subtitle)}>
                    {subtitle}
                </p>

                <p className="mt-4 text-[18px] font-medium tracking-tighter text-neutral-900">
                    {formatPrice(price, currency)}
                </p>
            </div>

            <div className="mt-6 overflow-hidden">
                <button
                    type="button"
                    onClick={(e) => {

                    }}
                    className={cn(
                        "w-full py-3 px-6 text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-300",
                        "border border-neutral-900 bg-transparent text-neutral-900",
                        "hover:bg-neutral-900 hover:text-white",
                        "translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100"
                    )}
                >
                    Add to Cart
                </button>
            </div>
        </article>
    );
}

export default function BookCard(props: BookCardProps) {
    const router = useRouter();
    const { href, title, subtitle } = props;

    const inner = <CardInner {...props} />;

    if (!href) return <div className="h-full">{inner}</div>;

    return (
        <div
            onClick={() => setTimeout(() => router.push(href), 700)}
            className={cn(
                "group block h-full cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                "hover:-translate-y-2"
            )}
            aria-label={`${title} ${subtitle}`}
        >
            {inner}
        </div>
    );
}