import { CATEGORY } from './eventLogic';

// Deterministic rule-based recommendations. The first matching rule wins.
// Each rule returns { tone, title, detail } where tone is 'ok' | 'info' |
// 'warning' | 'critical'.

export function getRecommendations({ connected, battery, events }) {
  const activeAlerts = events.filter((e) => e.category === CATEGORY.ACTIVE);
  const recovered = events.filter((e) => e.category === CATEGORY.RECOVERED);

  if (!connected) {
    return {
      tone: 'critical',
      title: 'Device offline — needs attention',
      detail:
        'Home Hub has been offline since 10:18 AM and is not reporting any data. ' +
        'Check that it is plugged in and that your network connection is working, ' +
        'then restart it from the Devices screen if it still does not come back.',
    };
  }

  if (battery < 20) {
    return {
      tone: 'warning',
      title: 'Battery is low',
      detail:
        `Home Hub battery is at ${battery}%. Check the battery soon — ` +
        'if it runs out, the hub will go offline and stop reporting events.',
    };
  }

  if (activeAlerts.length > 0) {
    return {
      tone: 'warning',
      title: `${activeAlerts.length} issue needs attention`,
      detail: 'Open the activity list to see what happened and what to do next.',
    };
  }

  if (recovered.length > 0) {
    return {
      tone: 'ok',
      title: 'Everything looks fine',
      detail:
        'The earlier connection drop recovered on its own and the hub is connected now. ' +
        'No immediate action is necessary.',
    };
  }

  return {
    tone: 'ok',
    title: 'No action is currently required',
    detail: 'Home Hub is connected and reporting normally.',
  };
}
