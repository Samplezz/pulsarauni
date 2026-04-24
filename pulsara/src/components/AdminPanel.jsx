'use client';
import { useState, useEffect } from 'react';
import { LIME, EXAM_C, ASGN_C, ADMIN_PASS, TYPE_CFG, INP, LIME_BTN, fmtDate } from '@/lib/constants';
import { getReports, saveReports, savePosts } from '@/lib/storage';
import Badge from '@/components/atoms/Badge';
import Chip from '@/components/atoms/Chip';

export default function AdminPanel({ onClose }) {
  const [authed, setAuthed] = useState(() => typeof sessionStorage !== 'undefined' && sessionStorage.getItem('pulsara_admin') === '1');
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState(false);
  const [tab, setTab] = useState('events');
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);

  // Load data async
  useEffect(() => {
    import('@/lib/storage').then(m => {
      m.getPosts()
        .then(setPosts)
        .catch(e => console.error('AdminPanel getPosts error:', e));
      setReports(m.getReports());
    });
  }, []);

  function login(e) {
    e.preventDefault();
    if (pass === ADMIN_PASS) { setAuthed(true); sessionStorage.setItem('pulsara_admin', '1'); }
    else { setPassErr(true); setTimeout(() => setPassErr(false), 600); }
  }

  function approvePost(id) { const u = posts.map(p => p.id === id ? { ...p, status: 'approved' } : p); setPosts(u); savePosts(u); }
  function deletePost(id) { const u = posts.map(p => p.id === id ? { ...p, status: 'deleted' } : p); setPosts(u); savePosts(u); }
  function dismissReport(id) { const u = reports.map(r => r.id === id ? { ...r, status: 'dismissed' } : r); setReports(u); saveReports(u); }

  const pending = posts.filter(p => p.status === 'pending');
  const approved = posts.filter(p => p.status === 'approved');
  const deleted = posts.filter(p => p.status === 'deleted');
  const openReports = reports.filter(r => r.status !== 'dismissed');

  const TABS = [
    { id: 'events', label: `Events (${posts.filter(p => p.status !== 'deleted').length})` },
    { id: 'pending', label: `Pending (${pending.length})`, alert: pending.length > 0 },
    { id: 'reports', label: `Reports (${openReports.length})`, alert: openReports.length > 0 },
    { id: 'deleted', label: `Deleted (${deleted.length})` },
  ];

  const catColors = { BUG: EXAM_C, 'WRONG INFO': '#f0a500', 'UI ISSUE': ASGN_C, SUGGESTION: LIME, OTHER: 'var(--muted2)' };
  const empty = (msg) => <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textAlign: 'center', paddingTop: 30 }}>{msg}</div>;

  function renderTab() {
    if (tab === 'events') {
      return approved.map(p => {
        const cfg = TYPE_CFG[p.type] || TYPE_CFG.OTHER;
        return (
          <div key={p.id} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderLeft: `3px solid ${cfg.color}`, borderRadius: 9, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', animation: 'cardIn .2s ease both' }}>
            <Badge type={p.type} small />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)' }}>{p.course} · {fmtDate(p.date)} · @{p.author} · {p.upvotes} votes</div>
            </div>
            <button onClick={() => deletePost(p.id)} style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '4px 10px', borderRadius: 5, background: 'rgba(255,79,79,.08)', border: '1px solid rgba(255,79,79,.25)', color: EXAM_C, cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap' }}>DELETE</button>
          </div>
        );
      });
    }

    if (tab === 'pending') {
      if (pending.length === 0) return empty('No pending events.');
      return pending.map(p => (
        <div key={p.id} style={{ background: 'var(--s2)', border: '1px solid #f0a50033', borderLeft: '3px solid #f0a500', borderRadius: 9, padding: '14px 16px', animation: 'cardIn .2s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Badge type={p.type} small />
            <Chip label="PENDING REVIEW" color="#f0a500" bg="rgba(240,165,0,.1)" />
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>@{p.author}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted2)', marginBottom: 10 }}>{p.course}{p.prof ? ' · ' + p.prof : ''} · {fmtDate(p.date)} · {p.time}</div>
          {p.notes && <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 10, borderLeft: '2px solid var(--border2)', paddingLeft: 8 }}>{p.notes}</div>}
          <div style={{ display: 'flex', gap: 7 }}>
            <button onClick={() => approvePost(p.id)} style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '6px 16px', borderRadius: 6, background: 'rgba(212,255,58,.1)', border: '1px solid rgba(212,255,58,.35)', color: LIME, cursor: 'pointer', fontWeight: 700, transition: 'all .15s' }}>✓ APPROVE</button>
            <button onClick={() => deletePost(p.id)} style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '6px 16px', borderRadius: 6, background: 'rgba(255,79,79,.08)', border: '1px solid rgba(255,79,79,.25)', color: EXAM_C, cursor: 'pointer', fontWeight: 700, transition: 'all .15s' }}>✕ REJECT</button>
          </div>
        </div>
      ));
    }

    if (tab === 'reports') {
      if (openReports.length === 0) return empty('No open reports.');
      return openReports.map(r => {
        const cc = catColors[r.category] || 'var(--muted2)';
        return (
          <div key={r.id} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 9, padding: '14px 16px', animation: 'cardIn .2s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <Chip label={r.category} color={cc} bg={cc + '18'} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: LIME }}>@{r.author}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>{r.time}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55, marginBottom: r.screenshotName ? 8 : 10 }}>{r.desc}</div>
            {r.screenshotName && <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', marginBottom: 10 }}>🖼 {r.screenshotName}</div>}
            <button onClick={() => dismissReport(r.id)} style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '4px 12px', borderRadius: 5, background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', transition: 'all .15s' }}>DISMISS</button>
          </div>
        );
      });
    }

    if (tab === 'deleted') {
      if (deleted.length === 0) return empty('Nothing deleted.');
      return deleted.map(p => (
        <div key={p.id} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 9, padding: '12px 14px', opacity: .5, animation: 'cardIn .2s ease both', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Badge type={p.type} small />
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--muted)', textDecoration: 'line-through' }}>{p.title}</div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>@{p.author}</span>
          <button onClick={() => approvePost(p.id)} style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '3px 10px', borderRadius: 5, background: 'rgba(212,255,58,.08)', border: '1px solid rgba(212,255,58,.25)', color: LIME, cursor: 'pointer' }}>RESTORE</button>
        </div>
      ));
    }

    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'stretch', justifyContent: 'center', animation: 'fadeIn .15s ease' }}>
      <div style={{ width: '100%', maxWidth: 740, background: 'var(--bg)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', background: 'var(--s1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: EXAM_C, letterSpacing: '.1em', border: '1px solid rgba(255,79,79,.3)', padding: '3px 8px', borderRadius: 4, background: 'rgba(255,79,79,.08)' }}>ADMIN</div>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 400 }}>Pulsara Dashboard</span>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 7, padding: '6px 12px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer', transition: 'all .15s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>CLOSE ✕</button>
        </div>

        {!authed ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '100%', maxWidth: 340, animation: 'popIn .3s ease' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 22, color: EXAM_C, fontWeight: 700, marginBottom: 4, letterSpacing: '-.01em' }}>🔒</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400, marginBottom: 5 }}>Admin access</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 22, lineHeight: 1.6 }}>Enter the admin password to continue.</p>
              <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" autoFocus style={{ ...INP, animation: passErr ? 'shake .35s ease' : '' }} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                {passErr && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: EXAM_C }}>❌ Incorrect password.</div>}
                <button type="submit" style={LIME_BTN}>ENTER</button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid var(--border)' }}>
              {[
                { label: 'Total Events', val: posts.filter(p => p.status !== 'deleted').length, color: LIME },
                { label: 'Pending', val: pending.length, color: pending.length ? EXAM_C : 'var(--muted)' },
                { label: 'Open Reports', val: openReports.length, color: openReports.length ? '#f0a500' : 'var(--muted)' },
                { label: 'Deleted', val: deleted.length, color: 'var(--muted)' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '14px 18px', borderRight: i < 3 ? '1px solid var(--border)' : 'none', background: 'var(--s1)' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginBottom: 4 }}>{s.label.toUpperCase()}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', background: 'var(--s1)' }}>
              {TABS.map(t => {
                const active = tab === t.id;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{
                    padding: '10px 18px', background: active ? 'var(--bg)' : 'none',
                    border: 'none', borderBottom: active ? '2px solid ' + LIME : '2px solid transparent',
                    color: active ? LIME : 'var(--muted)',
                    fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: '.06em',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all .15s',
                  }}>
                    {t.label}
                    {t.alert && <div style={{ width: 6, height: 6, borderRadius: '50%', background: EXAM_C }} />}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {renderTab()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
