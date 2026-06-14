import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Search, X, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { products } from '@/data/mockData';
import { cn } from '@/lib/utils';
import ProviderLayout from '@/components/layout/ProviderLayout';
import type { Industry } from '@/types';

const industries: Industry[] = ['餐饮', '教育', '医疗', '美业'];

export default function ProviderCases() {
  const { providerCases, addProviderCase, removeProviderCase } = useAppStore();
  const mockCases = products.find((p) => p.id === 'prod1')?.cases || [];
  const allCases = [...providerCases, ...mockCases];
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    clientName: '',
    industry: '餐饮' as Industry,
    description: '',
    results: [] as string[],
    image: '',
  });
  const [newResult, setNewResult] = useState('');

  const handleAddCase = () => {
    if (!newCase.title || !newCase.clientName) return;
    addProviderCase({
      ...newCase,
      image: newCase.image || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(newCase.title + ' ' + newCase.industry)}%20success%20case&image_size=landscape_16_9`,
    });
    setNewCase({ title: '', clientName: '', industry: '餐饮', description: '', results: [], image: '' });
    setShowAddForm(false);
  };

  const handleAddResult = () => {
    if (!newResult.trim()) return;
    setNewCase({ ...newCase, results: [...newCase.results, newResult.trim()] });
    setNewResult('');
  };

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">案例管理</h1>
            <p className="text-slate-500 mt-1">共 {allCases.length} 个案例</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增案例
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl border border-emerald-200 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">新增案例</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">案例标题 *</label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                    placeholder="如：XX连锁餐饮数字化转型"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">客户名称 *</label>
                  <input
                    type="text"
                    value={newCase.clientName}
                    onChange={(e) => setNewCase({ ...newCase, clientName: e.target.value })}
                    placeholder="客户公司/门店名称"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">所属行业</label>
                <select
                  value={newCase.industry}
                  onChange={(e) => setNewCase({ ...newCase, industry: e.target.value as Industry })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">案例描述</label>
                <textarea
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  rows={3}
                  placeholder="描述客户情况和解决方案..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">成果标签</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                    placeholder="如：效率提升50%"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResult())}
                  />
                  <button
                    onClick={handleAddResult}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {newCase.results.map((r, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs bg-green-50 text-green-600 rounded-full flex items-center gap-1"
                    >
                      {r}
                      <button
                        onClick={() => setNewCase({ ...newCase, results: newCase.results.filter((_, idx) => idx !== i) })}
                        className="text-green-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddCase}
                  disabled={!newCase.title || !newCase.clientName}
                  className="px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  添加案例
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCases.map((caseItem) => (
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
                  <button
                    onClick={() => removeProviderCase(caseItem.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-red-500"
                  >
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

        {allCases.length === 0 && (
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
