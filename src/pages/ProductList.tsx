import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid3X3, List, SlidersHorizontal, X, ChevronDown, Star, Search, BookmarkPlus, Bookmark, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { industries, featureCategories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Industry, FilterOptions } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/cards/ProductCard';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFilteredProducts, filterOptions, setFilterOptions, savedFilters, saveFilter, deleteSavedFilter, applySavedFilter } = useAppStore();
  const products = getFilteredProducts();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [filterName, setFilterName] = useState('');

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

  const handleAfterSaleScopeChange = (scope: string) => {
    const current = filterOptions.afterSaleScope || [];
    const newScopes = current.includes(scope)
      ? current.filter((s) => s !== scope)
      : [...current, scope];
    setFilterOptions({ afterSaleScope: newScopes.length > 0 ? newScopes : undefined });
  };

  const clearFilters = () => {
    setFilterOptions({
      industry: undefined,
      priceMin: undefined,
      priceMax: undefined,
      minRating: undefined,
      features: undefined,
      afterSaleScope: undefined,
      sortBy: undefined,
      search: undefined,
    });
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = useMemo(() => {
    return filterOptions.industry
      || filterOptions.priceMin !== undefined
      || filterOptions.priceMax !== undefined
      || filterOptions.minRating
      || (filterOptions.features && filterOptions.features.length > 0)
      || (filterOptions.afterSaleScope && filterOptions.afterSaleScope.length > 0)
      || filterOptions.search;
  }, [filterOptions]);

  const activeSavedFilter = useMemo(() => {
    return savedFilters.find((sf) => {
      const sfKeys = Object.keys(sf.filterOptions).sort().join(',');
      const curKeys = Object.keys(filterOptions).sort().join(',');
      if (sfKeys !== curKeys) return false;
      return JSON.stringify(sf.filterOptions) === JSON.stringify(filterOptions);
    });
  }, [savedFilters, filterOptions]);

  const handleSaveFilter = () => {
    if (!filterName.trim() || !hasActiveFilters) return;
    saveFilter(filterName.trim(), { ...filterOptions });
    setShowSaveModal(false);
    setFilterName('');
  };

  const handleApplyFilter = (id: string) => {
    applySavedFilter(id);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* 常用方案 */}
      {savedFilters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-500" />
              常用筛选方案
            </h3>
          </div>
          <div className="space-y-1.5">
            {savedFilters.map((sf) => (
              <div
                key={sf.id}
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors group",
                  activeSavedFilter?.id === sf.id
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "hover:bg-slate-50 text-slate-600 border border-transparent"
                )}
              >
                <button
                  onClick={() => handleApplyFilter(sf.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="font-medium truncate">{sf.name}</div>
                  <div className="text-xs opacity-70 truncate">
                    {[
                      sf.filterOptions.industry && `行业:${sf.filterOptions.industry}`,
                      sf.filterOptions.priceMax && `≤¥${sf.filterOptions.priceMax}`,
                      sf.filterOptions.minRating && `${sf.filterOptions.minRating}分+`,
                      sf.filterOptions.features?.length && `${sf.filterOptions.features.length}功能`,
                    ].filter(Boolean).join(' · ') || '自定义组合'}
                  </div>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSavedFilter(sf.id); }}
                  className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  title="删除方案"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
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

      {/* 售后服务范围筛选 */}
      <FilterSection title="售后服务范围">
        <div className="flex flex-wrap gap-2">
          {['上门服务', '在线客服', '实施顾问', '培训课程', '版本更新', '数据安全'].map((scope) => (
            <button
              key={scope}
              onClick={() => handleAfterSaleScopeChange(scope)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition-colors",
                filterOptions.afterSaleScope?.includes(scope)
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-slate-200 hover:border-blue-500 hover:text-blue-600"
              )}
            >
              {scope}
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
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {filterOptions.industry ? `${filterOptions.industry}SaaS产品库` : '全行业SaaS产品库'}
                  </h1>
                  {activeSavedFilter && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                      <Bookmark className="w-3.5 h-3.5" />
                      {activeSavedFilter.name}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 mt-1">
                  共找到 <span className="font-medium text-blue-600">{products.length}</span> 款产品
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <button
                  onClick={() => {
                    if (hasActiveFilters) setShowSaveModal(true);
                  }}
                  disabled={!hasActiveFilters}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap",
                    hasActiveFilters
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                  title={hasActiveFilters ? '保存当前筛选条件' : '先选择筛选条件再保存'}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  保存筛法
                </button>
              </div>
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
              {/* Active Filters */}
              {(filterOptions.industry || filterOptions.priceMin !== undefined || filterOptions.priceMax !== undefined || filterOptions.minRating || (filterOptions.features && filterOptions.features.length > 0) || (filterOptions.afterSaleScope && filterOptions.afterSaleScope.length > 0) || filterOptions.search) && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-slate-500 flex-shrink-0">已选条件：</span>
                    
                    {filterOptions.industry && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                        行业：{filterOptions.industry}
                        <button onClick={() => setFilterOptions({ industry: undefined })} className="hover:text-blue-800">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                    
                    {(filterOptions.priceMin !== undefined || filterOptions.priceMax !== undefined) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                        价格：¥{filterOptions.priceMin || 0} - ¥{filterOptions.priceMax || '不限'}
                        <button onClick={() => setFilterOptions({ priceMin: undefined, priceMax: undefined })} className="hover:text-blue-800">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                    
                    {filterOptions.minRating && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                        评分：{filterOptions.minRating}分以上
                        <button onClick={() => setFilterOptions({ minRating: undefined })} className="hover:text-blue-800">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                    
                    {filterOptions.features?.map((feature) => (
                      <span key={feature} className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full">
                        {feature}
                        <button
                          onClick={() => {
                            const newFeatures = filterOptions.features!.filter((f) => f !== feature);
                            setFilterOptions({ features: newFeatures.length > 0 ? newFeatures : undefined });
                          }}
                          className="hover:text-green-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    
                    {filterOptions.afterSaleScope?.map((scope) => (
                      <span key={scope} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full">
                        售后：{scope}
                        <button
                          onClick={() => {
                            const newScopes = filterOptions.afterSaleScope!.filter((s) => s !== scope);
                            setFilterOptions({ afterSaleScope: newScopes.length > 0 ? newScopes : undefined });
                          }}
                          className="hover:text-purple-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    
                    {filterOptions.search && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 text-sm rounded-full">
                        搜索：{filterOptions.search}
                        <button
                          onClick={() => {
                            setFilterOptions({ search: undefined });
                            setSearchQuery('');
                            setSearchParams({});
                          }}
                          className="hover:text-amber-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                    
                    <button
                      onClick={clearFilters}
                      className="text-sm text-slate-500 hover:text-slate-700 ml-1 flex-shrink-0"
                    >
                      清除全部
                    </button>
                  </div>
                </div>
              )}

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

      {/* 保存筛选弹窗 */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSaveModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-2">保存筛选方案</h3>
            <p className="text-slate-500 mb-4 text-sm">
              保存当前筛选条件，下次一键套用
            </p>
            <div className="mb-4 p-3 bg-slate-50 rounded-xl text-sm space-y-1">
              <div className="text-slate-500 text-xs mb-1.5">当前筛选条件：</div>
              {filterOptions.industry && <div>· 行业：{filterOptions.industry}</div>}
              {(filterOptions.priceMin !== undefined || filterOptions.priceMax !== undefined) && (
                <div>· 价格：¥{filterOptions.priceMin || 0} - ¥{filterOptions.priceMax || '不限'}</div>
              )}
              {filterOptions.minRating && <div>· 评分：{filterOptions.minRating} 分以上</div>}
              {filterOptions.features?.length ? <div>· 功能：{filterOptions.features.join('、')}</div> : null}
              {filterOptions.afterSaleScope?.length ? <div>· 售后：{filterOptions.afterSaleScope.join('、')}</div> : null}
              {filterOptions.search && <div>· 搜索词：{filterOptions.search}</div>}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">方案名称</label>
                <input
                  type="text"
                  placeholder="如：高性价比餐饮方案"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveFilter}
                  disabled={!filterName.trim()}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
