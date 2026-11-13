import { useState } from 'react';
import { TOTAL_EVENTS_TODAY } from '../data/mockData';
import { CATEGORY, CATEGORY_LABELS } from '../data/eventLogic';
import EventRow from '../components/EventRow';

const FILTERS = [
  { id: 'all', label: 'All events' },
  { id: CATEGORY.ACTIVE, label: CATEGORY_LABELS[CATEGORY.ACTIVE] },
  { id: CATEGORY.RECOVERED, label: CATEGORY_LABELS[CATEGORY.RECOVERED] },
  { id: CATEGORY.INFORMATIONAL, label: CATEGORY_LABELS[CATEGORY.INFORMATIONAL] },
];

export default function ActivityScreen({ events, reviewedIds, onToggleReviewed }) {
  const [filter, setFilter] = useState('all');
  const visible = filter === 'all' ? events : events.filter((e) => e.category === filter);
  const shownCount = events.reduce(
    (sum, e) => sum + (e.times ? e.times.length : 1),
    0
  );

  return (
    <div className="screen">
      <div className="card">
        <h2>Activity</h2>
        <p className="section-sub">
          Showing the {shownCount} latest records out of {TOTAL_EVENTS_TODAY} events
          today. Movement detections are grouped into one entry; open it to see
          every timestamp.
        </p>
        <div className="filter-bar" role="group" aria-label="Filter events">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`filter-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>
        {visible.length === 0 ? (
          <p className="empty-state">
            No events match this filter. That usually means nothing of this kind
            happened today.
          </p>
        ) : (
          <ul className="event-list">
            {visible.map((e) => (
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
    </div>
  );
}
