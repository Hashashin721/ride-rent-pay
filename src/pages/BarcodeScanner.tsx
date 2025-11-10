import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/inventory";
import { ScanBarcode, Search, Camera, X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";

const BarcodeScanner = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [manualBarcode, setManualBarcode] = useState("");
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  const searchByBarcode = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setFoundProduct(product);
      toast.success("Product found!");
    } else {
      setFoundProduct(null);
      toast.error("Product not found");
    }
  };

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");
      setScanner(html5QrCode);
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          searchByBarcode(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Ignore scanning errors
        }
      );
      
      setIsScanning(true);
      toast.success("Scanner started - point camera at barcode");
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast.error("Failed to start camera. Please check permissions.");
    }
  };

  const stopScanning = async () => {
    if (scanner) {
      try {
        await scanner.stop();
        setScanner(null);
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      searchByBarcode(manualBarcode.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Barcode Scanner</h1>
            <p className="text-muted-foreground">Scan or enter barcodes to find products</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Camera Scanner</h3>
                  {!isScanning ? (
                    <Button onClick={startScanning} variant="accent" className="w-full" size="lg">
                      <Camera className="h-5 w-5 mr-2" />
                      Start Camera Scanner
                    </Button>
                  ) : (
                    <Button onClick={stopScanning} variant="destructive" className="w-full" size="lg">
                      <X className="h-5 w-5 mr-2" />
                      Stop Scanner
                    </Button>
                  )}
                  
                  <div 
                    id="reader" 
                    className={`mt-4 rounded-lg overflow-hidden ${isScanning ? 'block' : 'hidden'}`}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Manual Entry</h3>
                  <form onSubmit={handleManualSearch} className="flex gap-2">
                    <Input
                      placeholder="Enter barcode number..."
                      value={manualBarcode}
                      onChange={(e) => setManualBarcode(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" variant="default">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {foundProduct && (
            <Card className="border-primary shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <ScanBarcode className="h-5 w-5" />
                  <h3 className="font-semibold">Product Found</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-2xl font-bold text-foreground">{foundProduct.name}</h4>
                    <p className="text-muted-foreground">{foundProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">SKU</p>
                      <p className="font-medium">{foundProduct.sku}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Barcode</p>
                      <p className="font-medium">{foundProduct.barcode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{foundProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unit Price</p>
                      <p className="font-medium text-primary">${foundProduct.unitPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Stock</p>
                      <p className={`font-bold text-lg ${foundProduct.quantity <= foundProduct.minStockLevel ? 'text-destructive' : 'text-foreground'}`}>
                        {foundProduct.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Min Stock Level</p>
                      <p className="font-medium">{foundProduct.minStockLevel}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
