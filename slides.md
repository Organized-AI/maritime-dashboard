---
theme: default
background: https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Maritime AI Dashboard
  Digital Twin of the Oceans - Vessel Intelligence & Safety System
drawings:
  persist: false
transition: slide-left
title: Maritime AI Dashboard
mdc: true
fonts:
  sans: 'Inter'
  mono: 'Fira Code'
aspectRatio: '16/9'
css: unocss
---

<style>
.slidev-layout {
  padding: 1rem 2rem !important;
}

h1 {
  margin-bottom: 0.5rem !important;
  font-size: 2.25rem !important;
}

h2 {
  margin-bottom: 0.4rem !important;
  margin-top: 0.5rem !important;
  font-size: 1.4rem !important;
}

ul, ol {
  margin-top: 0.3rem !important;
  margin-bottom: 0.3rem !important;
}

li {
  margin-bottom: 0.2rem !important;
  line-height: 1.3 !important;
}

p {
  margin-bottom: 0.4rem !important;
}
</style>

---

# Maritime AI Dashboard

**Digital Twin of the Oceans**

Vessel Intelligence & Safety System

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 text-sm opacity-50">
  Live Demo: http://localhost:3001
</div>

---
transition: fade-out
layout: two-cols
---

# The Challenge

<v-clicks>

**Maritime vessels operate in harsh, disconnected environments**

- 🌊 **30+ days** without internet connectivity
- ⚠️ **Critical incidents** require immediate response
- 📡 **Limited communication** with shore operations
- 🛠️ **Complex compliance** requirements (IMO, MARPOL, SOLAS)
- 💰 **High operational costs** (fuel, insurance, downtime)

</v-clicks>

::right::

<v-clicks>

# Our Solution

**Offline-first AI platform with autonomous agents**

- 🤖 **5 AI Agents** per vessel (Weather, Navigation, Incident, Compliance, Comms)
- 📶 **30+ day offline operation** with local processing
- 🎯 **Edge Computing** on NVIDIA Jetson hardware
- 🌐 **Multi-org network** for data sharing
- 🎤 **Voice-first interface** for hands-free operation

</v-clicks>

---
layout: center
class: text-center
---

# System Architecture

```mermaid {scale: 0.9}
graph TD
    A[Vessel Sensors<br/>GPS, AIS, Weather] --> B[NVIDIA Edge Device]
    B --> C[5 AI Agents<br/>Local Processing]
    C --> D[30-Day Cache]
    D --> E{Connected?}
    E -->|Yes| F[Cloud Dashboard]
    E -->|No| G[Queue for Sync]
    F --> H[Fleet Operations Center]
    F --> I[Sister Companies]

    style B fill:#76b900
    style C fill:#ffd700
    style F fill:#00a0ff
    style H fill:#ff6b6b
```

---

# Technology Stack

<div class="grid grid-cols-2 gap-10 px-8">

<div>

## Frontend Dashboard
- **Next.js 15** + TypeScript
- **Tailwind CSS** styling
- **OpenLayers 10.6** maps
- **Recharts** visualization

<div class="text-xs mt-3 opacity-80">
Built on OpenSeaMap (1,683 lines PHP, 17 APIs)
</div>

</div>

<div>

## Data Sources & Edge
- **Weather:** Stormglass.io, Open-Meteo
- **Regulations:** SOLAS chapters database
- **Tracking:** AIS + GMDSS
- **Edge AI:** NVIDIA Jetson
- **Local LLM:** Llama/Mistral

</div>

</div>

---
layout: image-right
image: https://images.unsplash.com/photo-1530669378-5c8f1e0ff1e0?w=800&q=80
---

# LIVE DEMO: Fleet Overview

**🌐 [localhost:3001](http://localhost:3001)**

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

### What You'll See

<v-clicks>

- **12 vessels** real-time status
- **Fleet statistics** panel
- **Connectivity** 🟢 🟡 🔴
- **Fuel level** warnings
- **Click vessel** for details

</v-clicks>

</div>

<div>

### Key Features

<v-clicks>

- Auto-refresh (5 sec)
- Color-coded status
- GPS coordinates
- Speed & heading
- Destination & ETA

</v-clicks>

</div>

</div>

---

# LIVE DEMO: Incident Management

**Switch to Incidents Tab** 👉 [localhost:3001](http://localhost:3001)

<div class="grid grid-cols-2 gap-10 px-4">

<div>

## 8 Incident Types

<v-clicks>

- 🌪️ Weather
- 🏴‍☠️ Criminal
- 🗺️ Geopolitical
- 💰 Financial
- ⚙️ Mechanical
- 🏥 Medical
- 🛢️ Environmental
- ⚠️ Dangerous

</v-clicks>

</div>

<div>

## Features

<v-clicks>

- **Severity** (1-5 color)
- **Status filtering**
- **Type filtering**
- **AI Recommendations**
- **Location data**
- **Damage tracking**
- **Timestamps**

</v-clicks>

</div>

</div>

---

# LIVE DEMO: OpenSeaMap

**Check out the Map Tab** 👉 [localhost:3001](http://localhost:3001)

<div class="grid grid-cols-2 gap-10 px-4 mt-4">

<div>

## Map Layers

<v-clicks>

- **Base OSM** tiles
- **Seamark** overlays
- **Weather** layer
- **Route Trails** (1h-7d)
- **Incident** markers
- **Measurement** tools

</v-clicks>

</div>

<div>

## Try It!

<v-clicks>

- Click vessels
- Toggle weather
- Measure distance
- Zoom & pan

</v-clicks>

</div>

</div>

---

# LIVE DEMO: Vessel Details

**Click any vessel card** 👉 [localhost:3001](http://localhost:3001)

<div class="grid grid-cols-2 gap-10 px-4">

<div>

## Vessel Info

<v-clicks>

**Status & Position**
- Connectivity
- Speed & heading
- GPS coordinates
- Destination & ETA

**Operational**
- Crew count
- Fuel level gauge
- Type & flag
- IMO & MMSI

</v-clicks>

</div>

<div>

## Intelligence

<v-clicks>

**Weather**
- Temp, pressure
- Wind, waves
- Visibility

**5 AI Agents**
- Weather
- Navigation
- Incident Response
- Compliance
- Communication

</v-clicks>

</div>

</div>

---

# AI Agent Capabilities

**Three core AI functions powered by real maritime data**

<div class="grid grid-cols-3 gap-6 mt-6 px-4 text-sm">

<div>

## 1. Auto-Populate Checklists

- Pre-departure templates
- Equipment vs SOLAS
- Sensor data integration

**Data:** SOLAS regs + vessel sensors

</div>

<div>

## 2. Route Optimization

- Weather forecast monitoring
- Hazard avoidance
- Alternative routing

**Data:** Weather APIs + AIS

</div>

<div>

## 3. Compliance Monitoring

- Certificate expiration
- Crew rest hours
- Emission reporting

**Data:** SOLAS + cert database

</div>

</div>

---

# Offline-First Architecture

**Critical for 30+ days without connectivity**

<div class="grid grid-cols-2 gap-10 px-6">

<div>

## How It Works

<v-clicks>

1. **Local Processing** - NVIDIA edge
2. **30-Day Cache** - Local storage
3. **Queue Sync** - Smart priority
4. **Confidence Scores** - Freshness
5. **Manual Override** - Captain control

</v-clicks>

</div>

<div>

## Data Priority

<v-clicks>

**P1:** Position, speed, status

**P2:** Route deviations

**P3:** Incidents

**P4:** Weather/oceanic

**P5:** Route updates

</v-clicks>

</div>

</div>

---
layout: two-cols
---

# Key Differentiators

<v-clicks>

## Why We're Unique

1. **Offline-First**
   - Only maritime platform designed for 30+ days offline

2. **AI Agent Autonomy**
   - 5 specialized agents per vessel

3. **Edge Computing**
   - NVIDIA-powered local processing

</v-clicks>

::right::

<v-clicks>

4. **Sister Company Network**
   - Industry-first multi-org sharing

5. **Audio-First Interface**
   - Hands-free voice commands

6. **Digital Twin Testing**
   - Safe agent behavior simulation

</v-clicks>

---

# Development Roadmap

<div class="text-sm px-8">

<v-clicks>

## Phase 1: MVP (M1-4) → $300K-$500K
Single vessel, dashboard, incident reporting
**Success:** 1 vessel, 24h offline

## Phase 2: Multi-Vessel (M5-8) → $400K-$600K
Fleet mgmt, advanced agents
**Success:** 10 vessels, 30d offline

## Phase 3: Digital Twin (M9-12) → $350K-$550K
Simulation, analytics, multi-tenant
**Success:** 100+ vessels, ROI

## Phase 4: Scale (M13-18) → $450K-$700K
Multi-org, mobile apps, marketplace
**Success:** 1,000+ vessels

</v-clicks>

</div>

---

# Success Metrics

<div class="grid grid-cols-3 gap-4 text-sm">

<div>

## Operational

- ⏱️ **< 5 min** response
- ⛽ **10%** fuel gain
- ⬇️ **50%** less downtime
- ✅ **100%** compliance

</div>

<div>

## Technical

- 🟢 **99.9%** uptime
- 🤖 **99.5%** accuracy
- 📶 **30+ days** offline
- ⚡ **< 5 sec** decisions

</div>

<div>

## Business

- 😊 **NPS > 50**
- 💰 **18mo** ROI
- 🚢 **100+** vessels
- 🛡️ **15%** insurance↓

</div>

</div>

<div class="mt-4 text-center text-lg font-bold text-green-400">
Safety: 30% ↓ incidents • Zero injuries • 20% ↓ emissions
</div>

---

# Real-World Use Case: Heavy Weather

<div class="text-sm px-4">

**Scenario:** Vessel encounters Beaufort 9 storm (6m waves)

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

## AI Auto-Checklist

- **Auto-generated** from SOLAS templates
- **80% pre-filled** from sensors
- Close watertight doors ✓
- Secure cargo lashings ✓
- Ballast adjustment ✓
- Dual steering engaged ✓
- Weather routing suggested
- Crew rest monitoring active

</div>

<div>

## Captain Testimonial

> *"System pulled up heavy weather checklist automatically. Sensor data pre-checked most items. We focused on critical decisions, not paperwork."*
>
> — Chief Officer

**Result:**
- 5 min response time
- Zero cargo damage
- Full SOLAS compliance
- Complete audit trail

</div>

</div>

</div>

---

# Investment & ROI

<div class="grid grid-cols-2 gap-8 text-sm">

<div>

## Investment
**$1.5M - $2.35M** / 18mo

- Phase 1: $300K-$500K
- Phase 2: $400K-$600K
- Phase 3: $350K-$550K
- Phase 4: $450K-$700K

</div>

<div>

## Returns

- **10%** fuel savings
- **15%** insurance ↓
- **30%** fewer incidents
- **50%** less downtime
- Avoid fines

**ROI:** 18mo @ 100+ vessels

</div>

</div>

---

# Security & Compliance

<div class="grid grid-cols-2 gap-10 px-4 text-sm">

<div>

## Security

- **Encryption:** AES-256, TLS 1.3
- **Access:** RBAC, MFA, audit logs
- **Edge:** Docker isolation, VPN

</div>

<div>

## Compliance

**Maritime:** IMO SOLAS, ISM, MARPOL

**Privacy:** GDPR, CCPA

**Standards:** ISO 9001, 27001, NMEA

</div>

</div>

---

# Current Status & Next Steps

<div class="grid grid-cols-2 gap-10 px-6 text-sm">

<div>

## ✅ Completed

<v-clicks>

- Fleet dashboard
- Incident management
- OpenSeaMap integration
- Weather overlays
- Route tracking
- Vessel details
- Measurement tools
- Dark mode
- TypeScript

</v-clicks>

</div>

<div>

## 🚀 Next Steps

<v-clicks>

1. Stakeholder review
2. Technical validation
3. Pilot program (3-5 vessels)
4. Partnerships (NVIDIA)
5. Funding (18 months)
6. Team assembly

</v-clicks>

</div>

</div>

---
layout: center
class: text-center
---

# Let's Build the Digital Twin of the Oceans

<div class="grid grid-cols-2 gap-16 mt-8 text-left max-w-4xl mx-auto text-sm">

<div>

### Live Demo
**Dashboard**: [localhost:3001](http://localhost:3001)

### Resources
- **GitHub**: OpenSeaMap/online_chart
- **Docs**: PRD.md, VESSEL_AGENT_SPEC.md

</div>

<div>

### Contact
[Your Name]
[Your Email]
[Your Company]

### Shortcuts
- **'o'** - Overview
- **'d'** - Dark mode

</div>

</div>

<div class="mt-10">
  <span class="text-3xl font-bold text-blue-400">Questions?</span>
</div>
