"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Database } from "lucide-react";
import { FuelBreak } from "../types/fuelbreak";

interface FuelBreakCardProps {
  fuelBreak: FuelBreak;
  onViewMap: (fuelBreak: FuelBreak) => void;
}

export function FuelBreakCard({ fuelBreak, onViewMap }: FuelBreakCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {fuelBreak.properties.title}
          </CardTitle>
          {fuelBreak.properties.official_fuel_break && (
            <Badge variant="default">Oficial</Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {fuelBreak.properties.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Dados válidos até: {formatDate(fuelBreak.properties.end_datetime)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>Coleção: {fuelBreak.collection}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {Object.keys(fuelBreak.assets).slice(0, 3).map((assetType) => (
              <Badge key={assetType} variant="secondary" className="text-xs">
                {assetType.toUpperCase()}
              </Badge>
            ))}
            {Object.keys(fuelBreak.assets).length > 3 && (
              <Badge variant="secondary" className="text-xs">
                mais +{Object.keys(fuelBreak.assets).length - 3}
              </Badge>
            )}
          </div>

          <Button 
            onClick={() => onViewMap(fuelBreak)}
            className="w-full mt-4"
          >
            Ver no Mapa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}