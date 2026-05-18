'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SectionTitle from '../../components/SectionTitle';
import posts, { type Post, CATEGORIES } from './data';

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);

  // 按分类筛选
  const filtered = useMemo(
    () =>
      activeCategory
        ? localPosts.filter((p) => p.category === activeCategory)
        : localPosts,
    [activeCategory, localPosts]
  );

  // 排序：置顶公告 + 按日期倒序
  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (a.category === 'announcement') return -1;
        if (b.category === 'announcement') return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }),
    [filtered]
  );

  // 关闭弹窗（Escape 键）
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPost(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // 打开帖子
  const openPost = useCallback((post: Post) => {
    setSelectedPost(post);
  }, []);

  // 提交评论
  const submitComment = useCallback(() => {
    if (!commentName.trim() || !commentText.trim() || !selectedPost) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: commentName.trim(),
      content: commentText.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    const updatedPosts = localPosts.map((p) => {
      if (p.id === selectedPost.id) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });

    setLocalPosts(updatedPosts);
    // 同步更新当前选中帖子的评论列表
    setSelectedPost((prev) =>
      prev && prev.id === selectedPost.id
        ? { ...prev, comments: [...prev.comments, newComment] }
        : prev
    );
    setCommentName('');
    setCommentText('');
  }, [commentName, commentText, selectedPost, localPosts]);

  // 点赞
  const likePost = useCallback(
    (postId: string) => {
      setLocalPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
      );
      setSelectedPost((prev) =>
        prev && prev.id === postId ? { ...prev, likes: prev.likes + 1 } : prev
      );
    },
    []
  );

  return (
    <main className="min-h-screen px-4 sm:px-6 py-12">
      <Breadcrumb
        crumbs={[
          { label: '首页', href: '/' },
          { label: '交流区' },
        ]}
      />
      <SectionTitle
        title="纹样交流区"
        subtitle="设计师、品牌方、纹样爱好者的自由讨论空间 · 分享知识 · 交流经验 · 碰撞灵感"
      />

      {/* 分类导航 */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-5 py-2 rounded-full text-sm transition-all duration-200 ${
            activeCategory === null
              ? 'bg-ink text-white shadow-sm'
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 shadow-sm'
          }`}
        >
          全部
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-gold text-white shadow-sm'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 shadow-sm'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* 帖子列表 */}
      <div className="max-w-3xl mx-auto space-y-4">
        {sorted.length > 0 ? (
          sorted.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              onClick={() => openPost(post)}
            >
              {/* 帖子头部 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.category === 'announcement' && (
                      <span className="inline-block px-2 py-0.5 text-[10px] rounded bg-gold/20 text-gold font-medium">
                        公告
                      </span>
                    )}
                    <h3 className="text-base font-serif font-semibold text-ink truncate">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>
                      {post.authorBadge ? (
                        <span className="text-gold">{post.authorBadge}</span>
                      ) : null}
                      {post.author}
                    </span>
                    <span>{post.date}</span>
                    {post.tags.length > 0 && (
                      <span className="hidden sm:inline">
                        {post.tags.slice(0, 2).join(' · ')}
                        {post.tags.length > 2 && ' · ...'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 内容预览 */}
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                {post.content}
              </p>

              {/* 底部信息 */}
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.comments.length}
                </span>
                <span className="ml-auto shrink-0">
                  {CATEGORIES.find((c) => c.id === post.category)?.icon}{' '}
                  {CATEGORIES.find((c) => c.id === post.category)?.label}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-20">
            该板块暂无帖子 · 敬请期待
          </p>
        )}
      </div>

      {/* ===== 帖子详情弹窗 ===== */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPost(null);
          }}
        >
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* 弹窗内容 */}
          <div className="relative z-10 w-full max-w-3xl max-h-[85vh] bg-white rounded-xl sm:rounded-2xl overflow-y-auto shadow-2xl">
            {/* 关闭按钮 */}
            <button
              onClick={() => setSelectedPost(null)}
              className="fixed top-2 right-2 sm:absolute sm:top-4 sm:right-4 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-5 sm:p-8 pb-4 sm:pb-6">
              {/* 帖子头 */}
              <div className="flex items-center gap-2 mb-2">
                {selectedPost.category === 'announcement' && (
                  <span className="inline-block px-2 py-0.5 text-xs rounded bg-gold/20 text-gold font-medium">
                    公告
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {CATEGORIES.find((c) => c.id === selectedPost.category)?.icon}{' '}
                  {CATEGORIES.find((c) => c.id === selectedPost.category)?.label}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-ink mb-3">
                {selectedPost.title}
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
                <span>
                  {selectedPost.authorBadge && (
                    <span className="text-gold mr-1">{selectedPost.authorBadge}</span>
                  )}
                  {selectedPost.author}
                </span>
                <span>·</span>
                <span>{selectedPost.date}</span>
              </div>

              {/* 帖文内容 */}
              <div className="prose prose-sm prose-gray max-w-none mb-6">
                {selectedPost.content.split('\n').map((line, i) => (
                  <p key={i} className="leading-relaxed text-gray-700 mb-3 last:mb-0">
                    {line || '\u00A0'}
                  </p>
                ))}
              </div>

              {/* 标签 */}
              {selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs rounded-full bg-qing/20 text-ink/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 点赞 + 评论数 */}
              <div className="flex items-center gap-6 text-sm">
                <button
                  onClick={() => likePost(selectedPost.id)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-rose-400 hover:bg-rose-100 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {selectedPost.likes} 赞
                </button>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {selectedPost.comments.length} 评论
                </span>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="border-t border-gray-100" />

            {/* 评论区 */}
            <div className="p-5 sm:p-8 pt-4 sm:pt-6">
              <h3 className="text-base font-medium text-ink mb-4">评论</h3>

              {/* 已有评论 */}
              {selectedPost.comments.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {selectedPost.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-qing/20 flex items-center justify-center text-xs text-qing font-medium shrink-0 mt-0.5">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-ink">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-400">{comment.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-6">
                  暂无评论 · 来说点什么吧
                </p>
              )}

              {/* 评论输入框 */}
              <div className="bg-stone-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-sm font-medium text-ink mb-3">发表评论</h4>
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="你的昵称"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                  maxLength={20}
                />
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="说说你的想法……"
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{commentText.length}/500</span>
                  <button
                    onClick={submitComment}
                    disabled={!commentName.trim() || !commentText.trim()}
                    className="px-5 py-1.5 text-sm rounded-lg bg-gold text-white font-medium hover:bg-gold/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    发送
                  </button>
                </div>
                <p className="text-[10px] text-gray-300 mt-2">
                  ⚡ 轻量版 · 刷新页面后评论将重置（接入数据库后自动保留）
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
