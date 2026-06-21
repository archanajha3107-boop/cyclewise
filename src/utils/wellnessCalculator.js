/**
 * CycleWise Wellness Calculator
 * Science-based daily target engine for PMOS users
 */

export function calculateWellnessTargets(userData) {
  const {
    weight,      // kg
    height,      // cm
    age,
    activityLevel, // 'sedentary' | 'light' | 'moderate' | 'active'
    goal,        // 'lose' | 'maintain' | 'gain'
    hasPMOS,     // boolean
  } = userData;

  if (!weight || !height || !age) return null;

  // BMR — Mifflin-St Jeor equation for women
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;

  // Activity multiplier
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  const tdee = bmr * (multipliers[activityLevel] || 1.2);

  // Goal adjustment
  let calorieGoal = tdee;
  if (goal === 'lose') calorieGoal = tdee - 300;
  if (goal === 'gain') calorieGoal = tdee + 200;

  // PMOS adjustment — insulin resistance reduces efficiency
  if (hasPMOS) calorieGoal = calorieGoal - 100;

  // Protein — higher for PMOS to support insulin sensitivity
  const proteinGoal = Math.round(weight * (hasPMOS ? 1.6 : 1.4));

  // Water
  let waterGoal = weight * 0.033;
  if (activityLevel === 'moderate' || activityLevel === 'active') {
    waterGoal += 0.5;
  }

  // Fibre — higher for PMOS to reduce androgens
  const fibreGoal = hasPMOS ? 35 : 28;

  // Sleep
  let sleepGoal = 8;
  if (age < 18) sleepGoal = 9;
  if (hasPMOS) sleepGoal = Math.max(sleepGoal, 8);

  // Steps
  const stepsGoals = {
    sedentary: 8000,
    light: 10000,
    moderate: 12000,
    active: 12000,
  };

  // Exercise minutes
  const exerciseGoals = {
    sedentary: 20,
    light: 30,
    moderate: 45,
    active: 60,
  };

  // Healthy fats
  const fatGoal = Math.round((calorieGoal * 0.3) / 9);

  return {
    calories: Math.round(calorieGoal),
    protein: proteinGoal,
    fibre: fibreGoal,
    water: Math.round(waterGoal * 10) / 10,
    sleep: sleepGoal,
    steps: stepsGoals[activityLevel] || 8000,
    exercise: exerciseGoals[activityLevel] || 30,
    fats: fatGoal,
    calculatedAt: new Date().toISOString(),
  };
}

export function getTargetExplanations(targets, userData) {
  return {
    calories: `Based on your weight, height, and activity level, your body needs approximately ${targets.calories} calories daily to ${userData.goal === 'lose' ? 'reach your goal weight' : 'maintain your energy'}.`,
    protein: `Your protein goal is ${targets.protein}g per day. For PMOS, higher protein intake helps improve insulin sensitivity and keeps you fuller longer.`,
    fibre: `Your fibre goal is ${targets.fibre}g per day. Higher fibre intake is especially important for PMOS — it helps reduce androgen levels and supports hormonal balance.`,
    water: `Drink ${targets.water} litres of water daily. Your body needs more hydration to support metabolism and flush out excess hormones.`,
    sleep: `Aim for ${targets.sleep} hours of sleep. Sleep deprivation worsens insulin resistance in PMOS — this is one of the most important targets.`,
    steps: `Your daily steps goal is ${targets.steps.toLocaleString()}. Regular movement throughout the day helps manage insulin levels better than a single workout.`,
    exercise: `${targets.exercise} minutes of intentional movement daily. Focus on strength training and walking — both are particularly beneficial for PMOS.`,
    fats: `${targets.fats}g of healthy fats daily from sources like nuts, avocado, and ghee. Healthy fats support hormone production.`,
  };
}