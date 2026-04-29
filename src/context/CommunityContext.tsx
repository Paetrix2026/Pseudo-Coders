import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getPosts,
  savePosts,
  getForumPosts,
  saveForumPosts,
} from '../services/postService';

// ─── Shoutout Types ───────────────────────────

export interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  likedBy: string[];   // array of user emails — replaces plain `likes` number
  replies: Reply[];
  timestamp: string;
}

// ─── Forum Types ──────────────────────────────

export interface ForumReply {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  replies: ForumReply[];
}

// ─── Context Type ─────────────────────────────

interface CommunityContextType {
  // Shoutouts
  posts: Post[];
  addPost: (content: string, author: string) => void;
  likePost: (postId: string, userEmail: string) => void;
  replyToPost: (postId: string, content: string, author: string) => void;
  // Forum
  forumPosts: ForumPost[];
  addForumPost: (title: string, content: string, author: string) => void;
  addForumReply: (forumPostId: string, text: string, author: string) => void;
}

// ─── Seed Data ────────────────────────────────

const defaultPosts: Post[] = [
  {
    id: '1',
    author: 'Alex M.',
    content: 'Just finished my math assignment using the ADHD mode! Breaking it down into steps helped me avoid getting overwhelmed. 🎉',
    likedBy: [],
    replies: [
      { id: 'r1', author: 'Sarah K.', content: 'That is awesome! Keep it up.', timestamp: '1 hour ago' }
    ],
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    author: 'Sarah K.',
    content: 'The dyslexia mode makes reading my history texts so much easier. The spacing and bullet points are a game changer.',
    likedBy: [],
    replies: [],
    timestamp: '5 hours ago'
  }
];

const defaultForumPosts: ForumPost[] = [
  {
    id: 'f1',
    title: 'Tips for staying focused during long study sessions?',
    content: 'I find it hard to stay on track for more than 20 minutes. Any strategies that worked for you?',
    author: 'Jamie L.',
    createdAt: '3 hours ago',
    replies: [
      { id: 'fr1', text: 'Pomodoro technique worked wonders for me — 25 min focus, 5 min break!', author: 'Alex M.', createdAt: '2 hours ago' }
    ]
  }
];

// ─── Provider ─────────────────────────────────

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load via service on mount
  useEffect(() => {
    getPosts().then(saved => setPosts(saved.length > 0 ? saved : defaultPosts));
    getForumPosts().then(saved => setForumPosts(saved.length > 0 ? saved : defaultForumPosts));
    setLoaded(true);
  }, []);

  // Persist via service on change (skip initial mount before load)
  useEffect(() => {
    if (loaded) savePosts(posts);
  }, [posts, loaded]);

  useEffect(() => {
    if (loaded) saveForumPosts(forumPosts);
  }, [forumPosts, loaded]);

  // ── Shoutout actions ──

  const addPost = (content: string, author: string) => {
    const post: Post = {
      id: Date.now().toString(),
      author,
      content,
      likedBy: [],
      replies: [],
      timestamp: 'Just now'
    };
    setPosts(prev => [post, ...prev]);
  };

  // One like per user email — idempotent
  const likePost = (postId: string, userEmail: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      if (p.likedBy.includes(userEmail)) return p; // already liked — no-op
      return { ...p, likedBy: [...p.likedBy, userEmail] };
    }));
  };

  const replyToPost = (postId: string, content: string, author: string) => {
    const reply: Reply = {
      id: Date.now().toString(),
      author,
      content,
      timestamp: 'Just now'
    };
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
    ));
  };

  // ── Forum actions ──

  const addForumPost = (title: string, content: string, author: string) => {
    const post: ForumPost = {
      id: Date.now().toString(),
      title,
      content,
      author,
      createdAt: 'Just now',
      replies: []
    };
    setForumPosts(prev => [post, ...prev]);
  };

  const addForumReply = (forumPostId: string, text: string, author: string) => {
    const reply: ForumReply = {
      id: Date.now().toString(),
      text,
      author,
      createdAt: 'Just now'
    };
    setForumPosts(prev => prev.map(p =>
      p.id === forumPostId ? { ...p, replies: [...p.replies, reply] } : p
    ));
  };

  return (
    <CommunityContext.Provider value={{
      posts, addPost, likePost, replyToPost,
      forumPosts, addForumPost, addForumReply
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunityContext = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunityContext must be used within a CommunityProvider');
  }
  return context;
};
