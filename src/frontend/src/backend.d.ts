import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface IncidentReport {
    id: bigint;
    status: IncidentStatus;
    latitude: number;
    description: string;
    longitude: number;
    timestamp: Time;
    reporter: Principal;
    incidentType: IncidentType;
}
export type Time = bigint;
export interface EmergencyContact {
    contactType: ContactType;
    name: string;
    number: string;
}
export interface CityAlert {
    id: bigint;
    title: string;
    active: boolean;
    description: string;
    timestamp: Time;
    category: AlertCategory;
    severity: AlertSeverity;
}
export interface LocationSession {
    city: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export enum AlertCategory {
    emergency = "emergency",
    construction = "construction",
    event = "event",
    traffic = "traffic",
    weather = "weather"
}
export enum AlertSeverity {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum ContactType {
    other = "other",
    fire = "fire",
    ambulance = "ambulance",
    police = "police"
}
export enum IncidentStatus {
    resolved = "resolved",
    pending = "pending"
}
export enum IncidentType {
    accident = "accident",
    other = "other",
    fire = "fire",
    harassment = "harassment",
    medical = "medical"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkInCity(city: string): Promise<void>;
    createCityAlert(title: string, description: string, category: AlertCategory, severity: AlertSeverity): Promise<bigint>;
    deactivateAlert(id: bigint): Promise<void>;
    getActiveAlerts(): Promise<Array<CityAlert>>;
    getAllAlerts(): Promise<Array<CityAlert>>;
    getAllIncidents(): Promise<Array<IncidentReport>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEmergencyContacts(): Promise<Array<EmergencyContact>>;
    getIncidentsByType(incidentType: IncidentType): Promise<Array<IncidentReport>>;
    getRecentLocationSessions(): Promise<Array<LocationSession>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    reportIncident(incidentType: IncidentType, description: string, latitude: number, longitude: number): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateIncidentStatus(id: bigint, status: IncidentStatus): Promise<void>;
}
