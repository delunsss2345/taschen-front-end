import { cn } from "@/lib/utils";
import Link from "next/link";

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
};

const formatPrice = (price: number, currency: string) => `${currency} ${price}`;

const S: Record<
    BookCardVariant,
    {
        wrap: string;
        figure: string;
        img: string;
        badgeWrap: string;
        badge: string;
        title: string;
        subtitle: string;
        price: string;
    }
> = {
    default: {
        wrap: "w-full ",
        figure: "mx-auto w-full h-[360px]",
        img: "h-full w-full object-contain",
        badgeWrap: "mt-6",
        badge: "inline-flex items-center justify-center rounded-sm border border-neutral-300 text-[1.2rem] tracking-widest text-neutral-700",
        title: "mt-5 font-serif text-[2.2rem] leading-[1.15] tracking-tight text-neutral-900",
        subtitle: "mt-1 text-[2rem] leading-[1.15] tracking-tight text-neutral-700",
        price: "mt-6 text-[1.5rem] font-semibold tracking-widest text-neutral-600",
    },
    compact: {
        wrap: "w-full ",
        figure: "mx-auto w-full h-[300px]",
        img: "h-full w-full object-contain",
        badgeWrap: "mt-5",
        badge: "inline-flex items-center justify-center rounded-sm border border-neutral-300 text-[1.1rem] tracking-widest text-neutral-700",
        title: "mt-4 font-serif text-[1.8rem] leading-[1.15] tracking-tight text-neutral-900",
        subtitle: "mt-1 text-[1.7rem] leading-[1.15] tracking-tight text-neutral-700",
        price: "mt-5 text-[1.4rem] font-semibold tracking-widest text-neutral-600",
    },
};

function CardInner({
    title,
    subtitle,
    price,
    currency,
    badge,
    imageUrl,
    variant,
    className,
}: Required<
    Pick<BookCardProps, "title" | "subtitle" | "price" | "currency" | "variant">
> &
    Pick<BookCardProps, "badge" | "imageUrl" | "className">) {
    const s = S[variant];

    return (
        <article
            className={cn(
                "text-center bg-transparent",
                "select-none",
                s.wrap,
                className
            )}
        >
            {/* IMAGE */}
            <figure
                className={cn(
                    "relative",
                    "mx-auto",
                    s.figure
                )}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${title} cover`}
                        className={cn(s.img)}
                        loading="lazy"
                        draggable={false}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                        No image
                    </div>
                )}
            </figure>

            {/* BADGE */}
            <div className={s.badgeWrap}>
                {badge ? <span className={s.badge}>{badge}</span> : <span className="inline-block h-[28px]" />}
            </div>

            <div className="mx-auto mt-2 max-w-[26ch]">
                <h3 className={s.title}>
                    <strong className="font-semibold">{title}</strong>
                </h3>
                <p className={s.subtitle}>{subtitle}</p>
            </div>

            <p className={s.price}>{formatPrice(price, currency)}</p>
        </article>
    );
}

export default function BookCard({
    title,
    subtitle,
    price,
    currency = "US$",
    badge,
    imageUrl,
    href,
    variant = "default",
    className,
}: BookCardProps) {
    const inner = (
        <CardInner
            title={title}
            subtitle={subtitle}
            price={price}
            currency={currency}
            badge={badge}
            imageUrl={imageUrl}
            variant={variant}
            className={className}
        />
    );

    if (!href) return inner;

    return (
        <Link
            href={href}
            className={cn(
                "group block",
                "transition-transform duration-200 ease-out",
                "hover:-translate-y-[2px]"
            )}
            aria-label={`${title} ${subtitle}`}
        >
            {inner}
        </Link>
    );
}