'use client';
import { useState, useEffect } from 'react';
import { getPosts } from '@/lib/storage';
import { INITIAL_POSTS } from '@/lib/constants';
import Sidebar from '@/components/Sidebar';
import FeedView from '@/components/views/FeedView';
import CalendarView from '@/components/views/CalendarView';
import FinalsView from '@/components/views/FinalsView';
import ForumsView from '@/components/views/ForumsView';
import CoursesView from '@/components/views/CoursesView';
import MessagesView from '@/components/views/MessagesView';
import PostEventView from '@/components/views/PostEventView';
import GuidedTour from '@/components/GuidedTour';

export default function AppShell({ myUser, onLogout }) {
  const [page, setPage] = useState(() => {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('pulsara_page') || 'feed';
    }
    return 'feed';
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(e => console.error('AppShell getPosts error:', e))
      .finally(() => setIsLoading(false));
  }, []);

  function handleSetPage(p) {
    setPage(p);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('pulsara_page', p);
  }

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <Sidebar page={page} setPage={handleSetPage} myUser={myUser} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={onLogout} />

      <div className="mobile-topbar" style={{ display: 'none', alignItems: 'center', padding: '12px 16px', background: 'var(--s1)', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setMobileOpen(true)}
          style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >☰</button>
        <div onClick={onLogout} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 18, letterSpacing: '-.02em', cursor: 'pointer' }}>Pulsara</div>
        <div style={{ width: 32 }} />
      </div>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {page === 'feed'     && <FeedView posts={posts} setPosts={setPosts} myUser={myUser} isLoading={isLoading} />}
        {page === 'calendar' && <CalendarView posts={posts} />}
        {page === 'finals'   && <FinalsView />}
        {page === 'forums'   && <ForumsView myUser={myUser} setPage={handleSetPage} />}
        {page === 'courses'  && <CoursesView posts={posts} />}
        {page === 'messages' && <MessagesView myUser={myUser} />}
        {page === 'post'     && <PostEventView myUser={myUser} posts={posts} setPosts={setPosts} onPosted={() => handleSetPage('feed')} />}
      </main>

      <GuidedTour />
    </div>
  );
}
