'use client';
import { useState } from 'react';
import { EXAM_C, TYPE_CFG, GHOST_BTN, LBL, INP, LIME_BTN, CLASSROOM_CODE } from '@/lib/constants';
import { addToWaitlist } from '@/lib/storage';
import { useLanguage } from '@/lib/i18n';
import PulseDot from '@/components/atoms/PulseDot';
import WhatsAppMock from '@/components/WhatsAppMock';
import Badge from '@/components/atoms/Badge';

/* ─── LANDING PAGE PALETTE (cream + lavender) ─── */
const CREAM = '#f0ebe1';
const CREAM_DARK = '#e8e2d6';
const LAVENDER = '#9b8fc2';
const LAVENDER_HOVER = '#8a7db5';
const INK = '#1a1a1a';
const MUTED_L = '#777';
const BORDER_L = '#d4cfc6';

/* ─── CLASSROOM CODE MODAL ───────────────────────── */
function CodeModal({ onSuccess, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const { t } = useLanguage();

  function handleSubmit(e) {
    e.preventDefault();
    if (code.trim().toUpperCase() === CLASSROOM_CODE) {
      onSuccess();
    } else {
      setError(t('code_modal_invalid'));
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', animation: 'fadeIn .2s ease' }}>
      <div style={{ background: '#fff', border: `1px solid ${BORDER_L}`, borderRadius: 16, padding: '34px 30px', width: '100%', maxWidth: 400, animation: 'popIn .3s ease', position: 'relative', color: INK }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 19, color: INK }}>Pulsara</span>
          <PulseDot />
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: 'none', border: `1px solid ${BORDER_L}`, borderRadius: 6, width: 28, height: 28, color: MUTED_L, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>✕</button>
        </div>

        <div style={{ fontSize: 28, marginBottom: 8 }}>🔑</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400, marginBottom: 5, color: INK }}>{t('code_modal_h')}</h2>
        <p style={{ fontSize: 13, color: MUTED_L, marginBottom: 22, lineHeight: 1.6 }}>{t('code_modal_p')}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div>
            <label style={LBL}>{t('code_modal_label')}</label>
            <input
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
              placeholder="XXX-XX-XXX"
              autoFocus
              style={{
                ...INP, background: '#fff', border: `1px solid ${BORDER_L}`, color: INK,
                fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700,
                letterSpacing: '.12em', textAlign: 'center',
                animation: shake ? 'shake .35s ease' : '',
              }}
              onFocus={e => e.target.style.borderColor = LAVENDER}
              onBlur={e => e.target.style.borderColor = BORDER_L}
            />
            {error && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: EXAM_C, marginTop: 5, textAlign: 'center' }}>{error}</div>}
          </div>
          <button type="submit" style={{ ...LIME_BTN, background: LAVENDER, color: '#fff' }}>{t('code_btn')}</button>
        </form>
      </div>
    </div>
  );
}

/* ─── LANDING PAGE ───────────────────────────────── */
export default function LandingPage({ onEnterApp, onSignup }) {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [footerPage, setFooterPage] = useState(null); // 'about' | 'privacy' | 'terms' | null
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  const tickerItems = ['EXAM', 'QUIZ', 'ASSIGNMENT'];
  // Create a massive array so it fills any screen size
  const ticker = Array(30).fill(tickerItems).flat();

  async function handleEmailSubmit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email.');
      return;
    }
    setEmailLoading(true);
    try {
      const ok = await addToWaitlist(email);
      if (ok) { setEmailSubmitted(true); setEmailError(''); }
      else { setEmailError('Something went wrong. Try again.'); }
    } catch {
      setEmailError('Something went wrong. Try again.');
    } finally {
      setEmailLoading(false);
    }
  }

  function handleCodeSuccess() {
    setShowCodeModal(false);
    onSignup();
  }

  return (
    <div style={{ minHeight: '100vh', background: CREAM, color: INK, overflowX: 'hidden' }}>
      {/* Code modal */}
      {showCodeModal && <CodeModal onSuccess={handleCodeSuccess} onClose={() => setShowCodeModal(false)} />}


      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: `1px solid ${BORDER_L}`, position: 'sticky', top: 0, background: 'rgba(240,235,225,.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 20, letterSpacing: '-.04em', lineHeight: 1, display: 'block', color: INK }}>{t('auth_title')}</span>
          <PulseDot />
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <button disabled style={{ ...GHOST_BTN, borderColor: BORDER_L, color: '#aaa', padding: '7px 14px', cursor: 'default', opacity: 0.7, fontSize: 10 }} title="Arabic language update will arrive soon">
            عربي — coming soon
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '72px 40px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div style={{ animation: 'fadeUp .7s ease both' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: LAVENDER, letterSpacing: '.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <PulseDot /> {t('landing_badge')}
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 64, lineHeight: 1.0, letterSpacing: '-.03em', marginBottom: 20, fontWeight: 400, color: INK }}>
            {t('landing_h1_1')}<br /><em style={{ color: INK, fontStyle: 'italic' }}>{t('landing_h1_2')}</em>
          </h1>
          <p style={{ fontSize: 15, color: MUTED_L, lineHeight: 1.75, maxWidth: 420, marginBottom: 28, fontWeight: 300 }}>
            {t('landing_desc')}
          </p>

          {/* Notification signup */}
          {emailSubmitted ? (
            <div style={{ animation: 'fadeUp .3s ease', background: 'rgba(155,143,194,.08)', border: `1px solid ${LAVENDER}33`, borderRadius: 10, padding: '16px 20px', maxWidth: 420 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: LAVENDER, fontWeight: 700 }}>{t('landing_success_title')}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED_L, lineHeight: 1.5 }}>{t('landing_success_desc')}</div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 8, maxWidth: 420, marginBottom: 14 }}>
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                placeholder="your@university.email"
                style={{ ...INP, flex: 1, background: '#fff', border: `1px solid ${BORDER_L}`, color: INK, colorScheme: 'light' }}
                onFocus={e => e.target.style.borderColor = LAVENDER}
                onBlur={e => e.target.style.borderColor = BORDER_L}
              />
              <button type="submit" disabled={emailLoading} style={{
                background: LAVENDER, color: '#fff', border: 'none', borderRadius: 8,
                padding: '10px 18px', fontFamily: 'var(--mono)', fontSize: 10,
                fontWeight: 700, letterSpacing: '.07em', cursor: emailLoading ? 'default' : 'pointer',
                transition: 'all .15s', whiteSpace: 'nowrap', flexShrink: 0,
                opacity: emailLoading ? .7 : 1,
              }}
                onMouseEnter={e => { if (!emailLoading) e.currentTarget.style.background = LAVENDER_HOVER; }}
                onMouseLeave={e => e.currentTarget.style.background = LAVENDER}
              >{emailLoading ? '…' : t('landing_notify_me')}</button>
            </form>
          )}
          {emailError && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: EXAM_C, marginBottom: 8 }}>{emailError}</div>}
          {!emailSubmitted && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: MUTED_L, marginBottom: 16 }}>{t('landing_notify_update')}</div>}

          {/* Classroom code CTA — big button */}
          <button
            onClick={() => setShowCodeModal(true)}
            style={{
              background: INK, color: CREAM, border: 'none',
              borderRadius: 10, padding: '15px 28px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all .2s', width: '100%', maxWidth: 420,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = INK; e.currentTarget.style.transform = ''; }}>
            <span style={{ fontSize: 15 }}>🔑</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, letterSpacing: '.06em' }}>{t('landing_code_cta')}</span>
          </button>
        </div>
        <div style={{ animation: 'fadeUp .7s ease .15s both', position: 'relative' }}>
          <WhatsAppMock lang={lang} t={t} />
        </div>
      </section>

      {/* Marquee — seamless infinite loop */}
      <div style={{ overflow: 'hidden', borderTop: `1px solid ${BORDER_L}`, borderBottom: `1px solid ${BORDER_L}`, padding: '9px 0', background: CREAM_DARK, margin: '56px 0' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 40s linear infinite' }}>
          {[0, 1].map(set => (
            <div key={set} style={{ display: 'flex', gap: 18, paddingRight: 18, flexShrink: 0 }}>
              {['EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT'].map((item, i) => {
                const c = TYPE_CFG[item];
                // Override QUIZ color for visibility on cream bg
                const color = item === 'QUIZ' ? '#2d8a6e' : c.color;
                const bg = item === 'QUIZ' ? 'rgba(45,138,110,.12)' : c.bg;
                return <span key={`${set}-${i}`} style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color, padding: '2px 10px', borderRadius: 4, background: bg, whiteSpace: 'nowrap' }}>{c.label}</span>;
              })}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section style={{ padding: '0 40px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: MUTED_L, letterSpacing: '.1em', marginBottom: 24 }}>{t('landing_how_title')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 1, border: `1px solid ${BORDER_L}`, borderRadius: 12, overflow: 'hidden' }}>
          {[
            { n: '01', tk: 'landing_step1', },
            { n: '02', tk: 'landing_step2', },
            { n: '03', tk: 'landing_step3', },
          ].map((s, i) => (
            <div key={i} style={{ padding: '26px 22px', background: '#fff', borderRight: i < 2 ? `1px solid ${BORDER_L}` : 'none' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 32, color: BORDER_L, fontWeight: 700, marginBottom: 9, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 400, marginBottom: 7, color: INK }}>{t(s.tk + '_title')}</div>
              <div style={{ fontSize: 13, color: MUTED_L, lineHeight: 1.65 }}>{t(s.tk + '_desc')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 40px 60px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 40, fontWeight: 400, lineHeight: 1.1, marginBottom: 14, color: INK }}>
          {t('landing_cta_h1')}<br />{t('landing_cta_h2')}<br /><em style={{ color: LAVENDER }}>{t('landing_cta_h3')}</em>
        </div>
        <p style={{ fontSize: 13, color: MUTED_L, marginBottom: 26, lineHeight: 1.7 }}>{t('landing_cta_p')}</p>
        <button
          onClick={() => setShowCodeModal(true)}
          style={{ background: LAVENDER, color: '#fff', border: 'none', borderRadius: 8, padding: '13px 30px', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', cursor: 'pointer', transition: 'all .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = LAVENDER_HOVER; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(155,143,194,.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = LAVENDER; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >{t('landing_cta_btn')}</button>
      </section>

      {/* ── REDESIGNED FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${BORDER_L}` }}>
        {/* Navigation columns + copyright */}
        <div style={{
          background: '#e8e2d6',
          padding: '64px 60px 48px',
          color: '#1a1a1a',
        }}>
          {/* Description */}
          <p style={{
            fontSize: 15,
            color: '#4a4a4a',
            fontFamily: 'var(--sans)',
            lineHeight: 1.7,
            maxWidth: 520,
            marginBottom: 28,
          }}>
            Pulsara is a student-built platform designed to help university students stay on top of exams, quizzes, and assignments — so nothing slips through the cracks of chaotic group chats.
          </p>

          {/* Links row */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'About', page: 'about' },
              { label: 'Privacy', page: 'privacy' },
              { label: 'Terms', page: 'terms' },
            ].map(({ label, page }) => (
              <div key={page} style={{
                fontSize: 14,
                color: '#3a3a3a',
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                transition: 'color .15s',
                textDecoration: 'underline',
                textDecorationColor: '#d4cfc6',
                textUnderlineOffset: 3,
              }}
                onClick={() => setFooterPage(page)}
                onMouseEnter={e => { e.currentTarget.style.color = '#000'; e.currentTarget.style.textDecorationColor = '#000'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#3a3a3a'; e.currentTarget.style.textDecorationColor = '#d4cfc6'; }}
              >{label}</div>
            ))}
          </div>

          {/* Copyright */}
          <div style={{
            fontSize: 13,
            color: '#5a5a5a',
            fontFamily: 'var(--sans)',
          }}>{t('footer_copy')}</div>
        </div>

        {/* Giant PULSARA wordmark with doodles */}
        <div style={{
          background: '#e8e2d6',
          position: 'relative',
          overflow: 'hidden',
          padding: '50px 0 0',
        }}>
          {/* Doodle SVGs scattered around */}
          {/* Alarm clock — top left */}
          <svg viewBox="0 0 48 48" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '12%', left: '3%', width: 38, height: 38, opacity: 0.7, transform: 'rotate(-15deg)' }}>
            <circle cx="24" cy="26" r="14" />
            <line x1="24" y1="18" x2="24" y2="26" />
            <line x1="24" y1="26" x2="30" y2="26" />
            <line x1="10" y1="12" x2="16" y2="16" />
            <line x1="38" y1="12" x2="32" y2="16" />
            <line x1="24" y1="8" x2="24" y2="12" />
          </svg>

          {/* Pen — left side */}
          <svg viewBox="0 0 48 48" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', bottom: '30%', left: '1%', width: 34, height: 34, opacity: 0.6, transform: 'rotate(25deg)' }}>
            <line x1="8" y1="40" x2="38" y2="10" />
            <polyline points="34,6 42,14 38,10" />
            <line x1="8" y1="40" x2="12" y2="36" />
          </svg>

          {/* Graduation cap — top center-left */}
          <svg viewBox="0 0 52 52" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '8%', left: '35%', width: 36, height: 36, opacity: 0.6, transform: 'rotate(5deg)' }}>
            <polygon points="26,8 4,20 26,32 48,20" />
            <polyline points="40,24 40,38 26,44 12,38 12,24" />
            <line x1="4" y1="20" x2="4" y2="34" />
          </svg>

          {/* Clock / stopwatch — top center-right */}
          <svg viewBox="0 0 40 40" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '5%', left: '48%', width: 32, height: 32, opacity: 0.65, transform: 'rotate(-8deg)' }}>
            <circle cx="20" cy="22" r="13" />
            <line x1="20" y1="14" x2="20" y2="22" />
            <line x1="20" y1="22" x2="26" y2="18" />
            <line x1="17" y1="6" x2="23" y2="6" />
            <line x1="20" y1="6" x2="20" y2="9" />
          </svg>

          {/* Paper airplane — top right */}
          <svg viewBox="0 0 48 48" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '10%', right: '8%', width: 36, height: 36, opacity: 0.65, transform: 'rotate(15deg)' }}>
            <path d="M6 24 L42 8 L30 42 L22 28 Z" />
            <line x1="42" y1="8" x2="22" y2="28" />
          </svg>

          {/* Ruler — right side */}
          <svg viewBox="0 0 48 48" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '2%', right: '2%', width: 32, height: 32, opacity: 0.55, transform: 'rotate(-30deg)' }}>
            <rect x="8" y="16" width="32" height="12" rx="2" />
            <line x1="14" y1="16" x2="14" y2="22" />
            <line x1="20" y1="16" x2="20" y2="24" />
            <line x1="26" y1="16" x2="26" y2="22" />
            <line x1="32" y1="16" x2="32" y2="24" />
          </svg>

          {/* Quiz / checklist — right side lower */}
          <svg viewBox="0 0 44 44" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', bottom: '20%', right: '4%', width: 36, height: 36, opacity: 0.6, transform: 'rotate(8deg)' }}>
            <rect x="8" y="4" width="28" height="36" rx="3" />
            <line x1="14" y1="14" x2="30" y2="14" />
            <line x1="14" y1="22" x2="30" y2="22" />
            <line x1="14" y1="30" x2="24" y2="30" />
            <polyline points="11,13 12.5,14.5 15,12" />
            <polyline points="11,21 12.5,22.5 15,20" />
          </svg>

          {/* Book — bottom left */}
          <svg viewBox="0 0 48 48" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', bottom: '10%', left: '6%', width: 32, height: 32, opacity: 0.55, transform: 'rotate(-10deg)' }}>
            <path d="M8 6 C8 6 16 4 24 10 C32 4 40 6 40 6 L40 38 C40 38 32 36 24 42 C16 36 8 38 8 38 Z" />
            <line x1="24" y1="10" x2="24" y2="42" />
          </svg>

          {/* Star — center-top between doodles */}
          <svg viewBox="0 0 32 32" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '18%', left: '22%', width: 22, height: 22, opacity: 0.5 }}>
            <polygon points="16,2 20,12 30,12 22,19 25,30 16,23 7,30 10,19 2,12 12,12" />
          </svg>

          {/* Lightning bolt — right center */}
          <svg viewBox="0 0 32 32" fill="none" stroke="#9b8fc2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '15%', right: '18%', width: 24, height: 24, opacity: 0.5, transform: 'rotate(10deg)' }}>
            <polyline points="18,2 8,18 16,18 14,30 24,14 16,14" />
          </svg>

          {/* The giant PULSARA text */}
          <div style={{
            fontFamily: "'Inter', 'Helvetica Neue', Arial, var(--sans)",
            fontWeight: 900,
            fontSize: 'clamp(100px, 20vw, 280px)',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: '#1a1a1a',
            userSelect: 'none',
            textAlign: 'center',
            padding: '0 20px 0',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            marginBottom: '-0.06em',
          }}>PULSARA</div>
        </div>
      </footer>

      {/* ── FOOTER PAGE MODALS ── */}
      {footerPage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,23,20,.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', animation: 'fadeIn .2s ease' }} onClick={() => setFooterPage(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 560, maxHeight: '80vh', overflowY: 'auto', animation: 'popIn .3s ease', boxShadow: '0 20px 60px rgba(0,0,0,.12)', border: '1px solid #d4cfc6' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400, color: '#1a1a1a' }}>
                {footerPage === 'about' && 'About Pulsara'}
                {footerPage === 'privacy' && 'Privacy Policy'}
                {footerPage === 'terms' && 'Terms of Service'}
              </h2>
              <button onClick={() => setFooterPage(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999', padding: '4px 8px' }}>✕</button>
            </div>

            {footerPage === 'about' && (
              <div style={{ fontSize: 14, color: '#3a3a3a', lineHeight: 1.8 }}>
                <p style={{ marginBottom: 16 }}>
                  <strong>Pulsara</strong> is a small student-made project born out of a simple frustration: important exam dates, quiz announcements, and assignment deadlines getting buried in chaotic university group chats.
                </p>
                <p style={{ marginBottom: 16 }}>
                  We built Pulsara as a centralized hub where students can post, verify, and track academic deadlines for their faculty — no more scrolling through hundreds of memes to find when your midterm is.
                </p>
                <p style={{ marginBottom: 16 }}>
                  The platform is designed to be anonymous, lightweight, and community-driven. Students post events under codenames, and the community verifies them through upvotes. It{"'"}s like a shared academic calendar powered by the students themselves.
                </p>
                <p style={{ color: '#777', fontStyle: 'italic' }}>
                  Made with ☕ and late nights by university students, for university students.
                </p>
              </div>
            )}

            {footerPage === 'privacy' && (
              <div style={{ fontSize: 14, color: '#3a3a3a', lineHeight: 1.8 }}>
                <p style={{ marginBottom: 16 }}><strong>Last updated:</strong> April 2026</p>
                <p style={{ marginBottom: 16 }}>
                  Pulsara collects minimal data to provide you with the best experience. We store your university email (for verification and notifications) and your chosen anonymous codename.
                </p>
                <h3 style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', color: '#1a1a1a', marginBottom: 8, marginTop: 20 }}>WHAT WE COLLECT</h3>
                <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
                  <li style={{ marginBottom: 6 }}>University email address</li>
                  <li style={{ marginBottom: 6 }}>Anonymous username (codename)</li>
                  <li style={{ marginBottom: 6 }}>Events you post (exams, quizzes, assignments)</li>
                </ul>
                <h3 style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', color: '#1a1a1a', marginBottom: 8, marginTop: 20 }}>WHAT WE DON{"'"}T DO</h3>
                <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
                  <li style={{ marginBottom: 6 }}>We never sell your data to third parties</li>
                  <li style={{ marginBottom: 6 }}>We never share your real identity with other users</li>
                  <li style={{ marginBottom: 6 }}>We don{"'"}t use tracking cookies or analytics</li>
                </ul>
                <p style={{ color: '#777' }}>For questions, reach out to <strong>privacy@pulsara.app</strong></p>
              </div>
            )}

            {footerPage === 'terms' && (
              <div style={{ fontSize: 14, color: '#3a3a3a', lineHeight: 1.8 }}>
                <p style={{ marginBottom: 16 }}><strong>Last updated:</strong> April 2026</p>
                <p style={{ marginBottom: 16 }}>
                  By using Pulsara, you agree to the following terms:
                </p>
                <h3 style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', color: '#1a1a1a', marginBottom: 8, marginTop: 20 }}>USE OF SERVICE</h3>
                <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
                  <li style={{ marginBottom: 6 }}>You must be a university student to use this platform</li>
                  <li style={{ marginBottom: 6 }}>Posts must contain accurate academic information</li>
                  <li style={{ marginBottom: 6 }}>Intentionally posting false deadlines may result in account suspension</li>
                </ul>
                <h3 style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', color: '#1a1a1a', marginBottom: 8, marginTop: 20 }}>COMMUNITY GUIDELINES</h3>
                <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
                  <li style={{ marginBottom: 6 }}>Be respectful in forums and discussions</li>
                  <li style={{ marginBottom: 6 }}>Don{"'"}t impersonate faculty members or administrators</li>
                  <li style={{ marginBottom: 6 }}>Report inaccurate information to help the community</li>
                </ul>
                <h3 style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', color: '#1a1a1a', marginBottom: 8, marginTop: 20 }}>DISCLAIMER</h3>
                <p style={{ color: '#777' }}>
                  Pulsara is a student project and provides information on a best-effort basis. Always verify critical dates with your official university channels.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
