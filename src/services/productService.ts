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
  parent_id?: number | null;
  order: number;
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
  memory_options?: Array<{memory: string, price: number}>;
  discount_percent?: number;
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
        discount_percent,
        memory_options,
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
    
    try {
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
          discount_percent,
          memory_options,
          additional_images,
          specifications
        `)
        .eq('slug', slug)
        .single();
      
      console.log('Ответ от базы данных:', { data, error });
      
      if (error) {
        console.error(`Error fetching product with slug ${slug}:`, error);
        return null;
      }
      
      if (!data) {
        console.log(`Продукт с slug ${slug} не найден`);
        return null;
      }
      
      // Обработка и нормализация memory_options
      if (data.memory_options) {
        console.log('Исходные memory_options:', data.memory_options);
        
        // Обработка различных форматов memory_options
        try {
          let normalizedOptions;
          
          if (typeof data.memory_options === 'string') {
            // Если пришла строка - пробуем распарсить JSON
            normalizedOptions = JSON.parse(data.memory_options);
          } else {
            // Иначе используем как есть
            normalizedOptions = data.memory_options;
          }
          
          // Убедимся, что это массив
          if (!Array.isArray(normalizedOptions)) {
            if (typeof normalizedOptions === 'object') {
              // Если это объект - преобразуем в массив
              normalizedOptions = Object.values(normalizedOptions);
            } else {
              // Если ничего не подходит - создаем пустой массив
              normalizedOptions = [];
            }
          }
          
          // Присваиваем нормализованные опции
          data.memory_options = normalizedOptions;
          console.log('Нормализованные memory_options:', data.memory_options);
        } catch (e) {
          console.error('Ошибка при обработке memory_options:', e);
          data.memory_options = [];
        }
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
    } catch (error) {
      console.error(`Ошибка при получении продукта по slug ${slug}:`, error);
      return null;
    }
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
  
  async createProduct(productData: any): Promise<Product> {
    // Преобразуем данные для сохранения
    const { memory_options, discount_percent, ...rest } = productData;
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...rest,
        memory_options: memory_options || [],
        discount_percent: discount_percent || 0
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateProduct(id: number, productData: any): Promise<Product> {
    // Преобразуем данные для обновления
    const { memory_options, discount_percent, ...rest } = productData;
    
    const { data, error } = await supabase
      .from('products')
      .update({
        ...rest,
        memory_options: memory_options || [],
        discount_percent: discount_percent || 0
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
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
        discount_percent,
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
  },
  
  // Добавьте метод для обновления порядка категорий
  async updateCategoryOrder(categoryId: number, newOrder: number) {
    const { data, error } = await supabase
      .from('categories')
      .update({ order: newOrder })
      .eq('id', categoryId);
      
    if (error) {
      console.error('Ошибка при обновлении порядка категории:', error);
      throw error;
    }
    
    return data;
  },
  
  // Добавьте метод для обновления порядка нескольких категорий
  async updateCategoriesOrder(updates: { id: number, order: number }[]) {
    const promises = updates.map(update => 
      supabase
        .from('categories')
        .update({ order: update.order })
        .eq('id', update.id)
    );
    
    const results = await Promise.all(promises);
    const errors = results.filter(result => result.error);
    
    if (errors.length > 0) {
      console.error('Ошибки при обновлении порядка категорий:', errors);
      throw errors[0].error;
    }
    
    return true;
  }
}; 