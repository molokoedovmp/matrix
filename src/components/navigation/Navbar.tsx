import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ChevronRight } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../components/ui/navigation-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  console.log('Категории в Navbar:', categories);
  const { data: products } = useProducts();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  // Эффект для анимации букв в логотипе
  const [logoText, setLogoText] = useState("MΛTR1X");
  
  // Добавим тестовые категории на случай, если данные не загружаются
  const testCategories = [
    { id: 1, name: 'iPhone', slug: 'iphone' },
    { id: 2, name: 'Mac', slug: 'mac' },
    { id: 3, name: 'iPad', slug: 'ipad' },
    { id: 4, name: 'Watch', slug: 'watch' }
  ];

  // Используем тестовые категории, если реальные не загрузились
  const displayCategories = (categories && categories.length > 0) ? categories : testCategories;
  
  useEffect(() => {
    const matrixChars = "ΛBCDΣFGHIJKLM1234567890!@#$%^&*";
    const originalText = "MΛTR1X";
    
    let interval: NodeJS.Timeout;
    
    // Случайная анимация букв в логотипе
    const animateLogo = () => {
      interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * originalText.length);
        const randomChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        setLogoText(prev => {
          const chars = prev.split('');
          // С вероятностью 70% возвращаем оригинальный символ
          chars[randomIndex] = Math.random() > 0.3 
            ? originalText[randomIndex] 
            : randomChar;
          return chars.join('');
        });
      }, 150);
    };
    
    animateLogo();
    
    return () => clearInterval(interval);
  }, []);

  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Закрытие поиска при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Функция поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 1) {
      // Поиск по продуктам
      const filteredProducts = products?.filter(product => 
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5) || [];
      
      // Поиск по категориям
      const filteredCategories = categories?.filter(category => 
        category.name.toLowerCase().includes(value.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(value.toLowerCase()))
      ).slice(0, 3) || [];
      
      setSearchResults([
        ...filteredCategories.map(cat => ({ ...cat, type: 'category' })),
        ...filteredProducts.map(prod => ({ ...prod, type: 'product' }))
      ]);
      
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
      setSearchResults([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
    }
  };
  
  const handleSearchItemClick = (item: any) => {
    if (item.type === 'product') {
      navigate(`/product/${item.slug}`);
    } else if (item.type === 'category') {
      navigate(`/catalog?category=${item.slug}`);
    }
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md border-b border-matrix-green/30 shadow-lg shadow-matrix-green/10' 
          : 'bg-black border-b border-matrix-green/30'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link to="/" className="flex items-center space-x-1">
            <span className="text-2xl font-bold tracking-wider">
              <span className="text-matrix-green font-['Courier_New'] font-bold">{logoText}</span>
              <span className="text-gray-400 font-light ml-1 tracking-widest font-['Century_Gothic']">Market</span>
            </span>
          </Link>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="bg-transparent space-x-10">
                <NavigationMenuItem>
                  <Link to="/" className="text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase">
                    ГЛΛВНΛЯ
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase bg-transparent data-[state=open]:bg-black/80 data-[state=open]:text-matrix-green">
                    КΛТΛЛОГ
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-black/95 border border-matrix-green/30 rounded-md shadow-lg shadow-matrix-green/20 max-h-[70vh] overflow-y-auto">
                    <div className="p-4 w-[300px]">
                      <div className="mb-4">
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2"># Категории</h3>
                        <Link 
                          to="/catalog" 
                          className="block p-2 rounded-md hover:bg-matrix-green/10 transition-colors text-matrix-green font-medium"
                        >
                          Все категории
                        </Link>
                      </div>
                      
                      <div className="space-y-1">
                        {isLoadingCategories ? (
                          <div className="text-gray-400 text-sm p-2">Загрузка категорий...</div>
                        ) : displayCategories.length > 0 ? (
                          displayCategories.map((category) => (
                            <Link
                              key={category.id}
                              to={`/catalog?category=${category.slug}`}
                              className="block p-2 rounded-md hover:bg-matrix-green/10 transition-colors text-gray-300 hover:text-matrix-green"
                            >
                              {category.name}
                            </Link>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm p-2">Категории не найдены</div>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about" className="text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase">
                    О НΛС
                  </Link>
                </NavigationMenuItem>
                
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Поиск и корзина */}
          <div className="flex items-center space-x-6">
            <div ref={searchRef} className="hidden md:block relative">
              <form onSubmit={handleSearch} className="flex items-center relative">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-black/50 border border-matrix-green/30 text-white px-3 py-1 rounded-md focus:outline-none focus:border-matrix-green w-40 lg:w-60 font-['Courier_New'] text-sm"
                />
                <button type="submit" className="absolute right-2 text-gray-400 hover:text-matrix-green">
                  <Search size={18} />
                </button>
              </form>
              
              {/* Выпадающие результаты поиска */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-matrix-green/30 rounded-md shadow-lg shadow-matrix-green/20 z-50 max-h-[70vh] overflow-y-auto">
                  <div className="p-2">
                    {searchResults.some(item => item.type === 'category') && (
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-1">Категории</div>
                        {searchResults
                          .filter(item => item.type === 'category')
                          .map(category => (
                            <div 
                              key={`category-${category.id}`}
                              onClick={() => handleSearchItemClick(category)}
                              className="px-3 py-2 hover:bg-matrix-green/10 rounded-md cursor-pointer flex items-center"
                            >
                              <span className="text-matrix-green mr-2">#</span>
                              <span className="text-white">{category.name}</span>
                            </div>
                          ))
                        }
                      </div>
                    )}
                    
                    {searchResults.some(item => item.type === 'product') && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-1">Товары</div>
                        {searchResults
                          .filter(item => item.type === 'product')
                          .map(product => (
                            <div 
                              key={`product-${product.id}`}
                              onClick={() => handleSearchItemClick(product)}
                              className="px-3 py-2 hover:bg-matrix-green/10 rounded-md cursor-pointer flex items-center"
                            >
                              <div className="w-8 h-8 bg-black/50 rounded overflow-hidden mr-2 flex-shrink-0">
                                <img 
                                  src={product.image_url} 
                                  alt={product.name} 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white truncate">{product.name}</div>
                                <div className="text-matrix-green text-sm">{product.price?.toLocaleString('ru-RU')} ₽</div>
                              </div>
                              <ChevronRight size={16} className="text-gray-500 ml-2" />
                            </div>
                          ))
                        }
                      </div>
                    )}
                    
                    <div className="mt-2 pt-2 border-t border-gray-800">
                      <button 
                        onClick={handleSearch}
                        className="w-full text-center text-sm text-gray-400 hover:text-matrix-green py-2"
                      >
                        Показать все результаты
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/cart" className="text-gray-300 hover:text-matrix-green transition-colors duration-300 relative">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-matrix-green text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* Кнопка мобильного меню */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-matrix-green transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-matrix-green/30 py-4 max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="mb-4 flex items-center relative">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-black/50 border border-matrix-green/30 text-white px-3 py-2 rounded-md focus:outline-none focus:border-matrix-green w-full font-['Courier_New'] text-sm"
              />
              <button type="submit" className="absolute right-2 text-gray-400 hover:text-matrix-green">
                <Search size={18} />
              </button>
            </form>
            
            {/* Мобильные результаты поиска */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="mb-4 bg-black/80 border border-matrix-green/30 rounded-md">
                <div className="p-2">
                  {searchResults.slice(0, 5).map((item, index) => (
                    <div 
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSearchItemClick(item)}
                      className={`px-3 py-2 hover:bg-matrix-green/10 rounded-md cursor-pointer flex items-center ${
                        index < searchResults.length - 1 ? 'border-b border-gray-800' : ''
                      }`}
                    >
                      {item.type === 'product' && (
                        <div className="w-8 h-8 bg-black/50 rounded overflow-hidden mr-2 flex-shrink-0">
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      {item.type === 'category' && (
                        <span className="text-matrix-green mr-2 text-lg">#</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-white truncate">{item.name}</div>
                        {item.type === 'product' && (
                          <div className="text-matrix-green text-sm">{item.price?.toLocaleString('ru-RU')} ₽</div>
                        )}
                        {item.type === 'category' && (
                          <div className="text-gray-400 text-xs">Категория</div>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-gray-500 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <nav className="flex flex-col space-y-6">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                ГЛΛВНΛЯ
              </Link>
              
              <div className="space-y-3">
                <div className="text-gray-300 font-['Courier_New'] tracking-widest text-sm uppercase">КΛТΛЛОГ</div>
                <div className="pl-4 space-y-3">
                  <Link
                    to="/catalog"
                    className="block text-matrix-green hover:text-matrix-green/80 transition-colors duration-300 font-['Courier_New'] text-xs tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Все категории
                  </Link>
                  {isLoadingCategories ? (
                    <div className="text-gray-400 text-xs">Загрузка...</div>
                  ) : displayCategories.length > 0 ? (
                    displayCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/catalog?category=${category.slug}`}
                        className="block text-gray-400 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] text-xs tracking-wide"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <div className="text-gray-400 text-xs">Категории не найдены</div>
                  )}
                </div>
              </div>
              
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                О НΛС
              </Link>
              
              <Link 
                to="/contacts" 
                className="text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                КОНТΛКТЫ
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 