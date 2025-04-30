import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';

interface Category {
  id: number;
  name: string;
  slug?: string;
  parent_id?: number | null;
  is_featured?: boolean;
  image_url?: string;
}

interface CategoryWithSubcategories extends Category {
  subcategories?: CategoryWithSubcategories[];
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { data: allCategories, isLoading: isLoadingCategories } = useCategories();
  const { data: products } = useProducts();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  // Эффект для анимации букв в логотипе
  const [logoText, setLogoText] = useState("MΛTR1X");
  
  // Организуем категории в иерархическую структуру
  const organizeCategories = (categories: Category[] = []): CategoryWithSubcategories[] => {
    const categoryMap = new Map<number, CategoryWithSubcategories>();
    const rootCategories: CategoryWithSubcategories[] = [];
    
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
    
    return rootCategories;
  };
  
  const hierarchicalCategories = organizeCategories(allCategories);
  
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
  
  // Закрытие каталога при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCatalogOpen && catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setIsCatalogOpen(false);
        setHoveredCategory(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCatalogOpen]);
  
  // Закрытие бокового меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);
  
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
      const filteredCategories = allCategories?.filter(category => 
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
  
  // Функция для переключения раскрытия категории
  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  // Рекурсивная функция для отображения категорий в мобильном меню
  const renderMobileCategoryMenu = (categories: CategoryWithSubcategories[], level = 0) => {
    return categories.map(category => (
      <div key={category.id} className="mb-2">
        <div className={`flex items-center justify-between ${level > 0 ? 'pl-4 border-l border-matrix-green/30' : ''}`}>
          <Link
            to={category.slug ? `/catalog?category=${category.slug}` : '/catalog'}
            className={`text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] text-sm tracking-wide ${level > 0 ? 'ml-2' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {category.name}
          </Link>
          
          {category.subcategories && category.subcategories.length > 0 && (
            <button
              onClick={() => toggleCategoryExpand(category.id)}
              className="p-1 text-gray-400 hover:text-matrix-green"
            >
              {expandedCategories.includes(category.id) ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          )}
        </div>
        
        {category.subcategories && category.subcategories.length > 0 && expandedCategories.includes(category.id) && (
          <div className="mt-2 ml-2">
            {renderMobileCategoryMenu(category.subcategories, level + 1)}
          </div>
        )}
      </div>
    ));
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
          <nav className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
            >
              ГЛΛВНΛЯ
            </Link>
            
            <div 
              ref={catalogRef}
              className="relative"
              onMouseLeave={() => {
                setTimeout(() => {
                  if (!catalogRef.current?.matches(':hover')) {
                    setHoveredCategory(null);
                    setIsCatalogOpen(false);
                  }
                }, 100);
              }}
            >
              <button
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className="flex items-center text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
              >
                КΛТΛЛОГ
                <span className={`ml-1 transition-transform duration-300 ${isCatalogOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown size={16} />
                </span>
              </button>
              
              {isCatalogOpen && (
                <div className="absolute top-full left-0 mt-2 bg-black/95 border border-matrix-green/30 rounded-md shadow-lg shadow-matrix-green/20 z-50 flex">
                  {/* Левая колонка с категориями */}
                  <div className="w-64 p-4">
                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4"># КАТЕГОРИИ</h3>
                    <div className="space-y-1">
                      <Link
                        to="/catalog"
                        className="block p-2 rounded-md hover:bg-matrix-green/10 transition-colors text-matrix-green font-medium"
                        onClick={() => setIsCatalogOpen(false)}
                      >
                        Все категории
                      </Link>
                      
                      {isLoadingCategories ? (
                        <div className="text-gray-400 text-sm p-2">Загрузка категорий...</div>
                      ) : hierarchicalCategories.length > 0 ? (
                        hierarchicalCategories.map(category => (
                          <div
                            key={category.id}
                            className={`block p-2 rounded-md transition-colors text-gray-300 hover:text-matrix-green flex items-center justify-between cursor-pointer ${
                              hoveredCategory === category.id ? 'bg-matrix-green/10 text-matrix-green' : ''
                            }`}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                          >
                            <span>{category.name}</span>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <ChevronRight size={16} className="text-gray-500" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm p-2">Категории не найдены</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Правая колонка с подкатегориями */}
                  {hoveredCategory !== null && (
                    <div className="w-64 max-h-[70vh] overflow-y-auto bg-black/95 border-l border-matrix-green/30">
                      <div className="p-4">
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4 sticky top-0 bg-black/95 z-10">
                          # {hierarchicalCategories.find(cat => cat.id === hoveredCategory)?.name || 'Подкатегории'}
                        </h3>
                        <div className="space-y-1">
                          {hierarchicalCategories
                            .find(cat => cat.id === hoveredCategory)
                            ?.subcategories?.map(subcategory => (
                              <Link
                                key={subcategory.id}
                                to={subcategory.slug ? `/catalog?category=${subcategory.slug}` : '/catalog'}
                                className="block p-2 rounded-md hover:bg-matrix-green/10 transition-colors text-gray-300 hover:text-matrix-green"
                                onClick={() => setIsCatalogOpen(false)}
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
            >
              О НΛС
            </Link>
            
            <Link 
              to="/contacts" 
              className="text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
            >
              КОНТΛКТЫ
            </Link>
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
      
      {/* Боковое мобильное меню */}
      <div 
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-black/95 backdrop-blur-md border-r border-matrix-green/30 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden overflow-y-auto`}
        ref={sidebarRef}
      >
        <div className="p-4 border-b border-matrix-green/30 flex justify-between items-center">
          <span className="text-xl font-bold text-matrix-green">Меню</span>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-400 hover:text-matrix-green"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSearch} className="mb-6 flex items-center relative">
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
          
          {/* Результаты поиска */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="mb-6 bg-black/80 border border-matrix-green/30 rounded-md">
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
            </div>
          )}
          
          <nav className="space-y-6">
            <Link 
              to="/" 
              className="block text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
              onClick={() => setIsMenuOpen(false)}
            >
              ГЛΛВНΛЯ
            </Link>
            
            <div className="space-y-2">
              <Link
                to="/catalog"
                className="block text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                КΛТΛЛОГ
              </Link>
              
              <div className="mt-3 space-y-1 pl-2">
                {isLoadingCategories ? (
                  <div className="text-gray-400 text-xs">Загрузка...</div>
                ) : hierarchicalCategories.length > 0 ? (
                  renderMobileCategoryMenu(hierarchicalCategories)
                ) : (
                  <div className="text-gray-400 text-xs">Категории не найдены</div>
                )}
              </div>
            </div>
            
            <Link 
              to="/about" 
              className="block text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
              onClick={() => setIsMenuOpen(false)}
            >
              О НΛС
            </Link>
            
            <Link 
              to="/contacts" 
              className="block text-gray-300 hover:text-matrix-green transition-colors duration-300 font-['Courier_New'] tracking-widest text-sm uppercase"
              onClick={() => setIsMenuOpen(false)}
            >
              КОНТΛКТЫ
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Затемнение фона при открытом меню */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Navbar; 