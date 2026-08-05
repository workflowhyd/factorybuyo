"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Region } from "@/lib/format";

const STORAGE_KEY = "factorybuyo_region";

const RegionContext = createContext<{
  region: Region;
  setRegion: (region: Region) => void;
}>({
  region: "IN",
  setRegion: () => {},
});

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>("IN");

  useEffect(() => {
    // Deliberately read localStorage post-mount (not during render) so the
    // statically-exported HTML always matches on first hydration.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "IN" || stored === "SG") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRegionState(stored);
    }
  }, []);

  function setRegion(next: Region) {
    setRegionState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <RegionContext.Provider value={{ region, setRegion }}>{children}</RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
