'use client';

import { useEffect, useRef, useState } from 'react';
import { Vessel, TrailTimeRange, WeatherOverlayData, Incident, MeasurementType } from '@/types';
import { generateWeatherOverlayData } from '@/lib/mockData';
import { generateVesselIcon, getVesselColor, VesselType } from '@/lib/vesselIcons';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import { Maximize2, Minimize2, LocateFixed, Plus, Minus } from 'lucide-react';
import RouteTrailsLayer from './map/RouteTrailsLayer';
import RouteTrailsControl from './map/RouteTrailsControl';
import WeatherLayer from './map/WeatherLayer';
import WeatherControl from './map/WeatherControl';
import IncidentMarkersLayer from './map/IncidentMarkersLayer';
import MeasurementTool from './map/MeasurementTool';
import MeasurementControl from './map/MeasurementControl';
import 'ol/ol.css';

interface OpenSeaMapProps {
  vessels: Vessel[];
  incidents?: Incident[];
  selectedVessel?: Vessel | null;
  onVesselClick?: (vessel: Vessel) => void;
  onIncidentClick?: (incident: Incident) => void;
  height?: string;
  isDarkMode?: boolean;
}

export default function OpenSeaMap({
  vessels,
  incidents = [],
  selectedVessel,
  onVesselClick,
  onIncidentClick,
  height = '600px',
  isDarkMode = false
}: OpenSeaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map>();
  const vesselLayerRef = useRef<VectorLayer<VectorSource>>();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Route trails state (disabled for now - will rebuild later)
  const [routeTrailsEnabled, setRouteTrailsEnabled] = useState(false);
  const [trailTimeRange, setTrailTimeRange] = useState<TrailTimeRange>('6h');
  const [trailOpacity, setTrailOpacity] = useState(90);

  // Weather overlay state
  const [weatherData, setWeatherData] = useState<WeatherOverlayData>(generateWeatherOverlayData());
  const [showWind, setShowWind] = useState(false);
  const [showTemperature, setShowTemperature] = useState(false);
  const [showWaves, setShowWaves] = useState(false);
  const [showStorms, setShowStorms] = useState(true); // Show storms by default
  const [weatherOpacity, setWeatherOpacity] = useState(70);

  // Incident markers state
  const [showIncidents, setShowIncidents] = useState(true); // Show incidents by default

  // Measurement tool state
  const [activeMeasurement, setActiveMeasurement] = useState<MeasurementType | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create base layers
    const osmLayer = new TileLayer({
      source: new XYZ({
        url: isDarkMode
          ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
          : 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attributions: '© OpenStreetMap contributors'
      }),
    });

    // OpenSeaMap overlay
    const seaMarkLayer = new TileLayer({
      source: new XYZ({
        url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
        attributions: '© OpenSeaMap contributors',
      }),
      opacity: 0.8,
    });

    // Vessel layer
    const vesselSource = new VectorSource();
    const vesselLayer = new VectorLayer({
      source: vesselSource,
      style: (feature) => {
        const vessel = feature.get('vessel') as Vessel;
        const isSelected = selectedVessel?.id === vessel.id;

        return new Style({
          image: new Icon({
            src: getVesselIcon(vessel),
            scale: isSelected ? 1.2 : 0.8,
            rotation: (vessel.heading * Math.PI) / 180,
          }),
          text: new Text({
            text: vessel.name,
            offsetY: -25,
            font: 'bold 12px sans-serif',
            fill: new Fill({
              color: isDarkMode ? '#ffffff' : '#000000',
            }),
            stroke: new Stroke({
              color: isDarkMode ? '#000000' : '#ffffff',
              width: 3,
            }),
          }),
        });
      },
    });
    vesselLayerRef.current = vesselLayer;

    // Create map with enhanced controls
    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, seaMarkLayer, vesselLayer],
      view: new View({
        center: fromLonLat([0, 20]),
        zoom: 3,
        minZoom: 2,
        maxZoom: 18,
        enableRotation: true,
        constrainResolution: false, // Smooth zoom without snapping
      }),
      controls: [], // We'll add custom controls
    });

    mapInstance.current = map;

    // Handle vessel clicks
    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const vessel = feature.get('vessel') as Vessel;
        if (vessel && onVesselClick) {
          onVesselClick(vessel);
        }
      }
    });

    // Change cursor on hover
    map.on('pointermove', (evt) => {
      const hit = map.hasFeatureAtPixel(evt.pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [isDarkMode]);

  // Update vessel markers
  useEffect(() => {
    if (!vesselLayerRef.current) return;

    const source = vesselLayerRef.current.getSource();
    if (!source) return;

    // Clear existing features
    source.clear();

    // Add vessel markers
    const features = vessels.map((vessel) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([vessel.position.longitude, vessel.position.latitude])),
      });
      feature.set('vessel', vessel);
      return feature;
    });

    source.addFeatures(features);
  }, [vessels]);

  // Center on selected vessel
  useEffect(() => {
    if (selectedVessel && mapInstance.current) {
      const view = mapInstance.current.getView();
      view.animate({
        center: fromLonLat([selectedVessel.position.longitude, selectedVessel.position.latitude]),
        zoom: 10,
        duration: 1000,
      });
    }
  }, [selectedVessel]);

  // Update layer styles when dark mode changes
  useEffect(() => {
    if (!mapInstance.current) return;

    const layers = mapInstance.current.getLayers().getArray();
    const osmLayer = layers[0] as TileLayer<XYZ>;

    if (osmLayer) {
      osmLayer.setSource(new XYZ({
        url: isDarkMode
          ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
          : 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attributions: '© OpenStreetMap contributors'
      }));
    }

    // Refresh vessel layer to update text colors
    if (vesselLayerRef.current) {
      vesselLayerRef.current.changed();
    }
  }, [isDarkMode]);

  const getVesselIcon = (vessel: Vessel) => {
    // Get color based on connectivity status
    const color = getVesselColor(vessel.connectivity);

    // Generate icon based on vessel type
    return generateVesselIcon({
      type: vessel.type as VesselType,
      color,
      size: 32,
    });
  };

  const fitToVessels = () => {
    if (!mapInstance.current || vessels.length === 0) return;

    const extent = vesselLayerRef.current?.getSource()?.getExtent();
    if (extent) {
      mapInstance.current.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 1000,
        maxZoom: 10,
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const zoomIn = () => {
    if (!mapInstance.current) return;
    const view = mapInstance.current.getView();
    const currentZoom = view.getZoom();
    if (currentZoom !== undefined) {
      view.animate({
        zoom: currentZoom + 1,
        duration: 250,
      });
    }
  };

  const zoomOut = () => {
    if (!mapInstance.current) return;
    const view = mapInstance.current.getView();
    const currentZoom = view.getZoom();
    if (currentZoom !== undefined) {
      view.animate({
        zoom: currentZoom - 1,
        duration: 250,
      });
    }
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}
      style={!isFullscreen ? { height } : {}}
    >
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-maritime-600 dark:bg-maritime-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live Map View</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-xs opacity-90">
            {vessels.length} vessel{vessels.length !== 1 ? 's' : ''} tracked
          </div>
          <button
            onClick={fitToVessels}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            title="Fit to vessels"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: isFullscreen ? '100vh' : height }} />

      {/* Route Trails Layer */}
      <RouteTrailsLayer
        map={mapInstance.current || null}
        vessels={vessels}
        enabled={routeTrailsEnabled}
        timeRange={trailTimeRange}
        opacity={trailOpacity}
        isDarkMode={isDarkMode}
      />

      {/* Weather Layer */}
      <WeatherLayer
        map={mapInstance.current || null}
        weatherData={weatherData}
        showWind={showWind}
        showTemperature={showTemperature}
        showWaves={showWaves}
        showStorms={showStorms}
        opacity={weatherOpacity}
        isDarkMode={isDarkMode}
      />

      {/* Incident Markers Layer */}
      <IncidentMarkersLayer
        map={mapInstance.current || null}
        incidents={incidents}
        enabled={showIncidents}
        onIncidentClick={onIncidentClick}
        isDarkMode={isDarkMode}
      />

      {/* Measurement Tool */}
      <MeasurementTool
        map={mapInstance.current || null}
        measurementType={activeMeasurement}
        isDarkMode={isDarkMode}
      />

      {/* Route Trails Control - Hidden for now, will rebuild later */}
      {false && (
        <div className="absolute bottom-4 right-4 z-10">
          <RouteTrailsControl
            enabled={routeTrailsEnabled}
            timeRange={trailTimeRange}
            opacity={trailOpacity}
            onToggle={() => setRouteTrailsEnabled(!routeTrailsEnabled)}
            onTimeRangeChange={setTrailTimeRange}
            onOpacityChange={setTrailOpacity}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute top-20 left-4 z-10 flex flex-col space-y-2">
        <button
          onClick={zoomIn}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 rounded-lg shadow-lg transition-colors"
          title="Zoom in"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={zoomOut}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 rounded-lg shadow-lg transition-colors"
          title="Zoom out"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Measurement Control */}
      <div className="absolute top-44 left-4 z-10">
        <MeasurementControl
          activeMeasurement={activeMeasurement}
          onMeasurementChange={setActiveMeasurement}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Weather Control */}
      <div className="absolute top-20 right-4 z-10">
        <WeatherControl
          showWind={showWind}
          showTemperature={showTemperature}
          showWaves={showWaves}
          showStorms={showStorms}
          opacity={weatherOpacity}
          onToggleWind={() => setShowWind(!showWind)}
          onToggleTemperature={() => setShowTemperature(!showTemperature)}
          onToggleWaves={() => setShowWaves(!showWaves)}
          onToggleStorms={() => setShowStorms(!showStorms)}
          onOpacityChange={setWeatherOpacity}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Vessel Status
        </h4>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Satellite</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Degraded</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Offline</span>
          </div>
        </div>
      </div>

      {/* Selected Vessel Info */}
      {selectedVessel && (
        <div className="absolute top-16 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            {selectedVessel.name}
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className="font-medium text-gray-900 dark:text-white">{selectedVessel.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Speed:</span>
              <span className="font-medium text-gray-900 dark:text-white">{selectedVessel.speed.toFixed(1)} kts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Heading:</span>
              <span className="font-medium text-gray-900 dark:text-white">{Math.round(selectedVessel.heading)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`font-medium capitalize ${
                selectedVessel.connectivity === 'online' ? 'text-green-600 dark:text-green-400' :
                selectedVessel.connectivity === 'offline' ? 'text-red-600 dark:text-red-400' :
                'text-yellow-600 dark:text-yellow-400'
              }`}>
                {selectedVessel.connectivity}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
