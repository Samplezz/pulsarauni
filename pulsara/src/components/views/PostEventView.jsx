'use client';
import { useState } from 'react';
import { LIME, EXAM_C, TYPE_CFG, LBL, INP, LIME_BTN, GHOST_BTN } from '@/lib/constants';
import { savePosts } from '@/lib/storage';

export default function PostEventView({ myUser, posts, setPosts, onPosted }) {
  const [type, setType] = useState('EXAM');
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [prof, setProf] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !date) return;
    const newPost = { id: Date.now(), type, title, course, prof, date, time, notes, author: myUser, upvotes: 0, status: 'pending' };
    const updated = [...posts, newPost];
    setPosts(updated);
    savePosts(updated);
    setDone(true);
    setTimeout(() => onPosted && onPosted(), 1600);
  }

  if (done) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, animation: 'fadeUp .4s ease' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(212,255,58,.1)', border: `2px solid ${LIME}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✓</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: LIME }}>Event submitted.</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>Pending admin review…</div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '26px 22px', maxWidth: 520, margin: '0 auto', width: '100%', animation: 'fadeUp .3s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 400, marginBottom: 3 }}>Post an Event</h1>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: LIME }}>Posting as @{myUser}</div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Event type */}
        <div>
          <label style={LBL}>Event Type</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
            {['EXAM', 'QUIZ', 'ASSIGNMENT', 'OTHER'].map(t => {
              const c = TYPE_CFG[t];
              const a = type === t;
              return (
                <button key={t} type="button" onClick={() => setType(t)} style={{
                  padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.07em',
                  background: a ? c.bg : 'var(--s2)',
                  border: `1px solid ${a ? c.color : 'var(--border)'}`,
                  color: a ? c.color : 'var(--muted2)', transition: 'all .15s',
                }}>{c.label}</button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={LBL}>Title <span style={{ color: LIME }}>*</span></label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Database Systems — Midterm" style={INP} required onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>

        {/* Course + Prof */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={LBL}>Course Code</label>
            <input value={course} onChange={e => setCourse(e.target.value)} placeholder="CS301" style={INP} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
          <div>
            <label style={LBL}>Professor</label>
            <input value={prof} onChange={e => setProf(e.target.value)} placeholder="Dr. …" style={INP} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
        </div>

        {/* Date + Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={LBL}>Date <span style={{ color: LIME }}>*</span></label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={INP} required onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
          <div>
            <label style={LBL}>Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={INP} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={LBL}>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Covers chapters 4–6…" rows={3} style={{ ...INP, resize: 'vertical', lineHeight: 1.5 }} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>

        {/* Submit */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 13 }}>
          <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span>👻</span>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.07em', marginBottom: 1 }}>POSTING AS</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: LIME, fontWeight: 700 }}>@{myUser}</div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', marginBottom: 10 }}>⚠ Events go to admin review before appearing in the feed</div>
          <button type="submit" style={LIME_BTN}
            onMouseEnter={e => { e.currentTarget.style.background = '#c8f020'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = LIME; e.currentTarget.style.transform = ''; }}
          >SUBMIT FOR REVIEW →</button>
        </div>
      </form>
    </div>
  );
}
