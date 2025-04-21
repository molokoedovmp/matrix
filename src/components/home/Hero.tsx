
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Code, Cpu, Layers, ShieldCheck, Smartphone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const Hero = () => {
  const [typewriterText, setTypewriterText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState([]);
  const fullText = 'Погрузитесь в мир технологий';
  
  useEffect(() => {
    // Симуляция загрузки
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    setTimeout(() => {
      clearInterval(loadingInterval);
      setIsLoaded(true);
      setLoadingProgress(100);
      
      setTimeout(() => {
        setShowContent(true);
        
        // Запуск анимации набора текста после загрузки
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
          if (currentIndex <= fullText.length) {
            setTypewriterText(fullText.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
          }
        }, 80);
        
        // Создаем плавающие иконки
        const icons = [];
        const iconComponents = [Code, Cpu, Layers, ShieldCheck, Smartphone];
        
        for (let i = 0; i < 10; i++) {
          const IconComponent = iconComponents[Math.floor(Math.random() * iconComponents.length)];
          
          icons.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 20 + 10,
            opacity: Math.random() * 0.5 + 0.1,
            speed: Math.random() * 0.5 + 0.2,
            direction: Math.random() > 0.5 ? 1 : -1,
            icon: IconComponent,
          });
        }
        
        setFloatingIcons(icons);
      }, 500);
    }, 2000);
    
    return () => {
      clearInterval(loadingInterval);
    };
  }, []);
  
  // Перемещаем плавающие иконки
  useEffect(() => {
    if (!floatingIcons.length || !showContent) return;
    
    const moveIcons = setInterval(() => {
      setFloatingIcons(prevIcons => 
        prevIcons.map(icon => ({
          ...icon,
          x: ((icon.x + (icon.speed * icon.direction)) % 100 + 100) % 100,
          y: ((icon.y + (icon.speed * 0.5 * (Math.random() > 0.5 ? 1 : -1))) % 100 + 100) % 100
        }))
      );
    }, 100);
    
    return () => clearInterval(moveIcons);
  }, [floatingIcons, showContent]);
  
  // Цифровой счетчик для анимации
  const [counter, setCounter] = useState(0);
  
  useEffect(() => {
    if (!showContent) return;
    
    const countInterval = setInterval(() => {
      setCounter(prev => (prev + 1) % 1000);
    }, 50);
    
    return () => clearInterval(countInterval);
  }, [showContent]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Фоновый градиент */}
      <div className="absolute inset-0 bg-gradient-radial from-black to-matrix-dark z-0"></div>
      
      {/* Фоновая сетка с анимацией пульсации */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-20 bg-[size:40px_40px] z-0"
        style={{ backgroundSize: '40px 40px' }}
      ></div>
      
      {/* Плавающие иконки в фоне */}
      {showContent && floatingIcons.map(icon => {
        const IconComponent = icon.icon;
        return (
          <div 
            key={icon.id}
            className="absolute z-0 text-matrix-green/30 motion-safe:animate-float"
            style={{ 
              left: `${icon.x}%`, 
              top: `${icon.y}%`,
              opacity: icon.opacity,
              transform: `scale(${icon.size / 20})`,
              transition: 'all 3s ease-in-out'
            }}
          >
            <IconComponent size={24} />
          </div>
        );
      })}
      
      {/* Экран загрузки */}
      {!showContent && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black bg-opacity-80">
          <div className="w-64 space-y-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-mono text-matrix-green">Инициализация системы</span>
              <span className="text-sm font-mono text-matrix-green">{Math.floor(loadingProgress)}%</span>
            </div>
            <Progress value={loadingProgress} className="h-1 bg-gray-700" />
            
            <div className="grid grid-cols-3 gap-2 mt-8">
              {Array.from({length: 6}).map((_, i) => (
                <Skeleton key={i} className={`h-6 w-full ${isLoaded ? 'bg-matrix-green/20' : 'bg-gray-700'}`} />
              ))}
            </div>
            
            <div className="flex justify-between text-xs font-mono text-matrix-green/70 mt-4">
              <span>МАТРИЦА</span>
              <span>APPLE</span>
              <span>{counter.toString().padStart(3, '0')}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Основной контент с эффектом появления */}
      <div className={`container mx-auto px-4 z-10 transition-all duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center max-w-4xl mx-auto">
          {/* Анимированный глобальный логотип с цифровыми эффектами */}
          <div className="relative mb-6">
            <h1 className="font-sans text-4xl md:text-7xl font-bold text-white">
              Market
              <span className="text-matrix-green ml-2 glowing-text">Matrix</span>
            </h1>
            
            {/* Декоративные цифровые элементы */}
            <div className="absolute -top-6 -left-6 right-0 bottom-0 flex flex-wrap overflow-hidden opacity-20">
              {Array.from({length: 30}).map((_, i) => (
                <div 
                  key={i} 
                  className="digital-char text-matrix-green"
                  style={{ '--delay': `${i}` } as React.CSSProperties}
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </div>
              ))}
            </div>
          </div>
          
          {/* Анимированный текст с курсором */}
          <div className="h-12">
            <p className="text-xl md:text-2xl font-light text-gray-300 mb-10">
              {typewriterText}
              <span className="animate-pulse ml-1 text-matrix-green">|</span>
            </p>
          </div>
          
          {/* Стильные кнопки с улучшенной анимацией */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-12 mt-8">
            <Link to="/catalog" className="matrix-button text-lg group relative overflow-hidden">
              <span className="relative z-10">Каталог</span>
              <span className="absolute inset-0 w-full h-full bg-matrix-green/10 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
            </Link>
            <Link to="/about" className="apple-button text-lg group relative overflow-hidden">
              <span className="relative z-10">О нас</span>
              <span className="absolute inset-0 w-full h-full bg-apple-blue/10 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
            </Link>
          </div>
          
          {/* Стилизованная секция с декоративными элементами */}
          <div className="mt-20 relative">
            {/* Декоративные линии */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-matrix-green/30 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-matrix-green/30 to-transparent"></div>
            
            {/* Индикатор прокрутки */}
            <div className="mt-16 animate-bounce cursor-pointer">
              <a href="#featured" className="text-gray-400 hover:text-white transition-colors duration-300 group">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-matrix-green/70 mb-1">Открыть каталог</span>
                  <ChevronDown className="group-hover:text-matrix-green transition-colors duration-300" size={32} />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Дополнительные декоративные элементы */}
      {showContent && (
        <div className="absolute bottom-10 left-10 text-matrix-green/20 text-xs font-mono hidden lg:block">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="mb-1">
              {Math.random().toString(36).substring(2, 15)}
            </div>
          ))}
        </div>
      )}
      
      {showContent && (
        <div className="absolute bottom-10 right-10 text-matrix-green/20 text-xs font-mono hidden lg:block">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="mb-1 text-right">
              {Math.random().toString(36).substring(2, 15)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;
