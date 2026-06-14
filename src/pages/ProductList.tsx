import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid3X3, List, SlidersHorizontal, X, ChevronDown, Star, Search } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { industries, featureCategories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Industry, FilterOptions } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/cards/ProductCard';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFilteredProducts, filterOptions, setFilterOptions, currentIndustry } = useAppStore();
  const products = getFilteredProducts();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setFilterOptions({ search });
      setSearchQuery(search);
    }
  }, [searchParams, setFilterOptions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilterOptions({ search: searchQuery });
      setSearchParams({ search: searchQuery });
    } else {
      setFilterOptions({ search: undefined });
      setSearchParams({});
    }
  };

  const handleIndustryChange = (industry?: Industry) => {
    setFilterOptions({ industry });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setFilterOptions({ sortBy });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setFilterOptions({ priceMin: min, priceMax: max });
  };

  const handleRatingChange = (minRating?: number) => {
    setFilterOptions({ minRating });
  };

  const clearFilters = () => {
    setFilterOptions({
      industry: undefined,
      priceMin: undefined,
      priceMax: undefined,
      minRating: undefined,
      features: undefined,
      sortBy: undefined,
      search: undefined,
    });
    setSearchQuery('');
    setSearchParams({});
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          筛选条件
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          重置
        </button>
      </div>

      {/* 行业筛选 */}
      <FilterSection title="行业">
        <div className="space-y-2">
          <button
            onClick={() => handleIndustryChange(undefined)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              !filterOptions.industry ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-slate-50 text-slate-600"
            )}
          >
            全部行业
          </button>
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => handleIndustryChange(ind)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                filterOptions.industry === ind ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-slate-50 text-slate-600"
              )}
            >
              {ind}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* 价格筛选 */}
      <FilterSection title="价格区间（元/月）">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="最低"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                handlePriceChange(val, filterOptions.priceMax);
              }}
            />
            <span className="text-slate-400 self-center">-</span>
            <input
              type="number"
              placeholder="最高"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                handlePriceChange(filterOptions.priceMin, val);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '100以下', min: undefined, max: 100 },
              { label: '100-500', min: 100, max: 500 },
              { label: '500-1000', min: 500, max: 1000 },
              { label: '1000以上', min: 1000, max: undefined },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => handlePriceChange(range.min, range.max)}
                className="px-3 py-1.5 text-xs rounded-full border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* 评分筛选 */}
      <FilterSection title="用户评分">
        <div className="space-y-2">
          {[
            { label: '4.5分以上', value: 4.5 },
            { label: '4分以上', value: 4 },
            { label: '3.5分以上', value: 3.5 },
            { label: '全部', value: undefined },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleRatingChange(item.value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                filterOptions.minRating === item.value ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-slate-50 text-slate-600"
              )}
            >
              {item.value && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
              {item.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* 功能筛选 */}
      <FilterSection title="核心功能">
        <div className="flex flex-wrap gap-2">
          {featureCategories.slice(0, 8).map((feature) => (
            <button
              key={feature}
              onClick={() => {
                const features = filterOptions.features || [];
                const newFeatures = features.includes(feature)
                  ? features.filter((f) => f !== feature)
                  : [...features, feature];
                setFilterOptions({ features: newFeatures.length > 0 ? newFeatures : undefined });
              }}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition-colors",
                filterOptions.features?.includes(feature)
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-slate-200 hover:border-blue-500 hover:text-blue-600"
              )}
            >
              {feature}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {filterOptions.industry || currentIndustry}SaaS产品库
                </h1>
                <p className="text-slate-500 mt-1">
                  共找到 <span className="font-medium text-blue-600">{products.length}</span> 款产品
                </p>
              </div>
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索产品名称、功能..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700"
                onClick={() => setShowMobileFilter(true)}
              >
                <Filter className="w-4 h-4" />
                筛选
              </button>
              
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-slate-500">排序：</span>
                <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                  {[
                    { label: '综合', value: undefined },
                    { label: '评分最高', value: 'rating' as const },
                    { label: '价格最低', value: 'price-asc' as const },
                    { label: '评价最多', value: 'reviewCount' as const },
                  ].map((sort) => (
                    <button
                      key={sort.label}
                      onClick={() => handleSortChange(sort.value)}
                      className={cn(
                        "px-3 py-1.5 text-sm transition-colors",
                        filterOptions.sortBy === sort.value || (!filterOptions.sortBy && !sort.value)
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'grid' ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:bg-slate-100"
                )}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'list' ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:bg-slate-100"
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-xl p-5 border border-slate-200">
                <FilterSidebar />
              </div>
            </aside>

            {/* Mobile Filter Drawer */}
            {showMobileFilter && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowMobileFilter(false)}
                />
                <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
                    <h3 className="font-semibold">筛选条件</h3>
                    <button onClick={() => setShowMobileFilter(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar />
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {products.length > 0 ? (
                <div className={cn(
                  "gap-6",
                  viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col"
                )}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">未找到匹配的产品</h3>
                  <p className="text-slate-500 mb-4">试试调整筛选条件</p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    清除所有筛选
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
      <button
        className="w-full flex items-center justify-between mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium text-slate-700">{title}</span>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", !isOpen && "-rotate-90")} />
      </button>
      {isOpen && <div className="animate-in fade-in slide-in-from-top-2 duration-200">{children}</div>}
    </div>
  );
}
