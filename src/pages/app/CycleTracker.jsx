import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import Navbar from '../../components/Navbar';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const FLOW_OPTIONS = ['Light', 'Medium', 'Heavy', 'Spotting'];

const SYMPTOM_OPTIONS = [
  'Cramps', 'Bloating', 'Fatigue',
  'Headache', 'Mood swings', 'Acne', 'None',
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function CycleTracker() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [periodDays, setPeriodDays] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [painLevel, setPainLevel] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedToday, setSavedToday] = useState(false);

  const todayStr = today.toISOString().split('T')[0];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'cycleLogs'),
      orderBy('date', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const days = snapshot.docs.map((d) => d.data().date);
      setPeriodDays(days);
    });

    return unsub;
  }, []);

  useEffect(() => {
    async function checkToday() {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'cycleLogs', todayStr);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSavedToday(true);
        const data = snap.data();
        setSelectedFlow(data.flow || '');
        setSelectedSymptoms(data.symptoms || []);
        setPainLevel(data.pain || 0);
        setNotes(data.notes || '');
      }
    }
    checkToday();
  }, [todayStr]);

  function toggleSymptom(symptom) {
    if (symptom === 'None') {
      setSelectedSymptoms(['None']);
      return;
    }
    setSelectedSymptoms((prev) => {
      const without = prev.filter((s) => s !== 'None');
      return without.includes(symptom)
        ? without.filter((s) => s !== symptom)
        : [...without, symptom];
    });
  }

  async function handleSave() {
    if (!selectedFlow) {
      alert('Please select a flow level.');
      return;
    }
    try {
      setSaving(true);
      const user = auth.currentUser;
      await setDoc(
        doc(db, 'users', user.uid, 'cycleLogs', todayStr),
        {
          date: todayStr,
          flow: selectedFlow,
          symptoms: selectedSymptoms,
          pain: painLevel,
          notes: notes.trim(),
          createdAt: new Date().toISOString(),
        }
      );
      setSavedToday(true);
      alert('Saved! 🌙');
    } catch (error) {
      alert('Could not save. Please try again.');
    }
    setSaving(false);
  }

  // Build calendar
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarCells = [];

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  function dateStr(day) {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function isPeriodDay(day) {
    return periodDays.includes(dateStr(day));
  }

  function isToday(day) {
    return dateStr(day) === todayStr;
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  return (
    <div className="screen pb-24">

      {/* Header */}
      <h1 className="page-title mb-1">My Cycle</h1>
      <p className="text-muted-rose text-sm mb-4">
        Every entry helps us understand your pattern.
      </p>

      {/* Calendar */}
      <div className="card mb-4">

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevMonth}
            className="text-mauve text-lg px-2"
          >
            ‹
          </button>
          <p className="font-playfair font-semibold text-charcoal">
            {MONTHS[currentMonth]} {currentYear}
          </p>
          <button
            onClick={nextMonth}
            className="text-mauve text-lg px-2"
          >
            ›
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs text-muted-rose font-medium py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {calendarCells.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-8"
            >
              {day && (
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium
                    ${isToday(day)
                      ? 'bg-mauve text-white'
                      : isPeriodDay(day)
                      ? 'bg-terra text-white'
                      : 'text-charcoal'
                    }`}
                >
                  {day}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-terra" />
            <span className="text-xs text-muted-rose">Period</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-mauve" />
            <span className="text-xs text-muted-rose">Today</span>
          </div>
        </div>
      </div>

      {/* Log Today */}
      <p className="section-label mb-3">
        {savedToday ? 'Today\'s log ✓' : 'Log today'}
      </p>

      {/* Flow */}
      <div className="mb-3">
        <p className="text-sm text-charcoal font-medium mb-2">Flow</p>
        <div className="flex gap-2 flex-wrap">
          {FLOW_OPTIONS.map((flow) => (
            <button
              key={flow}
              onClick={() => setSelectedFlow(flow)}
              className={`px-3 py-1.5 rounded-pill text-sm border transition-colors ${
                selectedFlow === flow
                  ? 'bg-mauve text-white border-mauve'
                  : 'border-muted-rose text-muted-rose'
              }`}
            >
              {flow}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="mb-3">
        <p className="text-sm text-charcoal font-medium mb-2">
          Symptoms
        </p>
        <div className="flex gap-2 flex-wrap">
          {SYMPTOM_OPTIONS.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`px-3 py-1.5 rounded-pill text-sm border transition-colors ${
                selectedSymptoms.includes(symptom)
                  ? 'bg-mauve text-white border-mauve'
                  : 'border-muted-rose text-muted-rose'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Pain Level */}
      <div className="mb-3">
        <p className="text-sm text-charcoal font-medium mb-2">
          Pain level
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setPainLevel(level)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                painLevel >= level
                  ? 'bg-terra text-white'
                  : 'bg-blush text-muted-rose'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-rose mt-1">
          1 = low, 5 = high
        </p>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <textarea
          className="w-full bg-blush rounded-xl px-4 py-3 text-charcoal text-sm placeholder-muted-rose focus:outline-none focus:ring-2 focus:ring-mauve resize-none"
          rows={2}
          placeholder="Add a note... (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary"
      >
        {saving ? 'Saving...' : savedToday ? 'Update today\'s log' : 'Save today\'s log'}
      </button>

      {/* Note */}
      <p className="text-xs text-muted-rose text-center mt-3">
        PMOS cycles are naturally irregular.
        Every entry helps us understand your pattern.
      </p>

      <Navbar />
    </div>
  );
}