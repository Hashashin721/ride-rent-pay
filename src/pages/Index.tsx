import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/data/vehicles";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import heroBanner from "@/assets/hero-banner.jpg";
import { VehicleType } from "@/types/vehicle";

const Index = () => {
  const [filter, setFilter] = useState<VehicleType | "all">("all");

  const filteredVehicles = vehicles.filter(
    (vehicle) => filter === "all" || vehicle.type === filter
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Premium rental vehicles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
            Your Journey Starts Here
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rent premium cars and bikes for your next adventure. Flexible bookings, instant confirmation.
          </p>
          <Button variant="hero" size="lg" className="text-lg px-8">
            Start Exploring
          </Button>
        </div>
      </section>

      {/* Filters and Vehicle Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Available Vehicles
            </h2>
            <p className="text-muted-foreground">
              Choose from our premium selection of cars and motorcycles
            </p>
          </div>
          
          <Tabs value={filter} onValueChange={(v) => setFilter(v as VehicleType | "all")}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="car">Cars</TabsTrigger>
              <TabsTrigger value="bike">Bikes</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
