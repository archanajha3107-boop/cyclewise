import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculatePMOSRiskScore } from '../../scoring/pmosScoringAlgorithm';

const QUESTIONS = [
  {
    id: 'A1_cycle_regularity',
    section: 'Menstrual Health',
    question: 'How regular are your periods?',
    options: [
      { label: 'They come at roughly the same time every month', value: 'regular' },
      { label: 'Sometimes a few days early or late', value: 'slightly_off' },
      { label: 'Often irregular — hard to predict', value: 'often_irregular' },
      { label: 'Very irregular or I skip months', value: 'very_irregular' },
    ],
  },
  {
    id: 'A2_periods_per_year',
    section: 'Menstrual Health',
    question: 'How many periods do you usually get in a year?',
    options: [
      { label: '10 to 13 (roughly every month)', value: 'ten_to_thirteen' },
      { label: '7 to 9', value: 'seven_to_nine' },
      { label: '4 to 6', value: 'four_to_six' },
      { label: 'Fewer than 4', value: 'less_than_four' },
      { label: "I'm not sure", value: 'ten_to_thirteen' },
    ],
  },
  {
    id: 'A3_period_duration',
    section: 'Menstrual Health',
    question: 'How long do your periods usually last?',
    options: [
      { label: '3 to 7 days (typical)', value: 'three_to_seven' },
      { label: '8 to 10 days', value: 'eight_to_ten' },
      { label: '1 to 2 days (very short)', value: 'one_to_two' },
      { label: 'More than 10 days', value: 'more_than_ten' },
      { label: 'Varies a lot', value: 'varies' },
    ],
  },
  {
    id: 'A4_flow_level',
    section: 'Menstrual Health',
    question: 'How heavy is your period flow?',
    options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Very light or just spotting', value: 'very_light' },
      { label: 'Very heavy', value: 'very_heavy' },
      { label: 'Very different each time', value: 'very_variable' },
    ],
  },
  {
    id: 'B1_facial_body_hair',
    section: 'Physical Symptoms',
    question: 'Do you have noticeable hair on your face, chest, or back?',
    options: [
      { label: 'No noticeable hair', value: 'none' },
      { label: 'Slight hair on upper lip only', value: 'slight_upper_lip' },
      { label: 'Noticeable hair on upper lip or chin', value: 'noticeable_face' },
      { label: 'Noticeable hair on face and chest or back', value: 'face_and_body' },
    ],
  },
  {
    id: 'B2_scalp_hair',
    section: 'Physical Symptoms',
    question: 'Have you noticed thinning on your scalp?',
    options: [
      { label: 'No thinning', value: 'no_thinning' },
      { label: 'Slight thinning I noticed recently', value: 'slight_thinning' },
      { label: 'Noticeable thinning or wider parting', value: 'noticeable_thinning' },
    ],
  },
  {
    id: 'B3_acne',
    section: 'Physical Symptoms',
    question: 'How would you describe your acne?',
    options: [
      { label: 'Normal skin, occasional spot', value: 'normal' },
      { label: 'Occasional acne that clears up', value: 'occasional' },
      { label: 'Persistent acne on face, jawline, or back', value: 'persistent' },
      { label: "Severe acne that doesn't respond to treatment", value: 'severe' },
    ],
  },
  {
    id: 'C1_dark_patches',
    section: 'Physical Symptoms',
    question: 'Do you have dark patches of skin on your neck, underarms, or inner thighs?',
    options: [
      { label: 'No dark patches', value: 'none' },
      { label: 'Slight darkening', value: 'slight' },
      { label: 'Noticeable dark patches', value: 'noticeable' },
    ],
  },
  {
    id: 'C2_weight_changes',
    section: 'Metabolic',
    question: 'Have you experienced unexplained weight changes?',
    options: [
      { label: 'No unexplained changes', value: 'none' },
      { label: 'Some weight gain I cannot fully explain', value: 'some_gain' },
      { label: 'Significant unexplained weight gain, especially around abdomen', value: 'significant_gain' },
      { label: 'Difficulty losing weight despite trying', value: 'difficulty_losing' },
    ],
  },
  {
    id: 'D1_family_history',
    section: 'Family History',
    question: 'Does anyone in your family have PMOS or Type 2 diabetes?',
    options: [
      { label: 'No known history', value: 'none' },
      { label: 'Someone has Type 2 diabetes', value: 'diabetes_only' },
      { label: 'Someone has PMOS', value: 'pmos_only' },
      { label: 'Both PMOS and diabetes in family', value: 'both' },
    ],
  },
  {
    id: 'D2_fatigue',
    section: 'Energy & Mood',
    question: 'How are your energy levels generally?',
    options: [
      { label: 'Normal energy levels', value: 'normal' },
      { label: 'Often tired even after sleeping well', value: 'often_tired' },
      { label: 'Consistently exhausted', value: 'consistently_exhausted' },
    ],
  },
  {
    id: 'D3_age_first_period',
    section: 'Background',
    question: 'How old were you when you got your first period?',
    options: [
      { label: 'Age 11 to 14 (typical)', value: 'typical_11_14' },
      { label: 'Age 15 to 17 (later than typical)', value: 'late_15_17' },
      { label: 'Age 10 or younger', value: 'early_under_10' },
      { label: "Haven't started yet", value: 'not_started' },
    ],
  },
];

export default function ScreeningQuestion() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const question = QUESTIONS[current];
  const progress = ((current + 1) / QUESTIONS.length) * 100;

  function handleAnswer(value) {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      const result = calculatePMOSRiskScore(newAnswers);
      navigate('/screening/result', { state: { result } });
    }
  }

  return (
    <div className="screen">
      {/* Progress */}
      <div className="h-1.5 bg-blush rounded-full mb-2">
        <div
          className="h-1.5 bg-mauve rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-rose mb-4">
        {current + 1} of {QUESTIONS.length}
      </p>

      {/* Section */}
      <p className="section-label text-terra mb-2">
        Section: {question.section}
      </p>

      {/* Question */}
      <h1 className="font-playfair text-2xl font-bold text-charcoal mb-6 leading-snug">
        {question.question}
      </h1>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="w-full text-left card border border-blush hover:border-mauve hover:bg-mauve/5 transition-colors flex items-center gap-3"
          >
            <div className="w-4 h-4 rounded-full border-2 border-muted-rose flex-shrink-0" />
            <p className="text-charcoal text-sm">{option.label}</p>
          </button>
        ))}
      </div>

      {/* Back */}
      {current > 0 && (
        <button
          onClick={() => setCurrent((c) => c - 1)}
          className="text-mauve text-sm font-medium w-full text-center"
        >
          ← Previous
        </button>
      )}

      <p className="text-xs text-muted-rose text-center mt-3">
        There are no wrong answers. Just answer as honestly as you can.
      </p>
    </div>
  );
}