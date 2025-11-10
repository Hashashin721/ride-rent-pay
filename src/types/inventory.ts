export interface Product {
  id: string;
  name: string;
  barcode: string;
  sku: string;
  category: string;
  description: string;
  quantity: number;
  minStockLevel: number;
  unitPrice: number;
  supplierId: string;
  lastRestocked: string;
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  notes?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  date: string;
  reference?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  notes?: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
