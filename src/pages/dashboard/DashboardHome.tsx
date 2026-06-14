import { Link } from 'react-router-dom';
import {
  Heart,
  Calendar,
  MessageSquare,
  Star,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardHome() {
  const { getDashboardStats, appointments, favorites } = useAppStore();
  const stats = getDashboardStats();

  const statCards = [
    {
      label: '收藏产品',
      value: stats.totalFavorites,
      icon: <Heart className="w-6 h-6" />,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-500',
      link: '/dashboard/favorites',
    },
    {
      label: '预约总数',
      value: stats.totalAppointments,
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      link: '/dashboard/appointments',
    },
    {
      label: '待确认',
      value: stats.pendingAppointments,
      icon: <Clock className="w-6 h-6" />,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      link: '/dashboard/appointments?status=pending',
    },
    {
      label: '已完成',
      value: stats.completedAppointments,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      link: '/dashboard/appointments?status=completed',
    },
  ];

  const recentAppointments = appointments.slice(0, 3);

  const statusConfig = {
    pending: { label: '待确认', color: 'bg-amber-50 text-amber-600' },
    confirmed: { label: '已确认', color: 'bg-blue-50 text-blue-600' },
    completed: { label: '已完成', color: 'bg-green-50 text-green-600' },
    cancelled: { label: '已取消', color: 'bg-slate-100 text-slate-500' },
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">欢迎回来 👋</h1>
          <p className="text-slate-500 mt-1">今天是个选型的好日子</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <Link
              key={i}
              to={stat.link}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.iconColor} p-3 rounded-xl`}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900">最近预约</h2>
              <Link
                to="/dashboard/appointments"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                查看全部
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900 truncate">
                          {apt.productName || '顾问咨询'}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${statusConfig[apt.status].color}`}
                        >
                          {statusConfig[apt.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {apt.date} {apt.time} · {apt.consultantName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无预约记录</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-5">快捷入口</h2>
            <div className="space-y-3">
              <Link
                to="/products"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">浏览产品</div>
                  <div className="text-xs text-slate-500">发现更多好产品</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/questionnaire"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Star className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">智能选型</div>
                  <div className="text-xs text-slate-500">获取个性化推荐</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/consultants"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">找顾问</div>
                  <div className="text-xs text-slate-500">专业顾问1对1服务</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/compare"
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">方案对比</div>
                  <div className="text-xs text-slate-500">多维度对比分析</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* My Favorites Preview */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">我的收藏</h2>
            <Link
              to="/dashboard/favorites"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {favorites.length > 0 ? (
            <div className="text-sm text-slate-500">
              已收藏 {favorites.length} 款产品，点击查看详情
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Heart className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无收藏，去产品库看看吧</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
