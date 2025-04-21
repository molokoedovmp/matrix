import React, { useState } from 'react';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { toast } from '../../hooks/use-toast';

// Массив с примерами изображений для временного использования
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587840171670-8b850147754e?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593642634367-d91a135587b5?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?q=80&w=1000&auto=format&fit=crop'
];

interface MultiImageUploadProps {
  currentImageUrls?: string[];
  onImagesUpdated: (urls: string[]) => void;
  className?: string;
  maxImages?: number;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  currentImageUrls = [],
  onImagesUpdated,
  className = '',
  maxImages = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(currentImageUrls);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive"
      });
      return;
    }
    
    // Проверка размера файла (макс. 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5 МБ",
        variant: "destructive"
      });
      return;
    }
    
    // Проверка количества изображений
    if (imageUrls.length >= maxImages) {
      toast({
        title: "Ошибка",
        description: `Максимальное количество изображений: ${maxImages}`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Загружаем файл в Supabase Storage
      const fileUrl = await storageService.uploadFile(file);
      
      // Обновляем список URL изображений
      const updatedUrls = [...imageUrls, fileUrl];
      setImageUrls(updatedUrls);
      onImagesUpdated(updatedUrls);
      
      toast({
        title: "Успешно",
        description: "Изображение загружено"
      });
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      
      toast({
        title: "Ошибка",
        description: `Не удалось загрузить изображение: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Сбрасываем значение input, чтобы можно было загрузить тот же файл повторно
      e.target.value = '';
    }
  };
  
  const handleRemoveImage = async (index: number) => {
    try {
      setIsUploading(true);
      
      // Удаляем файл из Supabase Storage
      await storageService.deleteFile(imageUrls[index]);
      
      // Обновляем список URL изображений
      const updatedUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(updatedUrls);
      onImagesUpdated(updatedUrls);
      
      toast({
        title: "Успешно",
        description: "Изображение удалено"
      });
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      
      toast({
        title: "Ошибка",
        description: `Не удалось удалить изображение: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Additional ${index + 1}`}
              className="w-full h-24 object-cover rounded-md border border-gray-700"
            />
            
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              disabled={isUploading}
              className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Удалить изображение"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {imageUrls.length < maxImages && (
          <label className="w-full h-24 border-2 border-dashed border-gray-700 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-matrix-green hover:text-matrix-green transition-colors cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
            
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-matrix-green animate-spin" />
            ) : (
              <>
                <Plus size={24} className="mb-1" />
                <span className="text-xs">Добавить</span>
              </>
            )}
          </label>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        {imageUrls.length} из {maxImages} изображений
      </p>
    </div>
  );
}; 