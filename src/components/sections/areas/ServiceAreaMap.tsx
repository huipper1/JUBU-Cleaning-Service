"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { RotateCcw } from "lucide-react";
import type { ServiceArea } from "@/types/content";

interface ServiceAreaMapProps {
  areas: ServiceArea[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

const DUBAI_CENTER: [number, number] = [25.15, 55.25];
const DEFAULT_ZOOM = 10;
const ACTIVE_ZOOM = 14;

// Component to handle smooth flyTo camera movements and reset view
function MapController({
  activeArea,
  resetTrigger
}: {
  activeArea?: ServiceArea;
  resetTrigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (activeArea && activeArea.lat && activeArea.lng) {
      map.flyTo([activeArea.lat, activeArea.lng], ACTIVE_ZOOM, {
        duration: 1.0,
        easeLinearity: 0.25
      });
    }
  }, [activeArea, map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(DUBAI_CENTER, DEFAULT_ZOOM, {
        duration: 1.0,
        easeLinearity: 0.25
      });
    }
  }, [resetTrigger, map]);

  return null;
}

export function ServiceAreaMap({ areas, activeId, onSelect }: ServiceAreaMapProps) {
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const activeArea = useMemo(
    () => areas.find((a) => a.id === activeId),
    [areas, activeId]
  );
  const [resetCount, setResetCount] = useState(0);

  // Auto open popup when activeId changes via chip click
  useEffect(() => {
    if (activeId && markerRefs.current[activeId]) {
      const marker = markerRefs.current[activeId];
      // Small delay to allow the flyTo animation to start smoothly
      const timer = setTimeout(() => {
        marker.openPopup();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeId]);

  const handleReset = () => {
    onSelect(null);
    setResetCount((c) => c + 1);
    // close any open popups
    Object.values(markerRefs.current).forEach((marker) => {
      marker.closePopup();
    });
  };

  // Custom divIcons for regular and active states
  const createPinIcon = (isActive: boolean) => {
    return L.divIcon({
      className: "custom-pin-container",
      html: `<div class="pin ${isActive ? "pin--active" : ""}"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28]
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer
        center={DUBAI_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController activeArea={activeArea} resetTrigger={resetCount} />

        {areas.map((area) => {
          if (!area.lat || !area.lng) return null;
          const isActive = area.id === activeId;

          return (
            <Marker
              key={area.id}
              position={[area.lat, area.lng]}
              icon={createPinIcon(isActive)}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[area.id] = ref;
                }
              }}
              eventHandlers={{
                click: () => {
                  if (activeId === area.id) {
                    onSelect(null);
                  } else {
                    onSelect(area.id);
                  }
                }
              }}
            >
              <Popup className="custom-leaflet-popup" closeButton={false}>
                <div className="text-center">
                  <p className="text-xs font-black text-[#081839]">{area.name}</p>
                  <p className="text-[11px] font-semibold text-[#16a34a]">We clean here!</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Reset View Button */}
      <button
        type="button"
        onClick={handleReset}
        title="Reset map view"
        aria-label="Reset map view to default Dubai overview"
        className="absolute top-3 right-3 z-[1000] flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-[#081839] shadow-sm backdrop-blur-xs transition-all duration-200 hover:bg-slate-50 hover:text-[#0070ba] active:scale-95"
      >
        <RotateCcw className="h-3.5 w-3.5 text-[#0070ba]" />
        <span>Reset view</span>
      </button>
    </div>
  );
}
export default ServiceAreaMap;
