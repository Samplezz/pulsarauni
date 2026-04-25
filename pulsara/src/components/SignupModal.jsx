'use client';
import { useState, useMemo } from 'react';
import { LIME, EXAM_C, SUGGESTIONS, LBL, INP, LIME_BTN, GHOST_BTN } from '@/lib/constants';
import { saveUser } from '@/lib/storage';
import PulseDot from '@/components/atoms/PulseDot';

export default function SignupModal({ onComplete }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const suggested = useMemo(() => [...SUGGESTIONS].sort(() => Math.random() - .5).slice(0, 5), []);

  const [verifyCode, setVerifyCode] = useState('');

  function doShake() { setShake(true); setTimeout(() => setShake(false), 400); }

  function step1(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email.'); doShake(); return; }
    setError(''); setStep(2);
  }

  function step2(e) {
    e.preventDefault();
    if (verifyCode.trim().length < 4) { setError('Enter a valid 4-digit code.'); doShake(); return; }
    setError(''); setStep(3);
  }

  function step3(e) {
    e.preventDefault();
    const u = usernameInput.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(u)) { setError('3–20 chars, lowercase letters, numbers, underscores only.'); doShake(); return; }
    const user = { email, username: u, joinedAt: Date.now() };
    saveUser(user);
    onComplete(user);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,23,20,.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', animation: 'fadeIn .2s ease' }}>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '34px 30px', width: '100%', maxWidth: 400, animation: 'popIn .3s ease', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,.12)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 26 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 19 }}>Pulsara</span>
          <PulseDot />
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 22 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ height: 2, flex: 1, borderRadius: 2, background: step >= n ? LIME : 'var(--border)', transition: 'background .3s' }} />
          ))}
        </div>

        {/* Step 1 — Email */}
        {step === 1 && (
          <div style={{ animation: 'fadeUp .25s ease' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400, marginBottom: 5 }}>Join the waitlist</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 22, lineHeight: 1.6 }}>Enter your university email to get access when Pulsara opens for your faculty.</p>
            <form onSubmit={step1} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div>
                <label style={LBL}>University email</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="yourname@university.edu" autoFocus style={{ ...INP, animation: shake ? 'shake .35s ease' : '' }} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                {error && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: EXAM_C, marginTop: 5 }}>{error}</div>}
              </div>
              <button type="submit" style={LIME_BTN}>CONTINUE →</button>
            </form>
          </div>
        )}

        {/* Step 2 — Verify Code */}
        {step === 2 && (
          <div style={{ animation: 'fadeUp .25s ease' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400, marginBottom: 5 }}>Verify your email</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 22, lineHeight: 1.6 }}>We sent a verification code to <span style={{ color: 'var(--text)', fontWeight: 600 }}>{email}</span>.</p>
            <form onSubmit={step2} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div>
                <label style={LBL}>Verification code (Demo: Enter 1234)</label>
                <input type="text" value={verifyCode} onChange={e => { setVerifyCode(e.target.value); setError(''); }} placeholder="0000" maxLength={6} autoFocus style={{ ...INP, fontFamily: 'var(--mono)', fontSize: 20, letterSpacing: '.2em', textAlign: 'center', animation: shake ? 'shake .35s ease' : '' }} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                {error && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: EXAM_C, marginTop: 5, textAlign: 'center' }}>{error}</div>}
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button type="button" onClick={() => setStep(1)} style={{ ...GHOST_BTN, padding: '10px 14px' }}>← Back</button>
                <button type="submit" style={{ ...LIME_BTN, flex: 1 }}>VERIFY →</button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3 — Username */}
        {step === 3 && (
          <div style={{ animation: 'fadeUp .25s ease' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400, marginBottom: 5 }}>Choose your identity</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18, lineHeight: 1.6 }}>You&apos;ll post anonymously under this codename. No one will know your real name.</p>

            {/* Identity preview */}
            <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 16 }}>👻</span>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.07em', marginBottom: 2 }}>YOUR IDENTITY</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 14, color: usernameInput ? LIME : 'var(--border2)', fontWeight: 700, transition: 'color .2s' }}>@{usernameInput || '_'}</div>
              </div>
            </div>

            {/* Quick picks */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.07em', marginBottom: 7 }}>QUICK PICKS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {suggested.map(s => (
                  <button key={s} type="button" onClick={() => { setUsernameInput(s); setError(''); }} style={{
                    fontFamily: 'var(--mono)', fontSize: 10, padding: '4px 9px', borderRadius: 6, cursor: 'pointer',
                    background: usernameInput === s ? 'rgba(26,26,26,.08)' : 'var(--s2)',
                    border: `1px solid ${usernameInput === s ? '#1a1a1a55' : 'var(--border)'}`,
                    color: usernameInput === s ? '#1a1a1a' : 'var(--muted2)', transition: 'all .15s',
                  }}>@{s}</button>
                ))}
              </div>
            </div>

            <form onSubmit={step3} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div>
                <label style={LBL}>Or type your own</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', pointerEvents: 'none' }}>@</span>
                  <input value={usernameInput} onChange={e => { setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); setError(''); }} placeholder="your_codename" maxLength={20} style={{ ...INP, paddingLeft: 26, animation: shake ? 'shake .35s ease' : '' }} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>lowercase · numbers · underscores · 3–20 chars</div>
                {error && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: EXAM_C, marginTop: 4 }}>{error}</div>}
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button type="button" onClick={() => setStep(2)} style={{ ...GHOST_BTN, padding: '10px 14px' }}>← Back</button>
                <button type="submit" style={{ ...LIME_BTN, flex: 1 }}>ENTER PULSARA →</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
