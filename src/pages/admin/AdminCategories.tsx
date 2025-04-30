import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCategories } from '../../hooks/useProducts';
import { productService } from '../../services/productService';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import { ImageUpload } from '../../components/ui/image-upload';

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  is_featured?: boolean;
  parent_id?: number | null;
  slug?: string;
  subcategories?: Category[];
}

const AdminCategories = () => {
  const { data: categories, isLoading, error, refetch } = useCategories();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Получаем только категории верхнего уровня (без родителя)
  const topLevelCategories = categories?.filter(cat => !cat.parent_id) || [];

  // Функция для редактирования категории
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Функция для создания новой категории
  const handleCreate = () => {
    setEditingCategory({
      name: '',
      description: '',
      image_url: '',
      is_featured: false,
      parent_id: null,
      slug: ''
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  // Функция для сохранения категории (создание или обновление)
  const handleSave = async () => {
    if (!editingCategory) return;
    
    // Проверка обязательных полей
    if (!editingCategory.name) {
      toast({
        title: "Ошибка",
        description: "Название категории обязательно для заполнения",
        variant: "destructive"
      });
      return;
    }
    
    // Генерация slug, если он не указан
    if (!editingCategory.slug) {
      const slug = editingCategory.name
        .toLowerCase()
        .replace(/[^a-zа-я0-9]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setEditingCategory(prev => {
        if (!prev) return prev;
        return { ...prev, slug };
      });
    }
    
    try {
      setIsSubmitting(true);
      
      if (isCreating) {
        // Создание новой категории
        await productService.createCategory(editingCategory as Omit<Category, 'id'>);
        toast({
          title: "Категория создана",
          description: `Категория "${editingCategory.name}" успешно создана.`
        });
      } else {
        // Обновление существующей категории
        await productService.updateCategory(editingCategory.id!, editingCategory as Category);
        toast({
          title: "Категория обновлена",
          description: `Категория "${editingCategory.name}" успешно обновлена.`
        });
      }
      
      // Обновляем список категорий
      refetch();
      
      // Сбрасываем состояние редактирования
      setIsEditing(false);
      setIsCreating(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Ошибка при сохранении категории:', error);
      
      // Более подробное сообщение об ошибке
      let errorMessage = 'Неизвестная ошибка';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast({
        title: "Ошибка",
        description: `Не удалось сохранить категорию: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция для удаления категории
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию? Это также удалит все связанные продукты и подкатегории.')) return;
    
    try {
      await productService.deleteCategory(id);
      toast({
        title: "Категория удалена",
        description: "Категория успешно удалена из базы данных."
      });
      refetch();
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
      toast({
        title: "Ошибка",
        description: `Не удалось удалить категорию: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  // Функция для отмены редактирования
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingCategory(null);
  };

  // Функция для обновления полей редактируемой категории
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Для чекбоксов обрабатываем отдельно
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditingCategory(prev => {
        if (!prev) return prev;
        return { ...prev, [name]: checked };
      });
    } else if (name === 'parent_id') {
      // Для parent_id преобразуем строку в число или null
      const parentId = value === '' ? null : parseInt(value, 10);
      setEditingCategory(prev => {
        if (!prev) return prev;
        return { ...prev, [name]: parentId };
      });
    } else {
      setEditingCategory(prev => {
        if (!prev) return prev;
        return { ...prev, [name]: value };
      });
    }
  };

  // Функция для обновления URL изображения
  const handleImageUploaded = (url: string) => {
    setEditingCategory(prev => {
      if (!prev) return prev;
      return { ...prev, image_url: url };
    });
  };

  // Функция для получения отступа в зависимости от уровня вложенности
  const getIndent = (category: Category) => {
    if (!category.parent_id) return '';
    return 'ml-6';
  };

  // Рекурсивная функция для отображения категорий и их подкатегорий
  const renderCategoryRows = (categoryList: Category[], parentId: number | null = null) => {
    const filteredCategories = categoryList.filter(cat => cat.parent_id === parentId);
    
    return filteredCategories.map(category => (
      <React.Fragment key={category.id}>
        <tr className="border-t border-gray-800 hover:bg-black/20">
          <td className="px-4 py-3 text-gray-300">{category.id}</td>
          <td className={`px-4 py-3 text-white flex items-center ${getIndent(category)}`}>
            {category.parent_id && <ChevronRight size={16} className="text-gray-500 mr-2" />}
            {category.name}
          </td>
          <td className="px-4 py-3">
            {category.image_url ? (
              <img 
                src={category.image_url} 
                alt={category.name} 
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </td>
          <td className="px-4 py-3 text-gray-300">
            {category.is_featured ? (
              <span className="text-matrix-green">Да</span>
            ) : (
              <span className="text-gray-500">Нет</span>
            )}
          </td>
          <td className="px-4 py-3 text-gray-300">
            {category.parent_id ? (
              <span className="text-gray-300">
                {categories?.find(c => c.id === category.parent_id)?.name || '-'}
              </span>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </td>
          <td className="px-4 py-3">
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(category as Category)}
                className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                title="Редактировать"
              >
                <Pencil size={18} />
              </button>
              
              <button
                onClick={() => handleDelete(category.id)}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="Удалить"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </tr>
        {/* Рекурсивно отображаем подкатегории */}
        {renderCategoryRows(categoryList, category.id)}
      </React.Fragment>
    ));
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Управление категориями</h1>
          
          {!isEditing && (
            <button
              onClick={handleCreate}
              className="bg-matrix-green text-black px-4 py-2 rounded-md flex items-center hover:bg-matrix-green/90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Добавить категорию
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 size={32} className="animate-spin text-matrix-green" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-md">
            <p>Ошибка при загрузке категорий: {(error as Error).message}</p>
          </div>
        )}
        
        {isEditing && editingCategory && (
          <div className="bg-black/30 p-6 rounded-lg border border-gray-800 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {isCreating ? 'Создание новой категории' : 'Редактирование категории'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Название</label>
                <input
                  type="text"
                  name="name"
                  value={editingCategory.name || ''}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  name="slug"
                  value={editingCategory.slug || ''}
                  onChange={handleChange}
                  placeholder="например: iphone-14"
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Оставьте пустым для автоматической генерации из названия
                </p>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Родительская категория</label>
                <select
                  name="parent_id"
                  value={editingCategory.parent_id === null ? '' : editingCategory.parent_id}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                >
                  <option value="">Нет (категория верхнего уровня)</option>
                  {categories?.filter(cat => cat.id !== editingCategory.id).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-2">Описание</label>
                <textarea
                  name="description"
                  value={editingCategory.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-2">Изображение категории</label>
                <ImageUpload
                  currentImageUrl={editingCategory.image_url}
                  onImageUploaded={handleImageUploaded}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={editingCategory.is_featured || false}
                  onChange={(e) => {
                    setEditingCategory(prev => {
                      if (!prev) return prev;
                      return { ...prev, is_featured: e.target.checked };
                    });
                  }}
                  className="w-4 h-4 bg-black/70 border border-gray-700 rounded mr-2"
                />
                <label htmlFor="is_featured" className="text-gray-400">Отображать на главной</label>
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
                  <th className="px-4 py-3 text-left text-gray-400">Название</th>
                  <th className="px-4 py-3 text-left text-gray-400">Изображение</th>
                  <th className="px-4 py-3 text-left text-gray-400">На главной</th>
                  <th className="px-4 py-3 text-left text-gray-400">Родитель</th>
                  <th className="px-4 py-3 text-left text-gray-400">Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories && categories.length > 0 ? (
                  renderCategoryRows(categories)
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      Категории не найдены
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

export default AdminCategories; 