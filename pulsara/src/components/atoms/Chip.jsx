'use client';

export default function Chip({ label, color = 'var(--muted)', bg = 'var(--s3)' }) {
  return (
    <span
      style={{
        fontFamily: 'var(--mono)', fontSize: 9,
        fontWeight: 700, letterSpacing: '.07em',
        padding: '2px 7px', borderRadius: 4,
        color, background: bg,
        border: `1px solid ${color}33`,
      }}
    >
      {label}
    </span>
  );
}
