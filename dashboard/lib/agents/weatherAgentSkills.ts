// Weather Agent Skills - Generates comprehensive weather monitoring data
import { Vessel, WeatherData, Coordinates } from '@/types';

// Helper functions
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max + 1));
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export interface WeatherForecast {
  timestamp: string;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  conditions: string;
  confidence: number;
}

export interface WeatherAlert {
  id: string;
  type: 'storm' | 'wind' | 'fog' | 'visibility' | 'ice';
  severity: 'low' | 'moderate' | 'high' | 'severe';
  title: string;
  description: string;
  distance: number; // nautical miles from vessel
  bearing: number; // degrees
  affectsRoute: boolean;
  timestamp: string;
}

export interface WeatherAgentData {
  currentConditions: WeatherData;
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
  trends: {
    temperatureTrend: 'rising' | 'falling' | 'stable';
    windTrend: 'increasing' | 'decreasing' | 'stable';
    pressureTrend: 'rising' | 'falling' | 'stable';
  };
  recommendations: string[];
  lastUpdate: string;
}

/**
 * Generate comprehensive weather data for a vessel
 */
export function generateWeatherAgentData(
  vessel: Vessel,
  baseWeather: WeatherData
): WeatherAgentData {
  const forecast = generateWeatherForecast(baseWeather, 6);
  const alerts = generateWeatherAlerts(vessel.position, baseWeather);
  const trends = analyzeWeatherTrends(baseWeather, forecast);
  const recommendations = generateWeatherRecommendations(baseWeather, alerts, vessel);

  return {
    currentConditions: baseWeather,
    forecast,
    alerts,
    trends,
    recommendations,
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * Generate weather forecast for next N hours
 */
function generateWeatherForecast(
  current: WeatherData,
  hours: number
): WeatherForecast[] {
  const forecasts: WeatherForecast[] = [];
  const conditions = ['Clear', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Rain', 'Heavy Rain'];

  for (let i = 1; i <= hours; i++) {
    // Simulate gradual changes
    const tempChange = random(-2, 2) * i * 0.3;
    const windChange = random(-5, 5) * i * 0.2;
    const waveChange = random(-0.5, 0.5) * i * 0.2;

    forecasts.push({
      timestamp: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
      temperature: Math.max(0, Math.min(40, current.temperature + tempChange)),
      windSpeed: Math.max(0, Math.min(50, current.windSpeed + windChange)),
      windDirection: (current.windDirection + random(-15, 15) + 360) % 360,
      waveHeight: Math.max(0, Math.min(15, current.waveHeight + waveChange)),
      conditions: i < 3 ? current.conditions : randomItem(conditions),
      confidence: randomInt(75, 95) - i * 2, // Confidence decreases with time
    });
  }

  return forecasts;
}

/**
 * Generate weather alerts based on conditions
 */
function generateWeatherAlerts(
  position: Coordinates,
  weather: WeatherData
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  // Storm system alert
  if (Math.random() > 0.6) {
    const distance = randomInt(150, 800);
    const bearing = randomInt(0, 359);

    alerts.push({
      id: `alert-storm-${Date.now()}`,
      type: 'storm',
      severity: distance < 300 ? 'moderate' : 'low',
      title: `Storm System ${distance} nm ${getCardinalDirection(bearing)}`,
      description: `Tropical storm with winds up to ${randomInt(35, 55)} kts. Currently moving ${randomItem(['northeast', 'east', 'southeast', 'north'])} at ${randomInt(8, 15)} kts.`,
      distance,
      bearing,
      affectsRoute: distance < 400 && Math.random() > 0.5,
      timestamp: new Date().toISOString(),
    });
  }

  // Wind speed increase
  if (weather.windSpeed < 20 && Math.random() > 0.5) {
    alerts.push({
      id: `alert-wind-${Date.now()}`,
      type: 'wind',
      severity: 'low',
      title: 'Wind Speed Increase Expected',
      description: `Wind speed forecasted to increase to ${randomInt(25, 35)} kts from ${getCardinalDirection(randomInt(0, 359))} in next 6 hours.`,
      distance: 0,
      bearing: randomInt(0, 359),
      affectsRoute: false,
      timestamp: new Date().toISOString(),
    });
  }

  // Visibility warning
  if (weather.visibility < 5) {
    alerts.push({
      id: `alert-visibility-${Date.now()}`,
      type: 'visibility',
      severity: weather.visibility < 2 ? 'high' : 'moderate',
      title: 'Reduced Visibility',
      description: `Current visibility ${weather.visibility.toFixed(1)} nm. ${weather.visibility < 2 ? 'Dense fog advisory in effect.' : 'Fog expected to clear in 3-4 hours.'}`,
      distance: 0,
      bearing: 0,
      affectsRoute: true,
      timestamp: new Date().toISOString(),
    });
  }

  return alerts;
}

/**
 * Analyze weather trends
 */
function analyzeWeatherTrends(
  current: WeatherData,
  forecast: WeatherForecast[]
): WeatherAgentData['trends'] {
  const avgFutureTemp = forecast.slice(0, 3).reduce((sum, f) => sum + f.temperature, 0) / 3;
  const avgFutureWind = forecast.slice(0, 3).reduce((sum, f) => sum + f.windSpeed, 0) / 3;

  return {
    temperatureTrend:
      avgFutureTemp > current.temperature + 1
        ? 'rising'
        : avgFutureTemp < current.temperature - 1
        ? 'falling'
        : 'stable',
    windTrend:
      avgFutureWind > current.windSpeed + 3
        ? 'increasing'
        : avgFutureWind < current.windSpeed - 3
        ? 'decreasing'
        : 'stable',
    pressureTrend:
      current.pressure < 1000 ? 'falling' : current.pressure > 1020 ? 'rising' : 'stable',
  };
}

/**
 * Generate weather-based recommendations
 */
function generateWeatherRecommendations(
  weather: WeatherData,
  alerts: WeatherAlert[],
  vessel: Vessel
): string[] {
  const recommendations: string[] = [];

  // No severe weather
  if (alerts.length === 0 && weather.waveHeight < 3 && weather.windSpeed < 20) {
    recommendations.push('No severe weather warnings');
    recommendations.push('Conditions expected to remain stable');
  }

  // High waves
  if (weather.waveHeight > 4) {
    recommendations.push(`Heavy seas - ${weather.waveHeight.toFixed(1)}m wave height`);
    recommendations.push('Reduce speed and secure all cargo');
    if (vessel.type === 'Passenger Ship') {
      recommendations.push('Passenger comfort may be affected');
    }
  }

  // Strong winds
  if (weather.windSpeed > 25) {
    recommendations.push(`Strong winds - ${weather.windSpeed.toFixed(1)} kts`);
    recommendations.push('Monitor wind direction for optimal course');
  }

  // Poor visibility
  if (weather.visibility < 5) {
    recommendations.push('Reduced visibility - increase radar monitoring');
    recommendations.push('Sound fog signals as required');
  }

  // Low pressure (potential storm)
  if (weather.pressure < 1000) {
    recommendations.push('Low pressure system - monitor for deteriorating conditions');
  }

  // Storm alerts
  const stormAlerts = alerts.filter(a => a.type === 'storm' && a.distance < 400);
  if (stormAlerts.length > 0) {
    recommendations.push(`Storm system ${stormAlerts[0].distance} nm away - consider route adjustment`);
  }

  return recommendations;
}

/**
 * Get cardinal direction from degrees
 */
function getCardinalDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Update weather data with realistic progression
 */
export function updateWeatherData(
  current: WeatherAgentData,
  timeElapsedMinutes: number
): WeatherAgentData {
  // Gradually shift current conditions toward first forecast
  const baseWeather = current.currentConditions;
  const nextForecast = current.forecast[0];

  if (nextForecast && timeElapsedMinutes > 15) {
    // Interpolate toward forecast
    const factor = Math.min(timeElapsedMinutes / 60, 1);

    baseWeather.temperature += (nextForecast.temperature - baseWeather.temperature) * factor * 0.1;
    baseWeather.windSpeed += (nextForecast.windSpeed - baseWeather.windSpeed) * factor * 0.1;
    baseWeather.waveHeight += (nextForecast.waveHeight - baseWeather.waveHeight) * factor * 0.1;
    baseWeather.pressure += random(-1, 1);
    baseWeather.visibility += random(-0.2, 0.2);

    // Clamp values
    baseWeather.temperature = Math.max(0, Math.min(40, baseWeather.temperature));
    baseWeather.windSpeed = Math.max(0, Math.min(60, baseWeather.windSpeed));
    baseWeather.waveHeight = Math.max(0, Math.min(15, baseWeather.waveHeight));
    baseWeather.pressure = Math.max(950, Math.min(1050, baseWeather.pressure));
    baseWeather.visibility = Math.max(0.1, Math.min(15, baseWeather.visibility));

    baseWeather.timestamp = new Date().toISOString();
  }

  return {
    ...current,
    currentConditions: baseWeather,
    lastUpdate: new Date().toISOString(),
  };
}
