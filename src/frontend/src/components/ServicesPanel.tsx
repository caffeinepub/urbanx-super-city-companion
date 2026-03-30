import { MapPin, X } from "lucide-react";
import { useState } from "react";
import type { UserLocation } from "../App";

const ALL_SERVICES = [
  {
    type: "hospital",
    name: "City General Hospital",
    address: "14 Medical Way",
    dist: "0.3 km",
    open: true,
    color: "#D73B36",
    emoji: "🏥",
  },
  {
    type: "hospital",
    name: "St. Mary's Clinic",
    address: "88 Health Blvd",
    dist: "0.9 km",
    open: true,
    color: "#D73B36",
    emoji: "🏥",
  },
  {
    type: "atm",
    name: "Chase ATM",
    address: "15 Bank Street",
    dist: "0.4 km",
    open: true,
    color: "#4AA3FF",
    emoji: "🏧",
  },
  {
    type: "atm",
    name: "Wells Fargo ATM",
    address: "200 Commerce Ave",
    dist: "0.7 km",
    open: true,
    color: "#4AA3FF",
    emoji: "🏧",
  },
  {
    type: "pharmacy",
    name: "MedPlus Pharmacy",
    address: "7 Green Lane",
    dist: "0.5 km",
    open: true,
    color: "#38D27A",
    emoji: "💊",
  },
  {
    type: "pharmacy",
    name: "HealthFirst Drugs",
    address: "32 Oak Street",
    dist: "1.1 km",
    open: false,
    color: "#38D27A",
    emoji: "💊",
  },
  {
    type: "police",
    name: "Central Police Stn.",
    address: "1 Law Square",
    dist: "0.6 km",
    open: true,
    color: "#4169E1",
    emoji: "👮",
  },
  {
    type: "fuel",
    name: "Shell Gas Station",
    address: "99 Motor Drive",
    dist: "0.8 km",
    open: true,
    color: "#F2A23A",
    emoji: "⛽",
  },
  {
    type: "fuel",
    name: "BP Express",
    address: "45 Freeway Rd",
    dist: "1.4 km",
    open: true,
    color: "#F2A23A",
    emoji: "⛽",
  },
];

const CATEGORIES = ["all", "hospital", "atm", "pharmacy", "police", "fuel"];

interface Props {
  userLocation: UserLocation | null;
  onClose: () => void;
}

export default function ServicesPanel({ onClose }: Props) {
  const [active, setActive] = useState("all");
  const filtered =
    active === "all"
      ? ALL_SERVICES
      : ALL_SERVICES.filter((s) => s.type === active);

  return (
    <div
      className="absolute top-0 left-0 bottom-0 z-[1001] flex flex-col overflow-hidden"
      style={{
        width: "360px",
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
          <MapPin size={16} style={{ color: "#4AA3FF" }} />
          <span className="font-semibold text-sm" style={{ color: "#E8EEF6" }}>
            Nearby Services
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

      {/* Category tabs */}
      <div
        className="flex gap-1.5 px-4 py-3 overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActive(cat)}
            className="px-3 py-1.5 rounded-full text-[11px] font-medium capitalize shrink-0 transition-colors"
            style={{
              background: active === cat ? "#1B2A3A" : "rgba(255,255,255,0.05)",
              color: active === cat ? "#4AA3FF" : "#A7B3C2",
              border:
                active === cat
                  ? "1px solid rgba(74,163,255,0.3)"
                  : "1px solid transparent",
            }}
          >
            {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {filtered.map((s) => (
          <div key={s.name} className="glass-card p-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
              style={{ background: `${s.color}20` }}
            >
              {s.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "#E8EEF6" }}
              >
                {s.name}
              </p>
              <p className="text-xs" style={{ color: "#6F7C8D" }}>
                {s.address}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold" style={{ color: "#4AA3FF" }}>
                {s.dist}
              </p>
              <span
                className="text-[10px] font-medium"
                style={{ color: s.open ? "#38D27A" : "#D73B36" }}
              >
                {s.open ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
