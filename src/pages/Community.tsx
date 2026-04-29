import React, { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import { useCommunityContext } from '../context/CommunityContext';
import { MessageSquare, Heart, Share2, Send } from 'lucide-react';

export const Community: React.FC = () => {
  const { user } = useAppContext();
  const { posts, addPost, likePost, replyToPost } = useCommunityContext();
  const [newPost, setNewPost] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    addPost(newPost, user?.name || 'Anonymous');
    setNewPost('');
  };

  const handleLike = (id: string) => {
    likePost(id);
  };

  const handleReply = (postId: string) => {
    if (!replyContent.trim()) return;
    replyToPost(postId, replyContent, user?.name || 'Anonymous');
    setReplyContent('');
    setActiveReplyId(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-gray-500 dark:text-gray-400">Share your wins and support others.</p>
      </div>

      {/* Shoutout Box */}
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 focus-within:ring-2 ring-primary/20 transition-all">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your productivity win..."
          className="w-full bg-transparent border-none outline-none resize-none text-lg min-h-[100px] mb-4"
        />
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handlePost}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-50"
            disabled={!newPost.trim()}
          >
            Post Update
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-lg">{post.author}</div>
                <div className="text-sm text-gray-500">{post.timestamp}</div>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed mb-6 text-gray-800 dark:text-gray-200">
              {post.content}
            </p>
            
            <div className="flex items-center gap-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <Heart size={20} className="group-hover:fill-primary/20" />
                <span className="font-medium">{post.likes} Likes</span>
              </button>
              <button 
                onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <MessageSquare size={20} />
                <span className="font-medium">{post.replies.length} Replies</span>
              </button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors ml-auto">
                <Share2 size={20} />
              </button>
            </div>

            {/* Replies Section */}
            {(post.replies.length > 0 || activeReplyId === post.id) && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4 animate-in fade-in slide-in-from-top-2">
                {post.replies.map(reply => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-sm text-gray-500">
                      {reply.author.charAt(0)}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl rounded-tl-none p-4 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{reply.author}</span>
                        <span className="text-xs text-gray-500">{reply.timestamp}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
                
                {activeReplyId === post.id && (
                  <div className="flex items-end gap-3 mt-4 animate-in fade-in">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm resize-none"
                      rows={2}
                    />
                    <button 
                      onClick={() => handleReply(post.id)}
                      disabled={!replyContent.trim()}
                      className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
