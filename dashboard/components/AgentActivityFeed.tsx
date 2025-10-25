'use client';

import { useState, useEffect, useRef } from 'react';
import { AgentActivity, getAgentColor, getAgentEmoji, getAgentDisplayName } from '@/lib/agentActivitySimulator';
import { Pause, Play, Filter, Clock } from 'lucide-react';

interface AgentActivityFeedProps {
  activities: AgentActivity[];
}

export default function AgentActivityFeed({ activities }: AgentActivityFeedProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<AgentActivity['agentType'] | 'all'>('all');
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new activity arrives (unless paused)
  useEffect(() => {
    if (!isPaused && feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activities, isPaused]);

  // Filter activities
  const filteredActivities = selectedFilter === 'all'
    ? activities
    : activities.filter(a => a.agentType === selectedFilter);

  // Get recent activities (last 50)
  const recentActivities = filteredActivities.slice(-50);

  const agentTypes: Array<AgentActivity['agentType']> = ['weather', 'navigation', 'incident', 'compliance', 'communication'];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 border-b border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <h3 className="text-white font-semibold text-lg">Live Activity Feed</h3>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isPaused
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-slate-600 hover:bg-slate-500 text-white'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 font-medium'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {agentTypes.map(type => {
            const colors = getAgentColor(type);
            return (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center space-x-1 ${
                  selectedFilter === type
                    ? `${colors.bg} ${colors.text} font-medium border ${colors.border}`
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <span>{getAgentEmoji(type)}</span>
                <span className="capitalize">{type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity List */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ maxHeight: '600px' }}
      >
        {recentActivities.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No activity yet. Waiting for agent data streams...</p>
          </div>
        ) : (
          recentActivities.map((activity, idx) => {
            const colors = getAgentColor(activity.agentType);
            const isNew = idx === recentActivities.length - 1;

            return (
              <div
                key={activity.id}
                className={`border-l-4 ${colors.border} ${colors.bg} rounded-r-lg p-3 transition-all duration-300 ${
                  isNew && !isPaused ? 'animate-fade-in' : ''
                }`}
              >
                {/* Timestamp */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400 font-mono">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {activity.confidence}% confidence
                  </span>
                </div>

                {/* Agent & Vessel */}
                <div className="flex items-start space-x-2 mb-2">
                  <span className="text-lg">{getAgentEmoji(activity.agentType)}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${colors.text}`}>
                      {getAgentDisplayName(activity.agentType)}
                    </p>
                    <p className="text-white text-sm">→ {activity.vesselName}</p>
                  </div>
                </div>

                {/* Action */}
                <p className="text-gray-200 text-sm mb-2">{activity.action}</p>

                {/* Metadata */}
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <span className="font-mono">{activity.skillUsed}</span>
                  </span>
                  <span>⚡ {activity.processingTime}ms</span>
                  <span>📦 {activity.dataGenerated.toFixed(1)}KB</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-800 border-t border-slate-700 px-4 py-2">
        <p className="text-xs text-gray-400 text-center">
          Showing {recentActivities.length} recent activities
          {selectedFilter !== 'all' && ` (filtered: ${selectedFilter})`}
        </p>
      </div>
    </div>
  );
}

// Helper: Format timestamp
function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
