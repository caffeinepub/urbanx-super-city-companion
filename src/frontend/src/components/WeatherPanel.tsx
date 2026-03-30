import { CloudSun, Droplets, Eye, Thermometer, Wind, X } from "lucide-react";
import type { UserLocation, WeatherData } from "../App";

const AQI_BREAKDOWN = [
  { label: "PM2.5", value: 12, unit: "μg/m³", color: "#38D27A" },
  { label: "PM10", value: 24, unit: "μg/m³", color: "#38D27A" },
  { label: "O3", value: 68, unit: "ppb", color: "#F2A23A" },
  { label: "NO2", value: 18, unit: "ppb", color: "#38D27A" },
];

const FORECAST = [
  { day: "Today", emoji: "⛅", high: 24, low: 16 },
  { day: "Tue", emoji: "☀️", high: 27, low: 18 },
  { day: "Wed", emoji: "🌧️", high: 19, low: 13 },
  { day: "Thu", emoji: "⛅", high: 22, low: 15 },
  { day: "Fri", emoji: "☀️", high: 26, low: 17 },
];

const AQI = { value: 42, label: "Good", color: "#38D27A" };

interface Props {
  weather: WeatherData | null;
  userLocation: UserLocation | null;
  onClose: () => void;
}

export default function WeatherPanel({
  weather,
  userLocation,
  onClose,
}: Props) {
  return (
    <div
      className="absolute top-0 left-0 bottom-0 z-[1001] flex flex-col overflow-hidden"
      style={{
        width: "380px",
        background: "rgba(11,15,20,0.95)",
        backdropFilter: "blur(16px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <CloudSun size={16} style={{ color: "#4AA3FF" }} />
          <span className="font-semibold text-sm" style={{ color: "#E8EEF6" }}>
            Weather & Air Quality
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <X size={14} style={{ color: "#A7B3C2" }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {/* Big weather display */}
        <div className="glass-card p-5 text-center">
          <div className="text-5xl mb-2">
            {weather?.weatherCode !== undefined && weather.weatherCode <= 1
              ? "☀️"
              : weather?.weatherCode !== undefined && weather.weatherCode <= 3
                ? "⛅"
                : "🌧️"}
          </div>
          <div className="text-4xl font-bold mb-1" style={{ color: "#E8EEF6" }}>
            {weather ? `${weather.temp}°C` : "--°C"}
          </div>
          <div className="text-sm" style={{ color: "#A7B3C2" }}>
            {weather?.condition ?? "Loading..."}
          </div>
          {userLocation && (
            <div
              className="text-xs mt-1 uppercase tracking-wider"
              style={{ color: "#6F7C8D" }}
            >
              {userLocation.city}
            </div>
          )}
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              icon: <Droplets size={14} />,
              label: "Humidity",
              value: weather ? `${weather.humidity}%` : "--",
            },
            {
              icon: <Wind size={14} />,
              label: "Wind Speed",
              value: weather ? `${weather.windSpeed} km/h` : "--",
            },
            { icon: <Eye size={14} />, label: "Visibility", value: "12 km" },
            {
              icon: <Thermometer size={14} />,
              label: "Feels Like",
              value: weather ? `${weather.temp - 2}°C` : "--",
            },
          ].map((m) => (
            <div key={m.label} className="glass-card p-3">
              <div
                className="flex items-center gap-1.5 mb-1"
                style={{ color: "#4AA3FF" }}
              >
                {m.icon}
                <span className="text-xs" style={{ color: "#6F7C8D" }}>
                  {m.label}
                </span>
              </div>
              <div
                className="text-lg font-semibold"
                style={{ color: "#E8EEF6" }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* AQI Gauge */}
        <div className="glass-card p-4">
          <h3
            className="text-xs font-semibold mb-3 uppercase tracking-widest"
            style={{ color: "#6F7C8D" }}
          >
            Air Quality Index
          </h3>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex flex-col items-center justify-center shrink-0"
              style={{
                border: `3px solid ${AQI.color}`,
                background: `${AQI.color}15`,
              }}
            >
              <span className="text-xl font-bold" style={{ color: AQI.color }}>
                {AQI.value}
              </span>
            </div>
            <div>
              <div
                className="text-base font-semibold"
                style={{ color: AQI.color }}
              >
                {AQI.label}
              </div>
              <div className="text-xs" style={{ color: "#A7B3C2" }}>
                Air is clean and safe to breathe
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {AQI_BREAKDOWN.map((a) => (
              <div key={a.label} className="flex justify-between text-xs">
                <span style={{ color: "#6F7C8D" }}>{a.label}</span>
                <span style={{ color: a.color }}>
                  {a.value} {a.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5-day forecast */}
        <div className="glass-card p-4">
          <h3
            className="text-xs font-semibold mb-3 uppercase tracking-widest"
            style={{ color: "#6F7C8D" }}
          >
            5-Day Forecast
          </h3>
          <div className="flex gap-2">
            {FORECAST.map((f) => (
              <div
                key={f.day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-[10px]" style={{ color: "#6F7C8D" }}>
                  {f.day}
                </span>
                <span className="text-base">{f.emoji}</span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: "#E8EEF6" }}
                >
                  {f.high}°
                </span>
                <span className="text-[10px]" style={{ color: "#6F7C8D" }}>
                  {f.low}°
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
