'use client';

import { useEffect, useRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Text, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import type Map from 'ol/Map';
import { WeatherOverlayData } from '@/types';

interface WeatherLayerProps {
  map: Map | null;
  weatherData: WeatherOverlayData;
  showWind: boolean;
  showTemperature: boolean;
  showWaves: boolean;
  showStorms: boolean;
  opacity: number;
  isDarkMode?: boolean;
}

export default function WeatherLayer({
  map,
  weatherData,
  showWind,
  showTemperature,
  showWaves,
  showStorms,
  opacity,
  isDarkMode = false,
}: WeatherLayerProps) {
  const windLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const tempLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const waveLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const stormLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const opacityRef = useRef(opacity);

  // Initialize layers
  useEffect(() => {
    if (!map) return;

    // Wind layer
    const windSource = new VectorSource();
    const windLayer = new VectorLayer({
      source: windSource,
      style: (feature) => {
        const speed = feature.get('speed') as number;
        const direction = feature.get('direction') as number;

        // Create wind arrow
        const arrowSvg = createWindArrow(speed, direction);

        return new Style({
          image: new Icon({
            src: arrowSvg,
            scale: 0.7,
            opacity: opacityRef.current / 100,
            rotation: (direction * Math.PI) / 180,
          }),
        });
      },
      zIndex: 10,
    });

    // Temperature layer
    const tempSource = new VectorSource();
    const tempLayer = new VectorLayer({
      source: tempSource,
      style: (feature) => {
        const temp = feature.get('temperature') as number;
        const color = getTemperatureColor(temp);

        return new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: `rgba(${color.r}, ${color.g}, ${color.b}, ${opacityRef.current / 100 * 0.6})` }),
            stroke: new Stroke({ color: `rgba(${color.r}, ${color.g}, ${color.b}, ${opacityRef.current / 100})`, width: 1 }),
          }),
          text: new Text({
            text: `${Math.round(temp)}°C`,
            offsetY: 15,
            font: 'bold 10px sans-serif',
            fill: new Fill({ color: isDarkMode ? '#ffffff' : '#000000' }),
            stroke: new Stroke({ color: isDarkMode ? '#000000' : '#ffffff', width: 2 }),
          }),
        });
      },
      zIndex: 11,
    });

    // Wave layer
    const waveSource = new VectorSource();
    const waveLayer = new VectorLayer({
      source: waveSource,
      style: (feature) => {
        const height = feature.get('height') as number;
        const color = getWaveColor(height);

        return new Style({
          image: new CircleStyle({
            radius: 6 + height,
            fill: new Fill({ color: `rgba(${color.r}, ${color.g}, ${color.b}, ${opacityRef.current / 100 * 0.4})` }),
            stroke: new Stroke({ color: `rgba(${color.r}, ${color.g}, ${color.b}, ${opacityRef.current / 100})`, width: 1 }),
          }),
          text: new Text({
            text: `${height.toFixed(1)}m`,
            offsetY: 15,
            font: 'bold 9px sans-serif',
            fill: new Fill({ color: isDarkMode ? '#ffffff' : '#000000' }),
            stroke: new Stroke({ color: isDarkMode ? '#000000' : '#ffffff', width: 2 }),
          }),
        });
      },
      zIndex: 12,
    });

    // Storm layer
    const stormSource = new VectorSource();
    const stormLayer = new VectorLayer({
      source: stormSource,
      style: (feature) => {
        const severity = feature.get('severity') as number;
        const type = feature.get('type') as string;
        const radius = feature.get('radius') as number;

        return new Style({
          image: new CircleStyle({
            radius: 20,
            fill: new Fill({ color: `rgba(255, 0, 0, ${severity * 0.1 * opacityRef.current / 100})` }),
            stroke: new Stroke({ color: `rgba(139, 0, 0, ${opacityRef.current / 100})`, width: 2 }),
          }),
          text: new Text({
            text: getStormIcon(type),
            font: '20px sans-serif',
            fill: new Fill({ color: `rgba(139, 0, 0, ${opacityRef.current / 100})` }),
          }),
        });
      },
      zIndex: 13,
    });

    windLayerRef.current = windLayer;
    tempLayerRef.current = tempLayer;
    waveLayerRef.current = waveLayer;
    stormLayerRef.current = stormLayer;

    map.addLayer(windLayer);
    map.addLayer(tempLayer);
    map.addLayer(waveLayer);
    map.addLayer(stormLayer);

    return () => {
      if (windLayerRef.current) map.removeLayer(windLayerRef.current);
      if (tempLayerRef.current) map.removeLayer(tempLayerRef.current);
      if (waveLayerRef.current) map.removeLayer(waveLayerRef.current);
      if (stormLayerRef.current) map.removeLayer(stormLayerRef.current);
    };
  }, [map]);

  // Update layer visibility
  useEffect(() => {
    if (windLayerRef.current) windLayerRef.current.setVisible(showWind);
    if (tempLayerRef.current) tempLayerRef.current.setVisible(showTemperature);
    if (waveLayerRef.current) waveLayerRef.current.setVisible(showWaves);
    if (stormLayerRef.current) stormLayerRef.current.setVisible(showStorms);
  }, [showWind, showTemperature, showWaves, showStorms]);

  // Update ref and force re-render when opacity changes
  useEffect(() => {
    opacityRef.current = opacity;
    if (windLayerRef.current) windLayerRef.current.changed();
    if (tempLayerRef.current) tempLayerRef.current.changed();
    if (waveLayerRef.current) waveLayerRef.current.changed();
    if (stormLayerRef.current) stormLayerRef.current.changed();
  }, [opacity]);

  // Update wind data
  useEffect(() => {
    if (!windLayerRef.current || !showWind) return;

    const source = windLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    weatherData.windData.forEach((wind) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([wind.position.longitude, wind.position.latitude])),
      });
      feature.set('speed', wind.speed);
      feature.set('direction', wind.direction);
      source.addFeature(feature);
    });

    windLayerRef.current.changed();
  }, [weatherData.windData, showWind, opacity]);

  // Update temperature data
  useEffect(() => {
    if (!tempLayerRef.current || !showTemperature) return;

    const source = tempLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    weatherData.temperatureData.forEach((temp) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([temp.position.longitude, temp.position.latitude])),
      });
      feature.set('temperature', temp.temperature);
      source.addFeature(feature);
    });

    tempLayerRef.current.changed();
  }, [weatherData.temperatureData, showTemperature, opacity, isDarkMode]);

  // Update wave data
  useEffect(() => {
    if (!waveLayerRef.current || !showWaves) return;

    const source = waveLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    weatherData.waveData.forEach((wave) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([wave.position.longitude, wave.position.latitude])),
      });
      feature.set('height', wave.height);
      source.addFeature(feature);
    });

    waveLayerRef.current.changed();
  }, [weatherData.waveData, showWaves, opacity, isDarkMode]);

  // Update storm data
  useEffect(() => {
    if (!stormLayerRef.current || !showStorms) return;

    const source = stormLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    weatherData.stormSystems.forEach((storm) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([storm.center.longitude, storm.center.latitude])),
      });
      feature.set('severity', storm.severity);
      feature.set('type', storm.type);
      feature.set('radius', storm.radius);
      feature.set('name', storm.name);
      source.addFeature(feature);
    });

    stormLayerRef.current.changed();
  }, [weatherData.stormSystems, showStorms, opacity]);

  return null;
}

// Helper functions
function createWindArrow(speed: number, direction: number): string {
  const color = speed > 30 ? '#ef4444' : speed > 15 ? '#eab308' : '#3b82f6';
  const length = Math.min(30, 10 + speed * 0.5);

  const svg = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="20" x2="20" y2="${20 - length}"
            stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <polygon points="20,${20 - length} 17,${20 - length + 5} 23,${20 - length + 5}"
               fill="${color}"/>
    </svg>
  `;

  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function getTemperatureColor(temp: number): { r: number; g: number; b: number } {
  if (temp < 10) return { r: 59, g: 130, b: 246 }; // blue
  if (temp < 20) return { r: 34, g: 197, b: 94 }; // green
  if (temp < 30) return { r: 234, g: 179, b: 8 }; // yellow
  return { r: 239, g: 68, b: 68 }; // red
}

function getWaveColor(height: number): { r: number; g: number; b: number } {
  if (height < 2) return { r: 34, g: 197, b: 94 }; // green
  if (height < 4) return { r: 234, g: 179, b: 8 }; // yellow
  if (height < 6) return { r: 249, g: 115, b: 22 }; // orange
  return { r: 239, g: 68, b: 68 }; // red
}

function getStormIcon(type: string): string {
  switch (type) {
    case 'tropical_storm':
    case 'cyclone':
      return '🌀';
    case 'thunderstorm':
      return '⛈️';
    case 'fog':
      return '🌫️';
    case 'heavy_rain':
      return '🌧️';
    default:
      return '⚠️';
  }
}
