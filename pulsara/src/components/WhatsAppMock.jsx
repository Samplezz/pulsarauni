'use client';
import { useState } from 'react';
import { LIME } from '@/lib/constants';

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
  const isAr = lang === 'ar';
  const msgs = isAr ? AR_MSGS : EN_MSGS;
  const groupName = t ? t('landing_wa_group') : 'CS Faculty 2026 🎓';
  const membersLabel = t ? t('landing_wa_members') : '342 members';
  const tapLabel = t ? t('landing_wa_tap') : '⚠ important info — tap to reveal';
  const alertLabel = t ? t('landing_wa_alert') : '📌 EXAM ALERT';
  const msgPlaceholder = t ? t('landing_wa_msg_input') : 'Message…';
  const annotation = t ? t('landing_wa_annotation') : 'exam info buried under 200+ messages';

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 340, margin: '0 auto' }}>
      <div style={{ background: '#1f1f1f', borderRadius: 20, overflow: 'hidden', border: '1px solid #333', boxShadow: '0 40px 80px rgba(0,0,0,.6)' }}>
        {/* Header */}
        <div style={{ background: '#1a2f25', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 9, borderBottom: '1px solid #2a3f30' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2d5a3d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#5ddb8a', fontFamily: 'var(--mono)' }}>CS</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e9e9e9' }}>{groupName}</div>
            <div style={{ fontSize: 10, color: '#6db87e' }}>{membersLabel}</div>
          </div>
          <div style={{ color: '#6db87e', fontSize: 13 }}>&#8942;</div>
        </div>

        {/* Messages */}
        <div style={{ background: '#0d1f18', backgroundImage: 'radial-gradient(circle at 1px 1px,#1a2f1e 1px,transparent 0)', backgroundSize: '24px 24px', height: 340, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {msgs.map((msg, i) => {
            const right = msg.side === 'right';

            if (msg.important) return (
              <div key={i} style={{ display: 'flex', justifyContent: isAr ? 'flex-end' : 'flex-start', animation: `waChatIn .3s ease ${i * 50}ms both` }}>
                <div
                  onClick={() => setRevealed(r => !r)}
                  style={{
                    maxWidth: '78%', background: revealed ? '#0d2d1a' : '#1a2a1a',
                    borderRadius: isAr ? '12px 2px 12px 12px' : '2px 12px 12px 12px', padding: '8px 10px',
                    border: `1.5px solid ${revealed ? LIME : 'rgba(212,255,58,.25)'}`,
                    cursor: 'pointer', boxShadow: revealed ? '0 0 16px rgba(212,255,58,.2)' : 'none',
                    transition: 'all .3s', textAlign: isAr ? 'right' : 'left',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#5ddb8a', marginBottom: 3 }}>{msg.name}</div>
                  {revealed ? (
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: LIME, fontWeight: 700, marginBottom: 4 }}>{alertLabel}</div>
                      <div style={{ fontSize: 12, color: '#d4e8d4', lineHeight: 1.5 }}>{msg.realText}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 12, color: '#c8e6c9', marginBottom: 4 }}>{msg.text}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 6px', borderRadius: 3, background: 'rgba(212,255,58,.08)', color: LIME, border: '1px solid rgba(212,255,58,.2)', display: 'inline-block', animation: 'spotlight 2.5s ease-in-out infinite' }}>
                        {tapLabel}
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 9, color: '#4a7a4e', textAlign: 'right', marginTop: 3 }}>{msg.time}</div>
                </div>
              </div>
            );

            return (
              <div key={i} style={{ display: 'flex', justifyContent: right ? 'flex-end' : 'flex-start', animation: `${right ? 'waRightIn' : 'waChatIn'} .25s ease ${i * 45}ms both` }}>
                <div style={{ maxWidth: '75%', background: right ? '#005c4b' : '#1f2e23', borderRadius: right ? '12px 2px 12px 12px' : '2px 12px 12px 12px', padding: '7px 10px', textAlign: isAr ? 'right' : 'left' }}>
                  {!right && <div style={{ fontSize: 10, fontWeight: 700, color: '#5ddb8a', marginBottom: 2 }}>{msg.name}</div>}
                  <div style={{ fontSize: 12, color: right ? '#d9fdd3' : '#c8e6c9', lineHeight: 1.45 }}>{msg.text}</div>
                  <div style={{ fontSize: 9, color: right ? '#53b39c' : '#4a7a4e', textAlign: 'right', marginTop: 3 }}>{msg.time}{right && ' ✓✓'}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div style={{ background: '#1f2e23', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 7, borderTop: '1px solid #2a3f2e' }}>
          <div style={{ flex: 1, background: '#2d3d30', borderRadius: 20, padding: '7px 13px', fontSize: 11, color: '#6a8a6e' }}>{msgPlaceholder}</div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🎤</div>
        </div>
      </div>

      {/* Annotation — flips to left side in Arabic */}
      <div style={{
        position: 'absolute', top: '48%',
        ...(isAr ? { left: -105 } : { right: -100 }),
        transform: 'translateY(-50%)', width: 92,
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: LIME, letterSpacing: '.05em', lineHeight: 1.6, textAlign: isAr ? 'right' : 'left' }}>
          {annotation}
        </div>
      </div>
    </div>
  );
}
