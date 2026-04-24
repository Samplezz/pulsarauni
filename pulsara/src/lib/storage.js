import { supabase } from './supabase';
import { INITIAL_POSTS, INITIAL_THREADS } from './constants';

/* ─── LOCAL STORAGE FALLBACK ─────────────────────── */
function lsGet(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? fallback; }
  catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); }
  catch (e) { console.error('localStorage write failed:', e); }
}

/* ─── WAITLIST ───────────────────────────────────── */
export async function addToWaitlist(email) {
  if (supabase) {
    try {
      const { error } = await supabase.from('waitlist').upsert({ email }, { onConflict: 'email' });
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Waitlist error:', e);
    }
  }
  const list = lsGet('pulsara_waitlist', []);
  if (!list.includes(email)) { list.push(email); lsSet('pulsara_waitlist', list); }
  return true;
}

/* ─── USER ───────────────────────────────────────── */
export function getUser() { return lsGet('pulsara_user_v2', null); }

export async function saveUser(u) {
  lsSet('pulsara_user_v2', u);
  if (supabase) {
    try {
      await supabase.from('users').upsert(
        { email: u.email, username: u.username, joined_at: new Date(u.joinedAt).toISOString() },
        { onConflict: 'email' }
      );
    } catch (e) {
      console.error('saveUser error:', e);
    }
  }
}

/* ─── POSTS ──────────────────────────────────────── */
export async function getPosts() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (e) {
      console.error('getPosts error:', e);
    }
  }
  return lsGet('pulsara_posts', INITIAL_POSTS);
}

export async function savePosts(p) {
  lsSet('pulsara_posts', p);
}

export async function savePost(post) {
  lsSet('pulsara_posts', [...lsGet('pulsara_posts', INITIAL_POSTS).filter(p => p.id !== post.id), post]);
  if (supabase) {
    try {
      await supabase.from('posts').upsert({
        id: typeof post.id === 'number' ? undefined : post.id,
        type: post.type, title: post.title, course: post.course,
        prof: post.prof, date: post.date, time: post.time,
        notes: post.notes, author: post.author, upvotes: post.upvotes,
        status: post.status,
      });
    } catch (e) {
      console.error('savePost error:', e);
    }
  }
}

export async function updatePostStatus(id, status) {
  const posts = lsGet('pulsara_posts', INITIAL_POSTS);
  const updated = posts.map(p => p.id === id ? { ...p, status } : p);
  lsSet('pulsara_posts', updated);
  if (supabase) {
    try {
      await supabase.from('posts').update({ status }).eq('id', id);
    } catch (e) {
      console.error('updatePostStatus error:', e);
    }
  }
  return updated;
}

/* ─── VOTES ──────────────────────────────────────── */
export function getVotes() { return lsGet('pulsara_votes', []); }
export function saveVotes(v) { lsSet('pulsara_votes', v); }

export async function toggleVote(postId, username) {
  const votes = getVotes();
  const was = votes.includes(postId);
  const next = was ? votes.filter(v => v !== postId) : [...votes, postId];
  // Write localStorage first to avoid race condition
  saveVotes(next);
  if (supabase) {
    try {
      if (was) {
        await supabase.from('votes').delete().match({ user_username: username, post_id: postId });
      } else {
        await supabase.from('votes').upsert({ user_username: username, post_id: postId });
      }
    } catch (e) {
      console.error('toggleVote error:', e);
    }
  }
  return { wasVoted: was, newVotes: next };
}

/* ─── REPORTS ────────────────────────────────────── */
export function getReports() { return lsGet('pulsara_reports', []); }

export async function saveReport(report) {
  const reports = getReports();
  const updated = [...reports, report];
  lsSet('pulsara_reports', updated);
  if (supabase) {
    try {
      await supabase.from('reports').insert({
        category: report.category, description: report.desc,
        screenshot_name: report.screenshotName, author: report.author,
        status: report.status,
      });
    } catch (e) {
      console.error('saveReport error:', e);
    }
  }
  return updated;
}

export function saveReports(r) { lsSet('pulsara_reports', r); }

export async function dismissReportById(id) {
  const reports = getReports();
  const updated = reports.map(r => r.id === id ? { ...r, status: 'dismissed' } : r);
  lsSet('pulsara_reports', updated);
  if (supabase) {
    try {
      await supabase.from('reports').update({ status: 'dismissed' }).eq('id', id);
    } catch (e) {
      console.error('dismissReportById error:', e);
    }
  }
  return updated;
}

/* ─── THREADS ────────────────────────────────────── */
export async function getThreads() {
  if (supabase) {
    try {
      const { data: threads, error } = await supabase
        .from('threads').select('*, replies(*)').order('created_at', { ascending: false });
      if (error) throw error;
      if (threads && threads.length > 0) {
        return threads.map(t => ({
          id: t.id, title: t.title, body: t.body, author: t.author,
          tag: t.tag, upvotes: t.upvotes, created: formatTimeAgo(t.created_at),
          replies: (t.replies || []).map(r => ({
            id: r.id, author: r.author, text: r.text, time: formatTimeAgo(r.created_at),
          })),
        }));
      }
    } catch (e) {
      console.error('getThreads error:', e);
    }
  }
  return lsGet('pulsara_threads', INITIAL_THREADS);
}

export function saveThreads(t) { lsSet('pulsara_threads', t); }

export async function createThread(thread) {
  const threads = lsGet('pulsara_threads', INITIAL_THREADS);
  const updated = [thread, ...threads];
  lsSet('pulsara_threads', updated);
  if (supabase) {
    try {
      await supabase.from('threads').insert({
        title: thread.title, body: thread.body || null,
        author: thread.author, tag: thread.tag, upvotes: 0,
      });
    } catch (e) {
      console.error('createThread error:', e);
    }
  }
  return updated;
}

export async function addReplyToThread(threadId, reply) {
  const threads = lsGet('pulsara_threads', INITIAL_THREADS);
  const updated = threads.map(t =>
    t.id === threadId ? { ...t, replies: [...t.replies, reply] } : t
  );
  lsSet('pulsara_threads', updated);
  if (supabase) {
    try {
      await supabase.from('replies').insert({
        thread_id: threadId, author: reply.author, text: reply.text,
      });
    } catch (e) {
      console.error('addReplyToThread error:', e);
    }
  }
  return updated;
}

/* ─── DIRECT MESSAGES ────────────────────────────── */
export async function getConversations(myUser) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender.eq.${myUser},receiver.eq.${myUser}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        const convos = new Map();
        data.forEach(m => {
          const other = m.sender === myUser ? m.receiver : m.sender;
          if (!convos.has(other)) convos.set(other, { withUser: other, lastMessage: m.text, time: formatTimeAgo(m.created_at), timestamp: new Date(m.created_at).getTime() });
        });
        return Array.from(convos.values()).sort((a, b) => b.timestamp - a.timestamp);
      }
    } catch (e) {
      console.error('getConversations error:', e);
    }
  }
  const msgs = lsGet('pulsara_messages', []);
  const myMsgs = msgs.filter(m => m.sender === myUser || m.receiver === myUser).sort((a, b) => b.timestamp - a.timestamp);
  const convos = new Map();
  myMsgs.forEach(m => {
    const other = m.sender === myUser ? m.receiver : m.sender;
    if (!convos.has(other)) convos.set(other, { withUser: other, lastMessage: m.text, time: formatTimeAgo(m.timestamp), timestamp: m.timestamp });
  });
  return Array.from(convos.values());
}

export async function getMessages(myUser, otherUser) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender.eq.${myUser},receiver.eq.${otherUser}),and(sender.eq.${otherUser},receiver.eq.${myUser})`)
        .order('created_at', { ascending: true });
      if (error) throw error;
      if (data) {
        return data.map(m => ({ id: m.id, sender: m.sender, receiver: m.receiver, text: m.text, time: formatTimeAgo(m.created_at) }));
      }
    } catch (e) {
      console.error('getMessages error:', e);
    }
  }
  const msgs = lsGet('pulsara_messages', []);
  return msgs
    .filter(m => (m.sender === myUser && m.receiver === otherUser) || (m.sender === otherUser && m.receiver === myUser))
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(m => ({ ...m, time: formatTimeAgo(m.timestamp) }));
}

export async function sendMessage(sender, receiver, text) {
  const now = new Date().toISOString();
  const msg = { id: Date.now(), sender, receiver, text, timestamp: Date.now() };
  // Always write to localStorage for instant optimistic update
  const msgs = lsGet('pulsara_messages', []);
  lsSet('pulsara_messages', [...msgs, msg]);
  if (supabase) {
    try {
      await supabase.from('messages').insert({ sender, receiver, text, created_at: now });
    } catch (e) {
      console.error('sendMessage error:', e);
    }
  }
  return msg;
}

/* ─── HELPERS ────────────────────────────────────── */
function formatTimeAgo(dateStr) {
  if (!dateStr) return 'just now';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
