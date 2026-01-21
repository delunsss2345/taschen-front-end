import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import useTranslator from "@/hooks/use-translator";

export function Footer() {
  const { t } = useTranslator();
  const policyLinks = [
    { href: "/refund-policy", key: "refundPolicy" },
    { href: "/shipping", key: "shipping" },
    { href: "/privacy-policy", key: "privacyPolicy" },
    { href: "/legal-notice", key: "legalNotice" },
    { href: "/cancellations", key: "cancellations" },
    { href: "/contact", key: "contactInformation" },
  ];

  return (
    <footer className="mt-10 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {policyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              {t(`profile.links.${link.key}`)}
            </Link>
          ))}
        </div>

        <Separator className="my-6" />

        <p className="text-sm text-muted-foreground">
          {t("profile.footer.copyright", {
            year: new Date().getFullYear(),
          })}
        </p>
      </div>
    </footer>
  );
}
