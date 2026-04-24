'use client';
import { LIME } from '@/lib/constants';

export default function PulseDot() {
  return (
    <span
      style={{
        display: 'inline-block', width: 7, height: 7,
        borderRadius: '50%', background: 'var(--lime)',
        animation: 'blink-dot 2s ease-in-out infinite',
        flexShrink: 0,
        verticalAlign: '0.12em',
      }}
    />
  );
}
