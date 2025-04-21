import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';

const Categories = () => {
  const { data: categories, isLoading, error } = useCategories();
  const navigate = useNavigate();
  
  console.log('Категории в компоненте Categories:', categories);
  
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-pulse text-gray-400">Загрузка категорий...</div>
      </div>
    );
  }
  
  if (error || !categories || categories.length === 0) {
    console.error('Ошибка загрузки категорий:', error);
    return (
      <div className="py-12 text-center">
        <div className="text-red-500">Не удалось загрузить категории</div>
      </div>
    );
  }
  
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Каталог <span className="text-matrix-green">устройств</span>
        </h2>
        <p className="text-gray-400 mb-12">Выберите категорию продуктов</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="relative h-80 group cursor-pointer overflow-hidden rounded-lg border border-white/10 hover:border-matrix-green/50 transition-all duration-300"
              onClick={() => navigate(`/catalog?category=${category.slug}`)}
            >
              <img 
                src={category.image_url} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-matrix-green transition-colors duration-300">
                  {category.name}
                </h3>
                <div className="w-0 h-0.5 bg-matrix-green transition-all duration-500 group-hover:w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
