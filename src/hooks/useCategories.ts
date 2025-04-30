import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

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