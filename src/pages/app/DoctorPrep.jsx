import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import Navbar from '../../components/Navbar';

export default function DoctorPrep() {
  const [cycleLogs, setCycleLogs] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const user = auth.currentUser;
      if (!user) return;

      const cycleQ = query(
        collection(db, 'users', user.uid, 'cycleLogs'),
        orderBy('date', 'desc'),
        limit(90)
      );
      const cycleSnap = await getDocs(cycleQ);
      setCycleLogs(cycleSnap.docs.map((d) => d.data()));

      const dailyQ = query(
        collection(db, 'users', user.uid, 'dailyLogs'),
        orderBy('date', 'desc'),
        limit(90)
      );
      const dailySnap = await getDocs(dailyQ);
      setDailyLogs(dailySnap.docs.map((d) => d.data()));

      setLoading(false);
    }
    fetchData();
  }, []);

  // Calculate symptom frequency
  const symptomCount = {};
  dailyLogs.forEach((log) => {
    (log.symptoms || []).forEach((s) => {
      if (s !== 'None of these') {
        symptomCount[s] = (symptomCount[s] || 0) + 1;
      }
    });
  });

  const topSymptoms = Object.entries(symptomCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Average mood
  const avgMood =
    dailyLogs.length > 0
      ? (
          dailyLogs.reduce((sum, l) => sum + (l.mood || 3), 0) /
          dailyLogs.length
        ).toFixed(1)
      : null;

  const moodLabel =
    avgMood >= 4 ? 'Generally positive' :
    avgMood >= 3 ? 'Mixed' :
    avgMood ? 'Often low' : 'No data yet';

  if (loading) {
    return (
      <div className="screen flex items-center justify-center">
        <p className="text-muted-rose">Loading your report...</p>
      </div>
    );
  }

  return (
    <div className="screen pb-24">

      <h1 className="page-title mb-1">
        Your doctor visit report
      </h1>
      <p className="text-muted-rose text-sm mb-4">
        Built from your last 3 months of logs.
        Show this screen to your doctor.
      </p>

      {/* Cycle Summary */}
      <div className="card mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span>📅</span>
          <p className="text-charcoal font-medium text-sm">
            Cycle Summary
          </p>
        </div>
        {cycleLogs.length === 0 ? (
          <p className="text-muted-rose text-sm">
            No cycle data logged yet. Start tracking in the Cycle tab.
          </p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-charcoal">
              Days logged: {cycleLogs.length}
            </p>
            <p className="text-sm text-charcoal">
              Most recent: {cycleLogs[0]?.date || '--'}
            </p>
            <p className="text-sm text-charcoal">
              Flow types logged:{' '}
              {[...new Set(cycleLogs.map((l) => l.flow))].join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Top Symptoms */}
      <div className="card mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span>📊</span>
          <p className="text-charcoal font-medium text-sm">
            Most Frequent Symptoms
          </p>
        </div>
        {topSymptoms.length === 0 ? (
          <p className="text-muted-rose text-sm">
            No symptom data yet. Complete daily check-ins to build this.
          </p>
        ) : (
          <div className="space-y-2">
            {topSymptoms.map(([symptom, count]) => (
              <div key={symptom} className="flex items-center gap-2">
                <p className="text-sm text-charcoal w-28 flex-shrink-0">
                  {symptom}
                </p>
                <div className="flex-1 bg-cream rounded-full h-2">
                  <div
                    className="bg-terra h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (count / dailyLogs.length) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-rose w-12 text-right">
                  {count} days
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mood & Energy */}
      <div className="card mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span>💭</span>
          <p className="text-charcoal font-medium text-sm">
            Mood Pattern
          </p>
        </div>
        <p className="text-sm text-charcoal">
          Average mood: {avgMood ? `${avgMood}/5 — ${moodLabel}` : 'No data yet'}
        </p>
        <p className="text-xs text-muted-rose mt-1">
          Based on {dailyLogs.length} daily check-ins
        </p>
      </div>

      {/* Suggested Questions */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span>❓</span>
          <p className="text-charcoal font-medium text-sm">
            Questions for your doctor
          </p>
        </div>
        <ul className="space-y-2">
          {[
            'Should I be tested for insulin resistance?',
            'What do my symptoms suggest about my hormone levels?',
            'What lifestyle changes would help most for my profile?',
          ].map((q, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-mauve text-xs mt-0.5">•</span>
              <p className="text-sm text-charcoal">{q}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Note */}
      <p className="text-xs text-muted-rose text-center mb-4">
        This report is for discussion purposes only.
        Not a medical diagnosis.
      </p>

      <Navbar />
    </div>
  );
}