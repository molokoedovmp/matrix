import { supabase } from '../lib/supabase';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  icon?: string;
  color?: string;
  is_featured?: boolean;
  sort_order?: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  category_name?: string;
  year?: number;
  color?: string;
  condition?: string;
  in_stock: boolean;
  tags?: string[];
  rating?: number;
  rating_count?: number;
  is_featured?: boolean;
  discount_price?: number;
  additional_images?: string[];
  specifications?: Record<string, any>;
  categories?: { id: number; name: string }[];
}

// Обновите интерфейс для создания/обновления категории
interface CategoryInput {
  name: string;
  description?: string;
  image_url?: string;
  is_featured?: boolean;
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    console.log('Выполняется запрос к Supabase');
    
    // Сначала получаем продукты без связей
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        description,
        price,
        image_url,
        category_id,
        year,
        color,
        condition,
        in_stock,
        rating,
        rating_count,
        is_featured,
        discount_price,
        additional_images,
        specifications
      `);
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }
    
    // Затем получаем категории отдельно
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name');
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      throw categoriesError;
    }
    
    // Создаем словарь категорий для быстрого поиска
    const categoriesMap = new Map();
    categoriesData.forEach(category => {
      categoriesMap.set(category.id, category);
    });
    
    // Объединяем данные вручную
    const products = productsData.map(product => {
      const category = categoriesMap.get(product.category_id);
      return {
        ...product,
        category_name: category?.name || '',
        tags: []
      };
    });
    
    return products;
  },
  
  async getProductById(slug: string): Promise<Product | null> {
    console.log('Запрос продукта по slug:', slug);
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        description,
        price,
        image_url,
        category_id,
        year,
        color,
        condition,
        in_stock,
        rating,
        rating_count,
        is_featured,
        discount_price,
        additional_images,
        specifications
      `)
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error fetching product with slug ${slug}:`, error);
      // Не выбрасываем ошибку, чтобы не прерывать выполнение
      return null;
    }
    
    if (!data) {
      console.log(`Продукт с slug ${slug} не найден`);
      return null;
    }
    
    // Получаем категорию отдельно
    if (data.category_id) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('name')
        .eq('id', data.category_id)
        .single();
      
      return {
        ...data,
        category_name: categoryData?.name || '',
        tags: []
      };
    }
    
    return {
      ...data,
      category_name: '',
      tags: []
    };
  },
  
  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('slug', categorySlug)
      .single();
      
    if (categoryError) {
      console.error(`Error fetching category with slug ${categorySlug}:`, categoryError);
      throw categoryError;
    }
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        description,
        price,
        image_url,
        category_id,
        year,
        color,
        condition,
        in_stock,
        rating,
        rating_count,
        is_featured,
        discount_price,
        additional_images,
        specifications
      `)
      .eq('category_id', category.id);
    
    if (error) {
      console.error(`Error fetching products for category ${categorySlug}:`, error);
      throw error;
    }
    
    // Добавляем имя категории к каждому продукту
    return (data || []).map(item => ({
      ...item,
      category_name: category.name,
      tags: []
    }));
  },
  
  async getCategories(): Promise<Category[]> {
    console.log('Запрос категорий из базы данных');
    try {
      // Упрощаем запрос, чтобы исключить возможные проблемы
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) {
        console.error('Ошибка при получении категорий:', error);
        return [];
      }
      
      console.log('Полученные категории из БД:', data);
      return data || [];
    } catch (e) {
      console.error('Исключение при получении категорий:', e);
      return [];
    }
  },
  
  async createCategory(category: { 
    name: string; 
    description?: string;
    image_url?: string;
    is_featured?: boolean;
  }): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateCategory(id: number, category: { 
    name: string; 
    description?: string;
    image_url?: string;
    is_featured?: boolean;
  }): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async deleteCategory(id: number): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  },
  
  async getTags(): Promise<any[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async createTag(tag: { name: string; slug: string }): Promise<any> {
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateTag(id: number, tag: { name: string; slug: string }): Promise<any> {
    const { data, error } = await supabase
      .from('tags')
      .update(tag)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating tag with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async deleteTag(id: number): Promise<void> {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting tag with id ${id}:`, error);
      throw error;
    }
  },
  
  async testConnection(): Promise<any> {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    console.log('Тестовый запрос:', { data, error });
    
    if (error) {
      console.error('Error in test connection:', error);
      throw error;
    }
    
    return data;
  },
  
  async createProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price,
        image_url: product.image_url,
        category_id: product.category_id,
        year: product.year,
        color: product.color,
        condition: product.condition,
        in_stock: product.in_stock !== undefined ? product.in_stock : true,
        is_featured: product.is_featured || false,
        discount_price: product.discount_price,
        additional_images: product.additional_images || [],
        specifications: product.specifications || {}
      }])
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        category_id: product.category_id,
        year: product.year,
        color: product.color,
        condition: product.condition,
        in_stock: product.in_stock,
        is_featured: product.is_featured,
        discount_price: product.discount_price,
        additional_images: product.additional_images || [],
        specifications: product.specifications || {}
      })
      .eq('id', product.id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    return data;
  },
  
  async deleteProduct(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },
  
  async getFeaturedProducts(): Promise<Product[]> {
    // Получаем продукты с флагом is_featured=true
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        description,
        price,
        image_url,
        category_id,
        year,
        color,
        condition,
        in_stock,
        rating,
        rating_count,
        is_featured,
        discount_price,
        additional_images,
        specifications
      `)
      .eq('is_featured', true)
      .limit(6); // Ограничиваем количество продуктов
    
    if (productsError) {
      console.error('Error fetching featured products:', productsError);
      throw productsError;
    }
    
    // Получаем категории для этих продуктов
    const categoryIds = [...new Set(productsData.map(product => product.category_id))];
    
    if (categoryIds.length > 0) {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds);
      
      if (categoriesError) {
        console.error('Error fetching categories for featured products:', categoriesError);
        throw categoriesError;
      }
      
      // Создаем словарь категорий для быстрого поиска
      const categoriesMap = new Map();
      categoriesData.forEach(category => {
        categoriesMap.set(category.id, category);
      });
      
      // Объединяем данные вручную
      return productsData.map(product => {
        const category = categoriesMap.get(product.category_id);
        return {
          ...product,
          category_name: category?.name || '',
          tags: []
        };
      });
    }
    
    // Если нет категорий, просто возвращаем продукты без имен категорий
    return productsData.map(product => ({
      ...product,
      category_name: '',
      tags: []
    }));
  }
}; 