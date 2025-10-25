'use client';

import { useState, useEffect } from 'react';
import FleetOverview from '@/components/FleetOverview';
import IncidentManagement from '@/components/IncidentManagement';
import VesselDetail from '@/components/VesselDetail';
import OpenSeaMap from '@/components/OpenSeaMap';
import { useTheme } from '@/lib/ThemeContext';
import { Vessel, Incident, FleetStatistics } from '@/types';
import {
  generateMockVessels,
  generateMockIncidents,
  calculateFleetStats,
  simulateVesselUpdate,
  generateMockWeather,
  generateMockAgents,
  generateVesselHistory,
} from '@/lib/mockData';
import { Ship, Activity, Bell, LayoutDashboard, AlertTriangle, Moon, Sun, Map as MapIcon } from 'lucide-react';

export default function DashboardPage() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<FleetStatistics>({
    totalVessels: 0,
    activeVessels: 0,
    anchoredVessels: 0,
    offlineVessels: 0,
    activeIncidents: 0,
    criticalIncidents: 0,
    averageFuelLevel: 0,
  });
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState<'fleet' | 'incidents' | 'map'>('fleet');

  // Initialize mock data
  useEffect(() => {
    const mockVessels = generateMockVessels(12);

    // Generate historical positions for each vessel (24 hours of history)
    const vesselsWithHistory = mockVessels.map(vessel => ({
      ...vessel,
      historicalPositions: generateVesselHistory(vessel, 24),
    }));

    const mockIncidents = generateMockIncidents(vesselsWithHistory, 8);

    setVessels(vesselsWithHistory);
    setIncidents(mockIncidents);
    setStats(calculateFleetStats(vesselsWithHistory, mockIncidents));
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      // Update vessel positions every 5 seconds
      setVessels(prev => {
        const updated = prev.map(vessel => {
          // Only update vessels that are moving
          if (vessel.status === 'active' || vessel.status === 'underway') {
            return simulateVesselUpdate(vessel);
          }
          return vessel;
        });

        // Recalculate stats
        setStats(calculateFleetStats(updated, incidents));

        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [incidents]);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="maritime-gradient shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Ship className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Maritime AI Dashboard
                </h1>
                <p className="text-maritime-100 text-sm">
                  Digital Twin of the Oceans - Vessel Intelligence System
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('fleet')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'fleet'
                      ? 'bg-white text-maritime-700'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Fleet</span>
                </button>
                <button
                  onClick={() => setActiveView('map')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'map'
                      ? 'bg-white text-maritime-700'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  <span>Map</span>
                </button>
                <button
                  onClick={() => setActiveView('incidents')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'incidents'
                      ? 'bg-white text-maritime-700'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Incidents</span>
                  {stats.activeIncidents > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {stats.activeIncidents}
                    </span>
                  )}
                </button>
              </div>

              {/* Active Incidents Indicator */}
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                <Bell className="w-5 h-5 text-white" />
                <div className="text-white">
                  <p className="text-xs opacity-90">Active Incidents</p>
                  <p className="text-lg font-bold">{stats.activeIncidents}</p>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </button>

              {/* Current Time */}
              <div className="text-right">
                <p className="text-maritime-100 text-xs">UTC</p>
                <p className="text-white font-mono text-lg">
                  {currentTime.toUTCString().split(' ')[4]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Status Banner */}
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                System Status: Operational
              </p>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                All systems functioning normally. Last data sync: {new Date(currentTime.getTime() - 12000).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* View Content */}
        {activeView === 'fleet' ? (
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fleet Overview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time monitoring of {vessels.length} vessels across global operations
              </p>
            </div>

            <FleetOverview
              vessels={vessels}
              stats={stats}
              onVesselSelect={setSelectedVessel}
            />
          </div>
        ) : activeView === 'map' ? (
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Vessel Map</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time vessel tracking with OpenSeaMap navigation charts
              </p>
            </div>

            <OpenSeaMap
              vessels={vessels}
              incidents={incidents}
              selectedVessel={selectedVessel}
              onVesselClick={setSelectedVessel}
              onIncidentClick={(incident) => {
                const vessel = vessels.find(v => v.id === incident.vesselId);
                if (vessel) setSelectedVessel(vessel);
              }}
              height="700px"
              isDarkMode={isDarkMode}
            />
          </div>
        ) : (
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Incident Management</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor and respond to incidents across {vessels.length} vessels
              </p>
            </div>

            <IncidentManagement
              incidents={incidents}
              onIncidentSelect={(incident) => {
                const vessel = vessels.find(v => v.id === incident.vesselId);
                if (vessel) setSelectedVessel(vessel);
              }}
            />
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Average Fuel Level</h3>
            <div className="flex items-end space-x-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageFuelLevel}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">across fleet</p>
            </div>
            <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  stats.averageFuelLevel > 60 ? 'bg-green-500' :
                  stats.averageFuelLevel > 30 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${stats.averageFuelLevel}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Critical Incidents</h3>
            <div className="flex items-end space-x-2">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.criticalIncidents}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">severity 4-5</p>
            </div>
            {stats.criticalIncidents > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">Immediate attention required</p>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Vessel Distribution</h3>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Underway</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.activeVessels}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">At Anchor</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.anchoredVessels}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Offline</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.offlineVessels}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Maritime AI Dashboard v1.0 - Data updates every 5 seconds</p>
          <p className="text-xs mt-1">
            Mock data generated for development • Real vessel integration pending
          </p>
        </div>
      </main>

      {/* Vessel Detail Modal */}
      {selectedVessel && (
        <VesselDetail
          vessel={selectedVessel}
          weather={generateMockWeather()}
          agents={generateMockAgents()}
          onClose={() => setSelectedVessel(null)}
        />
      )}
    </div>
  );
}
