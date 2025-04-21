import { supabaseAdmin } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const storageService = {
  /**
   * Загружает файл в хранилище Supabase
   * @param file Файл для загрузки
   * @param bucket Имя бакета (папки) в хранилище
   * @param folder Подпапка внутри бакета (опционально)
   * @returns URL загруженного файла
   */
  async uploadFile(file: File, bucket: string = 'products', folder: string = ''): Promise<string> {
    try {
      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      // Формируем путь к файлу
      const filePath = folder 
        ? `${folder}/${fileName}`
        : fileName;
      
      console.log('Загрузка файла:', file.name, 'в путь:', filePath);
      
      // Загружаем файл в хранилище используя админский клиент
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Разрешаем перезапись существующих файлов
        });
      
      if (error) {
        console.error('Ошибка при загрузке файла:', error);
        throw error;
      }
      
      console.log('Файл успешно загружен:', data.path);
      
      // Получаем публичный URL файла
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      console.log('Публичный URL файла:', publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw error;
    }
  },
  
  /**
   * Удаляет файл из хранилища Supabase
   * @param fileUrl URL файла для удаления
   * @param bucket Имя бакета (папки) в хранилище
   */
  async deleteFile(fileUrl: string, bucket: string = 'products'): Promise<void> {
    try {
      // Проверяем, что URL не пустой
      if (!fileUrl) {
        console.warn('Попытка удалить пустой URL файла');
        return;
      }
      
      // Извлекаем путь к файлу из URL
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      
      // Находим индекс бакета в пути
      const bucketIndex = pathParts.indexOf(bucket);
      if (bucketIndex === -1) {
        console.warn(`Бакет ${bucket} не найден в URL ${fileUrl}`);
        return;
      }
      
      // Получаем путь к файлу относительно бакета
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      
      console.log('Удаление файла по пути:', filePath);
      
      // Удаляем файл из хранилища используя админский клиент
      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([filePath]);
      
      if (error) {
        console.error('Ошибка при удалении файла:', error);
        throw error;
      }
      
      console.log('Файл успешно удален');
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
      throw error;
    }
  },
  
  /**
   * Заменяет файл в хранилище Supabase
   * @param oldFileUrl URL старого файла
   * @param newFile Новый файл для загрузки
   * @param bucket Имя бакета (папки) в хранилище
   * @param folder Подпапка внутри бакета (опционально)
   * @returns URL загруженного файла
   */
  async replaceFile(oldFileUrl: string, newFile: File, bucket: string = 'products', folder: string = ''): Promise<string> {
    try {
      // Сначала загружаем новый файл
      const newFileUrl = await this.uploadFile(newFile, bucket, folder);
      
      // Затем удаляем старый файл, если он существует
      if (oldFileUrl) {
        await this.deleteFile(oldFileUrl, bucket);
      }
      
      return newFileUrl;
    } catch (error) {
      console.error('Ошибка при замене файла:', error);
      throw error;
    }
  }
}; 