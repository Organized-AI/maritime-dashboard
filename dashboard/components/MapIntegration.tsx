'use client';

import { useEffect, useRef } from 'react';
import { Vessel } from '@/types';

interface MapIntegrationProps {
  vessels: Vessel[];
  selectedVessel?: Vessel | null;
  height?: string;
}

export default function MapIntegration({
  vessels,
  selectedVessel,
  height = '600px'
}: MapIntegrationProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // When a vessel is selected, update the iframe to show that location
    if (selectedVessel && iframeRef.current) {
      const { latitude, longitude } = selectedVessel.position;
      const zoom = 10; // Appropriate zoom level for vessel detail

      // Update iframe src with vessel coordinates
      const baseUrl = window.location.origin;
      const mapUrl = `${baseUrl}/../index.php?lat=${latitude}&lon=${longitude}&zoom=${zoom}`;

      // Note: In production, you would send a postMessage to the iframe
      // to avoid reloading the entire map
      console.log('Would navigate to:', mapUrl);
    }
  }, [selectedVessel]);

  // Center map on all vessels (calculate centroid)
  const getCentroid = () => {
    if (vessels.length === 0) return { lat: 0, lon: 0, zoom: 2 };

    const sum = vessels.reduce(
      (acc, vessel) => ({
        lat: acc.lat + vessel.position.latitude,
        lon: acc.lon + vessel.position.longitude,
      }),
      { lat: 0, lon: 0 }
    );

    return {
      lat: sum.lat / vessels.length,
      lon: sum.lon / vessels.length,
      zoom: 4,
    };
  };

  const centroid = getCentroid();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const mapUrl = `${baseUrl}/../index.php?lat=${centroid.lat}&lon=${centroid.lon}&zoom=${centroid.zoom}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-maritime-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live Map View</span>
        </div>
        <div className="text-xs opacity-90">
          {vessels.length} vessel{vessels.length !== 1 ? 's' : ''} tracked
        </div>
      </div>

      <div className="relative" style={{ height }}>
        {/* Placeholder for map integration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              OpenSeaMap Integration
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              This component will embed the existing OpenSeaMap application from index.php.
              The map will display vessel positions with real-time AIS data.
            </p>
            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <p>Center: {centroid.lat.toFixed(2)}°, {centroid.lon.toFixed(2)}°</p>
              <p>Zoom: {centroid.zoom}</p>
              {selectedVessel && (
                <p className="text-maritime-600 font-medium">
                  Selected: {selectedVessel.name}
                </p>
              )}
            </div>

            {/* Integration note */}
            <div className="mt-6 bg-white rounded-lg p-4 max-w-lg mx-auto text-left">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                Integration Options:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Option 1: Embed index.php in iframe with postMessage communication</li>
                <li>• Option 2: Extract OpenLayers code into React component</li>
                <li>• Option 3: Use React-Leaflet or React-OpenLayers wrapper</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vessel markers overlay (when map is integrated) */}
        {/* This will be replaced with actual map integration */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-h-64 overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            Tracked Vessels
          </h4>
          <div className="space-y-1">
            {vessels.slice(0, 5).map((vessel) => (
              <div
                key={vessel.id}
                className={`text-xs p-2 rounded ${
                  selectedVessel?.id === vessel.id
                    ? 'bg-maritime-100 border border-maritime-300'
                    : 'bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-800">{vessel.name}</div>
                <div className="text-gray-500 font-mono">
                  {vessel.position.latitude.toFixed(2)}°, {vessel.position.longitude.toFixed(2)}°
                </div>
              </div>
            ))}
            {vessels.length > 5 && (
              <div className="text-xs text-gray-500 text-center pt-2">
                +{vessels.length - 5} more vessels
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
