// Mock Data Generator for Maritime AI Dashboard
import {
  Vessel,
  Incident,
  WeatherData,
  FleetStatistics,
  VesselAgent,
  DataQuality,
  ConnectivityStatus,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  VesselHistoricalPosition,
  WeatherOverlayData,
  WindData,
  TemperatureData,
  WaveData,
  StormSystem,
  TrailTimeRange,
} from '@/types';

// Vessel names and types
const vesselNames = [
  'Atlantic Pioneer', 'Pacific Explorer', 'Nordic Star', 'Ocean Voyager',
  'Maritime Spirit', 'Sea Guardian', 'Wave Master', 'Blue Horizon',
  'Northern Light', 'Southern Cross', 'Eastern Dawn', 'Western Wind'
];

const vesselTypes = [
  'Container Ship', 'Bulk Carrier', 'Tanker', 'Cargo Ship',
  'Fishing Vessel', 'Research Vessel', 'Passenger Ship'
];

const destinations = [
  'Rotterdam', 'Singapore', 'Shanghai', 'Hamburg', 'Los Angeles',
  'Antwerp', 'Tokyo', 'Hong Kong', 'Dubai', 'New York'
];

const flags = ['US', 'GB', 'NO', 'DE', 'NL', 'SG', 'JP', 'KR'];

// Helper to generate random number in range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Helper to generate random integer in range
const randomInt = (min: number, max: number) => Math.floor(random(min, max + 1));

// Helper to pick random item from array
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate random coordinates (maritime areas)
const generateCoordinates = () => ({
  latitude: random(-60, 70),
  longitude: random(-180, 180),
});

// Generate mock vessels
export const generateMockVessels = (count: number = 12): Vessel[] => {
  const usedNames = new Set<string>();

  return Array.from({ length: count }, (_, i) => {
    let name = randomItem(vesselNames);
    while (usedNames.has(name)) {
      name = `${randomItem(vesselNames)} ${randomInt(1, 99)}`;
    }
    usedNames.add(name);

    const position = generateCoordinates();
    const status = randomItem(['active', 'anchored', 'moored', 'underway'] as const);
    const connectivity: ConnectivityStatus = randomItem([
      'online', 'online', 'online', 'satellite', 'degraded', 'offline'
    ]);

    const vessel: Vessel = {
      id: `vessel-${i + 1}`,
      name,
      imo: `IMO${randomInt(1000000, 9999999)}`,
      mmsi: `${randomInt(100000000, 999999999)}`,
      type: randomItem(vesselTypes),
      flag: randomItem(flags),
      position,
      speed: status === 'anchored' || status === 'moored' ? 0 : random(0, 25),
      heading: randomInt(0, 359),
      destination: randomItem(destinations),
      eta: new Date(Date.now() + randomInt(1, 14) * 24 * 60 * 60 * 1000).toISOString(),
      status,
      connectivity,
      lastUpdate: new Date(Date.now() - randomInt(0, 3600) * 1000).toISOString(),
      crew: randomInt(10, 35),
      fuelLevel: randomInt(20, 100),
      historicalPositions: [], // Will be populated by generateVesselHistory if needed
    };

    return vessel;
  });
};

// Generate mock incidents
export const generateMockIncidents = (vessels: Vessel[], count: number = 8): Incident[] => {
  const incidentTypes: IncidentType[] = [
    'weather', 'criminal', 'geopolitical', 'financial',
    'mechanical', 'medical', 'environmental', 'collision_risk'
  ];

  const incidentTitles: Record<IncidentType, string[]> = {
    weather: [
      'Severe Storm Warning',
      'Dense Fog Advisory',
      'High Seas Alert',
      'Tropical Cyclone Warning'
    ],
    criminal: [
      'Piracy Alert in Vicinity',
      'Suspicious Vessel Nearby',
      'Attempted Boarding'
    ],
    geopolitical: [
      'Restricted Zone Entry',
      'Border Dispute Area',
      'Military Exercise Zone'
    ],
    financial: [
      'Port Fee Dispute',
      'Currency Exchange Issue',
      'Fuel Cost Spike'
    ],
    mechanical: [
      'Engine Temperature Warning',
      'Navigation System Fault',
      'Fuel Leak Detected',
      'Steering Malfunction'
    ],
    medical: [
      'Crew Member Injury',
      'Medical Emergency Onboard',
      'Quarantine Required'
    ],
    environmental: [
      'Oil Spill Detected',
      'Marine Wildlife Encounter',
      'Pollution Alert'
    ],
    collision_risk: [
      'Collision Course Detected',
      'Vessel Too Close',
      'AIS Discrepancy'
    ],
    man_overboard: [
      'Man Overboard Alert'
    ]
  };

  const statuses: IncidentStatus[] = ['active', 'monitoring', 'acknowledged', 'resolved'];

  return Array.from({ length: count }, (_, i) => {
    const vessel = randomItem(vessels);
    const type = randomItem(incidentTypes);
    const severity = randomInt(1, 5) as IncidentSeverity;
    const status: IncidentStatus = severity >= 4 ? 'active' : randomItem(statuses);
    const timestamp = new Date(Date.now() - randomInt(0, 48) * 60 * 60 * 1000).toISOString();

    return {
      id: `incident-${i + 1}`,
      vesselId: vessel.id,
      vesselName: vessel.name,
      type,
      severity,
      status,
      title: randomItem(incidentTitles[type]),
      description: `Incident detected at ${new Date(timestamp).toLocaleString()}. Vessel crew notified. ${
        severity >= 4 ? 'Immediate action required.' : 'Monitoring situation.'
      }`,
      location: vessel.position,
      locationDescription: `${Math.abs(vessel.position.latitude).toFixed(2)}°${
        vessel.position.latitude >= 0 ? 'N' : 'S'
      }, ${Math.abs(vessel.position.longitude).toFixed(2)}°${
        vessel.position.longitude >= 0 ? 'E' : 'W'
      }`,
      timestamp,
      resolvedAt: status === 'resolved'
        ? new Date(new Date(timestamp).getTime() + randomInt(1, 24) * 60 * 60 * 1000).toISOString()
        : undefined,
      agentRecommendation: severity >= 3
        ? `AI Agent recommends ${type === 'weather' ? 'route deviation' : type === 'mechanical' ? 'immediate inspection' : 'alerting authorities'}.`
        : undefined,
    };
  });
};

// Generate mock weather data
export const generateMockWeather = (): WeatherData => {
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Storm', 'Fog'];

  return {
    temperature: random(5, 35),
    pressure: random(980, 1030),
    humidity: randomInt(40, 95),
    windSpeed: random(0, 45),
    windDirection: randomInt(0, 359),
    waveHeight: random(0, 8),
    visibility: random(0.5, 10),
    conditions: randomItem(conditions),
    timestamp: new Date().toISOString(),
  };
};

// Import agent skills (mimics RESTful API services)
import { generateWeatherAgentData } from './agents/weatherAgentSkills';
import { generateNavigationAgentData } from './agents/navigationAgentSkills';

/**
 * Generate vessel agents with comprehensive data
 * Mimics a RESTful API response where each agent endpoint returns detailed data
 */
export const generateMockAgents = (vessel: Vessel, weather: WeatherData): VesselAgent[] => {
  return [
    {
      type: 'weather',
      status: 'active',
      lastAction: 'Monitoring storm patterns',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      confidence: randomInt(85, 99),
      // API-like: GET /api/vessels/:id/agents/weather
      data: generateWeatherAgentData(vessel, weather),
    },
    {
      type: 'navigation',
      status: 'active',
      lastAction: 'Route optimization complete',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      confidence: randomInt(90, 99),
      // API-like: GET /api/vessels/:id/agents/navigation
      data: generateNavigationAgentData(vessel),
    },
    {
      type: 'incident',
      status: 'idle',
      lastAction: 'No incidents detected',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      confidence: randomInt(95, 99),
      // API-like: GET /api/vessels/:id/agents/incident
      // TODO: Add incidentAgentSkills when implemented
      data: null,
    },
    {
      type: 'compliance',
      status: 'active',
      lastAction: 'Checking port regulations',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      confidence: randomInt(88, 99),
      // API-like: GET /api/vessels/:id/agents/compliance
      // TODO: Add complianceAgentSkills when implemented
      data: null,
    },
    {
      type: 'communication',
      status: 'active',
      lastAction: 'Satellite link stable',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      confidence: randomInt(92, 99),
      // API-like: GET /api/vessels/:id/agents/communication
      // TODO: Add communicationAgentSkills when implemented
      data: null,
    },
  ];
};

// Generate data quality indicators
export const generateDataQuality = (): DataQuality[] => {
  return [
    {
      source: 'AIS Data',
      reliability: randomInt(90, 99),
      lastUpdate: new Date(Date.now() - randomInt(1, 5) * 60 * 1000).toISOString(),
      confidence: randomInt(95, 99),
      age: randomInt(1, 5),
    },
    {
      source: 'Weather Service',
      reliability: randomInt(85, 95),
      lastUpdate: new Date(Date.now() - randomInt(5, 15) * 60 * 1000).toISOString(),
      confidence: randomInt(88, 96),
      age: randomInt(5, 15),
    },
    {
      source: 'GPS Position',
      reliability: randomInt(95, 100),
      lastUpdate: new Date(Date.now() - randomInt(0, 2) * 60 * 1000).toISOString(),
      confidence: randomInt(98, 100),
      age: randomInt(0, 2),
    },
    {
      source: 'Maritime Traffic',
      reliability: randomInt(80, 92),
      lastUpdate: new Date(Date.now() - randomInt(2, 10) * 60 * 1000).toISOString(),
      confidence: randomInt(85, 94),
      age: randomInt(2, 10),
    },
  ];
};

// Calculate fleet statistics
export const calculateFleetStats = (vessels: Vessel[], incidents: Incident[]): FleetStatistics => {
  const activeIncidents = incidents.filter(i => i.status === 'active');
  const criticalIncidents = activeIncidents.filter(i => i.severity >= 4);

  return {
    totalVessels: vessels.length,
    activeVessels: vessels.filter(v => v.status === 'active' || v.status === 'underway').length,
    anchoredVessels: vessels.filter(v => v.status === 'anchored' || v.status === 'moored').length,
    offlineVessels: vessels.filter(v => v.connectivity === 'offline').length,
    activeIncidents: activeIncidents.length,
    criticalIncidents: criticalIncidents.length,
    averageFuelLevel: Math.round(
      vessels.reduce((sum, v) => sum + v.fuelLevel, 0) / vessels.length
    ),
  };
};

// Simulate real-time updates
export const simulateVesselUpdate = (vessel: Vessel): Vessel => {
  const newSpeed = Math.max(0, vessel.speed + random(-2, 2));
  const newHeading = (vessel.heading + randomInt(-10, 10) + 360) % 360;

  // Update position based on speed and heading (simplified)
  const distanceKm = (newSpeed * 1.852) / 60; // Convert knots to km per minute
  const latChange = (distanceKm / 111) * Math.cos((newHeading * Math.PI) / 180);
  const lonChange = (distanceKm / (111 * Math.cos((vessel.position.latitude * Math.PI) / 180))) *
                     Math.sin((newHeading * Math.PI) / 180);

  const newPosition = {
    latitude: vessel.position.latitude + latChange,
    longitude: vessel.position.longitude + lonChange,
  };

  // Add current position to history
  const newHistoricalPosition: VesselHistoricalPosition = {
    position: vessel.position,
    speed: vessel.speed,
    heading: vessel.heading,
    timestamp: vessel.lastUpdate,
  };

  const updatedHistory = vessel.historicalPositions || [];
  updatedHistory.push(newHistoricalPosition);

  // Keep only last 7 days of history (604800 seconds)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const filteredHistory = updatedHistory.filter(
    h => new Date(h.timestamp).getTime() > sevenDaysAgo
  );

  return {
    ...vessel,
    speed: newSpeed,
    heading: newHeading,
    position: newPosition,
    lastUpdate: new Date().toISOString(),
    fuelLevel: Math.max(0, vessel.fuelLevel - random(0, 0.1)),
    historicalPositions: filteredHistory,
  };
};

// Generate historical positions for a vessel
export const generateVesselHistory = (
  vessel: Vessel,
  hours: number = 24
): VesselHistoricalPosition[] => {
  const history: VesselHistoricalPosition[] = [];
  const now = Date.now();
  const intervalMinutes = 5; // Record position every 5 minutes
  const totalIntervals = (hours * 60) / intervalMinutes;

  let currentPos = vessel.position;
  let currentSpeed = vessel.speed;
  let currentHeading = vessel.heading;

  for (let i = totalIntervals; i >= 0; i--) {
    const timestamp = new Date(now - i * intervalMinutes * 60 * 1000).toISOString();

    history.push({
      position: { ...currentPos },
      speed: currentSpeed,
      heading: currentHeading,
      timestamp,
    });

    // Simulate movement for next interval
    if (i > 0 && (vessel.status === 'active' || vessel.status === 'underway')) {
      currentSpeed = Math.max(0, currentSpeed + random(-1, 1));
      currentHeading = (currentHeading + randomInt(-5, 5) + 360) % 360;

      const distanceKm = (currentSpeed * 1.852 * intervalMinutes) / 60;
      const latChange = (distanceKm / 111) * Math.cos((currentHeading * Math.PI) / 180);
      const lonChange =
        (distanceKm / (111 * Math.cos((currentPos.latitude * Math.PI) / 180))) *
        Math.sin((currentHeading * Math.PI) / 180);

      currentPos = {
        latitude: currentPos.latitude + latChange,
        longitude: currentPos.longitude + lonChange,
      };
    }
  }

  return history;
};

// Filter vessel history by time range
export const filterVesselHistory = (
  history: VesselHistoricalPosition[],
  timeRange: TrailTimeRange
): VesselHistoricalPosition[] => {
  const now = Date.now();
  const msMap: Record<TrailTimeRange, number> = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
  };

  const cutoff = now - msMap[timeRange];
  return history.filter(h => new Date(h.timestamp).getTime() > cutoff);
};

// Generate weather overlay data
export const generateWeatherOverlayData = (): WeatherOverlayData => {
  const windData: WindData[] = [];
  const temperatureData: TemperatureData[] = [];
  const waveData: WaveData[] = [];

  // Generate grid of weather data points (10x10 grid across typical maritime area)
  for (let lat = -60; lat <= 70; lat += 13) {
    for (let lon = -180; lon <= 180; lon += 36) {
      windData.push({
        position: { latitude: lat + random(-5, 5), longitude: lon + random(-10, 10) },
        speed: random(0, 45),
        direction: randomInt(0, 359),
      });

      temperatureData.push({
        position: { latitude: lat + random(-5, 5), longitude: lon + random(-10, 10) },
        temperature: random(5, 35),
      });

      waveData.push({
        position: { latitude: lat + random(-5, 5), longitude: lon + random(-10, 10) },
        height: random(0, 8),
      });
    }
  }

  // Generate storm systems
  const stormTypes: StormSystem['type'][] = [
    'tropical_storm',
    'cyclone',
    'thunderstorm',
    'fog',
    'heavy_rain',
  ];

  const stormSystems: StormSystem[] = Array.from({ length: randomInt(2, 5) }, (_, i) => ({
    id: `storm-${i + 1}`,
    type: randomItem(stormTypes),
    center: generateCoordinates(),
    radius: randomInt(50, 300),
    severity: randomInt(1, 5) as 1 | 2 | 3 | 4 | 5,
    name: randomInt(1, 10) > 7 ? `Storm ${String.fromCharCode(65 + i)}` : undefined,
    timestamp: new Date().toISOString(),
  }));

  return {
    windData,
    temperatureData,
    waveData,
    stormSystems,
    timestamp: new Date().toISOString(),
  };
};
