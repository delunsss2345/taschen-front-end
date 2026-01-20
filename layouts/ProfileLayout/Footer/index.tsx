import { Link } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import useTranslator from "@/hooks/use-translator";

export function Footer() {
  const { t } = useTranslator();
  const policyLinks = [
    { to: "/refund-policy", key: "refundPolicy" },
    { to: "/shipping", key: "shipping" },
    { to: "/privacy-policy", key: "privacyPolicy" },
    { to: "/legal-notice", key: "legalNotice" },
    { to: "/cancellations", key: "cancellations" },
    { to: "/contact", key: "contactInformation" },
  ];

  return (
    <footer className="mt-10 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {policyLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
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
