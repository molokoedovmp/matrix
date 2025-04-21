import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { 
  Package, 
  Tag, 
  Users, 
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalTags: number;
  productsInStock: number;
  productsOutOfStock: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Получаем общее количество продуктов
        const { count: totalProducts, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
          
        if (productsError) throw productsError;
        
        // Получаем количество продуктов в наличии
        const { count: productsInStock, error: inStockError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('in_stock', true);
          
        if (inStockError) throw inStockError;
        
        // Получаем общее количество категорий
        const { count: totalCategories, error: categoriesError } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });
          
        if (categoriesError) throw categoriesError;
        
        // Получаем общее количество тегов
        const { count: totalTags, error: tagsError } = await supabase
          .from('tags')
          .select('*', { count: 'exact', head: true });
          
        if (tagsError) throw tagsError;
        
        setStats({
          totalProducts: totalProducts || 0,
          totalCategories: totalCategories || 0,
          totalTags: totalTags || 0,
          productsInStock: productsInStock || 0,
          productsOutOfStock: (totalProducts || 0) - (productsInStock || 0)
        });
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
        setError('Не удалось загрузить статистику');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Дашборд</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-matrix-green animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-black/30 border border-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Всего продуктов</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{stats?.totalProducts}</h3>
                  </div>
                  <div className="bg-blue-900/30 p-3 rounded-lg">
                    <Package className="text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <div className="flex items-center text-green-400">
                    <ArrowUpRight size={16} className="mr-1" />
                    <span>В наличии: {stats?.productsInStock}</span>
                  </div>
                  <div className="mx-2 text-gray-600">|</div>
                  <div className="flex items-center text-orange-400">
                    <ArrowDownRight size={16} className="mr-1" />
                    <span>Под заказ: {stats?.productsOutOfStock}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 border border-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Категории</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{stats?.totalCategories}</h3>
                  </div>
                  <div className="bg-purple-900/30 p-3 rounded-lg">
                    <TrendingUp className="text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <div className="flex items-center text-matrix-green">
                    <span>Активные категории товаров</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 border border-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Теги</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{stats?.totalTags}</h3>
                  </div>
                  <div className="bg-green-900/30 p-3 rounded-lg">
                    <Tag className="text-green-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <div className="flex items-center text-matrix-green">
                    <span>Используются для фильтрации</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 border border-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">Пользователи</p>
                    <h3 className="text-3xl font-bold text-white mt-2">1</h3>
                  </div>
                  <div className="bg-orange-900/30 p-3 rounded-lg">
                    <Users className="text-orange-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <div className="flex items-center text-matrix-green">
                    <span>Администраторы системы</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-black/30 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Последние действия</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 border-b border-gray-800 pb-4">
                    <div className="bg-blue-900/30 p-2 rounded">
                      <Package size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white">Добавлен новый продукт</p>
                      <p className="text-gray-400 text-sm">iPhone 14 Pro</p>
                      <p className="text-gray-500 text-xs mt-1">Сегодня, 14:32</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 border-b border-gray-800 pb-4">
                    <div className="bg-purple-900/30 p-2 rounded">
                      <TrendingUp size={16} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white">Добавлена новая категория</p>
                      <p className="text-gray-400 text-sm">MacBook</p>
                      <p className="text-gray-500 text-xs mt-1">Вчера, 18:45</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-900/30 p-2 rounded">
                      <Tag size={16} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-white">Добавлен новый тег</p>
                      <p className="text-gray-400 text-sm">премиум</p>
                      <p className="text-gray-500 text-xs mt-1">3 дня назад</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Популярные продукты</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 border-b border-gray-800 pb-4">
                    <img 
                      src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-deeppurple?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663703841896" 
                      alt="iPhone 14 Pro" 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-white">iPhone 14 Pro</p>
                      <p className="text-gray-400 text-sm">99 990 ₽</p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded">В наличии</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 border-b border-gray-800 pb-4">
                    <img 
                      src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665" 
                      alt="MacBook Air" 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-white">MacBook Air M2</p>
                      <p className="text-gray-400 text-sm">129 990 ₽</p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-orange-900/30 text-orange-400 text-xs px-2 py-1 rounded">Под заказ</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <img 
                      src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361" 
                      alt="AirPods Pro" 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-white">AirPods Pro 2</p>
                      <p className="text-gray-400 text-sm">24 990 ₽</p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded">В наличии</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 