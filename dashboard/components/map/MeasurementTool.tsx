'use client';

import { useEffect, useRef, useState } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw';
import { Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style';
import { LineString, Polygon } from 'ol/geom';
import { getLength, getArea } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import type Map from 'ol/Map';
import type { DrawEvent } from 'ol/interaction/Draw';
import { MeasurementType } from '@/types';

interface MeasurementToolProps {
  map: Map | null;
  measurementType: MeasurementType | null;
  onMeasurementComplete?: (value: number, unit: string) => void;
  isDarkMode?: boolean;
}

export default function MeasurementTool({
  map,
  measurementType,
  onMeasurementComplete,
  isDarkMode = false,
}: MeasurementToolProps) {
  const layerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const drawRef = useRef<Draw | null>(null);
  const [currentMeasurement, setCurrentMeasurement] = useState<string>('');

  // Initialize measurement layer
  useEffect(() => {
    if (!map) return;

    const source = new VectorSource();
    const layer = new VectorLayer({
      source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#3b82f6',
          width: 3,
          lineDash: [10, 10],
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: '#3b82f6',
          }),
        }),
      }),
      zIndex: 20,
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

  // Handle measurement mode changes
  useEffect(() => {
    if (!map || !layerRef.current) return;

    // Remove existing draw interaction
    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
      drawRef.current = null;
    }

    // Clear measurements when switching modes or disabling
    if (!measurementType) {
      const source = layerRef.current.getSource();
      if (source) source.clear();
      setCurrentMeasurement('');
      return;
    }

    // Create new draw interaction based on measurement type
    let drawType: 'LineString' | 'Polygon';
    if (measurementType === 'distance') {
      drawType = 'LineString';
    } else if (measurementType === 'route') {
      drawType = 'LineString';
    } else {
      drawType = 'Polygon';
    }

    const draw = new Draw({
      source: layerRef.current.getSource()!,
      type: drawType,
      style: new Style({
        fill: new Fill({
          color: 'rgba(59, 130, 246, 0.2)',
        }),
        stroke: new Stroke({
          color: '#3b82f6',
          lineDash: [10, 10],
          width: 3,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: '#3b82f6',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.8)',
          }),
        }),
      }),
    });

    // Handle drawing
    let listener: any;
    draw.on('drawstart', (evt: DrawEvent) => {
      const sketch = evt.feature;

      listener = sketch.getGeometry()!.on('change', (evt) => {
        const geom = evt.target;
        let output = '';

        if (measurementType === 'distance' || measurementType === 'route') {
          output = formatLength(geom as LineString);
        } else if (measurementType === 'area') {
          output = formatArea(geom as Polygon);
        }

        setCurrentMeasurement(output);
      });
    });

    draw.on('drawend', (evt: DrawEvent) => {
      const geom = evt.feature.getGeometry();
      let value = 0;
      let unit = '';

      if (measurementType === 'distance' || measurementType === 'route') {
        const length = getLength(geom as LineString);
        value = length / 1852; // Convert to nautical miles
        unit = 'nm';
      } else if (measurementType === 'area') {
        const area = getArea(geom as Polygon);
        value = area / 1000000; // Convert to square km
        unit = 'sqkm';
      }

      if (onMeasurementComplete) {
        onMeasurementComplete(value, unit);
      }

      if (listener) {
        unByKey(listener);
      }

      // Keep the measurement visible
      setTimeout(() => {
        setCurrentMeasurement('');
      }, 3000);
    });

    drawRef.current = draw;
    map.addInteraction(draw);

    return () => {
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
        drawRef.current = null;
      }
      if (listener) {
        unByKey(listener);
      }
    };
  }, [map, measurementType, onMeasurementComplete]);

  return null;
}

// Format length output
function formatLength(line: LineString): string {
  const length = getLength(line);
  const nauticalMiles = length / 1852;

  if (nauticalMiles > 1) {
    return `${nauticalMiles.toFixed(2)} nm`;
  } else {
    return `${(nauticalMiles * 1.852).toFixed(2)} km`;
  }
}

// Format area output
function formatArea(polygon: Polygon): string {
  const area = getArea(polygon);
  const sqKm = area / 1000000;

  if (sqKm > 1) {
    return `${sqKm.toFixed(2)} km²`;
  } else {
    return `${area.toFixed(2)} m²`;
  }
}
