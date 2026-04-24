'use client';
import { useState } from 'react';
import Badge from '@/components/atoms/Badge';
import { useLanguage } from '@/lib/i18n';

const PILL_STYLES = {
  EXAM:       { background: 'var(--danger)',  color: '#fff' },
  QUIZ:       { background: 'var(--lime)',    color: '#000' },
  ASSIGNMENT: { background: 'var(--asgn)',    color: '#fff' },
  OTHER:      { background: 'var(--muted)',   color: '#fff' },
};

const VERIFIED_THRESHOLD = 5;

export default function CalendarView({ posts }) {
  const { lang, t } = useLanguage();
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [sel, setSel] = useState(null);

  const yr = viewDate.getFullYear();
  const mo = viewDate.getMonth();
  const monthName = viewDate.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long' });
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const today = new Date();

  const evsByDay = {};
  posts.filter(p => p.status !== 'deleted').forEach(p => {
    const d = new Date(p.date + 'T00:00:00');
    if (d.getFullYear() === yr && d.getMonth() === mo) {
      const day = d.getDate();
      if (!evsByDay[day]) evsByDay[day] = [];
      evsByDay[day].push(p);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selEvs = sel ? (evsByDay[sel] || []) : [];

  const prevMonth = () => setViewDate(new Date(yr, mo - 1, 1));
  const nextMonth = () => setViewDate(new Date(yr, mo + 1, 1));

  return (
    <div className="mobile-pad-left" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 400, letterSpacing: '-.02em' }}>
            {monthName} <span style={{ color: 'var(--muted)' }}>{yr}</span>
          </h1>
          <div style={{
            display: 'flex', gap: 5,
            marginLeft: lang === 'ar' ? 0 : 'auto',
            marginRight: lang === 'ar' ? 'auto' : 0,
          }}>
            <button
              onClick={lang === 'ar' ? nextMonth : prevMonth}
              style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 6, width: 30, height: 30, color: 'var(--muted2)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 13, transition: 'all .15s' }}
            >←</button>
            <button
              onClick={lang === 'ar' ? prevMonth : nextMonth}
              style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 6, width: 30, height: 30, color: 'var(--muted2)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 13, transition: 'all .15s' }}
            >→</button>
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 3 }}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', padding: '3px 0' }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />;
            const isToday = day === today.getDate() && mo === today.getMonth() && yr === today.getFullYear();
            const evs = evsByDay[day] || [];
            const isSel = sel === day;
            const show = evs.slice(0, 2);
            const extra = evs.length - 2;

            return (
              <div
                key={day}
                onClick={() => setSel(isSel ? null : day)}
                style={{
                  minHeight: 78,
                  background: isSel ? 'var(--s3)' : 'var(--s1)',
                  border: `1px solid ${isSel ? 'rgba(212,255,58,.27)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '7px 6px 5px', cursor: 'pointer', transition: 'all .15s',
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'var(--s2)'; }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'var(--s1)'; }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--mono)', fontSize: 11, fontWeight: isToday ? 700 : 400,
                  color: isToday ? '#000' : evs.length ? 'var(--text)' : 'var(--muted)',
                  background: isToday ? 'var(--lime)' : 'transparent',
                  boxShadow: isToday ? '0 0 0 2px var(--lime),0 0 10px rgba(212,255,58,.4)' : 'none',
                  marginBottom: 3,
                }}>{day}</div>

                {/* Pill stickers */}
                {show.map((ev, si) => {
                  const pill = PILL_STYLES[ev.type] || PILL_STYLES.OTHER;
                  const label = ev.type === 'ASSIGNMENT' ? 'ASGN' : ev.type;
                  return (
                    <div key={ev.id} style={{
                      fontFamily: 'var(--mono)', fontSize: 7, fontWeight: 700,
                      letterSpacing: '.04em', padding: '2px 5px',
                      borderRadius: 20, marginBottom: 2,
                      background: pill.background, color: pill.color,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      transform: `rotate(${si % 2 === 0 ? '-0.8deg' : '0.8deg'})`,
                    }}>{label}</div>
                  );
                })}
                {extra > 0 && (
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--muted)' }}>+{extra}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          {Object.entries(PILL_STYLES).filter(([k]) => k !== 'OTHER').map(([k, s]) => {
            const label = k === 'ASSIGNMENT' ? 'ASGN' : k;
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 20, height: 10, borderRadius: 20, background: s.background }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.07em' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day detail sidebar */}
      {sel && (
        <div style={{
          width: 280, borderLeft: '1px solid var(--border)',
          background: 'var(--s1)', padding: '18px',
          overflowY: 'auto', animation: 'fadeIn .2s ease', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 400 }}>{monthName} {sel}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>
                {selEvs.length} event{selEvs.length !== 1 ? 's' : ''}
              </div>
            </div>
            <button
              onClick={() => setSel(null)}
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, width: 26, height: 26, color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }}
            >✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selEvs.length === 0 && (
              <div style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--mono)' }}>No events.</div>
            )}
            {selEvs.map(ev => {
              const pill = PILL_STYLES[ev.type] || PILL_STYLES.OTHER;
              const verified = ev.upvotes >= VERIFIED_THRESHOLD;
              return (
                <div key={ev.id} style={{
                  background: 'var(--s2)', borderRadius: 8, padding: '11px',
                  borderLeft: `3px solid ${pill.background}`,
                  border: `1px solid rgba(255,255,255,.04)`,
                }}>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                    <Badge type={ev.type} small />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3, lineHeight: 1.3 }}>{ev.title}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted2)', marginBottom: 3 }}>
                    {ev.course} · {ev.time}
                  </div>
                  {ev.notes && (
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.4 }}>{ev.notes}</div>
                  )}
                  <div style={{ marginTop: 7, fontFamily: 'var(--mono)', fontSize: 9, color: verified ? 'var(--lime)' : 'var(--muted)' }}>
                    {verified ? '✓ Verified' : `○ ${Math.max(0, VERIFIED_THRESHOLD - ev.upvotes)} more`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
