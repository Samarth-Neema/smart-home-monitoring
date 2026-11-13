// Simulated demo data only. Nothing here reflects real sensor readings.

// The full event log for the day. Times are static demo values.
export const RAW_EVENTS = [
  { id: 'movement-1042', time: '10:42 AM', type: 'movement', label: 'Movement detected' },
  { id: 'disconnection-1018', time: '10:18 AM', type: 'disconnection', label: 'Device disconnected' },
  { id: 'movement-1005', time: '10:05 AM', type: 'movement', label: 'Movement detected' },
  { id: 'movement-0947', time: '9:47 AM', type: 'movement', label: 'Movement detected' },
  { id: 'update-0935', time: '9:35 AM', type: 'update', label: 'Software updated' },
  { id: 'movement-0931', time: '9:31 AM', type: 'movement', label: 'Movement detected' },
];

export const TOTAL_EVENTS_TODAY = 17;

export const DEVICE = {
  name: 'Home Hub',
  networkStrength: '-67 dBm',
  softwareVersion: '2.4.1',
  lastRestart: 'Yesterday, 11:34 PM',
};
