'use client';

import { useState } from 'react';
import { Ruler, Route, Square, X, ChevronDown, ChevronUp } from 'lucide-react';
import { MeasurementType } from '@/types';

interface MeasurementControlProps {
  activeMeasurement: MeasurementType | null;
  onMeasurementChange: (type: MeasurementType | null) => void;
  isDarkMode?: boolean;
}

export default function MeasurementControl({
  activeMeasurement,
  onMeasurementChange,
  isDarkMode = false,
}: MeasurementControlProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 flex-1 hover:opacity-80 transition-opacity"
        >
          <Ruler className="w-4 h-4 text-maritime-600 dark:text-maritime-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Measurements
          </h3>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
        {activeMeasurement && (
          <button
            onClick={() => onMeasurementChange(null)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Clear measurement"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Measurement Type Buttons */}
          <div className="space-y-2">
            {/* Distance */}
            <button
              onClick={() => onMeasurementChange(activeMeasurement === 'distance' ? null : 'distance')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeMeasurement === 'distance'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Ruler className="w-4 h-4" />
              <div className="flex-1 text-left">
                <div className="text-xs font-medium">Distance</div>
                <div className="text-xs opacity-75">Measure point-to-point</div>
              </div>
            </button>

            {/* Route */}
            <button
              onClick={() => onMeasurementChange(activeMeasurement === 'route' ? null : 'route')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeMeasurement === 'route'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Route className="w-4 h-4" />
              <div className="flex-1 text-left">
                <div className="text-xs font-medium">Route</div>
                <div className="text-xs opacity-75">Measure multi-point path</div>
              </div>
            </button>

            {/* Area */}
            <button
              onClick={() => onMeasurementChange(activeMeasurement === 'area' ? null : 'area')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeMeasurement === 'area'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Square className="w-4 h-4" />
              <div className="flex-1 text-left">
                <div className="text-xs font-medium">Area</div>
                <div className="text-xs opacity-75">Measure polygon area</div>
              </div>
            </button>
          </div>

          {/* Instructions */}
          {activeMeasurement && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeMeasurement === 'distance' && 'Click two points to measure distance.'}
                {activeMeasurement === 'route' && 'Click multiple points to measure route. Double-click to finish.'}
                {activeMeasurement === 'area' && 'Click to draw polygon. Double-click to close and measure area.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
