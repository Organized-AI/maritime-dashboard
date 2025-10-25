# Maritime AI Agent Specialties - Master Guide

This skill provides comprehensive guidance for all AI agents in the Maritime Intelligence System. Each agent has specialized knowledge and responsibilities for vessel monitoring, safety, and operational excellence.

## Overview of Maritime AI Agent System

The Maritime AI Dashboard employs five specialized autonomous agents that work together to ensure vessel safety, regulatory compliance, and operational efficiency. Each agent monitors specific aspects of vessel operations and provides real-time recommendations.

## Agent Architecture

```
┌─────────────────────────────────────────────────────────┐
│           Maritime AI Dashboard (Central Hub)            │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
   ┌────▼────┐  ┌────────┐  ┌────────┐  ┌──────▼──────┐
   │ Weather │  │ Navi-  │  │ Inci-  │  │ Compliance  │
   │ Agent   │  │ gation │  │ dent   │  │   Agent     │
   └─────────┘  └────────┘  └────────┘  └─────────────┘
                     │
                ┌────▼──────┐
                │   Comms   │
                │   Agent   │
                └───────────┘
```

## The Five Agent Types

### 1. Weather Agent 🌦️
**Primary Focus**: Meteorological monitoring and weather-related safety

**Responsibilities**:
- Real-time weather data analysis
- Storm tracking and prediction
- Route weather optimization
- Sea state assessment
- Severe weather alerts
- Ice and fog warnings

**Key Skills**: `/skills/weather-agent`

---

### 2. Navigation Agent 🧭
**Primary Focus**: Safe routing and collision avoidance

**Responsibilities**:
- Route optimization
- Collision risk detection
- Traffic separation scheme compliance
- Proximity alerts to other vessels
- Shallow water warnings
- Port approach guidance

**Key Skills**: `/skills/navigation-agent`

---

### 3. Incident Response Agent 🚨
**Primary Focus**: Emergency detection and response coordination

**Responsibilities**:
- Real-time incident detection
- Emergency classification
- Response protocol activation
- Multi-vessel coordination
- Search and rescue support
- Damage assessment

**Key Skills**: `/skills/incident-response-agent`

---

### 4. Compliance Agent 📋
**Primary Focus**: Regulatory adherence and documentation

**Responsibilities**:
- International maritime law compliance (SOLAS, MARPOL, COLREG)
- Flag state regulations
- Port state control readiness
- Environmental compliance monitoring
- Crew certification tracking
- Inspection preparation

**Key Skills**: `/skills/compliance-agent`

---

### 5. Communication Agent 📡
**Primary Focus**: Inter-vessel and shore communication coordination

**Responsibilities**:
- VHF/AIS communication monitoring
- Distress signal detection
- Multi-channel message routing
- Communication protocol enforcement
- Language translation support
- Emergency broadcast coordination

**Key Skills**: `/skills/communication-agent`

---

## How Agents Collaborate

### Scenario 1: Storm Warning
1. **Weather Agent** detects approaching storm system
2. **Navigation Agent** calculates alternative routes
3. **Communication Agent** broadcasts warnings to nearby vessels
4. **Compliance Agent** ensures weather routing doesn't violate regulations
5. **Incident Response Agent** stands by for emergency response if needed

### Scenario 2: Collision Risk
1. **Navigation Agent** detects potential collision course
2. **Communication Agent** attempts VHF contact with target vessel
3. **Compliance Agent** verifies COLREG right-of-way rules
4. **Weather Agent** provides visibility and sea state data
5. **Incident Response Agent** prepares emergency protocols

### Scenario 3: Medical Emergency
1. **Incident Response Agent** receives medical emergency alert
2. **Communication Agent** initiates distress communications
3. **Navigation Agent** calculates fastest route to medical facility
4. **Weather Agent** assesses route weather conditions
5. **Compliance Agent** ensures proper emergency reporting

---

## Agent Status Indicators

Each agent reports status using a standardized system:

| Status | Icon | Meaning |
|--------|------|---------|
| **Active** | 🟢 | Agent operating normally, all systems functional |
| **Alert** | 🟡 | Agent detected issue requiring attention |
| **Warning** | 🟠 | Agent detected serious concern requiring action |
| **Critical** | 🔴 | Agent detected emergency requiring immediate response |
| **Offline** | ⚫ | Agent not receiving data or temporarily unavailable |

---

## Agent Recommendation Format

All agents provide recommendations in a standardized format:

```json
{
  "agentType": "weather|navigation|incident|compliance|communication",
  "severity": 1-5,
  "timestamp": "ISO 8601 timestamp",
  "title": "Brief recommendation title",
  "description": "Detailed explanation",
  "actionRequired": "What the crew should do",
  "priority": "immediate|high|medium|low",
  "relatedData": {
    "key": "relevant data points"
  }
}
```

---

## Shared Data Sources

All agents have access to:

### Real-time Data
- AIS vessel positions and movements
- Weather data (wind, waves, visibility, temperature)
- Sea state information
- VHF communications
- Radar data
- GPS positioning

### Historical Data
- Vessel track history (24-48 hours)
- Weather patterns
- Incident reports
- Compliance records
- Communication logs

### Reference Data
- Nautical charts
- Port information
- Regulatory databases
- Emergency contact directories
- Best practice guidelines

---

## Agent Activation Triggers

### Weather Agent Triggers
- Wind speed > 25 knots
- Wave height > 3 meters
- Visibility < 2 nautical miles
- Temperature extremes
- Storm systems within 100nm

### Navigation Agent Triggers
- Vessel proximity < 2nm
- Course deviation > 10 degrees
- Speed anomalies
- Shallow water approach
- Traffic density increase

### Incident Response Agent Triggers
- Distress signal detected
- Collision risk severity > 3
- Man overboard alert
- Fire/flooding detection
- Medical emergency
- Mechanical failure

### Compliance Agent Triggers
- Regulation zone entry
- Inspection due date approaching
- Certificate expiration < 30 days
- Environmental limit approach
- Crew hour limits

### Communication Agent Triggers
- Distress call on any channel
- VHF traffic directed to vessel
- AIS safety message received
- Weather broadcast
- Port authority communication

---

## Inter-Agent Communication Protocol

Agents communicate using a standardized message bus:

```javascript
{
  "from": "agent-type",
  "to": "agent-type|all",
  "messageType": "alert|query|response|recommendation",
  "priority": 1-5,
  "payload": {
    // Agent-specific data
  }
}
```

---

## Agent Learning & Improvement

Each agent employs machine learning to improve over time:

1. **Pattern Recognition**: Identifies recurring situations and optimal responses
2. **Feedback Integration**: Learns from crew acceptance/rejection of recommendations
3. **Outcome Analysis**: Analyzes results of past recommendations
4. **Contextual Adaptation**: Adjusts recommendations based on vessel type, route, weather
5. **Collaborative Learning**: Shares insights with other vessel agent systems

---

## Using Agent Skills

To invoke specific agent behavior, use the appropriate skill command:

```bash
/skills/weather-agent          # Weather monitoring and forecasting
/skills/navigation-agent       # Route planning and collision avoidance
/skills/incident-response-agent # Emergency response coordination
/skills/compliance-agent       # Regulatory compliance checking
/skills/communication-agent    # Communication coordination
```

---

## Agent Performance Metrics

### Key Performance Indicators (KPIs)

**Weather Agent**
- Weather alert accuracy rate
- False positive rate
- Storm prediction lead time
- Route optimization fuel savings

**Navigation Agent**
- Collision avoidance success rate
- Route efficiency improvement
- Near-miss detection rate
- Traffic conflict resolution time

**Incident Response Agent**
- Response time to incidents
- Emergency protocol accuracy
- Coordination effectiveness
- Incident resolution time

**Compliance Agent**
- Violation prevention rate
- Inspection pass rate
- Documentation completeness
- Regulatory update awareness

**Communication Agent**
- Message delivery success rate
- Response time to distress calls
- Translation accuracy
- Channel availability

---

## Development Guidelines

When implementing or extending agent functionality:

### 1. Follow the Single Responsibility Principle
Each agent should focus on its core domain. Cross-domain concerns should trigger inter-agent communication.

### 2. Prioritize Safety
All agent recommendations must prioritize:
1. Human life safety
2. Vessel safety
3. Environmental protection
4. Regulatory compliance
5. Operational efficiency

### 3. Provide Clear Rationale
Every recommendation must include:
- Why the recommendation is made
- What data supports it
- What risks it addresses
- What actions are required

### 4. Support Human Override
All agent recommendations can be overridden by qualified human operators, with override reasons logged.

### 5. Continuous Monitoring
Agents operate 24/7, continuously analyzing data and providing real-time updates.

---

## Integration with Dashboard

Agents integrate with the Maritime AI Dashboard through:

### Display Components
- Agent status cards (active/inactive)
- Recommendation panels
- Alert notifications
- Detailed agent views

### Data Flow
```
Real-time Data → Agent Analysis → Recommendations → Dashboard Display → Crew Action
      ↑                                                                      ↓
      └──────────────────────── Feedback Loop ────────────────────────────┘
```

### API Endpoints
```typescript
GET  /api/agents/status           // All agent statuses
GET  /api/agents/{type}/status    // Specific agent status
GET  /api/agents/{type}/recommendations // Agent recommendations
POST /api/agents/{type}/feedback  // Submit crew feedback
```

---

## Next Steps

1. Review individual agent skill files for detailed operational guidelines
2. Implement agent recommendation logic in dashboard
3. Create agent status monitoring components
4. Build agent feedback system for continuous improvement
5. Test multi-agent coordination scenarios

---

## Related Documentation

- [AISStream Integration Guide](../dashboard/AISSTREAM_SETUP.md)
- [Troubleshooting Guide](../dashboard/TROUBLESHOOTING.md)
- [Dashboard Components](../dashboard/components/)
- [Types Definitions](../dashboard/types/index.ts)

---

**Version**: 1.0
**Last Updated**: 2025-10-25
**Maintained By**: Maritime AI Development Team
