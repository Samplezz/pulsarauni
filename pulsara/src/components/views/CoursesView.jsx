'use client';
import { LIME, COURSES } from '@/lib/constants';

export default function CoursesView({ posts }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '26px 22px', animation: 'fadeUp .3s ease' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 400, marginBottom: 3 }}>My Courses</h1>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 20 }}>HNU · Spring 2026</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
        {COURSES.map((c, i) => {
          const code = c.split(' ')[0];
          const name = c.split('— ')[1];
          const cnt = posts.filter(p => p.course === code && p.status !== 'deleted').length;
          return (
            <div
              key={i}
              style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', cursor: 'pointer', transition: 'all .15s', animation: `cardIn .3s ease ${i * 40}ms both` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--s2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--s1)'; }}
            >
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginBottom: 4, letterSpacing: '.06em' }}>{code}</div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 9 }}>{name}</div>
              {cnt > 0 && (
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: LIME, background: 'rgba(212,255,58,.08)', border: '1px solid rgba(212,255,58,.2)', borderRadius: 4, padding: '2px 6px', display: 'inline-block' }}>
                  {cnt} upcoming
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
