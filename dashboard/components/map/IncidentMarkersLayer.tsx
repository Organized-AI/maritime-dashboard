'use client';

import { useEffect, useRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import type Map from 'ol/Map';
import { Incident, IncidentType } from '@/types';

interface IncidentMarkersLayerProps {
  map: Map | null;
  incidents: Incident[];
  enabled: boolean;
  onIncidentClick?: (incident: Incident) => void;
  isDarkMode?: boolean;
}

export default function IncidentMarkersLayer({
  map,
  incidents,
  enabled,
  onIncidentClick,
  isDarkMode = false,
}: IncidentMarkersLayerProps) {
  const layerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Initialize layer
  useEffect(() => {
    if (!map) return;

    const source = new VectorSource();
    const layer = new VectorLayer({
      source,
      style: (feature) => {
        const incident = feature.get('incident') as Incident;
        const isActive = incident.status === 'active';

        return new Style({
          image: new Icon({
            src: getIncidentIcon(incident.type, incident.severity),
            scale: isActive ? 0.8 : 0.6,
            opacity: isActive ? 1 : 0.7,
          }),
          text: new Text({
            text: incident.severity >= 4 ? '!' : '',
            offsetY: 0,
            font: 'bold 16px sans-serif',
            fill: new Fill({ color: '#ffffff' }),
            stroke: new Stroke({ color: '#000000', width: 2 }),
          }),
        });
      },
      zIndex: 15, // Above weather, below vessel names
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

  // Update incident markers
  useEffect(() => {
    if (!layerRef.current || !enabled) return;

    const source = layerRef.current.getSource();
    if (!source) return;

    source.clear();

    // Only show active and monitoring incidents on the map
    const visibleIncidents = incidents.filter(
      (i) => i.status === 'active' || i.status === 'monitoring'
    );

    visibleIncidents.forEach((incident) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([incident.location.longitude, incident.location.latitude])),
      });
      feature.set('incident', incident);
      source.addFeature(feature);
    });

    layerRef.current.changed();
  }, [incidents, enabled]);

  // Handle clicks
  useEffect(() => {
    if (!map || !onIncidentClick) return;

    const handleClick = (evt: any) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f, layer) => {
        if (layer === layerRef.current) return f;
        return undefined;
      });

      if (feature) {
        const incident = feature.get('incident') as Incident;
        if (incident) {
          onIncidentClick(incident);
        }
      }
    };

    map.on('click', handleClick);

    return () => {
      map.un('click', handleClick);
    };
  }, [map, onIncidentClick]);

  return null;
}

// Helper function to get incident icon
function getIncidentIcon(type: IncidentType, severity: number): string {
  const color = severity >= 4 ? '#dc2626' : severity >= 3 ? '#ea580c' : '#eab308';
  const icon = getIncidentIconSymbol(type);

  const svg = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="${color}" opacity="0.8"/>
      <circle cx="20" cy="20" r="14" fill="${color}"/>
      <text x="20" y="26" font-size="16" text-anchor="middle" fill="white">${icon}</text>
    </svg>
  `;

  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function getIncidentIconSymbol(type: IncidentType): string {
  switch (type) {
    case 'weather':
      return '⛈️';
    case 'criminal':
      return '⚠️';
    case 'geopolitical':
      return '🚫';
    case 'financial':
      return '💰';
    case 'mechanical':
      return '⚙️';
    case 'medical':
      return '🏥';
    case 'environmental':
      return '🌊';
    case 'collision_risk':
      return '⚡';
    case 'man_overboard':
      return '🆘';
    default:
      return '❗';
  }
}
