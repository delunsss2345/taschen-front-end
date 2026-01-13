import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import FooterCol from "./FooterCol";

const connectLinks = [
  { label: "Affiliate Program", href: "#" },
  { label: "Corporate Contacts", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Newsletter", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "Youtube", href: "#" },
];

const companyLinks = [
  { label: "Accessibility", href: "#" },
  { label: "Careers", href: "#" },
  { label: "General Terms and Conditions", href: "#" },
  { label: "Glossary", href: "#" },
  { label: "Imprint", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Project Proposals", href: "#" },
];

const customerLinks = [
  { label: "Chat", href: "#" },
  { label: "Customer Service", href: "#" },
  { label: "Shipping & Returns", href: "#" },
  { label: "Track Your Order", href: "#" },
  { label: "Become a TASCHEN Reseller", href: "#" },
  { label: "Corporate Deals", href: "#" },
  { label: "B2B Shop Access", href: "#" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-white">
      <div className="mx-auto w-full max-w-[var(--container-main)] px-6">
        <div className="py-10">
          <h2 className="text-2xl font-extrabold tracking-tight">
            TASCHEN. Books for Optimists Since 1980
          </h2>
          <p className="mt-4 max-w-[var(--width-md)] text-sm leading-6 text-zinc-700">
            TASCHEN is the world’s leading art-book publisher, headquartered in
            Cologne with teams in Berlin, Brussels, Hong Kong, London, Los
            Angeles, Madrid, Miami, Milan, New York, Paris and Tokyo. For more
            than 40 years, we have been on a mission to publish innovative
            illustrated books on art, architecture, design, fashion, film,
            lifestyle, travel, photography and pop culture and to bring them to
            the world. We aspire to be inclusive, independent, inspirational.
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-12 gap-y-10 py-10">
          <FooterCol title="Connect" links={connectLinks} />
          <FooterCol title="Company" links={companyLinks} />
          <FooterCol title="Customer Information" links={customerLinks} />

          <div className="col-span-12 md:col-span-3 md:pl-2">
            <div className="text-sm font-semibold text-zinc-900">
              Sign up for our newsletter:
            </div>

            <form
              className="mt-4 flex max-w-sm flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                className="h-10 rounded-sm"
                placeholder="Your e-mail-address"
                type="email"
              />
              <Button
                type="submit"
                variant="outline"
                className="h-10 w-fit rounded-sm px-6"
              >
                Submit
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
            © {new Date().getFullYear()} – TASCHEN GmbH, Hohenzollernring 53,
            D–50672 Cologne
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
