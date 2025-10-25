'use client';

import { useState } from 'react';
import { Incident, IncidentType, IncidentStatus } from '@/types';
import {
  AlertTriangle,
  Cloud,
  Skull,
  Globe,
  DollarSign,
  Wrench,
  Heart,
  Droplet,
  Navigation,
  CheckCircle,
  Eye,
  AlertCircle,
  Clock,
  MapPin,
  Ship,
} from 'lucide-react';

interface IncidentManagementProps {
  incidents: Incident[];
  onIncidentSelect?: (incident: Incident) => void;
}

export default function IncidentManagement({ incidents, onIncidentSelect }: IncidentManagementProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('all');
  const [selectedType, setSelectedType] = useState<IncidentType | 'all'>('all');

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    const statusMatch =
      filter === 'all' ? true :
      filter === 'active' ? incident.status === 'active' :
      filter === 'critical' ? incident.severity >= 4 : true;

    const typeMatch = selectedType === 'all' ? true : incident.type === selectedType;

    return statusMatch && typeMatch;
  }).sort((a, b) => {
    // Sort by severity (highest first), then by timestamp (newest first)
    if (b.severity !== a.severity) {
      return b.severity - a.severity;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Get icon for incident type
  const getIncidentIcon = (type: IncidentType) => {
    const iconProps = { className: 'w-5 h-5' };
    switch (type) {
      case 'weather': return <Cloud {...iconProps} />;
      case 'criminal': return <Skull {...iconProps} />;
      case 'geopolitical': return <Globe {...iconProps} />;
      case 'financial': return <DollarSign {...iconProps} />;
      case 'mechanical': return <Wrench {...iconProps} />;
      case 'medical': return <Heart {...iconProps} />;
      case 'environmental': return <Droplet {...iconProps} />;
      case 'collision_risk': return <Navigation {...iconProps} />;
      default: return <AlertTriangle {...iconProps} />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity: number) => {
    if (severity === 5) return 'bg-red-600 text-white';
    if (severity === 4) return 'bg-red-500 text-white';
    if (severity === 3) return 'bg-orange-500 text-white';
    if (severity === 2) return 'bg-yellow-500 text-white';
    return 'bg-blue-500 text-white';
  };

  // Get severity badge
  const getSeverityBadge = (severity: number) => {
    if (severity === 5) return 'CRITICAL';
    if (severity === 4) return 'HIGH';
    if (severity === 3) return 'MEDIUM';
    if (severity === 2) return 'LOW';
    return 'INFO';
  };

  // Get status icon
  const getStatusIcon = (status: IncidentStatus) => {
    switch (status) {
      case 'active': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'monitoring': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'acknowledged': return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  // Get border color for incident card
  const getBorderColor = (severity: number, status: IncidentStatus) => {
    if (status === 'resolved') return 'border-l-green-500';
    if (severity >= 4) return 'border-l-red-600';
    if (severity === 3) return 'border-l-orange-500';
    if (severity === 2) return 'border-l-yellow-500';
    return 'border-l-blue-500';
  };

  const activeCount = incidents.filter(i => i.status === 'active').length;
  const criticalCount = incidents.filter(i => i.severity >= 4).length;

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-3">
          {/* Status Filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase mb-2 block">
              Status Filter
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-maritime-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({incidents.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-maritime-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === 'critical'
                    ? 'bg-maritime-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Critical ({criticalCount})
              </button>
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase mb-2 block">
              Incident Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedType === 'all'
                    ? 'bg-maritime-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Types
              </button>
              {['weather', 'criminal', 'mechanical', 'medical', 'collision_risk'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as IncidentType)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                    selectedType === type
                      ? 'bg-maritime-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filteredIncidents.map(incident => (
          <div
            key={incident.id}
            onClick={() => onIncidentSelect?.(incident)}
            className={`bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer p-4 border-l-4 ${getBorderColor(incident.severity, incident.status)}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-2 rounded-lg ${
                  incident.status === 'resolved' ? 'bg-green-50' :
                  incident.severity >= 4 ? 'bg-red-50' :
                  incident.severity === 3 ? 'bg-orange-50' :
                  'bg-blue-50'
                }`}>
                  {getIncidentIcon(incident.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getSeverityColor(incident.severity)}`}>
                      {getSeverityBadge(incident.severity)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{incident.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(incident.status)}
                <span className="text-xs text-gray-500 capitalize">{incident.status}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Ship className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Vessel</p>
                  <p className="font-medium text-gray-900 truncate">{incident.vesselName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{incident.locationDescription}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Reported</p>
                  <p className="font-medium text-gray-900">
                    {new Date(incident.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {incident.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Agent Recommendation */}
            {incident.agentRecommendation && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-start space-x-2 text-sm">
                  <div className="bg-maritime-50 text-maritime-700 px-2 py-1 rounded text-xs font-medium">
                    AI AGENT
                  </div>
                  <p className="text-gray-700 flex-1">{incident.agentRecommendation}</p>
                </div>
              </div>
            )}

            {/* Resolved Timestamp */}
            {incident.resolvedAt && (
              <div className="mt-2 text-xs text-green-600">
                Resolved at {new Date(incident.resolvedAt).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredIncidents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500">No incidents match the selected filters</p>
          <p className="text-sm text-gray-400 mt-1">All clear!</p>
        </div>
      )}
    </div>
  );
}
