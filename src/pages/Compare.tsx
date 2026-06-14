import { Link } from 'react-router-dom';
import { X, Plus, ArrowLeft, BarChart3, Check, Minus } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { featureCategories } from '@/data/mockData';
import { useState } from 'react';

export default function Compare() {
  const { compareList, getCompareProducts, removeFromCompare, clearCompare, getProducts, addAppointment } = useAppStore();
  const compareProducts = getCompareProducts();
  const allProducts = getProducts();
  const [appointmentProduct, setAppointmentProduct] = useState<{id: string, name: string} | null>(null);
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({ name: '', phone: '', company: '', date: '', notes: '' });

  const handleAppointmentClick = (productId: string, productName: string) => {
    setAppointmentProduct({ id: productId, name: productName });
    setAppointmentSubmitted(false);
    setAppointmentForm({ name: '', phone: '', company: '', date: '', notes: '' });
  };

  const handleAppointmentSubmit = () => {
    if (!appointmentProduct || !appointmentForm.name || !appointmentForm.phone) return;
    addAppointment({
      userId: 'user1',
      userName: appointmentForm.name,
      productId: appointmentProduct.id,
      productName: appointmentProduct.name,
      type: 'demo',
      date: appointmentForm.date || new Date().toISOString().split('T')[0],
      time: '',
      status: 'pending',
      notes: appointmentForm.notes,
    });
    setAppointmentSubmitted(true);
  };

  const handleCloseAppointment = () => {
    setAppointmentProduct(null);
    setAppointmentSubmitted(false);
  };

  const getFeatureCoverage = (productId: string) => {
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return [];
    
    return featureCategories.slice(0, 6).map((category) => {
      const categoryFeatures = product.features.filter((f) => f.category === category);
      const hasCount = categoryFeatures.filter((f) => f.hasFeature).length;
      const coverage = categoryFeatures.length > 0 ? (hasCount / categoryFeatures.length) * 100 : 0;
      return {
        category,
        score: Math.round(coverage),
        fullMark: 100,
      };
    });
  };

  const allFeatures = featureCategories.slice(0, 8);

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">还没有添加对比产品</h2>
            <p className="text-slate-500 mb-6">去产品库选择产品加入对比吧</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              浏览产品库
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回产品库
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">方案对比</h1>
                <p className="text-slate-500 mt-1">
                  已添加 {compareProducts.length} 款产品对比
                </p>
              </div>
              <button
                onClick={clearCompare}
                className="text-sm text-slate-500 hover:text-red-500 transition-colors"
              >
                清空对比
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Radar Chart Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">功能覆盖度对比</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={getFeatureCoverage(compareProducts[0]?.id)}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  {compareProducts.map((product, index) => {
                    const colors = ['#2563eb', '#f97316', '#10b981', '#8b5cf6'];
                    return (
                      <Radar
                        key={product.id}
                        name={product.name}
                        dataKey="score"
                        stroke={colors[index]}
                        fill={colors[index]}
                        fillOpacity={0.2}
                        strokeWidth={2}
                        // @ts-expect-error recharts Radar data prop type mismatch
                      data={getFeatureCoverage(product.id)}
                      />
                    );
                  })}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compare Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <colgroup>
                  <col className="w-48" />
                  {compareProducts.map(() => (
                    <col key={Math.random()} className="w-1/4" />
                  ))}
                </colgroup>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left p-4 text-sm font-medium text-slate-500">
                      对比项
                    </th>
                    {compareProducts.map((product) => (
                      <th key={product.id} className="p-4">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-slate-200 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="flex flex-col items-center">
                            <img
                              src={product.logo}
                              alt={product.name}
                              className="w-14 h-14 rounded-xl object-cover bg-slate-100 mb-2"
                            />
                            <Link
                              to={`/products/${product.id}`}
                              className="font-semibold text-slate-900 hover:text-blue-600"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {product.providerName}
                            </p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* 评分 */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 text-sm font-medium text-slate-700">综合评分</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <span className="text-2xl font-bold text-amber-500">
                          {product.rating}
                        </span>
                        <span className="text-sm text-slate-400 ml-1">
                          /5.0
                        </span>
                        <div className="text-xs text-slate-400 mt-1">
                          {product.reviewCount} 条评价
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* 价格 */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 text-sm font-medium text-slate-700">价格区间</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <span className="text-xl font-bold text-blue-600">
                          ¥{product.priceMin}
                        </span>
                        <span className="text-sm text-slate-400">
                          {' '}- ¥{product.priceMax}/{product.priceUnit}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* 行业 */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 text-sm font-medium text-slate-700">适用行业</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                          {product.industry}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* 功能对比 */}
                  {allFeatures.map((category) => (
                    <tr key={category} className="border-b border-slate-100">
                      <td className="p-4 text-sm font-medium text-slate-700">{category}</td>
                      {compareProducts.map((product) => {
                        const categoryFeatures = product.features.filter(
                          (f) => f.category === category
                        );
                        const hasCount = categoryFeatures.filter((f) => f.hasFeature).length;
                        const totalCount = categoryFeatures.length;
                        const ratio = totalCount > 0 ? hasCount / totalCount : 0;
                        return (
                          <td key={product.id} className="p-4 text-center">
                            {ratio >= 0.8 ? (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <Check className="w-4 h-4" />
                                完整支持
                              </span>
                            ) : ratio > 0 ? (
                              <span className="inline-flex items-center gap-1 text-amber-600">
                                <Minus className="w-4 h-4" />
                                部分支持
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-400">
                                <X className="w-4 h-4" />
                                不支持
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* 售后服务 */}
                  <tr className="border-b border-slate-100">
                    <td className="p-4 text-sm font-medium text-slate-700">售后服务</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4">
                        <ul className="space-y-1">
                          {product.afterSaleScope.slice(0, 4).map((item, i) => (
                            <li
                              key={i}
                              className="text-sm text-slate-600 flex items-center gap-1.5 justify-center"
                            >
                              <Check className="w-3.5 h-3.5 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* 操作按钮 */}
                  <tr>
                    <td className="p-4"></td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="flex flex-col gap-2">
                          <Link
                            to={`/products/${product.id}`}
                            className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                          >
                            查看详情
                          </Link>
                          <button
                            onClick={() => handleAppointmentClick(product.id, product.name)}
                            className="w-full py-2.5 border border-blue-200 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            预约演示
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Add More Products */}
          {compareProducts.length < 4 && (
            <div className="mt-6">
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 py-8 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                添加更多产品对比（最多4款）
              </Link>
            </div>
          )}
        </div>
      </main>

      {appointmentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseAppointment} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <button onClick={handleCloseAppointment} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            {appointmentSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">预约成功！</h3>
                <p className="text-slate-500 mb-6">专属顾问将尽快与你联系，可在商家后台「预约管理」中查看进度</p>
                <div className="flex gap-3">
                  <Link to="/dashboard/appointments" className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-center">
                    查看预约
                  </Link>
                  <button onClick={handleCloseAppointment} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                    继续对比
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-2">预约演示 — {appointmentProduct.name}</h3>
                <p className="text-slate-500 mb-6">填写信息，专属顾问将尽快与你联系</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">姓名 <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="请输入姓名" value={appointmentForm.name} onChange={(e) => setAppointmentForm({...appointmentForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">手机号 <span className="text-red-500">*</span></label>
                    <input type="tel" placeholder="请输入手机号" value={appointmentForm.phone} onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">公司名称</label>
                    <input type="text" placeholder="请输入公司/门店名称" value={appointmentForm.company} onChange={(e) => setAppointmentForm({...appointmentForm, company: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">预约时间</label>
                    <input type="date" value={appointmentForm.date} onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">备注</label>
                    <textarea placeholder="请描述你的具体需求" rows={3} value={appointmentForm.notes} onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" />
                  </div>
                  <button onClick={handleAppointmentSubmit} disabled={!appointmentForm.name || !appointmentForm.phone} className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
