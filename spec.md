# UrbanX Super City Companion

## Current State
New project — no existing app code.

## Requested Changes (Diff)

### Add
- Full-screen interactive map (Leaflet.js + OpenStreetMap) as primary canvas
- Left sidebar navigation with sections: Dashboard, Traffic, Services, Food, Weather/AQI, Alerts, Safety, Profile, Settings
- Header bar with city name, current time, notification bell, user avatar
- Weather & AQI floating card (browser Geolocation + OpenWeatherMap-style mock)
- Traffic Status floating card (mock real-time status)
- City Alerts floating card (amber-tinted warnings)
- Nearby Services panel: hospitals, ATMs, pharmacies, police within 1-2km (mock data seeded by geolocation)
- Food Discovery panel: nearby restaurants/cafes with category filters
- Weather/AQI panel with detailed metrics (temp, humidity, wind, AQI breakdown)
- City Alerts & News feed panel
- Emergency & Safety Module: large red SOS button, incident reporting form (harassment, accident, fire, medical), quick-dial cards for police/ambulance/fire, nearest emergency services on map
- Backend stores: incident reports, user-submitted alerts
- Map markers for nearby services color-coded by type
- Bottom action cards row floating over map
- Emergency SOS pill + button prominent on map overlay
- Dark glassmorphism UI throughout

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store incident reports and city alerts (CRUD)
2. Select http-outcalls component for potential weather/map data
3. Frontend: dark dashboard layout with Leaflet map, sidebar nav, floating overlays
4. Integrate browser Geolocation for user position
5. Simulate nearby services using geolocation offset (no Google Maps API key needed)
6. Weather widget using OpenMeteo free API (no key required)
7. Emergency module with incident form wired to backend
8. City alerts feed wired to backend
