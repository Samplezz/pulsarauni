'use client';
import { useState, useEffect } from 'react';
import { LIME, LIME_BTN, GHOST_BTN } from '@/lib/constants';

const TOUR_STEPS = [
  {
    title: 'Welcome to Pulsara',
    desc: 'The anonymous, student-verified hub for your university. Let\'s take a quick tour of what you can do here.',
    icon: '🚀'
  },
  {
    title: 'The Feed',
    desc: 'See all upcoming exams, assignments, and quizzes. Upvote events to verify them—once an event gets 5 upvotes, it becomes "Student Verified"!',
    icon: '▦'
  },
  {
    title: 'The Calendar & Finals',
    desc: 'A bird\'s-eye view of your semester. Check the Calendar for monthly events or the Finals tab for your end-of-term schedule.',
    icon: '🗓'
  },
  {
    title: 'Forums & Direct Messages',
    desc: 'Discuss courses anonymously in the Forums. Click on any username to Tag them or send them a private Direct Message.',
    icon: '💬'
  },
  {
    title: 'Found a Bug?',
    desc: 'If you encounter an issue or see incorrect info, click the "Report Bug 🐛" button at the bottom of the sidebar. We fix things fast!',
    icon: '🐞'
  }
];

export default function GuidedTour({ onComplete }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if tour was already completed
    const hasSeen = localStorage.getItem('pulsara_tour_seen');
    if (!hasSeen) {
      setVisible(true);
    }
  }, []);

  function handleComplete() {
    localStorage.setItem('pulsara_tour_seen', 'true');
    setVisible(false);
    if (onComplete) onComplete();
  }

  function next() {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1);
    else handleComplete();
  }

  if (!visible) return null;

  const current = TOUR_STEPS[step];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', animation: 'fadeIn .3s ease' }}>
      <div style={{ background: 'var(--s1)', border: `1px solid ${LIME}44`, borderRadius: 16, width: '100%', maxWidth: 420, padding: '36px 32px', position: 'relative', animation: 'popIn .3s ease', textAlign: 'center', boxShadow: `0 16px 48px rgba(0,0,0,.6), 0 0 0 1px ${LIME}22` }}>
        
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{ height: 4, flex: 1, maxWidth: 32, borderRadius: 2, background: i <= step ? LIME : 'var(--s3)', transition: 'background .3s' }} />
          ))}
        </div>

        <div style={{ fontSize: 54, marginBottom: 16, animation: 'slideUp .3s ease' }} key={`icon-${step}`}>
          {current.icon}
        </div>
        
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400, marginBottom: 12, animation: 'slideUp .3s ease .05s both' }} key={`title-${step}`}>
          {current.title}
        </h2>
        
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 32, minHeight: 66, animation: 'slideUp .3s ease .1s both' }} key={`desc-${step}`}>
          {current.desc}
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{ ...GHOST_BTN, flex: 1 }}>← Back</button>
          )}
          <button onClick={next} style={{ ...LIME_BTN, flex: 2 }}>
            {step === TOUR_STEPS.length - 1 ? 'LET\'S GO 🚀' : 'NEXT →'}
          </button>
        </div>
        
        <button onClick={handleComplete} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--muted2)', fontSize: 20, cursor: 'pointer', padding: 8 }}>✕</button>
      </div>
    </div>
  );
}
