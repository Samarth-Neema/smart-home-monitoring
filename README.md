# Smart Home

A web application that helps a user understand what happened at home while they were away. It turns raw smart-home device events into a clear plain-language summary, highlights the events that deserve attention, and recommends useful next actions.

This is an interactive product prototype. All data is simulated demo data; nothing reflects real sensor readings or a real device.

## Problem being solved

Smart home hubs produce a stream of low-level events (movement detections, disconnections, software updates). A returning user does not want to read a raw log — they want to know: is everything okay, what went wrong (if anything), and what should I do about it? Smart Home answers those three questions on a single dashboard.

## Key features

- **Home Dashboard** — current home status, a contextual summary of what happened while the user was away, three overview metrics (activity today, notable events, active alerts), device connectivity quick stats, important events, and a recent activity preview.
- **Activity screen** — the six latest records out of 17 events today, with the four movement detections intelligently grouped into one expandable entry that still lists every original timestamp. Working filters (all / needs attention / recovered / informational) and per-event expansion showing what happened, when, its category, what it means, and a suggested next action.
- **Mark as reviewed** — a per-event review toggle persisted in `localStorage`. Reviewing is the user's own bookkeeping and never changes or resolves an actual device issue; the two statuses stay separate.
- **Devices screen** — full details for the single registered device (Home Hub): connection status, battery, network strength, software version, last sync, last restart. A Restart button with a confirmation modal, a simulated restart with loading and success feedback, and a disabled state with an explanation while the device is offline.
- **Contextual recommendations** — deterministic rule-based advice shown on the dashboard and in event details.
- **Demo scenarios** — a labelled selector in the header with three simulated scenarios (Normal Day, Device Offline, Low Battery). Switching updates the dashboard, event statuses, device details and alert counts consistently everywhere.

## Assumptions made

- There is exactly one device (Home Hub) and it reports both connectivity and movement.
- A brief disconnection that has ended is "recovered"; an ongoing one is an active alert.
- Ordinary movement detection is informational — movement alone is never labelled suspicious without supporting evidence.
- Times are static demo values ("10:42 AM") rather than live timestamps.
- The full day has 17 events; only the six most recent are shown in the prototype.
- Restart is a simulation only — the prototype never pretends a real physical device was restarted.

## How event prioritisation works

Each event gets exactly one category, derived from its type plus the current device state:

1. **Active attention required** — the problem is still happening. Example: the device disconnected and has not come back. These raise the "Active alerts" count and surface as the top recommendation.
2. **Recovered** — the problem occurred but has resolved itself. Example: the device disconnected at 10:18 AM but is connected now. These are highlighted as notable but require no action.
3. **Informational** — normal operation. Movement detections and completed software updates land here.

Recommendations follow the first matching deterministic rule: offline → critical action needed; battery below 20% → battery warning; other active alerts → attention needed; recovered issues → reassure that no action is necessary; otherwise → "no action is currently required". The dashboard never claims the home is "secure" — it only states what the available device data supports.

## Technology stack

- React 18 with Vite and JavaScript (no TypeScript)
- lucide-react for icons
- Plain CSS with design tokens (custom properties) for the theme
- Local mock data and React state only — no backend, database, authentication, external API or real hardware integration
- `localStorage` for persisting the reviewed-event list

## Running the application

```bash
npm install
npm run dev
```

Then open the local preview URL shown in the terminal. To create a production build:

```bash
npm run build
npm run preview
```

## Prototype limitations and future improvements

- All data is static demo data; there is no live sensor, device or camera integration.
- Times do not advance and the event log does not grow; a real version would stream events from a hub.
- There is one device only. Multiple devices would need per-device event grouping and a device list screen.
- The recommendation rules are simple and ordered by hand; a real system would weight severity and confidence.
- No authentication, so "reviewed" state is stored per browser rather than per account.
- The summary text is template-based; a real deployment could generate it from event data more flexibly.
- Accessibility basics (keyboard, ARIA labels, focusable modal with Escape/backdrop close) are implemented, but the prototype has not been audited with assistive technology users.
