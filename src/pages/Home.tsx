import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Store, Users, BarChart3, Shield, Star, ChevronRight, Zap, Target, MessageSquare, ThumbsUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { industries } from '@/data/mockData';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/cards/ProductCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const industryIcons: Record<string, React.ReactNode> = {
  '餐饮': <Store className="w-6 h-6" />,
  '教育': <Users className="w-6 h-6" />,
  '医疗': <Shield className="w-6 h-6" />,
  '美业': <Sparkles className="w-6 h-6" />,
};

const industryDescriptions: Record<string, string> = {
  '餐饮': '从点餐收银到供应链管理，一站式餐饮数字化解决方案',
  '教育': '招生获客、教务管理、家校沟通，助力教育机构高效运营',
  '医疗': '诊所管理、电子处方、医保对接，专业医疗信息化系统',
  '美业': '预约排班、会员营销、员工绩效，美业经营好帮手',
};

const steps = [
  { icon: <Target className="w-6 h-6" />, title: '填写需求', desc: '告诉我们你的行业、规模和核心需求' },
  { icon: <Zap className="w-6 h-6" />, title: '智能匹配', desc: '系统根据需求算法匹配最优方案' },
  { icon: <BarChart3 className="w-6 h-6" />, title: '深度对比', desc: '多维度横向对比，功能价格一目了然' },
  { icon: <MessageSquare className="w-6 h-6" />, title: '顾问咨询', desc: '专业顾问一对一服务，帮你做决策' },
];

export default function Home() {
  const navigate = useNavigate();
  const { currentIndustry, setCurrentIndustry, getProducts } = useAppStore();
  const products = getProducts();
  const industryProducts = products.filter((p) => p.industry === currentIndustry).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-blue-200 mb-6">
                <Sparkles className="w-4 h-4" />
                已服务 100,000+ 商家成功选型
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                找到最适合你的
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  &nbsp;门店经营软件
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                聚焦餐饮、教育、医疗、美业四大行业，智能匹配 + 专业顾问，
                <br className="hidden md:block" />
                帮你快速找到高性价比的SaaS解决方案。
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setCurrentIndustry(ind)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all",
                      currentIndustry === ind
                        ? "bg-white text-slate-900 shadow-lg shadow-white/20"
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    {industryIcons[ind]}
                    {ind}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/questionnaire"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  免费智能选型
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  浏览全部产品
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10,000+', label: '覆盖SaaS产品' },
                { value: '100,000+', label: '服务商家用户' },
                { value: '4.8分', label: '平均用户评分' },
                { value: '98%', label: '选型满意度' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hot Products */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full mb-3">
                  <Star className="w-4 h-4" />
                  热门推荐
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {currentIndustry}行业热门软件
                </h2>
                <p className="text-slate-500 mt-2">{industryDescriptions[currentIndustry]}</p>
              </div>
              <Link
                to="/products"
                className="hidden md:inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700"
              >
                查看全部
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full mb-3">
                选型流程
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                四步轻松找到合适的SaaS
              </h2>
              <p className="text-slate-500 mt-2">
                专业选型方法论，帮你省时省力做对决策
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="bg-slate-50 rounded-2xl p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                      {step.icon}
                    </div>
                    <div className="text-sm text-blue-600 font-medium mb-2">第 {i + 1} 步</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ChevronRight className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/questionnaire"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                立即开始选型
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Success Cases */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded-full mb-3">
                <ThumbsUp className="w-4 h-4" />
                成功案例
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                他们都在用我们的平台选型
              </h2>
              <p className="text-slate-500 mt-2">
                千家企业的共同选择
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: '某连锁餐饮品牌',
                  desc: '20家门店统一管理，运营效率提升50%',
                  industry: '餐饮',
                  results: ['运营效率+50%', '人力成本-30%', '顾客满意度+25%'],
                  image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=restaurant%20chain%20modern%20interior%20busy&image_size=landscape_4_3',
                },
                {
                  title: '某知名教育机构',
                  desc: '招生转化率提升40%，学员续费率提升35%',
                  industry: '教育',
                  results: ['招生转化+40%', '续费率+35%', '教务效率+60%'],
                  image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=education%20training%20classroom%20modern%20students&image_size=landscape_4_3',
                },
                {
                  title: '某高端医美诊所',
                  desc: '客户预约效率翻倍，会员复购率大幅提升',
                  industry: '医疗',
                  results: ['预约效率+100%', '复购率+45%', '运营成本-20%'],
                  image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20beauty%20clinic%20interior%20luxury%20clean&image_size=landscape_4_3',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate('/products')}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700">
                      {item.industry}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.results.map((r, j) => (
                        <span
                          key={j}
                          className="px-2.5 py-1 text-xs bg-green-50 text-green-600 rounded-full font-medium"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative px-8 py-12 lg:px-16 lg:py-16 text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  还在为选什么SaaS发愁？
                </h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  花3分钟填写需求问卷，专业顾问为你免费推荐最合适的方案
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/questionnaire"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    开始智能选型
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/consultants"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/30"
                  >
                    咨询专业顾问
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
