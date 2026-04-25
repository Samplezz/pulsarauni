'use client';
import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  // phase 0: P slides up (0-800ms)
  // phase 1: "ulsara" fades in (800-1600ms)
  // phase 2: hold + fade out (1600-2400ms)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onComplete?.(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#1a1714',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: phase === 2 ? 0 : 1,
      transition: 'opacity 0.8s ease',
      pointerEvents: phase === 2 ? 'none' : 'auto',
    }}>
      {/* Subtle warm radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,122,90,.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(48px, 10vw, 96px)',
        fontWeight: 400,
        letterSpacing: '-0.03em',
        color: '#f0ebe1',
        userSelect: 'none',
        position: 'relative',
      }}>
        {/* The P character — slides up from below */}
        <span style={{
          display: 'inline-block',
          transform: phase >= 0 ? 'translateY(0)' : 'translateY(100vh)',
          animation: 'loadP 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}>P</span>

        {/* "ulsara" — fades in after P arrives */}
        <span style={{
          display: 'inline-block',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateX(0)' : 'translateX(-8px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>ulsara</span>
      </div>

      {/* Loading dot indicator below the text */}
      <div style={{
        position: 'absolute',
        bottom: '18%',
        display: 'flex',
        gap: 6,
        opacity: phase < 2 ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#c47a5a',
            animation: `loadDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes loadP {
          0% { transform: translateY(80px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes loadDot {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
