import { Phone, X } from "lucide-react";
import { useState } from "react";
import { ContactType, type EmergencyContact, IncidentType } from "../backend";

const DEFAULT_EMERGENCY = [
  {
    name: "Police",
    number: "911",
    contactType: ContactType.police,
    emoji: "👮",
    color: "#4169E1",
  },
  {
    name: "Ambulance",
    number: "911",
    contactType: ContactType.ambulance,
    emoji: "🚑",
    color: "#38D27A",
  },
  {
    name: "Fire Dept.",
    number: "911",
    contactType: ContactType.fire,
    emoji: "🔥",
    color: "#D73B36",
  },
  {
    name: "Crisis Line",
    number: "988",
    contactType: ContactType.other,
    emoji: "📞",
    color: "#4AA3FF",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  emergencyContacts: EmergencyContact[];
  onReportIncident: (type: IncidentType, desc: string) => Promise<void>;
}

export default function EmergencyModal({
  open,
  onClose,
  emergencyContacts,
  onReportIncident,
}: Props) {
  const [showReport, setShowReport] = useState(false);
  const [incType, setIncType] = useState<IncidentType>(IncidentType.accident);
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const contacts =
    emergencyContacts.length > 0
      ? emergencyContacts.map((c, i) => ({
          ...c,
          emoji: DEFAULT_EMERGENCY[i % 4]?.emoji ?? "📞",
          color:
            DEFAULT_EMERGENCY.find((d) => d.contactType === c.contactType)
              ?.color ?? "#4AA3FF",
        }))
      : DEFAULT_EMERGENCY;

  const handleSubmit = async () => {
    if (!desc.trim()) return;
    setSubmitting(true);
    await onReportIncident(incType, desc);
    setDesc("");
    setShowReport(false);
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
        style={{
          background: "#0E141C",
          border: "2px solid #D73B36",
          boxShadow: "0 0 40px rgba(215,59,54,0.3)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: "rgba(215,59,54,0.15)",
            borderBottom: "1px solid rgba(215,59,54,0.3)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <span className="font-bold text-base" style={{ color: "#D73B36" }}>
              EMERGENCY
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

        <div className="p-5 flex flex-col gap-4">
          {/* Call buttons */}
          <div className="grid grid-cols-2 gap-3">
            {contacts.map((c) => (
              <a
                key={`${c.name}-${c.number}`}
                href={`tel:${c.number}`}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl font-medium text-sm"
                style={{
                  background: `${c.color}15`,
                  border: `1px solid ${c.color}30`,
                  textDecoration: "none",
                  color: "#E8EEF6",
                }}
              >
                <span className="text-2xl">{c.emoji}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#E8EEF6" }}
                >
                  {c.name}
                </span>
                <div className="flex items-center gap-1">
                  <Phone size={10} style={{ color: c.color }} />
                  <span
                    className="text-xs font-bold"
                    style={{ color: c.color }}
                  >
                    {c.number}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Report Incident */}
          <button
            type="button"
            onClick={() => setShowReport(!showReport)}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{
              background: showReport
                ? "rgba(215,59,54,0.2)"
                : "rgba(255,255,255,0.07)",
              color: "#E8EEF6",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            ⚠️ Report Incident
          </button>

          {showReport && (
            <div className="flex flex-col gap-2">
              <select
                value={incType}
                onChange={(e) => setIncType(e.target.value as IncidentType)}
                className="w-full text-sm rounded-xl px-3 py-2.5"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "#E8EEF6",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {Object.values(IncidentType).map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Briefly describe the incident..."
                className="w-full text-sm rounded-xl px-3 py-2.5 resize-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "#E8EEF6",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 rounded-xl text-sm font-bold"
                style={{
                  background: "#D73B36",
                  color: "white",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Sending..." : "Submit Emergency Report"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
