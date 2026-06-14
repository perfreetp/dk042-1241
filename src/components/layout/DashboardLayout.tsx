import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  MessageSquare,
  Star,
  Settings,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/dashboard', label: '数据概览', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/dashboard/favorites', label: '我的收藏', icon: <Heart className="w-5 h-5" /> },
  { path: '/dashboard/appointments', label: '预约管理', icon: <Calendar className="w-5 h-5" /> },
  { path: '/dashboard/communications', label: '沟通记录', icon: <MessageSquare className="w-5 h-5" /> },
  { path: '/dashboard/reviews', label: '我的评价', icon: <Star className="w-5 h-5" /> },
  { path: '/dashboard/settings', label: '账号设置', icon: <Settings className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userRole } = useAppStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:block">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">商家后台</span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive(item.path) && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 truncate">商家用户</div>
              <div className="text-xs text-slate-500 truncate">138****8888</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 md:hidden px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">商家后台</span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500"
            >
              退出
            </button>
          </div>
          {/* Mobile Bottom Nav */}
          <nav className="flex justify-around mt-3 pt-3 border-t border-slate-100">
            {menuItems.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 text-xs",
                  isActive(item.path) ? "text-blue-600" : "text-slate-400"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
