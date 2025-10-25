'use client';

import { useState, useEffect } from 'react';
import { VesselAgent, WeatherData, Vessel } from '@/types';
import {
  X,
  Cloud,
  Wind,
  Waves,
  Thermometer,
  Eye,
  Gauge,
  Navigation,
  MapPin,
  AlertTriangle,
  Shield,
  CheckCircle,
  Radio,
  Satellite,
  MessageSquare,
  Activity,
  TrendingUp,
  TrendingDown,
  Anchor,
  Route,
  Ship,
  FileCheck,
  BookOpen,
  Users,
  Code,
  Loader,
} from 'lucide-react';

interface AgentDetailProps {
  agent: VesselAgent;
  vessel: Vessel;
  weather?: WeatherData;
  onClose: () => void;
}

export default function AgentDetail({ agent, vessel, weather, onClose }: AgentDetailProps) {
  const [showSkillsDebug, setShowSkillsDebug] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  // Define agent-specific loading steps
  const getLoadingSteps = (type: string): string[] => {
    switch (type) {
      case 'weather':
        return [
          'Fetching vessel position data...',
          'Calling forecast skill (vessel context)...',
          'Running alert detection algorithms...',
          'Generating recommendations...',
          'Analysis complete'
        ];
      case 'navigation':
        return [
          'Analyzing vessel route...',
          'Calculating fuel optimization...',
          'Scanning for nearby vessels...',
          'Detecting navigation hazards...',
          'Route analysis complete'
        ];
      case 'incident':
        return [
          'Scanning vessel systems...',
          'Running risk assessment...',
          'Monitoring status...',
          'Analysis complete'
        ];
      case 'compliance':
        return [
          'Checking SOLAS compliance...',
          'Verifying MARPOL regulations...',
          'Reviewing crew certifications...',
          'Compliance check complete'
        ];
      case 'communication':
        return [
          'Testing VHF channels...',
          'Verifying SATCOM link...',
          'Checking AIS status...',
          'Communication systems verified'
        ];
      default:
        return ['Loading agent data...', 'Complete'];
    }
  };

  const loadingSteps = getLoadingSteps(agent.type);

  // Animate through loading steps
  useEffect(() => {
    if (loadingStep < loadingSteps.length) {
      const timer = setTimeout(() => {
        setLoadingStep(loadingStep + 1);
      }, 400); // 400ms per step

      return () => clearTimeout(timer);
    } else {
      // All steps complete, hide loading screen
      const finalTimer = setTimeout(() => {
        setIsLoadingSkills(false);
      }, 300);
      return () => clearTimeout(finalTimer);
    }
  }, [loadingStep, loadingSteps.length]);

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'weather': return Cloud;
      case 'navigation': return Navigation;
      case 'incident': return AlertTriangle;
      case 'compliance': return Shield;
      case 'communication': return Radio;
      default: return Activity;
    }
  };

  const getAgentColor = (type: string) => {
    switch (type) {
      case 'weather': return 'from-blue-900/30 to-cyan-900/30 border-blue-700';
      case 'navigation': return 'from-green-900/30 to-emerald-900/30 border-green-700';
      case 'incident': return 'from-red-900/30 to-orange-900/30 border-red-700';
      case 'compliance': return 'from-yellow-900/30 to-amber-900/30 border-yellow-700';
      case 'communication': return 'from-purple-900/30 to-indigo-900/30 border-purple-700';
      default: return 'from-slate-900/30 to-gray-900/30 border-slate-700';
    }
  };

  const getAgentIconColor = (type: string) => {
    switch (type) {
      case 'weather': return 'text-blue-400';
      case 'navigation': return 'text-green-400';
      case 'incident': return 'text-red-400';
      case 'compliance': return 'text-yellow-400';
      case 'communication': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeSince = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const AgentIcon = getAgentIcon(agent.type);

  // Access agent-specific data (API-like response)
  const weatherData = agent.type === 'weather' ? agent.data : null;
  const navigationData = agent.type === 'navigation' ? agent.data : null;

  // Helper component to show skill source when debug mode is on
  const SkillSource = ({ skill, endpoint }: { skill: string; endpoint?: string }) => {
    if (!showSkillsDebug) return null;

    return (
      <div className="mt-1 px-2 py-1 bg-purple-900/40 border border-purple-700/50 rounded text-xs font-mono">
        <span className="text-purple-300">📦 Skill:</span>{' '}
        <span className="text-purple-200">{skill}</span>
        {endpoint && (
          <>
            <br />
            <span className="text-purple-300">🔗 API:</span>{' '}
            <span className="text-purple-200">{endpoint}</span>
          </>
        )}
      </div>
    );
  };

  const renderWeatherAgentData = () => {
    // Use rich weather agent data if available, otherwise fallback to basic weather
    const currentWeather = weatherData?.currentConditions || weather;
    const alerts = weatherData?.alerts || [];
    const recommendations = weatherData?.recommendations || [];

    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Thermometer className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400 uppercase">Temperature</p>
            </div>
            <p className="text-2xl font-bold text-white">{currentWeather?.temperature.toFixed(1)}°C</p>
            <p className="text-xs text-gray-500 mt-1">
              {weatherData?.trends?.temperatureTrend === 'rising' && '↗ Rising'}
              {weatherData?.trends?.temperatureTrend === 'falling' && '↘ Falling'}
              {weatherData?.trends?.temperatureTrend === 'stable' && '→ Stable'}
              {!weatherData?.trends && 'Sea surface temp'}
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400 uppercase">Wind Speed</p>
            </div>
            <p className="text-2xl font-bold text-white">{currentWeather?.windSpeed.toFixed(1)} kts</p>
            <p className="text-xs text-gray-500 mt-1">Direction: {currentWeather?.windDirection}°</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Waves className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400 uppercase">Wave Height</p>
            </div>
            <p className="text-2xl font-bold text-white">{currentWeather?.waveHeight.toFixed(1)} m</p>
            <p className="text-xs text-gray-500 mt-1">{(currentWeather?.waveHeight ?? 0) > 3 ? 'Rough seas' : 'Moderate'}</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400 uppercase">Visibility</p>
            </div>
            <p className="text-2xl font-bold text-white">{currentWeather?.visibility.toFixed(1)} nm</p>
            <p className="text-xs text-gray-500 mt-1">{(currentWeather?.visibility ?? 0) > 5 ? 'Good' : 'Limited'}</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Gauge className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400 uppercase">Pressure</p>
            </div>
            <p className="text-2xl font-bold text-white">{currentWeather?.pressure.toFixed(0)} hPa</p>
            <p className="text-xs text-gray-500 mt-1">
              {weatherData?.trends?.pressureTrend === 'rising' && '↗ Rising'}
              {weatherData?.trends?.pressureTrend === 'falling' && '↘ Falling'}
              {weatherData?.trends?.pressureTrend === 'stable' && '→ Stable'}
              {!weatherData?.trends && ((currentWeather?.pressure ?? 0) < 1000 ? 'Low' : 'Normal')}
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400 uppercase">Humidity</p>
            </div>
            <p className="text-2xl font-bold text-white">{currentWeather?.humidity}%</p>
            <p className="text-xs text-gray-500 mt-1">{currentWeather?.conditions}</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
            Weather Forecast & Alerts
          </h4>
          <SkillSource
            skill="generateWeatherRecommendations()"
            endpoint="GET /api/vessels/{id}/agents/weather/recommendations"
          />
          <div className="space-y-2 mt-2">
            {recommendations.length > 0 ? (
              recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">{rec}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">No severe weather warnings</p>
                    <p className="text-xs text-gray-400">Conditions expected to remain stable</p>
                  </div>
                </div>
              </>
            )}

            {alerts.map((alert, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                  alert.severity === 'severe' || alert.severity === 'high' ? 'text-red-400' :
                  alert.severity === 'moderate' ? 'text-yellow-400' : 'text-blue-400'
                }`} />
                <div>
                  <p className="text-sm text-white">{alert.title}</p>
                  <p className="text-xs text-gray-400">{alert.description}</p>
                  <SkillSource
                    skill="generateWeatherAlerts()"
                    endpoint="GET /api/vessels/{id}/agents/weather/alerts"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderNavigationAgentData = () => {
    // Use rich navigation agent data if available
    const routeStatus = navigationData?.routeStatus;
    const optimization = navigationData?.routeOptimization;
    const collisionAvoidance = navigationData?.collisionAvoidance;
    const hazards = navigationData?.navigationHazards || [];
    const performance = navigationData?.performance;
    const recommendations = navigationData?.recommendations || [];

    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Gauge className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400 uppercase">Current Speed</p>
            </div>
            <p className="text-2xl font-bold text-white">{vessel.speed.toFixed(1)} kts</p>
            <p className="text-xs text-gray-500 mt-1">
              {performance ? (
                performance.speedOptimal ? 'Optimal cruise speed' : 'Speed adjustment recommended'
              ) : 'Optimal cruise speed'}
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Navigation className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400 uppercase">Heading</p>
            </div>
            <p className="text-2xl font-bold text-white">{Math.round(vessel.heading)}°</p>
            <p className="text-xs text-gray-500 mt-1">True bearing</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Route className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400 uppercase">Route Status</p>
            </div>
            <p className={`text-2xl font-bold ${routeStatus?.onTrack ? 'text-green-400' : 'text-yellow-400'}`}>
              {routeStatus?.onTrack ? 'On Track' : 'Off Track'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {routeStatus ? `${routeStatus.deviation.toFixed(1)} nm deviation` : '0.2 nm deviation'}
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400 uppercase">Distance to Dest</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {routeStatus ? `${Math.round(routeStatus.distanceToDestination)} nm` : '847 nm'}
            </p>
            <p className="text-xs text-gray-500 mt-1">To {vessel.destination}</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400 uppercase">ETA</p>
            </div>
            <p className="text-lg font-bold text-white">
              {routeStatus?.estimatedTimeRemaining ||
                new Date(vessel.eta).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {!routeStatus && new Date(vessel.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {routeStatus && 'Time remaining'}
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Ship className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400 uppercase">Nearby Vessels</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {collisionAvoidance?.totalVesselsInRange || 12}
            </p>
            <p className={`text-xs mt-1 ${
              collisionAvoidance?.highRiskEncounters && collisionAvoidance.highRiskEncounters > 0
                ? 'text-red-400'
                : 'text-gray-500'
            }`}>
              {collisionAvoidance?.highRiskEncounters
                ? `${collisionAvoidance.highRiskEncounters} high-risk encounter${collisionAvoidance.highRiskEncounters > 1 ? 's' : ''}`
                : 'Within 10 nm'}
            </p>
          </div>
        </div>

        {/* Performance Section */}
        {performance && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-white mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-green-400" />
              Performance Metrics
            </h4>
            <SkillSource
              skill="calculateFuelConsumption() + performance metrics"
              endpoint="GET /api/vessels/{id}/agents/navigation/performance"
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              <div>
                <p className="text-xs text-gray-400">Avg Speed (24h)</p>
                <p className="text-lg font-bold text-white">{performance.averageSpeed.toFixed(1)} kts</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fuel Consumption</p>
                <p className="text-lg font-bold text-white">{performance.fuelConsumptionRate.toFixed(1)} t/day</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Distance (24h)</p>
                <p className="text-lg font-bold text-white">{Math.round(performance.distanceTraveled24h)} nm</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fuel Efficiency</p>
                <p className="text-lg font-bold text-white">
                  {optimization?.currentRouteFuelEfficiency || 95}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Route Optimization & Recommendations */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <Route className="w-4 h-4 mr-2 text-green-400" />
            Route Optimization
          </h4>
          <div className="space-y-2">
            {recommendations.length > 0 ? (
              recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">{rec}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">Current route is fuel-optimal</p>
                    <p className="text-xs text-gray-400">Estimated fuel savings: 3.2%</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Activity className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">Collision avoidance active</p>
                    <p className="text-xs text-gray-400">Monitoring 12 vessels in vicinity</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation Hazards */}
        {hazards.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-white mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
              Navigation Hazards
            </h4>
            <div className="space-y-2">
              {hazards.map((hazard, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                    hazard.severity === 'critical' ? 'text-red-400' :
                    hazard.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                  <div>
                    <p className="text-sm text-white">{hazard.name}</p>
                    <p className="text-xs text-gray-400">{hazard.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Action: {hazard.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collision Avoidance - Nearby Vessels */}
        {collisionAvoidance && collisionAvoidance.nearbyVessels.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3 flex items-center">
              <Ship className="w-4 h-4 mr-2 text-green-400" />
              Nearby Vessels (Top 5 Closest)
            </h4>
            <SkillSource
              skill="generateNearbyVessels() with CPA/TCPA calculations"
              endpoint="GET /api/vessels/{id}/agents/navigation/collision-avoidance"
            />
            <div className="space-y-3 mt-2">
              {collisionAvoidance.nearbyVessels.slice(0, 5).map((vessel, idx) => (
                <div key={idx} className="border-b border-slate-700 pb-2 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-white font-semibold">{vessel.name}</p>
                      <p className="text-xs text-gray-400">{vessel.type}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      vessel.riskLevel === 'high' ? 'bg-red-900/50 text-red-300' :
                      vessel.riskLevel === 'moderate' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-green-900/50 text-green-300'
                    }`}>
                      {vessel.riskLevel} risk
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-gray-400">Distance:</span>
                      <span className="text-white ml-1">{vessel.distance.toFixed(1)} nm</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Bearing:</span>
                      <span className="text-white ml-1">{Math.round(vessel.bearing)}°</span>
                    </div>
                    <div>
                      <span className="text-gray-400">CPA:</span>
                      <span className="text-white ml-1">{vessel.cpa.toFixed(1)} nm</span>
                    </div>
                    <div>
                      <span className="text-gray-400">TCPA:</span>
                      <span className="text-white ml-1">{vessel.tcpa} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderIncidentAgentData = () => (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <p className="text-xs text-gray-400 uppercase">Active Incidents</p>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-green-500 mt-1">All systems normal</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-red-400" />
            <p className="text-xs text-gray-400 uppercase">Risk Level</p>
          </div>
          <p className="text-2xl font-bold text-green-400">Low</p>
          <p className="text-xs text-gray-500 mt-1">No immediate threats</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2 text-red-400" />
          Monitoring Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-white">Weather hazards: None detected</p>
              <p className="text-xs text-gray-400">Continuous monitoring active</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-white">Mechanical systems: Operational</p>
              <p className="text-xs text-gray-400">All critical systems functioning normally</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-white">Security alerts: None</p>
              <p className="text-xs text-gray-400">No suspicious activity detected</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-white">Medical emergencies: None</p>
              <p className="text-xs text-gray-400">Crew health status normal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-red-400" />
          Recent Activity Log
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-start border-b border-slate-700 pb-2">
            <span className="text-gray-400">System health check completed</span>
            <span className="text-gray-500 text-xs">15m ago</span>
          </div>
          <div className="flex justify-between items-start border-b border-slate-700 pb-2">
            <span className="text-gray-400">Emergency equipment inspection passed</span>
            <span className="text-gray-500 text-xs">2h ago</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-400">SAR beacon test successful</span>
            <span className="text-gray-500 text-xs">6h ago</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderComplianceAgentData = () => (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-gray-400 uppercase">SOLAS Compliance</p>
          </div>
          <p className="text-2xl font-bold text-green-400">100%</p>
          <p className="text-xs text-green-500 mt-1">Fully compliant</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Waves className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-gray-400 uppercase">MARPOL Status</p>
          </div>
          <p className="text-2xl font-bold text-green-400">Compliant</p>
          <p className="text-xs text-gray-500 mt-1">Environmental regs met</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-gray-400 uppercase">Crew Certifications</p>
          </div>
          <p className="text-2xl font-bold text-white">{vessel.crew}/{ vessel.crew}</p>
          <p className="text-xs text-green-500 mt-1">All valid</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileCheck className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-gray-400 uppercase">Inspections</p>
          </div>
          <p className="text-2xl font-bold text-white">Current</p>
          <p className="text-xs text-gray-500 mt-1">Next due: 45 days</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-gray-400 uppercase">Port Regulations</p>
          </div>
          <p className="text-2xl font-bold text-green-400">Checked</p>
          <p className="text-xs text-gray-500 mt-1">{vessel.destination} requirements</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-gray-400 uppercase">Violations</p>
          </div>
          <p className="text-2xl font-bold text-green-400">0</p>
          <p className="text-xs text-green-500 mt-1">No issues</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <FileCheck className="w-4 h-4 mr-2 text-yellow-400" />
          Regulatory Checks
        </h4>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-white">Safety equipment certificates valid</p>
              <p className="text-xs text-gray-400">Next renewal: March 2026</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-white">Emission controls within limits</p>
              <p className="text-xs text-gray-400">MARPOL Annex VI compliant</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-white">Work/rest hour regulations met</p>
              <p className="text-xs text-gray-400">All crew within legal limits</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Activity className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-white">Destination port requirements reviewed</p>
              <p className="text-xs text-gray-400">All documentation prepared for arrival</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderCommunicationAgentData = () => (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Radio className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400 uppercase">VHF Status</p>
          </div>
          <p className="text-2xl font-bold text-green-400">Active</p>
          <p className="text-xs text-gray-500 mt-1">Channel 16 monitored</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Satellite className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400 uppercase">Satellite Link</p>
          </div>
          <p className="text-2xl font-bold text-green-400">Strong</p>
          <p className="text-xs text-gray-500 mt-1">98% uptime</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Ship className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400 uppercase">AIS Status</p>
          </div>
          <p className="text-2xl font-bold text-green-400">Broadcasting</p>
          <p className="text-xs text-gray-500 mt-1">Position updated</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400 uppercase">Messages Today</p>
          </div>
          <p className="text-2xl font-bold text-white">17</p>
          <p className="text-xs text-gray-500 mt-1">3 unread</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400 uppercase">Distress Signals</p>
          </div>
          <p className="text-2xl font-bold text-green-400">None</p>
          <p className="text-xs text-gray-500 mt-1">All clear</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-400 uppercase">System Health</p>
          </div>
          <p className="text-2xl font-bold text-green-400">Optimal</p>
          <p className="text-xs text-gray-500 mt-1">All systems operational</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2 text-purple-400" />
          Recent Communications
        </h4>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Radio className="w-4 h-4 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm text-white">VHF: Port Authority - {vessel.destination}</p>
                <span className="text-xs text-gray-500">5m ago</span>
              </div>
              <p className="text-xs text-gray-400">Berth assignment confirmed for ETA</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Satellite className="w-4 h-4 text-purple-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm text-white">SATCOM: Fleet Operations</p>
                <span className="text-xs text-gray-500">1h ago</span>
              </div>
              <p className="text-xs text-gray-400">Weather routing update received</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Ship className="w-4 h-4 text-green-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm text-white">AIS: Vessel Sea Pioneer</p>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
              <p className="text-xs text-gray-400">Safe passing acknowledged</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Radio className="w-4 h-4 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm text-white">VHF: Coast Guard - Channel 16</p>
                <span className="text-xs text-gray-500">4h ago</span>
              </div>
              <p className="text-xs text-gray-400">Navigation warning - restricted area ahead</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderAgentSpecificData = () => {
    switch (agent.type) {
      case 'weather':
        return renderWeatherAgentData();
      case 'navigation':
        return renderNavigationAgentData();
      case 'incident':
        return renderIncidentAgentData();
      case 'compliance':
        return renderComplianceAgentData();
      case 'communication':
        return renderCommunicationAgentData();
      default:
        return (
          <div className="text-center text-gray-400 py-8">
            No specific data available for this agent type.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getAgentColor(agent.type)} p-6 sticky top-0 z-10`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <AgentIcon className={`w-8 h-8 ${getAgentIconColor(agent.type)}`} />
              <div>
                <h2 className="text-2xl font-bold text-white capitalize">{agent.type} Agent</h2>
                <p className="text-gray-300 text-sm">{vessel.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Show Agent Skills Toggle */}
              <button
                onClick={() => setShowSkillsDebug(!showSkillsDebug)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  showSkillsDebug
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                title="Toggle agent skills visualization"
              >
                <Code className="w-4 h-4" />
                <span className="text-xs font-medium">Show Skills</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Agent Status */}
          <div className="mt-4 flex items-center justify-between bg-black/20 rounded-lg p-3">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-xs text-gray-300">Status</p>
                <p className="text-sm font-semibold text-white capitalize">{agent.status}</p>
              </div>
              <div className="border-l border-gray-600 pl-4">
                <p className="text-xs text-gray-300">Last Action</p>
                <p className="text-sm font-semibold text-white">{agent.lastAction}</p>
              </div>
              <div className="border-l border-gray-600 pl-4">
                <p className="text-xs text-gray-300">Updated</p>
                <p className="text-sm font-semibold text-white">{formatTimeSince(agent.timestamp)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-xs text-gray-300">Confidence</p>
                <p className="text-lg font-bold text-white">{agent.confidence}%</p>
              </div>
              <div className="bg-slate-900 rounded-full h-2 w-24">
                <div
                  className={`h-2 rounded-full ${
                    agent.confidence > 90 ? 'bg-green-500' :
                    agent.confidence > 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${agent.confidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Agent-Specific Data */}
        <div className="p-6">
          {isLoadingSkills ? (
            /* Loading Animation */
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <AgentIcon className={`w-16 h-16 ${getAgentIconColor(agent.type)} animate-pulse`} />
                <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-1.5">
                  <Loader className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>

              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-lg font-semibold text-white flex items-center justify-center space-x-2">
                  <span className="animate-pulse">🤔</span>
                  <span className="capitalize">{agent.type} Agent Analyzing...</span>
                </h3>

                <div className="space-y-2 mt-4">
                  {loadingSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-2 text-sm transition-all duration-300 ${
                        idx < loadingStep
                          ? 'text-green-400'
                          : idx === loadingStep
                          ? 'text-purple-300 font-medium'
                          : 'text-gray-600'
                      }`}
                    >
                      {idx < loadingStep ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      ) : idx === loadingStep ? (
                        <Loader className="w-4 h-4 flex-shrink-0 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-600 flex-shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Actual Agent Data */
            renderAgentSpecificData()
          )}
        </div>
      </div>
    </div>
  );
}
