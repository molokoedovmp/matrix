import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCategories } from '../../hooks/useCategories';
import { productService } from '../../services/productService';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from '../../hooks/use-toast';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  GripVertical,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
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
  order: number;
}

const AdminCategories = () => {
  const { data: categories, isLoading, error, refetch } = useCategories();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // Получаем только категории верхнего уровня (без родителя)
  const topLevelCategories = categories?.filter(cat => !cat.parent_id) || [];

  // Добавьте функцию для организации категорий в иерархическую структуру
  const organizeCategories = (categories: Category[] = []): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];
    
    // Сначала создаем объекты для всех категорий
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, subcategories: [] });
    });
    
    // Затем организуем их в дерево
    categories.forEach(category => {
      const categoryWithSubs = categoryMap.get(category.id);
      if (!categoryWithSubs) return;
      
      if (category.parent_id === null || category.parent_id === undefined) {
        rootCategories.push(categoryWithSubs);
      } else {
        const parentCategory = categoryMap.get(category.parent_id);
        if (parentCategory) {
          if (!parentCategory.subcategories) {
            parentCategory.subcategories = [];
          }
          parentCategory.subcategories.push(categoryWithSubs);
        }
      }
    });
    
    // Сортируем корневые категории и подкатегории по порядку
    rootCategories.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Сортируем подкатегории
    rootCategories.forEach(category => {
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    });
    
    return rootCategories;
  };

  // Обновите useEffect для организации категорий
  useEffect(() => {
    if (categories) {
      const hierarchicalCategories = organizeCategories(categories);
      setFilteredCategories(hierarchicalCategories);
    }
  }, [categories]);

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
      slug: '',
      order: 0
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

  // Добавьте функцию для преобразования иерархической структуры в плоский список
  const flattenCategories = (categories: Category[], result: Category[] = [], level = 0): Category[] => {
    categories.forEach((category, index) => {
      result.push({ ...category, order: result.length });
      
      if (category.subcategories && category.subcategories.length > 0) {
        flattenCategories(category.subcategories, result, level + 1);
      }
    });
    
    return result;
  };

  // Обновите функцию moveCategory
  const moveCategory = async (path: number[], direction: 'up' | 'down') => {
    // Для простоты сначала обрабатываем только категории верхнего уровня
    const index = path[0];
    
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === filteredCategories.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const items = Array.from(filteredCategories);
    const [movedItem] = items.splice(index, 1);
    items.splice(newIndex, 0, movedItem);
    
    // Обновляем порядок в UI
    setFilteredCategories(items);
    
    // Преобразуем иерархическую структуру в плоский список для обновления
    const flattenedCategories = flattenCategories(items);
    
    // Обновляем порядок в базе данных
    try {
      const updates = flattenedCategories.map((item, idx) => ({
        id: item.id,
        order: idx
      }));
      
      await productService.updateCategoriesOrder(updates);
      toast({
        title: "Порядок категорий обновлен",
        description: "Изменения успешно сохранены",
        variant: "default"
      });
    } catch (error) {
      console.error('Ошибка при обновлении порядка:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить порядок категорий",
        variant: "destructive"
      });
      // Восстанавливаем предыдущий порядок
      refetch();
    }
  };

  // Исправленная функция handleDragEnd
  const handleDragEnd = async (result: any) => {
    // Добавим отладочную информацию
    console.log("DragEnd result:", result);
    
    if (!result.destination) return;
    
    try {
      // Проверяем, является ли это перемещением подкатегории
      if (result.source.droppableId.startsWith('subcategories-')) {
        // Получаем ID родительской категории
        const parentId = parseInt(result.source.droppableId.split('-')[1]);
        
        // Находим родительскую категорию
        const newCategories = [...filteredCategories];
        const parentIndex = newCategories.findIndex(cat => cat.id === parentId);
        
        if (parentIndex !== -1 && newCategories[parentIndex].subcategories) {
          // Перемещаем элемент внутри подкатегорий
          const subcategories = [...newCategories[parentIndex].subcategories!];
          const [movedItem] = subcategories.splice(result.source.index, 1);
          subcategories.splice(result.destination.index, 0, movedItem);
          
          // Присваиваем порядковые номера
          const updatedSubcategories = subcategories.map((subcat, idx) => ({
            ...subcat,
            order: idx * 10
          }));
          
          // Обновляем состояние
          newCategories[parentIndex].subcategories = updatedSubcategories;
          setFilteredCategories([...newCategories]);
          
          // Обновляем порядок в базе данных
          const updates = updatedSubcategories.map(item => ({
            id: item.id,
            order: item.order
          }));
          
          console.log("Обновление порядка подкатегорий:", updates);
          await productService.updateCategoriesOrder(updates);
          
          toast({
            title: "Порядок подкатегорий обновлен",
            description: "Изменения успешно сохранены",
            variant: "default"
          });
        }
      } else {
        // Перемещение основных категорий
        const newCategories = [...filteredCategories];
        const [reorderedItem] = newCategories.splice(result.source.index, 1);
        newCategories.splice(result.destination.index, 0, reorderedItem);
        
        // Обновляем порядок категорий
        const updatedCategories = newCategories.map((cat, idx) => ({
          ...cat,
          order: idx * 10
        }));
        
        // Обновляем UI
        setFilteredCategories(updatedCategories);
        
        // Обновляем порядок в базе данных
        const updates = updatedCategories.map(item => ({
          id: item.id,
          order: item.order
        }));
        
        console.log("Обновление порядка категорий:", updates);
        await productService.updateCategoriesOrder(updates);
        
        toast({
          title: "Порядок категорий обновлен",
          description: "Изменения успешно сохранены",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Ошибка при обновлении порядка категорий:', error);
      
      toast({
        title: "Ошибка",
        description: "Не удалось обновить порядок категорий",
        variant: "destructive"
      });
      
      // Перезагружаем данные в случае ошибки
      refetch();
    }
  };

  // Функция для раскрытия/закрытия подкатегорий
  const toggleCategoryExpand = (id: number) => {
    if (expandedCategories.includes(id)) {
      setExpandedCategories(expandedCategories.filter(i => i !== id));
    } else {
      setExpandedCategories([...expandedCategories, id]);
    }
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
            <div className="animate-spin w-8 h-8 border-2 border-matrix-green border-t-transparent rounded-full mx-auto mb-4"></div>
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
                  <div className="animate-spin w-4 h-4 mr-2"></div>
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                Сохранить
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-black/30 border border-gray-700 rounded-md p-4 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Список категорий</h2>
            <div className="flex space-x-2">
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-8 h-8 border-2 border-matrix-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Загрузка категорий...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400">Категории не найдены</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {filteredCategories.map((category, index) => (
                      <React.Fragment key={category.id}>
                        <Draggable 
                          draggableId={category.id.toString()} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-black/50 border border-gray-700 rounded-md p-3 flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div 
                                  {...provided.dragHandleProps}
                                  className="mr-3 cursor-grab text-gray-500 hover:text-gray-300"
                                >
                                  <GripVertical size={20} />
                                </div>
                                
                                {category.subcategories && category.subcategories.length > 0 && (
                                  <button
                                    onClick={() => toggleCategoryExpand(category.id)}
                                    className="mr-2 text-gray-400 hover:text-matrix-green"
                                  >
                                    {expandedCategories.includes(category.id) ? (
                                      <ChevronDown size={18} />
                                    ) : (
                                      <ChevronRight size={18} />
                                    )}
                                  </button>
                                )}
                                
                                <div>
                                  <h3 className="text-white font-medium">{category.name}</h3>
                                  <p className="text-gray-400 text-sm">
                                    {category.parent_id ? 'Подкатегория' : 'Основная категория'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEdit(category)}
                                  className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-md"
                                  title="Редактировать"
                                >
                                  <Pencil size={18} />
                                </button>
                                
                                <button
                                  onClick={() => handleDelete(category.id)}
                                  className="p-2 text-red-400 hover:bg-red-900/30 rounded-md"
                                  title="Удалить"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                        
                        {/* Отображаем подкатегории, если категория раскрыта */}
                        {expandedCategories.includes(category.id) && category.subcategories && category.subcategories.length > 0 && (
                          <Droppable droppableId={`subcategories-${category.id}`}>
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="ml-8 mt-2 space-y-2 border-l-2 border-gray-700 pl-4"
                              >
                                {category.subcategories.map((subcategory, subIndex) => (
                                  <Draggable
                                    key={subcategory.id}
                                    draggableId={subcategory.id.toString()}
                                    index={subIndex}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="bg-black/30 border border-gray-700 rounded-md p-3 flex items-center justify-between"
                                      >
                                        <div className="flex items-center">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="mr-3 cursor-grab text-gray-500 hover:text-gray-300"
                                          >
                                            <GripVertical size={20} />
                                          </div>
                                          <div>
                                            <h3 className="text-white font-medium">{subcategory.name}</h3>
                                            <p className="text-gray-400 text-sm">Подкатегория</p>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() => handleEdit(subcategory)}
                                            className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-md"
                                            title="Редактировать"
                                          >
                                            <Pencil size={18} />
                                          </button>
                                          
                                          <button
                                            onClick={() => handleDelete(subcategory.id)}
                                            className="p-2 text-red-400 hover:bg-red-900/30 rounded-md"
                                            title="Удалить"
                                          >
                                            <Trash2 size={18} />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        )}
                      </React.Fragment>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories; 