import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, Briefcase, LayoutGrid } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [role, setRole] = useState<'merchant' | 'provider' | 'consultant'>('merchant');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!phone) {
      alert('请输入手机号');
      return;
    }
    login(role);
    if (role === 'merchant') {
      navigate('/dashboard');
    } else if (role === 'provider') {
      navigate('/provider');
    } else {
      navigate('/dashboard');
    }
  };

  const roleOptions = [
    { value: 'merchant' as const, label: '商家用户', icon: <Building2 className="w-5 h-5" />, desc: '我要找SaaS软件' },
    { value: 'provider' as const, label: '服务商', icon: <Briefcase className="w-5 h-5" />, desc: '我要入驻推广产品' },
    { value: 'consultant' as const, label: '顾问', icon: <User className="w-5 h-5" />, desc: '我是行业顾问' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">SaaS选品</span>
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">欢迎登录</h1>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setRole(option.value)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all text-center",
                  role === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5",
                    role === option.value ? "text-blue-600" : "text-slate-400"
                  )}
                >
                  {option.icon}
                </div>
                <div
                  className={cn(
                    "text-xs font-medium",
                    role === option.value ? "text-blue-700" : "text-slate-600"
                  )}
                >
                  {option.label}
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                手机号
              </label>
              <input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                密码
              </label>
              <input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-slate-600">记住我</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                忘记密码？
              </a>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
            >
              登录
            </button>

            <p className="text-center text-sm text-slate-500">
              还没有账号？
              <a href="#" className="text-blue-600 hover:underline ml-1">
                立即注册
              </a>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400 mb-3">
              演示账号（点击即可登录体验）
            </p>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setRole(option.value);
                    login(option.value);
                    if (option.value === 'merchant') navigate('/dashboard');
                    else if (option.value === 'provider') navigate('/provider');
                    else navigate('/dashboard');
                  }}
                  className="py-2 text-xs text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {option.label}登录
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
