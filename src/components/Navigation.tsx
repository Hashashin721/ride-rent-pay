import { Link } from "react-router-dom";
import { Car, History, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors">
            <Car className="h-6 w-6 text-primary" />
            <span>RideShare</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Browse Vehicles
            </Link>
            <Link to="/bookings" className="text-foreground hover:text-primary transition-colors font-medium">
              My Bookings
            </Link>
            <Button variant="accent" size="sm">
              Sign In
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2">
                  <Car className="h-5 w-5" />
                  Browse Vehicles
                </Link>
                <Link to="/bookings" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2">
                  <History className="h-5 w-5" />
                  My Bookings
                </Link>
                <Button variant="accent" className="w-full mt-4">
                  Sign In
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
