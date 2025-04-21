import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/ui/Footer';
import MatrixRain from '../components/ui/MatrixRain';
import { 
  Calendar, 
  Code2, 
  Cpu, 
  GraduationCap, 
  Layers, 
  Lightbulb, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const timelineItems = [
    {
      year: 1976,
      title: "Основание Apple",
      description: "Стив Джобс, Стив Возняк и Рональд Уэйн основывают компанию Apple Computer.",
      icon: Users
    },
    {
      year: 1984,
      title: "Выпуск Macintosh",
      description: "Apple представляет Macintosh — первый массовый персональный компьютер с графическим пользовательским интерфейсом.",
      icon: Code2
    },
    {
      year: 2001,
      title: "iPod и iTunes",
      description: "Apple выпускает iPod и открывает iTunes Store, революционизируя индустрию цифровой музыки.",
      icon: Layers
    },
    {
      year: 2007,
      title: "Запуск iPhone",
      description: "Стив Джобс представляет iPhone — устройство, изменившее представление о мобильных телефонах.",
      icon: Cpu
    },
    {
      year: 2010,
      title: "Первый iPad",
      description: "Apple создаёт новую категорию устройств, выпустив первый планшет iPad.",
      icon: ShieldCheck
    },
    {
      year: 2015,
      title: "Apple Watch",
      description: "Компания выходит на рынок носимых устройств с Apple Watch.",
      icon: Calendar
    },
    {
      year: 2020,
      title: "Apple Silicon",
      description: "Apple объявляет о переходе Mac на собственные процессоры Apple Silicon.",
      icon: Lightbulb
    },
    {
      year: 2023,
      title: "Инновации продолжаются",
      description: "Apple продолжает задавать тренды в индустрии, выпуская новые революционная продукты.",
      icon: GraduationCap
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-black via-matrix-dark to-black">
      <MatrixRain density={20} speed={1.2} opacity={0.05} color="#00FF41" />
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 bg-[size:30px_30px]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                О компании <span className="text-matrix-green">Matrix Market</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Мы объединяем лучшие технологии и инновации Apple с уникальным цифровым опытом, 
                создавая революционная продукты на стыке реальности и цифрового мира.
              </p>
              
              <div className="flex justify-center gap-2">
                <span className="inline-block h-1 w-12 bg-matrix-green rounded"></span>
                <span className="inline-block h-1 w-3 bg-matrix-green/60 rounded"></span>
                <span className="inline-block h-1 w-3 bg-matrix-green/40 rounded"></span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className={`transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h2 className="text-3xl font-bold mb-6 text-white">Наша <span className="text-matrix-green">миссия</span></h2>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  В Matrix Market мы стремимся размыть границы между реальным и цифровым мирами, 
                  создавая продукты, которые не просто работают — они вдохновляют, удивляют и открывают 
                  новые горизонты возможностей.
                </p>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Мы верим, что технологии должны расширять человеческий потенциал, делать жизнь проще, 
                  интереснее и продуктивнее. Каждое наше устройство — это шаг в будущее, где технологии 
                  и человек существуют в гармонии.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {["Инновации", "Качество", "Дизайн", "Опыт"].map((value, i) => (
                    <div key={i} className="bg-matrix-green/5 border border-matrix-green/20 rounded-lg p-4 hover:bg-matrix-green/10 transition-colors">
                      <h3 className="text-matrix-green font-medium mb-2">{value}</h3>
                      <div className="w-12 h-1 bg-matrix-green/30 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="aspect-square rounded-xl overflow-hidden shadow-2xl shadow-matrix-green/10 border border-white/10 relative">
                  <img 
                    src="/matrx.jpg" 
                    alt="Наша миссия" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Декоративные элементы */}
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="flex justify-between items-end">
                      <div className="text-right">
                        <p className="text-white/70 text-xs font-mono">VS.2023.04</p>
                        <p className="text-matrix-green/70 text-xs font-mono">MATRIX</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Декоративный фоновый элемент */}
                <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full border border-matrix-green/30 rounded-xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* History Timeline */}
        <section className="py-20 relative">
          <div className="absolute inset-y-0 left-1/2 w-px bg-matrix-green/20 transform -translate-x-1/2"></div>
          
          <div className="container mx-auto px-4 relative">
            <h2 className="text-3xl font-bold mb-10 text-center text-white">
              История <span className="text-matrix-green">инноваций</span>
            </h2>
            
            <div className="space-y-16">
              {timelineItems.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                    <div className={`w-full md:w-5/12 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-all duration-700`} 
                         style={{ transitionDelay: `${index * 150}ms` }}>
                      <div className={`bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-lg 
                                      ${isEven ? 'md:mr-8' : 'md:ml-8'} hover:border-matrix-green/30 transition-colors`}>
                        <div className="flex items-start mb-3">
                          <div className="bg-matrix-green/10 rounded-full p-2 mr-3 text-matrix-green">
                            <item.icon size={20} />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{item.title}</h3>
                            <p className="text-matrix-green text-sm">{item.year}</p>
                          </div>
                        </div>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="relative my-4 md:my-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full border-4 border-matrix-dark bg-black flex items-center justify-center z-10">
                        <div className="h-4 w-4 rounded-full bg-matrix-green pulse-glow"></div>
                      </div>
                      <div className="absolute h-px w-8 bg-matrix-green/40 left-1/2 md:hidden"></div>
                    </div>
                    
                    <div className="w-full md:w-5/12 md:opacity-0"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Наши соцсети */}
        <section className="py-16 bg-black/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-2">
              Наши <span className="text-matrix-green">соцсети</span>
            </h2>
            <p className="text-gray-400 mb-12">Следите за нами в социальных сетях</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Telegram */}
              <a 
                href="https://t.me/apple_matrix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-matrix-green/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.51l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.833.95z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Telegram</h3>
                <p className="text-gray-400 text-center">Новости и анонсы новых поступлений</p>
              </a>
              
              {/* VK */}
              <a 
                href="https://vk.com/apple_matrix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-matrix-green/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23c-1.43 2.78-2.006 2.913-2.238 2.745-.546-.401-.41-1.618-.41-2.48V7.677c0-.696-.19-.977-.74-.977H9.161c-.414 0-.662.18-.662.552 0 .58.86.715 1.015 2.35v3.563c0 .788-.153.932-.48.932-.875 0-2.975-3.175-4.27-6.8-.247-.694-.493-.96-1.185-.96H1.57c-.757 0-.91.36-.91.752 0 .708.875 4.214 4.064 8.846C6.87 19.93 9.936 22 12.714 22c1.75 0 1.962-.39 1.962-.98v-2.413c0-.722.15-.865.65-.865.37 0 1.002.18 2.474 1.6 1.687 1.687 1.946 2.435 2.895 2.435h3.287c.749 0 1.126-.368.909-1.096-.499-1.527-3.845-4.668-3.995-4.878-.37-.479-.264-.691 0-1.122 0 0 2.923-4.175 3.223-5.54.31-.91-.525-1.34-1.33-1.34z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">ВКонтакте</h3>
                <p className="text-gray-400 text-center">Обзоры и отзывы покупателей</p>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://instagram.com/apple_matrix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-matrix-green/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Instagram</h3>
                <p className="text-gray-400 text-center">Фото новинок и специальные предложения</p>
              </a>
              
              {/* YouTube */}
              <a 
                href="https://youtube.com/apple_matrix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-matrix-green/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">YouTube</h3>
                <p className="text-gray-400 text-center">Видеообзоры и распаковки новинок</p>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
