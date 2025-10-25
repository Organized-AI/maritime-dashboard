// Vessel Icon Generator for Maritime AI Dashboard
// Creates distinctive SVG icons for each vessel type

export type VesselType =
  | 'Container Ship'
  | 'Bulk Carrier'
  | 'Tanker'
  | 'Cargo Ship'
  | 'Fishing Vessel'
  | 'Research Vessel'
  | 'Passenger Ship';

export interface VesselIconOptions {
  type: VesselType;
  color: string;
  size?: number;
}

/**
 * Generates a data URL for a vessel icon based on type and status
 */
export function generateVesselIcon(options: VesselIconOptions): string {
  const { type, color, size = 32 } = options;
  const svg = getVesselSVG(type, color, size);
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/**
 * Gets the appropriate SVG for a vessel type
 */
function getVesselSVG(type: VesselType, color: string, size: number): string {
  const center = size / 2;

  switch (type) {
    case 'Container Ship':
      return createContainerShipSVG(color, size, center);
    case 'Bulk Carrier':
      return createBulkCarrierSVG(color, size, center);
    case 'Tanker':
      return createTankerSVG(color, size, center);
    case 'Cargo Ship':
      return createCargoShipSVG(color, size, center);
    case 'Fishing Vessel':
      return createFishingVesselSVG(color, size, center);
    case 'Research Vessel':
      return createResearchVesselSVG(color, size, center);
    case 'Passenger Ship':
      return createPassengerShipSVG(color, size, center);
    default:
      return createDefaultVesselSVG(color, size, center);
  }
}

// Container Ship - Large rectangular hull with stacked containers
function createContainerShipSVG(color: string, size: number, center: number): string {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Glow effect -->
      <circle cx="${center}" cy="${center}" r="${center - 2}" fill="${color}" opacity="0.3"/>
      <circle cx="${center}" cy="${center}" r="${center - 4}" fill="${color}" opacity="0.5"/>

      <!-- Hull -->
      <path d="M${center} ${center - 10} L${center + 8} ${center + 4} L${center + 8} ${center + 8} L${center - 8} ${center + 8} L${center - 8} ${center + 4} Z"
            fill="${color}" stroke="white" stroke-width="1.5"/>

      <!-- Containers (stacks) -->
      <rect x="${center - 5}" y="${center - 6}" width="3" height="3" fill="white" opacity="0.9"/>
      <rect x="${center - 1}" y="${center - 6}" width="3" height="3" fill="white" opacity="0.9"/>
      <rect x="${center + 3}" y="${center - 6}" width="3" height="3" fill="white" opacity="0.9"/>
      <rect x="${center - 3}" y="${center - 2}" width="6" height="3" fill="white" opacity="0.9"/>

      <!-- Bridge -->
      <rect x="${center - 3}" y="${center + 2}" width="6" height="4" fill="white" opacity="0.95"/>
    </svg>
  `;
}

// Bulk Carrier - Wide hull with cargo holds
function createBulkCarrierSVG(color: string, size: number, center: number): string {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Glow effect -->
      <circle cx="${center}" cy="${center}" r="${center - 2}" fill="${color}" opacity="0.3"/>
      <circle cx="${center}" cy="${center}" r="${center - 4}" fill="${color}" opacity="0.5"/>

      <!-- Hull (wider) -->
      <path d="M${center} ${center - 10} L${center + 9} ${center + 4} L${center + 9} ${center + 8} L${center - 9} ${center + 8} L${center - 9} ${center + 4} Z"
            fill="${color}" stroke="white" stroke-width="1.5"/>

      <!-- Cargo holds (open hatches) -->
      <rect x="${center - 6}" y="${center - 4}" width="4" height="6" fill="#1a1a1a" opacity="0.6" stroke="white" stroke-width="0.5"/>
      <rect x="${center + 2}" y="${center - 4}" width="4" height="6" fill="#1a1a1a" opacity="0.6" stroke="white" stroke-width="0.5"/>

      <!-- Bridge -->
      <rect x="${center - 2}" y="${center + 4}" width="4" height="3" fill="white" opacity="0.95"/>
    </svg>
  `;
}

// Tanker - Smooth cylindrical hull
function createTankerSVG(color: string, size: number, center: number): string {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Glow effect -->
      <circle cx="${center}" cy="${center}" r="${center - 2}" fill="${color}" opacity="0.3"/>
      <circle cx="${center}" cy="${center}" r="${center - 4}" fill="${color}" opacity="0.5"/>

      <!-- Hull (rounded) -->
      <ellipse cx="${center}" cy="${center + 1}" rx="9" ry="11" fill="${color}" stroke="white" stroke-width="1.5"/>

      <!-- Tank sections -->
      <ellipse cx="${center}" cy="${center - 3}" rx="6" ry="4" fill="white" opacity="0.3" stroke="white" stroke-width="0.5"/>
      <ellipse cx="${center}" cy="${center + 2}" rx="6" ry="3" fill="white" opacity="0.3" stroke="white" stroke-width="0.5"/>

      <!-- Bridge (aft) -->
      <rect x="${center - 3}" y="${center + 6}" width="6" height="3" fill="white" opacity="0.95"/>
      <circle cx="${center}" cy="${center - 8}" r="1.5" fill="white" opacity="0.9"/>
    </svg>
  `;
}

// Cargo Ship - General cargo vessel with derricks
function createCargoShipSVG(color: string, size: number, center: number): string {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Glow effect -->
      <circle cx="${center}" cy="${center}" r="${center - 2}" fill="${color}" opacity="0.3"/>
      <circle cx="${center}" cy="${center}" r="${center - 4}" fill="${color}" opacity="0.5"/>

      <!-- Hull -->
      <path d="M${center} ${center - 10} L${center + 7} ${center + 4} L${center + 7} ${center + 8} L${center - 7} ${center + 8} L${center - 7} ${center + 4} Z"
            fill="${color}" stroke="white" stroke-width="1.5"/>

      <!-- Cargo holds -->
      <rect x="${center - 5}" y="${center - 2}" width="4" height="5" fill="white" opacity="0.4" stroke="white" stroke-width="0.5"/>
      <rect x="${center + 1}" y="${center - 2}" width="4" height="5" fill="white" opacity="0.4" stroke="white" stroke-width="0.5"/>

      <!-- Derricks/Cranes -->
      <line x1="${center - 3}" y1="${center - 2}" x2="${center - 6}" y2="${center - 6}" stroke="white" stroke-width="1" opacity="0.9"/>
      <line x1="${center + 3}" y1="${center - 2}" x2="${center + 6}" y2="${center - 6}" stroke="white" stroke-width="1" opacity="0.9"/>

      <!-- Bridge -->
      <rect x="${center - 2}" y="${center + 4}" width="4" height="3" fill="white" opacity="0.95"/>
    </svg>
  `;
}

// Fishing Vessel - Smaller with nets/equipment
function createFishingVesselSVG(color: string, size: number, center: number): string {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Glow effect -->
      <circle cx="${center}" cy="${center}" r="${center - 2}" fill="${color}" opacity="0.3"/>
      <circle cx="${center}" cy="${center}" r="${center - 4}" fill="${color}" opacity="0.5"/>

      <!-- Hull (smaller, rounded) -->
      <path d="M${center} ${center - 8} L${center + 6} ${center + 2} L${center + 6} ${center + 6} L${center - 6} ${center + 6} L${center - 6} ${center + 2} Z"
            fill="${color}" stroke="white" stroke-width="1.5"/>

      <!-- Wheelhouse -->
      <rect x="${center - 3}" y="${center - 2}" width="6" height="5" fill="white" opacity="0.95"/>

      <!-- Fishing equipment (crane/davit) -->
      <line x1="${center + 4}" y1="${center + 2}" x2="${center + 7}" y2="${center - 2}" stroke="white" stroke-width="1.5" opacity="0.9"/>
      <circle cx="${center + 7}" cy="${center - 2}" r="1" fill="white" opacity="0.9"/>

      <!-- Net marker -->
      <path d="M${center - 5} ${center + 4} Q${center - 7} ${center + 7} ${center - 5} ${center + 8}"
            stroke="white" stroke-width="1" fill="none" opacity="0.7"/>
    </svg>
  `;
}

// Research Vessel - Distinctive equipment and antennae
function createResearchVesselSVG(color: string, size: number, center: number): string {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Glow effect -->
      <circle cx="${center}" cy="${center}" r="${center - 2}" fill="${color}" opacity="0.3"/>
      <circle cx="${center}" cy="${center}" r="${center - 4}" fill="${color}" opacity="0.5"/>

      <!-- Hull -->
      <path d="M${center} ${center - 9} L${center + 7} ${center + 3} L${center + 7} ${center + 7} L${center - 7} ${center + 7} L${center - 7} ${center + 3} Z"
            fill="${color}" stroke="white" stroke-width="1.5"/>

      <!-- Lab/Research area -->
      <rect x="${center - 5}" y="${center - 2}" width="10" height="5" fill="white" opacity="0.4" stroke="white" stroke-width="0.8"/>

      <!-- Research equipment (cranes, sensors) -->
      <rect x="${center - 1}" y="${center - 7}" width="2" height="5" fill="white" opacity="0.9"/>

      <!-- Antennae array -->
      <line x1="${center - 4}" y1="${center - 2}" x2="${center - 4}" y2="${center - 6}" stroke="white" stroke-width="1" opacity="0.9"/>
      <line x1="${center}" y1="${center - 2}" x2="${center}" y2="${center - 8}" stroke="white" stroke-width="1.2" opacity="0.9"/>
      <line x1="${center + 4}" y1="${center - 2}" x2="${center + 4}" y2="${center - 6}" stroke="white" stroke-width="1" opacity="0.9"/>

      <!-- Sensor domes -->
      <circle cx="${center - 4}" cy="${center - 6}" r="1" fill="white" opacity="0.9"/>
      <circle cx="${center + 4}" cy="${center - 6}" r="1" fill="white" opacity="0.9"/>

      <!-- Bridge -->
      <rect x="${center - 2}" y="${center + 4}" width="4" height="2" fill="white" opacity="0.95"/>
    </svg>
  `;
}

// Passenger Ship - Multi-deck cruise ship
function createPassengerShipSVG(color: string, size: number, center: number): string {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Glow effect -->
      <circle cx="${center}" cy="${center}" r="${center - 2}" fill="${color}" opacity="0.3"/>
      <circle cx="${center}" cy="${center}" r="${center - 4}" fill="${color}" opacity="0.5"/>

      <!-- Hull -->
      <path d="M${center} ${center - 9} L${center + 8} ${center + 4} L${center + 8} ${center + 8} L${center - 8} ${center + 8} L${center - 8} ${center + 4} Z"
            fill="${color}" stroke="white" stroke-width="1.5"/>

      <!-- Multiple decks -->
      <rect x="${center - 6}" y="${center - 5}" width="12" height="3" fill="white" opacity="0.9" stroke="white" stroke-width="0.5"/>
      <rect x="${center - 6}" y="${center - 2}" width="12" height="3" fill="white" opacity="0.9" stroke="white" stroke-width="0.5"/>
      <rect x="${center - 5}" y="${center + 1}" width="10" height="2" fill="white" opacity="0.9" stroke="white" stroke-width="0.5"/>

      <!-- Portholes/Windows -->
      <circle cx="${center - 4}" cy="${center - 3.5}" r="0.5" fill="${color}" opacity="0.6"/>
      <circle cx="${center - 1}" cy="${center - 3.5}" r="0.5" fill="${color}" opacity="0.6"/>
      <circle cx="${center + 2}" cy="${center - 3.5}" r="0.5" fill="${color}" opacity="0.6"/>
      <circle cx="${center + 5}" cy="${center - 3.5}" r="0.5" fill="${color}" opacity="0.6"/>

      <!-- Funnel -->
      <rect x="${center - 2}" y="${center + 4}" width="4" height="3" fill="white" opacity="0.95"/>
      <ellipse cx="${center}" cy="${center + 4}" rx="2.5" ry="1" fill="white" opacity="0.95"/>
    </svg>
  `;
}

// Default vessel icon (fallback)
function createDefaultVesselSVG(color: string, size: number, center: number): string {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${center}" cy="${center}" r="${center - 2}" fill="${color}" opacity="0.8"/>
      <circle cx="${center}" cy="${center}" r="${center - 6}" fill="${color}"/>
      <path d="M${center} ${center - 6} L${center + 4} ${center + 2} L${center} ${center + 6} L${center - 4} ${center + 2} Z"
            fill="white" opacity="0.9"/>
    </svg>
  `;
}

/**
 * Get vessel color based on connectivity status
 */
export function getVesselColor(connectivity: string): string {
  switch (connectivity) {
    case 'offline':
      return '#ef4444'; // red
    case 'degraded':
      return '#eab308'; // yellow
    case 'satellite':
      return '#3b82f6'; // blue
    case 'online':
    default:
      return '#22c55e'; // green
  }
}
