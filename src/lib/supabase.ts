import { createClient } from '@supabase/supabase-js';

// Проверяем, что переменные окружения загружены
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Ключ загружен' : 'Ключ не загружен');
console.log('Supabase Service Key:', import.meta.env.VITE_SUPABASE_SERVICE_KEY ? 'Сервисный ключ загружен' : 'Сервисный ключ не загружен');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Проверяем, что URL и ключи определены
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Ошибка: Не найдены переменные окружения для Supabase');
}

// Клиент с сервисным ключом для админских операций (включая загрузку файлов)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Обычный клиент для пользовательских операций
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Проверяем соединение с Supabase
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Ошибка подключения к Supabase:', error);
  } else {
    console.log('Подключение к Supabase успешно установлено');
  }
}); 