import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-10 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            to="/refund-policy"
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            Refund policy
          </Link>
          <Link
            to="/shipping"
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            Shipping
          </Link>
          <Link
            to="/privacy-policy"
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            Privacy policy
          </Link>
          <Link
            to="/legal-notice"
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            Legal notice
          </Link>
          <Link
            to="/cancellations"
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            Cancellations
          </Link>
          <Link
            to="/contact"
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            Contact information
          </Link>
        </div>

        <Separator className="my-6" />

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} TASCHEN
        </p>
      </div>
    </footer>
  );
}
