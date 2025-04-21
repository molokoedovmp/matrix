import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/ui/Footer';
import MatrixRain from '../components/ui/MatrixRain';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal,
  Check,
  Smartphone,
  Laptop,
  TabletSmartphone,
  Watch,
  Loader2
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Toggle } from '@/components/ui/toggle';
import { useProducts, useCategories } from '../hooks/useProducts';
import { productService } from '../services/productService';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  category_name?: string;
  year?: number;
  color?: string;
  condition?: string;
  in_stock: boolean;
  tags?: string[];
  discount_price?: number;
  
  // Добавьте свойства для совместимости со старым кодом
  category?: string;
  image?: string;
  inStock?: boolean;
}

// Расширенные данные продуктов
// const allProducts: Product[] = [
//   {
//     id: 'iphone-14-pro',
//     name: 'iPhone 14 Pro',
//     category: 'iPhone',
//     price: 129990,
//     image: 'https://www.apple.com/v/iphone-14-pro/c/images/overview/hero/hero_endframe__dtzvajyextyu_large.jpg',
//     tags: ['премиум', 'новинка'],
//     condition: 'новый',
//     year: 2022,
//     color: 'черный',
//     inStock: true
//   },
//   {
//     id: 'iphone-14',
//     name: 'iPhone 14',
//     category: 'iPhone',
//     price: 99990,
//     image: 'https://www.apple.com/v/iphone-14/i/images/overview/hero/hero_iphone_14__de41900yuggi_large.jpg',
//     tags: ['хит'],
//     condition: 'новый',
//     year: 2022,
//     color: 'синий',
//     inStock: true
//   },
//   {
//     id: 'iphone-13',
//     name: 'iPhone 13',
//     category: 'iPhone',
//     price: 79990,
//     image: 'https://www.apple.com/v/iphone-13/h/images/key-features/hero/hero_green__rz0u5fdewmqq_large.jpg',
//     condition: 'новый',
//     year: 2021,
//     color: 'зеленый',
//     inStock: true
//   },
//   {
//     id: 'macbook-pro-14',
//     name: 'MacBook Pro 14"',
//     category: 'Mac',
//     price: 189990,
//     image: 'https://www.apple.com/v/mac/home/bp/images/overview/hero/macbook_pro_14_16__dmqm5594oyau_large.jpg',
//     tags: ['премиум', 'новинка'],
//     condition: 'новый',
//     year: 2023,
//     color: 'серый',
//     inStock: true
//   },
//   {
//     id: 'macbook-air-m2',
//     name: 'MacBook Air M2',
//     category: 'Mac',
//     price: 149990,
//     image: 'https://www.apple.com/v/macbook-air-m2/b/images/overview/hero/hero_mba__rh3ancbuky6q_large.jpg',
//     tags: ['хит'],
//     condition: 'новый',
//     year: 2022,
//     color: 'серебристый',
//     inStock: true
//   },
//   {
//     id: 'mac-mini',
//     name: 'Mac mini',
//     category: 'Mac',
//     price: 89990,
//     image: 'https://www.apple.com/v/mac-mini/o/images/overview/hero/hero_mac_mini__dues4fa5xhuy_large.jpg',
//     condition: 'новый',
//     year: 2023,
//     color: 'серый',
//     inStock: false
//   },
//   {
//     id: 'ipad-pro',
//     name: 'iPad Pro',
//     category: 'iPad',
//     price: 109990,
//     image: 'https://www.apple.com/v/ipad-pro/al/images/overview/hero/hero__fexbvbcv5fle_large.jpg',
//     tags: ['премиум'],
//     condition: 'новый',
//     year: 2022,
//     color: 'серебристый',
//     inStock: true
//   },
//   {
//     id: 'ipad-air',
//     name: 'iPad Air',
//     category: 'iPad',
//     price: 79990,
//     image: 'https://www.apple.com/v/ipad-air/r/images/overview/hero/hero__fkjvzyuqdnuu_large.jpg',
//     condition: 'новый',
//     year: 2022,
//     color: 'голубой',
//     inStock: true
//   },
//   {
//     id: 'ipad-mini',
//     name: 'iPad mini',
//     category: 'iPad',
//     price: 59990,
//     image: 'https://www.apple.com/v/ipad-mini/i/images/overview/hero/hero_ipad_mini__dn6g8b0hw8om_large.jpg',
//     condition: 'новый',
//     year: 2021,
//     color: 'фиолетовый',
//     inStock: true
//   },
//   {
//     id: 'apple-watch-series-8',
//     name: 'Apple Watch Series 8',
//     category: 'Watch',
//     price: 49990,
//     image: 'https://www.apple.com/v/apple-watch-series-8/c/images/overview/hero/hero_static__c9d1bk9frtua_large.jpg',
//     condition: 'новый',
//     year: 2022,
//     color: 'красный',
//     inStock: true
//   },
//   {
//     id: 'apple-watch-ultra',
//     name: 'Apple Watch Ultra',
//     category: 'Watch',
//     price: 79990,
//     image: 'https://www.apple.com/v/apple-watch-ultra/c/images/overview/hero/hero_static__fmaio9kz47mm_large.jpg',
//     tags: ['премиум', 'новинка'],
//     condition: 'новый',
//     year: 2022,
//     color: 'оранжевый',
//     inStock: true
//   },
//   {
//     id: 'apple-watch-se',
//     name: 'Apple Watch SE',
//     category: 'Watch',
//     price: 29990,
//     image: 'https://www.apple.com/v/apple-watch-se/j/images/overview/hero/hero_static__ffdxl9n8c8ye_large.jpg',
//     condition: 'новый',
//     year: 2022,
//     color: 'черный',
//     inStock: false
//   }
// ];

const categories = ['Все', 'iPhone', 'Mac', 'iPad', 'Watch'];

const categoryIcons = {
  'iPhone': <Smartphone size={20} />,
  'Mac': <Laptop size={20} />,
  'iPad': <TabletSmartphone size={20} />,
  'Watch': <Watch size={20} />
};

const Catalog = () => {
  const { data: supabaseProducts, isLoading: isLoadingProducts } = useProducts();
  const { data: supabaseCategories, isLoading: isLoadingCategories } = useCategories();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('Все');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [viewType, setViewType] = useState('grid');
  const [isLoaded, setIsLoaded] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Фильтры
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  // Получаем категории из БД
  const categories = ['Все', ...(supabaseCategories?.map(cat => cat.name) || [])];

  // Иконки для категорий (можно расширить по мере добавления новых категорий)
  const categoryIcons: Record<string, React.ReactNode> = {
    'iPhone': <Smartphone size={20} />,
    'Mac': <Laptop size={20} />,
    'iPad': <TabletSmartphone size={20} />,
    'Watch': <Watch size={20} />
  };

  useEffect(() => {
    // Проверяем параметры URL при загрузке страницы
    if (categoryParam) {
      console.log('Категория из URL:', categoryParam);
      // Находим категорию по slug
      const foundCategory = supabaseCategories?.find(cat => cat.slug === categoryParam);
      if (foundCategory) {
        setActiveCategory(foundCategory.name);
      }
    }
    
    const searchParam = queryParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search, supabaseCategories]);

  useEffect(() => {
    // Имитация загрузки страницы
    const timer = setTimeout(() => {
      setPageLoading(false);
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (supabaseProducts) {
      console.log('Данные из Supabase:', supabaseProducts);
      const mappedProducts = supabaseProducts.map(p => ({
        ...p,
        category: p.category_name || '',
        image: p.image_url,
        inStock: p.in_stock
      }));
      console.log('Преобразованные данные:', mappedProducts);
      setAllProducts(mappedProducts);
      
      // Устанавливаем отфильтрованные продукты сразу при получении данных
      let filtered = [...mappedProducts];
      
      // Применяем только активную категорию, если она установлена
      if (activeCategory !== 'Все') {
        filtered = filtered.filter(product => 
          product.category_name === activeCategory || product.category === activeCategory
        );
      }
      
      setFilteredProducts(filtered);
      
      // Извлекаем доступные годы и цвета из данных
      const years = Array.from(new Set(mappedProducts
        .map(p => p.year)
        .filter(year => year !== undefined && year !== null)
      )).sort((a, b) => (b || 0) - (a || 0));
      
      const colors = Array.from(new Set(mappedProducts
        .map(p => p.color)
        .filter(color => color !== undefined && color !== null && color !== '')
      ));
      
      console.log('Доступные годы:', years);
      console.log('Доступные цвета:', colors);
      
      // Находим максимальную и минимальную цену для диапазона цен
      const prices = mappedProducts.map(p => p.price).filter(price => price !== undefined && price !== null);
      const minPrice = Math.min(...prices, 0);
      const maxPrice = Math.max(...prices, 200000);
      
      // Устанавливаем диапазон цен с небольшим запасом
      setPriceRange([minPrice, maxPrice]);
      
    } else {
      console.log('Данные из Supabase не получены');
    }
  }, [supabaseProducts, activeCategory]);

  useEffect(() => {
    // Проверяем, что у нас есть продукты для фильтрации
    if (allProducts.length > 0) {
      applyFilters();
    }
  }, [searchTerm, priceRange, selectedYears, selectedColors, onlyInStock, sortBy]);

  const applyFilters = () => {
    console.log('Применение фильтров. Активная категория:', activeCategory);
    console.log('Все продукты перед фильтрацией:', allProducts);
    
    let filtered = [...allProducts];
    
    // Фильтр по категории
    if (activeCategory !== 'Все') {
      console.log('Фильтрация по категории:', activeCategory);
      filtered = filtered.filter(product => {
        const categoryMatch = product.category_name === activeCategory || product.category === activeCategory;
        console.log(`Продукт ${product.name}, категория: ${product.category_name || product.category}, совпадение: ${categoryMatch}`);
        return categoryMatch;
      });
    }
    
    // Фильтр по поисковому запросу
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Фильтр по цене
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Фильтр по году
    if (selectedYears.length > 0) {
      filtered = filtered.filter(product => 
        product.year && selectedYears.includes(product.year)
      );
    }
    
    // Фильтр по цвету
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        product.color && selectedColors.includes(product.color)
      );
    }
    
    // Фильтр по наличию
    if (onlyInStock) {
      filtered = filtered.filter(product => product.in_stock === true);
    }
    
    // Сортировка
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    console.log('Отфильтрованные продукты:', filtered);
    setFilteredProducts(filtered);
  };

  const clearAllFilters = () => {
    setActiveCategory('Все');
    setSearchTerm('');
    setPriceRange([0, 200000]);
    setSelectedYears([]);
    setSelectedColors([]);
    setOnlyInStock(false);
    setSortBy('default');
    
    // Сразу устанавливаем все продукты без ожидания срабатывания useEffect
    setFilteredProducts([...allProducts]);
  };

  const toggleYear = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year) 
        : [...prev, year]
    );
  };
  
  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };
  
  const getColorClass = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'черный': 'bg-gray-900',
      'серый': 'bg-gray-500',
      'серебристый': 'bg-gray-300',
      'белый': 'bg-white',
      'красный': 'bg-red-500',
      'синий': 'bg-blue-500',
      'голубой': 'bg-blue-300',
      'зеленый': 'bg-green-500',
      'фиолетовый': 'bg-purple-500',
      'оранжевый': 'bg-orange-500',
    };
    
    return colorMap[colorName.toLowerCase()] || 'bg-gray-400';
  };

  useEffect(() => {
    async function testDb() {
      try {
        const testData = await productService.testConnection();
        console.log('Тестовые данные:', testData);
      } catch (error) {
        console.error('Ошибка при тестировании:', error);
      }
    }
    
    testDb();
  }, []);

  // Добавляем эффект загрузки страницы
  if (pageLoading || isLoadingProducts || isLoadingCategories) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-matrix-green mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-2">Загрузка каталога...</h2>
            <p className="text-gray-400">Пожалуйста, подождите</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <MatrixRain opacity={0.04} />
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 bg-matrix-dark">
        <div className="container mx-auto px-4">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 text-white transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            Каталог <span className="text-matrix-green">продукции</span>
          </h1>
          
          <div className={`flex flex-col gap-5 mb-8 transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {/* Строка поиска и фильтров */}
            <div className="relative flex flex-wrap gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Поиск продукции..."
                  className="w-full pl-10 pr-10 py-2 bg-black/50 border border-gray-700 rounded-md focus:outline-none focus:border-matrix-green text-white"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${
                    showFilters 
                      ? 'border-matrix-green text-matrix-green bg-matrix-green/10' 
                      : 'border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">Фильтры</span>
                  {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewType === 'grid' 
                        ? 'bg-matrix-green/20 text-matrix-green' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Сетка"
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-2 h-2 bg-current rounded-sm"></div>
                      <div className="w-2 h-2 bg-current rounded-sm"></div>
                      <div className="w-2 h-2 bg-current rounded-sm"></div>
                      <div className="w-2 h-2 bg-current rounded-sm"></div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewType === 'list' 
                        ? 'bg-matrix-green/20 text-matrix-green' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Список"
                  >
                    <div className="flex flex-col space-y-0.5">
                      <div className="w-4 h-1 bg-current rounded-sm"></div>
                      <div className="w-4 h-1 bg-current rounded-sm"></div>
                      <div className="w-4 h-1 bg-current rounded-sm"></div>
                    </div>
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-black/50 border border-gray-700 rounded-md focus:outline-none focus:border-matrix-green text-gray-300"
                >
                  <option value="default">По умолчанию</option>
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                  <option value="name-asc">По названию</option>
                  <option value="name-desc">По названию (обратный порядок)</option>
                </select>
              </div>
            </div>
            
            {/* Раскрываемая панель фильтров */}
            {showFilters && (
              <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg p-4 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-lg font-medium flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-matrix-green" />
                    Настройка фильтров
                  </h2>
                  
                  <button 
                    onClick={clearAllFilters}
                    className="text-sm text-gray-400 hover:text-matrix-green transition-colors"
                  >
                    Сбросить все
                  </button>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Фильтр по категориям */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Категории</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                            activeCategory === category
                              ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green/40'
                              : 'bg-black/30 text-gray-300 border border-transparent hover:border-gray-700'
                          }`}
                          onClick={() => setActiveCategory(category)}
                        >
                          {category !== 'Все' && (
                            <span className="mr-2">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                          )}
                          {category}
                          {activeCategory === category && (
                            <Check size={16} className="ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Фильтр по наличию и расширенные фильтры */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Наличие</h3>
                    <button
                      className={`flex items-center w-full px-3 py-2 rounded-md transition-colors mb-4 ${
                        onlyInStock
                          ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green/40'
                          : 'bg-black/30 text-gray-300 border border-transparent hover:border-gray-700'
                      }`}
                      onClick={() => setOnlyInStock(!onlyInStock)}
                    >
                      Только в наличии
                      {onlyInStock && <Check size={16} className="ml-auto" />}
                    </button>
                    
                    <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                      <CollapsibleTrigger className="flex items-center text-white hover:text-matrix-green transition-colors">
                        <SlidersHorizontal size={16} className="mr-2" />
                        Расширенные настройки
                        {showAdvancedFilters ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="mt-4 space-y-4">
                        {/* Фильтр по году */}
                        <div>
                          <h3 className="text-white font-medium mb-2">Год выпуска</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {Array.from(new Set(allProducts.map(p => p.year))).map(year => (
                              <div key={year} className="flex items-center">
                                <Checkbox 
                                  id={`year-${year}`}
                                  checked={selectedYears.includes(year || 0)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedYears([...selectedYears, year || 0]);
                                    } else {
                                      setSelectedYears(selectedYears.filter(y => y !== year));
                                    }
                                  }}
                                  className="mr-2 data-[state=checked]:bg-matrix-green data-[state=checked]:border-matrix-green"
                                />
                                <label htmlFor={`year-${year}`} className="text-white cursor-pointer">{year}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Фильтр по цвету */}
                        <div>
                          <h3 className="text-white font-medium mb-2">Цвет</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {Array.from(new Set(allProducts.map(p => p.color))).map(color => (
                              <div key={color} className="flex items-center">
                                <Checkbox 
                                  id={`color-${color}`}
                                  checked={selectedColors.includes(color || '')}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedColors([...selectedColors, color || '']);
                                    } else {
                                      setSelectedColors(selectedColors.filter(c => c !== color));
                                    }
                                  }}
                                  className="mr-2 data-[state=checked]:bg-matrix-green data-[state=checked]:border-matrix-green"
                                />
                                <label htmlFor={`color-${color}`} className="text-white cursor-pointer">{color}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Фильтр по наличию */}
                        <div className="flex items-center">
                          <Checkbox 
                            id="in-stock"
                            checked={onlyInStock}
                            onCheckedChange={(checked) => setOnlyInStock(checked as boolean)}
                            className="mr-2 data-[state=checked]:bg-matrix-green data-[state=checked]:border-matrix-green"
                          />
                          <label htmlFor="in-stock" className="text-white cursor-pointer">Только в наличии</label>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                  
                  {/* Активные фильтры */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <h3 className="text-white font-medium mb-3">Активные фильтры</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeCategory !== 'Все' && (
                        <div className="flex items-center bg-matrix-green/20 text-matrix-green text-sm px-2 py-1 rounded">
                          Категория: {activeCategory}
                          <button onClick={() => setActiveCategory('Все')} className="ml-2">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      
                      {onlyInStock && (
                        <div className="flex items-center bg-matrix-green/20 text-matrix-green text-sm px-2 py-1 rounded">
                          Только в наличии
                          <button onClick={() => setOnlyInStock(false)} className="ml-2">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      
                      {selectedYears.map(year => (
                        <div key={year} className="flex items-center bg-matrix-green/20 text-matrix-green text-sm px-2 py-1 rounded">
                          Год: {year}
                          <button onClick={() => toggleYear(year)} className="ml-2">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      
                      {selectedColors.map(color => (
                        <div key={color} className="flex items-center bg-matrix-green/20 text-matrix-green text-sm px-2 py-1 rounded">
                          <span className={`inline-block w-2 h-2 rounded-full ${getColorClass(color)} mr-1`}></span>
                          Цвет: {color}
                          <button onClick={() => toggleColor(color)} className="ml-2">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      
                      {(activeCategory !== 'Все' || onlyInStock || selectedYears.length > 0 || selectedColors.length > 0) && (
                        <button
                          onClick={clearAllFilters}
                          className="text-sm text-white bg-gray-700/50 hover:bg-gray-700/80 px-2 py-1 rounded transition-colors"
                        >
                          Сбросить все
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Результаты поиска и количество */}
            <div className="flex justify-between items-center">
              <div className="text-gray-400 text-sm">
                {searchTerm && <span>Результаты поиска для "{searchTerm}". </span>}
                Найдено {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : (filteredProducts.length >= 2 && filteredProducts.length <= 4) ? 'товара' : 'товаров'}
              </div>
            </div>
          </div>
          
          {isLoadingProducts ? (
            <div className="text-center py-12 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
              <h2 className="text-2xl text-white mb-2">Загрузка продуктов...</h2>
              <p className="text-gray-400">Пожалуйста, подождите</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={`${viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'} transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              {viewType === 'grid' ? (
                filteredProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className={`product-card group cursor-pointer transition-all duration-300 transform hover:scale-[1.02]`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`relative overflow-hidden rounded-lg`}>
                      <div className="aspect-[4/3] relative">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Теги продукта */}
                      {product.tags && product.tags.length > 0 && (
                        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                          {product.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className={`text-xs px-2 py-0.5 rounded ${
                                tag === 'премиум' 
                                  ? 'bg-matrix-green/80 text-black' 
                                  : tag === 'новинка' 
                                    ? 'bg-blue-500/80 text-white' 
                                    : 'bg-orange-500/80 text-white'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="px-2 flex-1">
                      <p className="text-sm text-matrix-green mb-1">{product.category_name}</p>
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-matrix-green transition-colors duration-300">{product.name}</h3>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-white font-semibold">{product.price.toLocaleString('ru-RU')} ₽</span>
                          {product.discount_price && (
                            <span className="text-gray-500 text-sm line-through ml-2">{product.discount_price.toLocaleString('ru-RU')} ₽</span>
                          )}
                        </div>
                        
                        {!product.in_stock && (
                          <span className="text-xs text-orange-300">Под заказ</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.slug}`}
                      className="block bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 hover:border-matrix-green/30 transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Изображение товара */}
                        <div className="md:w-1/4 lg:w-1/5 relative overflow-hidden">
                          <div className="aspect-square md:h-full">
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Теги продукта */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                              {product.tags.map((tag, i) => (
                                <span 
                                  key={i} 
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    tag === 'премиум' 
                                      ? 'bg-matrix-green/80 text-black' 
                                      : tag === 'новинка' 
                                        ? 'bg-blue-500/80 text-white' 
                                        : 'bg-orange-500/80 text-white'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Информация о товаре */}
                        <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className="text-matrix-green text-sm font-medium">{product.category_name}</span>
                              {product.year && (
                                <span className="text-gray-400 text-sm ml-4">• {product.year}</span>
                              )}
                              {product.color && (
                                <span className="text-gray-400 text-sm ml-2">• {product.color}</span>
                              )}
                            </div>
                            
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{product.name}</h3>
                            
                            <p className="text-gray-400 mb-4 line-clamp-2 md:line-clamp-3">
                              {product.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                              <span className="text-white text-xl md:text-2xl font-bold">{product.price.toLocaleString('ru-RU')} ₽</span>
                              {product.discount_price && (
                                <span className="text-gray-500 line-through ml-2">{product.discount_price.toLocaleString('ru-RU')} ₽</span>
                              )}
                            </div>
                            
                            <div className="flex items-center">
                              {!product.in_stock && (
                                <span className="text-orange-300 text-sm mr-4">Под заказ</span>
                              )}
                              <button className="px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30 transition-colors">
                                Подробнее
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
              <h2 className="text-2xl text-white mb-2">Товары не найдены</h2>
              <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
              <button 
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-matrix-green/20 text-matrix-green rounded-md hover:bg-matrix-green/30 transition-colors"
              >
                Сбросить все фильтры
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Catalog;
