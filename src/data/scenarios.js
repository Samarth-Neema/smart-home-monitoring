// Simulated demo scenarios. Switching a scenario swaps the demo data shown
// everywhere in the app; it never reflects real sensor readings.

export const SCENARIOS = {
  normal: {
    id: 'normal',
    name: 'Normal Day',
    description: 'One recovered connection drop, a finished update, four movement events.',
    connected: true,
    battery: 64,
    lastSync: '10:42 AM',
    lastSuccessfulSync: '10:42 AM',
  },
  offline: {
    id: 'offline',
    name: 'Device Offline',
    description: 'The hub stopped responding after 10:18 AM.',
    connected: false,
    battery: 64,
    lastSync: '10:17 AM',
    lastSuccessfulSync: '10:17 AM',
    disconnectedSince: '10:18 AM',
  },
  lowBattery: {
    id: 'lowBattery',
    name: 'Low Battery',
    description: 'The hub is connected but the battery is running low.',
    connected: true,
    battery: 15,
    lastSync: '10:42 AM',
    lastSuccessfulSync: '10:42 AM',
  },
};

export const DEFAULT_SCENARIO = 'normal';
