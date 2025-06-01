import React from 'react';
import { Link } from 'react-router-dom';
import { Apple, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black border-t border-matrix-green/20">
      <div className="container mx-auto px-4 py-8">
        
        <div className="mt-8 pt-8 border-t border-matrix-green/10 flex flex-col md:flex-row justify-between items-center">
          {/* Копирайт и социальные сети в одной строке */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4 md:mb-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} MΛTR1X Market. Все права защищены.
            </p>
            
            {/* Социальные сети сразу после копирайта */}
            <div className="flex items-center space-x-3">
              {/* Telegram */}
              <a 
                href="https://t.me/Ludoviksan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all"
                title="Telegram"
              >
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.51l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.833.95z" />
                </svg>
              </a>
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/79017353335" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500/30 transition-all"
                title="WhatsApp"
              >
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {/* Отображение номера телефона */}
              <a 
                href="tel:+79017353335"
                className="text-gray-500 text-sm hover:text-matrix-green transition-colors"
                title="Позвонить +7 (901) 735-33-35"
              >
                +7 (901) 735-33-35
              </a>
            </div>
          </div>
          
          {/* Ссылки на страницы */}
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-500 hover:text-matrix-green text-sm transition-colors">
              Условия пользования
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-matrix-green text-sm transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
