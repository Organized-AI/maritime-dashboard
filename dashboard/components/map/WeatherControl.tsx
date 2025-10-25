'use client';

import { useState } from 'react';
import { Cloud, Wind, Waves, CloudRain, ChevronDown, ChevronUp } from 'lucide-react';

interface WeatherControlProps {
  showWind: boolean;
  showTemperature: boolean;
  showWaves: boolean;
  showStorms: boolean;
  opacity: number;
  onToggleWind: () => void;
  onToggleTemperature: () => void;
  onToggleWaves: () => void;
  onToggleStorms: () => void;
  onOpacityChange: (opacity: number) => void;
  isDarkMode?: boolean;
}

export default function WeatherControl({
  showWind,
  showTemperature,
  showWaves,
  showStorms,
  opacity,
  onToggleWind,
  onToggleTemperature,
  onToggleWaves,
  onToggleStorms,
  onOpacityChange,
  isDarkMode = false,
}: WeatherControlProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const anyEnabled = showWind || showTemperature || showWaves || showStorms;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Cloud className="w-4 h-4 text-maritime-600 dark:text-maritime-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Weather Overlays
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-3">
          {/* Layer Toggles */}
          <div className="space-y-2">
            {/* Wind & Temperature */}
            <button
              onClick={() => {
                // Toggle both wind and temperature together
                if (showWind || showTemperature) {
                  // If either is on, turn both off
                  if (showWind) onToggleWind();
                  if (showTemperature) onToggleTemperature();
                } else {
                  // If both are off, turn both on
                  onToggleWind();
                  onToggleTemperature();
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                showWind || showTemperature
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4" />
                <span className="text-xs font-medium">Wind & Temperature</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${showWind || showTemperature ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
            </button>

            {/* Waves & Storms */}
            <button
              onClick={() => {
                // Toggle both waves and storms together
                if (showWaves || showStorms) {
                  // If either is on, turn both off
                  if (showWaves) onToggleWaves();
                  if (showStorms) onToggleStorms();
                } else {
                  // If both are off, turn both on
                  onToggleWaves();
                  onToggleStorms();
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                showWaves || showStorms
                  ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Waves className="w-4 h-4" />
                <span className="text-xs font-medium">Waves & Storms</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${showWaves || showStorms ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
            </button>
          </div>

          {/* Opacity Slider - only show when at least one layer is enabled */}
          {anyEnabled && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
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
          )}

          {/* Info */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Toggle weather overlays to visualize maritime conditions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
