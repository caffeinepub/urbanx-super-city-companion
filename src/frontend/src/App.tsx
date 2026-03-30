import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  type AlertCategory,
  AlertSeverity,
  type CityAlert,
  type EmergencyContact,
  type IncidentReport,
  type IncidentType,
} from "./backend";
import AlertsPanel from "./components/AlertsPanel";
import DashboardOverlays from "./components/DashboardOverlays";
import EmergencyModal from "./components/EmergencyModal";
import FoodPanel from "./components/FoodPanel";
import Header from "./components/Header";
import MapView from "./components/MapView";
import SafetyPanel from "./components/SafetyPanel";
import ServicesPanel from "./components/ServicesPanel";
import Sidebar from "./components/Sidebar";
import TrafficPanel from "./components/TrafficPanel";
import WeatherPanel from "./components/WeatherPanel";
import { useActor } from "./hooks/useActor";

export type ActivePanel =
  | "dashboard"
  | "traffic"
  | "services"
  | "food"
  | "weather"
  | "alerts"
  | "safety";

export interface UserLocation {
  lat: number;
  lon: number;
  city: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  weatherCode: number;
}

export default function App() {
  const { actor } = useActor();
  const [activePanel, setActivePanel] = useState<ActivePanel>("dashboard");
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<CityAlert[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          let city = "Your City";
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            );
            const data = await resp.json();
            city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              "Your City";
          } catch {
            /* ignore */
          }
          setUserLocation({ lat, lon, city });
          if (actor) {
            try {
              await actor.checkInCity(city);
            } catch {
              /* ignore */
            }
          }
        },
        () =>
          setUserLocation({
            lat: 40.7128,
            lon: -74.006,
            city: "New York City",
          }),
        { timeout: 8000 },
      );
    } else {
      setUserLocation({ lat: 40.7128, lon: -74.006, city: "New York City" });
    }
  }, [actor]);

  useEffect(() => {
    if (!userLocation) return;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${userLocation.lat}&longitude=${userLocation.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
    )
      .then((r) => r.json())
      .then((data) => {
        const c = data.current;
        const code: number = c.weather_code;
        const conditions: Record<number, string> = {
          0: "Clear Sky",
          1: "Mainly Clear",
          2: "Partly Cloudy",
          3: "Overcast",
          45: "Foggy",
          48: "Icy Fog",
          51: "Light Drizzle",
          61: "Light Rain",
          71: "Light Snow",
          80: "Rain Showers",
          95: "Thunderstorm",
        };
        const condition =
          conditions[code] ||
          (code < 50 ? "Cloudy" : code < 70 ? "Rainy" : "Stormy");
        setWeather({
          temp: Math.round(c.temperature_2m),
          humidity: c.relative_humidity_2m,
          windSpeed: Math.round(c.wind_speed_10m),
          condition,
          weatherCode: code,
        });
      })
      .catch(() =>
        setWeather({
          temp: 22,
          humidity: 65,
          windSpeed: 12,
          condition: "Partly Cloudy",
          weatherCode: 2,
        }),
      );
  }, [userLocation]);

  const loadAlerts = useCallback(async () => {
    if (!actor) return;
    try {
      const a = await actor.getActiveAlerts();
      setAlerts(a);
      setAlertCount(a.filter((x) => x.severity === AlertSeverity.high).length);
    } catch {
      /* ignore */
    }
  }, [actor]);

  const loadIncidents = useCallback(async () => {
    if (!actor) return;
    try {
      setIncidents(await actor.getAllIncidents());
    } catch {
      /* ignore */
    }
  }, [actor]);

  const loadContacts = useCallback(async () => {
    if (!actor) return;
    try {
      setEmergencyContacts(await actor.getEmergencyContacts());
    } catch {
      /* ignore */
    }
  }, [actor]);

  const checkAdmin = useCallback(async () => {
    if (!actor) return;
    try {
      setIsAdmin(await actor.isCallerAdmin());
    } catch {
      /* ignore */
    }
  }, [actor]);

  useEffect(() => {
    loadAlerts();
    loadIncidents();
    loadContacts();
    checkAdmin();
  }, [loadAlerts, loadIncidents, loadContacts, checkAdmin]);

  const handleReportIncident = async (
    type: IncidentType,
    description: string,
  ) => {
    if (!userLocation || !actor) return;
    try {
      await actor.reportIncident(
        type,
        description,
        userLocation.lat,
        userLocation.lon,
      );
      toast.success("Incident reported successfully");
      loadIncidents();
    } catch {
      toast.error("Failed to report incident");
    }
  };

  const handleCreateAlert = async (
    title: string,
    description: string,
    category: AlertCategory,
    severity: AlertSeverity,
  ) => {
    if (!actor) return;
    try {
      await actor.createCityAlert(title, description, category, severity);
      toast.success("Alert created");
      loadAlerts();
    } catch {
      toast.error("Failed to create alert");
    }
  };

  const handleDeactivateAlert = async (id: bigint) => {
    if (!actor) return;
    try {
      await actor.deactivateAlert(id);
      toast.success("Alert deactivated");
      loadAlerts();
    } catch {
      toast.error("Failed to deactivate alert");
    }
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: "#0B0F14", fontFamily: "'Inter', sans-serif" }}
    >
      <Toaster theme="dark" position="top-right" />
      <Sidebar
        activePanel={activePanel}
        onNavigate={setActivePanel}
        alertCount={alertCount}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          city={userLocation?.city ?? "Locating..."}
          currentTime={currentTime}
          alertCount={alertCount}
        />
        <div className="relative flex-1 overflow-hidden">
          <MapView userLocation={userLocation} activePanel={activePanel} />
          {activePanel === "dashboard" && (
            <DashboardOverlays
              weather={weather}
              alerts={alerts}
              onNavigate={setActivePanel}
              onEmergency={() => setEmergencyOpen(true)}
            />
          )}
          {activePanel === "traffic" && (
            <TrafficPanel onClose={() => setActivePanel("dashboard")} />
          )}
          {activePanel === "services" && (
            <ServicesPanel
              userLocation={userLocation}
              onClose={() => setActivePanel("dashboard")}
            />
          )}
          {activePanel === "food" && (
            <FoodPanel
              userLocation={userLocation}
              onClose={() => setActivePanel("dashboard")}
            />
          )}
          {activePanel === "weather" && (
            <WeatherPanel
              weather={weather}
              userLocation={userLocation}
              onClose={() => setActivePanel("dashboard")}
            />
          )}
          {activePanel === "alerts" && (
            <AlertsPanel
              alerts={alerts}
              incidents={incidents}
              isAdmin={isAdmin}
              onCreateAlert={handleCreateAlert}
              onDeactivateAlert={handleDeactivateAlert}
              onClose={() => setActivePanel("dashboard")}
            />
          )}
          {activePanel === "safety" && (
            <SafetyPanel
              emergencyContacts={emergencyContacts}
              incidents={incidents}
              onReportIncident={handleReportIncident}
              onEmergency={() => setEmergencyOpen(true)}
              onClose={() => setActivePanel("dashboard")}
            />
          )}
          {activePanel === "dashboard" && (
            <button
              type="button"
              onClick={() => setEmergencyOpen(true)}
              className="absolute bottom-6 right-6 z-[1000] flex items-center gap-3"
            >
              <span
                className="px-5 py-3 text-sm font-bold text-white rounded-full flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #D73B36, #B62B2B)",
                  boxShadow: "0 4px 20px rgba(215,59,54,0.5)",
                }}
              >
                \ud83d\udea8 EMERGENCY
              </span>
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm pulse-red"
                style={{
                  background: "linear-gradient(135deg, #D73B36, #B62B2B)",
                  boxShadow: "0 4px 20px rgba(215,59,54,0.6)",
                }}
              >
                SOS
              </span>
            </button>
          )}
        </div>
      </div>
      <EmergencyModal
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        emergencyContacts={emergencyContacts}
        onReportIncident={handleReportIncident}
      />
    </div>
  );
}
