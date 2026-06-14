import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Store, Users, DollarSign, Layers, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { industries, products } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Industry, MatchedProduct } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/cards/ProductCard';

const storeCountOptions = [
  { value: 1, label: '1家门店', desc: '单店经营' },
  { value: 5, label: '2-5家门店', desc: '小型连锁' },
  { value: 10, label: '6-10家门店', desc: '中型连锁' },
  { value: 50, label: '10家以上', desc: '大型连锁' },
];

const budgetOptions = [
  { value: 200, label: '200元以下', desc: '入门级预算' },
  { value: 500, label: '200-500元', desc: '基础预算' },
  { value: 1000, label: '500-1000元', desc: '中等预算' },
  { value: 2000, label: '1000-2000元', desc: '较高预算' },
  { value: 5000, label: '2000元以上', desc: '充足预算' },
];

const coreNeedsOptions = [
  { value: '收银管理', label: '收银管理', icon: '💳' },
  { value: '会员管理', label: '会员管理', icon: '👥' },
  { value: '库存管理', label: '库存管理', icon: '📦' },
  { value: '预约管理', label: '预约管理', icon: '📅' },
  { value: '营销推广', label: '营销推广', icon: '📢' },
  { value: '数据分析', label: '数据分析', icon: '📊' },
  { value: '员工管理', label: '员工管理', icon: '👔' },
  { value: '连锁管理', label: '连锁管理', icon: '🏪' },
  { value: '移动端', label: '移动端', icon: '📱' },
  { value: 'API接口', label: 'API接口', icon: '🔌' },
];

const steps = [
  { id: 1, title: '选择行业', icon: <Store className="w-5 h-5" /> },
  { id: 2, title: '门店规模', icon: <Users className="w-5 h-5" /> },
  { id: 3, title: '预算范围', icon: <DollarSign className="w-5 h-5" /> },
  { id: 4, title: '核心需求', icon: <Layers className="w-5 h-5" /> },
  { id: 5, title: '推荐结果', icon: <Sparkles className="w-5 h-5" /> },
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const { setQuestionnaireResult, currentIndustry, addToCompare } = useAppStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [industry, setIndustry] = useState<Industry>(currentIndustry);
  const [storeCount, setStoreCount] = useState<number | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [coreNeeds, setCoreNeeds] = useState<string[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<MatchedProduct[]>([]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return industry !== null;
      case 2: return storeCount !== null;
      case 3: return budget !== null;
      case 4: return coreNeeds.length > 0;
      default: return false;
    }
  };

  const calculateMatch = (): MatchedProduct[] => {
    const industryProducts = products.filter((p) => p.industry === industry);
    
    return industryProducts.map((product) => {
      let score = 0;
      const reasons: string[] = [];

      score += 30;
      reasons.push('行业匹配度高');

      if (product.priceMax <= (budget || 500)) {
        score += 25;
        reasons.push('价格符合预算');
      } else if (product.priceMin <= (budget || 500) * 1.2) {
        score += 15;
        reasons.push('价格接近预算');
      }

      const matchedFeatures = coreNeeds.filter((need) =>
        product.features.some((f) => f.category === need && f.hasFeature)
      );
      const featureScore = Math.round((matchedFeatures.length / coreNeeds.length) * 35);
      score += featureScore;
      if (matchedFeatures.length > 0) {
        reasons.push(`支持${matchedFeatures.length}项核心需求`);
      }

      if (product.rating >= 4.5) {
        score += 10;
        reasons.push('用户口碑优秀');
      }

      if (storeCount && storeCount > 5 && product.features.some((f) => f.category === '连锁管理' && f.hasFeature)) {
        score += 10;
        reasons.push('支持多门店连锁管理');
      }

      score = Math.min(score, 100);

      return {
        productId: product.id,
        matchScore: score,
        matchReasons: reasons,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      if (currentStep === 4) {
        const matches = calculateMatch();
        setMatchedProducts(matches);
        setQuestionnaireResult({
          id: `q-${Date.now()}`,
          industry,
          storeCount: storeCount || 1,
          budget: budget || 500,
          coreNeeds,
          matchedProducts: matches,
          createdAt: new Date().toISOString(),
        });
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleCoreNeed = (need: string) => {
    setCoreNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);

  const handleAddAllToCompare = () => {
    matchedProducts.slice(0, 4).forEach((mp) => {
      addToCompare(mp.productId);
    });
    navigate('/compare');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Progress Header */}
        <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        currentStep > step.id
                          ? "bg-green-500 text-white"
                          : currentStep === step.id
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={cn(
                        "mt-2 text-xs font-medium",
                        currentStep >= step.id ? "text-slate-700" : "text-slate-400"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-12 md:w-24 h-0.5 mx-2 mb-6 transition-colors",
                        currentStep > step.id ? "bg-green-500" : "bg-slate-200"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
                请选择你的行业
              </h2>
              <p className="text-slate-500 text-center mb-10">
                我们将为你推荐最适合行业特性的SaaS产品
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all text-center",
                      industry === ind
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    )}
                  >
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl",
                        industry === ind ? "bg-blue-100" : "bg-slate-100"
                      )}
                    >
                      {ind === '餐饮' && '🍜'}
                      {ind === '教育' && '📚'}
                      {ind === '医疗' && '🏥'}
                      {ind === '美业' && '💅'}
                    </div>
                    <span
                      className={cn(
                        "font-semibold",
                        industry === ind ? "text-blue-700" : "text-slate-700"
                      )}
                    >
                      {ind}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
                你有多少家门店？
              </h2>
              <p className="text-slate-500 text-center mb-10">
                不同规模的门店对系统功能要求不同
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {storeCountOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStoreCount(option.value)}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all text-left",
                      storeCount === option.value
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                        storeCount === option.value ? "bg-blue-100" : "bg-slate-100"
                      )}
                    >
                      <Store
                        className={cn(
                          "w-6 h-6",
                          storeCount === option.value ? "text-blue-600" : "text-slate-400"
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "font-semibold mb-1",
                        storeCount === option.value ? "text-blue-700" : "text-slate-700"
                      )}
                    >
                      {option.label}
                    </div>
                    <div className="text-sm text-slate-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
                每月预算是多少？
              </h2>
              <p className="text-slate-500 text-center mb-10">
                按单店月均费用计算，帮你找到性价比最高的方案
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setBudget(option.value)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-center",
                      budget === option.value
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    )}
                  >
                    <div
                      className={cn(
                        "text-xl font-bold mb-1",
                        budget === option.value ? "text-blue-600" : "text-slate-700"
                      )}
                    >
                      ¥{option.value < 1000 ? option.value : (option.value / 1000) + 'k'}
                    </div>
                    <div className="text-xs text-slate-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
                你最看重哪些功能？
              </h2>
              <p className="text-slate-500 text-center mb-2">
                可多选，我们将重点匹配满足这些需求的产品
              </p>
              <p className="text-sm text-blue-600 text-center mb-10">
                已选择 {coreNeeds.length} 项
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {coreNeedsOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => toggleCoreNeed(option.value)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-center",
                      coreNeeds.includes(option.value)
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    )}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        coreNeeds.includes(option.value) ? "text-blue-700" : "text-slate-600"
                      )}
                    >
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  为你匹配到 {matchedProducts.length} 款产品
                </h2>
                <p className="text-slate-500">
                  基于你的需求，我们智能推荐以下高匹配度方案
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {matchedProducts.map((mp, index) => {
                  const product = getProductById(mp.productId);
                  if (!product) return null;
                  return (
                    <div key={mp.productId} className="relative">
                      {index === 0 && (
                        <div className="absolute -top-3 left-4 z-10 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                          🏆 最佳匹配
                        </div>
                      )}
                      <ProductCard
                        product={product}
                        showMatchScore
                        matchScore={mp.matchScore}
                        matchReasons={mp.matchReasons}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleAddAllToCompare}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  全部加入对比
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  重新填写
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-12">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors",
                  currentStep === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
                上一步
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={cn(
                  "flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all",
                  canProceed()
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                {currentStep === 4 ? '查看推荐结果' : '下一步'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
