# Vessel Agent Functional Specification

## Overview

This application runs on a cargo ship (vessel). The application is responsible for keeping communications with the cargo control center informing it of many of its data points. These data streams help the control center keep track and aid vessels. This application gets the data points from the ship's instruments, from the captain and crew, and from the control center.

The application is an artificial agent that aids the captain in the operation of the vessel. It has a database of operational checklists, and knows which checklist to invoke depending on the circumstance the ship encounters itself. The agent helps the captain to fill in the checklist, fills in some items already known to it, and aids communications with the control center as well as with other vessels and with land operations and port authority.

## Existing Types of Communications Between Vessel and Control Center

**Ordered by Priority:**

1. Vessel position, operational readiness, speed and direction
2. Deviations from planned route
3. Incident
4. Dangerous Event
5. Local Oceanic Conditions
6. Local Weather Conditions
7. Route Update

### Incoming Communications from Control Center

The vessel receives from the command center:
- Global Oceanic Conditions for its proximities
- Global Weather Conditions for its proximities
- Reports of dangerous areas nearby
- Orders to update the route (can be accepted or denied by the captain)

### Communication Interruptions

The communications between vessel and control center can be interrupted due to poor connectivity in some areas of the ocean. The vessel agent must:
- Track how long it has been disconnected ("in the dark")
- Prioritize data flows and interactions accordingly with:
  - Instruments
  - Nearby vessels
  - Checklist intelligence
- Take into account data quality of each data point at all times

## Types of Dangerous Events or Incidents

1. **Vessel Damage** (Decrease of operational readiness)
2. **Weather**
3. **Oceanic**
4. **Vessel's Crew Incident** (Decrease of operational readiness)
5. **Criminal and Pirating**
6. **War Event**
7. **Geo-political**
8. **Financial** (such as changes in taxes and fees that induce route change)

## Data Flows

The data flows are established in order of priority. When communication is not possible for some reason, the agent in charge of sending data to the control center should attempt only sending out the **top priority data point**: Vessel position, operational readiness, speed and direction.

## Operational Standards

The agent should operate according to:
- International maritime standards and regulations
- Regional specific regulations

These regulations are part of its internal database, together with its archived checklists that are constantly used.
