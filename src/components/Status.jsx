import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { CATEGORY, CATEGORY_LABELS } from '../data/eventLogic';

export const TONE_STYLES = {
  ok: { className: 'tone-ok', icon: CheckCircle2, label: 'Healthy' },
  info: { className: 'tone-info', icon: Info, label: 'Info' },
  warning: { className: 'tone-warning', icon: AlertTriangle, label: 'Warning' },
  critical: { className: 'tone-critical', icon: AlertTriangle, label: 'Critical' },
};

export function StatusBadge({ category }) {
  const style = TONE_STYLES[
    category === CATEGORY.ACTIVE ? 'critical' : category === CATEGORY.RECOVERED ? 'info' : 'ok'
  ];
  const Icon = style.icon;
  return (
    <span className={`badge ${style.className}`}>
      <Icon size={13} />
      {CATEGORY_LABELS[category]}
    </span>
  );
}

export function RecommendationCard({ tone, title, detail }) {
  const style = TONE_STYLES[tone] || TONE_STYLES.info;
  const Icon = style.icon;
  return (
    <div className={`recommendation ${style.className}`}>
      <Icon size={18} className="recommendation-icon" />
      <div>
        <p className="recommendation-title">{title}</p>
        <p className="recommendation-detail">{detail}</p>
      </div>
    </div>
  );
}
