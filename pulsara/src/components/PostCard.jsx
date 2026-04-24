'use client';
import { TYPE_CFG, EXAM_C, fmtDate, daysUntil } from '@/lib/constants';
import Badge from '@/components/atoms/Badge';
import Chip from '@/components/atoms/Chip';

const VERIFIED_THRESHOLD = 5;

function VoteButton({ postId, myVote, upvotes, onVote }) {
  const voted = myVote === 1;
  return (
    <button
      onClick={() => onVote(postId)}
      aria-label={voted ? 'Remove upvote' : 'Upvote'}
      style={{
        background: voted ? 'rgba(212,255,58,.12)' : 'var(--s3)',
        border: `1px solid ${voted ? 'rgba(212,255,58,.4)' : 'var(--border2)'}`,
        boxShadow: voted ? '0 0 8px var(--lime)' : 'none',
        borderRadius: 6, padding: '4px 9px', cursor: 'pointer',
        color: voted ? 'var(--lime)' : 'var(--muted2)',
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 4,
        transition: 'all .15s',
      }}
    >
      <span>{voted ? '✓' : '↑'}</span>{upvotes}
    </button>
  );
}

function VerifiedBadge({ upvotes }) {
  const verified = upvotes >= VERIFIED_THRESHOLD;
  const remaining = Math.max(0, VERIFIED_THRESHOLD - upvotes);
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: 10,
      color: verified ? 'var(--lime)' : 'var(--muted)',
    }}>
      {verified ? '✓ Verified' : `○ ${remaining} more`}
    </span>
  );
}

export default function PostCard({ post, myVotes, onVote, myUser, delay = 0, compact = false }) {
  const myVote = myVotes[post.id] || 0;
  const verified = post.upvotes >= VERIFIED_THRESHOLD;
  const isMine = post.author === myUser;
  const cfg = TYPE_CFG[post.type] || TYPE_CFG.OTHER;
  const days = daysUntil(post.date);
  const urgent = ['Today', 'Tomorrow'].includes(days);

  return (
    <div
      style={{
        background: isMine ? '#13140e' : 'var(--s1)',
        border: `1px solid ${verified ? cfg.color + '33' : 'var(--border)'}`,
        borderLeft: `3px solid ${verified ? cfg.color : 'transparent'}`,
        borderRadius: 10, padding: compact ? '12px 14px' : '15px 17px',
        opacity: verified ? 1 : .88,
        animation: `cardIn .35s ease ${delay}ms both`,
        transition: 'border-color .2s,transform .15s,box-shadow .15s',
        position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.5)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {isMine && (
        <span style={{
          position: 'absolute', top: 10, right: 12,
          fontFamily: 'var(--mono)', fontSize: 9,
          color: 'var(--lime)', opacity: .7, letterSpacing: '.06em',
        }}>YOUR POST</span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <Badge type={post.type} />
        {urgent && <Chip label={days.toUpperCase()} color="var(--danger)" bg="rgba(255,77,58,.12)" />}
        <div style={{ flex: 1 }} />
        <VerifiedBadge upvotes={post.upvotes} />
      </div>

      <div style={{ fontSize: compact ? 13 : 15, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>
        {post.title}
      </div>

      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted2)',
        marginBottom: post.notes ? 9 : 11, display: 'flex', gap: 10, flexWrap: 'wrap',
      }}>
        <span>{post.course}</span>
        {post.prof && <span>{post.prof}</span>}
      </div>

      {post.notes && !compact && (
        <div style={{
          fontSize: 12, color: 'var(--muted)', marginBottom: 11,
          fontStyle: 'italic', lineHeight: 1.4,
          borderLeft: '2px solid var(--border2)', paddingLeft: 8,
        }}>{post.notes}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: urgent ? 'var(--danger)' : 'var(--muted2)' }}>
          {fmtDate(post.date)}
        </span>
        <span style={{ color: 'var(--border2)' }}>·</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{post.time}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lime)', fontWeight: 600 }}>
          @{post.author}
        </span>
        <VoteButton postId={post.id} myVote={myVote} upvotes={post.upvotes} onVote={onVote} />
      </div>
    </div>
  );
}
