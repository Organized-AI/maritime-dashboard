// Agent Activity Simulator - Generates realistic agent data streaming activity
import { Vessel } from '@/types';

export interface AgentActivity {
  id: string;
  agentType: 'weather' | 'navigation' | 'incident' | 'compliance' | 'communication';
  vesselId: string;
  vesselName: string;
  action: string;
  skillUsed: string;
  confidence: number; // 0-100
  timestamp: Date;
  dataGenerated: number; // kilobytes
  processingTime: number; // milliseconds
}

export interface AgentStats {
  totalInvocations: number;
  activeStreams: number;
  avgResponseTime: number;
  dataPointsGenerated: number;
}

// Helper functions
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max + 1));
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generate a random agent activity event
 */
export function generateAgentActivity(vessels: Vessel[]): AgentActivity {
  if (vessels.length === 0) {
    // Fallback if no vessels
    return {
      id: `activity-${Date.now()}-${Math.random()}`,
      agentType: 'weather',
      vesselId: 'unknown',
      vesselName: 'System',
      action: 'System initialization',
      skillUsed: 'systemInit()',
      confidence: 100,
      timestamp: new Date(),
      dataGenerated: 0.1,
      processingTime: 50,
    };
  }

  const vessel = randomItem(vessels);
  const agentType = randomItem(['weather', 'navigation', 'incident', 'compliance', 'communication'] as const);

  const agentActions = getAgentActions(agentType, vessel);
  const action = randomItem(agentActions);

  return {
    id: `activity-${Date.now()}-${Math.random()}`,
    agentType,
    vesselId: vessel.id,
    vesselName: vessel.name,
    action: action.description,
    skillUsed: action.skill,
    confidence: randomInt(85, 99),
    timestamp: new Date(),
    dataGenerated: random(0.5, 5.0), // KB
    processingTime: randomInt(120, 350), // ms
  };
}

/**
 * Get possible actions for each agent type
 */
function getAgentActions(
  agentType: AgentActivity['agentType'],
  vessel: Vessel
): { description: string; skill: string }[] {
  switch (agentType) {
    case 'weather':
      return [
        { description: `Generated 6-hour forecast`, skill: 'generateWeatherForecast()' },
        { description: `Detected weather alert condition`, skill: 'generateWeatherAlerts()' },
        { description: `Analyzed pressure trends`, skill: 'analyzeWeatherTrends()' },
        { description: `Created voyage recommendations`, skill: 'generateWeatherRecommendations()' },
        { description: `Updated wave height predictions`, skill: 'calculateWaveConditions()' },
      ];

    case 'navigation':
      return [
        { description: `Calculated fuel optimization for ${vessel.type}`, skill: 'calculateFuelConsumption()' },
        { description: `Scanned ${randomInt(8, 20)} nearby vessels`, skill: 'generateNearbyVessels()' },
        { description: `Detected navigation hazard ahead`, skill: 'generateNavigationHazards()' },
        { description: `Optimized route efficiency`, skill: 'generateRouteOptimization()' },
        { description: `Updated collision avoidance data`, skill: 'calculateCPA_TCPA()' },
        { description: `Calculated ETA to ${vessel.destination}`, skill: 'calculateETA()' },
      ];

    case 'incident':
      return [
        { description: `Performed system health scan`, skill: 'scanVesselSystems()' },
        { description: `Assessed operational risk level`, skill: 'assessRiskLevel()' },
        { description: `Monitored mechanical systems`, skill: 'monitorMechanicalStatus()' },
        { description: `Verified safety equipment status`, skill: 'checkSafetyEquipment()' },
        { description: `Analyzed crew health metrics`, skill: 'monitorCrewHealth()' },
      ];

    case 'compliance':
      return [
        { description: `Verified SOLAS compliance status`, skill: 'checkSOLASCompliance()' },
        { description: `Checked MARPOL regulations`, skill: 'verifyMARPOLStatus()' },
        { description: `Validated crew certifications`, skill: 'validateCrewCerts()' },
        { description: `Reviewed ${vessel.destination} port regulations`, skill: 'checkPortRegulations()' },
        { description: `Updated emission compliance data`, skill: 'monitorEmissions()' },
      ];

    case 'communication':
      return [
        { description: `Tested VHF channel connectivity`, skill: 'testVHFChannels()' },
        { description: `Verified SATCOM link strength`, skill: 'verifySATCOMLink()' },
        { description: `Updated AIS broadcast status`, skill: 'updateAISStatus()' },
        { description: `Processed incoming messages`, skill: 'processMessages()' },
        { description: `Synchronized communication systems`, skill: 'syncCommSystems()' },
      ];

    default:
      return [{ description: 'Processing data', skill: 'processData()' }];
  }
}

/**
 * Calculate aggregated agent statistics
 */
export function calculateAgentStats(activities: AgentActivity[]): AgentStats {
  if (activities.length === 0) {
    return {
      totalInvocations: 0,
      activeStreams: 0,
      avgResponseTime: 0,
      dataPointsGenerated: 0,
    };
  }

  // Count activities in last minute as "active streams"
  const now = Date.now();
  const activeStreams = activities.filter(
    a => (now - a.timestamp.getTime()) < 60000
  ).length;

  // Calculate average response time
  const avgResponseTime = activities.reduce((sum, a) => sum + a.processingTime, 0) / activities.length;

  // Total data generated (sum of all dataGenerated)
  const totalDataKB = activities.reduce((sum, a) => sum + a.dataGenerated, 0);
  // Convert KB to "data points" (approximate: 1KB ≈ 100 data points)
  const dataPointsGenerated = Math.round(totalDataKB * 100);

  return {
    totalInvocations: activities.length,
    activeStreams,
    avgResponseTime: Math.round(avgResponseTime),
    dataPointsGenerated,
  };
}

/**
 * Get agent display name
 */
export function getAgentDisplayName(agentType: AgentActivity['agentType']): string {
  switch (agentType) {
    case 'weather': return 'Weather Agent';
    case 'navigation': return 'Navigation Agent';
    case 'incident': return 'Incident Agent';
    case 'compliance': return 'Compliance Agent';
    case 'communication': return 'Communication Agent';
  }
}

/**
 * Get agent color for UI
 */
export function getAgentColor(agentType: AgentActivity['agentType']): {
  border: string;
  bg: string;
  text: string;
  icon: string;
} {
  switch (agentType) {
    case 'weather':
      return {
        border: 'border-l-blue-500',
        bg: 'bg-blue-900/20',
        text: 'text-blue-300',
        icon: 'text-blue-400',
      };
    case 'navigation':
      return {
        border: 'border-l-green-500',
        bg: 'bg-green-900/20',
        text: 'text-green-300',
        icon: 'text-green-400',
      };
    case 'incident':
      return {
        border: 'border-l-red-500',
        bg: 'bg-red-900/20',
        text: 'text-red-300',
        icon: 'text-red-400',
      };
    case 'compliance':
      return {
        border: 'border-l-yellow-500',
        bg: 'bg-yellow-900/20',
        text: 'text-yellow-300',
        icon: 'text-yellow-400',
      };
    case 'communication':
      return {
        border: 'border-l-purple-500',
        bg: 'bg-purple-900/20',
        text: 'text-purple-300',
        icon: 'text-purple-400',
      };
  }
}

/**
 * Get agent emoji icon
 */
export function getAgentEmoji(agentType: AgentActivity['agentType']): string {
  switch (agentType) {
    case 'weather': return '🌦️';
    case 'navigation': return '🧭';
    case 'incident': return '🚨';
    case 'compliance': return '📋';
    case 'communication': return '📡';
  }
}
