import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Search, MoreVertical, ToggleLeft } from 'lucide-react';
import { products } from '@/data/mockData';
import ProviderLayout from '@/components/layout/ProviderLayout';

export default function ProviderProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [productList, setProductList] = useState(products.filter((p) => p.providerId === 'p1'));

  const handleToggleStatus = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p } : p))
    );
  };

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">产品管理</h1>
            <p className="text-slate-500 mt-1">共 {productList.length} 款产品</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" />
            新增产品
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索产品名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm text-slate-600 focus:outline-none">
                <option>全部行业</option>
                <option>餐饮</option>
                <option>教育</option>
                <option>医疗</option>
                <option>美业</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">
                  产品信息
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">
                  行业
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">
                  价格
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">
                  评分
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">
                  状态
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productList.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.logo}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                      <div>
                        <div className="font-medium text-slate-900">{product.name}</div>
                        <div className="text-xs text-slate-500">{product.providerName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
                      {product.industry}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">
                      ¥{product.priceMin} - ¥{product.priceMax}
                    </div>
                    <div className="text-xs text-slate-400">/{product.priceUnit}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500 font-medium">{product.rating}</span>
                      <span className="text-slate-400 text-xs">({product.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(product.id)}
                      className="text-emerald-500 hover:text-emerald-600"
                    >
                      <ToggleLeft className="w-6 h-6" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProviderLayout>
  );
}
