"use client";
import { client } from "../client/client.gen";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { FuelBreaksGrid } from "./components/fuel-break-grid";
// import { MapView } from "./components/map/map-view";
import { FuelBreak } from "./types/fuelbreak";
import { getFuelBreakFromStacById, getFuelBreaksFromStac } from "@/client";

client.setConfig({
  baseUrl: "http://91.134.84.183/api/",
})

const MapView = dynamic(() => import("./components/map/map-view"), { ssr:false })

export default function Home() {
  const [fuelBreaks, setFuelBreaks] = useState<FuelBreak[]>([]);
  const [selectedFuelBreak, setSelectedFuelBreak] = useState<FuelBreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(false); 

  useEffect(() => {
    fetchFuelBreaks();
  }, []);

  const fetchFuelBreaks = async () => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await getFuelBreaksFromStac({
        query: {
          view: 'no_geometry',
      }});
      if(!response.data) {
        throw new Error("No fuel breaks found");
      }
      const data = response.data.map((item: any) => new FuelBreak(item));
      setFuelBreaks(data);
    } catch (error) {
      console.error('Error fetching fuel breaks:', error);
      // For demo purposes, you can load from your JSON file
      // setFuelBreaks(yourJsonData);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMap = async (fuelBreak: FuelBreak) => {
    setMapLoading(true);
    try {
      // Fetch the full fuel break with geometry
      const response = await getFuelBreakFromStacById({
        path: { id: fuelBreak.id },
      });
      if (!response.data || response.data.length === 0) {
        throw new Error("Fuel break not found");
      }
      const fullFuelBreak = response.data.map((item: any) => new FuelBreak(item))[0];
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
    <div className="flex items-center justify-center h-screen w-screen bg-background" role="status">
      <svg
        aria-hidden="true"
        className="animate-spin text-gray-200 dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        width={96}
        height={96}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="sr-only">A carregar...</span>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-background">
      {selectedFuelBreak ? (
        <MapView 
          selectedFuelBreak={selectedFuelBreak}
          onBack={handleBackToGrid}
        />
      ) : (
        <FuelBreaksGrid 
          fuelBreaks={fuelBreaks}
          onViewMap={handleViewMap}
        />
      )}
    </div>
  );
}

/* 
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
*/