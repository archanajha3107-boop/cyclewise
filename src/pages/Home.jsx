import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function getCyclePhase(lastPeriodDate, cycleLength) {
  if (!lastPeriodDate) return null;
  const last = new Date(lastPeriodDate);
  const today = new Date();
  const diff = Math.floor((today - last) / (1000 * 60 * 60 * 24));
  const dayOfCycle = (diff % (cycleLength || 30)) + 1;

  if (dayOfCycle <= 5) return { phase: 'Menstrual Phase', day: dayOfCycle, message: 'Rest and be gentle with yourself today. Your body is working hard.', color: 'bg-terra' };
  if (dayOfCycle <= 13) return { phase: 'Follicular Phase', day: dayOfCycle, message: 'Energy is rising. Good time for tasks that need focus.', color: 'bg-sage' };
  if (dayOfCycle <= 16) return { phase: 'Ovulatory Phase', day: dayOfCycle, message: 'You may feel your best right now. Make the most of it.', color: 'bg-jade' };
  return { phase: 'Luteal Phase', day: dayOfCycle, message: 'Energy may feel lower. That is completely normal.', color: 'bg-mauve' };
}

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [recentSymptoms, setRecentSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening';

  useEffect(() => {
    async function fetchData() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch user profile
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) setUserData(userSnap.data());

        // Check if checked in today
        const todayLog = await getDoc(
          doc(db, 'users', user.uid, 'dailyLogs', todayStr)
        );
        setCheckedInToday(todayLog.exists());

        // Fetch recent symptoms
        const logsQ = query(
          collection(db, 'users', user.uid, 'dailyLogs'),
          orderBy('date', 'desc'),
          limit(7)
        );
        const logsSnap = await getDocs(logsQ);
        const allSymptoms = [];
        logsSnap.docs.forEach((d) => {
          (d.data().symptoms || []).forEach((s) => {
            if (s !== 'None of these' && !allSymptoms.includes(s)) {
              allSymptoms.push(s);
            }
          });
        });
        setRecentSymptoms(allSymptoms.slice(0, 3));

      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    fetchData();
  }, [todayStr]);

  const phase = getCyclePhase(
    userData?.lastPeriodDate,
    userData?.cycleLength
  );

  const firstName = userData?.name?.split(' ')[0] || 'there';

  if (loading) {
    return (
      <div className="screen flex items-center justify-center">
        <p className="text-muted-rose">Loading...</p>
      </div>
    );
  }

  return (
    <div className="screen pb-24">

      {/* Greeting */}
<div className="flex items-center justify-between mb-4">
  <div>
    <p className="text-muted-rose text-sm">{greeting},</p>
    <div className="flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 C28 10 10 28 10 50 C10 72 28 90 50 90 C38 80 30 66 30 50 C30 34 38 20 50 10Z" fill="#9B6B8A" opacity="0.9"/>
        <path d="M52 55 C52 45 56 38 60 35 C60 35 63 45 58 55Z" fill="#C4836A" opacity="0.95"/>
        <path d="M52 55 C48 46 43 41 40 40 C40 40 42 50 50 56Z" fill="#C4836A" opacity="0.75"/>
      </svg>
      <h1 className="font-playfair text-2xl font-bold text-charcoal">
        {firstName}
      </h1>
    </div>
  </div>
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-mauve flex items-center justify-center"
        >
          <span className="text-white font-playfair font-bold text-sm">
            {firstName.slice(0, 2).toUpperCase()}
          </span>
        </button>
      </div>

      {/* Today's Phase Card */}
      {phase ? (
        <div className={`${phase.color} rounded-2xl p-4 mb-3`}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/70 text-xs uppercase tracking-wider">
              Today's Phase
            </p>
            <p className="text-white/70 text-xs">
              Day {phase.day}
            </p>
          </div>
          <p className="text-white font-playfair text-lg font-semibold mb-1">
            {phase.phase}
          </p>
          <p className="text-white/80 text-sm leading-relaxed">
            {phase.message}
          </p>
        </div>
      ) : (
        <button
          onClick={() => navigate('/cycle')}
          className="w-full bg-mauve rounded-2xl p-4 mb-3 text-left"
        >
          <p className="text-white font-playfair text-base font-semibold mb-1">
            Set up cycle tracking
          </p>
          <p className="text-white/70 text-sm">
            Log your last period to see your phase insights.
          </p>
        </button>
      )}

      {/* Daily Check-In Card */}
      <div className="card mb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-charcoal font-medium text-sm mb-1">
              {checkedInToday
                ? '✅ Checked in today'
                : 'Daily Check-In'}
            </p>
            <p className="text-muted-rose text-xs">
              {checkedInToday
                ? 'Come back tomorrow. You\'re building a pattern.'
                : 'How are you feeling today?'}
            </p>
          </div>
          {!checkedInToday && (
            <button
              onClick={() => navigate('/checkin')}
              className="bg-mauve text-white text-xs px-3 py-2 rounded-pill ml-3 flex-shrink-0"
            >
              Check in
            </button>
          )}
        </div>

        {/* Mood emojis if not checked in */}
        {!checkedInToday && (
          <div className="flex justify-between mt-3 px-2">
            {['😔', '😕', '😐', '🙂', '😊'].map((emoji, i) => (
              <button
                key={i}
                onClick={() => navigate('/checkin')}
                className="text-xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sakhi Card */}
      <button
        onClick={() => navigate('/sakhi')}
        className="w-full card mb-3 text-left flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-xl flex-shrink-0">
          🌙
        </div>
        <div className="flex-1">
          <p className="text-charcoal font-medium text-sm">
            Sakhi is here
          </p>
          <p className="text-muted-rose text-xs">
            Something on your mind? Talk to her.
          </p>
        </div>
        <span className="text-muted-rose">›</span>
      </button>

      {/* Recent Symptoms */}
      {recentSymptoms.length > 0 && (
        <div className="card mb-3">
          <p className="section-label mb-2">This week</p>
          <div className="flex gap-2 flex-wrap">
            {recentSymptoms.map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-1 rounded-pill bg-cream text-muted-rose border border-blush"
              >
                {s}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate('/doctor-prep')}
            className="text-mauve text-xs mt-2 font-medium"
          >
            View full report →
          </button>
        </div>
      )}

      {/* Community Card */}
      <button
        onClick={() => navigate('/community')}
        className="w-full card mb-3 text-left border-l-4 border-terra"
      >
        <p className="text-xs text-terra uppercase tracking-wider mb-1">
          This week
        </p>
        <p className="text-charcoal text-sm font-medium leading-snug">
          How do you explain PMOS to someone who doesn't understand?
        </p>
        <p className="text-terra text-xs mt-1">
          Join the conversation →
        </p>
      </button>

      {/* Quick Links */}
      <p className="section-label mb-2">Quick access</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: '📚', label: 'Learn', to: '/education' },
          { icon: '🩺', label: 'Doctor prep', to: '/doctor-prep' },
          { icon: '🌙', label: 'Cycle', to: '/cycle' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className="card flex flex-col items-center gap-1 py-3"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs text-muted-rose">{item.label}</span>
          </button>
        ))}
      </div>

      <Navbar />
    </div>
  );
}