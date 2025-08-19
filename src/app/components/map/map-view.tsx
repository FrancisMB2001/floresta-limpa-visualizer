"use client";

import { useState, useEffect, useRef } from "react";
import { Toolbox } from "./toolbox";
import { FuelBreak } from "../../types/fuelbreak";
import L from "leaflet";
import "leaflet-draw";
import { Client } from "@/client/client";
import { getJobStatus, generateTimeSeriesIndexFile } from "@/client";
import toast, { Toaster } from "react-hot-toast";
import { X } from "lucide-react";

const POLL_INTERVAL = Number(process.env.POLL_INTERVAL) || 3000;

interface MapViewProps {
  selectedFuelBreak: FuelBreak;
  onBack: () => void;
}

type NetCDFParams = { startDate: Date; endDate: Date };

export default function MapView({ selectedFuelBreak, onBack }: MapViewProps) {
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState("rectangle");
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  useEffect(() => {
    if (!mapRef.current || !selectedFuelBreak) return;

    // Clean up old map instance
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
    }

    // Initialize map
    const map = L.map(mapRef.current).setView([0, 0], 10);
    leafletMapRef.current = map;

    // Add base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add drawn items layer
    const drawnItems = drawnItemsRef.current;
    drawnItems.addTo(map);

    const fuelBreakGeoJSON = selectedFuelBreak.geometry;
    const fuelBreakLayer = L.geoJSON(fuelBreakGeoJSON).addTo(map);
    map.fitBounds(fuelBreakLayer.getBounds());

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: selectedTool === "polygon" ? {} : false,
        rectangle: selectedTool === "rectangle" ? {} : false,
        circle: false,
        marker: false,
        polyline: false,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    map.addControl(drawControl);

    // Handle creation event
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
      setSelectedArea(layer.toGeoJSON());
    });
  }, [selectedFuelBreak, selectedTool]);

  const handleCreateNetCDF = async ({ startDate, endDate }: NetCDFParams) => {
    if (!selectedArea || !startDate || !endDate) {
      toast.error("Por favor, selecione uma área e período temporal.");
      return;
    }

    const toastId = toast.loading("Submissão de pedido de criação NetCDF...");

    try {
      console.log("Creating NetCDF with params:", {
        location: selectedArea.geometry,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });
      const job = await generateTimeSeriesIndexFile({
        body: {
          fileType: "netcdf",
          location: selectedArea.geometry,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      toast.success(
        `Tarefa de criação NetCDF submitida com sucesso, com ID: ${job.data?.jobId}`,
        { id: toastId, duration: 5000 }
      );
      console.log("job:", job);

      if (job.data?.jobId) {
        pollJobStatus(job.data.jobId);
      } else {
        throw new Error("Job ID not found in response");
      }
    } catch (error) {
      toast.error("Erro ao criar ficheiro NetCDF.", { id: toastId });
      console.error("NetCDF creation error:", error);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const statusResp = await getJobStatus({ path: { id: jobId } });
      const status = statusResp.data?.status;
      if (status === "processing") {
        setTimeout(() => pollJobStatus(jobId), POLL_INTERVAL);
      } else if (status === "done") {
        toast.custom(
          (t) => (
            <div className="bg-white dark:bg-gray-900 rounded shadow px-4 py-3 flex items-center gap-3">
              <span>
                Ficheiro NetCDF pronto para descarregar!{" "}
                <a
                  href={
                    statusResp.data!.downloadUrl!.startsWith("http")
                      ? statusResp.data!.downloadUrl!
                      : "http://" +
                        statusResp.data!.downloadUrl!.replace(/^\/+/, "")
                  }
                  className="underline text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </span>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ),
          { duration: Infinity }
        );
      } else if (status === "error") {
        toast.error("NetCDF job failed.");
      } else {
        toast("NetCDF job status: " + status);
      }
    } catch (err) {
      toast.error("Failed to check job status.");
    }
  };

  const handleAreaSelect = (tool: string) => {
    setSelectedTool(tool);
    // Triggers useEffect to update the drawing control
  };

  return (
    <div className="flex h-screen">
      <Toaster position="bottom-right" />
      <Toolbox
        selectedFuelBreak={selectedFuelBreak}
        onBack={onBack}
        selectedArea={selectedArea}
        onCreateNetCDF={handleCreateNetCDF}
        onAreaSelect={handleAreaSelect}
        selectedTool={selectedTool}
      />

      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
}
