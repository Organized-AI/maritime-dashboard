'use client';

import { AgentStats } from '@/lib/agentActivitySimulator';
import { Activity, Zap, Database, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AgentStatsCardsProps {
  stats: AgentStats;
}

export default function AgentStatsCards({ stats }: AgentStatsCardsProps) {
  // Animated counter effect
  const [displayStats, setDisplayStats] = useState(stats);

  useEffect(() => {
    // Smooth animation towards target values
    const interval = setInterval(() => {
      setDisplayStats(prev => ({
        totalInvocations: animateTowards(prev.totalInvocations, stats.totalInvocations, 10),
        activeStreams: stats.activeStreams, // Instant update for real-time feel
        avgResponseTime: animateTowards(prev.avgResponseTime, stats.avgResponseTime, 5),
        dataPointsGenerated: animateTowards(prev.dataPointsGenerated, stats.dataPointsGenerated, 50),
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [stats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Invocations */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <p className="text-xs text-gray-300 uppercase font-medium">Skill Invocations</p>
          </div>
        </div>
        <p className="text-3xl font-bold text-white mb-1">
          {displayStats.totalInvocations.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400">Total operations executed</p>
      </div>

      {/* Active Streams */}
      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-400 animate-pulse" />
            <p className="text-xs text-gray-300 uppercase font-medium">Active Streams</p>
          </div>
          <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
            LIVE
          </span>
        </div>
        <p className="text-3xl font-bold text-white mb-1">
          {displayStats.activeStreams}
        </p>
        <p className="text-xs text-gray-400">Data streams in last minute</p>
      </div>

      {/* Avg Response Time */}
      <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <p className="text-xs text-gray-300 uppercase font-medium">Avg Response</p>
          </div>
        </div>
        <p className="text-3xl font-bold text-white mb-1">
          {displayStats.avgResponseTime}ms
        </p>
        <p className="text-xs text-gray-400">
          {displayStats.avgResponseTime < 250 ? '⚡ Excellent' :
           displayStats.avgResponseTime < 400 ? '✓ Good' : '⚠ Slow'}
        </p>
      </div>

      {/* Data Points Generated */}
      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <p className="text-xs text-gray-300 uppercase font-medium">Data Points</p>
          </div>
        </div>
        <p className="text-3xl font-bold text-white mb-1">
          {formatLargeNumber(displayStats.dataPointsGenerated)}
        </p>
        <p className="text-xs text-gray-400">Generated today</p>
      </div>
    </div>
  );
}

// Helper: Animate number towards target
function animateTowards(current: number, target: number, step: number): number {
  if (current === target) return target;
  if (Math.abs(target - current) < step) return target;
  return current < target ? current + step : current - step;
}

// Helper: Format large numbers (e.g., 18429 → 18.4K)
function formatLargeNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
}
