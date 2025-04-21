import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFeaturedProducts } from '../../hooks/useFeaturedProducts';
import { Product } from '../../services/productService';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useFeaturedProducts();

  // Функция для форматирования цены
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  return (
    <section id="featured" className="py-20 bg-gradient-to-b from-matrix-dark via-black to-matrix-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Новые <span className="text-matrix-green">поступления</span>
        </h2>
        <p className="text-gray-400 mb-12">Откройте последние инновации Apple</p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-matrix-green animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded">
            Ошибка при загрузке продуктов
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="product-card group cursor-pointer"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {product.discount_price && (
                    <div className="absolute top-2 right-2 bg-matrix-green text-black text-xs font-bold px-2 py-1 rounded">
                      Скидка {Math.round((1 - product.discount_price / product.price) * 100)}%
                    </div>
                  )}
                </div>
                
                <div className="px-2">
                  <p className="text-sm text-matrix-green mb-1">{product.category_name}</p>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-matrix-green transition-colors duration-300">{product.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {product.discount_price ? (
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{formatPrice(product.discount_price)}</span>
                          <span className="text-gray-400 text-sm line-through">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="text-white font-semibold">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <button className="text-matrix-green flex items-center text-sm group-hover:underline transition-all duration-300">
                      Подробнее <ArrowRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Нет избранных продуктов для отображения</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
