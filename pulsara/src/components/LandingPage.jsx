'use client';
import { useState } from 'react';
import { LIME, EXAM_C, TYPE_CFG, GHOST_BTN, LBL, INP, LIME_BTN, CLASSROOM_CODE } from '@/lib/constants';
import { addToWaitlist } from '@/lib/storage';
import { useLanguage } from '@/lib/i18n';
import PulseDot from '@/components/atoms/PulseDot';
import WhatsAppMock from '@/components/WhatsAppMock';
import Badge from '@/components/atoms/Badge';

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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', animation: 'fadeIn .2s ease' }}>
      <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16, padding: '34px 30px', width: '100%', maxWidth: 400, animation: 'popIn .3s ease', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 19 }}>Pulsara</span>
          <PulseDot />
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, width: 28, height: 28, color: 'var(--muted)', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>✕</button>
        </div>

        <div style={{ fontSize: 28, marginBottom: 8 }}>🔑</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400, marginBottom: 5 }}>{t('code_modal_h')}</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 22, lineHeight: 1.6 }}>{t('code_modal_p')}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div>
            <label style={LBL}>{t('code_modal_label')}</label>
            <input
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
              placeholder="XXX-XX-XXX"
              autoFocus
              style={{
                ...INP,
                fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700,
                letterSpacing: '.12em', textAlign: 'center',
                animation: shake ? 'shake .35s ease' : '',
              }}
              onFocus={e => e.target.style.borderColor = LIME}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            {error && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: EXAM_C, marginTop: 5, textAlign: 'center' }}>{error}</div>}
          </div>
          <button type="submit" style={LIME_BTN}>{t('code_btn')}</button>
        </form>
      </div>
    </div>
  );
}

/* ─── LANDING PAGE ───────────────────────────────── */
export default function LandingPage({ onEnterApp, onSignup }) {
  const [showCodeModal, setShowCodeModal] = useState(false);
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>
      {/* Code modal */}
      {showCodeModal && <CodeModal onSuccess={handleCodeSuccess} onClose={() => setShowCodeModal(false)} />}


      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid rgba(245,241,232,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 20, letterSpacing: '-.04em', lineHeight: 1, display: 'block' }}>{t('auth_title')}</span>
          <PulseDot />
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <button onClick={toggleLanguage} style={{ ...GHOST_BTN, padding: '7px 14px' }}>
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
          <button
            onClick={() => setShowCodeModal(true)}
            style={{ ...GHOST_BTN, padding: '7px 14px' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = LIME; e.currentTarget.style.color = LIME; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
          >{t('landing_have_code')}</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '72px 40px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div style={{ animation: 'fadeUp .7s ease both' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: LIME, letterSpacing: '.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <PulseDot /> {t('landing_badge')}
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 64, lineHeight: 1.0, letterSpacing: '-.03em', marginBottom: 20, fontWeight: 400 }}>
            {t('landing_h1_1')}<br /><em style={{ color: LIME, fontStyle: 'italic' }}>{t('landing_h1_2')}</em>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted2)', lineHeight: 1.75, maxWidth: 420, marginBottom: 28, fontWeight: 300 }}>
            {t('landing_desc')}
          </p>

          {/* Notification signup */}
          {emailSubmitted ? (
            <div style={{ animation: 'fadeUp .3s ease', background: 'rgba(212,255,58,.06)', border: `1px solid ${LIME}33`, borderRadius: 10, padding: '16px 20px', maxWidth: 420 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: LIME, fontWeight: 700 }}>{t('landing_success_title')}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{t('landing_success_desc')}</div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 8, maxWidth: 420, marginBottom: 14 }}>
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                placeholder="your@university.email"
                style={{ ...INP, flex: 1 }}
                onFocus={e => e.target.style.borderColor = LIME}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button type="submit" disabled={emailLoading} style={{
                background: LIME, color: '#000', border: 'none', borderRadius: 8,
                padding: '10px 18px', fontFamily: 'var(--mono)', fontSize: 10,
                fontWeight: 700, letterSpacing: '.07em', cursor: emailLoading ? 'default' : 'pointer',
                transition: 'all .15s', whiteSpace: 'nowrap', flexShrink: 0,
                opacity: emailLoading ? .7 : 1,
              }}
                onMouseEnter={e => { if (!emailLoading) e.currentTarget.style.background = '#c8f020'; }}
                onMouseLeave={e => e.currentTarget.style.background = LIME}
              >{emailLoading ? '…' : t('landing_notify_me')}</button>
            </form>
          )}
          {emailError && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: EXAM_C, marginBottom: 8 }}>{emailError}</div>}
          {!emailSubmitted && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginBottom: 16 }}>{t('landing_notify_update')}</div>}

          {/* Classroom code CTA */}
          <button
            onClick={() => setShowCodeModal(true)}
            style={{
              background: 'none', border: `1px dashed ${LIME}44`,
              borderRadius: 8, padding: '11px 20px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = LIME; e.currentTarget.style.background = 'rgba(212,255,58,.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${LIME}44`; e.currentTarget.style.background = 'none'; }}
          >
            <span style={{ fontSize: 14 }}>🔑</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: LIME, fontWeight: 600, letterSpacing: '.05em' }}>{t('landing_code_cta')}</span>
          </button>
        </div>
        <div style={{ animation: 'fadeUp .7s ease .15s both', position: 'relative' }}>
          <WhatsAppMock lang={lang} t={t} />
        </div>
      </section>

      {/* Marquee — seamless infinite loop */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '9px 0', background: 'var(--s1)', margin: '56px 0' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 40s linear infinite' }}>
          {[0, 1].map(set => (
            <div key={set} style={{ display: 'flex', gap: 18, paddingRight: 18, flexShrink: 0 }}>
              {['EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT','EXAM','QUIZ','ASSIGNMENT'].map((item, i) => {
                const c = TYPE_CFG[item];
                return <span key={`${set}-${i}`} style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: c.color, padding: '2px 10px', borderRadius: 4, background: c.bg, whiteSpace: 'nowrap' }}>{c.label}</span>;
              })}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section style={{ padding: '0 40px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em', marginBottom: 24, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('landing_how_title')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 1, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { n: '01', tk: 'landing_step1', },
            { n: '02', tk: 'landing_step2', },
            { n: '03', tk: 'landing_step3', },
          ].map((s, i) => (
            <div key={i} style={{ padding: '26px 22px', background: 'var(--s1)', borderRight: lang === 'en' && i < 2 ? '1px solid var(--border)' : 'none', borderLeft: lang === 'ar' && i < 2 ? '1px solid var(--border)' : 'none', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 32, color: 'var(--s3)', fontWeight: 700, marginBottom: 9, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 400, marginBottom: 7 }}>{t(s.tk + '_title')}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{t(s.tk + '_desc')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 40px 60px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 40, fontWeight: 400, lineHeight: 1.1, marginBottom: 14 }}>
          {t('landing_cta_h1')}<br />{t('landing_cta_h2')}<br /><em style={{ color: LIME }}>{t('landing_cta_h3')}</em>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 26, lineHeight: 1.7 }}>{t('landing_cta_p')}</p>
        <button
          onClick={() => setShowCodeModal(true)}
          style={{ background: LIME, color: '#000', border: 'none', borderRadius: 8, padding: '13px 30px', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', cursor: 'pointer', transition: 'all .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#c8f020'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(212,255,58,.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = LIME; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >{t('landing_cta_btn')}</button>
      </section>

      {/* ── SUPER WORDMARK (bottom) ── */}
      <div style={{
        background: 'var(--bg-soft)',
        padding: '70px 40px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,255,58,.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          fontFamily: 'var(--serif)',
          fontWeight: 400,
          fontSize: 'clamp(80px, 16vw, 180px)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: 'var(--lime)',
          textShadow: '0 0 120px rgba(212,255,58,.15)',
          userSelect: 'none',
          margin: 0,
          padding: '0.1em 0',
        }}>Pulsara</div>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'var(--muted)',
          letterSpacing: '.18em',
          marginTop: 18,
          textTransform: 'uppercase',
        }}>{t('landing_badge')}</div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>Pulsara</span>
          <PulseDot />
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>© 2026 Pulsara</span>
      </footer>
    </div>
  );
}
