'use client';

import { useState, useEffect } from 'react';
import { Vessel, FleetStatistics } from '@/types';
import { Ship, Anchor, WifiOff, AlertTriangle, Fuel } from 'lucide-react';

interface FleetOverviewProps {
  vessels: Vessel[];
  stats: FleetStatistics;
  onVesselSelect?: (vessel: Vessel) => void;
}

export default function FleetOverview({ vessels, stats, onVesselSelect }: FleetOverviewProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'alerts' | 'offline'>('all');

  const filteredVessels = vessels.filter(vessel => {
    switch (filter) {
      case 'active':
        return vessel.status === 'active' || vessel.status === 'underway';
      case 'alerts':
        return vessel.fuelLevel < 30 || vessel.connectivity === 'offline';
      case 'offline':
        return vessel.connectivity === 'offline';
      default:
        return true;
    }
  });

  const getConnectivityColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'satellite': return 'bg-blue-500';
      case 'degraded': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'anchored':
      case 'moored':
        return <Anchor className="w-4 h-4" />;
      default:
        return <Ship className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Fleet Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-maritime-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vessels</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVessels}</p>
            </div>
            <Ship className="w-8 h-8 text-maritime-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeVessels}</p>
            </div>
            <Ship className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeIncidents}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offlineVessels}</p>
            </div>
            <WifiOff className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-maritime-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Vessels ({vessels.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-maritime-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active ({stats.activeVessels})
          </button>
          <button
            onClick={() => setFilter('alerts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'alerts'
                ? 'bg-maritime-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'offline'
                ? 'bg-maritime-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Offline ({stats.offlineVessels})
          </button>
        </div>
      </div>

      {/* Vessel List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredVessels.map(vessel => (
          <div
            key={vessel.id}
            onClick={() => onVesselSelect?.(vessel)}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(vessel.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">{vessel.name}</h3>
                  <p className="text-xs text-gray-500">{vessel.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getConnectivityColor(vessel.connectivity)}`} />
                <span className="text-xs text-gray-500 capitalize">{vessel.connectivity}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Speed</p>
                <p className="font-medium text-gray-900">{vessel.speed.toFixed(1)} kts</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Heading</p>
                <p className="font-medium text-gray-900">{Math.round(vessel.heading)}°</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Destination</p>
                <p className="font-medium text-gray-900 truncate">{vessel.destination}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Fuel</p>
                <div className="flex items-center space-x-1">
                  <Fuel className={`w-3 h-3 ${vessel.fuelLevel < 30 ? 'text-red-500' : 'text-gray-400'}`} />
                  <p className={`font-medium ${vessel.fuelLevel < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                    {vessel.fuelLevel}%
                  </p>
                </div>
              </div>
            </div>

            {/* Position */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Position</p>
              <p className="text-xs font-mono text-gray-900">
                {vessel.position.latitude.toFixed(4)}°{vessel.position.latitude >= 0 ? 'N' : 'S'},{' '}
                {vessel.position.longitude.toFixed(4)}°{vessel.position.longitude >= 0 ? 'E' : 'W'}
              </p>
            </div>

            {/* Alerts */}
            {(vessel.fuelLevel < 30 || vessel.connectivity === 'offline') && (
              <div className="mt-2 flex items-center space-x-1 text-xs text-orange-600">
                <AlertTriangle className="w-3 h-3" />
                <span>
                  {vessel.fuelLevel < 30 && 'Low fuel'}
                  {vessel.fuelLevel < 30 && vessel.connectivity === 'offline' && ' • '}
                  {vessel.connectivity === 'offline' && 'No connectivity'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredVessels.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Ship className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No vessels match the selected filter</p>
        </div>
      )}
    </div>
  );
}
