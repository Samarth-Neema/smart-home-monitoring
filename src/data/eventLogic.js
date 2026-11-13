// Builds the visible event list from raw records, the active scenario and
// which events the user has marked as reviewed (persisted in localStorage).
//
// Event status ("recovered", "informational", "active") describes the device
// state. Review status ("reviewed" / not) is the user's bookkeeping only —
// reviewing never changes or resolves device state.

export const CATEGORY = {
  ACTIVE: 'active',
  RECOVERED: 'recovered',
  INFORMATIONAL: 'informational',
};

export const CATEGORY_LABELS = {
  [CATEGORY.ACTIVE]: 'Needs attention',
  [CATEGORY.RECOVERED]: 'Recovered',
  [CATEGORY.INFORMATIONAL]: 'Informational',
};

const MOVEMENT_EXPLANATION =
  'Ordinary movement was picked up while you were away. Movement alone is not ' +
  'unusual in a home with pets, sunlight or household members moving around, so ' +
  'it is treated as informational, not suspicious.';

const MOVEMENT_ACTION = 'No action needed. You can skim the timestamps to see when it happened.';

function movementEvent(times) {
  const isGroup = times.length > 1;
  return {
    id: 'movement-group',
    type: 'movement',
    label: isGroup ? `Movement detected (${times.length} times)` : 'Movement detected',
    times,
    time: times[0],
    category: CATEGORY.INFORMATIONAL,
    explanation: isGroup
      ? `Movement was detected ${times.length} times between ${times[times.length - 1]} and ${times[0]}. ` +
        MOVEMENT_EXPLANATION
      : MOVEMENT_EXPLANATION,
    suggestedAction: MOVEMENT_ACTION,
  };
}

function disconnectionEvent(connected) {
  return {
    id: 'disconnection-1018',
    type: 'disconnection',
    label: 'Device disconnected',
    times: ['10:18 AM'],
    time: '10:18 AM',
    category: connected ? CATEGORY.RECOVERED : CATEGORY.ACTIVE,
    explanation: connected
      ? 'The hub briefly lost its connection at 10:18 AM and came back on its own. ' +
        'It is connected now, so this recovered without any action from you.'
      : 'The hub lost its connection at 10:18 AM and has not come back yet. ' +
        'It is still offline, so this needs attention.',
    suggestedAction: connected
      ? 'No immediate action needed. If this keeps happening, check the hub is firmly plugged in and near the router.'
      : 'Check that the hub is plugged in and the network is working, then restart it from the Devices screen once it powers back on.',
  };
}

function updateEvent() {
  return {
    id: 'update-0935',
    type: 'update',
    label: 'Software updated',
    times: ['9:35 AM'],
    time: '9:35 AM',
    category: CATEGORY.INFORMATIONAL,
    explanation:
      'The hub finished installing a software update at 9:35 AM (version 2.4.1). ' +
      'The update completed successfully.',
    suggestedAction: 'No action needed. Keeping the hub updated keeps it working correctly.',
  };
}

export function buildEvents(connected) {
  const movement = movementEvent(['10:42 AM', '10:05 AM', '9:47 AM', '9:31 AM']);
  const disconnection = disconnectionEvent(connected);
  const update = updateEvent();
  // Newest first (chronological descending).
  return [movement, disconnection, update];
}

export function countActiveAlerts(events) {
  return events.filter((e) => e.category === CATEGORY.ACTIVE).length;
}

// Notable = disconnection and software update events. Ordinary movement
// detections never count as notable, in any scenario.
export function countNotableEvents(events) {
  return events.filter((e) => e.type !== 'movement').length;
}
