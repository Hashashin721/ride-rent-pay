import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Supplier } from "@/types/inventory";
import { initialSuppliers } from "@/data/inventory";
import { Plus, Mail, Phone, MapPin, Globe, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
    } else {
      setSuppliers(initialSuppliers);
      localStorage.setItem("suppliers", JSON.stringify(initialSuppliers));
    }
  }, []);

  const handleSaveSupplier = (formData: FormData) => {
    const newSupplier: Supplier = {
      id: editingSupplier?.id || Date.now().toString(),
      name: formData.get("name") as string,
      contactPerson: formData.get("contactPerson") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      website: formData.get("website") as string || undefined,
      notes: formData.get("notes") as string || undefined,
    };

    let updatedSuppliers;
    if (editingSupplier) {
      updatedSuppliers = suppliers.map(s => s.id === editingSupplier.id ? newSupplier : s);
      toast.success("Supplier updated successfully");
    } else {
      updatedSuppliers = [...suppliers, newSupplier];
      toast.success("Supplier added successfully");
    }

    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
    setIsAddDialogOpen(false);
    setEditingSupplier(null);
  };

  const handleDeleteSupplier = (id: string) => {
    const updatedSuppliers = suppliers.filter(s => s.id !== id);
    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
    toast.success("Supplier deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Suppliers</h1>
            <p className="text-muted-foreground">Manage your supplier relationships</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent" onClick={() => setEditingSupplier(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveSupplier(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" name="name" defaultValue={editingSupplier?.name} required />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input id="contactPerson" name="contactPerson" defaultValue={editingSupplier?.contactPerson} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={editingSupplier?.email} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" defaultValue={editingSupplier?.phone} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" defaultValue={editingSupplier?.address} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input id="website" name="website" type="url" defaultValue={editingSupplier?.website} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" name="notes" defaultValue={editingSupplier?.notes} rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent">
                    {editingSupplier ? "Update" : "Add"} Supplier
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {suppliers.map(supplier => (
            <Card key={supplier.id} className="hover:shadow-hover transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-1">{supplier.name}</h3>
                    <p className="text-muted-foreground">{supplier.contactPerson}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSupplier(supplier);
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSupplier(supplier.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href={`mailto:${supplier.email}`} className="text-sm font-medium hover:text-primary">
                        {supplier.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href={`tel:${supplier.phone}`} className="text-sm font-medium hover:text-primary">
                        {supplier.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">{supplier.address}</p>
                    </div>
                  </div>

                  {supplier.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary">
                          {supplier.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {supplier.notes && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{supplier.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
