import React, { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import { useCommunityContext } from '../context/CommunityContext';
import type { ForumPost } from '../context/CommunityContext';
import { MessageSquare, Heart, Send, Plus, ChevronDown, ChevronUp, Clock } from 'lucide-react';

// ─────────────────────────────────────────────
// Forum Post Card (inline, no new routes)
// ─────────────────────────────────────────────
const ForumCard: React.FC<{
  post: ForumPost;
  currentUser: string;
  onReply: (postId: string, text: string) => void;
}> = ({ post, currentUser, onReply }) => {
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(post.id, replyText);
    setReplyText('');
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Post header + body */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{post.content}</p>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {post.author.charAt(0)}
          </div>
          <span className="font-medium text-gray-600 dark:text-gray-300">{post.author}</span>
          <span className="flex items-center gap-1"><Clock size={13} /> {post.createdAt}</span>
        </div>
      </div>

      {/* Replies toggle */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <MessageSquare size={16} className="text-primary" />
            {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
          </span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {open && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            {/* Existing replies */}
            {post.replies.map(reply => (
              <div key={reply.id} className="flex gap-3">
                <div className="w-7 h-7 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xs text-gray-500">
                  {reply.author.charAt(0)}
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl rounded-tl-none p-3.5 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">{reply.author}</span>
                    <span className="text-xs text-gray-400">{reply.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{reply.text}</p>
                </div>
              </div>
            ))}

            {/* Add reply */}
            <div className="flex items-end gap-3 pt-1">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Reply as ${currentUser}...`}
                rows={2}
                className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm resize-none"
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Community Page
// ─────────────────────────────────────────────
type Tab = 'shoutouts' | 'forum';

export const Community: React.FC = () => {
  const { user } = useAppContext();
  const { posts, addPost, likePost, replyToPost, forumPosts, addForumPost, addForumReply } = useCommunityContext();

  const [activeTab, setActiveTab] = useState<Tab>('shoutouts');

  // Shoutout state
  const [newPost, setNewPost] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Forum state
  const [forumTitle, setForumTitle] = useState('');
  const [forumContent, setForumContent] = useState('');

  const userEmail = user?.email || 'guest';
  const userName = user?.name || 'Anonymous';

  // ── Shoutout handlers ──
  const handlePost = () => {
    if (!newPost.trim()) return;
    addPost(newPost, userName);
    setNewPost('');
  };

  const handleLike = (id: string) => {
    likePost(id, userEmail);
  };

  const handleReply = (postId: string) => {
    if (!replyContent.trim()) return;
    replyToPost(postId, replyContent, userName);
    setReplyContent('');
    setActiveReplyId(null);
  };

  // ── Forum handlers ──
  const handleForumPost = () => {
    if (!forumTitle.trim() || !forumContent.trim()) return;
    addForumPost(forumTitle, forumContent, userName);
    setForumTitle('');
    setForumContent('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-gray-500 dark:text-gray-400">Share your wins and support others.</p>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {(['shoutouts', 'forum'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm capitalize transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'shoutouts' ? '🎉 Shoutouts' : '💬 Forum'}
          </button>
        ))}
      </div>

      {/* ═══════════════ SHOUTOUTS TAB ═══════════════ */}
      {activeTab === 'shoutouts' && (
        <>
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

          {/* Shoutout Feed */}
          <div className="space-y-6">
            {posts.map(post => {
              const hasLiked = post.likedBy.includes(userEmail);
              return (
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
                    {/* Like button — one per user */}
                    <button
                      onClick={() => handleLike(post.id)}
                      title={hasLiked ? 'Already liked' : 'Like this post'}
                      className={`flex items-center gap-2 transition-colors ${
                        hasLiked
                          ? 'text-primary cursor-default'
                          : 'hover:text-primary cursor-pointer'
                      }`}
                    >
                      <Heart
                        size={20}
                        className={hasLiked ? 'fill-primary text-primary' : ''}
                      />
                      <span className="font-medium">{post.likedBy.length} Likes</span>
                    </button>

                    {/* Reply toggle */}
                    <button
                      onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <MessageSquare size={20} />
                      <span className="font-medium">{post.replies.length} Replies</span>
                    </button>
                  </div>

                  {/* Replies Section */}
                  {(post.replies.length > 0 || activeReplyId === post.id) && (
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
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
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}

                      {activeReplyId === post.id && (
                        <div className="flex items-end gap-3 mt-4">
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
              );
            })}
          </div>
        </>
      )}

      {/* ═══════════════ FORUM TAB ═══════════════ */}
      {activeTab === 'forum' && (
        <>
          {/* New Forum Post */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Plus size={20} className="text-primary" /> Ask a Question
            </h2>
            <input
              type="text"
              value={forumTitle}
              onChange={e => setForumTitle(e.target.value)}
              placeholder="Title — e.g. 'How do I stay focused?'"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
            />
            <textarea
              value={forumContent}
              onChange={e => setForumContent(e.target.value)}
              placeholder="Share more context or details..."
              rows={3}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleForumPost}
                disabled={!forumTitle.trim() || !forumContent.trim()}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-50"
              >
                Post Question
              </button>
            </div>
          </div>

          {/* Forum Posts List */}
          <div className="space-y-4">
            {forumPosts.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                <p className="text-gray-500">No questions yet. Be the first to ask!</p>
              </div>
            )}
            {forumPosts.map(post => (
              <ForumCard
                key={post.id}
                post={post}
                currentUser={userName}
                onReply={(postId, text) => addForumReply(postId, text, userName)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
