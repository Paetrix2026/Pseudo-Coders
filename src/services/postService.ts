/**
 * postService.ts
 *
 * Abstracts all community (shoutouts + forum) localStorage access.
 * Async-ready for Firebase migration.
 *
 * Keys:
 *   community_posts_v4   – shoutout posts
 *   community_forum_v1   – forum posts
 */

import type { Post, ForumPost } from '../context/CommunityContext';

const POSTS_KEY = 'community_posts_v4';
const FORUM_KEY = 'community_forum_v1';

// ── Shoutout posts ────────────────────────────

export async function getPosts(): Promise<Post[]> {
  const raw = localStorage.getItem(POSTS_KEY);
  if (!raw) return [];
  // Migrate: convert numeric likes → likedBy array if old data
  const parsed: any[] = JSON.parse(raw);
  return parsed.map(p => ({
    ...p,
    likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
  }));
}

export async function savePosts(posts: Post[]): Promise<void> {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export async function addPost(post: Post, existing: Post[]): Promise<Post[]> {
  const updated = [post, ...existing];
  await savePosts(updated);
  return updated;
}

export async function likePost(
  postId: string,
  userEmail: string,
  existing: Post[]
): Promise<Post[]> {
  const updated = existing.map(p => {
    if (p.id !== postId) return p;
    if (p.likedBy.includes(userEmail)) return p; // idempotent
    return { ...p, likedBy: [...p.likedBy, userEmail] };
  });
  await savePosts(updated);
  return updated;
}

export async function addReply(
  postId: string,
  reply: Post['replies'][number],
  existing: Post[]
): Promise<Post[]> {
  const updated = existing.map(p =>
    p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
  );
  await savePosts(updated);
  return updated;
}

// ── Forum posts ───────────────────────────────

export async function getForumPosts(): Promise<ForumPost[]> {
  const raw = localStorage.getItem(FORUM_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveForumPosts(posts: ForumPost[]): Promise<void> {
  localStorage.setItem(FORUM_KEY, JSON.stringify(posts));
}

export async function addForumPost(post: ForumPost, existing: ForumPost[]): Promise<ForumPost[]> {
  const updated = [post, ...existing];
  await saveForumPosts(updated);
  return updated;
}

export async function addForumReply(
  forumPostId: string,
  reply: ForumPost['replies'][number],
  existing: ForumPost[]
): Promise<ForumPost[]> {
  const updated = existing.map(p =>
    p.id === forumPostId ? { ...p, replies: [...p.replies, reply] } : p
  );
  await saveForumPosts(updated);
  return updated;
}
