import { Link } from 'react-router-dom';
import { Heart, Star, Plus, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showMatchScore?: boolean;
  matchScore?: number;
  matchReasons?: string[];
}

export default function ProductCard({ product, showMatchScore, matchScore, matchReasons }: ProductCardProps) {
  const { isFavorite, addFavorite, removeFavorite, isInCompare, addToCompare, removeFromCompare, compareList } = useAppStore();
  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product.id);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative p-5 border-b border-slate-100">
        {showMatchScore && matchScore !== undefined && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
            匹配度 {matchScore}%
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={handleFavorite}
            className={cn(
              "p-1.5 rounded-full transition-colors",
              favorite ? "text-rose-500 bg-rose-50" : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
            )}
          >
            <Heart className={cn("w-4 h-4", favorite && "fill-current")} />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <img
            src={product.logo}
            alt={product.name}
            className="w-14 h-14 rounded-xl object-cover bg-slate-100"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {product.name}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">{product.providerName}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-slate-700">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewCount}条评价)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1.5">匹配亮点</p>
            <ul className="space-y-0.5">
              {matchReasons.slice(0, 2).map((reason, i) => (
                <li key={i} className="text-xs text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600">¥{product.priceMin}</span>
            <span className="text-sm text-slate-400"> /{product.priceUnit}起</span>
          </div>
          <button
            onClick={handleCompare}
            disabled={!inCompare && compareList.length >= 4}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
              inCompare
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {inCompare ? (
              <>
                <Check className="w-3.5 h-3.5" />
                已添加
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                对比
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
