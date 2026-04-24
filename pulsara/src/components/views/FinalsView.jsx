'use client';
import { LIME, EXAM_C, FINALS_SCHEDULE } from '@/lib/constants';
import Badge from '@/components/atoms/Badge';

export default function FinalsView() {
  const today = new Date(2026, 3, 24);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px', animation: 'fadeUp .3s ease' }}>
      {/* Header */}
      <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${LIME},${LIME}00)` }} />
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: LIME, letterSpacing: '.12em', marginBottom: 8 }}>OFFICIAL SCHEDULE</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 13, color: 'var(--muted2)', marginBottom: 4, letterSpacing: '.02em' }}>A FEDENIAL · HNU</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400, lineHeight: 1.15, marginBottom: 6 }}>
          Faculty of Computer Science<br />
          <span style={{ color: 'var(--muted2)', fontSize: 20 }}>and Information Technology</span>
        </h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 18 }}>End of Second Semester Examination Schedule · Academic Year 2025–2026</p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted2)' }}><span style={{ color: LIME, fontWeight: 700 }}>6</span> exams scheduled</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted2)' }}><span style={{ color: LIME, fontWeight: 700 }}>All</span> 12:00 – 14:00</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted2)' }}>May 19 – June 10, 2026</div>
        </div>
      </div>

      {/* Exam list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FINALS_SCHEDULE.map((exam, i) => {
          const examDate = new Date(exam.date);
          const diffMs = examDate - today;
          const diffDays = Math.ceil(diffMs / 86400000);
          const isPast = diffDays < 0;
          const isSoon = diffDays >= 0 && diffDays <= 7;
          const urgColor = isPast ? 'var(--muted)' : isSoon ? EXAM_C : LIME;
          const dLabel = isPast ? 'Past' : diffDays === 0 ? 'Today' : `${diffDays}d`;

          return (
            <div
              key={i}
              style={{
                background: 'var(--s1)', border: '1px solid var(--border)',
                borderLeft: `3px solid ${isPast ? 'var(--border)' : EXAM_C}`,
                borderRadius: 10, padding: '16px 20px', display: 'flex',
                alignItems: 'center', gap: 20, flexWrap: 'wrap',
                animation: `cardIn .3s ease ${i * 60}ms both`, transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--s1)'}
            >
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: urgColor,
                background: `${urgColor}15`, border: `1px solid ${urgColor}33`,
                borderRadius: 6, padding: '4px 10px', minWidth: 52, textAlign: 'center', flexShrink: 0,
              }}>{dLabel}</div>
              <div style={{ minWidth: 180, flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: isPast ? 'var(--muted)' : 'var(--text)', marginBottom: 2 }}>{exam.date}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{exam.time}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: isPast ? 'var(--muted)' : 'var(--text)', marginBottom: 3 }}>{exam.subject}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted2)', letterSpacing: '.05em' }}>{exam.code}</div>
              </div>
              <Badge type="EXAM" />
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 24, padding: '14px 18px', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>📋</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Program Coordinators</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            Supervisor of the Faculty of Computer Science and Information Technology<br />
            <span style={{ color: 'var(--muted2)', fontWeight: 500 }}>Prof. Dr. Osama Imam</span>
          </div>
        </div>
      </div>
    </div>
  );
}
