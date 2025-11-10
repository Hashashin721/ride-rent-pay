import { Link } from "react-router-dom";
import { Car, History, Menu, Package, Users, FileText, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/inventory" className="cursor-pointer">
                    <Package className="h-4 w-4 mr-2" />
                    Stock Management
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/suppliers" className="cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    Suppliers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/invoices" className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    Invoices
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/scanner" className="cursor-pointer">
                    <ScanBarcode className="h-4 w-4 mr-2" />
                    Barcode Scanner
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <div className="border-t pt-4 mt-2">
                  <p className="text-xs text-muted-foreground mb-3 font-semibold">INVENTORY</p>
                  <Link to="/inventory" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2">
                    <Package className="h-5 w-5" />
                    Stock Management
                  </Link>
                  <Link to="/suppliers" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2">
                    <Users className="h-5 w-5" />
                    Suppliers
                  </Link>
                  <Link to="/invoices" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2">
                    <FileText className="h-5 w-5" />
                    Invoices
                  </Link>
                  <Link to="/scanner" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2">
                    <ScanBarcode className="h-5 w-5" />
                    Barcode Scanner
                  </Link>
                </div>
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
