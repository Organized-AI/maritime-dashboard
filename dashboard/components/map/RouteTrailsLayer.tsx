'use client';

import { useEffect, useRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { fromLonLat } from 'ol/proj';
import { Style, Stroke } from 'ol/style';
import type Map from 'ol/Map';
import { Vessel, TrailTimeRange, VesselHistoricalPosition } from '@/types';
import { filterVesselHistory } from '@/lib/mockData';

interface RouteTrailsLayerProps {
  map: Map | null;
  vessels: Vessel[];
  enabled: boolean;
  timeRange: TrailTimeRange;
  opacity: number;
  isDarkMode?: boolean;
}

export default function RouteTrailsLayer({
  map,
  vessels,
  enabled,
  timeRange,
  opacity,
  isDarkMode = false,
}: RouteTrailsLayerProps) {
  const layerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Initialize layer
  useEffect(() => {
    if (!map) return;

    const source = new VectorSource();
    const layer = new VectorLayer({
      source,
      style: (feature) => {
        const vessel = feature.get('vessel') as Vessel;
        const segmentIndex = feature.get('segmentIndex') as number;
        const totalSegments = feature.get('totalSegments') as number;

        // Calculate opacity based on age (newer = more opaque)
        const ageRatio = segmentIndex / totalSegments;
        const baseOpacity = opacity / 100;
        // Much higher minimum opacity (70% to 100%)
        const segmentOpacity = baseOpacity * (0.7 + 0.3 * (1 - ageRatio));

        // Get color based on connectivity status
        const color = getVesselColor(vessel.connectivity);

        // Create multi-layer stroke for highly visible trails
        return [
          // Outer stroke (thick dark border for strong definition)
          new Style({
            stroke: new Stroke({
              color: `rgba(0, 0, 0, ${segmentOpacity * 0.6})`,
              width: 10, // Much thicker outer border
              lineCap: 'round',
              lineJoin: 'round',
            }),
          }),
          // Middle stroke (white/light glow for contrast)
          new Style({
            stroke: new Stroke({
              color: `rgba(255, 255, 255, ${segmentOpacity * 0.4})`,
              width: 8,
              lineCap: 'round',
              lineJoin: 'round',
            }),
          }),
          // Inner stroke (main bright color)
          new Style({
            stroke: new Stroke({
              color: `rgba(${color.r}, ${color.g}, ${color.b}, ${segmentOpacity})`,
              width: 6, // Thick, highly visible main trail
              lineCap: 'round',
              lineJoin: 'round',
            }),
          }),
        ];
      },
      zIndex: 5, // Below vessel markers but above base map
    });

    layerRef.current = layer;
    map.addLayer(layer);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map]);

  // Update layer visibility
  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.setVisible(enabled);
    }
  }, [enabled]);

  // Update trail features when vessels, timeRange, or opacity change
  useEffect(() => {
    if (!layerRef.current || !enabled) return;

    const source = layerRef.current.getSource();
    if (!source) return;

    // Clear existing features
    source.clear();

    // Create trail features for each vessel
    vessels.forEach((vessel) => {
      if (!vessel.historicalPositions || vessel.historicalPositions.length === 0) {
        return;
      }

      // Filter history by time range
      const filteredHistory = filterVesselHistory(vessel.historicalPositions, timeRange);

      if (filteredHistory.length < 2) {
        return; // Need at least 2 points to draw a line
      }

      // Create line segments with individual opacity
      for (let i = 0; i < filteredHistory.length - 1; i++) {
        const start = filteredHistory[i];
        const end = filteredHistory[i + 1];

        const coordinates = [
          fromLonLat([start.position.longitude, start.position.latitude]),
          fromLonLat([end.position.longitude, end.position.latitude]),
        ];

        const lineFeature = new Feature({
          geometry: new LineString(coordinates),
        });

        lineFeature.set('vessel', vessel);
        lineFeature.set('segmentIndex', i);
        lineFeature.set('totalSegments', filteredHistory.length - 1);
        lineFeature.set('startTime', start.timestamp);
        lineFeature.set('endTime', end.timestamp);

        source.addFeature(lineFeature);
      }
    });

    // Force re-render
    layerRef.current.changed();
  }, [vessels, timeRange, opacity, enabled]);

  return null; // This is a non-visual component
}

// Helper function to get vessel color based on connectivity
function getVesselColor(connectivity: string): { r: number; g: number; b: number } {
  switch (connectivity) {
    case 'online':
      return { r: 34, g: 197, b: 94 }; // green-500
    case 'satellite':
      return { r: 59, g: 130, b: 246 }; // blue-500
    case 'degraded':
      return { r: 234, g: 179, b: 8 }; // yellow-500
    case 'offline':
      return { r: 239, g: 68, b: 68 }; // red-500
    default:
      return { r: 107, g: 114, b: 128 }; // gray-500
  }
}
