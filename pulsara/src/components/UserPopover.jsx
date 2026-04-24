import { LIME, EXAM_C } from '@/lib/constants';

export default function UserPopover({ username, x, y, onTag, onMessage, onClose }) {
  return (
    <>
      {/* Invisible backdrop to catch outside clicks */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
      
      <div style={{
        position: 'fixed', left: x, top: y, zIndex: 200,
        background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,.4)', padding: '6px',
        display: 'flex', flexDirection: 'column', gap: 2, minWidth: 140,
        animation: 'popIn .15s ease'
      }}>
        <div style={{ padding: '6px 10px', fontFamily: 'var(--mono)', fontSize: 12, color: LIME, fontWeight: 700, borderBottom: '1px solid var(--border)', marginBottom: 2 }}>
          @{username}
        </div>
        
        <button onClick={() => { onTag(username); onClose(); }} style={{
          background: 'none', border: 'none', textAlign: 'left', padding: '8px 10px',
          color: 'var(--text)', fontFamily: 'var(--sans)', fontSize: 13, cursor: 'pointer',
          borderRadius: 6, transition: 'background .15s'
        }} onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <span style={{ marginRight: 8 }}>@</span>Tag User
        </button>
        
        <button onClick={() => { onMessage(username); onClose(); }} style={{
          background: 'none', border: 'none', textAlign: 'left', padding: '8px 10px',
          color: 'var(--text)', fontFamily: 'var(--sans)', fontSize: 13, cursor: 'pointer',
          borderRadius: 6, transition: 'background .15s'
        }} onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <span style={{ marginRight: 8 }}>✉</span>Message
        </button>
      </div>
    </>
  );
}
