import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { toast } from '../../hooks/use-toast';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUploaded,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
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
    
    try {
      setIsUploading(true);
      
      // Создаем локальный URL для предпросмотра
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
      
      // Загружаем файл в Supabase Storage
      let fileUrl;
      if (currentImageUrl) {
        fileUrl = await storageService.replaceFile(currentImageUrl, file);
      } else {
        fileUrl = await storageService.uploadFile(file);
      }
      
      // Передаем URL загруженного файла родительскому компоненту
      onImageUploaded(fileUrl);
      
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
    }
  };
  
  const handleRemoveImage = async () => {
    if (!previewUrl) return;
    
    try {
      setIsUploading(true);
      
      // Если есть текущий URL, удаляем файл из хранилища
      if (currentImageUrl) {
        await storageService.deleteFile(currentImageUrl);
      }
      
      // Сбрасываем URL и уведомляем родительский компонент
      setPreviewUrl(null);
      onImageUploaded('');
      
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
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md border border-gray-700"
          />
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
              <Loader2 className="w-8 h-8 text-matrix-green animate-spin" />
            </div>
          )}
          
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Удалить изображение"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="w-full h-48 border-2 border-dashed border-gray-700 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-matrix-green hover:text-matrix-green transition-colors"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-matrix-green animate-spin" />
          ) : (
            <>
              <Upload size={32} className="mb-2" />
              <span>Загрузить изображение</span>
              <span className="text-xs mt-1 text-gray-500">JPG, PNG, GIF (макс. 5 МБ)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}; 