import { useMemo, useState } from 'react';
import { Home, Activity as ActivityIcon, Cpu, MonitorPlay, RotateCcw } from 'lucide-react';
import { SCENARIOS, DEFAULT_SCENARIO } from './data/scenarios';
import { DEVICE } from './data/mockData';
import { buildEvents, countActiveAlerts, countNotableEvents, CATEGORY } from './data/eventLogic';
import { getRecommendations } from './data/recommendations';
import Modal from './components/Modal';
import Dashboard from './screens/Dashboard';
import ActivityScreen from './screens/ActivityScreen';
import DevicesScreen from './screens/DevicesScreen';
import { useReviewed } from './useReviewed';

const SCREENS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'activity', label: 'Activity', icon: ActivityIcon },
  { id: 'devices', label: 'Devices', icon: Cpu },
];

function buildSummary(scenario) {
  if (!scenario.connected) {
    return 'Your Home Hub is offline. It has been disconnected since 10:18 AM and has ' +
      'not come back yet, so events since then may be missing. This needs attention — ' +
      'check the hub\'s power and network connection.';
  }
  if (scenario.battery < 20) {
    return 'Your home looks okay otherwise. The hub is connected and a software update ' +
      'completed at 9:35 AM. However, the battery is low at ' + scenario.battery + '%, ' +
      'so it is worth checking the battery soon.';
  }
  return 'Your home looks okay. The device briefly lost connection at 10:18 AM but is ' +
    'connected now. A software update completed at 9:35 AM. No action is currently required.';
}

export default function App() {
  const [scenarioId, setScenarioId] = useState(DEFAULT_SCENARIO);
  const [screen, setScreen] = useState('home');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const { reviewedIds, toggleReviewed, clearReviewed } = useReviewed();

  const scenario = SCENARIOS[scenarioId];

  const { events, metrics, recommendation, summary } = useMemo(() => {
    const events = buildEvents(scenario.connected);
    return {
      events,
      metrics: {
        activityToday: 17,
        notableEvents: countNotableEvents(events),
        activeAlerts: countActiveAlerts(events),
      },
      recommendation: getRecommendations({
        connected: scenario.connected,
        battery: scenario.battery,
        events,
      }),
      summary: buildSummary(scenario),
    };
  }, [scenario]);

  const importantCount = events.filter((e) => e.category === CATEGORY.ACTIVE).length;

  function handleScenarioChange(nextId) {
    setScenarioId(nextId);
    setResetConfirmOpen(false);
    setResetToken((t) => t + 1);
  }

  function handleResetDemo() {
    setScenarioId(DEFAULT_SCENARIO);
    setResetConfirmOpen(false);
    clearReviewed();
    setResetToken((t) => t + 1);
    setScreen('home');
  }

  return (
    <div className="app">
      <div className="layout">
        <aside className="sidebar" aria-label="Main navigation">
          <div className="sidebar-brand">
            <Home size={20} />
            <span>Smart Home</span>
          </div>
          <nav className="sidebar-nav">
            {SCREENS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`nav-item ${screen === id ? 'active' : ''}`}
                onClick={() => setScreen(id)}
                aria-current={screen === id ? 'page' : undefined}
              >
                <Icon size={17} />
                <span>{label}</span>
                {id === 'home' && importantCount > 0 && (
                  <span className="nav-alert-count">{importantCount}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <div className="main">
          <header className="header">
            <h1>Smart Home</h1>
            <div className="scenario-selector">
              <label htmlFor="scenario-select" className="scenario-label">
                <MonitorPlay size={15} />
                Demo scenario
              </label>
              <select
                id="scenario-select"
                value={scenarioId}
                onChange={(e) => handleScenarioChange(e.target.value)}
              >
                {Object.values(SCENARIOS).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="demo-note">Simulated demo data</span>
              <button
                className="reset-demo-btn"
                onClick={() => setResetConfirmOpen(true)}
                aria-label="Reset demo to default scenario and clear review history"
              >
                <RotateCcw size={13} />
                Reset Demo
              </button>
            </div>
          </header>

          <main className="content">
            {screen === 'home' && (
              <Dashboard
                scenario={scenario}
                summary={summary}
                metrics={metrics}
                recommendation={recommendation}
                events={events}
                reviewedIds={reviewedIds}
                onToggleReviewed={toggleReviewed}
                onViewAllEvents={() => setScreen('activity')}
                onGoToDevices={() => setScreen('devices')}
              />
            )}
            {screen === 'activity' && (
              <ActivityScreen
                events={events}
                reviewedIds={reviewedIds}
                onToggleReviewed={toggleReviewed}
              />
            )}
            {screen === 'devices' && (
              <DevicesScreen
                key={scenarioId + '-' + resetToken}
                scenario={scenario}
                device={DEVICE}
                onRestart={() => {}}
              />
            )}
          </main>

          <nav className="bottom-nav" aria-label="Mobile navigation">
            {SCREENS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`nav-item ${screen === id ? 'active' : ''}`}
                onClick={() => setScreen(id)}
                aria-current={screen === id ? 'page' : undefined}
              >
                <Icon size={19} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {resetConfirmOpen && (
        <Modal title="Reset demo?" onClose={() => setResetConfirmOpen(false)}>
          <p>
            This restores the Normal Day scenario, clears all review history and
            any restart feedback, and returns you to the Home screen.
          </p>
          <p className="modal-note">All data shown is simulated demo data.</p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setResetConfirmOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleResetDemo}>
              Reset Demo
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
