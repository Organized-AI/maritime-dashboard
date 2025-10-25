/**
 * AISStream.io WebSocket Integration
 * Provides real-time vessel tracking data
 */

import { Vessel, Coordinates, Incident } from '@/types';

export interface AISStreamConfig {
  apiKey: string;
  boundingBoxes?: BoundingBox[];
  shipMMSIs?: string[];
  messageTypes?: string[];
}

export interface BoundingBox {
  topLeft: Coordinates;
  bottomRight: Coordinates;
}

interface AISMessage {
  MessageType: string;
  MetaData: {
    MMSI: string;
    ShipName?: string;
    latitude: number;
    longitude: number;
    time_utc: string;
  };
  Message: {
    PositionReport?: {
      Cog?: number; // Course over ground
      NavigationalStatus?: number;
      RateOfTurn?: number;
      Sog?: number; // Speed over ground
      TrueHeading?: number;
    };
    ShipStaticData?: {
      Type?: number;
      CallSign?: string;
      Name?: string;
      Dimension?: {
        A?: number;
        B?: number;
        C?: number;
        D?: number;
      };
      Destination?: string;
      Eta?: {
        Month?: number;
        Day?: number;
        Hour?: number;
        Minute?: number;
      };
      ImoNumber?: string;
      MaximumStaticDraught?: number;
    };
  };
}

export class AISStreamService {
  private ws: WebSocket | null = null;
  private config: AISStreamConfig;
  private vessels: Map<string, Vessel> = new Map();
  private onVesselUpdate?: (vessels: Vessel[]) => void;
  private onIncidentDetected?: (incident: Incident) => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor(config: AISStreamConfig) {
    this.config = config;
  }

  /**
   * Connect to AISStream WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Attempting to connect to AISStream.io...');
        this.ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

        this.ws.onopen = () => {
          console.log('✅ WebSocket connection established to AISStream.io');
          this.subscribe();
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data: AISMessage = JSON.parse(event.data);
            console.log('📡 Received AIS message:', data.MessageType, 'for MMSI:', data.MetaData.MMSI);
            this.handleMessage(data);
          } catch (error) {
            console.error('❌ Error parsing AIS message:', error);
            console.error('Raw message:', event.data);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('🔌 Disconnected from AISStream.io', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          this.handleReconnect();
        };
      } catch (error) {
        console.error('❌ Failed to create WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Subscribe to AIS data stream
   */
  private subscribe(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not ready');
      return;
    }

    // Format bounding boxes for AISStream API
    let boundingBoxes;
    if (this.config.boundingBoxes && this.config.boundingBoxes.length > 0) {
      // Convert from our format to AISStream format
      boundingBoxes = this.config.boundingBoxes.map(box => [
        [box.topLeft.latitude, box.topLeft.longitude],
        [box.bottomRight.latitude, box.bottomRight.longitude]
      ]);
    } else {
      // Default: Global coverage (can be restricted for better performance)
      boundingBoxes = [
        [
          [90, -180],    // Top-left (North-West)
          [-90, 180]     // Bottom-right (South-East)
        ]
      ];
    }

    const subscription: any = {
      APIKey: this.config.apiKey,
      BoundingBoxes: boundingBoxes
    };

    // Add optional filters
    if (this.config.shipMMSIs && this.config.shipMMSIs.length > 0) {
      subscription.FiltersShipMMSI = this.config.shipMMSIs;
    }

    if (this.config.messageTypes && this.config.messageTypes.length > 0) {
      subscription.FilterMessageTypes = this.config.messageTypes;
    }

    console.log('Sending subscription:', JSON.stringify(subscription, null, 2));
    this.ws.send(JSON.stringify(subscription));
    console.log('Subscribed to AIS stream');
  }

  /**
   * Handle incoming AIS messages
   */
  private handleMessage(data: AISMessage): void {
    const mmsi = data.MetaData.MMSI;

    // Get or create vessel
    let vessel = this.vessels.get(mmsi);

    if (!vessel) {
      // Create new vessel from AIS data
      vessel = {
        id: mmsi,
        name: data.MetaData.ShipName || `Vessel ${mmsi}`,
        imo: '',
        mmsi: mmsi,
        type: 'cargo',
        flag: '',
        position: {
          latitude: data.MetaData.latitude,
          longitude: data.MetaData.longitude
        },
        speed: 0,
        heading: 0,
        destination: 'Unknown',
        eta: new Date().toISOString(),
        status: 'active',
        connectivity: 'online',
        lastUpdate: data.MetaData.time_utc,
        crew: 0,
        fuelLevel: 100,
        historicalPositions: []
      };
    }

    // Update vessel with position report data
    if (data.Message.PositionReport) {
      const posReport = data.Message.PositionReport;

      // Store historical position
      if (vessel.historicalPositions) {
        vessel.historicalPositions.push({
          latitude: data.MetaData.latitude,
          longitude: data.MetaData.longitude,
          timestamp: data.MetaData.time_utc,
          speed: posReport.Sog || 0
        });

        // Keep only last 100 positions
        if (vessel.historicalPositions.length > 100) {
          vessel.historicalPositions = vessel.historicalPositions.slice(-100);
        }
      }

      vessel.position = {
        latitude: data.MetaData.latitude,
        longitude: data.MetaData.longitude
      };
      vessel.speed = posReport.Sog || 0;
      vessel.heading = posReport.TrueHeading || posReport.Cog || 0;
      vessel.lastUpdate = data.MetaData.time_utc;

      // Determine status from navigational status
      vessel.status = this.mapNavigationalStatus(posReport.NavigationalStatus);

      // Detect incidents based on vessel behavior
      this.detectIncidents(vessel, posReport);
    }

    // Update vessel with static data
    if (data.Message.ShipStaticData) {
      const staticData = data.Message.ShipStaticData;

      vessel.name = staticData.Name || vessel.name;
      vessel.imo = staticData.ImoNumber || vessel.imo;
      vessel.destination = staticData.Destination || vessel.destination;
      vessel.type = this.mapVesselType(staticData.Type);

      if (staticData.Eta) {
        const eta = staticData.Eta;
        const now = new Date();
        const etaDate = new Date(
          now.getFullYear(),
          (eta.Month || 1) - 1,
          eta.Day || 1,
          eta.Hour || 0,
          eta.Minute || 0
        );
        vessel.eta = etaDate.toISOString();
      }
    }

    // Update vessel in map
    this.vessels.set(mmsi, vessel);

    // Notify listeners
    if (this.onVesselUpdate) {
      this.onVesselUpdate(Array.from(this.vessels.values()));
    }
  }

  /**
   * Detect potential incidents based on vessel behavior
   */
  private detectIncidents(vessel: Vessel, posReport: any): void {
    const incidents: Incident[] = [];

    // Detect collision risk - vessel not under command or restricted maneuverability
    if (posReport.NavigationalStatus === 2 || posReport.NavigationalStatus === 3) {
      incidents.push({
        id: `${vessel.id}-${Date.now()}-nav-status`,
        vesselId: vessel.id,
        vesselName: vessel.name,
        type: 'collision_risk',
        severity: 3,
        status: 'active',
        title: 'Vessel Navigation Status Alert',
        description: posReport.NavigationalStatus === 2
          ? 'Vessel not under command'
          : 'Vessel restricted maneuverability',
        location: vessel.position,
        timestamp: vessel.lastUpdate,
        agentRecommendation: 'Monitor vessel closely and maintain safe distance'
      });
    }

    // Detect unusual rate of turn (potential mechanical issue)
    if (posReport.RateOfTurn && Math.abs(posReport.RateOfTurn) > 100) {
      incidents.push({
        id: `${vessel.id}-${Date.now()}-rot`,
        vesselId: vessel.id,
        vesselName: vessel.name,
        type: 'mechanical',
        severity: 2,
        status: 'active',
        title: 'Unusual Rate of Turn Detected',
        description: `Rate of turn: ${posReport.RateOfTurn}°/min - Possible steering issue`,
        location: vessel.position,
        timestamp: vessel.lastUpdate,
        agentRecommendation: 'Check steering systems and rudder controls'
      });
    }

    // Detect stopped vessel in traffic lane (potential breakdown)
    if (vessel.speed < 0.5 && vessel.status === 'underway') {
      incidents.push({
        id: `${vessel.id}-${Date.now()}-stopped`,
        vesselId: vessel.id,
        vesselName: vessel.name,
        type: 'mechanical',
        severity: 3,
        status: 'active',
        title: 'Vessel Stopped While Underway',
        description: 'Vessel appears to have stopped unexpectedly - possible engine failure',
        location: vessel.position,
        timestamp: vessel.lastUpdate,
        agentRecommendation: 'Contact vessel to verify operational status'
      });
    }

    // Notify about detected incidents
    incidents.forEach(incident => {
      if (this.onIncidentDetected) {
        this.onIncidentDetected(incident);
      }
    });
  }

  /**
   * Map AIS navigational status to vessel status
   */
  private mapNavigationalStatus(status?: number): Vessel['status'] {
    switch (status) {
      case 0: return 'underway';
      case 1: return 'anchored';
      case 5: return 'moored';
      default: return 'active';
    }
  }

  /**
   * Map AIS vessel type code to readable type
   */
  private mapVesselType(typeCode?: number): string {
    if (!typeCode) return 'unknown';

    if (typeCode >= 70 && typeCode <= 79) return 'cargo';
    if (typeCode >= 80 && typeCode <= 89) return 'tanker';
    if (typeCode >= 60 && typeCode <= 69) return 'passenger';
    if (typeCode >= 40 && typeCode <= 49) return 'high_speed';
    if (typeCode >= 30 && typeCode <= 39) return 'fishing';

    return 'other';
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect().catch(err => {
          console.error('Reconnection failed:', err);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Register callback for vessel updates
   */
  onUpdate(callback: (vessels: Vessel[]) => void): void {
    this.onVesselUpdate = callback;
  }

  /**
   * Register callback for incident detection
   */
  onIncident(callback: (incident: Incident) => void): void {
    this.onIncidentDetected = callback;
  }

  /**
   * Get current vessels
   */
  getVessels(): Vessel[] {
    return Array.from(this.vessels.values());
  }

  /**
   * Disconnect from AISStream
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.vessels.clear();
  }
}
