import { Bell, User } from "lucide-react";

interface Props {
  city: string;
  currentTime: Date;
  alertCount: number;
}

export default function Header({ city, currentTime, alertCount }: Props) {
  const timeStr = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = currentTime.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header
      className="flex items-center justify-between px-5 py-3 shrink-0"
      style={{
        background: "#101822",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        height: "52px",
      }}
    >
      <div>
        <h1 className="text-sm font-semibold" style={{ color: "#E8EEF6" }}>
          Dashboard
        </h1>
        <p
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "#6F7C8D" }}
        >
          {city} &bull; {dateStr} &bull; {timeStr}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative p-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <Bell size={15} style={{ color: "#A7B3C2" }} />
          {alertCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: "#FF3B30" }}
            />
          )}
        </button>
        <button
          type="button"
          className="p-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <User size={15} style={{ color: "#A7B3C2" }} />
        </button>
      </div>
    </header>
  );
}
