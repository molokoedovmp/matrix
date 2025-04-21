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
  Search,
  Upload,
  Image
} from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { supabase } from '../../lib/supabase';

// Интерфейс для вариантов памяти
interface MemoryOption {
  memory: string;
  price: number;
}

const AdminProducts = () => {
  const { data: products, isLoading, error, refetch } = useProducts();
  const { data: categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Состояние для формы продукта
  const [productForm, setProductForm] = useState({
    id: 0,
    name: '',
    slug: '',
    description: '',
    price: 0,
    image_url: '',
    category_id: categories?.[0]?.id || 1,
    year: new Date().getFullYear(),
    color: '',
    condition: 'новый',
    in_stock: true,
    is_featured: false,
    discount_percent: 0,
    additional_images: [] as string[],
    specifications: {} as Record<string, string>
  });
  
  // Состояние для вариантов памяти
  const [memoryOptions, setMemoryOptions] = useState<MemoryOption[]>([]);
  
  // Состояние для загрузки изображений
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Состояние для спецификаций
  const [specs, setSpecs] = useState<{key: string, value: string}[]>([]);
  
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
  
  // Функция для открытия диалога создания нового продукта
  const handleCreate = () => {
    setProductForm({
      id: 0,
      name: '',
      slug: '',
      description: '',
      price: 0,
      image_url: '',
      category_id: categories?.[0]?.id || 1,
      year: new Date().getFullYear(),
      color: '',
      condition: 'новый',
      in_stock: true,
      is_featured: false,
      discount_percent: 0,
      additional_images: [],
      specifications: {}
    });
    setMemoryOptions([]);
    setSpecs([]);
    setMainImageFile(null);
    setAdditionalImageFiles([]);
    setIsEditing(false);
    setIsDialogOpen(true);
  };
  
  // Функция для открытия диалога редактирования продукта
  const handleEdit = (product: Product) => {
    console.log('=== Редактирование продукта ===');
    console.log('ID продукта:', product.id);
    console.log('Вся информация о продукте:', product);
    console.log('Тип memory_options:', typeof product.memory_options);
    console.log('Значение memory_options:', product.memory_options);
    
    // Нормализация вариантов памяти
    let memOptions = [];
    
    try {
      // Проверяем разные форматы, в которых могут прийти данные
      if (Array.isArray(product.memory_options) && product.memory_options.length > 0) {
        // Если это массив - используем его напрямую
        memOptions = [...product.memory_options];
        console.log('Использую массив вариантов памяти:', memOptions);
      } else if (typeof product.memory_options === 'string') {
        // Если это строка в формате JSON - парсим
        try {
          memOptions = JSON.parse(product.memory_options);
          console.log('Распарсил строку JSON:', memOptions);
        } catch (e) {
          console.error('Ошибка парсинга JSON строки:', e);
        }
      } else if (typeof product.memory_options === 'object' && product.memory_options !== null) {
        // Если это объект с ключами - конвертируем в массив
        const values = Object.values(product.memory_options);
        if (values.length > 0) {
          memOptions = values;
          console.log('Преобразовал объект в массив:', memOptions);
        }
      }
    } catch (e) {
      console.error('Ошибка при нормализации вариантов памяти:', e);
    }
    
    // Проверяем, что элементы массива имеют правильную структуру
    if (memOptions.length > 0) {
      memOptions = memOptions.filter(option => 
        option && 
        typeof option === 'object' && 
        ('memory' in option || 'price' in option)
      );
      
      // Преобразуем каждый элемент для уверенности
      memOptions = memOptions.map(option => ({
        memory: String(option.memory || ''),
        price: Number(option.price || 0)
      }));
      
      console.log('Нормализованные варианты памяти:', memOptions);
    }
    
    // Устанавливаем форму продукта
    setProductForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category_id: product.category_id,
      year: product.year || new Date().getFullYear(),
      color: product.color || '',
      condition: product.condition || 'новый',
      in_stock: product.in_stock !== undefined ? product.in_stock : true,
      is_featured: product.is_featured || false,
      discount_percent: product.discount_percent || 0,
      additional_images: product.additional_images || [],
      specifications: product.specifications || {}
    });
    
    // Обновление вариантов памяти с явным логом
    console.log('Устанавливаю варианты памяти в состояние:', memOptions);
    setMemoryOptions(memOptions);
    
    // Через 100мс проверяем, установились ли значения
    setTimeout(() => {
      console.log('Проверка установленных вариантов памяти:', memoryOptions);
    }, 100);
    
    // Преобразуем спецификации в массив для редактирования
    const specsArray = Object.entries(product.specifications || {}).map(([key, value]) => ({
      key,
      value: String(value)
    }));
    setSpecs(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);
    
    setMainImageFile(null);
    setAdditionalImageFiles([]);
    setIsEditing(true);
    setIsDialogOpen(true);
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
  
  // Обработка изменений в форме
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setProductForm(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (type === 'number') {
      setProductForm(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Функции для управления вариантами памяти
  const addMemoryOption = () => {
    setMemoryOptions([...memoryOptions, { memory: '', price: 0 }]);
  };
  
  const updateMemoryOption = (index: number, field: keyof MemoryOption, value: string | number) => {
    const updatedOptions = [...memoryOptions];
    if (field === 'price') {
      updatedOptions[index][field] = Number(value);
    } else {
      updatedOptions[index][field] = value as string;
    }
    setMemoryOptions(updatedOptions);
  };
  
  const removeMemoryOption = (index: number) => {
    setMemoryOptions(memoryOptions.filter((_, i) => i !== index));
  };
  
  // Функции для управления спецификациями
  const addSpecification = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };
  
  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index][field] = value;
    setSpecs(updatedSpecs);
  };
  
  const removeSpecification = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };
  
  // Функции для загрузки изображений
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImageFile(e.target.files[0]);
    }
  };
  
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAdditionalImageFiles(prev => [...prev, ...filesArray]);
    }
  };
  
  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingAdditionalImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
  };
  
  // Функция для загрузки изображений в хранилище
  const uploadImages = async () => {
    try {
      setIsUploading(true);
      let mainImageUrl = productForm.image_url;
      let additionalImageUrls = [...productForm.additional_images];
      
      // Загрузка основного изображения, если оно выбрано
      if (mainImageFile) {
        const fileExt = mainImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-main.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, mainImageFile);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        mainImageUrl = urlData.publicUrl;
      }
      
      // Загрузка дополнительных изображений, если они выбраны
      if (additionalImageFiles.length > 0) {
        for (let i = 0; i < additionalImageFiles.length; i++) {
          const file = additionalImageFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-additional-${i}.${fileExt}`;
          const filePath = `products/${fileName}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);
          
          if (uploadError) throw uploadError;
          
          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);
          
          additionalImageUrls.push(urlData.publicUrl);
          
          // Обновляем прогресс загрузки
          setUploadProgress(Math.round(((i + 1) / additionalImageFiles.length) * 100));
        }
      }
      
      return { mainImageUrl, additionalImageUrls };
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Функция для сохранения продукта
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Проверяем обязательные поля
      if (!productForm.name || !productForm.slug) {
        toast({
          title: "Ошибка",
          description: "Заполните все обязательные поля",
          variant: "destructive"
        });
        return;
      }
      
      // Загружаем изображения, если они выбраны
      let imageUrls = { 
        mainImageUrl: productForm.image_url, 
        additionalImageUrls: productForm.additional_images 
      };
      
      if (mainImageFile || additionalImageFiles.length > 0) {
        imageUrls = await uploadImages();
      }
      
      // Преобразуем спецификации из массива в объект
      const specificationsObject = specs.reduce((acc, { key, value }) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      // Подготавливаем данные для сохранения
      const productData = {
        ...productForm,
        image_url: imageUrls.mainImageUrl,
        additional_images: imageUrls.additionalImageUrls,
        memory_options: memoryOptions,
        specifications: specificationsObject
      };
      
      // Создаем или обновляем продукт
      if (isEditing) {
        await productService.updateProduct(productForm.id, productData);
        toast({
          title: "Успешно",
          description: "Продукт обновлен"
        });
      } else {
        await productService.createProduct(productData);
        toast({
          title: "Успешно",
          description: "Продукт создан"
        });
      }
      
      // Обновляем список продуктов и закрываем диалог
      refetch();
      setIsDialogOpen(false);
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
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Управление товарами</h1>
          
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black/30 border border-gray-700 rounded-md text-white focus:outline-none focus:border-matrix-green"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-matrix-green text-black rounded-md flex items-center hover:bg-matrix-green/90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Добавить товар
            </button>
          </div>
        </div>
        
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
      
      {/* Диалог создания/редактирования продукта */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black border border-matrix-green/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-matrix-green text-xl">
              {isEditing ? 'Редактирование товара' : 'Добавление нового товара'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Название *</label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">URL-slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={productForm.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Базовая цена *</label>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Скидка (%)</label>
                <input
                  type="number"
                  name="discount_percent"
                  value={productForm.discount_percent}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Категория *</label>
                <select
                  name="category_id"
                  value={productForm.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                >
                  {categories?.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Год выпуска</label>
                <input
                  type="number"
                  name="year"
                  value={productForm.year}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Цвет</label>
                <input
                  type="text"
                  name="color"
                  value={productForm.color}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Состояние</label>
                <select
                  name="condition"
                  value={productForm.condition}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                >
                  <option value="новый">Новый</option>
                  <option value="б/у">Б/У</option>
                  <option value="восстановленный">Восстановленный</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in_stock"
                    name="in_stock"
                    checked={productForm.in_stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, in_stock: e.target.checked }))}
                    className="w-4 h-4 bg-black/30 border border-gray-700 rounded focus:ring-matrix-green text-matrix-green"
                  />
                  <label htmlFor="in_stock" className="ml-2 text-sm text-gray-400">В наличии</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 bg-black/30 border border-gray-700 rounded focus:ring-matrix-green text-matrix-green"
                  />
                  <label htmlFor="is_featured" className="ml-2 text-sm text-gray-400">Отображать на главной</label>
                </div>
              </div>
            </div>
            
            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Описание</label>
              <textarea
                name="description"
                value={productForm.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
              ></textarea>
            </div>
            
            {/* Изображения */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Основное изображение</label>
              
              <div className="flex items-center space-x-4">
                {productForm.image_url && (
                  <div className="relative w-24 h-24 border border-gray-700 rounded-md overflow-hidden">
                    <img 
                      src={productForm.image_url} 
                      alt="Основное изображение" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {mainImageFile && (
                  <div className="relative w-24 h-24 border border-gray-700 rounded-md overflow-hidden">
                    <img 
                      src={URL.createObjectURL(mainImageFile)} 
                      alt="Новое основное изображение" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setMainImageFile(null)}
                      className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                
                <label className="flex items-center justify-center w-24 h-24 border border-dashed border-gray-700 rounded-md cursor-pointer hover:border-matrix-green transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload size={20} className="mx-auto text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Загрузить</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Дополнительные изображения</label>
              
              <div className="flex flex-wrap gap-4">
                {productForm.additional_images.map((imageUrl, index) => (
                  <div key={index} className="relative w-24 h-24 border border-gray-700 rounded-md overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`Дополнительное изображение ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                {additionalImageFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative w-24 h-24 border border-gray-700 rounded-md overflow-hidden">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Новое дополнительное изображение ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                <label className="flex items-center justify-center w-24 h-24 border border-dashed border-gray-700 rounded-md cursor-pointer hover:border-matrix-green transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload size={20} className="mx-auto text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Загрузить</span>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Варианты памяти */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Варианты памяти и цены {memoryOptions.length > 0 ? `(${memoryOptions.length})` : ''}
              </label>
              
              {memoryOptions.length > 0 ? (
                memoryOptions.map((option, index) => (
                  <div key={index} className="flex items-center mb-2 gap-2">
                    <input
                      type="text"
                      placeholder="Объем (например, 64GB)"
                      value={option.memory || ''}
                      onChange={(e) => updateMemoryOption(index, 'memory', e.target.value)}
                      className="flex-1 bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                    />
                    
                    <input
                      type="number"
                      placeholder="Цена"
                      value={option.price || 0}
                      onChange={(e) => updateMemoryOption(index, 'price', e.target.value)}
                      className="flex-1 bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeMemoryOption(index)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic mb-2">Нет настроенных вариантов памяти</div>
              )}
              
              <button
                type="button"
                onClick={addMemoryOption}
                className="mt-2 px-4 py-2 bg-matrix-green/20 text-matrix-green rounded-md hover:bg-matrix-green/30 flex items-center"
              >
                <Plus size={16} className="mr-2" /> Добавить вариант памяти
              </button>
            </div>
            
            {/* Спецификации */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Технические характеристики</label>
              
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center mb-2 gap-2">
                  <input
                    type="text"
                    placeholder="Характеристика (например, Процессор)"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                    className="flex-1 bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                  />
                  
                  <input
                    type="text"
                    placeholder="Значение (например, Apple A15 Bionic)"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    className="flex-1 bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                  />
                  
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addSpecification}
                className="mt-2 px-4 py-2 bg-matrix-green/20 text-matrix-green rounded-md hover:bg-matrix-green/30 flex items-center"
              >
                <Plus size={16} className="mr-2" /> Добавить характеристику
              </button>
            </div>
            
            {/* Кнопки действий */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded-md hover:bg-gray-900 transition-colors"
              >
                Отмена
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-4 py-2 bg-matrix-green text-black rounded-md hover:bg-matrix-green/90 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    {isUploading ? `Загрузка (${uploadProgress}%)` : 'Сохранение...'}
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Сохранить
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;