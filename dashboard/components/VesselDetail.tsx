'use client';

import { Vessel, WeatherData, VesselAgent } from '@/types';
import {
  Ship,
  MapPin,
  Navigation,
  Fuel,
  Users,
  Flag,
  Radio,
  X,
  Anchor,
  Gauge,
  Cloud,
  Wind,
  Waves,
  Eye,
  Thermometer,
  Bot,
  Activity,
  CheckCircle,
  Loader,
} from 'lucide-react';

interface VesselDetailProps {
  vessel: Vessel;
  weather?: WeatherData;
  agents?: VesselAgent[];
  onClose: () => void;
}

export default function VesselDetail({ vessel, weather, agents, onClose }: VesselDetailProps) {
  const getConnectivityColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'satellite': return 'text-blue-500';
      case 'degraded': return 'text-yellow-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectivityBg = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-900/20 border-green-700';
      case 'satellite': return 'bg-blue-900/20 border-blue-700';
      case 'degraded': return 'bg-yellow-900/20 border-yellow-700';
      case 'offline': return 'bg-red-900/20 border-red-700';
      default: return 'bg-gray-700 border-gray-600';
    }
  };

  const getAgentStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4 text-green-500 animate-pulse" />;
      case 'processing': return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'idle': return <CheckCircle className="w-4 h-4 text-gray-400" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-400" />;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="maritime-gradient p-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Ship className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">{vessel.name}</h2>
                <p className="text-maritime-100 text-sm">{vessel.type}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Connectivity Status */}
          <div className={`border rounded-lg p-4 ${getConnectivityBg(vessel.connectivity)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className={getConnectivityColor(vessel.connectivity)} />
                <span className="font-medium text-white">Connectivity Status</span>
              </div>
              <span className={`font-bold capitalize ${getConnectivityColor(vessel.connectivity)}`}>
                {vessel.connectivity}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Last update: {formatTimeSince(vessel.lastUpdate)}
            </p>
          </div>

          {/* Vessel Information Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Flag className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-400 uppercase">Flag</p>
              </div>
              <p className="text-lg font-semibold text-white">{vessel.flag}</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Ship className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-400 uppercase">IMO</p>
              </div>
              <p className="text-lg font-semibold text-white font-mono">{vessel.imo}</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Radio className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-400 uppercase">MMSI</p>
              </div>
              <p className="text-lg font-semibold text-white font-mono">{vessel.mmsi}</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-400 uppercase">Crew</p>
              </div>
              <p className="text-lg font-semibold text-white">{vessel.crew} members</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Anchor className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500 uppercase">Status</p>
              </div>
              <p className="text-lg font-semibold text-white capitalize">{vessel.status}</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-400 uppercase">Destination</p>
              </div>
              <p className="text-lg font-semibold text-white">{vessel.destination}</p>
            </div>
          </div>

          {/* Navigation Data */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center">
              <Navigation className="w-5 h-5 mr-2 text-maritime-400" />
              Navigation Data
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Speed</p>
                <div className="flex items-center space-x-2">
                  <Gauge className="w-5 h-5 text-maritime-400" />
                  <p className="text-xl font-bold text-white">{vessel.speed.toFixed(1)}</p>
                  <p className="text-sm text-gray-400">kts</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Heading</p>
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-maritime-400" style={{ transform: `rotate(${vessel.heading}deg)` }} />
                  <p className="text-xl font-bold text-white">{Math.round(vessel.heading)}°</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Fuel Level</p>
                <div className="flex items-center space-x-2">
                  <Fuel className={`w-5 h-5 ${vessel.fuelLevel < 30 ? 'text-red-400' : 'text-green-400'}`} />
                  <p className={`text-xl font-bold ${vessel.fuelLevel < 30 ? 'text-red-400' : 'text-white'}`}>
                    {vessel.fuelLevel}%
                  </p>
                </div>
                <div className="mt-2 bg-slate-900 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      vessel.fuelLevel > 60 ? 'bg-green-500' :
                      vessel.fuelLevel > 30 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${vessel.fuelLevel}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">ETA</p>
                <p className="text-sm font-semibold text-white">
                  {new Date(vessel.eta).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-600">
              <p className="text-xs text-gray-400 mb-1">Current Position</p>
              <p className="text-sm font-mono text-white">
                {vessel.position.latitude.toFixed(6)}°{vessel.position.latitude >= 0 ? 'N' : 'S'},{' '}
                {vessel.position.longitude.toFixed(6)}°{vessel.position.longitude >= 0 ? 'E' : 'W'}
              </p>
            </div>
          </div>

          {/* Weather Data */}
          {weather && (
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-blue-400" />
                Weather Conditions
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <Thermometer className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">Temperature</p>
                    <p className="text-lg font-semibold text-white">{weather.temperature.toFixed(1)}°C</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Wind className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">Wind</p>
                    <p className="text-lg font-semibold text-white">{weather.windSpeed.toFixed(1)} kts</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Waves className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">Wave Height</p>
                    <p className="text-lg font-semibold text-white">{weather.waveHeight.toFixed(1)} m</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">Visibility</p>
                    <p className="text-lg font-semibold text-white">{weather.visibility.toFixed(1)} nm</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-800">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Conditions:</span> {weather.conditions} •
                  <span className="font-medium ml-2">Pressure:</span> {weather.pressure.toFixed(0)} hPa •
                  <span className="font-medium ml-2">Humidity:</span> {weather.humidity}%
                </p>
              </div>
            </div>
          )}

          {/* AI Agents */}
          {agents && agents.length > 0 && (
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <Bot className="w-5 h-5 mr-2 text-purple-400" />
                AI Vessel Agents
              </h3>
              <div className="space-y-3">
                {agents.map((agent, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center space-x-3">
                      {getAgentStatusIcon(agent.status)}
                      <div>
                        <p className="font-medium text-white capitalize">{agent.type} Agent</p>
                        <p className="text-xs text-gray-400">{agent.lastAction}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-gray-400">Confidence</div>
                        <div className="bg-slate-900 rounded-full h-2 w-16">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${agent.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-white">{agent.confidence}%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{formatTimeSince(agent.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
