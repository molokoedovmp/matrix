import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Проверяем, есть ли пользователь с таким email в таблице profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      if (profileError || !profileData) {
        throw new Error('Пользователь не найден');
      }
      
      // Простая проверка пароля (в реальном проекте нужно использовать хеширование)
      if (password !== 'Admin') {
        throw new Error('Неверный пароль');
      }
      
      // Сохраняем информацию о входе в localStorage
      localStorage.setItem('adminUser', JSON.stringify({
        email: profileData.email,
        name: profileData.name,
        isLoggedIn: true
      }));

      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать в панель администратора'
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Ошибка входа:', error);
      setError(error instanceof Error ? error.message : 'Ошибка входа');
      
      toast({
        title: 'Ошибка входа',
        description: error instanceof Error ? error.message : 'Проверьте ваши учетные данные',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-matrix-dark">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/50 rounded-lg border border-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Панель администратора</h1>
          <p className="mt-2 text-gray-400">Войдите, чтобы получить доступ</p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-black/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-matrix-green focus:border-transparent"
              placeholder="admin@mail.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-black/70 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-matrix-green focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-black bg-matrix-green hover:bg-matrix-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-matrix-green transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 