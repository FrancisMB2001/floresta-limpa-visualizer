"use client";

import { useState } from "react";
import { FuelBreakCard } from "../components/fuel-break-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FuelBreak } from "../types/fuelbreak";

interface FuelBreaksGridProps {
  fuelBreaks: FuelBreak[];
  onViewMap: (fuelBreak: FuelBreak) => void;
}

export function FuelBreaksGrid({ fuelBreaks, onViewMap }: FuelBreaksGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMainOnly, setShowMainOnly] = useState(false);

  const filteredFuelBreaks = fuelBreaks.filter((fuelBreak) => {
    const matchesSearch = fuelBreak.properties.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fuelBreak.properties.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !showMainOnly || fuelBreak.properties.official_fuel_break;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Visualizador Floresta Limpa</h1>
        <p className="text-muted-foreground">
          Visualizar e realizar operações em Faixas de Gestão de Combustível de Incêndios (FGCI) com dados do projeto Floresta Limpa.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold">{fuelBreaks.length}</div>
          <div className="text-sm text-muted-foreground">Faixas Totais</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold">{filteredFuelBreaks.length}</div>
          <div className="text-sm text-muted-foreground">Resultados Filtrados</div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFuelBreaks.map((fuelBreak) => (
          <FuelBreakCard
            key={fuelBreak.id}
            fuelBreak={fuelBreak}
            onViewMap={onViewMap}
          />
        ))}
      </div>

      {filteredFuelBreaks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Nenhuma faixa encontrada.</div>
        </div>
      )}
    </div>
  );
}
