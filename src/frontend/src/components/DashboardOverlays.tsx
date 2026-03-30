import {
  AlertTriangle,
  Bell,
  Car,
  ChevronRight,
  MapPin,
  Shield,
  Thermometer,
  Utensils,
  Wind,
} from "lucide-react";
import type { ActivePanel, WeatherData } from "../App";
import type { CityAlert } from "../backend";

function weatherIcon(code: number) {
  if (code === 0 || code === 1) return "\u2600\ufe0f";
  if (code <= 3) return "\u26c5";
  if (code <= 48) return "\ud83c\udf2b\ufe0f";
  if (code <= 67) return "\ud83c\udf27\ufe0f";
  if (code <= 77) return "\u2744\ufe0f";
  if (code <= 82) return "\ud83c\udf26\ufe0f";
  return "\u26c8\ufe0f";
}

const AQI_MOCK = {
  value: 42,
  label: "Good",
  color: "#38D27A",
};

const TRAFFIC_MOCK = [
  { label: "Main Boulevard", status: "Heavy", color: "#D73B36" },
  { label: "Ring Road", status: "Moderate", color: "#F2A23A" },
  { label: "Highway 5", status: "Clear", color: "#38D27A" },
];

const MAP_CONTROLS = [
  { icon: "\ud83d\udd0d", label: "search" },
  { icon: "\ud83d\udccd", label: "locate" },
  { icon: "\ud83d\uddfa\ufe0f", label: "layers" },
];

interface Props {
  weather: WeatherData | null;
  alerts: CityAlert[];
  onNavigate: (panel: ActivePanel) => void;
  onEmergency: () => void;
}

export default function DashboardOverlays({
  weather,
  alerts,
  onNavigate,
}: Props) {
  const topAlert = alerts[0];

  return (
    <>
      {/* Top-left stack */}
      <div className="absolute top-4 left-4 z-[999] flex flex-col gap-2 w-[220px]">
        {/* Weather */}
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">
              {weather
                ? weatherIcon(weather.weatherCode)
                : "\ud83c\udf24\ufe0f"}
            </span>
            <div>
              <div className="text-base font-bold" style={{ color: "#E8EEF6" }}>
                {weather ? `${weather.temp}\u00b0C` : "--\u00b0C"}
              </div>
              <div className="text-[11px]" style={{ color: "#A7B3C2" }}>
                {weather?.condition ?? "Loading..."}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span style={{ color: "#6F7C8D" }}>AQI</span>
            <span className="font-semibold" style={{ color: AQI_MOCK.color }}>
              {AQI_MOCK.value} \u2014 {AQI_MOCK.label}
            </span>
          </div>
          {weather && (
            <div
              className="flex items-center gap-3 mt-1 text-[11px]"
              style={{ color: "#6F7C8D" }}
            >
              <span className="flex items-center gap-1">
                <Wind size={10} /> {weather.windSpeed} km/h
              </span>
              <span className="flex items-center gap-1">
                <Thermometer size={10} /> {weather.humidity}% RH
              </span>
            </div>
          )}
        </div>

        {/* Traffic */}
        <button
          type="button"
          className="glass-card p-3 text-left w-full"
          onClick={() => onNavigate("traffic")}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Car size={14} style={{ color: "#4AA3FF" }} />
              <span
                className="text-[12px] font-semibold"
                style={{ color: "#E8EEF6" }}
              >
                Traffic Status
              </span>
            </div>
            <ChevronRight size={12} style={{ color: "#6F7C8D" }} />
          </div>
          {TRAFFIC_MOCK.slice(0, 2).map((t) => (
            <div
              key={t.label}
              className="flex justify-between text-[11px] mb-0.5"
            >
              <span style={{ color: "#A7B3C2" }}>{t.label}</span>
              <span style={{ color: t.color }}>{t.status}</span>
            </div>
          ))}
        </button>

        {/* Top alert */}
        {topAlert && (
          <button
            type="button"
            className="p-3 rounded-2xl text-left w-full"
            style={{
              background: "rgba(242,162,58,0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(242,162,58,0.3)",
            }}
            onClick={() => onNavigate("alerts")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: "#F2A23A" }} />
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: "#F2A23A" }}
                >
                  City Alert
                </span>
              </div>
              <ChevronRight size={12} style={{ color: "#6F7C8D" }} />
            </div>
            <p
              className="text-[11px] mt-1 line-clamp-2"
              style={{ color: "#E8EEF6" }}
            >
              {topAlert.title}
            </p>
          </button>
        )}
      </div>

      {/* Bottom action cards */}
      <div className="absolute bottom-6 left-4 right-[120px] z-[999] flex gap-2">
        {[
          {
            id: "services" as ActivePanel,
            icon: <MapPin size={14} />,
            label: "Nearby Services",
            sub: "Hospitals \u00b7 ATMs \u00b7 Pharmacy",
          },
          {
            id: "food" as ActivePanel,
            icon: <Utensils size={14} />,
            label: "Food Discovery",
            sub: "Restaurants \u00b7 Cafes \u00b7 Street",
          },
          {
            id: "alerts" as ActivePanel,
            icon: <Bell size={14} />,
            label: "City Alerts",
            sub: "Traffic \u00b7 Weather \u00b7 Events",
          },
          {
            id: "safety" as ActivePanel,
            icon: <Shield size={14} />,
            label: "Safety Info",
            sub: "Police \u00b7 Ambulance \u00b7 Fire",
          },
        ].map((card) => (
          <button
            type="button"
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="glass-card p-3 flex-1 text-left hover:border-[#4AA3FF]/30 transition-colors"
          >
            <div
              className="flex items-center gap-1.5 mb-1"
              style={{ color: "#4AA3FF" }}
            >
              {card.icon}
              <span
                className="text-[11px] font-semibold"
                style={{ color: "#E8EEF6" }}
              >
                {card.label}
              </span>
            </div>
            <p className="text-[10px]" style={{ color: "#6F7C8D" }}>
              {card.sub}
            </p>
          </button>
        ))}
      </div>

      {/* Right map controls */}
      <div className="absolute top-4 right-4 z-[999] flex flex-col gap-2">
        {MAP_CONTROLS.map((ctrl) => (
          <div
            key={ctrl.label}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm cursor-pointer"
            style={{
              background: "rgba(20,30,41,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {ctrl.icon}
          </div>
        ))}
      </div>
    </>
  );
}
