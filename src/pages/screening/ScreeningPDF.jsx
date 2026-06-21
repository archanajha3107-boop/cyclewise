import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ScreeningPDF() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    navigate('/screening');
    return null;
  }

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  function handlePrint() {
    window.print();
  }

  return (
    <div className="screen pb-10">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-mauve text-sm font-medium flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="font-playfair text-lg text-charcoal">Your report</h1>
        <button onClick={handlePrint} className="text-mauve text-sm">
          Share
        </button>
      </div>

      {/* Document preview */}
      <div className="bg-white rounded-2xl p-5 shadow-card mb-4 border border-blush">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blush">
          <div className="text-xl">🌙</div>
          <div>
            <p className="font-playfair font-bold text-mauve text-base">
              CycleWise
            </p>
            <p className="text-muted-rose text-xs">PMOS Screening Report</p>
          </div>
          <p className="ml-auto text-muted-rose text-xs">{today}</p>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-mauve flex flex-col items-center justify-center">
            <span className="font-playfair text-2xl font-bold text-charcoal">
              {result.score}
            </span>
            <span className="text-xs text-muted-rose">/100</span>
          </div>
          <div>
            <p className="text-charcoal font-medium text-sm">
              Risk Assessment Score
            </p>
            <p className="text-muted-rose text-xs">{result.bandDisplay}</p>
          </div>
        </div>

        {/* What this means */}
        <div className="mb-4">
          <p className="text-xs font-medium text-charcoal mb-1 uppercase tracking-wide">
            What this means
          </p>
          <p className="text-muted-rose text-xs leading-relaxed">
            This score is based on your self-reported symptoms and family
            history. It indicates risk indicators associated with PMOS
            and is not a medical diagnosis. A gynaecologist can confirm
            with blood tests and ultrasound.
          </p>
        </div>

        {/* Recommended next step */}
        <div className="bg-blush rounded-xl p-3 mb-4">
          <p className="text-xs font-medium text-charcoal mb-1">
            Recommended next step
          </p>
          <p className="text-muted-rose text-xs leading-relaxed">
            Book an appointment with a gynaecologist and show them this
            report. Ask for a hormone panel including LH, FSH, testosterone,
            AMH, and fasting insulin.
          </p>
        </div>

        {/* Questions for doctor */}
        <div className="mb-4">
          <p className="text-xs font-medium text-charcoal mb-2 uppercase tracking-wide">
            Questions to ask your doctor
          </p>
          {[
            'Do my symptoms suggest PMOS or another hormonal condition?',
            'Should I be tested for insulin resistance?',
            'What lifestyle changes would help most for my profile?',
          ].map((q, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <span className="text-mauve text-xs mt-0.5">•</span>
              <p className="text-muted-rose text-xs leading-relaxed">{q}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-blush my-4" />

        {/* For parents section */}
        <p className="text-xs font-medium text-charcoal mb-2 uppercase tracking-wide">
          For parents
        </p>
        <p className="text-muted-rose text-xs leading-relaxed mb-2">
          PMOS (previously called PCOS) is one of the most common
          hormonal conditions in women, affecting 1 in 8. It is not
          caused by anything your daughter did, and it is not her fault.
        </p>
        <p className="text-muted-rose text-xs leading-relaxed mb-2">
          What you can do: support her in visiting a gynaecologist,
          listen without dismissing her symptoms, and avoid comments
          about her weight or appearance.
        </p>
        <p className="text-muted-rose text-xs leading-relaxed">
          Early diagnosis and lifestyle support significantly improve
          long-term outcomes. This screening result is a starting point,
          not a final answer.
        </p>

        {/* Footer */}
        <div className="border-t border-blush mt-4 pt-3">
          <p className="text-muted-rose text-xs text-center">
            This is a screening tool, not a medical diagnosis.
            CycleWise — cyclewise.in
          </p>
        </div>
      </div>

      {/* Buttons */}
      <button onClick={handlePrint} className="btn-primary mb-3">
        Download / Print PDF
      </button>
      <button
        onClick={() => navigate('/home')}
        className="btn-secondary"
      >
        Download CycleWise — it's free
      </button>
    </div>
  );
}