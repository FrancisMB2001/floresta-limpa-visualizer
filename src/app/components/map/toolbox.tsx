"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Square,
  Circle,
  Pentagon,
  Layers,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { FuelBreak } from "../../types/fuelbreak";
import { useState } from "react";

interface ToolboxProps {
  selectedFuelBreak: FuelBreak;
  onBack: () => void;
  selectedArea?: any;
  onCreateNetCDF: (params: { startDate: Date; endDate: Date }) => void;
  onAreaSelect: (tool: string) => void;
  selectedTool: string;
}

export function Toolbox({
  selectedFuelBreak,
  onBack,
  selectedArea,
  onCreateNetCDF,
  onAreaSelect,
  selectedTool,
}: ToolboxProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Handler to call parent with dates
  const handleCreateNetCDF = () => {
    if (selectedArea && startDate && endDate) {
      onCreateNetCDF({ startDate, endDate });
    }
  };

  const selectionTools = [
    { id: "rectangle", icon: Square, label: "Retângulo" },
    { id: "circle", icon: Circle, label: "Círculo" },
    { id: "polygon", icon: Pentagon, label: "Polígono" },
  ];

  return (
    <Card className="w-80 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-lg">Toolbox</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Fuel Break Info */}
        <div>
          <h3 className="font-semibold mb-2">
            Faixa de Combustível Selecionada
          </h3>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {selectedFuelBreak.properties.title}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedFuelBreak.properties.location}
              </Badge>
              {selectedFuelBreak.properties.official_fuel_break && (
                <Badge variant="default">Oficial</Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Area Selection Tools */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Seleção de Área
          </h3>
          <div className="space-y-2">
            {selectionTools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "outline"}
                size="sm"
                onClick={() => onAreaSelect(tool.id)}
                className="w-full justify-start"
              >
                <tool.icon className="h-4 w-4 mr-2" />
                {tool.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Operations */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Operações
          </h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                onChange={(e) =>
                  setStartDate(e.target.value ? new Date(e.target.value) : null)
                }
                max={endDate ? endDate.toISOString().slice(0, 10) : undefined}
                placeholder="Data início"
              />
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                onChange={(e) =>
                  setEndDate(e.target.value ? new Date(e.target.value) : null)
                }
                min={
                  startDate ? startDate.toISOString().slice(0, 10) : undefined
                }
                placeholder="Data fim"
              />
            </div>
            <Button
              onClick={handleCreateNetCDF}
              disabled={!selectedArea || !startDate || !endDate}
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Criar ficheiro NetCDF com Índices
            </Button>
            {(!selectedArea || !startDate || !endDate) && (
              <p className="text-xs text-muted-foreground">
                Selecione uma área e um período para criar o ficheiro NetCDF.
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Layer Controls */}
        {/*
        <div>
          <h3 className="font-semibold mb-3">Layers</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Fuel Break Boundary</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">OSM Roads</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Satellite Imagery</span>
              <input type="checkbox" />
            </div>
          </div>
        </div>
        */}
      </CardContent>
    </Card>
  );
}
