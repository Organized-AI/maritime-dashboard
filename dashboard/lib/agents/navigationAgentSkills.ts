// Navigation Agent Skills - Generates route optimization and traffic monitoring data
import { Vessel, Coordinates } from '@/types';

// Helper functions
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max + 1));
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export interface RouteOptimization {
  currentRouteFuelEfficiency: number; // percentage
  estimatedFuelSavings: number; // percentage
  alternateRoutesAvailable: number;
  optimizationStatus: 'optimal' | 'good' | 'needs_adjustment';
  recommendations: string[];
}

export interface NearbyVessel {
  id: string;
  name: string;
  type: string;
  distance: number; // nautical miles
  bearing: number; // degrees
  speed: number; // knots
  heading: number; // degrees
  cpa: number; // closest point of approach (nautical miles)
  tcpa: number; // time to CPA (minutes)
  riskLevel: 'low' | 'moderate' | 'high';
}

export interface NavigationHazard {
  id: string;
  type: 'traffic_separation' | 'shallow_water' | 'restricted_area' | 'construction' | 'reef';
  name: string;
  distance: number; // nautical miles ahead
  description: string;
  action: Required | string;
  severity: 'info' | 'warning' | 'critical';
}

export interface WaypointInfo {
  id: string;
  name: string;
  position: Coordinates;
  eta: string;
  distance: number; // nautical miles
  bearing: number; // degrees
  passed: boolean;
}

export interface NavigationAgentData {
  routeStatus: {
    onTrack: boolean;
    deviation: number; // nautical miles
    distanceToDestination: number;
    estimatedTimeRemaining: string;
    nextWaypoint: WaypointInfo | null;
  };
  routeOptimization: RouteOptimization;
  collisionAvoidance: {
    monitoring: boolean;
    nearbyVessels: NearbyVessel[];
    totalVesselsInRange: number;
    highRiskEncounters: number;
  };
  navigationHazards: NavigationHazard[];
  performance: {
    averageSpeed: number;
    speedOptimal: boolean;
    fuelConsumptionRate: number; // tons per day
    distanceTraveled24h: number; // nautical miles
  };
  recommendations: string[];
  lastUpdate: string;
}

/**
 * Generate comprehensive navigation data for a vessel
 */
export function generateNavigationAgentData(vessel: Vessel): NavigationAgentData {
  const distanceToDestination = calculateDistanceToDestination(vessel);
  const nearbyVessels = generateNearbyVessels(vessel);
  const routeOptimization = generateRouteOptimization(vessel);
  const hazards = generateNavigationHazards(vessel, distanceToDestination);
  const nextWaypoint = generateNextWaypoint(vessel, distanceToDestination);

  const routeStatus = {
    onTrack: Math.random() > 0.2, // 80% chance on track
    deviation: random(0.1, 2.5),
    distanceToDestination,
    estimatedTimeRemaining: calculateETA(distanceToDestination, vessel.speed),
    nextWaypoint,
  };

  const highRiskVessels = nearbyVessels.filter(v => v.riskLevel === 'high');

  const performance = {
    averageSpeed: vessel.speed + random(-0.5, 0.5),
    speedOptimal: vessel.speed > 10 && vessel.speed < 20,
    fuelConsumptionRate: calculateFuelConsumption(vessel),
    distanceTraveled24h: vessel.speed * 24 + random(-10, 10),
  };

  const recommendations = generateNavigationRecommendations(
    routeStatus,
    routeOptimization,
    nearbyVessels,
    hazards,
    vessel
  );

  return {
    routeStatus,
    routeOptimization,
    collisionAvoidance: {
      monitoring: true,
      nearbyVessels,
      totalVesselsInRange: nearbyVessels.length,
      highRiskEncounters: highRiskVessels.length,
    },
    navigationHazards: hazards,
    performance,
    recommendations,
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * Calculate distance to destination
 */
function calculateDistanceToDestination(vessel: Vessel): number {
  // Realistic distance based on vessel type and status
  if (vessel.status === 'anchored' || vessel.status === 'moored') {
    return randomInt(50, 200);
  }

  // Vary by vessel type (longer routes for cargo/tankers)
  const multiplier = vessel.type === 'Container Ship' || vessel.type === 'Tanker' ? 1.5 : 1.0;
  return randomInt(300, 2000) * multiplier;
}

/**
 * Generate nearby vessels for collision avoidance
 */
function generateNearbyVessels(vessel: Vessel): NearbyVessel[] {
  const count = randomInt(5, 15);
  const vessels: NearbyVessel[] = [];
  const vesselTypes = ['Container Ship', 'Tanker', 'Cargo Ship', 'Fishing Vessel', 'Passenger Ship'];

  for (let i = 0; i < count; i++) {
    const distance = random(0.5, 10);
    const bearing = randomInt(0, 359);
    const speed = random(5, 20);
    const heading = randomInt(0, 359);

    // Calculate CPA (simplified)
    const cpa = random(0.2, 5);
    const tcpa = randomInt(10, 120);

    // Risk based on CPA and TCPA
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    if (cpa < 1 && tcpa < 30) riskLevel = 'high';
    else if (cpa < 2 && tcpa < 60) riskLevel = 'moderate';

    vessels.push({
      id: `nearby-${i}`,
      name: `${randomItem(['Sea', 'Ocean', 'Maritime', 'Pacific', 'Atlantic'])} ${randomItem(['Pioneer', 'Spirit', 'Voyager', 'Explorer', 'Navigator'])}`,
      type: randomItem(vesselTypes),
      distance,
      bearing,
      speed,
      heading,
      cpa,
      tcpa,
      riskLevel,
    });
  }

  return vessels.sort((a, b) => a.distance - b.distance);
}

/**
 * Generate route optimization data
 */
function generateRouteOptimization(vessel: Vessel): RouteOptimization {
  const efficiency = randomInt(92, 99);
  const savings = random(1.5, 5.5);
  const alternates = randomInt(1, 3);

  const recommendations: string[] = [];

  if (efficiency < 95) {
    recommendations.push('Consider alternate route for improved fuel efficiency');
  } else {
    recommendations.push('Current route is fuel-optimal');
  }

  if (savings > 3) {
    recommendations.push(`Estimated fuel savings: ${savings.toFixed(1)}%`);
  }

  // Vessel-specific recommendations
  if (vessel.type === 'Tanker' || vessel.type === 'Container Ship') {
    recommendations.push('Deep water route recommended for vessel draft');
  }

  return {
    currentRouteFuelEfficiency: efficiency,
    estimatedFuelSavings: savings,
    alternateRoutesAvailable: alternates,
    optimizationStatus: efficiency > 96 ? 'optimal' : efficiency > 93 ? 'good' : 'needs_adjustment',
    recommendations,
  };
}

/**
 * Generate navigation hazards
 */
function generateNavigationHazards(vessel: Vessel, distanceToDestination: number): NavigationHazard[] {
  const hazards: NavigationHazard[] = [];

  // Traffic separation scheme (common for vessels approaching ports)
  if (distanceToDestination < 500 && Math.random() > 0.4) {
    hazards.push({
      id: 'hazard-tss',
      type: 'traffic_separation',
      name: 'Traffic Separation Scheme',
      distance: randomInt(20, 150),
      description: `TSS entry in ${randomInt(20, 150)} nm - course adjustment required to ${randomItem(['enter starboard lane', 'cross at right angles', 'follow traffic flow'])}`,
      action: 'Adjust course to comply with TSS regulations',
      severity: 'warning',
    });
  }

  // Shallow water warning for large vessels
  if ((vessel.type === 'Container Ship' || vessel.type === 'Tanker') && Math.random() > 0.7) {
    hazards.push({
      id: 'hazard-shallow',
      type: 'shallow_water',
      name: 'Shallow Water Area',
      distance: randomInt(40, 200),
      description: `Charted depth ${randomInt(15, 35)}m - monitor depth sounder closely`,
      action: 'Reduce speed and increase monitoring',
      severity: 'warning',
    });
  }

  // Restricted area
  if (Math.random() > 0.8) {
    hazards.push({
      id: 'hazard-restricted',
      type: 'restricted_area',
      name: randomItem(['Military Exercise Area', 'Marine Protected Zone', 'Submarine Operating Area']),
      distance: randomInt(60, 300),
      description: randomItem([
        'Military exercises in progress - maintain safe distance',
        'Protected marine area - no anchoring or fishing',
        'Submarine operations - exercise caution',
      ]),
      action: 'Route around restricted zone or request permission',
      severity: 'info',
    });
  }

  return hazards;
}

/**
 * Generate next waypoint information
 */
function generateNextWaypoint(vessel: Vessel, distanceToDestination: number): WaypointInfo | null {
  if (distanceToDestination < 100) {
    return null; // Close to destination, no intermediate waypoints
  }

  const waypointDistance = randomInt(50, 300);
  const bearing = randomInt(0, 359);

  return {
    id: `waypoint-${randomInt(1, 20)}`,
    name: `WP-${randomInt(1, 20)}`,
    position: {
      latitude: vessel.position.latitude + random(-1, 1),
      longitude: vessel.position.longitude + random(-1, 1),
    },
    eta: new Date(Date.now() + (waypointDistance / vessel.speed) * 60 * 60 * 1000).toISOString(),
    distance: waypointDistance,
    bearing,
    passed: false,
  };
}

/**
 * Calculate ETA string
 */
function calculateETA(distance: number, speed: number): string {
  if (speed === 0) return 'N/A';

  const hours = distance / speed;
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);

  if (days > 0) {
    return `${days}d ${remainingHours}h`;
  }
  return `${remainingHours}h`;
}

/**
 * Calculate fuel consumption based on vessel type and speed
 */
function calculateFuelConsumption(vessel: Vessel): number {
  // Base consumption varies by vessel type
  let baseConsumption = 50; // tons per day

  switch (vessel.type) {
    case 'Container Ship':
      baseConsumption = random(150, 250);
      break;
    case 'Tanker':
      baseConsumption = random(80, 150);
      break;
    case 'Bulk Carrier':
      baseConsumption = random(60, 100);
      break;
    case 'Cargo Ship':
      baseConsumption = random(40, 80);
      break;
    case 'Passenger Ship':
      baseConsumption = random(200, 350);
      break;
    case 'Fishing Vessel':
      baseConsumption = random(5, 15);
      break;
    default:
      baseConsumption = random(30, 70);
  }

  // Adjust for speed (fuel consumption increases exponentially with speed)
  const speedFactor = Math.pow(vessel.speed / 15, 2.5);

  return baseConsumption * speedFactor;
}

/**
 * Generate navigation recommendations
 */
function generateNavigationRecommendations(
  routeStatus: NavigationAgentData['routeStatus'],
  optimization: RouteOptimization,
  nearbyVessels: NearbyVessel[],
  hazards: NavigationHazard[],
  vessel: Vessel
): string[] {
  const recommendations: string[] = [];

  // Route status
  if (routeStatus.onTrack) {
    if (routeStatus.deviation < 0.5) {
      recommendations.push('Route tracking excellent - minimal deviation');
    } else {
      recommendations.push(`On track with ${routeStatus.deviation.toFixed(1)} nm deviation`);
    }
  } else {
    recommendations.push('Course correction recommended to return to planned route');
  }

  // Collision avoidance
  const highRiskVessels = nearbyVessels.filter(v => v.riskLevel === 'high');
  if (highRiskVessels.length > 0) {
    recommendations.push(`${highRiskVessels.length} high-risk encounter(s) - increase bridge monitoring`);
  } else {
    recommendations.push(`Monitoring ${nearbyVessels.length} vessels in vicinity - no immediate threats`);
  }

  // Hazards
  if (hazards.length > 0) {
    const criticalHazards = hazards.filter(h => h.severity === 'critical');
    if (criticalHazards.length > 0) {
      recommendations.push(`Critical: ${criticalHazards[0].name} ahead - ${criticalHazards[0].action}`);
    } else {
      recommendations.push(`${hazards[0].name} ahead in ${hazards[0].distance} nm`);
    }
  }

  // Optimization
  if (optimization.optimizationStatus === 'optimal') {
    recommendations.push('Route optimization: Excellent fuel efficiency');
  } else if (optimization.optimizationStatus === 'needs_adjustment') {
    recommendations.push('Route optimization: Consider alternate route for better efficiency');
  }

  return recommendations;
}

/**
 * Update navigation data with realistic progression
 */
export function updateNavigationData(
  current: NavigationAgentData,
  vessel: Vessel,
  timeElapsedMinutes: number
): NavigationAgentData {
  // Update distance to destination
  const distanceTraveled = (vessel.speed * timeElapsedMinutes) / 60;
  const newDistance = Math.max(0, current.routeStatus.distanceToDestination - distanceTraveled);

  // Update nearby vessels (they move too)
  const updatedNearbyVessels = current.collisionAvoidance.nearbyVessels.map(v => ({
    ...v,
    distance: Math.max(0.1, v.distance + random(-0.5, 0.5)),
    bearing: (v.bearing + random(-5, 5) + 360) % 360,
    tcpa: Math.max(0, v.tcpa - timeElapsedMinutes),
  }));

  return {
    ...current,
    routeStatus: {
      ...current.routeStatus,
      distanceToDestination: newDistance,
      deviation: Math.max(0, current.routeStatus.deviation + random(-0.1, 0.2)),
      estimatedTimeRemaining: calculateETA(newDistance, vessel.speed),
    },
    collisionAvoidance: {
      ...current.collisionAvoidance,
      nearbyVessels: updatedNearbyVessels,
    },
    performance: {
      ...current.performance,
      distanceTraveled24h: current.performance.distanceTraveled24h + distanceTraveled,
    },
    lastUpdate: new Date().toISOString(),
  };
}
