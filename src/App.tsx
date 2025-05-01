import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { supabase } from "./lib/supabase";
import { useState, useEffect } from "react";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminTags from "./pages/admin/AdminTags";
import Cart from "./pages/Cart";
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import AdminOrders from "./pages/admin/AdminOrders";
import { NavbarProvider } from './context/NavbarContext';

const queryClient = new QueryClient();

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('count');
        if (error) {
          console.error('Ошибка подключения к Supabase:', error);
        } else {
          console.log('Подключение к Supabase успешно, количество категорий:', data);
        }
      } catch (e) {
        console.error('Исключение при проверке подключения:', e);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NavbarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/:category" element={<Catalog />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Маршруты админ-панели */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/tags" element={<AdminRoute><AdminTags /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NavbarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
