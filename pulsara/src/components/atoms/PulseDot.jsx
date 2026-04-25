'use client';

export default function PulseDot() {
  return (
    <span
      style={{
        display: 'inline-block', width: 7, height: 7,
        borderRadius: '50%', background: '#c47a5a',
        animation: 'blink-dot 2s ease-in-out infinite',
        flexShrink: 0,
        verticalAlign: '0.12em',
      }}
    />
  );
}
