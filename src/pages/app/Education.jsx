import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const ARTICLES = [
  {
    id: 1,
    title: 'What is PMOS?',
    subtitle: 'Start here if you are newly diagnosed',
    readTime: '5 min',
    category: 'PMOS Basics',
    color: 'bg-mauve',
    featured: true,
    content: `PMOS — Polyendocrine Metabolic Ovarian Syndrome — was officially renamed from PCOS in May 2026. It is one of the most common hormonal conditions in the world, affecting approximately 1 in 8 women.\n\nDespite being so common, most women go years without a diagnosis. PMOS is not just about ovarian cysts. It affects your hormones, your metabolism, your mood, your skin, your energy — your whole body.\n\nThe most common symptoms include irregular periods, excess hair growth, acne, scalp hair thinning, and difficulty managing weight. But many women also experience anxiety, depression, fatigue, and mood swings that are directly linked to the hormonal imbalances PMOS causes.\n\nThe important thing to know: PMOS is manageable. With the right support — medical, nutritional, emotional — most women lead full, healthy lives. You are not broken. Your body is working differently, and that difference has a name.`,
  },
  {
    id: 2,
    title: 'Why do I feel so emotional before my period?',
    subtitle: 'The real connection between PMOS and mood',
    readTime: '4 min',
    category: 'PMOS & Mental Health',
    color: 'border-mauve',
    featured: false,
    content: `If you have ever cried over something small and thought "why am I like this" — this is for you.\n\nThe emotional intensity you feel before your period is not weakness or overreaction. It is your nervous system responding to hormonal changes that are significantly stronger in people with PMOS than in those without it.\n\nResearch confirms that women with PMOS have a 2.5 times higher probability of depression compared to women without it. This is not about being emotionally fragile. This is biology.\n\nYour feelings are real. The hormones make them louder. Both things are true at the same time.\n\nWhat helps: tracking your cycle and emotions together (the daily check-in in this app is designed for exactly this), gentle movement, reducing caffeine in the week before your period, and — most importantly — giving yourself permission to feel what you feel without judgment.`,
  },
  {
    id: 3,
    title: 'Indian foods that help manage PMOS',
    subtitle: 'Your kitchen already has what you need',
    readTime: '6 min',
    category: 'Food & Nutrition',
    color: 'border-sage',
    featured: false,
    content: `Most PMOS nutrition advice online is written for Western diets. Avocado toast and quinoa bowls are not the reality for most Indian women.\n\nThe good news: Indian food is naturally rich in PMOS-friendly ingredients.\n\nMethi (fenugreek): One of the most studied foods for PMOS. It helps regulate blood sugar and supports hormonal balance. Methi paratha, methi dal, methi in sabzi — all excellent.\n\nRajma and dal: High protein, high fibre, low glycemic index. Exactly what PMOS management requires.\n\nHaldi (turmeric): Anti-inflammatory properties that help with the underlying inflammation PMOS causes. A small amount daily — in chai, in sabzi, in warm milk — adds up.\n\nAmla (Indian gooseberry): High in Vitamin C, supports hormonal health. Fresh or as juice.\n\nWhat to reduce: refined sugar, maida, processed foods, and excessive dairy (dairy can worsen hormonal acne in some women with PMOS — notice if this is true for you).\n\nThe principle is simple: low glycemic index, high fibre, anti-inflammatory. Indian food does this naturally when you cook at home.`,
  },
  {
    id: 4,
    title: 'Explaining PMOS to your family',
    subtitle: 'Words that help them understand',
    readTime: '3 min',
    category: 'Family & Relationships',
    color: 'border-terra',
    featured: false,
    content: `One of the hardest parts of PMOS is explaining it to people who have never heard of it — especially family members who might dismiss it as "kuch nahi hai" or attribute your symptoms to stress or laziness.\n\nHere is a simple way to explain it:\n\n"PMOS is a hormonal condition that affects how my body regulates certain hormones. It causes irregular periods, and it also affects my mood, energy, and skin. It is not caused by anything I did. It is not something I can just push through. And it is very common — 1 in 8 women have it."\n\nFor parents specifically: the most important thing they can do is support you in seeing a gynaecologist and not dismiss your symptoms. Show them the screening report from this app if you completed it. Data helps.\n\nFor friends: you do not owe anyone a full explanation. "I have a hormonal condition that affects my energy and mood sometimes" is enough. The right people will understand. The ones who do not were never really listening.`,
  },
  {
    id: 5,
    title: 'A guide for parents',
    subtitle: 'Understanding your daughter\'s diagnosis',
    readTime: '5 min',
    category: 'For Families',
    color: 'border-mauve',
    featured: false,
    content: `If your daughter has been told she might have PMOS, or has received a high-risk screening result, this is for you.\n\nFirst: do not panic. PMOS is common, manageable, and does not define her future.\n\nWhat PMOS means: it is a hormonal condition that affects the body's ability to regulate certain hormones. This can cause irregular periods, changes in skin and hair, weight fluctuations, and mood changes. It is not caused by anything she did, and it is not her fault.\n\nWhat you can do right now:\n1. Book an appointment with a gynaecologist. Bring the screening report from this app.\n2. Listen without dismissing. Her symptoms are real even when they are invisible.\n3. Avoid comments about her weight or appearance. These worsen the psychological impact of PMOS significantly.\n4. Support her in tracking her symptoms — this app was built for exactly that.\n\nWhat the doctor will likely do: blood tests to check hormone levels, possibly an ultrasound, and a conversation about lifestyle and medication options.\n\nThe earlier PMOS is addressed, the better the long-term outcomes. You taking this seriously is the most important thing you can do.`,
  },
];

export default function Education() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (selectedArticle) {
    return (
      <div className="screen pb-10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-mauve text-lg"
          >
            ←
          </button>
          <p className="text-muted-rose text-sm">Learn</p>
        </div>

        <p className="section-label text-terra mb-1">
          {selectedArticle.category}
        </p>
        <h1 className="font-playfair text-2xl font-bold text-charcoal mb-1 leading-tight">
          {selectedArticle.title}
        </h1>
        <p className="text-muted-rose text-sm mb-4">
          {selectedArticle.readTime} read
        </p>

        <div className="space-y-4">
          {selectedArticle.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-charcoal text-sm leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Pull quote */}
        {selectedArticle.id === 2 && (
          <div className="border-l-2 border-mauve bg-blush rounded-r-xl px-4 py-3 my-4">
            <p className="font-playfair italic text-mauve text-sm leading-relaxed">
              "Your feelings are real. The hormones make them louder.
              Both things are true at the same time."
            </p>
          </div>
        )}
      </div>
    );
  }

  const featured = ARTICLES.find((a) => a.featured);
  const regular = ARTICLES.filter((a) => !a.featured);

  return (
    <div className="screen pb-24">

      <h1 className="page-title mb-1">Learn about PMOS</h1>
      <p className="text-muted-rose text-sm mb-4">
        Real information. No jargon.
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-rose text-sm">
          🔍
        </span>
        <input
          className="w-full bg-blush rounded-xl pl-9 pr-4 py-3 text-charcoal text-sm placeholder-muted-rose focus:outline-none focus:ring-2 focus:ring-mauve"
          placeholder="Search topics..."
        />
      </div>

      {/* Featured */}
      {featured && (
        <button
          onClick={() => setSelectedArticle(featured)}
          className="w-full bg-mauve rounded-2xl p-4 mb-4 text-left"
        >
          <p className="text-white font-playfair text-lg leading-snug mb-1">
            {featured.title}
          </p>
          <p className="text-white/70 text-sm mb-2">
            {featured.subtitle}
          </p>
          <p className="text-white/50 text-xs">
            {featured.readTime} read
          </p>
        </button>
      )}

      {/* Common Questions */}
      <p className="section-label mb-3">Common questions</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {regular.slice(0, 4).map((article) => (
          <button
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className={`card text-left border-l-4 ${article.color}`}
          >
            <p className="text-charcoal text-sm font-medium leading-snug mb-1">
              {article.title}
            </p>
            <p className="text-muted-rose text-xs">
              {article.readTime} read
            </p>
          </button>
        ))}
      </div>

      {/* For Families */}
      <p className="section-label mb-3">For your family</p>
      {regular.slice(4).map((article) => (
        <button
          key={article.id}
          onClick={() => setSelectedArticle(article)}
          className="w-full card text-left mb-2"
        >
          <p className="text-charcoal text-sm font-medium">
            {article.title}
          </p>
          <p className="text-muted-rose text-xs mt-0.5">
            {article.subtitle}
          </p>
        </button>
      ))}

      <Navbar />
    </div>
  );
}