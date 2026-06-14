import { Link } from 'react-router-dom';
import { Heart, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductCard from '@/components/cards/ProductCard';

export default function DashboardFavorites() {
  const { favorites, getProductById, removeFavorite } = useAppStore();

  const favoriteProducts = favorites
    .map((fav) => {
      const product = getProductById(fav.productId);
      return product ? { ...fav, product } : null;
    })
    .filter(Boolean);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">我的收藏</h1>
            <p className="text-slate-500 mt-1">
              共收藏 {favorites.length} 款产品
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            去添加
          </Link>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((item) => (
              item && (
                <div key={item.productId} className="relative">
                  <ProductCard product={item.product} />
                  <button
                    onClick={() => removeFavorite(item.productId)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              还没有收藏产品
            </h3>
            <p className="text-slate-500 mb-6">
              去产品库逛逛，收藏感兴趣的产品吧
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
              浏览产品库
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
