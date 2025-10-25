'use client';

import { AgentActivity, AgentStats } from '@/lib/agentActivitySimulator';
import { Vessel } from '@/types';
import AgentStatsCards from './AgentStatsCards';
import AgentActivityFeed from './AgentActivityFeed';
import { Bot, Network } from 'lucide-react';

interface AgentActivityDashboardProps {
  activities: AgentActivity[];
  stats: AgentStats;
  vessels: Vessel[];
}

export default function AgentActivityDashboard({
  activities,
  stats,
  vessels,
}: AgentActivityDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Bot className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Agent Activity Dashboard</h2>
            <p className="text-gray-300 text-sm">Real-time visualization of AI agent data streams</p>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-6 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4 text-purple-400" />
            <span>{vessels.length} vessels connected</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>5 agent types active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>System operational</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <AgentStatsCards stats={stats} />

      {/* Main Content: Activity Feed + Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Activity Feed (Left Side - 2 columns) */}
        <div className="lg:col-span-2">
          <AgentActivityFeed activities={activities} />
        </div>

        {/* Network Visualization Placeholder (Right Side - 3 columns) */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 h-full flex flex-col">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2 text-purple-400" />
              Agent-Vessel Network
            </h3>

            {/* Simple Grid Visualization */}
            <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vessels.slice(0, 12).map((vessel) => (
                  <div
                    key={vessel.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-purple-500 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium truncate">
                        {vessel.name}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${
                        vessel.connectivity === 'online' ? 'bg-green-500' :
                        vessel.connectivity === 'satellite' ? 'bg-blue-500' :
                        vessel.connectivity === 'degraded' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                    </div>

                    <div className="text-xs text-gray-400 mb-2">
                      {vessel.type}
                    </div>

                    {/* Active Agents Indicators */}
                    <div className="flex flex-wrap gap-1">
                      {['🌦️', '🧭', '🚨', '📋', '📡'].map((emoji, idx) => (
                        <span
                          key={idx}
                          className="w-6 h-6 bg-purple-900/40 rounded flex items-center justify-center text-xs"
                          title="Agent active"
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>

                    {/* Data Stream Indicator */}
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Data Stream</span>
                        <span className="flex items-center space-x-1 text-green-400">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <span>Active</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {vessels.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <Network className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No vessels connected</p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs text-gray-400 mb-2">Agent Types:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="flex items-center space-x-1">
                  <span>🌦️</span>
                  <span className="text-gray-300">Weather</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🧭</span>
                  <span className="text-gray-300">Navigation</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🚨</span>
                  <span className="text-gray-300">Incident</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📋</span>
                  <span className="text-gray-300">Compliance</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📡</span>
                  <span className="text-gray-300">Communication</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <p className="text-sm text-blue-200">
          <strong>💡 What you're seeing:</strong> Real-time stream of AI agent operations across your fleet.
          Each vessel has 5 specialized agents continuously analyzing data, generating insights, and updating the dashboard.
          This demonstrates our production-ready agent orchestration architecture with sub-second response times.
        </p>
      </div>
    </div>
  );
}
