import { AlertTriangle, Clock, Navigation, X } from "lucide-react";

const ROUTES = [
  {
    name: "Route A — Main Blvd",
    time: "12 min",
    dist: "4.2 km",
    status: "Heavy",
    color: "#D73B36",
  },
  {
    name: "Route B — Ring Road",
    time: "18 min",
    dist: "6.1 km",
    status: "Moderate",
    color: "#F2A23A",
  },
  {
    name: "Route C — Highway 5",
    time: "22 min",
    dist: "8.3 km",
    status: "Clear",
    color: "#38D27A",
  },
];

const TRAFFIC_UPDATES = [
  {
    road: "Main Boulevard (City Center)",
    status: "Heavy",
    detail: "Accident reported near Junction 4",
    color: "#D73B36",
  },
  {
    road: "Ring Road N (North Section)",
    status: "Moderate",
    detail: "Construction slowing traffic",
    color: "#F2A23A",
  },
  {
    road: "Highway 5 (East Exit)",
    status: "Clear",
    detail: "Free flow conditions",
    color: "#38D27A",
  },
  {
    road: "Bridge Street",
    status: "Moderate",
    detail: "Rush hour congestion",
    color: "#F2A23A",
  },
  {
    road: "Industrial Avenue",
    status: "Clear",
    detail: "No incidents reported",
    color: "#38D27A",
  },
];

interface Props {
  onClose: () => void;
}

export default function TrafficPanel({ onClose }: Props) {
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
          <Navigation size={16} style={{ color: "#4AA3FF" }} />
          <span className="font-semibold text-sm" style={{ color: "#E8EEF6" }}>
            Traffic & Routes
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
        {/* Smart Routes */}
        <section>
          <h3
            className="text-xs font-semibold mb-2 uppercase tracking-widest"
            style={{ color: "#6F7C8D" }}
          >
            Smart Route Suggestions
          </h3>
          <div className="flex flex-col gap-2">
            {ROUTES.map((r) => (
              <div
                key={r.name}
                className="glass-card p-3 flex items-center justify-between"
              >
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#E8EEF6" }}
                  >
                    {r.name}
                  </p>
                  <div
                    className="flex items-center gap-3 mt-0.5 text-xs"
                    style={{ color: "#A7B3C2" }}
                  >
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {r.time}
                    </span>
                    <span>{r.dist}</span>
                  </div>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ color: r.color, background: `${r.color}18` }}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Live Updates */}
        <section>
          <h3
            className="text-xs font-semibold mb-2 uppercase tracking-widest"
            style={{ color: "#6F7C8D" }}
          >
            Live Traffic Updates
          </h3>
          <div className="flex flex-col gap-2">
            {TRAFFIC_UPDATES.map((t) => (
              <div key={t.road} className="glass-card p-3">
                <div className="flex items-start gap-2">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: t.color }}
                  />
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "#E8EEF6" }}
                    >
                      {t.road}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#A7B3C2" }}>
                      {t.detail}
                    </p>
                  </div>
                  <span
                    className="ml-auto text-[10px] shrink-0"
                    style={{ color: t.color }}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warning */}
        <div
          className="glass-card p-3 flex items-center gap-2"
          style={{ borderColor: "rgba(242,162,58,0.3)" }}
        >
          <AlertTriangle size={14} style={{ color: "#F2A23A" }} />
          <p className="text-xs" style={{ color: "#A7B3C2" }}>
            Traffic data updates every 5 minutes. Plan accordingly.
          </p>
        </div>
      </div>
    </div>
  );
}
