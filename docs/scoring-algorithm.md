# PMOS Risk Scoring Algorithm — CycleWise

**Document type:** Algorithm Design & DSA  
**Phase:** Pre-development  
**Version:** 1.0  
**Last updated:** May 2026  
**Author:** Archana (Founder, CycleWise)  
**Status:** Finalised for Phase 1 screening tool

---

This document explains the logic behind how CycleWise calculates a PMOS risk score from a girl's answers to the screening questionnaire. It covers the clinical research behind the scoring weights, the full algorithm in plain language, the algorithm in code (JavaScript), and how to test it.

This is the most important DSA (Data Structures and Algorithms) component of the CycleWise project. It is a real weighted scoring algorithm grounded in peer-reviewed clinical research — not a tutorial exercise.

---

## Clinical Research Basis

The scoring algorithm is grounded in three validated clinical frameworks:

### 1. Rotterdam Criteria (2003, updated 2023)
The most widely accepted diagnostic framework for PMOS globally.
> "PMOS should be diagnosed using the revised Rotterdam criteria. In adults this requires the presence of two of: clinical/biochemical hyperandrogenism, ovulatory dysfunction, and polycystic ovaries on ultrasound or elevated AMH levels. In adolescents, both hyperandrogenism and ovulatory dysfunction are required."  
> — Monash University PCOS Guideline Summary, 2023

Since our screening tool cannot perform ultrasounds or blood tests, we screen for **observable indicators** of these three criteria through self-reported symptoms.

### 2. Indian Primary Care Screening Tool (IJEM, 2023)
An Indian-specific validated screening framework published in the Indian Journal of Endocrinology and Metabolism proposes structuring questions into three domains:
- **Menstrual/maternity domain** — cycle regularity and frequency
- **Metabolic domain** — weight, skin changes, insulin resistance indicators
- **Dermatological domain** — facial hair, scalp hair, acne

> "A positive answer in any two domains should prompt suspicion of PMOS."  
> — Primary Care Screening Tool for PCOS, Indian J Endocrinol Metab, 2023

### 3. Calgary Validated Questionnaire (PMC, 2003/2021)
A self-administered questionnaire validated at the University of Calgary found that **infrequent menses, hirsutism, obesity, and acne** were the four strongest predictors of PMOS diagnosis, achieving 77% sensitivity and 94% specificity.

> "A history of infrequent menses, hirsutism, obesity, and acne were strongly predictive of a diagnosis of PCOS."  
> — Self-Administered Questionnaire to Screen for PCOS, PMC7785063

### 4. School-Based Screening Study (Islamabad, 2024)
A cross-sectional study conducted in a girls' high school found that the strongest screening associations were:
> "Irregular menstrual cycles, oligomenorrhea/amenorrhea, midline hirsutism, higher BMI, thinning scalp hair, jawline acne, and lower fruit intake."  
> — Enhanced PCOS screening study, Middle East Fertility Society Journal, 2025

---

## Why Weighted Scoring (Not Simple Yes/No)

A simple yes/no checklist would treat every symptom equally. But clinically, **menstrual irregularity is the strongest single indicator of PMOS** — more predictive than acne alone, more predictive than weight alone.

Weighted scoring assigns higher point values to clinically stronger indicators. This produces a more accurate risk band than counting symptoms.

**Analogy for understanding:** Think of it like a school exam where some questions are worth 5 marks and some are worth 10 marks. The total score reflects the importance of each answer, not just how many answers were correct.

---

## Scoring Categories and Weights

The total possible score is **100 points** distributed across four categories:

| Category | Max Points | Clinical Basis |
|---|---|---|
| Menstrual irregularity | 40 | Strongest PMOS indicator per Rotterdam criteria |
| Hyperandrogenism symptoms | 30 | Second Rotterdam criterion — observable without blood test |
| Metabolic indicators | 15 | Insulin resistance and weight signals |
| Family history + emotional health | 15 | Risk multipliers |

---

## Complete Question Bank With Point Values

### Category A — Menstrual Irregularity (40 points total)

#### Question A1: How regular are your periods? (max 15 points)
```
"My periods come at roughly the same time every month"     → 0 points
"My periods are sometimes a few days early or late"        → 3 points
"My periods are often irregular — hard to predict"         → 10 points
"My periods are very irregular or I skip months"           → 15 points
```
**Clinical basis:** Oligo-ovulation or anovulation is one of the three Rotterdam criteria. Irregular cycles are the defining observable symptom of PMOS.

---

#### Question A2: How many periods do you get per year? (max 15 points)
```
"10–13 periods (roughly every month)"                      → 0 points
"7–9 periods"                                              → 5 points
"4–6 periods"                                              → 10 points
"Fewer than 4 periods, or none at all"                     → 15 points
```
**Clinical basis:** Rotterdam criteria specifies fewer than 8 menstrual cycles per year as a diagnostic indicator. Fewer than 4 significantly elevates risk.

---

#### Question A3: How long do your periods last? (max 5 points)
```
"3–7 days (typical)"                                       → 0 points
"8–10 days (longer than usual)"                            → 3 points
"1–2 days (very short)"                                    → 3 points
"More than 10 days"                                        → 5 points
"I'm not sure / varies a lot"                              → 4 points
```

---

#### Question A4: How heavy is your period flow? (max 5 points)
```
"Normal flow"                                              → 0 points
"Very light or spotting only"                              → 3 points
"Very heavy — soaking through regularly"                   → 5 points
"Extremely variable — very different each time"            → 4 points
```

---

### Category B — Hyperandrogenism Symptoms (30 points total)

These are observable indicators of elevated androgens — the first Rotterdam criterion.

#### Question B1: Facial and body hair (max 12 points)
```
"No noticeable hair on face, chest or back"                → 0 points
"Slight hair on upper lip only"                            → 3 points
"Noticeable hair on upper lip and/or chin"                → 8 points
"Noticeable hair on face and chest or back"               → 12 points
```
**Clinical basis:** Hirsutism (excess hair growth in male-pattern distribution) is the single most predictive clinical sign of biochemical hyperandrogenism per the modified Ferriman-Gallwey scoring system.

---

#### Question B2: Scalp hair (max 8 points)
```
"No hair thinning"                                         → 0 points
"Slight thinning I've noticed recently"                    → 4 points
"Noticeable thinning or wider parting than before"        → 8 points
```
**Clinical basis:** Female-pattern hair loss (androgenic alopecia) is a documented hyperandrogenism indicator in PMOS.

---

#### Question B3: Acne (max 10 points)
```
"Normal skin, occasional spot"                             → 0 points
"Occasional acne that clears up"                           → 2 points
"Persistent acne on face, jawline, or back"               → 6 points
"Severe acne that doesn't respond to basic treatment"     → 10 points
```
**Clinical basis:** Persistent adult acne — particularly along the jawline — is strongly associated with hyperandrogenism in PMOS. The Calgary study confirmed acne as one of four strongest predictors.

---

### Category C — Metabolic Indicators (15 points total)

#### Question C1: Dark patches of skin (max 8 points)
```
"No dark patches"                                          → 0 points
"Slight darkening on neck or underarms"                    → 5 points
"Noticeable dark patches on neck, underarms, or inner thighs" → 8 points
```
**Clinical basis:** Acanthosis nigricans (dark skin patches) is a visible marker of insulin resistance, which is present in up to 70% of PMOS patients and significantly elevates metabolic risk.

---

#### Question C2: Weight changes (max 7 points)
```
"No unexplained weight changes"                            → 0 points
"Some weight gain I can't fully explain"                   → 3 points
"Significant unexplained weight gain, especially around abdomen" → 7 points
"Difficulty losing weight despite trying"                  → 6 points
```
**Clinical basis:** Central adiposity and difficulty managing weight are associated with insulin resistance in PMOS. Note: Many PMOS patients are lean — this question is a risk multiplier, not a gatekeeper.

---

### Category D — Family History and Emotional/Energy Indicators (15 points total)

#### Question D1: Family history (max 8 points)
```
"No known PMOS or diabetes in family"                      → 0 points
"Someone in family has Type 2 diabetes"                    → 4 points
"Someone in family has PMOS"                               → 6 points
"Both PMOS and diabetes in family"                         → 8 points
```
**Clinical basis:** PMOS has a significant hereditary component. First-degree relatives of PMOS patients have a 20–40% higher risk. Type 2 diabetes in the family also elevates metabolic risk.

---

#### Question D2: Fatigue and energy (max 4 points)
```
"Normal energy levels"                                     → 0 points
"Often tired even after sleeping well"                     → 2 points
"Consistently exhausted — energy is a constant problem"   → 4 points
```

---

#### Question D3: Age at first period (max 3 points)
```
"Age 11–14 (typical)"                                      → 0 points
"Age 15–17 (later than typical)"                           → 2 points
"Age 10 or younger"                                        → 1 point
"Not yet started"                                          → 3 points
```
**Clinical basis:** Delayed menarche (first period) can indicate ovulatory dysfunction beginning early. Very early menarche also carries risk.

---

## Risk Score Bands

| Score | Band | Label | Response |
|---|---|---|---|
| 0–25 | Band 1 | Low risk | PMOS awareness message, general health tips |
| 26–45 | Band 2 | Low-moderate risk | Monitor symptoms, learn about PMOS, app recommended |
| 46–65 | Band 3 | Moderate-high risk | Strongly recommend gynaecologist, app download |
| 66–80 | Band 4 | High risk | Urgent gynaecologist recommendation, parent guide |
| 81–100 | Band 5 | Very high risk | Urgent recommendation, parent guide, doctor question list |

**Important:** No band says "You have PMOS." The tool screens for risk indicators only. A doctor with ultrasound and blood tests makes the actual diagnosis.

---

## The Algorithm in Plain English (Before Code)

```
Step 1: Collect answers to all 15 questions
Step 2: Look up the point value for each answer
Step 3: Add up all points → this is the raw score (max 100)
Step 4: Apply modifiers (see below)
Step 5: Cap the score at 100
Step 6: Map score to risk band
Step 7: Return band, score, and which categories were high
```

### Score Modifiers

These adjust the raw score based on combinations of answers that are clinically significant:

**Modifier 1 — Strong menstrual + strong androgen combination (+5)**  
If A1 score ≥ 10 AND B1 score ≥ 8 → add 5 points  
*Reason: This combination directly mirrors the Rotterdam criteria for adolescents — both hyperandrogenism AND ovulatory dysfunction present.*

**Modifier 2 — Family history amplifier (+3)**  
If D1 score ≥ 6 AND (A1 score ≥ 10 OR B1 score ≥ 8) → add 3 points  
*Reason: Family history of PMOS combined with clinical symptoms significantly elevates actual risk.*

**Modifier 3 — Metabolic risk amplifier (+3)**  
If C1 score ≥ 5 AND C2 score ≥ 3 → add 3 points  
*Reason: Acanthosis nigricans combined with unexplained weight gain is a strong combined insulin resistance signal.*

---

## The Algorithm in JavaScript (Production Code)

This is the actual code that goes in `src/scoring/pmosScoringAlgorithm.js`

```javascript
/**
 * CycleWise PMOS Risk Scoring Algorithm
 * 
 * Based on:
 * - Rotterdam Criteria (Monash University 2023 update)
 * - Indian Primary Care PCOS Screening Tool (IJEM 2023)
 * - Calgary Validated PCOS Questionnaire (PMC 2003/2021)
 * - Islamabad school-based screening study (MEFS Journal 2025)
 * 
 * @param {Object} answers - User's form answers
 * @returns {Object} - { score, band, bandLabel, categoryScores, modifiersApplied, highRiskCategories }
 */

// ─── POINT VALUE MAPS ──────────────────────────────────────────────────────

const SCORES = {

  // Category A — Menstrual Irregularity (max 40)
  A1_cycle_regularity: {
    'regular':        0,
    'slightly_off':   3,
    'often_irregular': 10,
    'very_irregular': 15
  },
  A2_periods_per_year: {
    'ten_to_thirteen': 0,
    'seven_to_nine':   5,
    'four_to_six':     10,
    'less_than_four':  15
  },
  A3_period_duration: {
    'three_to_seven':  0,
    'eight_to_ten':    3,
    'one_to_two':      3,
    'more_than_ten':   5,
    'varies':          4
  },
  A4_flow_level: {
    'normal':          0,
    'very_light':      3,
    'very_heavy':      5,
    'very_variable':   4
  },

  // Category B — Hyperandrogenism (max 30)
  B1_facial_body_hair: {
    'none':            0,
    'slight_upper_lip': 3,
    'noticeable_face': 8,
    'face_and_body':   12
  },
  B2_scalp_hair: {
    'no_thinning':     0,
    'slight_thinning': 4,
    'noticeable_thinning': 8
  },
  B3_acne: {
    'normal':          0,
    'occasional':      2,
    'persistent':      6,
    'severe':          10
  },

  // Category C — Metabolic (max 15)
  C1_dark_patches: {
    'none':            0,
    'slight':          5,
    'noticeable':      8
  },
  C2_weight_changes: {
    'none':            0,
    'some_gain':       3,
    'significant_gain': 7,
    'difficulty_losing': 6
  },

  // Category D — Family History + Emotional (max 15)
  D1_family_history: {
    'none':            0,
    'diabetes_only':   4,
    'pmos_only':       6,
    'both':            8
  },
  D2_fatigue: {
    'normal':          0,
    'often_tired':     2,
    'consistently_exhausted': 4
  },
  D3_age_first_period: {
    'typical_11_14':   0,
    'late_15_17':      2,
    'early_under_10':  1,
    'not_started':     3
  }
};

// ─── RISK BANDS ────────────────────────────────────────────────────────────

const RISK_BANDS = [
  { min: 0,  max: 25,  band: 1, label: 'low',           display: 'Low Risk' },
  { min: 26, max: 45,  band: 2, label: 'low-moderate',  display: 'Low-Moderate Risk' },
  { min: 46, max: 65,  band: 3, label: 'moderate-high', display: 'Moderate-High Risk' },
  { min: 66, max: 80,  band: 4, label: 'high',          display: 'High Risk' },
  { min: 81, max: 100, band: 5, label: 'very-high',     display: 'Very High Risk' }
];

// ─── MAIN SCORING FUNCTION ─────────────────────────────────────────────────

/**
 * Calculate PMOS risk score from user answers
 * @param {Object} answers - Keys match SCORES object above
 * @returns {Object} Full scoring result
 */
export function calculatePMOSRiskScore(answers) {

  // Step 1: Calculate raw category scores
  const categoryScores = {
    A: calculateCategoryScore(answers, ['A1_cycle_regularity', 'A2_periods_per_year', 'A3_period_duration', 'A4_flow_level']),
    B: calculateCategoryScore(answers, ['B1_facial_body_hair', 'B2_scalp_hair', 'B3_acne']),
    C: calculateCategoryScore(answers, ['C1_dark_patches', 'C2_weight_changes']),
    D: calculateCategoryScore(answers, ['D1_family_history', 'D2_fatigue', 'D3_age_first_period'])
  };

  // Step 2: Sum all category scores
  let rawScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);

  // Step 3: Apply modifiers
  const modifiersApplied = [];

  // Modifier 1 — Strong menstrual + strong androgen
  if (
    getScore('A1_cycle_regularity', answers.A1_cycle_regularity) >= 10 &&
    getScore('B1_facial_body_hair', answers.B1_facial_body_hair) >= 8
  ) {
    rawScore += 5;
    modifiersApplied.push({
      name: 'menstrual_androgen_combination',
      points: 5,
      reason: 'Both cycle irregularity and visible androgen signs present — mirrors Rotterdam adolescent criteria'
    });
  }

  // Modifier 2 — Family history amplifier
  if (
    getScore('D1_family_history', answers.D1_family_history) >= 6 &&
    (
      getScore('A1_cycle_regularity', answers.A1_cycle_regularity) >= 10 ||
      getScore('B1_facial_body_hair', answers.B1_facial_body_hair) >= 8
    )
  ) {
    rawScore += 3;
    modifiersApplied.push({
      name: 'family_history_amplifier',
      points: 3,
      reason: 'Family history of PMOS combined with clinical symptoms elevates risk'
    });
  }

  // Modifier 3 — Metabolic risk amplifier
  if (
    getScore('C1_dark_patches', answers.C1_dark_patches) >= 5 &&
    getScore('C2_weight_changes', answers.C2_weight_changes) >= 3
  ) {
    rawScore += 3;
    modifiersApplied.push({
      name: 'metabolic_amplifier',
      points: 3,
      reason: 'Combined skin darkening and weight changes suggest insulin resistance'
    });
  }

  // Step 4: Cap at 100
  const finalScore = Math.min(rawScore, 100);

  // Step 5: Determine risk band
  const riskBand = RISK_BANDS.find(b => finalScore >= b.min && finalScore <= b.max);

  // Step 6: Identify high-risk categories (for personalised feedback)
  const highRiskCategories = [];
  if (categoryScores.A >= 25) highRiskCategories.push('menstrual');
  if (categoryScores.B >= 18) highRiskCategories.push('androgen');
  if (categoryScores.C >= 9)  highRiskCategories.push('metabolic');
  if (categoryScores.D >= 9)  highRiskCategories.push('family_history');

  return {
    score: finalScore,
    band: riskBand.band,
    bandLabel: riskBand.label,
    bandDisplay: riskBand.display,
    categoryScores,
    modifiersApplied,
    highRiskCategories,
    rawScoreBeforeModifiers: rawScore - modifiersApplied.reduce((sum, m) => sum + m.points, 0)
  };
}

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────

function getScore(questionKey, answerValue) {
  if (!answerValue || !SCORES[questionKey]) return 0;
  return SCORES[questionKey][answerValue] ?? 0;
}

function calculateCategoryScore(answers, questionKeys) {
  return questionKeys.reduce((sum, key) => {
    return sum + getScore(key, answers[key]);
  }, 0);
}

// ─── RESULT MESSAGE GENERATOR ──────────────────────────────────────────────

/**
 * Generate the personalised result message shown to the user
 * @param {Object} result - Output from calculatePMOSRiskScore
 * @returns {Object} - { headline, explanation, nextStep, urgency }
 */
export function generateResultMessage(result) {
  const messages = {
    1: {
      headline: "Your responses suggest a low risk of PMOS right now.",
      explanation: "You don't currently show many of the common indicators of PMOS. This is great news. It's still worth knowing what PMOS is — it affects 1 in 8 women and awareness is the best early defence.",
      nextStep: "Keep tracking your cycle and note any changes. If your periods become irregular or you notice new symptoms, revisit this screening.",
      urgency: "low"
    },
    2: {
      headline: "Your responses suggest some indicators worth paying attention to.",
      explanation: "You show a few patterns that are sometimes associated with PMOS. This doesn't mean you have it — but it's worth monitoring. PMOS is very manageable when caught early.",
      nextStep: "Download CycleWise to track your symptoms over the next 2–3 months. If patterns continue, mention them to a doctor.",
      urgency: "low"
    },
    3: {
      headline: "Your responses suggest several indicators commonly associated with PMOS.",
      explanation: "Multiple symptoms you've reported are consistent with PMOS. This is not a diagnosis — only a doctor can confirm. But these patterns are meaningful and worth taking seriously. You are not alone — PMOS is one of the most common hormonal conditions in India.",
      nextStep: "We strongly recommend booking an appointment with a gynaecologist. Take the PDF report from this screening to show them. Download CycleWise to track symptoms in the meantime.",
      urgency: "medium"
    },
    4: {
      headline: "Your responses show strong indicators of PMOS. Please see a doctor soon.",
      explanation: "Several of your answers align closely with known PMOS patterns. A gynaecologist visit is important — not to alarm you, but because early management makes a real difference. PMOS is a lifelong condition that responds well to lifestyle and medical support when addressed early.",
      nextStep: "Please share this PDF with a parent or trusted adult and book a gynaecologist appointment. Download CycleWise to prepare for your visit with a symptom history.",
      urgency: "high"
    },
    5: {
      headline: "Your responses suggest very strong PMOS indicators. Please see a doctor as soon as possible.",
      explanation: "Your answers show multiple strong indicators across different categories. This still needs a doctor to confirm — but the pattern is significant. Please don't ignore this. Early diagnosis and management can prevent long-term complications.",
      nextStep: "Show this PDF to a parent today and book a gynaecologist appointment this week. Download CycleWise to prepare a full symptom history for your doctor. You can do this.",
      urgency: "urgent"
    }
  };

  return messages[result.band];
}
```

---

## Testing the Algorithm

Before deploying, test the algorithm manually with these 5 test cases. Run each through the function and verify the output matches the expected band.

### Test Case 1 — Low Risk
**Profile:** Regular periods, no hair growth, no acne, no family history

```javascript
const testAnswers1 = {
  A1_cycle_regularity: 'regular',
  A2_periods_per_year: 'ten_to_thirteen',
  A3_period_duration: 'three_to_seven',
  A4_flow_level: 'normal',
  B1_facial_body_hair: 'none',
  B2_scalp_hair: 'no_thinning',
  B3_acne: 'normal',
  C1_dark_patches: 'none',
  C2_weight_changes: 'none',
  D1_family_history: 'none',
  D2_fatigue: 'normal',
  D3_age_first_period: 'typical_11_14'
};
// Expected: score = 0, band = 1, label = 'low'
```

---

### Test Case 2 — Moderate-High Risk
**Profile:** Irregular periods, noticeable facial hair, jawline acne, mother has PMOS

```javascript
const testAnswers2 = {
  A1_cycle_regularity: 'often_irregular',
  A2_periods_per_year: 'seven_to_nine',
  A3_period_duration: 'varies',
  A4_flow_level: 'very_variable',
  B1_facial_body_hair: 'noticeable_face',
  B2_scalp_hair: 'no_thinning',
  B3_acne: 'persistent',
  C1_dark_patches: 'none',
  C2_weight_changes: 'some_gain',
  D1_family_history: 'pmos_only',
  D2_fatigue: 'often_tired',
  D3_age_first_period: 'typical_11_14'
};
// Expected: score ≈ 56–60, band = 3, label = 'moderate-high'
// Modifiers: menstrual_androgen_combination (+5), family_history_amplifier (+3)
```

---

### Test Case 3 — Very High Risk
**Profile:** Barely any periods, facial and body hair, severe acne, dark patches, family history of both

```javascript
const testAnswers3 = {
  A1_cycle_regularity: 'very_irregular',
  A2_periods_per_year: 'less_than_four',
  A3_period_duration: 'varies',
  A4_flow_level: 'very_variable',
  B1_facial_body_hair: 'face_and_body',
  B2_scalp_hair: 'noticeable_thinning',
  B3_acne: 'severe',
  C1_dark_patches: 'noticeable',
  C2_weight_changes: 'significant_gain',
  D1_family_history: 'both',
  D2_fatigue: 'consistently_exhausted',
  D3_age_first_period: 'late_15_17'
};
// Expected: score = 100 (capped), band = 5, label = 'very-high'
// All modifiers applied
```

---

### Test Case 4 — Edge Case: Lean PMOS (Thin Girl, Strong Hormonal Signs)
**Profile:** Very irregular periods, visible hair, acne — but no weight changes, no dark patches

```javascript
const testAnswers4 = {
  A1_cycle_regularity: 'very_irregular',
  A2_periods_per_year: 'four_to_six',
  A3_period_duration: 'varies',
  A4_flow_level: 'very_light',
  B1_facial_body_hair: 'noticeable_face',
  B2_scalp_hair: 'slight_thinning',
  B3_acne: 'persistent',
  C1_dark_patches: 'none',
  C2_weight_changes: 'none',
  D1_family_history: 'none',
  D2_fatigue: 'often_tired',
  D3_age_first_period: 'typical_11_14'
};
// Expected: score ≈ 52–57, band = 3, label = 'moderate-high'
// This tests that lean girls are not under-scored
```

---

### Test Case 5 — Edge Case: Metabolic Only (No Menstrual Symptoms Yet)
**Profile:** Regular periods but significant dark patches, weight gain, family history

```javascript
const testAnswers5 = {
  A1_cycle_regularity: 'slightly_off',
  A2_periods_per_year: 'ten_to_thirteen',
  A3_period_duration: 'three_to_seven',
  A4_flow_level: 'normal',
  B1_facial_body_hair: 'none',
  B2_scalp_hair: 'no_thinning',
  B3_acne: 'occasional',
  C1_dark_patches: 'noticeable',
  C2_weight_changes: 'significant_gain',
  D1_family_history: 'both',
  D2_fatigue: 'often_tired',
  D3_age_first_period: 'typical_11_14'
};
// Expected: score ≈ 30–35, band = 2, label = 'low-moderate'
// Metabolic modifier applies (+3)
// Tests that metabolic-only profile doesn't get over-scored
```

---

## What This Algorithm Is Not

This section is critical and must be understood before deploying.

1. **It is not a diagnosis.** Only a licensed gynaecologist or endocrinologist with access to blood tests and ultrasound can diagnose PMOS.

2. **It is not 100% accurate.** No self-reported screening tool is. The Calgary questionnaire achieved 77% sensitivity and 94% specificity on clinical populations. Our tool is built on the same principles but has not been clinically validated on a large Indian population yet. That validation is a future research goal.

3. **It can produce false negatives.** A girl with PMOS may score low — particularly if she is lean, if her symptoms are mild, or if her cycle irregularity only recently started.

4. **It can produce false positives.** A girl without PMOS may score high — particularly if she has another condition with overlapping symptoms.

5. **All result messaging reflects this.** No result screen says "You have PMOS." All messaging says "Your responses suggest indicators" and directs to a doctor.

---

## Future Improvements (Version 2)

- Add age-adjusted weights (adolescent PMOS criteria differ from adult criteria per Rotterdam 2023 update)
- Validate algorithm against real screening results from school pilots
- Add Bayesian network layer (as used in Clue's ICF model) for probabilistic rather than additive scoring
- Collect anonymised aggregate data to recalibrate weights against Indian population specifically

---

## Related Documents

- [PRD.md](PRD.md) — Product requirements including screening tool feature spec
- [architecture.md](architecture.md) — How this algorithm integrates into the React app
- [personas.md](personas.md) — Who this screening tool is built for
- [competitor-analysis.md](competitor-analysis.md) — Why existing tools failed at this

---

## Sources

- Lizneva D, et al. (2023). *PCOS Guideline Summary.* Monash University. https://www.monash.edu/__data/assets/pdf_file/0003/3371133/PCOS-Guideline-Summary-2023.pdf
- Kumarapeli V, et al. (2023). *Primary Care Screening Tool for PCOS.* Indian Journal of Endocrinology and Metabolism. https://pmc.ncbi.nlm.nih.gov/articles/PMC10245304/
- Pedersen SD, et al. (2007). *Polycystic ovary syndrome: Validated questionnaire for use in diagnosis.* PMC. https://pmc.ncbi.nlm.nih.gov/articles/PMC1949220/
- Roe AH, et al. (2021). *Self-Administered Questionnaire to Screen for PCOS.* PMC. https://pmc.ncbi.nlm.nih.gov/articles/PMC7785063/
- Rodriguez EM. (2019). *Identifying Women at Risk for PCOS Using a Mobile Health App.* PMC. https://pmc.ncbi.nlm.nih.gov/articles/PMC7256750/
- Al-Qasem M, et al. (2025). *Enhanced PCOS screening incorporating population and symptom-specific scales.* Middle East Fertility Society Journal. https://link.springer.com/article/10.1186/s43043-025-00248-3
- Merck Manual Professional. (2026). *Polycystic Ovary Syndrome.* https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormal-uterine-bleeding/polycystic-ovary-syndrome-pcos

---

*CycleWise — Built by someone who needed it. For everyone who does.*
