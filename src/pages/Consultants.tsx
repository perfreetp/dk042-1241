import { useState } from 'react';
import { Star, Calendar, MessageSquare, Award, Clock, Check, X } from 'lucide-react';
import { consultants } from '@/data/mockData';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Consultants() {
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleAppointment = (consultantId: string) => {
    setSelectedConsultant(consultantId);
    setShowAppointmentModal(true);
  };

  const consultant = consultants.find((c) => c.id === selectedConsultant);

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      alert('请填写姓名和手机号');
      return;
    }
    alert('预约成功！顾问将尽快与你联系。');
    setShowAppointmentModal(false);
    setFormData({ name: '', phone: '', company: '', date: '', time: '', notes: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">专业顾问 一对一服务</h1>
              <p className="text-lg text-slate-300 mb-6">
                资深行业顾问为你提供专业的SaaS选型建议，帮你省时省力做出正确决策
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <div className="font-semibold">10年+</div>
                    <div className="text-xs text-slate-400">平均行业经验</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-300" />
                  </div>
                  <div>
                    <div className="font-semibold">10000+</div>
                    <div className="text-xs text-slate-400">成功服务案例</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold">4.9分</div>
                    <div className="text-xs text-slate-400">平均用户评分</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consultant List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">选择你的专属顾问</h2>
              <p className="text-slate-500 mt-1">按专业领域和经验选择最适合的顾问</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultants.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-5">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{c.name}</h3>
                        <p className="text-sm text-slate-500">{c.title}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-900">{c.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {c.experienceYears}年经验
                      </span>
                      <span>{c.reviewCount}条评价</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {c.specialties.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-4 leading-relaxed">{c.bio}</p>

                <div className="flex gap-3 mt-5 pt-5 border-t border-slate-100">
                  <button
                    onClick={() => handleAppointment(c.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    预约咨询
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    在线咨询
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Service Features */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
              我们的服务承诺
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: <Award className="w-6 h-6" />, title: '专业资质', desc: '所有顾问均经过严格审核认证' },
                { icon: <Clock className="w-6 h-6" />, title: '快速响应', desc: '工作日24小时内必有回复' },
                { icon: <Check className="w-6 h-6" />, title: '客观公正', desc: '不偏袒任何厂商，只选对的' },
                { icon: <MessageSquare className="w-6 h-6" />, title: '全程跟进', desc: '从选型到落地全流程陪伴' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 text-center border border-slate-200"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Appointment Modal */}
      {showAppointmentModal && consultant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAppointmentModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAppointmentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <img
                src={consultant.avatar}
                alt={consultant.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  预约 {consultant.name}
                </h3>
                <p className="text-sm text-slate-500">{consultant.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="请输入姓名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  手机号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  公司/门店名称
                </label>
                <input
                  type="text"
                  placeholder="请输入公司或门店名称"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    预约日期
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    预约时间
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">选择时间</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  咨询内容
                </label>
                <textarea
                  placeholder="请简要描述你的需求和问题"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                提交预约
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
