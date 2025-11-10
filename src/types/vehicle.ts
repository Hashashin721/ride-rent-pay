export type VehicleType = "car" | "bike";

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  category: string;
  pricePerDay: number;
  image: string;
  rating: number;
  reviewCount: number;
  features: string[];
  description: string;
  capacity: number;
  transmission: string;
  fuelType?: string;
  engineSize?: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  bookingDate: string;
}
