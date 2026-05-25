export default function calculateScore(userData) {

  let score = 0;

  if (userData.irregularPeriods) {
    score += 3;
  }

  if (userData.weightGain) {
    score += 2;
  }

  if (userData.hairFall) {
    score += 2;
  }

  if (userData.acne) {
    score += 2;
  }

  if (userData.pcosHistory === 'yes') {
    score += 3;
  }

  if (userData.diabetes === 'yes') {
    score += 2;
  }

  if (userData.severePain === 'yes') {
    score += 1;
  }

  return score;

}