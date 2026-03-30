import L from "leaflet";
import { useEffect } from "react";
import { Circle, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { ActivePanel, UserLocation } from "../App";

// Fix default icon - biome-ignore lint/performance/noDelete: required leaflet workaround
// biome-ignore lint/performance/noDelete: leaflet icon fix
(L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl =
  undefined;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 14);
  }, [lat, lon, map]);
  return null;
}

const MOCK_SERVICES = [
  {
    type: "hospital",
    label: "City Hospital",
    dLat: 0.008,
    dLon: 0.005,
    color: "#D73B36",
  },
  { type: "atm", label: "ATM", dLat: -0.004, dLon: 0.009, color: "#4AA3FF" },
  {
    type: "pharmacy",
    label: "Pharmacy",
    dLat: 0.006,
    dLon: -0.007,
    color: "#38D27A",
  },
  {
    type: "police",
    label: "Police Station",
    dLat: -0.007,
    dLon: -0.003,
    color: "#4169E1",
  },
  {
    type: "food",
    label: "Restaurant",
    dLat: 0.003,
    dLon: 0.011,
    color: "#F2A23A",
  },
];

function createColorIcon(color: string, emoji: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:${color};border:2px solid rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;font-size:14px;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.5);"><span style="transform:rotate(45deg)">${emoji}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}

const SERVICE_ICONS: Record<string, string> = {
  hospital: "\ud83c\udfe5",
  atm: "\ud83c\udfe7",
  pharmacy: "\ud83d\udc8a",
  police: "\ud83d\udc6e",
  food: "\ud83c\udf5c",
};

interface Props {
  userLocation: UserLocation | null;
  activePanel: ActivePanel;
}

export default function MapView({ userLocation, activePanel }: Props) {
  const lat = userLocation?.lat ?? 40.7128;
  const lon = userLocation?.lon ?? -74.006;
  const showMarkers = ["dashboard", "services", "safety"].includes(activePanel);

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={14}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
      style={{ background: "#0B111A" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CARTO"
      />
      {userLocation && (
        <RecenterMap lat={userLocation.lat} lon={userLocation.lon} />
      )}
      {userLocation && (
        <>
          <Circle
            center={[lat, lon]}
            radius={60}
            pathOptions={{
              color: "#4AA3FF",
              fillColor: "#4AA3FF",
              fillOpacity: 0.15,
              weight: 2,
            }}
          />
          <Circle
            center={[lat, lon]}
            radius={12}
            pathOptions={{
              color: "#4AA3FF",
              fillColor: "#4AA3FF",
              fillOpacity: 0.9,
              weight: 0,
            }}
          />
        </>
      )}
      {userLocation &&
        showMarkers &&
        MOCK_SERVICES.map((s) => (
          <Marker
            key={s.type}
            position={[lat + s.dLat, lon + s.dLon]}
            icon={createColorIcon(
              s.color,
              SERVICE_ICONS[s.type] || "\ud83d\udccd",
            )}
          />
        ))}
    </MapContainer>
  );
}
