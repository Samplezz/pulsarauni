'use client';
import { useState } from 'react';

const ACCENT = '#9b8fc2';

const EN_MSGS = [
  { side: 'left',  name: 'Ahmed K.',  text: 'yo did anyone actually study lmaoooo 💀', time: '10:02' },
  { side: 'left',  name: 'Sara M.',   text: 'HAHAHA bro same I opened the book for 2 mins then closed it', time: '10:03' },
  { side: 'right', name: 'You',       text: 'guys when is the DB exam exactly??', time: '10:04' },
  { side: 'left',  name: 'Mahmoud',   text: '😂😂😂😂😂', time: '10:04' },
  { side: 'left',  name: 'Nour',      text: 'idk check the syllabus or smth', time: '10:05' },
  { side: 'left',  name: 'Omar',      text: '💀💀💀', important: true, time: '10:07', realText: 'CS301 DB Midterm — April 28 at 10:00am. Covers ch4–7 + ER diagrams. Dr. Fawzy confirmed.' },
  { side: 'left',  name: 'Ahmed K.',  text: 'ahahaha man I\'m not ready at all 😭', time: '10:08' },
  { side: 'right', name: 'You',       text: 'WAIT what was that message above??', time: '10:09' },
  { side: 'left',  name: 'Sara M.',   text: "which one lol there's like 200 messages", time: '10:09' },
];

const AR_MSGS = [
  { side: 'left',  name: 'أحمد',     text: 'يا جماعة هل ذاكر أحد؟ 💀', time: '10:02' },
  { side: 'left',  name: 'سارة',     text: 'هههه أنا فتحت الكتاب دقيقتين وأقفلته', time: '10:03' },
  { side: 'right', name: 'أنت',      text: 'متى بالضبط امتحان قواعد البيانات؟؟', time: '10:04' },
  { side: 'left',  name: 'محمود',    text: '😂😂😂😂😂', time: '10:04' },
  { side: 'left',  name: 'نور',      text: 'مش عارف شوف الخطة الدراسية', time: '10:05' },
  { side: 'left',  name: 'عمر',      text: '💀💀💀', important: true, time: '10:07', realText: 'امتحان CS301 — 28 أبريل الساعة 10 صباحاً. الفصول 4-7 + مخططات ER. أكد الدكتور فوزي.' },
  { side: 'left',  name: 'أحمد',     text: 'ولا مستعد خالص 😭', time: '10:08' },
  { side: 'right', name: 'أنت',      text: 'لحظة ما هي الرسالة اللي فوق؟؟', time: '10:09' },
  { side: 'left',  name: 'سارة',     text: 'أنهي رسالة في 200 رسالة 😂', time: '10:09' },
];

export default function WhatsAppMock({ lang = 'en', t }) {
  const [revealed, setRevealed] = useState(false);
  const [draftMsg, setDraftMsg] = useState('');
  const [easterEgg, setEasterEgg] = useState(false);
  const isAr = lang === 'ar';
  const msgs = isAr ? AR_MSGS : EN_MSGS;
  const groupName = t ? t('landing_wa_group') : 'CS Faculty 2026 🎓';
  const membersLabel = t ? t('landing_wa_members') : '342 members';
  const tapLabel = t ? t('landing_wa_tap') : '⚠ important info — tap to reveal';
  const alertLabel = t ? t('landing_wa_alert') : '📌 EXAM ALERT';
  const msgPlaceholder = t ? t('landing_wa_msg_input') : 'Message…';
  const annotation = t ? t('landing_wa_annotation') : 'exam info buried under 200+ messages';

  function triggerEasterEgg() {
    if (easterEgg) return;
    setEasterEgg(true);
    setTimeout(() => setEasterEgg(false), 5000);
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 340, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #d4cfc6', boxShadow: '0 20px 60px rgba(0,0,0,.1), 0 4px 16px rgba(0,0,0,.06)' }}>
        {/* Header */}
        <div style={{ background: '#075e54', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 9, borderBottom: '1px solid #064d44', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#128c7e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'var(--mono)' }}>CS</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{groupName}</div>
            <div style={{ fontSize: 10, color: '#b0d9d1' }}>{membersLabel}</div>
          </div>
          <div
            onClick={triggerEasterEgg}
            style={{ color: '#b0d9d1', fontSize: 13, cursor: 'pointer', padding: '4px 2px', userSelect: 'none' }}
          >&#8942;</div>

          {/* Easter egg — cat chases rat across the header bar */}
          {easterEgg && (
            <>
              {/* Rat runs first */}
              <span style={{
                position: 'absolute',
                fontSize: 14,
                bottom: 2,
                left: -20,
                animation: 'ratRun 2.5s ease-in forwards',
                zIndex: 5,
                transform: 'scaleX(-1)',
              }}>🐭</span>
              {/* Cat follows */}
              <span style={{
                position: 'absolute',
                fontSize: 16,
                bottom: 1,
                left: -30,
                animation: 'catChase 3s ease-in forwards',
                animationDelay: '0.4s',
                zIndex: 4,
                opacity: 0,
                transform: 'scaleX(-1)',
              }}>🐱</span>
            </>
          )}
        </div>

        {/* Messages */}
        <div style={{ background: '#ece5dd', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5 L35 15 L25 15Z\' fill=\'%23d9d2c7\' opacity=\'0.3\'/%3E%3C/svg%3E")', height: 340, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {msgs.map((msg, i) => {
            const right = msg.side === 'right';

            if (msg.important) return (
              <div key={i} style={{ display: 'flex', justifyContent: isAr ? 'flex-end' : 'flex-start', animation: `waChatIn .3s ease ${i * 50}ms both` }}>
                <div
                  onClick={() => setRevealed(r => !r)}
                  style={{
                    maxWidth: '78%', background: revealed ? '#dcf8c6' : '#fff',
                    borderRadius: isAr ? '12px 2px 12px 12px' : '2px 12px 12px 12px', padding: '8px 10px',
                    border: `1.5px solid ${revealed ? ACCENT : 'rgba(155,143,194,.35)'}`,
                    cursor: 'pointer', boxShadow: revealed ? `0 0 12px rgba(155,143,194,.2)` : '0 1px 2px rgba(0,0,0,.08)',
                    transition: 'all .3s', textAlign: isAr ? 'right' : 'left',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#075e54', marginBottom: 3 }}>{msg.name}</div>
                  {revealed ? (
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: ACCENT, fontWeight: 700, marginBottom: 4 }}>{alertLabel}</div>
                      <div style={{ fontSize: 12, color: '#303030', lineHeight: 1.5 }}>{msg.realText}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 12, color: '#303030', marginBottom: 4 }}>{msg.text}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 6px', borderRadius: 3, background: 'rgba(220,50,40,.08)', color: '#dc3228', border: '1px solid rgba(220,50,40,.2)', display: 'inline-block', animation: 'spotlight 2.5s ease-in-out infinite' }}>
                        {tapLabel}
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 9, color: '#999', textAlign: 'right', marginTop: 3 }}>{msg.time}</div>
                </div>
              </div>
            );

            return (
              <div key={i} style={{ display: 'flex', justifyContent: right ? 'flex-end' : 'flex-start', animation: `${right ? 'waRightIn' : 'waChatIn'} .25s ease ${i * 45}ms both` }}>
                <div style={{ maxWidth: '75%', background: right ? '#dcf8c6' : '#fff', borderRadius: right ? '12px 2px 12px 12px' : '2px 12px 12px 12px', padding: '7px 10px', textAlign: isAr ? 'right' : 'left', boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}>
                  {!right && <div style={{ fontSize: 10, fontWeight: 700, color: '#075e54', marginBottom: 2 }}>{msg.name}</div>}
                  <div style={{ fontSize: 12, color: '#303030', lineHeight: 1.45 }}>{msg.text}</div>
                  <div style={{ fontSize: 9, color: '#999', textAlign: 'right', marginTop: 3 }}>{msg.time}{right && ' ✓✓'}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div style={{ background: '#f0f0f0', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 7, borderTop: '1px solid #ddd' }}>
          <input
            type="text"
            value={draftMsg}
            onChange={e => setDraftMsg(e.target.value)}
            placeholder={msgPlaceholder}
            style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '7px 13px', fontSize: 11, color: '#303030', border: '1px solid #e0e0e0', outline: 'none', fontFamily: 'var(--sans)' }}
          />
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✏️</div>
        </div>
      </div>

      {/* Annotation — flips to left side in Arabic */}
      <div style={{
        position: 'absolute', top: '48%',
        ...(isAr ? { left: -105 } : { right: -100 }),
        transform: 'translateY(-50%)', width: 92,
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#1a1a1a', letterSpacing: '.05em', lineHeight: 1.6, textAlign: isAr ? 'right' : 'left' }}>
          {annotation}
        </div>
      </div>

      {/* Easter egg animation keyframes */}
      <style>{`
        @keyframes ratRun {
          0% { left: -20px; opacity: 1; }
          70% { left: calc(100% + 10px); opacity: 1; }
          85% { left: calc(100% + 10px); opacity: 1; transform: scaleX(-1) translateY(0); }
          100% { left: calc(100% + 10px); opacity: 0; transform: scaleX(-1) translateY(8px); }
        }
        @keyframes catChase {
          0% { left: -30px; opacity: 1; }
          65% { left: calc(100% - 30px); opacity: 1; }
          75% { left: calc(100% - 30px); opacity: 1; transform: scaleX(-1); }
          80% { left: calc(100% + 10px); opacity: 1; transform: scaleX(-1); }
          100% { left: calc(100% + 10px); opacity: 0; transform: scaleX(-1) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
