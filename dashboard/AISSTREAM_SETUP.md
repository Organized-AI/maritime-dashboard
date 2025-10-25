# AISStream.io Integration Setup

This guide explains how to connect your Maritime AI Dashboard to live AIS (Automatic Identification System) data using AISStream.io.

## Overview

The dashboard can operate in two modes:
1. **Mock Data Mode** (default) - Displays simulated vessel data for development
2. **Live AIS Stream Mode** - Connects to real-time vessel data via AISStream.io WebSocket

## Features

### Real-time Vessel Tracking
- Live vessel positions updated as they broadcast AIS signals
- Course, speed, and heading information
- Vessel identification (MMSI, IMO, name, type)
- Destination and ETA information
- Historical position trails

### Automatic Incident Detection
The system automatically detects potential incidents based on vessel behavior:

1. **Collision Risk Detection**
   - Vessels not under command (navigational status 2)
   - Vessels with restricted maneuverability (navigational status 3)

2. **Mechanical Issue Detection**
   - Unusual rate of turn (>100°/min)
   - Vessels stopped while underway

3. **Incident Alerts**
   - Real-time notifications
   - Severity classification
   - AI-powered recommendations

## Setup Instructions

### Step 1: Get an AISStream.io API Key

1. Visit [https://aisstream.io/](https://aisstream.io/)
2. Sign in with GitHub (or other supported methods)
3. Navigate to your account dashboard
4. Generate a new API key
5. Copy the API key securely

### Step 2: Configure Your Environment

1. Create a `.env.local` file in the dashboard directory:
   ```bash
   cd dashboard
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your API key:
   ```env
   NEXT_PUBLIC_AISSTREAM_API_KEY=your_actual_api_key_here
   ```

3. **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### Step 3: Start the Dashboard

```bash
npm run dev
```

### Step 4: Enable AIS Stream

1. Open the dashboard in your browser (usually http://localhost:3000)
2. Click the **"Use AIS Stream"** button in the system status banner
3. The connection status will change from "Mock Data" to "Connecting..." to "Connected"

## Connection Status Indicators

| Status | Color | Meaning |
|--------|-------|---------|
| **Disconnected** | Blue | Using mock data (default mode) |
| **Connecting...** | Yellow (pulsing) | Establishing WebSocket connection |
| **Connected** | Green | Live AIS data streaming |
| **Connection Failed** | Red | Error occurred, fallback to mock data |

## Customizing the Data Stream

### Geographic Bounding Boxes

By default, the integration streams global AIS data. To limit the area and improve performance, you can specify bounding boxes in [page.tsx](./app/page.tsx):

```typescript
aisServiceRef.current = new AISStreamService({
  apiKey: apiKey,
  boundingBoxes: [
    {
      topLeft: { latitude: 60, longitude: -10 },
      bottomRight: { latitude: 40, longitude: 20 }
    }
  ]
});
```

### Filter Specific Vessels

To track only specific vessels by MMSI:

```typescript
aisServiceRef.current = new AISStreamService({
  apiKey: apiKey,
  shipMMSIs: ['367123450', '367456780'] // Max 50 vessels
});
```

### Filter Message Types

To receive only specific AIS message types:

```typescript
aisServiceRef.current = new AISStreamService({
  apiKey: apiKey,
  messageTypes: ['PositionReport', 'ShipStaticData']
});
```

## Data Structure

### Vessel Data
The AIS integration automatically maps AIS messages to the dashboard's vessel format:

- **MMSI** → Vessel ID and MMSI
- **Latitude/Longitude** → Position
- **Speed Over Ground (SOG)** → Speed (knots)
- **Course Over Ground (COG) / True Heading** → Heading
- **Navigational Status** → Vessel status (active/anchored/moored/underway)
- **Ship Static Data** → Name, type, destination, ETA, IMO

### Incident Data
Incidents are automatically generated when:
- Unusual vessel behavior is detected
- Navigation status indicates danger
- Speed/heading anomalies occur

## Troubleshooting

### Connection Fails

**Check your API key:**
```bash
cat dashboard/.env.local
# Should show: NEXT_PUBLIC_AISSTREAM_API_KEY=...
```

**Restart the dev server:**
```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

### No Vessels Appearing

1. **Wait a few minutes** - Vessels broadcast AIS at intervals (2-10 seconds to 3 minutes depending on movement)
2. **Check bounding box** - Make sure your geographic area has vessel traffic
3. **Verify API key** - Ensure it's valid and not revoked
4. **Check browser console** - Look for WebSocket errors

### Limited Vessel Count

AISStream.io limits:
- Free tier may have vessel count limits
- Max 50 vessels when using `shipMMSIs` filter
- Geographic filters can reduce data volume

## API Limitations

- **Beta Service**: AISStream.io API is not stable (subject to change)
- **No SLA**: No uptime guarantees
- **Secure Connections Only**: API keys must use HTTPS/WSS
- **3-Second Subscription Window**: Must send subscription message within 3 seconds of connecting

## Architecture

```
Dashboard (Browser)
    ↓ WebSocket (WSS)
AISStream.io Service
    ↓ Real-time AIS Data
Global AIS Network
    ↓ Ship Broadcasts
Vessels at Sea
```

## Files Modified

1. **[lib/aisstream.ts](./lib/aisstream.ts)** - AISStream WebSocket service
2. **[app/page.tsx](./app/page.tsx)** - Dashboard integration
3. **[.env.local.example](./.env.local.example)** - Environment template

## Additional Resources

- [AISStream.io Documentation](https://aisstream.io/documentation)
- [AIS Message Types](https://gpsd.gitlab.io/gpsd/AIVDM.html)
- [Maritime Navigation Status Codes](https://www.navcen.uscg.gov/?pageName=AISRequirementsRev)

## Support

For issues with:
- **AISStream.io API**: Contact AISStream.io support
- **Dashboard Integration**: Check browser console for errors
- **Incident Detection**: Review [lib/aisstream.ts](./lib/aisstream.ts) incident detection logic
