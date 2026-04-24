'use client';
import { useState, useEffect } from 'react';
import { LIME, LBL, INP, LIME_BTN, GHOST_BTN } from '@/lib/constants';
import { getConversations, getMessages, sendMessage } from '@/lib/storage';

export default function MessagesView({ myUser }) {
  const [convos, setConvos] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newUser, setNewUser] = useState('');

  // Load conversations and initial target
  useEffect(() => {
    getConversations(myUser)
      .then(setConvos)
      .catch(e => console.error('getConversations error:', e))
      .finally(() => setLoadingConvos(false));
    const target = localStorage.getItem('pulsara_dm_target');
    if (target) {
      setActiveUser(target);
      localStorage.removeItem('pulsara_dm_target');
    }
  }, [myUser]);

  // Load messages when activeUser changes
  useEffect(() => {
    if (activeUser) {
      getMessages(myUser, activeUser).then(setMessages);
      // Optional: poll for new messages could go here if using Supabase without realtime
    }
  }, [activeUser, myUser]);

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || !activeUser) return;
    sendMessage(myUser, activeUser, text.trim()).then(newMsg => {
      setMessages([...messages, { ...newMsg, time: 'just now' }]);
      setText('');
      // Update convo list locally to bring to top
      const updatedConvos = convos.filter(c => c.withUser !== activeUser);
      setConvos([{ withUser: activeUser, lastMessage: newMsg.text, time: 'just now', timestamp: Date.now() }, ...updatedConvos]);
    });
  }

  function handleStartNew(e) {
    e.preventDefault();
    const u = newUser.trim().toLowerCase().replace('@', '');
    if (!u || u === myUser) return;
    setActiveUser(u);
    setShowNew(false);
    setNewUser('');
  }

  // ── DM Detail View (Mobile/Responsive or Right Pane) ──
  if (activeUser) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', background: 'var(--s1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setActiveUser(null)}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 7, padding: '6px 12px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer', transition: 'all .15s' }}
          >← Back</button>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 14, color: LIME, fontWeight: 700 }}>@{activeUser}</div>
        </div>

        {/* Message List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.length === 0 ? (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>
              Say hello to @{activeUser}
            </div>
          ) : (
            messages.map((m, i) => {
              const isMe = m.sender === myUser;
              return (
                <div key={m.id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    background: isMe ? LIME : 'var(--s2)',
                    color: isMe ? '#000' : 'var(--text)',
                    padding: '10px 14px', borderRadius: 12,
                    borderBottomRightRadius: isMe ? 2 : 12,
                    borderBottomLeftRadius: !isMe ? 2 : 12,
                    maxWidth: '85%', fontSize: 13, lineHeight: 1.5
                  }}>
                    {m.text}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>
                    {m.time}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', background: 'var(--s1)', display: 'flex', gap: 10 }}>
          <input
            value={text} onChange={e => setText(e.target.value)}
            placeholder="Message..."
            style={{ ...INP, flex: 1, borderRadius: 20, padding: '10px 16px' }}
            onFocus={e => e.target.style.borderColor = LIME}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button type="submit" disabled={!text.trim()} style={{
            background: text.trim() ? LIME : 'var(--s3)',
            color: text.trim() ? '#000' : 'var(--muted)',
            border: 'none', borderRadius: 20, padding: '0 20px',
            fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, cursor: text.trim() ? 'pointer' : 'default', transition: 'all .15s'
          }}>SEND</button>
        </form>
      </div>
    );
  }

  // ── Inbox List View ──
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', background: 'var(--s1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 400, marginBottom: 2 }}>Messages</h1>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>Direct messages</p>
        </div>
        <button onClick={() => setShowNew(s => !s)} style={{
          background: showNew ? 'var(--s3)' : LIME, color: showNew ? 'var(--text)' : '#000',
          border: `1px solid ${showNew ? 'var(--border)' : 'transparent'}`,
          borderRadius: 8, padding: '8px 16px', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.07em', cursor: 'pointer', transition: 'all .15s',
        }}>
          {showNew ? '✕ CANCEL' : '+ NEW MESSAGE'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px' }}>
        {/* Privacy Banner */}
        <div style={{ background: 'rgba(212,255,58,.08)', border: `1px solid ${LIME}44`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: LIME, fontWeight: 700, marginBottom: 4 }}>WELL PROTECTED</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>All of your messages are private and encrypted. No one else can see them.</div>
          </div>
        </div>

        {showNew && (
          <form onSubmit={handleStartNew} style={{ background: 'var(--s1)', border: `1px solid ${LIME}33`, borderRadius: 12, padding: '20px', marginBottom: 16, animation: 'slideUp .25s ease' }}>
            <label style={LBL}>Who do you want to message?</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 5 }}>
              <input value={newUser} onChange={e => setNewUser(e.target.value)} placeholder="@username" autoFocus style={{ ...INP, flex: 1 }} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              <button type="submit" style={{ ...LIME_BTN, width: 'auto', padding: '0 20px' }}>START</button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {loadingConvos ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 11, padding: '40px 0' }}>Loading…</div>
          ) : convos.length === 0 && !showNew ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 11, padding: '40px 0' }}>No messages yet.</div>
          ) : (
            convos.map((c, i) => (
              <div key={c.withUser} onClick={() => setActiveUser(c.withUser)} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'all .15s', animation: `cardIn .3s ease ${i * 40}ms both` }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--s2)'; e.currentTarget.style.borderColor = 'var(--border2)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--s1)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: LIME, fontWeight: 700 }}>@{c.withUser}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMessage}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
