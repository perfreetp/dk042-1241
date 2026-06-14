import { Plus, Edit2, Trash2, Eye, Search } from 'lucide-react';
import { products } from '@/data/mockData';
import ProviderLayout from '@/components/layout/ProviderLayout';

export default function ProviderCases() {
  const product = products.find((p) => p.id === 'prod1');
  const cases = product?.cases || [];

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">案例管理</h1>
            <p className="text-slate-500 mt-1">共 {cases.length} 个案例</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" />
            新增案例
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索案例名称..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group"
            >
              <div className="relative h-40">
                <img
                  src={caseItem.image}
                  alt={caseItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
                  {caseItem.industry}
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-emerald-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1">{caseItem.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{caseItem.clientName}</p>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{caseItem.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {caseItem.results.slice(0, 2).map((result, i) => (
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

        {cases.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">暂无案例</h3>
            <p className="text-slate-500">上传成功案例，提升产品说服力</p>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
}
