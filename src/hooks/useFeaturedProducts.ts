import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => productService.getFeaturedProducts(),
  });
}; 