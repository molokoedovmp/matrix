import React from 'react';
import { Link } from 'react-router-dom';
import { Apple, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black border-t border-matrix-green/20">
      <div className="container mx-auto px-4 py-8">
        
        <div className="mt-8 pt-8 border-t border-matrix-green/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} MΛTR1X Market. Все права защищены.
          </p>
          
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
