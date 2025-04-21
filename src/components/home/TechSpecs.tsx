import React, { useRef, useEffect, useState } from 'react';
import { Cpu, Battery, Monitor, Camera, Wifi, Clock } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Product {
  id: string;
  name: string;
  processor: string;
  display: string;
  camera: string;
  battery: string;
  connectivity: string;
  performance: number;
  image: string;
}

const products: Record<string, Product> = {
  iphone: {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    processor: 'A18 Pro с 6‑ядерным CPU и 6‑ядерным GPU',
    display: '6,3″ Super Retina XDR OLED, 2622×1206 пикселей, 460 ppi, ProMotion до 120 Гц, Always-On, HDR, True Tone',
    camera: '48 Мп (широкоугольная), 48 Мп (ультраширокая), 12 Мп (телеобъектив с 5‑кратным оптическим зумом)',
    battery: '3582 мА·ч; до 27 часов воспроизведения видео',
    connectivity: 'Wi‑Fi 6E, Bluetooth 5.3, 5G, UWB, NFC',
    performance: 98,
    image: '/iphone.jpg'
  },
  mac: {
    id: 'macbook-pro-m4',
    name: 'MacBook Pro 14″ (M4)',
    processor: 'M4 с 10‑ядерным CPU (4 производительных и 6 энергоэффективных ядер), 10‑ядерным GPU и 16‑ядерным Neural Engine',
    display: '14,2″ Liquid Retina XDR, 3024×1964 пикселей, Mini‑LED, ProMotion до 120 Гц',
    camera: '12 Мп FaceTime HD с функцией Center Stage',
    battery: 'До 21 часа работы от одного заряда',
    connectivity: 'Wi‑Fi 6E, Bluetooth 5.3, 3× Thunderbolt 4, HDMI, SDXC, MagSafe 3',
    performance: 95,
    image: '/mac.jpg'
  },
  ipad: {
    id: 'ipad-pro-13-m4',
    name: 'iPad Pro 13″ (M4)',
    processor: 'M4 с 10‑ядерным CPU (4 производительных и 6 энергоэффективных ядер), 10‑ядерным GPU и 16‑ядерным Neural Engine',
    display: '13″ Ultra Retina XDR, Tandem OLED, 2752×2064 пикселей, ProMotion 10–120 Гц, HDR до 1600 нит',
    camera: '12 Мп (основная) с LiDAR, 12 Мп (фронтальная, ультраширокая) с функцией Center Stage',
    battery: '38,99 Вт·ч; до 10 часов работы в интернете по Wi‑Fi',
    connectivity: 'Wi‑Fi 6E, Bluetooth 5.3, 5G (опционально), Thunderbolt / USB 4',
    performance: 92,
    image: '/ipad.jpg'
  }
};

const productImages = {
  iphone: '/images/products/iphone.jpg',
  mac: '/images/products/macbook.jpg',
  ipad: '/images/products/ipad.jpg'
};

const TechSpecs = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('iphone');
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

  const product = products[selectedProduct];

  const specItems = [
    { icon: Cpu, title: "Процессор", value: product.processor },
    { icon: Monitor, title: "Дисплей", value: product.display },
    { icon: Camera, title: "Камера", value: product.camera },
    { icon: Battery, title: "Батарея", value: product.battery },
    { icon: Wifi, title: "Связь", value: product.connectivity },
    { icon: Clock, title: "Производительность", value: `${product.performance}%` }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-black relative overflow-hidden"
    >
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0">
        <div className="absolute h-px w-full top-0 left-0 bg-gradient-to-r from-transparent via-matrix-green/20 to-transparent"></div>
        <div className="absolute h-px w-full bottom-0 left-0 bg-gradient-to-r from-transparent via-matrix-green/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-white">
            Технические <span className="text-matrix-green">характеристики</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Исследуйте передовые технологии, которые делают продукты Apple непревзойденными
          </p>
          
          <div className="flex justify-center mb-10">
            <ToggleGroup type="single" value={selectedProduct} onValueChange={(value) => value && setSelectedProduct(value)} className="border border-gray-800 rounded-md overflow-hidden">
              <ToggleGroupItem 
                value="iphone" 
                className="text-sm sm:text-base px-4 py-2 bg-black/50 border-r border-gray-800 text-gray-300
                          data-[state=on]:bg-matrix-green/20 data-[state=on]:text-matrix-green hover:bg-black/70"
              >
                iPhone
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="mac" 
                className="text-sm sm:text-base px-4 py-2 bg-black/50 border-r border-gray-800 text-gray-300
                          data-[state=on]:bg-matrix-green/20 data-[state=on]:text-matrix-green hover:bg-black/70"
              >
                MacBook
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="ipad" 
                className="text-sm sm:text-base px-4 py-2 bg-black/50 text-gray-300
                          data-[state=on]:bg-matrix-green/20 data-[state=on]:text-matrix-green hover:bg-black/70"
              >
                iPad
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className={`transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 mb-6">Технические характеристики, которые впечатляют</p>
              
              <div className="space-y-6">
                {specItems.map((spec, index) => (
                  <div 
                    key={index}
                    className="flex gap-4 items-start bg-black/30 border border-white/5 rounded-lg p-4 hover:border-matrix-green/30 transition-colors"
                  >
                    <div className="bg-matrix-green/10 rounded-full p-2 text-matrix-green">
                      <spec.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{spec.title}</h4>
                      <p className="text-gray-400 text-sm">{spec.value}</p>
                      
                      {spec.title === "Производительность" && (
                        <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-gradient-to-r from-matrix-green to-matrix-green/60 h-1.5 rounded-full"
                            style={{ width: `${product.performance}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`text-center transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="rounded-lg shadow-2xl mx-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
                
                {/* Декоративные элементы */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-0.5 bg-matrix-green/20 rounded"></div>
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

export default TechSpecs;
