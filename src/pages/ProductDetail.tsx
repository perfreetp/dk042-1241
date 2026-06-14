import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, ChevronLeft, Check, X, Plus, Calendar, MessageSquare, Shield, Clock, Users, Award, ArrowRight, MessageSquareReply, Sparkles, ThumbsUp, BarChart3, Hash } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, isFavorite, addFavorite, removeFavorite, addToCompare, removeFromCompare, isInCompare, compareList, addAppointment, getProductReviews, getProductRating, getProductReviewAggregate } = useAppStore();
  const product = getProductById(id || '');

  const [activeTab, setActiveTab] = useState<'features' | 'pricing' | 'reviews' | 'cases'>('features');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', company: '', date: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [reviewSort, setReviewSort] = useState<'latest' | 'highest' | 'lowest'>('latest');
  const [reviewFilter, setReviewFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-700 mb-2">产品不存在</h2>
            <button
              onClick={() => navigate('/products')}
              className="text-blue-600 hover:underline"
            >
              返回产品列表
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);
  const productReviews = getProductReviews(product.id);
  const productRating = getProductRating(product.id);
  const reviewAgg = getProductReviewAggregate(product.id);

  const displayedReviews = useMemo(() => {
    let list = [...reviewAgg.reviewsSorted];
    if (reviewFilter > 0) list = list.filter((r) => r.rating === reviewFilter);
    if (reviewSort === 'highest') list = list.sort((a, b) => b.rating - a.rating);
    else if (reviewSort === 'lowest') list = list.sort((a, b) => a.rating - b.rating);
    return list;
  }, [reviewAgg, reviewFilter, reviewSort]);

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  const handleCompare = () => {
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product.id);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) return;
    addAppointment({
      userId: 'user1',
      userName: formData.name,
      productId: product.id,
      productName: product.name,
      type: 'demo',
      date: formData.date || new Date().toISOString().split('T')[0],
      time: '',
      status: 'pending',
      notes: formData.notes,
    });
    setSubmitted(true);
  };

  const handleCloseModal = () => {
    setShowAppointmentModal(false);
    setSubmitted(false);
    setFormData({ name: '', phone: '', company: '', date: '', notes: '' });
  };

  const featureCategories = [...new Set(product.features.map((f) => f.category))];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
                返回
              </button>
              <span className="text-slate-300">/</span>
              <Link to="/products" className="text-slate-500 hover:text-slate-700">产品库</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-start gap-6">
                  <img
                    src={product.logo}
                    alt={product.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-slate-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                        <p className="text-slate-500 mt-1">{product.providerName}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleFavorite}
                          className={cn(
                            "p-2.5 rounded-xl border transition-colors",
                            favorite
                              ? "border-rose-200 bg-rose-50 text-rose-500"
                              : "border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-500"
                          )}
                        >
                          <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="text-lg font-bold text-slate-900">{productRating.rating}</span>
                        <span className="text-sm text-slate-500">({productRating.reviewCount}条评价)</span>
                      </div>
                      <div className="h-4 w-px bg-slate-200" />
                      <div className="text-sm text-slate-600">
                        <span className="text-blue-600 font-semibold">¥{product.priceMin}</span>
                        <span className="text-slate-400"> - ¥{product.priceMax}</span>
                        <span className="text-slate-400"> /{product.priceUnit}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{product.highlights[0]}</div>
                    <div className="text-xs text-slate-500 mt-1">行业深度定制</div>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <div className="text-2xl font-bold text-slate-900">{product.reviewCount}+</div>
                    <div className="text-xs text-slate-500 mt-1">商家使用</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{product.afterSaleScope.length}项</div>
                    <div className="text-xs text-slate-500 mt-1">售后服务</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-200">
                  <div className="flex">
                    {[
                      { key: 'features', label: '功能详情' },
                      { key: 'pricing', label: '价格方案' },
                      { key: 'reviews', label: `用户评价 (${productReviews.length})` },
                      { key: 'cases', label: '成功案例' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        className={cn(
                          "px-6 py-4 text-sm font-medium transition-colors relative",
                          activeTab === tab.key
                            ? "text-blue-600"
                            : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {tab.label}
                        {activeTab === tab.key && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === 'features' && (
                    <div className="space-y-6">
                      <p className="text-slate-600 leading-relaxed">{product.description}</p>
                      
                      <div className="space-y-6">
                        {featureCategories.map((category) => {
                          const categoryFeatures = product.features.filter((f) => f.category === category);
                          const hasCount = categoryFeatures.filter((f) => f.hasFeature).length;
                          return (
                            <div key={category}>
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-slate-900">{category}</h3>
                                <span className="text-sm text-slate-500">
                                  {hasCount}/{categoryFeatures.length} 项功能
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {categoryFeatures.map((feature) => (
                                  <div
                                    key={feature.name}
                                    className={cn(
                                      "flex items-center gap-2 p-3 rounded-lg text-sm",
                                      feature.hasFeature ? "bg-green-50" : "bg-slate-50"
                                    )}
                                  >
                                    {feature.hasFeature ? (
                                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    ) : (
                                      <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                    )}
                                    <span className={feature.hasFeature ? "text-slate-700" : "text-slate-400"}>
                                      {feature.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'pricing' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {product.pricingPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className={cn(
                            "relative rounded-xl border-2 p-6 transition-all",
                            plan.recommended
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          {plan.recommended && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                              推荐方案
                            </div>
                          )}
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{plan.name}</h3>
                          <div className="mb-4">
                            <span className="text-3xl font-bold text-blue-600">¥{plan.price}</span>
                            <span className="text-sm text-slate-500"> /{plan.unit}</span>
                          </div>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => setShowAppointmentModal(true)}
                            className={cn(
                              "w-full py-2.5 rounded-lg font-medium transition-colors",
                              plan.recommended
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                          >
                            预约演示
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      {/* 评价概览 - 评分分布 + 平均分 */}
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-6 border-b border-slate-100">
                        <div className="lg:col-span-2 p-6 bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl border border-amber-100">
                          <div className="text-center">
                            <div className="flex items-baseline justify-center gap-1">
                              <div className="text-5xl font-bold text-slate-900">{reviewAgg.averageRating.toFixed(1)}</div>
                              <div className="text-lg text-slate-400">/ 5.0</div>
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-3">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-5 h-5",
                                    i <= Math.round(reviewAgg.averageRating)
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-slate-200"
                                  )}
                                />
                              ))}
                            </div>
                            <div className="text-sm text-slate-500 mt-2">
                              基于 <span className="font-semibold text-slate-700">{reviewAgg.totalCount}</span> 条真实评价
                            </div>
                          </div>
                          {reviewAgg.tagStats.length > 0 && (
                            <div className="mt-5 pt-5 border-t border-amber-100/70">
                              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-slate-600">
                                <Hash className="w-3.5 h-3.5" />
                                用户最爱标签
                              </div>
                              <div className="flex flex-wrap gap-1.5 justify-center">
                                {reviewAgg.tagStats.map(({ tag, count }) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-slate-700 text-xs rounded-full border border-slate-200 shadow-sm hover:shadow transition-shadow"
                                  >
                                    {tag}
                                    <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">{count}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 评分分布柱状图 */}
                        <div className="lg:col-span-3 p-6 space-y-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-slate-500" />
                              <div className="text-sm font-semibold text-slate-800">评分分布</div>
                            </div>
                            <div className="text-xs text-slate-400">共 {reviewAgg.totalCount} 条</div>
                          </div>
                          <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((s) => {
                              const star = s as 5 | 4 | 3 | 2 | 1;
                              const count = reviewAgg.ratingDistribution[star] || 0;
                              const pct = reviewAgg.totalCount > 0 ? (count / reviewAgg.totalCount) * 100 : 0;
                              return (
                                <div key={star} className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 w-14 flex-shrink-0">
                                    <span className="text-xs font-semibold text-slate-600 w-4">{star}</span>
                                    <Star className={cn("w-3.5 h-3.5", star <= Math.round(reviewAgg.averageRating) ? "text-amber-400 fill-amber-400" : "text-slate-300")} />
                                  </div>
                                  <button
                                    onClick={() => setReviewFilter(reviewFilter === star ? 0 : star)}
                                    className="flex-1 h-7 bg-slate-50 rounded-full overflow-hidden relative group border border-slate-100 transition-all hover:border-amber-200"
                                  >
                                    <div
                                      className={cn(
                                        "h-full rounded-full transition-all duration-500 group-hover:brightness-110",
                                        star >= 4 ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                          : star === 3 ? "bg-gradient-to-r from-amber-300 to-orange-400"
                                          : "bg-gradient-to-r from-rose-300 to-rose-400"
                                      )}
                                      style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-between px-3">
                                      <span className="text-[11px] font-semibold text-slate-700">{count} 条</span>
                                      {pct >= 15 && <span className="text-[11px] font-semibold text-white/90">{pct.toFixed(0)}%</span>}
                                    </div>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          {reviewFilter > 0 && (
                            <div className="pt-2">
                              <button
                                onClick={() => setReviewFilter(0)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                              >
                                <X className="w-3 h-3" />清除筛选：当前查看 {reviewFilter} 星评价
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 排序工具栏 */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="text-sm text-slate-500">
                          显示 <span className="font-semibold text-slate-800">{displayedReviews.length}</span> / {reviewAgg.totalCount} 条
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-xs text-slate-500 mr-1">排序：</div>
                          {[
                            { k: 'latest', l: '最新' },
                            { k: 'highest', l: '评分最高' },
                            { k: 'lowest', l: '评分最低' },
                          ].map((o) => (
                            <button
                              key={o.k}
                              onClick={() => setReviewSort(o.k as typeof reviewSort)}
                              className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                                reviewSort === o.k
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                              )}
                            >
                              {o.l}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 评价列表 */}
                      <div className="space-y-5">
                        {displayedReviews.length > 0 ? (
                          displayedReviews.map((review) => (
                            <div key={review.id} className="pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                  {review.userName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                                        {review.userName}
                                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-full border border-blue-100">
                                          已验证购买
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 mt-1">
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                              key={i}
                                              className={cn(
                                                "w-3.5 h-3.5",
                                                i <= review.rating
                                                  ? "text-amber-400 fill-amber-400"
                                                  : "text-slate-200"
                                              )}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs text-slate-400 font-mono">{review.createdAt}</span>
                                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                          <ThumbsUp className="w-3 h-3" />
                                          {review.helpful}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-[15px] text-slate-700 leading-relaxed mt-3">
                                    {review.content}
                                  </p>

                                  {review.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                      {review.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 font-medium"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* 官方回复 */}
                                  {review.officialReply && (
                                    <div className="mt-4 ml-2 relative pl-4">
                                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-blue-400 rounded-full" />
                                      <div className="p-4 bg-gradient-to-br from-emerald-50/80 via-blue-50/50 to-white rounded-xl border border-emerald-100">
                                        <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                                              <Sparkles className="w-3 h-3 text-emerald-600" />
                                            </div>
                                            <span className="text-xs font-bold text-emerald-700">
                                              {review.officialReply.replierName}
                                            </span>
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                                              <MessageSquareReply className="w-2.5 h-2.5 inline mr-0.5" />
                                              官方回复
                                            </span>
                                          </div>
                                          <span className="text-[11px] text-slate-400 font-mono">
                                            {review.officialReply.replyTime}
                                          </span>
                                        </div>
                                        <div className="text-sm text-slate-700 leading-relaxed">
                                          {review.officialReply.content}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Star className="w-8 h-8 text-slate-300" />
                            </div>
                            <div className="text-slate-500">
                              {reviewFilter > 0
                                ? `暂无 ${reviewFilter} 星评价，试试其他筛选吧`
                                : '还没有评价，快来发表第一条吧'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'cases' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {product.cases.map((caseItem) => (
                        <div
                          key={caseItem.id}
                          className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <img
                            src={caseItem.image}
                            alt={caseItem.title}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold text-slate-900 mb-1">{caseItem.title}</h3>
                            <p className="text-sm text-slate-500 mb-3">{caseItem.clientName}</p>
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{caseItem.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {caseItem.results.slice(0, 3).map((result, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full"
                                >
                                  {result}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-4">快速操作</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    预约演示
                  </button>
                  <button
                    onClick={handleCompare}
                    disabled={!inCompare && compareList.length >= 4}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 font-medium rounded-xl transition-colors border",
                      inCompare
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {inCompare ? (
                      <>
                        <Check className="w-5 h-5" />
                        已加入对比
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        加入对比
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleFavorite}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 font-medium rounded-xl transition-colors border",
                      favorite
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:text-rose-500"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
                    {favorite ? '已收藏' : '收藏产品'}
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    售后服务
                  </h4>
                  <ul className="space-y-2">
                    {product.afterSaleScope.slice(0, 5).map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    产品亮点
                  </h4>
                  <ul className="space-y-2">
                    {product.highlights.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">服务商信息</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={product.logo}
                    alt={product.providerName}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                  />
                  <div>
                    <div className="font-medium text-slate-900">{product.providerName}</div>
                    <div className="text-xs text-slate-500">已认证服务商</div>
                  </div>
                </div>
                <button className="w-full py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  查看更多产品
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">预约成功！</h3>
                <p className="text-slate-500 mb-6">专属顾问将尽快与你联系，可在商家后台「预约管理」中查看进度</p>
                <div className="flex gap-3">
                  <Link
                    to="/dashboard/appointments"
                    className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-center"
                  >
                    查看预约
                  </Link>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    继续浏览
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-2">预约产品演示</h3>
                <p className="text-slate-500 mb-6">填写信息，专属顾问将尽快与你联系</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">姓名 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="请输入姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">手机号 <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      placeholder="请输入手机号"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">公司名称</label>
                    <input
                      type="text"
                      placeholder="请输入公司/门店名称"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">预约时间</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">备注</label>
                    <textarea
                      placeholder="请描述你的具体需求"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.phone}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交预约
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
