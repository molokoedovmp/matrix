import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { supabase } from '../lib/supabase';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const products = await productService.getProducts();
        console.log('Продукты из Supabase:', products);
        return products;
      } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
        throw error;
      }
    }
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductById(slug),
    enabled: !!slug
  });
};

export const useProductsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: () => productService.getProductsByCategory(categorySlug),
    enabled: !!categorySlug
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        // Добавляем прямой запрос к базе данных для отладки
        const { data: directData, error: directError } = await supabase
          .from('categories')
          .select('*');
        
        if (directError) {
          console.error('Прямой запрос к категориям вернул ошибку:', directError);
        } else {
          console.log('Прямой запрос к категориям вернул данные:', directData);
        }
        
        // Используем сервис как обычно
        const categories = await productService.getCategories();
        console.log('Категории через сервис:', categories);
        
        if (!categories || categories.length === 0) {
          console.warn('Сервис вернул пустой массив категорий');
          // Возвращаем результаты прямого запроса как запасной вариант
          return directData || [];
        }
        
        return categories;
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 минут
  });
}; 