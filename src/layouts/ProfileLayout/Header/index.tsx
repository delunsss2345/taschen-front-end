import { ChevronDown, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full">
      <div className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold tracking-wide">
              TASCHEN
            </Link>

            <Link to="/account/orders">Order History</Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/account/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account/orders">Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/logout">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 px-2 text-sm text-foreground"
              >
                <span>Germany</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Germany</DropdownMenuItem>
              <DropdownMenuItem>France</DropdownMenuItem>
              <DropdownMenuItem>United States</DropdownMenuItem>
              <DropdownMenuItem>United Kingdom</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-5" />

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link
              to="/refund-policy"
              className="text-foreground hover:underline"
            >
              Refund policy
            </Link>
            <Link to="/shipping" className="text-foreground hover:underline">
              Shipping
            </Link>
            <Link
              to="/privacy-policy"
              className="text-foreground hover:underline"
            >
              Privacy policy
            </Link>
            <Link
              to="/legal-notice"
              className="text-foreground hover:underline"
            >
              Legal notice
            </Link>
            <Link
              to="/cancellations"
              className="text-foreground hover:underline"
            >
              Cancellations
            </Link>
            <Link to="/contact" className="text-foreground hover:underline">
              Contact information
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
