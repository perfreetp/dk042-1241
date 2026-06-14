import { useState, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquareReply,
  Send,
  X,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Filter,
  BarChart3,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { UserReview } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import ProviderLayout from '@/components/layout/ProviderLayout';

export default function ProviderReviews() {
  const { getProviderReviews, replyToReview, getProviderStats } = useAppStore();
  const reviews = getProviderReviews('p1');
  const stats = getProviderStats('p1');
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [ratingFilter, setRatingFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [repliedFilter, setRepliedFilter] = useState<'all' | 'replied' | 'pending'>('all');

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (ratingFilter > 0 && r.rating !== ratingFilter) return false;
      if (repliedFilter === 'replied' && !r.officialReply) return false;
      if (repliedFilter === 'pending' && r.officialReply) return false;
      return true;
    });
  }, [reviews, ratingFilter, repliedFilter]);

  const tagSummary = useMemo(() => {
    const map = new Map<string, number>();
    reviews.forEach((r) => r.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries()).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [reviews]);

  const pendingCount = reviews.filter((r) => !r.officialReply).length;

  const submitReply = () => {
    if (!replyId || !replyContent.trim()) return;
    replyToReview(replyId, replyContent.trim());
    setReplyId(null);
    setReplyContent('');
  };

  const renderStars = (n: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={cn("w-3.5 h-3.5", i <= n ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
        ))}
      </div>
    );
  };

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">评价管理</h1>
          <p className="text-slate-500 mt-1">
            共 {reviews.length} 条评价，待回复 {pendingCount} 条，平均评分 {stats.avgRating.toFixed(1)}
          </p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">优质</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.avgRating.toFixed(1)}</div>
            <div className="text-xs text-slate-500 mt-1">平均评分</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-xs text-slate-400">总数</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{reviews.length}</div>
            <div className="text-xs text-slate-500 mt-1">全部评价</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                <MessageSquareReply className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">待处理</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{pendingCount}</div>
            <div className="text-xs text-slate-500 mt-1">等待回复</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-xs text-slate-400">占比</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {reviews.length > 0 ? Math.round(((reviews.length - pendingCount) / reviews.length) * 100) : 0}%
            </div>
            <div className="text-xs text-slate-500 mt-1">回复率</div>
          </div>
        </div>

        {/* 常见标签 */}
        {tagSummary.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <div className="text-sm font-semibold text-slate-800">用户常见评价标签</div>
              <div className="text-xs text-slate-400 ml-auto">按出现频次排序</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tagSummary.map(({ tag, count }) => {
                const intensity = Math.min(100, 20 + (count / Math.max(...tagSummary.map((t) => t.count))) * 80);
                return (
                  <div key={tag} className="relative group">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-default",
                      count >= 3 ? "bg-violet-50 text-violet-700 border border-violet-100"
                        : count >= 2 ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                    )}>
                      <span>{tag}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-white/80 text-[10px] font-bold">{count}</span>
                    </span>
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ opacity: intensity / 100 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 筛选栏 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">筛选：</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {[{ k: 0, l: '全部' }, { k: 5, l: '5星' }, { k: 4, l: '4星' }, { k: 3, l: '3星' }, { k: 2, l: '2星' }, { k: 1, l: '1星' }].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setRatingFilter(t.k as typeof ratingFilter)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    ratingFilter === t.k
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {t.l}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
            <div className="flex flex-wrap items-center gap-1">
              {[{ k: 'all', l: '全部状态' }, { k: 'pending', l: '待回复' }, { k: 'replied', l: '已回复' }].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setRepliedFilter(t.k as typeof repliedFilter)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    repliedFilter === t.k
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {t.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 评价列表 */}
        {filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-semibold text-sm">
                            {(r.userName || '用户').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="font-semibold text-slate-800">{r.userName}</div>
                              {renderStars(r.rating)}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                              <span className="truncate max-w-[160px]">{r.productName}</span>
                              <span>·</span>
                              <span>{r.createdAt}</span>
                              <span className="inline-flex items-center gap-1 ml-2">
                                <ThumbsUp className="w-3 h-3" />
                                {r.helpful}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {r.officialReply ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-100">
                              <MessageSquareReply className="w-3 h-3" />已回复
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-full border border-amber-100 animate-pulse">
                              <BarChart3 className="w-3 h-3" />待回复
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 text-sm leading-relaxed text-slate-700">{r.content}</div>

                      {r.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {r.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded-full border border-slate-200">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 官方回复展示 */}
                      {r.officialReply && (
                        <div className="mt-4 ml-4 border-l-2 border-emerald-300 pl-4 pr-4 py-3 bg-gradient-to-r from-emerald-50/60 to-transparent rounded-r-xl">
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                              </div>
                              <span className="text-xs font-semibold text-emerald-700">
                                {r.officialReply.replierName} · 官方回复
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">{r.officialReply.replyTime}</span>
                          </div>
                          <div className="text-sm text-slate-700 leading-relaxed">{r.officialReply.content}</div>
                        </div>
                      )}

                      {/* 回复输入框 */}
                      {replyId === r.id && (
                        <div className="mt-4 border border-blue-200 bg-blue-50/40 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-700">
                            <MessageSquareReply className="w-4 h-4" />
                            {r.officialReply ? '编辑官方回复' : '撰写官方回复'}
                          </div>
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={3}
                            placeholder="感谢用户的评价与建议，针对提到的问题可以说明我们的改进措施或后续服务承诺..."
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 resize-none"
                          />
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="text-xs text-slate-400">建议回复：专业、诚恳、有具体措施</div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setReplyId(null); setReplyContent(''); }}
                                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />取消
                              </button>
                              <button
                                onClick={submitReply}
                                disabled={!replyContent.trim()}
                                className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />提交回复
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {!r.officialReply && replyId !== r.id && (
                        <button
                          onClick={() => {
                            setReplyId(r.id);
                            setReplyContent('');
                          }}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                          <MessageSquareReply className="w-3.5 h-3.5" />
                          回复评价
                        </button>
                      )}
                      {r.officialReply && replyId !== r.id && (
                        <button
                          onClick={() => {
                            setReplyId(r.id);
                            setReplyContent(r.officialReply!.content);
                          }}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                        >
                          <MessageSquareReply className="w-3.5 h-3.5" />
                          编辑回复
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">暂无评价</h3>
            <p className="text-slate-500">当前筛选条件下没有评价记录</p>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
}
