
import React, { useState, useRef, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Quote, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  product: string;
  rating: number;
  expanded?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Елена Смирнова",
    role: "Графический дизайнер",
    quote: "MacBook Pro полностью изменил мой рабочий процесс. Невероятная производительность и потрясающее качество дисплея позволяют мне воплощать самые сложные творческие идеи.",
    product: "MacBook Pro 16\"",
    rating: 5
  },
  {
    id: 2,
    name: "Александр Петров",
    role: "Разработчик ПО",
    quote: "iPhone 14 Pro — это не просто телефон, а настоящий карманный компьютер. Скорость и функциональность на высочайшем уровне, а камера превосходит все ожидания.",
    product: "iPhone 14 Pro",
    rating: 5
  },
  {
    id: 3,
    name: "Мария Иванова",
    role: "Предприниматель",
    quote: "iPad Pro с Apple Pencil стал незаменимым инструментом в моей работе. Удобство, мобильность и интуитивно понятный интерфейс делают его идеальным для деловых задач.",
    product: "iPad Pro",
    rating: 4
  }
];

const TestimonialSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);
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
      { threshold: 0.1 }
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

  const toggleTestimonial = (id: number) => {
    setActiveTestimonial(activeTestimonial === id ? null : id);
  };

  return (
    <section 
      ref={sectionRef} 
      className="py-20 bg-gradient-to-b from-black via-matrix-dark to-black relative overflow-hidden"
    >
      {/* Декоративный фон */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute text-xs font-mono text-matrix-green opacity-20"
            style={{ 
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 90 - 45}deg)`
            }}
          >
            {Math.random() > 0.5 ? '10' : '01'}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center mb-3">
            <Quote className="text-matrix-green mr-2" size={32} />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Отзывы <span className="text-matrix-green">пользователей</span>
            </h2>
          </div>
          
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Познакомьтесь с реальными историями наших клиентов, которые уже оценили преимущества Apple
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Collapsible 
                key={testimonial.id}
                open={activeTestimonial === testimonial.id}
                onOpenChange={() => toggleTestimonial(testimonial.id)}
                className={`bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 
                            transition-all duration-300 hover:border-matrix-green/30 hover:shadow-lg hover:shadow-matrix-green/5
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${testimonial.id * 200}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                  <CollapsibleTrigger className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    {activeTestimonial === testimonial.id ? (
                      <ChevronUp className="text-matrix-green" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </CollapsibleTrigger>
                </div>

                <div className="flex items-center text-matrix-green mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      size={16} 
                      fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                      className={i < testimonial.rating ? 'text-matrix-green' : 'text-gray-600'} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">• {testimonial.product}</span>
                </div>

                <div className="mb-2 text-gray-300 line-clamp-2">
                  "{testimonial.quote.substring(0, 60)}..."
                </div>

                <CollapsibleContent>
                  <div className="pt-3 border-t border-gray-800 mt-2 text-gray-300">
                    "{testimonial.quote}"
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
