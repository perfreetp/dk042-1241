import { Link } from 'react-router-dom';
import {
  Package,
  MessageCircle,
  FileText,
  TrendingUp,
  Eye,
  Star,
  ArrowRight,
  Clock,
  CheckCircle,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import ProviderLayout from '@/components/layout/ProviderLayout';

export default function ProviderHome() {
  const { getProviderStats } = useAppStore();
  const stats = getProviderStats();

  const statCards = [
    {
      label: '产品总数',
      value: stats.totalProducts,
      icon: <Package className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      trend: '+1',
    },
    {
      label: '总预约数',
      value: stats.totalAppointments,
      icon: <Calendar className="w-6 h-6" />,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      trend: '+3',
    },
    {
      label: '总咨询量',
      value: stats.totalInquiries,
      icon: <MessageCircle className="w-6 h-6" />,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      trend: '+12%',
    },
    {
      label: '待确认预约',
      value: stats.pendingAppointments,
      icon: <Clock className="w-6 h-6" />,
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-500',
      trend: '需处理',
    },
    {
      label: '平均评分',
      value: stats.avgRating,
      icon: <Star className="w-6 h-6" />,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      trend: '优秀',
    },
  ];

  const recentInquiries = [
    {
      id: 1,
      userName: '李老板',
      product: '美团收银专业版',
      message: '想了解连锁门店的价格方案',
      time: '10分钟前',
      status: 'pending',
    },
    {
      id: 2,
      userName: '王经理',
      product: '美团餐饮供应链',
      message: '请问支持多少家门店的库存管理？',
      time: '1小时前',
      status: 'pending',
    },
    {
      id: 3,
      userName: '张总',
      product: '美团收银专业版',
      message: '已经收到报价，考虑中',
      time: '昨天',
      status: 'replied',
    },
  ];

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">服务商后台 👋</h1>
          <p className="text-slate-500 mt-1">欢迎回来，看看今天的产品数据</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <div className="text-xs text-emerald-600 mt-1">{stat.trend}</div>
                </div>
                <div className={`${stat.bgColor} ${stat.iconColor} p-3 rounded-xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Inquiries */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900">最新咨询</h2>
              <Link
                to="/provider/inquiries"
                className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                查看全部
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentInquiries.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900">{item.userName}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          item.status === 'pending'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-green-50 text-green-600'
                        }`}
                      >
                        {item.status === 'pending' ? '待回复' : '已回复'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 truncate">{item.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {item.product} · {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-5">快捷操作</h2>
            <div className="space-y-3">
              <Link
                to="/provider/products"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">产品管理</div>
                  <div className="text-xs text-slate-500">管理产品信息</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/provider/appointments"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">预约管理</div>
                  <div className="text-xs text-slate-500">查看预约需求</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/provider/cases"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">案例管理</div>
                  <div className="text-xs text-slate-500">客户案例展示</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/provider/inquiries"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">咨询管理</div>
                  <div className="text-xs text-slate-500">回复客户咨询</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/provider/settings"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">企业设置</div>
                  <div className="text-xs text-slate-500">企业资料维护</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Views Chart Preview */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">产品浏览趋势</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Eye className="w-4 h-4" />
              总浏览量 {stats.totalViews}
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {[65, 45, 78, 52, 85, 72, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-slate-400">
                  {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
