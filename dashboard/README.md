# Maritime AI Dashboard

A comprehensive vessel intelligence and safety system dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Overview

This dashboard provides real-time monitoring and management capabilities for maritime fleet operations, including:

- **Fleet Overview**: Monitor all vessels with real-time position, status, and connectivity information
- **Incident Management**: Track and respond to incidents with AI-powered recommendations
- **Vessel Details**: Deep dive into individual vessel metrics, weather conditions, and AI agent status
- **Real-time Updates**: Automatic data refresh every 5 seconds for live tracking

## Features

### ✅ Completed Features

#### 1. Fleet Overview Dashboard
- Real-time vessel tracking with 12 mock vessels
- Fleet statistics cards (Total Vessels, Active, Incidents, Offline)
- Filter tabs: All Vessels, Active, Alerts, Offline
- Vessel cards displaying:
  - Name, type, and connectivity status
  - Speed, heading, destination, fuel level
  - GPS coordinates
  - Visual alerts for low fuel and connectivity issues
- Click-to-view vessel details

#### 2. Incident Management Panel
- Comprehensive incident tracking with multiple types:
  - Weather, Criminal, Geopolitical, Financial
  - Mechanical, Medical, Environmental, Collision Risk
- Severity-based classification (1-5, color-coded)
- Status tracking (Active, Resolved, Monitoring, Acknowledged)
- Filter by status and incident type
- AI Agent recommendations for critical incidents
- Detailed incident cards with:
  - Vessel information
  - Location and timestamp
  - Type and severity indicators
  - Resolution tracking

#### 3. Vessel Detail View (Modal)
- Full vessel information display:
  - Flag, IMO, MMSI, crew count
  - Navigation data (speed, heading, fuel, ETA)
  - GPS coordinates
- Weather conditions:
  - Temperature, wind speed, wave height, visibility
  - Pressure, humidity, conditions
- AI Vessel Agents status:
  - 5 agent types (Weather, Navigation, Incident, Compliance, Communication)
  - Real-time status indicators
  - Confidence scores
  - Last action timestamps

#### 4. Mock Data System
- Realistic vessel data generator
- Incident generator with varied scenarios
- Real-time position updates (every 5 seconds)
- Dynamic fleet statistics calculation
- Weather data simulation
- AI agent activity simulation

#### 5. Technical Features
- TypeScript for type safety
- Tailwind CSS for responsive design
- Real-time data updates with React state management
- Maritime-themed color palette
- Responsive grid layouts
- Modal overlays with smooth animations
- UTC time display
- View toggle (Fleet/Incidents)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts (installed, ready for analytics)
- **Date Handling**: date-fns

## Getting Started

### Installation

```bash
cd dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
dashboard/
├── app/
│   ├── globals.css          # Global styles and maritime theme
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── FleetOverview.tsx    # Fleet monitoring component
│   ├── IncidentManagement.tsx # Incident tracking component
│   ├── VesselDetail.tsx     # Vessel detail modal
│   └── MapIntegration.tsx   # Map integration placeholder
├── lib/
│   └── mockData.ts          # Mock data generators
├── types/
│   └── index.ts             # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Component Overview

### FleetOverview
Displays a grid of vessel cards with real-time status information and filtering capabilities.

**Props:**
- `vessels`: Array of vessel objects
- `stats`: Fleet statistics
- `onVesselSelect`: Callback when vessel is clicked

### IncidentManagement
Manages and displays all incidents with filtering and severity-based sorting.

**Props:**
- `incidents`: Array of incident objects
- `onIncidentSelect`: Callback when incident is clicked

### VesselDetail
Modal displaying comprehensive vessel information including navigation, weather, and AI agents.

**Props:**
- `vessel`: Selected vessel object
- `weather`: Weather data object
- `agents`: Array of AI agent objects
- `onClose`: Callback to close modal

### MapIntegration
Placeholder component for integrating the existing OpenSeaMap application.

**Props:**
- `vessels`: Array of vessels to display on map
- `selectedVessel`: Currently selected vessel
- `height`: Map container height

## Data Types

### Vessel
```typescript
interface Vessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  type: string;
  flag: string;
  position: Coordinates;
  speed: number;
  heading: number;
  destination: string;
  eta: string;
  status: 'active' | 'anchored' | 'moored' | 'underway';
  connectivity: ConnectivityStatus;
  lastUpdate: string;
  crew: number;
  fuelLevel: number;
}
```

### Incident
```typescript
interface Incident {
  id: string;
  vesselId: string;
  vesselName: string;
  type: IncidentType;
  severity: 1 | 2 | 3 | 4 | 5;
  status: IncidentStatus;
  title: string;
  description: string;
  location: Coordinates;
  locationDescription: string;
  timestamp: string;
  resolvedAt?: string;
  agentRecommendation?: string;
}
```

## Customization

### Theme Colors

Maritime theme colors are defined in `tailwind.config.ts`:

```typescript
colors: {
  maritime: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    900: '#0c4a6e',
  },
}
```

### Update Interval

Real-time updates occur every 5 seconds. To change:

```typescript
// In app/page.tsx
setInterval(() => {
  // Update logic
}, 5000); // Change this value (milliseconds)
```

## Next Steps / TODO

### High Priority
- [ ] Integrate actual vessel data API
- [ ] Connect to real AIS data stream
- [ ] Implement WebSocket for real-time updates
- [ ] Embed OpenSeaMap (from ../index.php) into MapIntegration component
- [ ] Add user authentication
- [ ] Implement data persistence

### Medium Priority
- [ ] Add route planning visualization
- [ ] Implement incident response workflow
- [ ] Create analytics dashboard with charts
- [ ] Add offline-first capabilities with service workers
- [ ] Implement audio interface integration
- [ ] Add notification system

### Future Enhancements
- [ ] Multi-tenant support for sister companies
- [ ] AI agent configuration panel
- [ ] Historical data playback
- [ ] Export functionality (PDF reports)
- [ ] Mobile responsive optimizations
- [ ] Dark mode support

## Integration with Existing Application

The dashboard is designed to work alongside the existing PHP/OpenSeaMap application:

### Option 1: Iframe Integration
Embed the existing map in an iframe and use postMessage for communication:

```typescript
// Send vessel selection to map
iframe.contentWindow.postMessage({
  type: 'SELECT_VESSEL',
  vessel: selectedVessel
}, '*');
```

### Option 2: Extract OpenLayers
Extract the OpenLayers code from `index.php` and create a React wrapper component.

### Option 3: Parallel Deployment
Run both applications in parallel:
- Dashboard: `http://localhost:3000` (Next.js)
- Map: `http://localhost:80` (PHP/Apache)

Link between them using navigation or iframes.

## Performance Notes

- Mock data generation happens once on mount
- Real-time updates only affect moving vessels
- Component re-renders are optimized with React state management
- Filtering operations are client-side for instant feedback

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

Proprietary - Maritime AI Dashboard Project

## Contributors

Built with Claude Code for maritime hackathon project.

---

For questions or issues, refer to the PRD.md in the parent directory.
