import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CATEGORY_LABELS } from '../data/eventLogic';
import { StatusBadge } from './Status';

export default function EventRow({ event, reviewed, onToggleReviewed }) {
  const [open, setOpen] = useState(false);
  const times = event.times || [event.time];

  return (
    <li className="event-row">
      <button
        className="event-summary"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="event-caret">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <span className="event-main">
          <span className="event-label">{event.label}</span>
          <span className="event-times">{times.join(', ')}</span>
        </span>
        {reviewed && <span className="badge badge-reviewed">Reviewed</span>}
        <StatusBadge category={event.category} />
      </button>

      {open && (
        <div className="event-detail">
          <p className="detail-row">
            <span className="detail-label">What happened</span>
            {event.label}
            {times.length > 1
              ? `, at: ${times.join(', ')}.`
              : `, at ${times[0]}.`}
          </p>
          <p className="detail-row">
            <span className="detail-label">Timestamp</span>
            {times.join(', ')}
          </p>
          <p className="detail-row">
            <span className="detail-label">Category and status</span>
            {CATEGORY_LABELS[event.category]}
            {event.category === 'recovered'
              ? ' — the issue resolved itself; the device is working now.'
              : event.category === 'active'
                ? ' — still ongoing and needs your attention.'
                : ' — nothing to worry about.'}
          </p>
          <p className="detail-row">
            <span className="detail-label">What it means</span>
            {event.explanation}
          </p>
          <p className="detail-row">
            <span className="detail-label">Suggested next action</span>
            {event.suggestedAction}
          </p>
          <button
            className={`btn btn-secondary ${reviewed ? 'is-reviewed' : ''}`}
            onClick={() => onToggleReviewed(event.id)}
          >
            {reviewed ? 'Reviewed' : 'Mark as reviewed'}
          </button>
          <p className="detail-note">
            Marking as reviewed only records your own note. It never changes the
            device&apos;s actual status.
          </p>
        </div>
      )}
    </li>
  );
}
