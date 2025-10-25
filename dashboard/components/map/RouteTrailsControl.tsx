'use client';

import { TrailTimeRange } from '@/types';
import { Clock, Eye, EyeOff } from 'lucide-react';

interface RouteTrailsControlProps {
  enabled: boolean;
  timeRange: TrailTimeRange;
  opacity: number;
  onToggle: () => void;
  onTimeRangeChange: (range: TrailTimeRange) => void;
  onOpacityChange: (opacity: number) => void;
  isDarkMode?: boolean;
}

export default function RouteTrailsControl({
  enabled,
  timeRange,
  opacity,
  onToggle,
  onTimeRangeChange,
  onOpacityChange,
  isDarkMode = false,
}: RouteTrailsControlProps) {
  const timeRangeOptions: { value: TrailTimeRange; label: string }[] = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '12h', label: '12 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-maritime-600 dark:text-maritime-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Route Trails
          </h3>
        </div>
        <button
          onClick={onToggle}
          className={`p-1.5 rounded transition-colors ${
            enabled
              ? 'bg-maritime-100 dark:bg-maritime-900/30 text-maritime-600 dark:text-maritime-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
          }`}
          title={enabled ? 'Hide trails' : 'Show trails'}
        >
          {enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Controls (only show when enabled) */}
      {enabled && (
        <>
          {/* Time Range Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Time Range
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onTimeRangeChange(option.value)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    timeRange === option.value
                      ? 'bg-maritime-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Opacity
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {opacity}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={opacity}
              onChange={(e) => onOpacityChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-maritime-500"
            />
          </div>

          {/* Info */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Trails show vessel paths colored by connectivity status. Newer positions are more opaque.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
