import React, { createContext, useContext, useState, useEffect } from 'react';

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
  likes: number;
  replies: Reply[];
  timestamp: string;
}

interface CommunityContextType {
  posts: Post[];
  addPost: (content: string, author: string) => void;
  likePost: (postId: string) => void;
  replyToPost: (postId: string, content: string, author: string) => void;
}

const defaultPosts: Post[] = [
  {
    id: '1',
    author: 'Alex M.',
    content: 'Just finished my math assignment using the ADHD mode! Breaking it down into steps helped me avoid getting overwhelmed. 🎉',
    likes: 12,
    replies: [
      { id: 'r1', author: 'Sarah K.', content: 'That is awesome! Keep it up.', timestamp: '1 hour ago' }
    ],
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    author: 'Sarah K.',
    content: 'The dyslexia mode makes reading my history texts so much easier. The spacing and bullet points are a game changer.',
    likes: 24,
    replies: [],
    timestamp: '5 hours ago'
  }
];

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('community_posts_v3');
    if (saved) return JSON.parse(saved);
    return defaultPosts;
  });

  useEffect(() => {
    localStorage.setItem('community_posts_v3', JSON.stringify(posts));
  }, [posts]);

  const addPost = (content: string, author: string) => {
    const post: Post = {
      id: Date.now().toString(),
      author,
      content,
      likes: 0,
      replies: [],
      timestamp: 'Just now'
    };
    setPosts(prev => [post, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ));
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

  return (
    <CommunityContext.Provider value={{ posts, addPost, likePost, replyToPost }}>
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
