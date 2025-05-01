import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useNavbar } from '../../context/NavbarContext';

// Расширяем интерфейс Category, добавляя parent_id
interface CategoryWithParent {
  id: number;
  name: string;
  slug?: string;
  parent_id: number | null;
  is_featured?: boolean;
  image_url?: string;
  order: number;
}

const Categories = () => {
  const { data: categories, isLoading } = useCategories();
  const { openCategoryMenu } = useNavbar();
  
  // Функция для обработки клика по категории
  const handleCategoryClick = (categoryId: number, e: React.MouseEvent) => {
    e.preventDefault(); // Предотвращаем переход по ссылке
    openCategoryMenu(categoryId);
    
    // Прокручиваем страницу вверх, чтобы пользователь увидел открытое меню
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Загрузка категорий...</div>;
  }
  
  // Фильтруем только категории верхнего уровня и сортируем по порядку
  const rootCategories = categories
    ?.filter(cat => (cat as CategoryWithParent).parent_id === null)
    .sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
  
  return (
    <section className="py-24 bg-black mt-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Каталог <span className="text-matrix-green">устройств</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rootCategories.map(category => (
            <Link 
              key={category.id}
              to={`/catalog?category=${category.slug}`}
              className="group"
              onClick={(e) => handleCategoryClick(category.id, e)}
            >
              <div className="bg-black/50 border border-matrix-green/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-matrix-green hover:shadow-lg hover:shadow-matrix-green/20">
                <div className="aspect-square relative overflow-hidden">
                  {category.image_url ? (
                    <img 
                      src={category.image_url} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-matrix-green/10">
                      <span className="text-matrix-green text-5xl">?</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-medium text-matrix-green">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
