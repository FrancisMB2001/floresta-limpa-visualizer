"use client";
import { client } from "../client/client.gen";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { FuelBreaksGrid } from "./components/fuel-break-grid";
import { FuelBreak } from "./types/fuelbreak";
import {
  getFuelBreakFromStacById,
  getFuelBreaksFromStac,
  LoginResponse,
} from "@/client";
import AuthModal from "./components/auth/auth-modal";
import { clearAuthToken, setAuthToken } from "./auth";

client.setConfig({
  baseUrl: "http://91.134.84.183/api/",
});

const MapView = dynamic(() => import("./components/map/map-view"), {
  ssr: false,
});

export default function Home() {
  const [fuelBreaks, setFuelBreaks] = useState<FuelBreak[]>([]);
  const [selectedFuelBreak, setSelectedFuelBreak] = useState<FuelBreak | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<LoginResponse | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token); // configure client
      // optionally fetch user info here
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    clearAuthToken();
  };

  const handleLogin = (data: LoginResponse) => {
    setUser(data);
    if (data.token) {
      setAuthToken(data.token);
      localStorage.setItem("authToken", data.token);
    }
  };

  useEffect(() => {
    fetchFuelBreaks();
  }, []);

  const fetchFuelBreaks = async () => {
    try {
      const response = await getFuelBreaksFromStac({
        query: { view: "no_geometry" },
      });
      if (!response.data) throw new Error("No fuel breaks found");
      const data = response.data.map((item: any) => new FuelBreak(item));
      setFuelBreaks(data);
    } catch (error) {
      console.error("Error fetching fuel breaks:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleViewMap = async (fuelBreak: FuelBreak) => {
    setMapLoading(true);
    try {
      const response = await getFuelBreakFromStacById({
        path: { id: fuelBreak.id },
      });
      if (!response.data || response.data.length === 0) {
        throw new Error("Fuel break not found");
      }
      const fullFuelBreak = response.data.map(
        (item: any) => new FuelBreak(item)
      )[0];
      setSelectedFuelBreak(fullFuelBreak);
    } catch (error) {
      console.error("Error fetching fuel break geometry:", error);
    } finally {
      setMapLoading(false);
    }
  };

  const handleBackToGrid = () => {
    setSelectedFuelBreak(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">A carregar faixas de combustível...</div>
      </div>
    );
  }

  if (mapLoading) {
    return (
      <div
        className="flex items-center justify-center h-screen w-screen bg-background"
        role="status"
      >
        <svg
          aria-hidden="true"
          className="animate-spin text-gray-200 dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          width={96}
          height={96}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">A carregar...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 py-3 shadow-sm">
        {/* App name / logo */}
        <div className="text-xl font-bold tracking-wide">
          Visualizador Floresta Limpa
        </div>

        {/* Auth section */}
        <div>
          {!user ? (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-xl shadow hover:bg-gray-500 transition"
            >
              Login / Registrar
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.user.account_username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      {selectedFuelBreak ? (
        <MapView
          selectedFuelBreak={selectedFuelBreak}
          onBack={handleBackToGrid}
        />
      ) : (
        <FuelBreaksGrid fuelBreaks={fuelBreaks} onViewMap={handleViewMap} />
      )}

      {/* Auth Modal */}
      <div className="relative z-[1000]">
        {isAuthOpen && (
          <AuthModal onClose={() => setIsAuthOpen(false)} onLogin={setUser} />
        )}
      </div>
    </div>
  );
}
