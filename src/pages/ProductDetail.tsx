import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/ui/Footer';
import { ShoppingCart, ChevronRight, Check, Loader2, ArrowLeft } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { toast } from '../hooks/use-toast';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const { addToCart } = useCart();
  const [selectedMemory, setSelectedMemory] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [mainImage, setMainImage] = useState<string>('');
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  // Добавьте больше логов для отладки
  useEffect(() => {
    console.log("Текущее состояние ProductDetail:");
    console.log("- slug:", slug);
    console.log("- product:", product);
    console.log("- isLoading:", isLoading);
    console.log("- error:", error);
    console.log("- pageLoading:", pageLoading);
  }, [slug, product, isLoading, error, pageLoading]);
  
  // Отключите имитацию загрузки - она может вызывать проблемы
  useEffect(() => {
    if (!isLoading) {
      setPageLoading(false);
      setIsLoaded(true);
    }
  }, [isLoading]);
  
  // Эффект для установки выбранной памяти и цены при загрузке продукта
  useEffect(() => {
    if (product) {
      console.log("Загружен продукт:", product);
      
      // Безопасная обработка вариантов памяти
      if (product.memory_options && Array.isArray(product.memory_options) && product.memory_options.length > 0) {
        try {
          // Проверяем, что варианты памяти имеют правильный формат
          const firstOption = product.memory_options[0];
          // Устанавливаем память и цену из первого варианта
          console.log('Установка начального варианта памяти:', firstOption);
          setSelectedMemory(firstOption.memory || '');
          if (firstOption.price) {
            console.log('Установка начальной цены:', firstOption.price);
            setSelectedPrice(firstOption.price);
          } else {
            console.log('Вариант памяти без цены, используем базовую:', product.price);
            setSelectedPrice(product.price);
          }
        } catch (e) {
          console.error("Ошибка при обработке вариантов памяти:", e);
          setSelectedPrice(product.price);
        }
      } else {
        console.log('Нет вариантов памяти, используем базовую цену:', product.price);
        setSelectedPrice(product.price);
      }
    }
  }, [product]);
  
  useEffect(() => {
    if (product?.image_url) {
      setMainImage(product.image_url);
    }
  }, [product]);
  
  useEffect(() => {
    console.log('Slug из URL:', slug);
    console.log('Загруженный продукт:', product);
    console.log('Ошибка загрузки:', error);
  }, [slug, product, error]);
  
  // Добавьте дополнительные логи для отладки memory_options
  useEffect(() => {
    if (product) {
      console.log("Детальная информация о memory_options:");
      console.log("- Тип:", typeof product.memory_options);
      console.log("- Значение:", product.memory_options);
      if (product.memory_options) {
        console.log("- Длина массива:", Array.isArray(product.memory_options) ? product.memory_options.length : "не массив");
      }
    }
  }, [product]);
  
  // Улучшенная функция для обработки выбора памяти
  const handleMemorySelect = (memory: string) => {
    console.log('Выбран объем памяти:', memory);
    setSelectedMemory(memory);
    
    // Находим соответствующую цену
    if (product?.memory_options && Array.isArray(product.memory_options)) {
      const option = product.memory_options.find(opt => opt.memory === memory);
      if (option) {
        console.log('Найден вариант с ценой:', option.price);
        setSelectedPrice(option.price);
      } else {
        console.log('Вариант не найден, используем базовую цену:', product.price);
        setSelectedPrice(product.price);
      }
    }
  };
  
  // Функция для расчета цены со скидкой
  const calculateDiscountPrice = (price: number): number | null => {
    // Если есть фиксированная цена со скидкой, используем её
    if (product?.discount_price && product.discount_price > 0) {
      return product.discount_price;
    }
    
    // Иначе, если есть процент скидки, рассчитываем
    if (product?.discount_percent && product.discount_percent > 0) {
      const discountAmount = price * (product.discount_percent / 100);
      return Math.round(price - discountAmount);
    }
    
    return null;
  };
  
  // Получаем цену со скидкой для выбранной памяти
  const discountPrice = calculateDiscountPrice(selectedPrice);

  const handleAddToCart = () => {
    if (!product) return;
    
    const productToAdd = {
      ...product,
      memory: selectedMemory,
      price: selectedPrice,
      discount_price: discountPrice
    };
    
    addToCart(productToAdd);
    
      toast({
        title: "Товар добавлен в корзину",
      description: `${product.name} (${selectedMemory}) добавлен в корзину`,
    });
  };
  
  // Обработчик для смены главного изображения
  const handleImageChange = (imageUrl: string) => {
    setMainImage(imageUrl);
  };
  
  // Обработчик для возврата назад
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Добавляем экран загрузки
  if (pageLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-matrix-green mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-2">Загрузка товара...</h2>
            <p className="text-gray-400">Пожалуйста, подождите</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center">
            <h2 className="text-2xl text-white mb-4">Ошибка при загрузке товара</h2>
            <p className="text-gray-400 mb-6">{(error as Error).message}</p>
            <Link to="/catalog" className="inline-block bg-matrix-green text-black px-6 py-3 rounded-md hover:bg-matrix-green/90 transition-colors">
              Вернуться в каталог
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center">
            <h2 className="text-2xl text-white mb-4">Товар не найден</h2>
            <p className="text-gray-400 mb-6">Запрашиваемый товар не существует или был удален</p>
            <Link to="/catalog" className="inline-block bg-matrix-green text-black px-6 py-3 rounded-md hover:bg-matrix-green/90 transition-colors">
              Вернуться в каталог
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Получаем дополнительные изображения, исключая главное
  const additionalImages = product.additional_images?.filter(img => img !== product.image_url) || [];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
        {/* Кнопка назад */}
        <button 
          onClick={handleGoBack}
          className="inline-flex items-center px-4 py-2 bg-matrix-green/10 border border-matrix-green/30 rounded-md text-matrix-green hover:bg-matrix-green/20 transition-colors mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Вернуться назад
        </button>
        
        {/* Хлебные крошки */}
        <div className="flex flex-wrap items-center text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-matrix-green transition-colors">Главная</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/catalog" className="hover:text-matrix-green transition-colors">Каталог</Link>
          {product.category_name && (
            <>
              <ChevronRight size={16} className="mx-2" />
              <Link to={`/catalog?category=${product.category_name}`} className="hover:text-matrix-green transition-colors">{product.category_name}</Link>
            </>
          )}
          <ChevronRight size={16} className="mx-2" />
          <span className="text-white">{product.name}</span>
        </div>
        
        {/* Заголовок продукта для мобильных устройств */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
          <div className="flex items-center">
            <span className="text-matrix-green mr-2">{product.category_name}</span>
            {product.year && product.color && (
              <span className="text-gray-400">• {product.year} • {product.color}</span>
            )}
          </div>
          </div>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Галерея изображений */}
          <div className="space-y-4">
            <div className="aspect-square bg-black/30 rounded-lg overflow-hidden">
              <img 
                src={mainImage || product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain p-4"
              />
            </div>
            
            {/* Дополнительные изображения */}
            <div className="grid grid-cols-5 gap-2">
              <div 
                className={`aspect-square bg-black/30 rounded-lg overflow-hidden cursor-pointer border-2 ${mainImage === product.image_url ? 'border-matrix-green' : 'border-transparent'}`}
                onClick={() => handleImageChange(product.image_url)}
              >
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-2"
                />
              </div>
              
              {additionalImages.map((image, index) => (
                <div 
                    key={index}
                  className={`aspect-square bg-black/30 rounded-lg overflow-hidden cursor-pointer border-2 ${mainImage === image ? 'border-matrix-green' : 'border-transparent'}`}
                  onClick={() => handleImageChange(image)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - изображение ${index + 2}`} 
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                ))}
              </div>
            </div>
            
          {/* Информация о продукте */}
            <div>
            {/* Заголовок продукта для десктопа */}
            <div className="hidden md:block">
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <span className="text-matrix-green mr-2">{product.category_name}</span>
                {product.year && product.color && (
                  <span className="text-gray-400">• {product.year} • {product.color}</span>
                )}
              </div>
            </div>
            
            {/* Блок с ценой */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-white mb-2">
                {discountPrice ? (
                  <>
                    {discountPrice.toLocaleString('ru-RU')} ₽
                    <span className="text-lg text-gray-400 line-through ml-2">
                      {selectedPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </>
                ) : (
                  <>{selectedPrice.toLocaleString('ru-RU')} ₽</>
                )}
              </div>
              
              {/* Отображение процента скидки, если он есть */}
              {product?.discount_percent > 0 && (
                <div className="inline-block bg-matrix-green/20 text-matrix-green px-2 py-1 rounded text-sm mb-2">
                  Скидка {product.discount_percent}%
                </div>
              )}
              
              <div className="flex items-center">
                {product?.in_stock ? (
                  <span className="text-green-500 flex items-center">
                    <Check size={16} className="mr-1" /> В наличии
                        </span>
                ) : (
                  <span className="text-orange-400">Под заказ</span>
                      )}
              </div>
              </div>
              
            {/* Выбор объема памяти */}
            {product?.memory_options && Array.isArray(product.memory_options) && product.memory_options.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Объем памяти:</h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.memory_options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMemorySelect(option.memory)}
                      className={`px-4 py-2 border ${
                        selectedMemory === option.memory 
                          ? 'border-matrix-green text-matrix-green' 
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      } rounded-md transition-colors`}
                    >
                      {option.memory}{!option.memory.toLowerCase().includes('gb') ? 'GB' : ''}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
              
            {/* Кнопка добавления в корзину */}
                <button 
                  onClick={handleAddToCart}
              className="w-full bg-matrix-green text-black py-3 rounded-md flex items-center justify-center font-medium hover:bg-matrix-green/90 transition-colors mb-6"
                >
              <ShoppingCart size={20} className="mr-2" />
                  Добавить в корзину
                </button>
            
            {/* Технические характеристики */}
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">Технические характеристики:</h3>
              
              <div className="space-y-2">
                {product.specifications && Object.entries(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-400">{key}</span>
                      <span className="text-white">{value}</span>
              </div>
                  ))
                ) : (
                  <p className="text-gray-400">Технические характеристики не указаны</p>
                )}
              </div>
              </div>
            </div>
          </div>
          
        {/* Описание продукта */}
        <div className="bg-black/30 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Описание</h2>
          <div className="text-gray-300 space-y-4" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
