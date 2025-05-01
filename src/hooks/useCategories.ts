import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

// Обновите интерфейс Category, добавив parent_id и order
interface Category {
  id: number;
  name: string;
  slug?: string;
  parent_id: number | null; // Добавляем это свойство
  is_featured?: boolean;
  image_url?: string;
  order: number;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await productService.getCategories();
      return categories;
    },
    staleTime: 1000 * 60 * 5, // 5 минут
    refetchOnWindowFocus: false
  });
}; 