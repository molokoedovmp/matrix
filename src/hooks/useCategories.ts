import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { productService } from '../services/productService';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        // Прямой запрос к базе данных
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        if (error) {
          console.error('Ошибка при получении категорий:', error);
          return [];
        }
        
        console.log('Категории из прямого запроса:', data);
        return data || [];
      } catch (error) {
        console.error('Исключение при получении категорий:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 минут
  });
}; 