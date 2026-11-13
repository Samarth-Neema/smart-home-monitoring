import { Activity, BatteryMedium, Wifi, Clock, ArrowRight, HardDrive } from 'lucide-react';
import { CATEGORY } from '../data/eventLogic';
import EventRow from '../components/EventRow';
import { RecommendationCard } from '../components/Status';

export default function Dashboard({
  scenario,
  summary,
  metrics,
  recommendation,
  events,
  reviewedIds,
  onToggleReviewed,
  onViewAllEvents,
  onGoToDevices,
}) {
  const important = events.filter((e) => e.category !== CATEGORY.INFORMATIONAL);
  const preview = events.slice(0, 4);

  return (
    <div className="screen">
      <section className="card hero-card">
        <div className="hero-top">
          <div>
            <p className="hero-kicker">Home status</p>
            <h2 className={scenario.connected ? (scenario.battery < 20 ? 'status-warning' : 'status-ok') : 'status-critical'}>
              {!scenario.connected
                ? 'Needs attention'
                : scenario.battery < 20
                  ? 'Battery low'
                  : 'All okay'}
            </h2>
          </div>
          <span className={`badge ${scenario.connected ? (scenario.battery < 20 ? 'tone-warning' : 'tone-ok') : 'tone-critical'}`}>
            {scenario.connected ? (scenario.battery < 20 ? 'Low battery' : 'Connected') : 'Offline'}
          </span>
        </div>
        <p className="hero-summary">{summary}</p>
        <p className="demo-note">Simulated demo data — not real sensor readings.</p>
      </section>

      <div className="metric-grid">
        <div className="card metric-card">
          <Activity size={18} className="metric-icon" />
          <p className="metric-value">{metrics.activityToday}</p>
          <p className="metric-label">Activity today</p>
        </div>
        <div className="card metric-card">
          <Activity size={18} className="metric-icon" />
          <p className="metric-value">{metrics.notableEvents}</p>
          <p className="metric-label">Notable events</p>
        </div>
        <div className="card metric-card">
          <Activity size={18} className="metric-icon" />
          <p className={`metric-value ${metrics.activeAlerts > 0 ? 'text-critical' : ''}`}>
            {metrics.activeAlerts}
          </p>
          <p className="metric-label">Active alerts</p>
        </div>
      </div>

      <div className="card">
        <h3>Recommendation</h3>
        <RecommendationCard
          tone={recommendation.tone}
          title={recommendation.title}
          detail={recommendation.detail}
        />
      </div>

      <div className="card">
        <h3>Device connectivity</h3>
        <div className="device-quick">
          <div className="quick-item">
            <Wifi size={16} />
            <span>{scenario.connected ? 'Connected' : 'Offline'}</span>
          </div>
          <div className="quick-item">
            <BatteryMedium size={16} />
            <span>{scenario.battery}% battery</span>
          </div>
          <div className="quick-item">
            <Clock size={16} />
            <span>Last sync {scenario.lastSync}</span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={onGoToDevices}>
          <HardDrive size={15} />
          Device details
        </button>
      </div>

      <div className="card">
        <h3>Important events</h3>
        {important.length === 0 ? (
          <p className="empty-state">Nothing needs attention right now.</p>
        ) : (
          <ul className="event-list">
            {important.map((e) => (
              <EventRow
                key={e.id}
                event={e}
                reviewed={reviewedIds.includes(e.id)}
                onToggleReviewed={onToggleReviewed}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>Recent activity</h3>
        <ul className="event-list">
          {preview.map((e) => (
            <EventRow
              key={e.id}
              event={e}
              reviewed={reviewedIds.includes(e.id)}
              onToggleReviewed={onToggleReviewed}
            />
          ))}
        </ul>
        <button className="btn btn-primary" onClick={onViewAllEvents}>
          View all events
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
