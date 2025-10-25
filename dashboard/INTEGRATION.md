# Integration Guide: Maritime AI Dashboard

## Overview

This guide explains how to integrate the Next.js Maritime AI Dashboard with the existing PHP OpenSeaMap application.

## Current Architecture

```
online_chart/
├── index.php              # Existing OpenSeaMap application (PHP)
├── api/                   # PHP API endpoints
├── javascript/            # OpenLayers map code
└── dashboard/            # New Next.js dashboard (this project)
    └── app/page.tsx
```

## Integration Options

### Option 1: Reverse Proxy (Recommended for Production)

Use a reverse proxy (nginx/Apache) to serve both applications under the same domain:

```nginx
# nginx configuration
server {
    listen 80;
    server_name maritime-dashboard.local;

    # Next.js Dashboard
    location / {
        proxy_pass http://localhost:3000;
    }

    # PHP OpenSeaMap
    location /map {
        proxy_pass http://localhost:80;
        rewrite ^/map/(.*)$ /$1 break;
    }

    # PHP API
    location /api {
        proxy_pass http://localhost:80/api;
    }
}
```

**Access:**
- Dashboard: `http://maritime-dashboard.local/`
- Map: `http://maritime-dashboard.local/map`
- API: `http://maritime-dashboard.local/api/*`

### Option 2: Iframe Embedding

Embed the OpenSeaMap inside the dashboard using an iframe:

#### Step 1: Update MapIntegration Component

```typescript
// components/MapIntegration.tsx
export default function MapIntegration({ vessels, selectedVessel }: MapIntegrationProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (selectedVessel && iframeRef.current) {
      const { latitude, longitude } = selectedVessel.position;

      // Send message to iframe
      iframeRef.current.contentWindow?.postMessage({
        type: 'CENTER_MAP',
        lat: latitude,
        lon: longitude,
        zoom: 10
      }, '*');
    }
  }, [selectedVessel]);

  return (
    <iframe
      ref={iframeRef}
      src="/map/index.php"
      className="w-full h-full border-0"
      title="Maritime Map"
    />
  );
}
```

#### Step 2: Add postMessage Listener to index.php

Add this JavaScript to the existing `index.php`:

```javascript
// Listen for messages from parent dashboard
window.addEventListener('message', (event) => {
  if (event.data.type === 'CENTER_MAP') {
    // Update OpenLayers map center
    map.getView().setCenter(
      ol.proj.fromLonLat([event.data.lon, event.data.lat])
    );
    map.getView().setZoom(event.data.zoom);
  }
});

// Send vessel click events back to dashboard
map.on('click', (evt) => {
  const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
  if (feature && feature.get('type') === 'vessel') {
    window.parent.postMessage({
      type: 'VESSEL_CLICKED',
      vesselId: feature.get('id')
    }, '*');
  }
});
```

#### Step 3: Listen in Dashboard

```typescript
// app/page.tsx
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'VESSEL_CLICKED') {
      const vessel = vessels.find(v => v.id === event.data.vesselId);
      if (vessel) setSelectedVessel(vessel);
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, [vessels]);
```

### Option 3: Extract OpenLayers to React

Create a React wrapper for OpenLayers functionality:

#### Step 1: Install OpenLayers

```bash
npm install ol
npm install @types/ol --save-dev
```

#### Step 2: Create OpenLayers Component

```typescript
// components/OpenSeaMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

export default function OpenSeaMap({ center, zoom }: { center: [number, number], zoom: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map>();

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
    });

    return () => mapInstance.current?.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.getView().setCenter(fromLonLat(center));
      mapInstance.current.getView().setZoom(zoom);
    }
  }, [center, zoom]);

  return <div ref={mapRef} className="w-full h-full" />;
}
```

#### Step 3: Use in Dashboard

```typescript
import OpenSeaMap from '@/components/OpenSeaMap';

// In page.tsx
<OpenSeaMap
  center={[selectedVessel?.position.longitude || 0, selectedVessel?.position.latitude || 0]}
  zoom={10}
/>
```

### Option 4: API-Only Integration

Use the existing PHP APIs from the Next.js dashboard:

#### Step 1: Update next.config.js

Already configured for you:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:80/api/:path*',
    },
  ]
}
```

#### Step 2: Create API Client

```typescript
// lib/api.ts
export async function fetchVesselAIS() {
  const response = await fetch('/api/getAIS.php');
  return response.json();
}

export async function fetchWeather(lat: number, lon: number) {
  const response = await fetch(`/api/weather.php?lat=${lat}&lon=${lon}`);
  return response.json();
}

export async function fetchHarbours() {
  const response = await fetch('/api/getHarbours.php');
  return response.json();
}
```

#### Step 3: Replace Mock Data

```typescript
// app/page.tsx
useEffect(() => {
  async function loadRealData() {
    const aisData = await fetchVesselAIS();
    const transformedVessels = aisData.map(transformAISToVessel);
    setVessels(transformedVessels);
  }
  loadRealData();
}, []);
```

## Data Synchronization

### Real-time Updates with WebSockets

If you want real-time updates, consider adding WebSocket support:

#### Backend (PHP)

Use Ratchet or a similar WebSocket library:

```php
// websocket-server.php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new VesselDataHandler()
        )
    ),
    8080
);

$server->run();
```

#### Frontend (Next.js)

```typescript
// lib/websocket.ts
export function useVesselUpdates() {
  const [vessels, setVessels] = useState<Vessel[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'VESSEL_UPDATE') {
        setVessels(prev => updateVessel(prev, data.vessel));
      }
    };

    return () => ws.close();
  }, []);

  return vessels;
}
```

## Environment Variables

Create `.env.local` for configuration:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:80
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_MAP_TILE_URL=https://tiles.openseamap.org
```

## CORS Configuration

If running on separate ports, configure CORS in PHP:

```php
// api/cors.php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

Include in each API endpoint:

```php
// api/getAIS.php
require_once 'cors.php';
// ... rest of code
```

## Development Workflow

### Running Both Applications

Terminal 1 (PHP):
```bash
php -S localhost:80
```

Terminal 2 (Next.js):
```bash
cd dashboard
npm run dev
```

### Production Deployment

1. Build Next.js:
```bash
cd dashboard
npm run build
```

2. Configure web server to serve:
   - Static Next.js files from `dashboard/.next`
   - PHP files from root directory

3. Example nginx config:
```nginx
server {
    listen 80;
    root /var/www/maritime-dashboard;

    location /_next {
        alias /var/www/maritime-dashboard/dashboard/.next;
    }

    location / {
        try_files $uri @nextjs;
    }

    location @nextjs {
        proxy_pass http://localhost:3000;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        include fastcgi_params;
    }
}
```

## Testing Integration

1. Start both servers
2. Navigate to `http://localhost:3000`
3. Click on a vessel card
4. Verify the map centers on the vessel (if iframe integration is used)
5. Test API calls in browser DevTools Network tab

## Troubleshooting

### CORS Errors
- Add CORS headers to PHP API endpoints
- Configure Next.js rewrites in `next.config.js`

### Iframe Communication Issues
- Check that postMessage origins match
- Verify iframe src URL is correct
- Use browser DevTools to debug messages

### API Connection Failed
- Verify PHP server is running on port 80
- Check Next.js rewrites configuration
- Test API endpoints directly in browser

## Next Steps

1. Choose integration method based on requirements
2. Implement chosen approach
3. Test with real vessel data
4. Add authentication/authorization
5. Deploy to production environment

---

For questions, refer to README.md or PRD.md.
