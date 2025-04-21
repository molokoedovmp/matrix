import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { productService, Product } from '../../services/productService';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Check,
  AlertCircle,
  Loader2,
  Search
} from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import { ImageUpload } from '../../components/ui/image-upload';
import { MultiImageUpload } from '../../components/ui/multi-image-upload';

const AdminProducts = () => {
  const { data: products, isLoading, error, refetch } = useProducts();
  const { data: categories } = useCategories();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    if (products) {
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [products, searchTerm]);

  // Функция для редактирования продукта
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Функция для создания нового продукта
  const handleCreate = () => {
    setEditingProduct({
      name: '',
      slug: '',
      description: '',
      price: 0,
      image_url: '',
      category_id: categories?.[0]?.id || 1,
      year: new Date().getFullYear(),
      color: '',
      condition: 'новый',
      in_stock: true
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  // Функция для сохранения продукта (создание или обновление)
  const handleSave = async () => {
    if (!editingProduct) return;
    
    try {
      setIsSubmitting(true);
      
      // Проверяем обязательные поля
      if (!editingProduct.name || !editingProduct.slug || !editingProduct.price || !editingProduct.image_url) {
        toast({
          title: "Ошибка",
          description: "Заполните все обязательные поля",
          variant: "destructive"
        });
        return;
      }
      
      // Подготавливаем данные для сохранения
      const productData = {
        ...editingProduct,
        // Убедитесь, что additional_images - это массив
        additional_images: editingProduct.additional_images || []
      };
      
      // Создаем или обновляем продукт
      if (isCreating) {
        await productService.createProduct(productData);
        toast({
          title: "Успешно",
          description: "Продукт создан"
        });
      } else {
        await productService.updateProduct(productData);
        toast({
          title: "Успешно",
          description: "Продукт обновлен"
        });
      }
      
      // Обновляем список продуктов
      refetch();
      
      // Закрываем форму редактирования
      setIsEditing(false);
      setEditingProduct(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Ошибка при сохранении продукта:', error);
      toast({
        title: "Ошибка",
        description: `Не удалось сохранить продукт: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция для удаления продукта
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот продукт?')) return;
    
    try {
      await productService.deleteProduct(id);
      toast({
        title: "Продукт удален",
        description: "Продукт успешно удален из базы данных."
      });
      refetch();
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
      toast({
        title: "Ошибка",
        description: `Не удалось удалить продукт: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  // Функция для отмены редактирования
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingProduct(null);
  };

  // Функция для обновления полей редактируемого продукта
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setEditingProduct(prev => {
      if (!prev) return prev;
      
      if (type === 'checkbox') {
        return { ...prev, [name]: (e.target as HTMLInputElement).checked };
      } else if (name === 'price') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      } else if (name === 'category_id') {
        return { ...prev, [name]: parseInt(value) || 1 };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Управление продуктами</h1>
          <button
            onClick={handleCreate}
            className="bg-matrix-green text-black px-4 py-2 rounded-md flex items-center hover:bg-matrix-green/90 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Добавить продукт
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск продуктов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-matrix-green focus:border-transparent"
          />
        </div>
        
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-matrix-green animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>Ошибка при загрузке продуктов: {(error as Error).message}</p>
          </div>
        )}
        
        {isEditing && editingProduct && (
          <div className="bg-black/30 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isCreating ? 'Создание нового продукта' : 'Редактирование продукта'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Название</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name || ''}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={editingProduct.slug || ''}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Цена</label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price || 0}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Изображение</label>
                <ImageUpload
                  currentImageUrl={editingProduct.image_url}
                  onImageUploaded={(url) => {
                    setEditingProduct({
                      ...editingProduct,
                      image_url: url
                    });
                  }}
                  className="mb-2"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Категория</label>
                <select
                  name="category_id"
                  value={editingProduct.category_id || ''}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                >
                  {categories?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Год выпуска</label>
                <input
                  type="number"
                  name="year"
                  value={editingProduct.year || new Date().getFullYear()}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Цвет</label>
                <input
                  type="text"
                  name="color"
                  value={editingProduct.color || ''}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Состояние</label>
                <select
                  name="condition"
                  value={editingProduct.condition || 'новый'}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                >
                  <option value="новый">Новый</option>
                  <option value="б/у">Б/У</option>
                  <option value="восстановленный">Восстановленный</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="in_stock"
                  name="in_stock"
                  checked={editingProduct.in_stock}
                  onChange={handleChange}
                  className="w-4 h-4 bg-black/70 border border-gray-700 rounded mr-2"
                />
                <label htmlFor="in_stock" className="text-gray-400">В наличии</label>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-2">Описание</label>
                <textarea
                  name="description"
                  value={editingProduct.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Рейтинг (0-5)</label>
                <input
                  type="number"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={editingProduct.rating || ''}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Количество оценок</label>
                <input
                  type="number"
                  name="rating_count"
                  value={editingProduct.rating_count || 0}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Цена со скидкой</label>
                <input
                  type="number"
                  name="discount_price"
                  value={editingProduct.discount_price || ''}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={editingProduct.is_featured || false}
                  onChange={handleChange}
                  className="w-4 h-4 bg-black/70 border border-gray-700 rounded mr-2"
                />
                <label htmlFor="is_featured" className="text-gray-400">Отображать на главной</label>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Дополнительные изображения</label>
                <MultiImageUpload
                  currentImageUrls={editingProduct.additional_images || []}
                  onImagesUpdated={(urls) => {
                    setEditingProduct({
                      ...editingProduct,
                      additional_images: urls
                    });
                  }}
                  maxImages={5}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={handleCancel}
                className="bg-gray-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <X size={18} className="mr-2" />
                Отмена
              </button>
              
              <button
                onClick={handleSave}
                className="bg-matrix-green text-black px-4 py-2 rounded-md flex items-center hover:bg-matrix-green/90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="mr-2 animate-spin" />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                Сохранить
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-black/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/50">
                  <th className="px-4 py-3 text-left text-gray-400">ID</th>
                  <th className="px-4 py-3 text-left text-gray-400">Изображение</th>
                  <th className="px-4 py-3 text-left text-gray-400">Название</th>
                  <th className="px-4 py-3 text-left text-gray-400">Категория</th>
                  <th className="px-4 py-3 text-left text-gray-400">Цена</th>
                  <th className="px-4 py-3 text-left text-gray-400">В наличии</th>
                  <th className="px-4 py-3 text-left text-gray-400">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-t border-gray-800 hover:bg-black/20">
                    <td className="px-4 py-3 text-gray-300">{product.id}</td>
                    <td className="px-4 py-3">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-white">{product.name}</td>
                    <td className="px-4 py-3 text-gray-300">{product.category_name}</td>
                    <td className="px-4 py-3 text-gray-300">{product.price.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-4 py-3">
                      {product.in_stock ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900/50 text-green-400">
                          <Check size={12} className="mr-1" /> Да
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-900/50 text-orange-400">
                          <X size={12} className="mr-1" /> Нет
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Редактировать"
                        >
                          <Pencil size={18} />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      {searchTerm ? 'Продукты не найдены по вашему запросу' : 'Продукты не найдены'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts; 