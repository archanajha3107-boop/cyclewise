const SCORES = {
  A1_cycle_regularity: { regular: 0, slightly_off: 3, often_irregular: 10, very_irregular: 15 },
  A2_periods_per_year: { ten_to_thirteen: 0, seven_to_nine: 5, four_to_six: 10, less_than_four: 15 },
  A3_period_duration: { three_to_seven: 0, eight_to_ten: 3, one_to_two: 3, more_than_ten: 5, varies: 4 },
  A4_flow_level: { normal: 0, very_light: 3, very_heavy: 5, very_variable: 4 },
  B1_facial_body_hair: { none: 0, slight_upper_lip: 3, noticeable_face: 8, face_and_body: 12 },
  B2_scalp_hair: { no_thinning: 0, slight_thinning: 4, noticeable_thinning: 8 },
  B3_acne: { normal: 0, occasional: 2, persistent: 6, severe: 10 },
  C1_dark_patches: { none: 0, slight: 5, noticeable: 8 },
  C2_weight_changes: { none: 0, some_gain: 3, significant_gain: 7, difficulty_losing: 6 },
  D1_family_history: { none: 0, diabetes_only: 4, pmos_only: 6, both: 8 },
  D2_fatigue: { normal: 0, often_tired: 2, consistently_exhausted: 4 },
  D3_age_first_period: { typical_11_14: 0, late_15_17: 2, early_under_10: 1, not_started: 3 },
};

const RISK_BANDS = [
  { min: 0, max: 25, band: 1, label: 'low', display: 'Low Risk' },
  { min: 26, max: 45, band: 2, label: 'low-moderate', display: 'Low-Moderate Risk' },
  { min: 46, max: 65, band: 3, label: 'moderate-high', display: 'Moderate-High Risk' },
  { min: 66, max: 80, band: 4, label: 'high', display: 'High Risk' },
  { min: 81, max: 100, band: 5, label: 'very-high', display: 'Very High Risk' },
];

function getScore(key, value) {
  if (!value || !SCORES[key]) return 0;
  return SCORES[key][value] ?? 0;
}

export function calculatePMOSRiskScore(answers) {
  let raw = Object.keys(SCORES).reduce(
    (sum, key) => sum + getScore(key, answers[key]), 0
  );

  const modifiers = [];

  if (getScore('A1_cycle_regularity', answers.A1_cycle_regularity) >= 10 &&
      getScore('B1_facial_body_hair', answers.B1_facial_body_hair) >= 8) {
    raw += 5;
    modifiers.push('menstrual_androgen_combination');
  }

  if (getScore('D1_family_history', answers.D1_family_history) >= 6 &&
      (getScore('A1_cycle_regularity', answers.A1_cycle_regularity) >= 10 ||
       getScore('B1_facial_body_hair', answers.B1_facial_body_hair) >= 8)) {
    raw += 3;
    modifiers.push('family_history_amplifier');
  }

  if (getScore('C1_dark_patches', answers.C1_dark_patches) >= 5 &&
      getScore('C2_weight_changes', answers.C2_weight_changes) >= 3) {
    raw += 3;
    modifiers.push('metabolic_amplifier');
  }

  const score = Math.min(raw, 100);
  const band = RISK_BANDS.find((b) => score >= b.min && score <= b.max);

  return { score, band: band.band, bandLabel: band.label, bandDisplay: band.display, modifiers };
}