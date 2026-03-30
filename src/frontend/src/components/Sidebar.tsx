import {
  AlertTriangle,
  CloudSun,
  LayoutDashboard,
  MapPin,
  Navigation,
  Shield,
  Utensils,
} from "lucide-react";
import type { ActivePanel } from "../App";

const NAV_ITEMS: {
  id: ActivePanel;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "traffic", label: "Traffic", icon: <Navigation size={18} /> },
  { id: "services", label: "Services", icon: <MapPin size={18} /> },
  { id: "food", label: "Food", icon: <Utensils size={18} /> },
  { id: "weather", label: "Weather / AQI", icon: <CloudSun size={18} /> },
  { id: "alerts", label: "City Alerts", icon: <AlertTriangle size={18} /> },
  { id: "safety", label: "Safety", icon: <Shield size={18} /> },
];

interface Props {
  activePanel: ActivePanel;
  onNavigate: (panel: ActivePanel) => void;
  alertCount: number;
}

export default function Sidebar({
  activePanel,
  onNavigate,
  alertCount,
}: Props) {
  return (
    <aside
      className="flex flex-col h-screen w-[200px] shrink-0"
      style={{
        background: "#0E141C",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #4AA3FF, #0066CC)" }}
          >
            U
          </div>
          <span className="text-sm font-bold" style={{ color: "#E8EEF6" }}>
            UrbanX
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activePanel === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 relative"
              style={{
                background: isActive ? "#1B2A3A" : "transparent",
                color: isActive ? "#4AA3FF" : "#A7B3C2",
              }}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
              {item.id === "alerts" && alertCount > 0 && (
                <span
                  className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#F2A23A", color: "#0B0F14" }}
                >
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-[10px]" style={{ color: "#6F7C8D" }}>
          UrbanX © 2026
        </p>
      </div>
    </aside>
  );
}
