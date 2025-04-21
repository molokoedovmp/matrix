
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const InnovationSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-black relative overflow-hidden">
      {/* Фоновая сетка */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-10 bg-[size:50px_50px] z-0"
        style={{ backgroundSize: '40px 40px' }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div 
            className={`w-full lg:w-1/2 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Инновации в <span className="text-matrix-green">каждой детали</span>
            </h2>
            
            <p className="text-gray-300 mb-6">
              Откройте для себя мир, где передовые технологии Apple сочетаются с 
              потрясающим дизайном. Наши устройства не просто инструменты — это продолжение 
              вашей индивидуальности в цифровой реальности.
            </p>
            
            <p className="text-gray-300 mb-8">
              От мощных процессоров до интуитивных интерфейсов — каждая деталь 
              создана, чтобы сделать ваш опыт использования устройств Apple 
              по-настоящему выдающимся.
            </p>
            
            <Link 
              to="/about" 
              className="matrix-button inline-block"
            >
              Узнать больше
            </Link>
          </div>
          
          <div 
            className={`w-full lg:w-1/2 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative">
              <img 
                src="/apple.jpg" 
                alt="Apple innovations" 
                className="rounded-lg shadow-2xl shadow-matrix-green/20"
              />
              {/* Overlay with matrix-like elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-matrix-dark/60 to-transparent rounded-lg">
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="w-full h-0.5 bg-matrix-green/30"></div>
                  <div className="mt-2 space-y-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-1 bg-matrix-green/10 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovationSection;
