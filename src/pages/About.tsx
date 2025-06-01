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
  Users, 
  Phone 
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
                  <div className="absolute inset-0 bg-gradient-to-t из-чёрного/70 через-прозрачный к-прозрачному"></div>
                  
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
        
        {/* Связь с нами */}
        <section className="py-16 bg-black/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-2">
              Связь с нами <span className="text-matrix-green">в соцсетях</span>
            </h2>
            <p className="text-gray-400 mb-12">Свяжитесь с нами в социальных сетях или по телефону</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Telegram */}
              <a 
                href="https://t.me/Ludoviksan" 
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
                <p className="text-gray-400 text-center">@Ludoviksan</p>
              </a>
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/79017353335" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-matrix-green/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">WhatsApp</h3>
                <p className="text-gray-400 text-center">+7 (901) 735-33-35</p>
              </a>

              {/* Телефон */}
              <a 
                href="tel:+79017353335"
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-matrix-green/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Phone className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Телефон</h3>
                <p className="text-gray-400 text-center">+7 (901) 735-33-35</p>
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
