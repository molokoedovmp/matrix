import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/ui/Footer';
import { useProducts, useCategories } from '../hooks/useProducts';
import { productService, Product } from '../services/productService';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Admin = () => {
  const { data: products, isLoading, error, refetch } = useProducts();
  const { data: categories } = useCategories();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      
      if (isCreating) {
        // Создание нового продукта
        await productService.createProduct(editingProduct as Product);
        toast({
          title: "Продукт создан",
          description: `Продукт "${editingProduct.name}" успешно создан.`
        });
      } else {
        // Обновление существующего продукта
        await productService.updateProduct(editingProduct as Product);
        toast({
          title: "Продукт обновлен",
          description: `Продукт "${editingProduct.name}" успешно обновлен.`
        });
      }
      
      // Обновляем список продуктов
      refetch();
      
      // Сбрасываем состояние редактирования
      setIsEditing(false);
      setIsCreating(false);
      setEditingProduct(null);
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
      
      if (type === 'number') {
        return { ...prev, [name]: parseFloat(value) };
      } else if (type === 'checkbox') {
        return { ...prev, [name]: (e.target as HTMLInputElement).checked };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  // Генерация slug из названия
  useEffect(() => {
    if (isCreating && editingProduct?.name) {
      const slug = editingProduct.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setEditingProduct(prev => {
        if (!prev) return prev;
        return { ...prev, slug };
      });
    }
  }, [isCreating, editingProduct?.name]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-matrix-green animate-spin" />
            <p className="mt-4 text-matrix-green">Загрузка данных...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-2">Ошибка загрузки данных</h2>
            <p className="text-gray-400 mb-4">{(error as Error).message}</p>
            <button 
              onClick={() => refetch()} 
              className="bg-matrix-green text-black px-4 py-2 rounded-md hover:bg-matrix-green/90 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 bg-matrix-dark">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Панель администратора</h1>
            
            <button
              onClick={handleCreate}
              className="bg-matrix-green text-black px-4 py-2 rounded-md flex items-center hover:bg-matrix-green/90 transition-colors"
              disabled={isEditing}
            >
              <Plus size={18} className="mr-2" />
              Добавить продукт
            </button>
          </div>
          
          {isEditing && editingProduct && (
            <div className="bg-black/50 border border-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl text-white mb-4">
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
                  <label className="block text-gray-400 mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    value={editingProduct.slug || ''}
                    onChange={handleChange}
                    className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
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
                  <label className="block text-gray-400 mb-2">URL изображения</label>
                  <input
                    type="text"
                    name="image_url"
                    value={editingProduct.image_url || ''}
                    onChange={handleChange}
                    className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2">Год выпуска</label>
                  <input
                    type="number"
                    name="year"
                    value={editingProduct.year || ''}
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
                  <input
                    type="text"
                    name="condition"
                    value={editingProduct.condition || ''}
                    onChange={handleChange}
                    className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in_stock"
                    name="in_stock"
                    checked={editingProduct.in_stock || false}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev!, in_stock: e.target.checked }))}
                    className="mr-2 h-4 w-4"
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
                  {products?.map(product => (
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
                  
                  {products?.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        Продукты не найдены
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin; 