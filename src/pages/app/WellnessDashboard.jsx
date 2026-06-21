import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import {
  doc, getDoc, setDoc, collection,
  query, orderBy, limit, getDocs
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { calculateWellnessTargets, getTargetExplanations } from '../../utils/wellnessCalculator';

const METRICS = [
  { key: 'protein', label: 'Protein', unit: 'g', icon: '🥩', color: 'bg-terra' },
  { key: 'fibre', label: 'Fibre', unit: 'g', icon: '🥦', color: 'bg-sage' },
  { key: 'water', label: 'Water', unit: 'L', icon: '💧', color: 'bg-jade' },
  { key: 'sleep', label: 'Sleep', unit: 'hrs', icon: '🌙', color: 'bg-mauve' },
  { key: 'steps', label: 'Steps', unit: '', icon: '👟', color: 'bg-amber' },
  { key: 'exercise', label: 'Exercise', unit: 'min', icon: '🏃', color: 'bg-terra' },
  { key: 'calories', label: 'Calories', unit: 'kcal', icon: '🍎', color: 'bg-mauve' },
  { key: 'fats', label: 'Healthy Fats', unit: 'g', icon: '🥑', color: 'bg-sage' },
];

const MOOD_OPTIONS = ['😔', '😕', '😐', '🙂', '😊'];
const ENERGY_OPTIONS = ['Very low', 'Low', 'Okay', 'Good', 'High'];
const STRESS_OPTIONS = ['High', 'Medium', 'Low', 'None'];

export default function WellnessDashboard() {
  const [targets, setTargets] = useState(null);
  const [todayLog, setTodayLog] = useState({});
  const [userData, setUserData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [weeklyData, setWeeklyData] = useState([]);
  const [explanations, setExplanations] = useState({});
  const [expandedMetric, setExpandedMetric] = useState(null);
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function loadData() {
      const user = auth.currentUser;
      if (!user) return;

      // Load user profile
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);

        // Calculate targets
        if (data.weight && data.height && data.age) {
          const calculated = calculateWellnessTargets({
            weight: parseFloat(data.weight),
            height: parseFloat(data.height),
            age: parseInt(data.age),
            activityLevel: data.activityLevel || 'light',
            goal: data.goal || 'maintain',
            hasPMOS: data.diagnosisStatus === 'diagnosed',
          });
          setTargets(calculated);
          setExplanations(getTargetExplanations(calculated, data));
        }
      }

      // Load today's wellness log
      const logSnap = await getDoc(
        doc(db, 'users', user.uid, 'wellnessLogs', todayStr)
      );
      if (logSnap.exists()) {
        setTodayLog(logSnap.data());
      }

      // Load weekly data for analytics
      const weekQ = query(
        collection(db, 'users', user.uid, 'wellnessLogs'),
        orderBy('date', 'desc'),
        limit(7)
      );
      const weekSnap = await getDocs(weekQ);
      setWeeklyData(weekSnap.docs.map(d => d.data()));
    }
    loadData();
  }, [todayStr]);

  async function updateLog(key, value) {
    const updated = { ...todayLog, [key]: value, date: todayStr };
    setTodayLog(updated);
    try {
      const user = auth.currentUser;
      await setDoc(
        doc(db, 'users', user.uid, 'wellnessLogs', todayStr),
        updated,
        { merge: true }
      );
    } catch (error) {
      console.log('Save error:', error);
    }
  }

  function getProgress(key) {
    if (!targets || !todayLog[key]) return 0;
    const target = key === 'steps' ? targets.steps :
                   key === 'exercise' ? targets.exercise :
                   targets[key];
    if (!target) return 0;
    return Math.min((todayLog[key] / target) * 100, 100);
  }

  function getProgressColor(pct) {
    if (pct >= 100) return 'bg-sage';
    if (pct >= 60) return 'bg-amber';
    return 'bg-terra';
  }

  if (!targets && userData && (!userData.weight || !userData.height)) {
    return (
      <div className="screen flex flex-col items-center justify-center text-center pb-24">
        <div className="text-4xl mb-4">🌙</div>
        <h1 className="page-title mb-2">Set up your wellness profile</h1>
        <p className="text-muted-rose text-sm mb-6">
          Sakhi needs a few details to create your personalised daily targets.
        </p>
        <button
          onClick={() => navigate('/wellness-setup')}
          className="btn-primary"
        >
          Start setup with Sakhi
        </button>
        <Navbar />
      </div>
    );
  }

  return (
    <div className="screen pb-24">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="page-title">Wellness</h1>
          <p className="text-muted-rose text-xs">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', day: 'numeric', month: 'long'
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/wellness-setup')}
          className="text-xs text-mauve border border-mauve rounded-pill px-3 py-1"
        >
          Update goals
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        {['today', 'weekly'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-pill text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-mauve text-white'
                : 'bg-blush text-muted-rose'
            }`}
          >
            {tab === 'today' ? "Today's Targets" : 'Weekly Trends'}
          </button>
        ))}
      </div>

      {activeTab === 'today' && (
        <div>

          {/* Calorie Ring Summary */}
          {targets && (
            <div className="card mb-4 flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9"
                    fill="none" stroke="#F5EBE8" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9"
                    fill="none" stroke="#9B6B8A" strokeWidth="3"
                    strokeDasharray={`${getProgress('calories')} ${100 - getProgress('calories')}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-charcoal font-bold text-xs">
                    {todayLog.calories || 0}
                  </span>
                  <span className="text-muted-rose text-xs">kcal</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-charcoal font-medium text-sm mb-1">
                  Calorie Budget
                </p>
                <p className="text-muted-rose text-xs mb-2">
                  Goal: {targets.calories} kcal/day
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Carbs', val: targets.calories ? Math.round(targets.calories * 0.45 / 4) : 0, unit: 'g' },
                    { label: 'Protein', val: targets.protein, unit: 'g' },
                    { label: 'Fat', val: targets.fats, unit: 'g' },
                  ].map(m => (
                    <div key={m.label} className="text-center">
                      <p className="text-charcoal text-xs font-medium">{m.val}{m.unit}</p>
                      <p className="text-muted-rose text-xs">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="space-y-3 mb-4">
            {METRICS.filter(m => m.key !== 'calories').map((metric) => {
              const target = targets?.[metric.key] ||
                (metric.key === 'steps' ? targets?.steps :
                 metric.key === 'exercise' ? targets?.exercise : 0);
              const current = todayLog[metric.key] || 0;
              const pct = target ? Math.min((current / target) * 100, 100) : 0;
              const isExpanded = expandedMetric === metric.key;

              return (
                <div key={metric.key} className="card">
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedMetric(isExpanded ? null : metric.key)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{metric.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-charcoal font-medium text-sm">
                            {metric.label}
                          </p>
                          <p className="text-xs text-muted-rose">
                            {current}{metric.unit} / {target}{metric.unit}
                          </p>
                        </div>
                        <div className="h-2 bg-cream rounded-full mt-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(pct)}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-muted-rose text-sm ml-1">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="pt-2 border-t border-blush">
                      {explanations[metric.key] && (
                        <p className="text-muted-rose text-xs leading-relaxed mb-3">
                          {explanations[metric.key]}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder={`Log ${metric.label.toLowerCase()}...`}
                          className="input-field text-sm py-2 flex-1"
                          onBlur={(e) => {
                            if (e.target.value) {
                              updateLog(metric.key, parseFloat(e.target.value));
                            }
                          }}
                          defaultValue={current || ''}
                        />
                        <span className="text-muted-rose text-sm">{metric.unit}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mood, Energy, Stress */}
          <p className="section-label mb-3">How are you feeling?</p>

          <div className="card mb-3 space-y-4">
            <div>
              <p className="text-sm text-charcoal font-medium mb-2">Mood</p>
              <div className="flex justify-between">
                {MOOD_OPTIONS.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => updateLog('mood', i + 1)}
                    className={`text-2xl transition-transform ${
                      todayLog.mood === i + 1 ? 'scale-125' : 'opacity-50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-charcoal font-medium mb-2">Energy</p>
              <div className="flex gap-2 flex-wrap">
                {ENERGY_OPTIONS.map((level) => (
                  <button
                    key={level}
                    onClick={() => updateLog('energy', level)}
                    className={`px-3 py-1 rounded-pill text-xs border transition-colors ${
                      todayLog.energy === level
                        ? 'bg-mauve text-white border-mauve'
                        : 'border-muted-rose text-muted-rose'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-charcoal font-medium mb-2">Stress</p>
              <div className="flex gap-2 flex-wrap">
                {STRESS_OPTIONS.map((level) => (
                  <button
                    key={level}
                    onClick={() => updateLog('stress', level)}
                    className={`px-3 py-1 rounded-pill text-xs border transition-colors ${
                      todayLog.stress === level
                        ? 'bg-mauve text-white border-mauve'
                        : 'border-muted-rose text-muted-rose'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Weight Log */}
          <div className="card mb-3">
            <p className="text-sm text-charcoal font-medium mb-2">
              Today's weight (optional)
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Enter weight..."
                className="input-field text-sm py-2 flex-1"
                defaultValue={todayLog.weight || ''}
                onBlur={(e) => {
                  if (e.target.value) updateLog('weight', parseFloat(e.target.value));
                }}
              />
              <span className="text-muted-rose text-sm">kg</span>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'weekly' && (
        <div>
          <p className="text-muted-rose text-sm mb-4">
            Last 7 days overview
          </p>

          {weeklyData.length === 0 ? (
            <div className="card text-center">
              <p className="text-muted-rose text-sm">
                Log your daily wellness for 7 days to see trends here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Weight Trend */}
              <div className="card">
                <p className="text-charcoal font-medium text-sm mb-3">
                  ⚖️ Weight trend
                </p>
                <div className="flex items-end gap-1 h-16">
                  {weeklyData.slice().reverse().map((day, i) => {
                    const maxWeight = Math.max(...weeklyData.map(d => d.weight || 0));
                    const height = maxWeight > 0 ? ((day.weight || 0) / maxWeight) * 100 : 20;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-mauve rounded-t"
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        <p className="text-xs text-muted-rose">
                          {day.date?.slice(5)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Consistency scores */}
              {['protein', 'water', 'sleep', 'exercise'].map((key) => {
                const daysLogged = weeklyData.filter(d => d[key] > 0).length;
                const consistency = Math.round((daysLogged / 7) * 100);
                return (
                  <div key={key} className="card">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-charcoal text-sm font-medium capitalize">
                        {METRICS.find(m => m.key === key)?.icon} {key} consistency
                      </p>
                      <p className={`text-sm font-bold ${
                        consistency >= 70 ? 'text-sage' :
                        consistency >= 40 ? 'text-amber' : 'text-danger'
                      }`}>
                        {consistency}%
                      </p>
                    </div>
                    <div className="h-2 bg-cream rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          consistency >= 70 ? 'bg-sage' :
                          consistency >= 40 ? 'bg-amber' : 'bg-danger'
                        }`}
                        style={{ width: `${consistency}%` }}
                      />
                    </div>
                    <p className="text-muted-rose text-xs mt-1">
                      {daysLogged} of 7 days logged
                    </p>
                  </div>
                );
              })}

              {/* Mood average */}
              <div className="card">
                <p className="text-charcoal font-medium text-sm mb-2">
                  😊 Average mood this week
                </p>
                <div className="flex gap-2">
                  {weeklyData.slice().reverse().map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <span className="text-lg">
                        {MOOD_OPTIONS[(day.mood || 3) - 1]}
                      </span>
                      <span className="text-xs text-muted-rose">
                        {day.date?.slice(8)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      <Navbar />
    </div>
  );
}