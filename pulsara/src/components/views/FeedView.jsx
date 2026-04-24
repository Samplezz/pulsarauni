'use client';
import { useState } from 'react';
import { LIME, TYPE_CFG } from '@/lib/constants';
import { savePosts } from '@/lib/storage';
import PostCard from '@/components/PostCard';
import { useLanguage } from '@/lib/i18n';

export default function FeedView({ posts, setPosts, myUser, isLoading = false }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('ALL');
  const [myVotes, setMyVotes] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem('pulsara_votes_obj') || 'null');
      if (v) return v;
      // migrate old array format
      const old = JSON.parse(localStorage.getItem('pulsara_votes') || '[]');
      const migrated = {};
      if (Array.isArray(old)) old.forEach(id => { migrated[id] = 1; });
      return migrated;
    } catch { return {}; }
  });

  const approved = posts.filter(p => p.status !== 'deleted');
  const filtered = filter === 'ALL' ? approved : approved.filter(p => p.type === filter);

  function handleVote(postId) {
    if (!myUser) return;
    const current = myVotes[postId] || 0;
    const isUpvoting = current !== 1;
    const change = isUpvoting ? 1 : -1;

    setMyVotes({ ...myVotes, [postId]: isUpvoting ? 1 : 0 });
    localStorage.setItem('pulsara_votes_obj', JSON.stringify({ ...myVotes, [postId]: isUpvoting ? 1 : 0 }));

    const updated = posts.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + change } : p);
    setPosts(updated);
    savePosts(updated);
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Header */}
      <div className="mobile-pad-left" style={{ padding: '18px 22px 0', borderBottom: '1px solid var(--border)', background: 'var(--s1)' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 400, marginBottom: 2 }}>{t('feed_title')}</h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 20 }}>{t('feed_subtitle')}</p>

        <div style={{ display: 'flex', gap: 3 }}>
          {['ALL', 'EXAM', 'QUIZ', 'ASSIGNMENT'].map(f => {
            const active = filter === f;
            const cfg = f !== 'ALL' ? TYPE_CFG[f] : null;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 13px', borderRadius: '6px 6px 0 0',
                background: active ? 'var(--bg)' : 'none',
                border: `1px solid ${active ? 'var(--border)' : 'transparent'}`,
                borderBottom: active ? '1px solid var(--bg)' : '1px solid transparent',
                color: active ? (cfg ? cfg.color : LIME) : 'var(--muted)',
                fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
                letterSpacing: '.07em', cursor: 'pointer', transition: 'all .15s',
                marginBottom: '-1px',
              }}>{f === 'ALL' ? t('feed_filter_all') : f}</button>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isLoading ? (
          [1, 2, 3].map(n => (
            <div key={n} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10, padding: '15px 17px', opacity: .4, animation: 'fadeIn .5s ease' }}>
              <div style={{ height: 12, background: 'var(--s3)', borderRadius: 4, width: '40%', marginBottom: 10 }} />
              <div style={{ height: 14, background: 'var(--s3)', borderRadius: 4, width: '70%', marginBottom: 6 }} />
              <div style={{ height: 10, background: 'var(--s3)', borderRadius: 4, width: '30%' }} />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 12, textAlign: 'center', paddingTop: 40 }}>
            No events for this filter.
          </div>
        ) : (
          filtered.map((p, i) => (
            <PostCard key={p.id} post={p} myVotes={myVotes} onVote={handleVote} myUser={myUser} delay={i * 35} />
          ))
        )}
      </div>
    </div>
  );
}
