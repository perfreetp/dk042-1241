import { useState } from 'react';
import { Star, ThumbsUp, Edit, Plus, X, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { products } from '@/data/mockData';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardReviews() {
  const { userReviews, addUserReview, updateUserReview } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [showNewReview, setShowNewReview] = useState(false);
  const [newReview, setNewReview] = useState({
    productId: '',
    rating: 5,
    content: '',
    tags: [] as string[],
  });

  const handleEdit = (review: typeof userReviews[0]) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditContent(review.content);
    setEditTags(review.tags);
  };

  const handleSave = (id: string) => {
    updateUserReview(id, { rating: editRating, content: editContent, tags: editTags });
    setEditingId(null);
  };

  const handleNewReviewSubmit = () => {
    if (!newReview.productId || !newReview.content.trim()) return;
    const product = products.find((p) => p.id === newReview.productId);
    if (!product) return;
    addUserReview({
      userId: 'user1',
      userName: '测试用户',
      productId: product.id,
      productName: product.name,
      productLogo: product.logo,
      rating: newReview.rating,
      content: newReview.content,
      tags: newReview.tags,
    });
    setNewReview({ productId: '', rating: 5, content: '', tags: [] });
    setShowNewReview(false);
  };

  const commonTags = ['功能齐全', '服务好', '性价比高', '稳定', '易上手', '功能待完善', '响应慢', '价格偏高'];

  const toggleTag = (tag: string, currentTags: string[], setTags: (t: string[]) => void) => {
    if (currentTags.includes(tag)) {
      setTags(currentTags.filter((t) => t !== tag));
    } else {
      setTags([...currentTags, tag]);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">我的评价</h1>
            <p className="text-slate-500 mt-1">你已发布 {userReviews.length} 条评价</p>
          </div>
          <button
            onClick={() => setShowNewReview(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            写评价
          </button>
        </div>

        {showNewReview && (
          <div className="bg-white rounded-xl border border-blue-200 p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">新增评价</h3>
              <button
                onClick={() => setShowNewReview(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">选择产品</label>
                <select
                  value={newReview.productId}
                  onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">请选择产品</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-700 mb-1.5">评分</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => setNewReview({ ...newReview, rating: i })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "w-6 h-6 transition-colors",
                          i <= newReview.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200 hover:text-amber-300"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-slate-500 ml-2">{newReview.rating}.0 分</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">评价内容</label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  placeholder="说说你的使用感受..."
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-700 mb-1.5">标签</span>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag, newReview.tags, (t) => setNewReview({ ...newReview, tags: t }))}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-full border transition-colors",
                        newReview.tags.includes(tag)
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-slate-200 hover:border-blue-500 hover:text-blue-600"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleNewReviewSubmit}
                  disabled={!newReview.productId || !newReview.content.trim()}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发布评价
                </button>
                <button
                  onClick={() => setShowNewReview(false)}
                  className="px-4 py-2 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {userReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.productLogo}
                  alt={review.productName}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {review.productName}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i <= review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            )}
                          />
                        ))}
                        <span className="text-sm text-slate-500 ml-2">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  {editingId === review.id ? (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">评分：</span>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            onClick={() => setEditRating(i)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={cn(
                                "w-5 h-5 transition-colors",
                                i <= editRating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-200 hover:text-amber-300"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                        placeholder="说说你的使用感受..."
                      />
                      <div>
                        <span className="block text-sm text-slate-500 mb-1.5">标签</span>
                        <div className="flex flex-wrap gap-2">
                          {commonTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag, editTags, setEditTags)}
                              className={cn(
                                "px-3 py-1.5 text-xs rounded-full border transition-colors",
                                editTags.includes(tag)
                                  ? "border-blue-500 bg-blue-50 text-blue-600"
                                  : "border-slate-200 hover:border-blue-500 hover:text-blue-600"
                              )}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(review.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 leading-relaxed mt-3">
                        {review.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {review.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      发布于 {review.createdAt}
                    </span>
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      有用 ({review.helpful})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {userReviews.length === 0 && !showNewReview && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              还没有发布评价
            </h3>
            <p className="text-slate-500 mb-6">
              分享你的使用体验，帮助更多商家做选择
            </p>
            <button
              onClick={() => setShowNewReview(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              写评价
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
