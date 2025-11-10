import { Link } from "react-router-dom";
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Gauge } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  return (
    <Link to={`/vehicle/${vehicle.id}`}>
      <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            {vehicle.category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {vehicle.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{vehicle.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({vehicle.reviewCount})
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ${vehicle.pricePerDay}
              </div>
              <div className="text-xs text-muted-foreground">per day</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{vehicle.capacity}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{vehicle.transmission}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
