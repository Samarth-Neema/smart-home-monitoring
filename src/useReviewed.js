import { useEffect, useState } from 'react';

const STORAGE_KEY = 'smarthome.reviewedEvents';

// Review status is the user's own bookkeeping and is kept fully separate from
// event/device status — reviewing never resolves an issue.
export function useReviewed() {  const [reviewedIds, setReviewedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewedIds));
    } catch {
      // Storage may be unavailable (private mode); app still works without it.
    }
  }, [reviewedIds]);

  function toggleReviewed(id) {
    setReviewedIds((ids) =>
      ids.includes(id) ? ids.filter((r) => r !== id) : [...ids, id]
    );
  }

  function clearReviewed() {
    setReviewedIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures; state is already reset.
    }
  }

  return { reviewedIds, toggleReviewed, clearReviewed };
}
