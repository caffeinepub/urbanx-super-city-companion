import { Bell, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
  AlertCategory,
  AlertSeverity,
  type CityAlert,
  type IncidentReport,
  IncidentType,
} from "../backend";

const SEV_COLOR: Record<string, string> = {
  high: "#D73B36",
  medium: "#F2A23A",
  low: "#38D27A",
};

const CAT_EMOJI: Record<string, string> = {
  traffic: "🚗",
  weather: "⚡",
  construction: "🚧",
  event: "🎉",
  emergency: "🚨",
};

const INC_EMOJI: Record<string, string> = {
  accident: "🚙",
  fire: "🔥",
  harassment: "⚠️",
  medical: "🚑",
  other: "📍",
};

interface Props {
  alerts: CityAlert[];
  incidents: IncidentReport[];
  isAdmin: boolean;
  onCreateAlert: (
    title: string,
    desc: string,
    cat: AlertCategory,
    sev: AlertSeverity,
  ) => Promise<void>;
  onDeactivateAlert: (id: bigint) => Promise<void>;
  onClose: () => void;
}

export default function AlertsPanel({
  alerts,
  incidents,
  isAdmin,
  onCreateAlert,
  onDeactivateAlert,
  onClose,
}: Props) {
  const [tab, setTab] = useState<"alerts" | "incidents">("alerts");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    cat: AlertCategory.traffic,
    sev: AlertSeverity.medium,
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    await onCreateAlert(form.title, form.desc, form.cat, form.sev);
    setForm({
      title: "",
      desc: "",
      cat: AlertCategory.traffic,
      sev: AlertSeverity.medium,
    });
    setShowForm(false);
  };

  const formatTime = (ts: bigint) => {
    try {
      return new Date(Number(ts) / 1_000_000).toLocaleString();
    } catch {
      return "Unknown";
    }
  };

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
          <Bell size={16} style={{ color: "#F2A23A" }} />
          <span className="font-semibold text-sm" style={{ color: "#E8EEF6" }}>
            City Alerts & Incidents
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && tab === "alerts" && (
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="p-1.5 rounded-lg"
              style={{ background: "rgba(74,163,255,0.15)", color: "#4AA3FF" }}
            >
              <Plus size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <X size={14} style={{ color: "#A7B3C2" }} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {(["alerts", "incidents"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 text-xs font-medium capitalize transition-colors"
            style={{
              color: tab === t ? "#4AA3FF" : "#6F7C8D",
              borderBottom:
                tab === t ? "2px solid #4AA3FF" : "2px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {/* Create alert form */}
        {showForm && tab === "alerts" && isAdmin && (
          <div
            className="glass-card p-4 flex flex-col gap-2"
            style={{ borderColor: "rgba(74,163,255,0.3)" }}
          >
            <input
              className="w-full text-sm rounded-lg px-3 py-2"
              placeholder="Alert title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "#E8EEF6",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <textarea
              className="w-full text-sm rounded-lg px-3 py-2 resize-none"
              rows={2}
              placeholder="Description"
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "#E8EEF6",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <div className="flex gap-2">
              <select
                value={form.cat}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    cat: e.target.value as AlertCategory,
                  }))
                }
                className="flex-1 text-xs rounded-lg px-2 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "#E8EEF6",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {Object.values(AlertCategory).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={form.sev}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sev: e.target.value as AlertSeverity,
                  }))
                }
                className="flex-1 text-xs rounded-lg px-2 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "#E8EEF6",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {Object.values(AlertSeverity).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2 rounded-lg text-xs font-semibold"
              style={{ background: "#4AA3FF", color: "#0B0F14" }}
            >
              Post Alert
            </button>
          </div>
        )}

        {tab === "alerts" &&
          (alerts.length === 0 ? (
            <div
              className="text-center py-8 text-sm"
              style={{ color: "#6F7C8D" }}
            >
              No active alerts
            </div>
          ) : (
            alerts.map((a) => (
              <div key={String(a.id)} className="glass-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {CAT_EMOJI[a.category] ?? "📌"}
                    </span>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#E8EEF6" }}
                      >
                        {a.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#A7B3C2" }}
                      >
                        {a.description}
                      </p>
                      <p
                        className="text-[10px] mt-1"
                        style={{ color: "#6F7C8D" }}
                      >
                        {formatTime(a.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{
                        color: SEV_COLOR[a.severity],
                        background: `${SEV_COLOR[a.severity]}18`,
                      }}
                    >
                      {a.severity}
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onDeactivateAlert(a.id)}
                        style={{ color: "#6F7C8D" }}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ))}

        {tab === "incidents" &&
          (incidents.length === 0 ? (
            <div
              className="text-center py-8 text-sm"
              style={{ color: "#6F7C8D" }}
            >
              No incidents reported
            </div>
          ) : (
            incidents.map((inc) => (
              <div key={String(inc.id)} className="glass-card p-3">
                <div className="flex items-start gap-2">
                  <span className="text-base">
                    {INC_EMOJI[inc.incidentType] ?? "📌"}
                  </span>
                  <div>
                    <p
                      className="text-sm font-semibold capitalize"
                      style={{ color: "#E8EEF6" }}
                    >
                      {inc.incidentType} Incident
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#A7B3C2" }}>
                      {inc.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          color:
                            inc.status === "pending" ? "#F2A23A" : "#38D27A",
                          background:
                            inc.status === "pending"
                              ? "rgba(242,162,58,0.15)"
                              : "rgba(56,210,122,0.15)",
                        }}
                      >
                        {inc.status}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: "#6F7C8D" }}
                      >
                        {formatTime(inc.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  );
}
