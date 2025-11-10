import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { vehicles } from "@/data/vehicles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Star, Users, Gauge, Check, CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = vehicles.find((v) => v.id === id);
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Vehicle not found</h1>
        </div>
      </div>
    );
  }

  const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const totalPrice = days * vehicle.pricePerDay;

  const handleBooking = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (days < 1) {
      toast.error("End date must be after start date");
      return;
    }

    const booking = {
      id: Date.now().toString(),
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleImage: vehicle.image,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalDays: days,
      pricePerDay: vehicle.pricePerDay,
      totalPrice,
      status: "confirmed" as const,
      bookingDate: new Date().toISOString(),
    };

    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([...existingBookings, booking]));

    toast.success("Booking confirmed! Redirecting to payment...");
    setTimeout(() => {
      navigate("/bookings");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Vehicle Details */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-base px-3 py-1">
                {vehicle.category}
              </Badge>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {vehicle.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="font-semibold">{vehicle.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({vehicle.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">
                  ${vehicle.pricePerDay}
                </div>
                <div className="text-muted-foreground">per day</div>
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About this {vehicle.type}</h2>
                <p className="text-muted-foreground mb-6">{vehicle.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Capacity</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{vehicle.capacity}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Transmission</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Gauge className="h-4 w-4" />
                      <span className="font-semibold">{vehicle.transmission}</span>
                    </div>
                  </div>
                  {vehicle.fuelType && (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Fuel Type</span>
                      <span className="font-semibold mt-1">{vehicle.fuelType}</span>
                    </div>
                  )}
                  {vehicle.engineSize && (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Engine</span>
                      <span className="font-semibold mt-1">{vehicle.engineSize}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 shadow-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Book this vehicle</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Pick-up Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Drop-off Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => date < (startDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {days > 0 && (
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Daily rate</span>
                        <span>${vehicle.pricePerDay}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Number of days</span>
                        <span>{days}</span>
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">${totalPrice}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    onClick={handleBooking}
                    disabled={!startDate || !endDate}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
