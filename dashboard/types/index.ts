// Maritime AI Dashboard Type Definitions

export type ConnectivityStatus = 'online' | 'offline' | 'degraded' | 'satellite';

export type IncidentType =
  | 'weather'
  | 'criminal'
  | 'geopolitical'
  | 'financial'
  | 'mechanical'
  | 'medical'
  | 'environmental'
  | 'collision_risk'
  | 'man_overboard';

export type IncidentSeverity = 1 | 2 | 3 | 4 | 5;

export type IncidentStatus = 'active' | 'resolved' | 'monitoring' | 'acknowledged';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VesselHistoricalPosition {
  position: Coordinates;
  speed: number;
  heading: number;
  timestamp: string;
}

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  type: string;
  flag: string;
  position: Coordinates;
  speed: number; // knots
  heading: number; // degrees
  destination: string;
  eta: string; // ISO date string
  status: 'active' | 'anchored' | 'moored' | 'underway';
  connectivity: ConnectivityStatus;
  lastUpdate: string; // ISO date string
  crew: number;
  fuelLevel: number; // percentage
  historicalPositions?: VesselHistoricalPosition[]; // Track for route trails
}

export interface WeatherData {
  temperature: number; // Celsius
  pressure: number; // hPa
  humidity: number; // percentage
  windSpeed: number; // knots
  windDirection: number; // degrees
  waveHeight: number; // meters
  visibility: number; // nautical miles
  conditions: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  vesselId: string;
  vesselName: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  location: Coordinates;
  locationDescription: string;
  timestamp: string;
  resolvedAt?: string;
  damageAssessment?: string;
  responseAssigned?: string;
  agentRecommendation?: string;
}

export interface VesselAgent {
  type: 'weather' | 'navigation' | 'incident' | 'compliance' | 'communication';
  status: 'active' | 'idle' | 'processing';
  lastAction: string;
  timestamp: string;
  confidence: number; // 0-100

  // Agent-specific data (populated by agent skills - mimics RESTful API response)
  data?: any; // Will be typed specifically as WeatherAgentData | NavigationAgentData | etc.
}

export interface DataQuality {
  source: string;
  reliability: number; // 0-100
  lastUpdate: string;
  confidence: number; // 0-100
  age: number; // minutes since last update
}

export interface FleetStatistics {
  totalVessels: number;
  activeVessels: number;
  anchoredVessels: number;
  offlineVessels: number;
  activeIncidents: number;
  criticalIncidents: number;
  averageFuelLevel: number;
}

export interface NavigationRoute {
  id: string;
  vesselId: string;
  waypoints: Coordinates[];
  plannedRoute: Coordinates[];
  actualRoute: Coordinates[];
  deviations: {
    location: Coordinates;
    distance: number; // nautical miles
    timestamp: string;
    reason?: string;
  }[];
  eta: string;
  distanceRemaining: number; // nautical miles
}

// Weather Overlay Types
export interface WeatherOverlayData {
  windData: WindData[];
  temperatureData: TemperatureData[];
  waveData: WaveData[];
  stormSystems: StormSystem[];
  timestamp: string;
}

export interface WindData {
  position: Coordinates;
  speed: number; // knots
  direction: number; // degrees
}

export interface TemperatureData {
  position: Coordinates;
  temperature: number; // Celsius
}

export interface WaveData {
  position: Coordinates;
  height: number; // meters
}

export interface StormSystem {
  id: string;
  type: 'tropical_storm' | 'cyclone' | 'thunderstorm' | 'fog' | 'heavy_rain';
  center: Coordinates;
  radius: number; // nautical miles
  severity: 1 | 2 | 3 | 4 | 5;
  name?: string;
  timestamp: string;
}

// Measurement Types
export type MeasurementType = 'distance' | 'route' | 'area';

export type MeasurementUnit = 'nm' | 'km' | 'mi' | 'sqnm' | 'sqkm' | 'sqmi';

export interface Measurement {
  id: string;
  type: MeasurementType;
  points: Coordinates[];
  value: number;
  unit: MeasurementUnit;
  timestamp: string;
  label?: string;
}

export interface DistanceMeasurement extends Measurement {
  type: 'distance';
  bearing?: number; // compass bearing in degrees
}

export interface RouteMeasurement extends Measurement {
  type: 'route';
  segments: {
    from: Coordinates;
    to: Coordinates;
    distance: number;
  }[];
  totalDistance: number;
}

export interface AreaMeasurement extends Measurement {
  type: 'area';
  perimeter: number;
  area: number;
}

// Route Trail Types
export type TrailTimeRange = '1h' | '6h' | '12h' | '24h' | '7d';

export interface RouteTrailConfig {
  enabled: boolean;
  timeRange: TrailTimeRange;
  opacity: number; // 0-100
  showTimestamps: boolean;
}

// Map Layer Control Types
export interface MapLayerState {
  routeTrails: boolean;
  incidents: boolean;
  weather: {
    enabled: boolean;
    wind: boolean;
    temperature: boolean;
    waves: boolean;
    storms: boolean;
  };
  measurements: {
    enabled: boolean;
    activeMode: MeasurementType | null;
  };
}
