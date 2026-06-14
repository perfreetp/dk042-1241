import { Link } from 'react-router-dom';
import { LayoutGrid, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SaaS选品</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              专注垂直行业SaaS选型服务，帮助商家找到最适合的经营软件。
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">热门行业</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">餐饮SaaS</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">教育SaaS</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">医疗SaaS</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">美业SaaS</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">服务支持</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/questionnaire" className="hover:text-white transition-colors">智能选型</Link></li>
              <li><Link to="/consultants" className="hover:text-white transition-colors">顾问咨询</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">产品对比</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">帮助中心</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>400-888-8888</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@saasxuanpin.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>北京市朝阳区科技园区</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2024 SaaS选品平台. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/" className="text-slate-500 hover:text-white transition-colors">隐私政策</Link>
            <Link to="/" className="text-slate-500 hover:text-white transition-colors">服务条款</Link>
            <Link to="/" className="text-slate-500 hover:text-white transition-colors">关于我们</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
