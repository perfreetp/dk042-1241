import { useState } from 'react';
import { Star, ThumbsUp, Edit, Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/layout/DashboardLayout';

const myReviews = [
  {
    id: 'r1',
    productId: 'prod1',
    productName: '美团收银专业版',
    productLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=meituan%20pos%20software%20logo&image_size=square',
    rating: 5,
    content: '用了半年了，系统很稳定，功能也很全面，特别是外卖对接功能太方便了。客服响应也很及时，有问题基本当天就能解决。',
    tags: ['功能齐全', '服务好', '稳定'],
    createdAt: '2024-03-15',
    helpful: 23,
  },
  {
    id: 'r2',
    productId: 'prod3',
    productName: '客如云收银系统',
    productLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=keruyun%20pos%20logo%20orange&image_size=square',
    rating: 4,
    content: '性价比不错，基础功能都有，就是营销功能稍微弱了点。如果只是需要收银和库存管理的话完全够用。',
    tags: ['性价比高', '功能待完善'],
    createdAt: '2024-02-20',
    helpful: 15,
  },
];

export default function DashboardReviews() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (review: typeof myReviews[0]) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditContent(review.content);
  };

  const handleSave = () => {
    setEditingId(null);
    alert('评价已更新');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">我的评价</h1>
            <p className="text-slate-500 mt-1">你已发布 {myReviews.length} 条评价</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            写评价
          </button>
        </div>

        <div className="space-y-4">
          {myReviews.map((review) => (
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
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
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

        {myReviews.length === 0 && (
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
