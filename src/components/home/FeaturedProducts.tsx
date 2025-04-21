import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { productService, Product } from '../../services/productService';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getFeaturedProducts();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка при загрузке рекомендуемых товаров:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  // Функция для расчета цены со скидкой
  const calculateDiscountPrice = (product: Product): number | null => {
    // Используем только процент скидки для расчета
    if (product.discount_percent && product.discount_percent > 0) {
      const discountAmount = product.price * (product.discount_percent / 100);
      return Math.round(product.price - discountAmount);
    }
    
    return null;
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300"></div>
                  
                  {/* Если есть отображение процента скидки, заменяем его так: */}
                  {product.discount_percent > 0 && (
                    <div className="absolute top-2 right-2 bg-matrix-green/80 text-black text-xs px-2 py-0.5 rounded">
                      -{product.discount_percent}%
                    </div>
                  )}
                </div>
                
                <div className="px-2">
                  <p className="text-sm text-matrix-green mb-1">{product.category_name}</p>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-matrix-green transition-colors duration-300">{product.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {/* Цена товара */}
                      <div className="mt-2">
                        {calculateDiscountPrice(product) ? (
                          <div className="flex items-center">
                            <span className="text-white font-bold">
                              {calculateDiscountPrice(product).toLocaleString('ru-RU')} ₽
                            </span>
                            <span className="text-sm text-gray-400 line-through ml-2">
                              {product.price.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        ) : (
                          <span className="text-white font-bold">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="text-matrix-green flex items-center text-sm transition-all duration-300 hover:underline bg-black/30 px-3 py-1.5 rounded-md border border-matrix-green/20 hover:border-matrix-green/40">
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
