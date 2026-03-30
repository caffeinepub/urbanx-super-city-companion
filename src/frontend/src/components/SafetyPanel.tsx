import { AlertTriangle, Phone, Shield, X } from "lucide-react";
import { useState } from "react";
import {
  ContactType,
  type EmergencyContact,
  type IncidentReport,
  IncidentType,
} from "../backend";

const CONTACT_COLOR: Record<string, string> = {
  police: "#4169E1",
  ambulance: "#38D27A",
  fire: "#D73B36",
  other: "#4AA3FF",
};

const CONTACT_EMOJI: Record<string, string> = {
  police: "\ud83d\udc6e",
  ambulance: "\ud83d\ude91",
  fire: "\ud83d\udd25",
  other: "\ud83d\udcde",
};

const DEFAULT_CONTACTS = [
  { name: "Police Emergency", number: "911", contactType: ContactType.police },
  {
    name: "Ambulance / EMS",
    number: "911",
    contactType: ContactType.ambulance,
  },
  { name: "Fire Department", number: "911", contactType: ContactType.fire },
  { name: "Crisis Helpline", number: "988", contactType: ContactType.other },
];

interface Props {
  emergencyContacts: EmergencyContact[];
  incidents: IncidentReport[];
  onReportIncident: (type: IncidentType, desc: string) => Promise<void>;
  onEmergency: () => void;
  onClose: () => void;
}

export default function SafetyPanel({
  emergencyContacts,
  incidents,
  onReportIncident,
  onEmergency,
  onClose,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [incType, setIncType] = useState<IncidentType>(IncidentType.accident);
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const contacts =
    emergencyContacts.length > 0 ? emergencyContacts : DEFAULT_CONTACTS;

  const handleSubmit = async () => {
    if (!desc.trim()) return;
    setSubmitting(true);
    await onReportIncident(incType, desc);
    setDesc("");
    setShowForm(false);
    setSubmitting(false);
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
          <Shield size={16} style={{ color: "#38D27A" }} />
          <span className="font-semibold text-sm" style={{ color: "#E8EEF6" }}>
            Safety & Emergency
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
        <button
          type="button"
          onClick={onEmergency}
          className="w-full py-4 rounded-2xl font-bold text-white text-base pulse-red"
          style={{
            background: "linear-gradient(135deg, #D73B36, #B62B2B)",
            boxShadow: "0 4px 20px rgba(215,59,54,0.4)",
          }}
        >
          \ud83d\udea8 EMERGENCY SOS
        </button>

        <section>
          <h3
            className="text-xs font-semibold mb-2 uppercase tracking-widest"
            style={{ color: "#6F7C8D" }}
          >
            Emergency Contacts
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {contacts.map((c) => (
              <a
                key={`${c.name}-${c.number}`}
                href={`tel:${c.number}`}
                className="glass-card p-3 flex flex-col items-center gap-1.5 hover:border-opacity-30 transition-colors"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: `${CONTACT_COLOR[c.contactType]}15` }}
                >
                  {CONTACT_EMOJI[c.contactType] ?? "\ud83d\udcde"}
                </div>
                <span
                  className="text-xs font-medium text-center"
                  style={{ color: "#E8EEF6" }}
                >
                  {c.name}
                </span>
                <div className="flex items-center gap-1">
                  <Phone
                    size={9}
                    style={{ color: CONTACT_COLOR[c.contactType] }}
                  />
                  <span
                    className="text-xs font-bold"
                    style={{ color: CONTACT_COLOR[c.contactType] }}
                  >
                    {c.number}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#6F7C8D" }}
            >
              Report Incident
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: "rgba(74,163,255,0.1)", color: "#4AA3FF" }}
            >
              {showForm ? "Cancel" : "+ Report"}
            </button>
          </div>
          {showForm && (
            <div className="glass-card p-4 flex flex-col gap-2">
              <select
                value={incType}
                onChange={(e) => setIncType(e.target.value as IncidentType)}
                className="w-full text-sm rounded-lg px-3 py-2"
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
                placeholder="Describe what happened..."
                className="w-full text-sm rounded-lg px-3 py-2 resize-none"
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
                className="w-full py-2 rounded-lg text-sm font-semibold"
                style={{ background: "#D73B36", color: "white" }}
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          )}
        </section>

        {incidents.length > 0 && (
          <section>
            <h3
              className="text-xs font-semibold mb-2 uppercase tracking-widest"
              style={{ color: "#6F7C8D" }}
            >
              Recent Incidents Nearby
            </h3>
            {incidents.slice(0, 4).map((inc) => (
              <div key={String(inc.id)} className="glass-card p-3 mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} style={{ color: "#F2A23A" }} />
                  <span
                    className="text-xs font-medium capitalize"
                    style={{ color: "#E8EEF6" }}
                  >
                    {inc.incidentType}
                  </span>
                  <span
                    className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{
                      color: inc.status === "pending" ? "#F2A23A" : "#38D27A",
                      background:
                        inc.status === "pending"
                          ? "rgba(242,162,58,0.15)"
                          : "rgba(56,210,122,0.15)",
                    }}
                  >
                    {inc.status}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "#6F7C8D" }}>
                  {inc.description}
                </p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
