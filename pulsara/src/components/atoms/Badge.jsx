'use client';
import { TYPE_CFG } from '@/lib/constants';

export default function Badge({ type, small }) {
  const c = TYPE_CFG[type] || TYPE_CFG.OTHER;
  return (
    <span
      style={{
        fontFamily: 'var(--mono)', fontSize: small ? 9 : 10,
        fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
        padding: small ? '2px 5px' : '3px 7px', borderRadius: 4,
        color: c.color, background: c.bg,
        border: `1px solid ${c.color}33`,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {c.label}
    </span>
  );
}
