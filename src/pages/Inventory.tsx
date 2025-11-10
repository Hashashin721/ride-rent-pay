import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, StockMovement, Supplier } from "@/types/inventory";
import { initialProducts, initialSuppliers } from "@/data/inventory";
import { Plus, Search, AlertTriangle, TrendingUp, TrendingDown, Edit, History } from "lucide-react";
import { toast } from "sonner";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    const savedSuppliers = localStorage.getItem("suppliers");
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem("products", JSON.stringify(initialProducts));
    }
    
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
    } else {
      setSuppliers(initialSuppliers);
      localStorage.setItem("suppliers", JSON.stringify(initialSuppliers));
    }
  }, []);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(p => p.quantity <= p.minStockLevel);

  const handleSaveProduct = (formData: FormData) => {
    const newProduct: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get("name") as string,
      barcode: formData.get("barcode") as string,
      sku: formData.get("sku") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      quantity: Number(formData.get("quantity")),
      minStockLevel: Number(formData.get("minStockLevel")),
      unitPrice: Number(formData.get("unitPrice")),
      supplierId: formData.get("supplierId") as string,
      lastRestocked: new Date().toISOString(),
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
      toast.success("Product updated successfully");
    } else {
      updatedProducts = [...products, newProduct];
      toast.success("Product added successfully");
    }

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setIsAddDialogOpen(false);
    setEditingProduct(null);
  };

  const handleStockAdjustment = (productId: string, adjustment: number, reason: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const previousQuantity = product.quantity;
    const newQuantity = previousQuantity + adjustment;

    const movement: StockMovement = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      type: adjustment > 0 ? "in" : adjustment < 0 ? "out" : "adjustment",
      quantity: Math.abs(adjustment),
      previousQuantity,
      newQuantity,
      reason,
      date: new Date().toISOString(),
    };

    const savedMovements = JSON.parse(localStorage.getItem("stockMovements") || "[]");
    localStorage.setItem("stockMovements", JSON.stringify([...savedMovements, movement]));

    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, quantity: newQuantity, lastRestocked: new Date().toISOString() } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    
    toast.success(`Stock ${adjustment > 0 ? 'increased' : 'decreased'} by ${Math.abs(adjustment)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Stock Management</h1>
            <p className="text-muted-foreground">Track and manage your inventory</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent" onClick={() => setEditingProduct(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" defaultValue={editingProduct?.name} required />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" name="sku" defaultValue={editingProduct?.sku} required />
                  </div>
                  <div>
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input id="barcode" name="barcode" defaultValue={editingProduct?.barcode} required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" defaultValue={editingProduct?.category} required />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" name="quantity" type="number" defaultValue={editingProduct?.quantity} required />
                  </div>
                  <div>
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <Input id="minStockLevel" name="minStockLevel" type="number" defaultValue={editingProduct?.minStockLevel} required />
                  </div>
                  <div>
                    <Label htmlFor="unitPrice">Unit Price ($)</Label>
                    <Input id="unitPrice" name="unitPrice" type="number" step="0.01" defaultValue={editingProduct?.unitPrice} required />
                  </div>
                  <div>
                    <Label htmlFor="supplierId">Supplier</Label>
                    <Select name="supplierId" defaultValue={editingProduct?.supplierId} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingProduct?.description} rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent">
                    {editingProduct ? "Update" : "Add"} Product
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {lowStockProducts.length > 0 && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold text-destructive">Low Stock Alert</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} below minimum stock level
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredProducts.map(product => {
            const supplier = suppliers.find(s => s.id === product.supplierId);
            const isLowStock = product.quantity <= product.minStockLevel;
            
            return (
              <Card key={product.id} className={`hover:shadow-hover transition-shadow ${isLowStock ? 'border-destructive/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku} • Barcode: {product.barcode}</p>
                        </div>
                        <Badge variant={isLowStock ? "destructive" : "secondary"}>
                          {product.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Supplier</p>
                          <p className="font-medium">{supplier?.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Unit Price</p>
                          <p className="font-medium text-primary">${product.unitPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Stock</p>
                          <p className={`font-bold text-lg ${isLowStock ? 'text-destructive' : 'text-foreground'}`}>
                            {product.quantity}
                            {isLowStock && <AlertTriangle className="inline h-4 w-4 ml-1" />}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Min Level</p>
                          <p className="font-medium">{product.minStockLevel}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adjust Stock - {product.name}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const adjustment = Number(formData.get("adjustment"));
                            const reason = formData.get("reason") as string;
                            handleStockAdjustment(product.id, adjustment, reason);
                            e.currentTarget.reset();
                          }} className="space-y-4">
                            <div>
                              <Label htmlFor="adjustment">Quantity Adjustment</Label>
                              <Input
                                id="adjustment"
                                name="adjustment"
                                type="number"
                                placeholder="Enter positive or negative number"
                                required
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Current stock: {product.quantity}
                              </p>
                            </div>
                            <div>
                              <Label htmlFor="reason">Reason</Label>
                              <Textarea
                                id="reason"
                                name="reason"
                                placeholder="E.g., Restock from supplier, Damaged items, etc."
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full" variant="accent">
                              Update Stock
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
