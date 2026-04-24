'use client';
import { useState, useEffect } from 'react';
import { LIME, FORUM_TAGS, TAG_COLORS, LBL, INP, LIME_BTN, GHOST_BTN } from '@/lib/constants';
import { getThreads, saveThreads } from '@/lib/storage';
import Chip from '@/components/atoms/Chip';
import UserPopover from '@/components/UserPopover';
import { useLanguage } from '@/lib/i18n';

export default function ForumsView({ myUser, setPage }) {
  const { t } = useLanguage();
  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);

  useEffect(() => {
    getThreads()
      .then(setThreads)
      .catch(e => console.error('Failed to load threads:', e))
      .finally(() => setLoadingThreads(false));
  }, []);
  const [activeThread, setActiveThread] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('GENERAL');
  const [newBody, setNewBody] = useState('');
  const [replyText, setReplyText] = useState('');

  // Popover State
  const [popUser, setPopUser] = useState(null);
  const [popX, setPopX] = useState(0);
  const [popY, setPopY] = useState(0);

  function openPopover(e, user) {
    e.stopPropagation();
    if (user === myUser || user === 'anonymous') return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPopX(rect.left);
    setPopY(rect.bottom + 4);
    setPopUser(user);
  }

  function handleTag(user) {
    setReplyText(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + `@${user} `);
  }

  function handleMessage(user) {
    localStorage.setItem('pulsara_dm_target', user);
    if (setPage) setPage('messages');
  }

  function createThread(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const t = { id: Date.now(), title: newTitle.trim(), author: myUser, created: 'just now', replies: [], tag: newTag, upvotes: 0, body: newBody.trim() };
    const updated = [t, ...threads];
    setThreads(updated); saveThreads(updated);
    setNewTitle(''); setNewBody(''); setNewTag('GENERAL'); setShowNew(false);
  }

  function addReply(e) {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;
    const reply = { id: Date.now(), author: myUser, text: replyText.trim(), time: 'just now' };
    const updated = threads.map(t => t.id === activeThread.id ? { ...t, replies: [...t.replies, reply] } : t);
    setThreads(updated); saveThreads(updated);
    setActiveThread(updated.find(t => t.id === activeThread.id));
    setReplyText('');
  }

  function upvoteThread(id) {
    const updated = threads.map(t => t.id === id ? { ...t, upvotes: (t.upvotes || 0) + 1 } : t);
    setThreads(updated); saveThreads(updated);
  }

  // ── Thread detail view ──
  if (activeThread) {
    const thread = threads.find(t => t.id === activeThread.id) || activeThread;
    const tc = TAG_COLORS[thread.tag] || 'var(--muted2)';

    return (
      <div className="mobile-pad-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {popUser && <UserPopover username={popUser} x={popX} y={popY} onTag={handleTag} onMessage={handleMessage} onClose={() => setPopUser(null)} />}
        
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', background: 'var(--s1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setActiveThread(null)}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 7, padding: '6px 12px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >← Forums</button>
          <Chip label={thread.tag} color={tc} bg={`${tc}18`} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '22px' }}>
          {/* Thread header */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>{thread.title}</h2>
            {thread.body && <p style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.65, marginBottom: 12 }}>{thread.body}</p>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span onClick={e => openPopover(e, thread.author)} style={{ fontFamily: 'var(--mono)', fontSize: 10, color: LIME, cursor: thread.author !== myUser ? 'pointer' : 'default', transition: 'opacity .15s' }} onMouseEnter={e => e.currentTarget.style.opacity = .7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>@{thread.author}</span>
              <span style={{ color: 'var(--border2)' }}>·</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{thread.created}</span>
              <div style={{ flex: 1 }} />
              <button onClick={() => upvoteThread(thread.id)} style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: 'var(--muted2)', fontFamily: 'var(--mono)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, transition: 'all .15s' }}>↑ {thread.upvotes || 0}</button>
            </div>
          </div>

          {/* Replies */}
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '.07em', marginBottom: 12 }}>{thread.replies.length} REPL{thread.replies.length !== 1 ? 'IES' : 'Y'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {thread.replies.map((r, i) => (
              <div key={r.id} style={{ background: 'var(--s2)', borderRadius: 10, padding: '13px 16px', animation: `cardIn .25s ease ${i * 40}ms both` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <span onClick={e => openPopover(e, r.author)} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: LIME, fontWeight: 600, cursor: r.author !== myUser ? 'pointer' : 'default', transition: 'opacity .15s' }} onMouseEnter={e => e.currentTarget.style.opacity = .7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>@{r.author}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{r.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{r.text}</div>
              </div>
            ))}
            {thread.replies.length === 0 && <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>No replies yet. Be the first.</div>}
          </div>

          {/* Reply form */}
          <form onSubmit={addReply} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: LIME, letterSpacing: '.07em', marginBottom: 8 }}>REPLY AS @{myUser}</div>
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply…" rows={3} style={{ ...INP, resize: 'vertical', lineHeight: 1.55, marginBottom: 10 }} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            <button type="submit" style={{ ...LIME_BTN, width: 'auto', padding: '9px 20px' }}>POST REPLY</button>
          </form>
        </div>
      </div>
    );
  }

  // ── Thread list view ──
  return (
    <div className="mobile-pad-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {popUser && <UserPopover username={popUser} x={popX} y={popY} onTag={handleTag} onMessage={handleMessage} onClose={() => setPopUser(null)} />}
      <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', background: 'var(--s1)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 400, marginBottom: 2 }}>{t('forums_title')}</h1>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{t('forums_subtitle')} · {threads.length} {t('forums_threads')}</p>
        </div>
        <button onClick={() => setShowNew(s => !s)} style={{
          background: showNew ? 'var(--s3)' : LIME,
          color: showNew ? 'var(--text)' : '#000',
          border: `1px solid ${showNew ? 'var(--border)' : 'transparent'}`,
          borderRadius: 8, padding: '8px 16px', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.07em', cursor: 'pointer', transition: 'all .15s',
        }}>
          {showNew ? t('forums_btn_cancel') : t('forums_btn_new')}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px' }}>
        {/* New thread form */}
        {showNew && (
          <form onSubmit={createThread} style={{ background: 'var(--s1)', border: `1px solid ${LIME}33`, borderRadius: 12, padding: '20px', marginBottom: 16, animation: 'slideUp .25s ease' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: LIME, letterSpacing: '.08em', marginBottom: 14 }}>NEW THREAD · @{myUser}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={LBL}>Title</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="What's your question or topic?" style={INP} required onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <div>
                <label style={LBL}>Tag</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
                  {FORUM_TAGS.map(tag => {
                    const tc = TAG_COLORS[tag] || 'var(--muted2)';
                    const active = newTag === tag;
                    return (
                      <button key={tag} type="button" onClick={() => setNewTag(tag)} style={{
                        fontFamily: 'var(--mono)', fontSize: 9, padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontWeight: 700, letterSpacing: '.06em',
                        background: active ? `${tc}18` : 'var(--s2)',
                        border: `1px solid ${active ? tc : 'var(--border)'}`,
                        color: active ? tc : 'var(--muted2)', transition: 'all .15s',
                      }}>{tag}</button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={LBL}>Body <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Add more context if needed…" rows={3} style={{ ...INP, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <button type="submit" style={{ ...LIME_BTN, width: 'auto', padding: '9px 22px' }}>CREATE THREAD →</button>
            </div>
          </form>
        )}

        {/* Thread list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {loadingThreads && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textAlign: 'center', padding: '30px 0' }}>
              Loading threads…
            </div>
          )}
          {!loadingThreads && threads.length === 0 && !showNew && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textAlign: 'center', padding: '30px 0' }}>
              No threads yet. Start one!
            </div>
          )}
          {threads.map((t, i) => {
            const tc = TAG_COLORS[t.tag] || 'var(--muted2)';
            return (
              <div
                key={t.id} onClick={() => setActiveThread(t)}
                style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'all .15s', animation: `cardIn .3s ease ${i * 40}ms both` }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--s2)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--s1)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                      <Chip label={t.tag} color={tc} bg={`${tc}15`} />
                      {t.replies.length === 0 && <Chip label="NO REPLIES" color="var(--muted)" bg="var(--s3)" />}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 6, color: 'var(--text)' }}>{t.title}</div>
                    {t.body && <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.body}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span onClick={e => openPopover(e, t.author)} style={{ fontFamily: 'var(--mono)', fontSize: 10, color: LIME, cursor: t.author !== myUser ? 'pointer' : 'default', transition: 'opacity .15s' }} onMouseEnter={e => e.currentTarget.style.opacity = .7} onMouseLeave={e => e.currentTarget.style.opacity = 1}>@{t.author}</span>
                      <span style={{ color: 'var(--border2)' }}>·</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{t.created}</span>
                      <span style={{ color: 'var(--border2)' }}>·</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted2)' }}>{t.replies.length} repl{t.replies.length !== 1 ? 'ies' : 'y'}</span>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted2)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>↑{t.upvotes || 0}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
