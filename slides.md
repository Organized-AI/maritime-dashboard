---
theme: default
background: https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Maritime Fleet AI Dashboard
  Digital Twin of the Oceans - Vessel Intelligence & Safety System
drawings:
  persist: false
transition: slide-left
title: Maritime Fleet AI Dashboard
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

# Maritime Fleet AI Dashboard

**Digital Twin of the Oceans**

Vessel Intelligence & Safety System for International Cargo Operations

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 text-sm opacity-50">
  Live Demo: http://34.68.214.41:3000
</div>

---
layout: image-right
image: https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80
---

# The Maritime Freight Industry

**Global Trade Backbone**

## Scale & Reach

- **📦 90%** of world trade by sea
- **🌍 180+** countries connected
- **🚢 100,000+** cargo vessels worldwide
- **⚓ 50,000+** ports & terminals
- **👷 1.9M** seafarers employed

## Economic Impact

- **💰 $14 Trillion** annual goods value
- **📊 $2 Trillion** shipping industry
- **🛢️ 11 Billion** tons cargo/year
- **⛽ $300B+** annual fuel costs
- **📈 4-5%** annual growth rate

<div class="mt-8 text-center text-lg font-bold text-blue-400">
Maritime shipping is the circulatory system of global commerce
</div>

---
layout: image-right
image: https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1920&q=80
---

# Industry Inefficiencies & Losses

**The $100+ Billion Problem**

## Known Inefficiencies

**⛽ Fuel Waste: $30B+/year**
- Inefficient routing
- Speed optimization failures
- Weather-related delays

**⏱️ Port Delays: $40B+/year**
- 20% of voyage time in port
- Poor coordination
- Documentation delays

**📋 Compliance Costs: $15B+/year**
- Manual reporting (200+ hrs/vessel/year)
- Regulatory complexity (IMO, MARPOL, SOLAS)
- Audit failures & fines

## Major Loss Categories

**🌪️ Weather-Related: $22B+/year**
- Storm damage & delays
- Route diversions
- Cargo deterioration

**🏴‍☠️ Criminal Activity: $7-12B/year**
- Piracy incidents (Est. $7B)
- Cargo theft & fraud

**🗺️ Geopolitical: $20B+/year**
- Trade route closures
- Sanctions & conflicts

<div class="mt-4 text-center text-lg font-bold text-red-400">
Total addressable losses: $134+ Billion annually
</div>

---
layout: image
image: https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1920&q=80
---

<div class="absolute top-10 left-10 right-10 bg-black bg-opacity-70 p-8 rounded-lg">

<div class="grid grid-cols-2 gap-10">

<div>

# The Challenge

**Maritime vessels operate in harsh, dangerous environments**

- ⚠️ **Critical incidents** require immediate response
- 🛠️ **Complex compliance** requirements (IMO, MARPOL, SOLAS)
- 💰 **High operational costs** (fuel, insurance, downtime)
- 🔍 **No awareness of risks** that could be avoided
- 🌊 **Weather endangers** cargo operations

</div>

<div>

# Our Solution

**Offline-first AI platform with autonomous agents**

- 🤖 **AI Agents with skills** per vessel (Weather, Navigation, Incident, Compliance, Comms)
- 🎯 **Edge Computing** on embarked hardware
- 📶 **30+ day offline operation** with local processing
- 🌐 **Multi-org network** for data sharing

</div>

</div>

</div>

---
layout: image-right
image: https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1920&q=80
---

# Technology Stack

## Frontend Dashboard
- **GCP** Virtual Machines
- **Next.js 15** + TypeScript
- **Tailwind CSS** styling
- **OpenLayers 10.6** maps
- **Recharts** visualization

<div class="text-xs mt-3 opacity-80">
Built on OpenSeaMap (1,683 lines PHP, 17 APIs)
</div>

---
layout: image
image: /command-center.jpg
---

<div class="absolute top-10 left-10 right-10 bg-black bg-opacity-85 p-8 rounded-lg">

# Fleet Operations Command Center

**Centralized monitoring and control for global maritime operations**

<div class="grid grid-cols-3 gap-10 mt-6 text-sm">

<div>

### Real-Time Fleet Visibility
- 24/7 vessel monitoring across multiple time zones
- Multi-screen dashboards with live data feeds
- Global fleet status at a glance
- Individual vessel health metrics

</div>

<div>

### Incident Response
- Immediate alert handling and escalation
- Coordinated emergency response protocols
- Cross-vessel communication network
- Expert support teams on standby

</div>

<div>

### Data-Driven Decisions
- AI-powered predictive insights
- Route optimization algorithms
- Compliance tracking and reporting
- Performance analytics and KPIs

</div>

</div>

</div>

---

# LIVE DEMO: OpenSeaMap

**Check out the Map Tab** 👉 [34.68.214.41:3000](http://34.68.214.41:3000)

<div class="grid grid-cols-2 gap-10 px-4 mt-4">

<div>

## Map Layers

- **Base OSM** tiles
- **Seamark** overlays
- **Weather** layer
- **Route Trails** (1h-7d)
- **Incident** markers
- **Measurement** tools

</div>

<div>

## Try It!

- Click vessels
- Toggle weather
- Measure distance
- Zoom & pan

</div>

</div>

---

# LIVE DEMO: Vessel Details

**Click any vessel card** 👉 [34.68.214.41:3000](http://34.68.214.41:3000)

<div class="grid grid-cols-2 gap-10 px-4">

<div>

## Vessel Info

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

</div>

<div>

## Intelligence

**Weather**
- Temp, pressure
- Wind, waves
- Visibility

**AI Skills**
- Weather
- Navigation
- Incident Response
- Compliance
- Communication

</div>

</div>

---
layout: image-right
image: https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&q=80
---

# Real-World Use Case: Heavy Weather

**Scenario:** Vessel encounters Beaufort 9 storm (6m waves)

<div class="grid grid-cols-1 gap-6 mt-4 text-sm">

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

- Fleet dashboard
- Incident management
- OpenSeaMap integration
- Weather overlays
- Route tracking
- Vessel details
- Measurement tools
- Dark mode
- TypeScript

</div>

<div>

## 🚀 Next Steps

1. Stakeholder review
2. Technical validation
3. Pilot program (3-5 vessels)
4. Partnerships (NVIDIA)
5. Funding (18 months)
6. Team assembly

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
**Dashboard**: [34.68.214.41:3000](http://34.68.214.41:3000)

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
