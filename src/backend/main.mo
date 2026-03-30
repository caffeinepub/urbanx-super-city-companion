import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // TYPES + COMPARE MODULES
  type IncidentType = {
    #harassment;
    #accident;
    #fire;
    #medical;
    #other;
  };
  module IncidentType {
    public func toText(incidentType : IncidentType) : Text {
      switch (incidentType) {
        case (#harassment) { "harassment" };
        case (#accident) { "accident" };
        case (#fire) { "fire" };
        case (#medical) { "medical" };
        case (#other) { "other" };
      };
    };

    public func compare(incidentType1 : IncidentType, incidentType2 : IncidentType) : Order.Order {
      Text.compare(IncidentType.toText(incidentType1), IncidentType.toText(incidentType2));
    };
  };

  type IncidentStatus = {
    #pending;
    #resolved;
  };

  module IncidentStatus {
    public func toText(status : IncidentStatus) : Text {
      switch (status) {
        case (#pending) { "pending" };
        case (#resolved) { "resolved" };
      };
    };

    public func compare(status1 : IncidentStatus, status2 : IncidentStatus) : Order.Order {
      Text.compare(IncidentStatus.toText(status1), IncidentStatus.toText(status2));
    };
  };

  public type IncidentReport = {
    id : Nat;
    reporter : Principal;
    incidentType : IncidentType;
    description : Text;
    latitude : Float;
    longitude : Float;
    timestamp : Time.Time;
    status : IncidentStatus;
  };

  module IncidentReport {
    public func compare(incidentReport1 : IncidentReport, incidentReport2 : IncidentReport) : Order.Order {
      Nat.compare(incidentReport1.id, incidentReport2.id);
    };
  };

  type AlertCategory = {
    #traffic;
    #weather;
    #construction;
    #event;
    #emergency;
  };

  module AlertCategory {
    public func toText(category : AlertCategory) : Text {
      switch (category) {
        case (#traffic) { "traffic" };
        case (#weather) { "weather" };
        case (#construction) { "construction" };
        case (#event) { "event" };
        case (#emergency) { "emergency" };
      };
    };
    public func compare(category1 : AlertCategory, category2 : AlertCategory) : Order.Order {
      Text.compare(AlertCategory.toText(category1), AlertCategory.toText(category2));
    };
  };

  public type AlertSeverity = {
    #low;
    #medium;
    #high;
  };

  module AlertSeverity {
    public func toText(severity : AlertSeverity) : Text {
      switch (severity) {
        case (#low) { "low" };
        case (#medium) { "medium" };
        case (#high) { "high" };
      };
    };

    public func compare(severity1 : AlertSeverity, severity2 : AlertSeverity) : Order.Order {
      Text.compare(AlertSeverity.toText(severity1), AlertSeverity.toText(severity2));
    };
  };

  public type CityAlert = {
    id : Nat;
    title : Text;
    description : Text;
    category : AlertCategory;
    severity : AlertSeverity;
    timestamp : Time.Time;
    active : Bool;
  };

  module CityAlert {
    public func compare(cityAlert1 : CityAlert, cityAlert2 : CityAlert) : Order.Order {
      Nat.compare(cityAlert1.id, cityAlert2.id);
    };
  };

  type ContactType = {
    #police;
    #ambulance;
    #fire;
    #other;
  };

  type EmergencyContact = {
    name : Text;
    number : Text;
    contactType : ContactType;
  };

  module EmergencyContact {
    public func compareByContactType(contact1 : EmergencyContact, contact2 : EmergencyContact) : Order.Order {
      switch (contact1.contactType, contact2.contactType) {
        case (#police, #ambulance) { #less };
        case (#police, #fire) { #less };
        case (#police, #other) { #less };
        case (#ambulance, #police) { #greater };
        case (#ambulance, #fire) { #less };
        case (#ambulance, #other) { #less };
        case (#fire, #police) { #greater };
        case (#fire, #ambulance) { #greater };
        case (#fire, #other) { #less };
        case (#other, #police) { #greater };
        case (#other, #ambulance) { #greater };
        case (#other, #fire) { #greater };
        // Fallback to name comparison if same contact type
        case (t1, t2) { Text.compare(contact1.name, contact2.name) };
      };
    };
  };

  public type LocationSession = {
    city : Text;
    timestamp : Time.Time;
  };

  module LocationSession {
    public func compare(locationSession1 : LocationSession, locationSession2 : LocationSession) : Order.Order {
      Text.compare(locationSession1.city, locationSession2.city);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // STATE
  var nextIncidentId = 1;
  let incidentReports = Map.empty<Nat, IncidentReport>();

  var nextAlertId = 1;
  let cityAlerts = Map.empty<Nat, CityAlert>();

  let emergencyContacts = List.empty<EmergencyContact>();

  let locationSessions = List.empty<LocationSession>();

  let userProfiles = Map.empty<Principal, UserProfile>();

  // SEED CONTACTS
  let seedContacts = [
    {
      name = "Police";
      number = "100";
      contactType = #police;
    },
    {
      name = "Ambulance";
      number = "101";
      contactType = #ambulance;
    },
    {
      name = "Fire";
      number = "102";
      contactType = #fire;
    },
    {
      name = "General Emergency";
      number = "112";
      contactType = #other;
    },
  ];

  for (contact in seedContacts.values()) {
    emergencyContacts.add(contact);
  };

  // USER PROFILE FUNCTIONS
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // INCIDENT REPORTS
  public shared ({ caller }) func reportIncident(incidentType : IncidentType, description : Text, latitude : Float, longitude : Float) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can report incidents");
    };
    let id = nextIncidentId;
    nextIncidentId += 1;

    let report : IncidentReport = {
      id;
      reporter = caller;
      incidentType;
      description;
      latitude;
      longitude;
      timestamp = Time.now();
      status = #pending;
    };

    incidentReports.add(id, report);
    id;
  };

  public query ({ caller }) func getAllIncidents() : async [IncidentReport] {
    // Public safety information - accessible to all including guests
    incidentReports.values().toArray().sort();
  };

  public query ({ caller }) func getIncidentsByType(incidentType : IncidentType) : async [IncidentReport] {
    // Public safety information - accessible to all including guests
    incidentReports.values().toArray().filter(func(report) { report.incidentType == incidentType }).sort();
  };

  public shared ({ caller }) func updateIncidentStatus(id : Nat, status : IncidentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update incident status");
    };
    switch (incidentReports.get(id)) {
      case (null) {
        Runtime.trap("Incident not found");
      };
      case (?report) {
        let updated = {
          id = report.id : Nat;
          reporter = report.reporter : Principal;
          incidentType = report.incidentType : IncidentType;
          description = report.description : Text;
          latitude = report.latitude : Float;
          longitude = report.longitude : Float;
          timestamp = report.timestamp : Int;
          status;
        };
        incidentReports.add(id, updated);
      };
    };
  };

  // CITY ALERTS
  public shared ({ caller }) func createCityAlert(title : Text, description : Text, category : AlertCategory, severity : AlertSeverity) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create city alerts");
    };
    let id = nextAlertId;
    nextAlertId += 1;

    let alert : CityAlert = {
      id;
      title;
      description;
      category;
      severity;
      timestamp = Time.now();
      active = true;
    };

    cityAlerts.add(id, alert);
    id;
  };

  public query ({ caller }) func getActiveAlerts() : async [CityAlert] {
    // Public safety information - accessible to all including guests
    cityAlerts.values().toArray().filter(func(alert) { alert.active }).sort();
  };

  public query ({ caller }) func getAllAlerts() : async [CityAlert] {
    // Public safety information - accessible to all including guests
    cityAlerts.values().toArray().sort();
  };

  public shared ({ caller }) func deactivateAlert(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can deactivate alerts");
    };
    switch (cityAlerts.get(id)) {
      case (null) {
        Runtime.trap("Alert not found");
      };
      case (?alert) {
        let updated = {
          id = alert.id : Nat;
          title = alert.title : Text;
          description = alert.description : Text;
          category = alert.category : AlertCategory;
          severity = alert.severity : AlertSeverity;
          timestamp = alert.timestamp : Int;
          active = false;
        };
        cityAlerts.add(id, updated);
      };
    };
  };

  // EMERGENCY CONTACTS
  public query ({ caller }) func getEmergencyContacts() : async [EmergencyContact] {
    // Critical public safety information - accessible to all including guests
    emergencyContacts.toArray().sort(EmergencyContact.compareByContactType);
  };

  // LOCATION SESSIONS
  public shared ({ caller }) func checkInCity(city : Text) : async () {
    // Anonymous analytics - accessible to all including guests
    locationSessions.add({
      city;
      timestamp = Time.now();
    });
  };

  public query ({ caller }) func getRecentLocationSessions() : async [LocationSession] {
    // Analytics data - accessible to all including guests
    locationSessions.toArray().sort();
  };
};
