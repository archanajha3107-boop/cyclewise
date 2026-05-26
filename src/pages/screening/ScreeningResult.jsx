import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BAND_COLORS = {
  1: 'bg-sage text-white',
  2: 'bg-amber text-white',
  3: 'bg-terra text-white',
  4: 'bg-danger text-white',
  5: 'bg-danger text-white',
};

const MESSAGES = {
  1: {
    headline: "Your responses suggest a low risk of PMOS right now.",
    explanation: "You don't currently show many of the common indicators of PMOS. It's still worth knowing what PMOS is — awareness is the best early defence.",
    nextStep: "Keep tracking your cycle and note any changes. If your periods become irregular or you notice new symptoms, revisit this screening.",
  },
  2: {
    headline: "Your responses suggest some indicators worth paying attention to.",
    explanation: "You show a few patterns sometimes associated with PMOS. This doesn't mean you have it — but it's worth monitoring.",
    nextStep: "Download CycleWise to track your symptoms over the next few months. If patterns continue, mention them to a doctor.",
  },
  3: {
    headline: "Your responses suggest several indicators commonly associated with PMOS.",
    explanation: "Multiple symptoms you reported are consistent with PMOS. Only a doctor can confirm. You are not alone — PMOS affects 1 in 8 women in India.",
    nextStep: "We strongly recommend booking an appointment with a gynaecologist. Download CycleWise to track symptoms in the meantime.",
  },
  4: {
    headline: "Your responses show strong indicators of PMOS. Please see a doctor soon.",
    explanation: "Several of your answers align closely with known PMOS patterns. Early management makes a real difference.",
    nextStep: "Please share this result with a parent or trusted adult and book a gynaecologist appointment.",
  },
  5: {
    headline: "Your responses suggest very strong PMOS indicators. Please see a doctor as soon as possible.",
    explanation: "Your answers show multiple strong indicators across different categories. Early diagnosis and management can prevent long-term complications.",
    nextStep: "Show this result to a parent today and book a gynaecologist appointment this week. You can do this.",
  },
};

export default function ScreeningResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    navigate('/screening');
    return null;
  }

  const message = MESSAGES[result.band];
  const bandColor = BAND_COLORS[result.band];

  return (
    <div className="screen pb-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🌙</span>
        <span className="font-playfair font-bold text-mauve text-lg">
          CycleWise
        </span>
      </div>

      <p className="text-muted-rose text-sm mb-4">
        Your screening result
      </p>

      {/* Score Circle */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full border-4 border-mauve flex flex-col items-center justify-center mb-3">
          <span className="font-playfair text-3xl font-bold text-charcoal">
            {result.score}
          </span>
          <span className="text-xs text-muted-rose">out of 100</span>
        </div>
        <span className={`px-4 py-1.5 rounded-pill text-sm font-medium ${bandColor}`}>
          {result.bandDisplay}
        </span>
      </div>

      {/* Explanation */}
      <div className="card mb-4">
        <p className="text-charcoal font-medium text-sm mb-2">
          What this means
        </p>
        <p className="font-playfair text-charcoal text-base leading-snug mb-2">
          {message.headline}
        </p>
        <p className="text-muted-rose text-sm leading-relaxed">
          {message.explanation}
        </p>
      </div>

      {/* Next Steps */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => navigate('/screening')}
          className="w-full bg-mauve text-white rounded-2xl p-4 text-left"
        >
          <p className="font-medium text-sm">1. See a gynaecologist</p>
          <p className="text-white/70 text-xs mt-0.5">Show them this result</p>
        </button>

        <button
          onClick={() => navigate('/home')}
          className="w-full bg-sage text-white rounded-2xl p-4 text-left"
        >
          <p className="font-medium text-sm">2. Download CycleWise</p>
          <p className="text-white/70 text-xs mt-0.5">Track and manage your health daily</p>
        </button>

        <div className="card border border-terra">
          <p className="text-charcoal font-medium text-sm">
            3. Next step
          </p>
          <p className="text-muted-rose text-sm mt-1 leading-relaxed">
            {message.nextStep}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-rose text-center">
        This is a screening tool, not a diagnosis.
        Only a doctor can diagnose PMOS.
      </p>
    </div>
  );
}