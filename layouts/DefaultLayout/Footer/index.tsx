import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useTranslator from "@/hooks/use-translator";
import FooterCol from "./FooterCol";

const Footer = () => {
  const { t } = useTranslator();
  const connectLinks = [
    "affiliateProgram",
    "corporateContacts",
    "facebook",
    "instagram",
    "newsletter",
    "tiktok",
    "youtube",
  ].map((key) => ({
    label: t(`footer.links.connect.${key}`),
    href: "#",
  }));

  const companyLinks = [
    "accessibility",
    "careers",
    "terms",
    "glossary",
    "imprint",
    "privacy",
    "projectProposals",
  ].map((key) => ({
    label: t(`footer.links.company.${key}`),
    href: "#",
  }));

  const customerLinks = [
    "chat",
    "customerService",
    "shippingReturns",
    "trackOrder",
    "becomeReseller",
    "corporateDeals",
    "b2bAccess",
  ].map((key) => ({
    label: t(`footer.links.customer.${key}`),
    href: "#",
  }));

  return (
    <footer className="w-full bg-white">
      <div className="mx-auto w-full max-w-[var(--container-main)] px-6">
        <div className="py-10">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {t("footer.tagline")}
          </h2>
          <p className="mt-4 max-w-[var(--width-md)] text-sm leading-6 text-zinc-700">
            {t("footer.description")}
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-12 gap-y-10 py-10">
          <FooterCol title={t("footer.connectTitle")} links={connectLinks} />
          <FooterCol title={t("footer.companyTitle")} links={companyLinks} />
          <FooterCol title={t("footer.customerTitle")} links={customerLinks} />

          <div className="col-span-12 md:col-span-3 md:pl-2">
            <div className="text-sm font-semibold text-zinc-900">
              {t("footer.newsletterTitle")}
            </div>

            <form
              className="mt-4 flex max-w-sm flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                className="h-10 rounded-sm"
                placeholder={t("footer.emailPlaceholder")}
                type="email"
              />
              <Button
                type="submit"
                variant="outline"
                className="h-10 w-fit rounded-sm px-6"
              >
                {t("footer.submit")}
              </Button>
            </form>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
          <div className="text-lg font-extrabold tracking-wide text-zinc-900">
            TASCHEN
          </div>
          <div className="text-xs text-zinc-700">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
