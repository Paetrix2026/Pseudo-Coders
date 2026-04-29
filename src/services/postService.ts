/**
 * postService.ts
 *
 * Abstracts all community (shoutouts + forum) access.
 * Connected to Firebase Firestore.
 */

import { collection, doc, getDocs, query, where, writeBatch, setDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Post, ForumPost } from '../context/CommunityContext';

// ── Shoutout posts ────────────────────────────

export async function getPosts(): Promise<Post[]> {
  try {
    const q = query(
      collection(db, 'posts'), 
      where('type', '==', 'shoutout'),
      orderBy('createdAt', 'desc')
    );
    const postsSnap = await getDocs(q);
    const posts: Post[] = [];
    
    for (const docSnap of postsSnap.docs) {
      const data = docSnap.data();
      
      const repliesSnap = await getDocs(collection(db, 'posts', docSnap.id, 'replies'));
      const replies = repliesSnap.docs.map(rSnap => {
        const rData = rSnap.data();
        return {
          id: rSnap.id,
          author: rData.authorId || 'Anonymous',
          content: rData.text || '',
          timestamp: rData.createdAt?.toDate ? rData.createdAt.toDate().toLocaleString() : 'Just now'
        };
      });
      
      replies.sort((a, b) => a.id.localeCompare(b.id));

      posts.push({
        id: docSnap.id,
        author: data.authorId || 'Anonymous',
        content: data.content || '',
        likedBy: data.likes || [],
        replies,
        timestamp: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'Just now'
      });
    }
    
    return posts;
  } catch (err) {
    console.error('Error fetching posts:', err);
    return [];
  }
}

export async function savePosts(posts: Post[]): Promise<void> {
  if (!posts || posts.length === 0) return;
  try {
    const batch = writeBatch(db);
    posts.forEach(post => {
      const postRef = doc(db, 'posts', post.id);
      batch.set(postRef, {
        type: 'shoutout',
        title: '',
        content: post.content,
        authorId: post.author,
        isAnonymous: post.author === 'Anonymous',
        likes: post.likedBy,
        createdAt: new Date(parseInt(post.id) || Date.now())
      }, { merge: true });
      
      post.replies.forEach(reply => {
        const replyRef = doc(db, 'posts', post.id, 'replies', reply.id);
        batch.set(replyRef, {
          text: reply.content,
          authorId: reply.author,
          createdAt: new Date(parseInt(reply.id) || Date.now())
        }, { merge: true });
      });
    });
    await batch.commit();
  } catch (err) {
    console.error('Error saving posts:', err);
  }
}

export async function addPost(post: Post, existing: Post[]): Promise<Post[]> {
  try {
    const postRef = doc(db, 'posts', post.id);
    await setDoc(postRef, {
      type: 'shoutout',
      title: '',
      content: post.content,
      authorId: post.author,
      isAnonymous: post.author === 'Anonymous',
      likes: post.likedBy,
      createdAt: new Date(parseInt(post.id) || Date.now())
    });
    return [post, ...existing];
  } catch (error) {
    console.error('Error adding post:', error);
    return existing;
  }
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
  try {
    const replyRef = doc(db, 'posts', postId, 'replies', reply.id);
    await setDoc(replyRef, {
      text: reply.content,
      authorId: reply.author,
      createdAt: new Date(parseInt(reply.id) || Date.now())
    });
    
    return existing.map(p =>
      p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
    );
  } catch (error) {
    console.error('Error adding reply:', error);
    return existing;
  }
}

// ── Forum posts ───────────────────────────────

export async function getForumPosts(): Promise<ForumPost[]> {
  try {
    const q = query(
      collection(db, 'posts'), 
      where('type', '==', 'forum'),
      orderBy('createdAt', 'desc')
    );
    const postsSnap = await getDocs(q);
    const posts: ForumPost[] = [];
    
    for (const docSnap of postsSnap.docs) {
      const data = docSnap.data();
      
      const repliesSnap = await getDocs(collection(db, 'posts', docSnap.id, 'replies'));
      const replies = repliesSnap.docs.map(rSnap => {
        const rData = rSnap.data();
        return {
          id: rSnap.id,
          text: rData.text || '',
          author: rData.authorId || 'Anonymous',
          createdAt: rData.createdAt?.toDate ? rData.createdAt.toDate().toLocaleString() : 'Just now'
        };
      });
      
      replies.sort((a, b) => a.id.localeCompare(b.id));

      posts.push({
        id: docSnap.id,
        title: data.title || '',
        content: data.content || '',
        author: data.authorId || 'Anonymous',
        replies,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'Just now'
      });
    }
    
    return posts;
  } catch (err) {
    console.error('Error fetching forum posts:', err);
    return [];
  }
}

export async function saveForumPosts(posts: ForumPost[]): Promise<void> {
  if (!posts || posts.length === 0) return;
  try {
    const batch = writeBatch(db);
    posts.forEach(post => {
      const postRef = doc(db, 'posts', post.id);
      batch.set(postRef, {
        type: 'forum',
        title: post.title,
        content: post.content,
        authorId: post.author,
        isAnonymous: post.author === 'Anonymous',
        likes: [],
        createdAt: new Date(parseInt(post.id) || Date.now())
      }, { merge: true });
      
      post.replies.forEach(reply => {
        const replyRef = doc(db, 'posts', post.id, 'replies', reply.id);
        batch.set(replyRef, {
          text: reply.text,
          authorId: reply.author,
          createdAt: new Date(parseInt(reply.id) || Date.now())
        }, { merge: true });
      });
    });
    await batch.commit();
  } catch (err) {
    console.error('Error saving forum posts:', err);
  }
}

export async function addForumPost(post: ForumPost, existing: ForumPost[]): Promise<ForumPost[]> {
  try {
    const postRef = doc(db, 'posts', post.id);
    await setDoc(postRef, {
      type: 'forum',
      title: post.title,
      content: post.content,
      authorId: post.author,
      isAnonymous: post.author === 'Anonymous',
      likes: [],
      createdAt: new Date(parseInt(post.id) || Date.now())
    });
    return [post, ...existing];
  } catch (error) {
    console.error('Error adding forum post:', error);
    return existing;
  }
}

export async function addForumReply(
  forumPostId: string,
  reply: ForumPost['replies'][number],
  existing: ForumPost[]
): Promise<ForumPost[]> {
  try {
    const replyRef = doc(db, 'posts', forumPostId, 'replies', reply.id);
    await setDoc(replyRef, {
      text: reply.text,
      authorId: reply.author,
      createdAt: new Date(parseInt(reply.id) || Date.now())
    });
    
    return existing.map(p =>
      p.id === forumPostId ? { ...p, replies: [...p.replies, reply] } : p
    );
  } catch (error) {
    console.error('Error adding forum reply:', error);
    return existing;
  }
}
