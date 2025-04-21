import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { useQuery } from '@tanstack/react-query';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Loader2
} from 'lucide-react';
import { toast } from '../../hooks/use-toast';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

const AdminTags = () => {
  const { data: tags, isLoading, error, refetch } = useQuery({
    queryKey: ['tags'],
    queryFn: () => productService.getTags()
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingTag, setEditingTag] = useState<Partial<Tag> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Функция для редактирования тега
  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Функция для создания нового тега
  const handleCreate = () => {
    setEditingTag({
      name: '',
      slug: ''
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  // Функция для сохранения тега (создание или обновление)
  const handleSave = async () => {
    if (!editingTag) return;
    
    try {
      setIsSubmitting(true);
      
      if (isCreating) {
        // Создание нового тега
        await productService.createTag(editingTag as Omit<Tag, 'id'>);
        toast({
          title: "Тег создан",
          description: `Тег "${editingTag.name}" успешно создан.`
        });
      } else {
        // Обновление существующего тега
        await productService.updateTag(editingTag.id!, editingTag as Tag);
        toast({
          title: "Тег обновлен",
          description: `Тег "${editingTag.name}" успешно обновлен.`
        });
      }
      
      // Обновляем список тегов
      refetch();
      
      // Сбрасываем состояние редактирования
      setIsEditing(false);
      setIsCreating(false);
      setEditingTag(null);
    } catch (error) {
      console.error('Ошибка при сохранении тега:', error);
      toast({
        title: "Ошибка",
        description: `Не удалось сохранить тег: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция для удаления тега
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот тег?')) return;
    
    try {
      await productService.deleteTag(id);
      toast({
        title: "Тег удален",
        description: "Тег успешно удален из базы данных."
      });
      refetch();
    } catch (error) {
      console.error('Ошибка при удалении тега:', error);
      toast({
        title: "Ошибка",
        description: `Не удалось удалить тег: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  // Функция для отмены редактирования
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingTag(null);
  };

  // Функция для обновления полей редактируемого тега
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingTag(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Управление тегами</h1>
          <button
            onClick={handleCreate}
            className="bg-matrix-green text-black px-4 py-2 rounded-md flex items-center hover:bg-matrix-green/90 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Добавить тег
          </button>
        </div>
        
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-matrix-green animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded">
            Ошибка при загрузке тегов: {(error as Error).message}
          </div>
        )}
        
        {isEditing && editingTag && (
          <div className="bg-black/30 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isCreating ? 'Создание нового тега' : 'Редактирование тега'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Название</label>
                <input
                  type="text"
                  name="name"
                  value={editingTag.name || ''}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={editingTag.slug || ''}
                  onChange={handleChange}
                  className="w-full bg-black/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-matrix-green focus:outline-none"
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
                  <th className="px-4 py-3 text-left text-gray-400">Название</th>
                  <th className="px-4 py-3 text-left text-gray-400">Slug</th>
                  <th className="px-4 py-3 text-left text-gray-400">Действия</th>
                </tr>
              </thead>
              <tbody>
                {tags?.map(tag => (
                  <tr key={tag.id} className="border-t border-gray-800 hover:bg-black/20">
                    <td className="px-4 py-3 text-gray-300">{tag.id}</td>
                    <td className="px-4 py-3 text-white">{tag.name}</td>
                    <td className="px-4 py-3 text-gray-300">{tag.slug}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(tag)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Редактировать"
                        >
                          <Pencil size={18} />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {tags?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      Теги не найдены
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

export default AdminTags; 