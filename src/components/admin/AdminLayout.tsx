import React, { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Package, 
  Tag, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  ShoppingBag,
  LayoutGrid
} from 'lucide-react';
import { toast } from '../../hooks/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    // Удаляем информацию о входе из localStorage
    localStorage.removeItem('adminUser');
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из системы'
    });
    navigate('/admin/login');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/admin/dashboard', label: 'Дашборд', icon: <Home size={20} /> },
    { path: '/admin/products', label: 'Продукты', icon: <Package size={20} /> },
    { path: '/admin/categories', label: 'Категории', icon: <LayoutGrid size={20} /> },
    { path: '/admin/tags', label: 'Теги', icon: <Tag size={20} /> },
    { path: '/admin/orders', label: 'Заказы', icon: <ShoppingBag size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-matrix-dark flex flex-col md:flex-row">
      {/* Мобильная шапка */}
      <div className="bg-black/80 border-b border-gray-800 p-4 flex justify-between items-center md:hidden">
        <h1 className="text-white font-bold text-lg">Админ-панель</h1>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Боковая панель */}
      <div 
        className={`bg-black/80 border-r border-gray-800 w-64 fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-white font-bold text-xl">Apple Matrix</h1>
          <p className="text-gray-400 text-sm">Панель администратора</p>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-matrix-green/20 text-matrix-green'
                      : 'text-gray-400 hover:bg-black/40 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
            
            <li className="pt-4 mt-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 rounded-md text-gray-400 hover:bg-black/40 hover:text-white transition-colors"
              >
                <LogOut size={20} />
                <span className="ml-3">Выйти</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Затемнение при открытом меню на мобильных */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Основной контент */}
      <div className="flex-1 md:ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 