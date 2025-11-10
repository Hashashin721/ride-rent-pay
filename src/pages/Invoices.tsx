import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice, InvoiceItem, Product, Supplier } from "@/types/inventory";
import { Plus, Download, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoices");
    const savedSuppliers = localStorage.getItem("suppliers");
    const savedProducts = localStorage.getItem("products");
    
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
    if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  const addInvoiceItem = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newItem: InvoiceItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.unitPrice,
      total: product.unitPrice * quantity,
    };

    setInvoiceItems([...invoiceItems, newItem]);
  };

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const createInvoice = (formData: FormData) => {
    if (invoiceItems.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const supplier = suppliers.find(s => s.id === selectedSupplier);
    if (!supplier) return;

    const { subtotal, tax, total } = calculateTotals();

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      date: formData.get("date") as string,
      dueDate: formData.get("dueDate") as string,
      items: invoiceItems,
      subtotal,
      tax,
      total,
      status: "draft",
      notes: formData.get("notes") as string || undefined,
    };

    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    
    setIsCreateDialogOpen(false);
    setInvoiceItems([]);
    setSelectedSupplier("");
    toast.success("Invoice created successfully");
  };

  const downloadInvoicePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    const supplier = suppliers.find(s => s.id === invoice.supplierId);

    // Header
    doc.setFontSize(20);
    doc.text("INVOICE", 105, 20, { align: "center" });
    
    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, 46);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 52);
    
    // Supplier details
    doc.text("Bill To:", 20, 65);
    doc.text(invoice.supplierName, 20, 71);
    if (supplier) {
      doc.text(supplier.address, 20, 77);
      doc.text(supplier.email, 20, 83);
      doc.text(supplier.phone, 20, 89);
    }

    // Items table
    autoTable(doc, {
      startY: 100,
      head: [["Item", "Quantity", "Unit Price", "Total"]],
      body: invoice.items.map(item => [
        item.productName,
        item.quantity.toString(),
        `$${item.unitPrice.toFixed(2)}`,
        `$${item.total.toFixed(2)}`,
      ]),
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 150, finalY);
    doc.text(`Tax (10%): $${invoice.tax.toFixed(2)}`, 150, finalY + 6);
    doc.setFontSize(12);
    doc.text(`Total: $${invoice.total.toFixed(2)}`, 150, finalY + 14);

    if (invoice.notes) {
      doc.setFontSize(10);
      doc.text("Notes:", 20, finalY + 20);
      doc.text(invoice.notes, 20, finalY + 26);
    }

    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
    toast.success("Invoice PDF downloaded");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-primary text-primary-foreground";
      case "sent": return "bg-secondary text-secondary-foreground";
      case "overdue": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Invoices</h1>
            <p className="text-muted-foreground">Generate and manage supplier invoices</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                createInvoice(new FormData(e.currentTarget));
              }} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier} required>
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
                  <div>
                    <Label htmlFor="date">Invoice Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Add Items</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => {
                      const [productId, quantity] = value.split(':');
                      addInvoiceItem(productId, parseInt(quantity) || 1);
                    }}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select product to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={`${product.id}:1`}>
                            {product.name} - ${product.unitPrice.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {invoiceItems.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Invoice Items</h4>
                    <div className="space-y-2">
                      {invoiceItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × ${item.unitPrice.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold">${item.total.toFixed(2)}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInvoiceItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${calculateTotals().subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (10%):</span>
                        <span>${calculateTotals().tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">${calculateTotals().total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" name="notes" rows={3} />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent">
                    Create Invoice
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {invoices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No invoices yet</h3>
                <p className="text-muted-foreground">Create your first invoice to get started</p>
              </CardContent>
            </Card>
          ) : (
            invoices.map(invoice => (
              <Card key={invoice.id} className="hover:shadow-hover transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
                            Invoice #{invoice.invoiceNumber}
                          </h3>
                          <p className="text-muted-foreground">{invoice.supplierName}</p>
                        </div>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-bold text-lg text-primary">${invoice.total.toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Items</p>
                        <div className="space-y-1">
                          {invoice.items.map((item, idx) => (
                            <p key={idx} className="text-sm">
                              {item.productName} × {item.quantity} = ${item.total.toFixed(2)}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => downloadInvoicePDF(invoice)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
