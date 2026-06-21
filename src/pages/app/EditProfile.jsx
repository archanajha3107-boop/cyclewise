import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

export default function EditProfile() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    city: '',
    diagnosisYear: '',
    medications: '',
    weight: '',
    height: '',
    activityLevel: '',
    dietType: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          name: data.name || '',
          age: data.age || '',
          city: data.city || '',
          diagnosisYear: data.diagnosisYear || '',
          medications: data.medications || '',
          weight: data.weight || '',
          height: data.height || '',
          activityLevel: data.activityLevel || '',
          dietType: data.dietType || '',
        });
      }
    }
    load();
  }, []);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      const user = auth.currentUser;
      await setDoc(doc(db, 'users', user.uid), form, { merge: true });
      setSaved(true);
      setTimeout(() => navigate('/profile'), 1000);
    } catch (error) {
      alert('Could not save. Please try again.');
    }
    setSaving(false);
  }

  const fields = [
    { key: 'name', label: 'Display name', type: 'text', placeholder: 'Your name' },
    { key: 'age', label: 'Age', type: 'number', placeholder: 'Your age' },
    { key: 'city', label: 'City (optional)', type: 'text', placeholder: 'Where you live' },
    { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Your weight in kg' },
    { key: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Your height in cm' },
    { key: 'diagnosisYear', label: 'Year of diagnosis (optional)', type: 'number', placeholder: 'e.g. 2021' },
    { key: 'medications', label: 'Current medications (optional)', type: 'text', placeholder: 'e.g. Metformin' },
  ];

  const activityOptions = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly active', value: 'light' },
    { label: 'Moderately active', value: 'moderate' },
    { label: 'Very active', value: 'active' },
  ];

  const dietOptions = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Non-vegetarian', value: 'non-vegetarian' },
    { label: 'Vegan', value: 'vegan' },
  ];

  return (
    <div className="screen pb-10">
      <div className="flex items-center justify-between mb-2">
        <PageHeader title="Edit profile" showBack backTo="/profile" />
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-mauve text-sm font-medium"
        >
          {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-mauve flex items-center justify-center mb-2">
          <span className="text-white font-playfair text-xl font-bold">
            {form.name ? form.name.slice(0, 2).toUpperCase() : 'CW'}
          </span>
        </div>
        <p className="text-muted-rose text-xs">
          Tap to change photo (coming soon)
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key}>
            <p className="text-xs text-muted-rose mb-1 ml-1">{field.label}</p>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="input-field"
            />
          </div>
        ))}

        {/* Activity Level */}
        <div>
          <p className="text-xs text-muted-rose mb-1 ml-1">Activity level</p>
          <div className="flex gap-2 flex-wrap">
            {activityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange('activityLevel', opt.value)}
                className={`px-3 py-1.5 rounded-pill text-sm border transition-colors ${
                  form.activityLevel === opt.value
                    ? 'bg-mauve text-white border-mauve'
                    : 'border-muted-rose text-muted-rose'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diet Type */}
        <div>
          <p className="text-xs text-muted-rose mb-1 ml-1">Diet type</p>
          <div className="flex gap-2 flex-wrap">
            {dietOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange('dietType', opt.value)}
                className={`px-3 py-1.5 rounded-pill text-sm border transition-colors ${
                  form.dietType === opt.value
                    ? 'bg-mauve text-white border-mauve'
                    : 'border-muted-rose text-muted-rose'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary mt-6"
      >
        {saved ? '✓ Profile updated' : saving ? 'Saving...' : 'Update profile'}
      </button>
    </div>
  );
}