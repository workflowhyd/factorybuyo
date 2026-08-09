"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Region } from "@/lib/format";

const STORAGE_KEY = "factorybuyo_region";
const DEFAULT_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

type RegionSettings = {
  code: Region;
  label: string;
  flag: string;
  whatsappNumber?: string;
  bannerText: string;
  deliveryNote?: string;
  marketNotice?: string;
  enabled: boolean;
};

const RegionContext = createContext<{
  region: Region;
  setRegion: (region: Region) => void;
  settings: RegionSettings | undefined;
  allSettings: RegionSettings[] | undefined;
  whatsappNumber: string;
}>({
  region: "IN",
  setRegion: () => {},
  settings: undefined,
  allSettings: undefined,
  whatsappNumber: DEFAULT_WHATSAPP,
});

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>("IN");
  const allSettings = useQuery(api.regions.list, {});

  useEffect(() => {
    // Deliberately read localStorage post-mount (not during render) so the
    // statically-exported HTML always matches on first hydration.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "IN" || stored === "SG") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRegionState(stored);
    }
  }, []);

  useEffect(() => {
    if (!allSettings) return;
    const current = allSettings.find((s) => s.code === region);
    if (current && !current.enabled) {
      const fallback = allSettings.find((s) => s.enabled);
      if (fallback) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRegionState(fallback.code);
        window.localStorage.setItem(STORAGE_KEY, fallback.code);
      }
    }
  }, [allSettings, region]);

  function setRegion(next: Region) {
    setRegionState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const settings = allSettings?.find((s) => s.code === region);
  const whatsappNumber = settings?.whatsappNumber || DEFAULT_WHATSAPP;

  return (
    <RegionContext.Provider value={{ region, setRegion, settings, allSettings, whatsappNumber }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
