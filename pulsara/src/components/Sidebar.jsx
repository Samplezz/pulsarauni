import { useState } from 'react';
import { LIME, EXAM_C } from '@/lib/constants';
import PulseDot from '@/components/atoms/PulseDot';
import ReportModal from '@/components/ReportModal';
import { useLanguage } from '@/lib/i18n';

export default function Sidebar({ page, setPage, myUser, mobileOpen, setMobileOpen, pendingCount, onLogout }) {
  const [showReport, setShowReport] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  const nav = [
    { id: 'feed',     icon: '▦', label: t('nav_feed') },
    { id: 'calendar', icon: '◫', label: t('nav_calendar') },
    { id: 'finals',   icon: '📅', label: t('nav_finals') },
    { id: 'forums',   icon: '💬', label: t('nav_forums') },
    { id: 'courses',  icon: '⊟', label: t('nav_courses') },
    { id: 'messages', icon: '✉', label: t('nav_messages') },
    { id: 'post',     icon: '+', label: t('nav_post') },
  ];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {showReport && <ReportModal myUser={myUser} onClose={() => setShowReport(false)} />}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 99 }} />}
      <aside style={{
        width: 224, flexShrink: 0,
        background: 'rgba(17,17,17,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRight: lang === 'en' ? '1px solid rgba(245,241,232,0.08)' : 'none',
        borderLeft: lang === 'ar' ? '1px solid rgba(245,241,232,0.08)' : 'none',
        display: 'flex', flexDirection: 'column', padding: '20px 13px', gap: 3,
        height: '100vh', position: isMobile ? 'fixed' : 'sticky',
        top: 0, ...(lang === 'ar' ? { right: 0 } : { left: 0 }),
        zIndex: 100, transition: 'transform .25s',
        transform: isMobile && !mobileOpen ? `translateX(${lang === 'ar' ? '100%' : '-100%'})` : 'translateX(0)',
      }}>
        {/* Logo */}
        <div onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '3px 8px', marginBottom: 16, cursor: 'pointer', transition: 'opacity .15s' }} onMouseEnter={e => e.currentTarget.style.opacity = .7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 20, letterSpacing: '-.04em', lineHeight: 1 }}>Pulsara</span>
          <PulseDot />
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {nav.map(item => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMobileOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                  borderRadius: 7, background: active ? 'var(--lime-dim)' : 'none',
                  border: `1px solid ${active ? LIME + '22' : 'transparent'}`,
                  color: active ? LIME : 'var(--muted2)',
                  fontFamily: 'var(--sans)', fontSize: 13,
                  fontWeight: active ? 600 : 400, cursor: 'pointer',
                  textAlign: 'left', transition: 'all .15s',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--s2)'; e.currentTarget.style.color = 'var(--text)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--muted2)'; } }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: 13, width: 16, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
                {item.id === 'post' && (
                  <span style={{ marginLeft: 'auto', background: LIME, color: '#000', borderRadius: 3, width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>+</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={toggleLanguage}
            style={{
              width: '100%', background: 'none', border: '1px dashed var(--border)',
              borderRadius: 8, padding: '10px 14px', cursor: 'pointer',
              color: 'var(--muted2)', fontFamily: 'var(--mono)', fontSize: 11,
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted2)'; }}
          >
            <span>🌐</span> {lang === 'en' ? 'عربي' : 'English'}
          </button>
          <button
            onClick={() => setShowReport(true)}
            style={{
              width: '100%', background: 'none', border: '1px dashed var(--border)',
              borderRadius: 8, padding: '10px 14px', cursor: 'pointer',
              color: 'var(--muted2)', fontFamily: 'var(--mono)', fontSize: 11,
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted2)'; }}
          >
            <span>🐛</span> {t('sb_report_bug')}
          </button>
          <button
            onClick={onLogout}
            style={{
              width: '100%', background: 'none', border: '1px dashed var(--border)',
              borderRadius: 8, padding: '10px 14px', cursor: 'pointer',
              color: 'var(--muted2)', fontFamily: 'var(--mono)', fontSize: 11,
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted2)'; }}
          >
            <span>🚪</span> {t('sb_logout')}
          </button>
          <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <span style={{ fontSize: 11 }}>👻</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.07em' }}>ANONYMOUS</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: LIME, fontWeight: 700 }}>@{myUser}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
