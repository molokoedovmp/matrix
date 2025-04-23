import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/ui/Footer';
import { useCart } from '../hooks/useCart';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { orderService } from '../services/orderService';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Состояние для формы заказа
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    comment: ''
  });
  
  // Обработка изменений в форме
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
    toast({
      title: "Товар удален из корзины",
      description: "Товар был успешно удален из корзины",
    });
  };
  
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };
  
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderForm.customer_name || !orderForm.customer_phone || !orderForm.customer_email || !orderForm.customer_address) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Создаем заказ
      await orderService.createOrder({
        ...orderForm,
        items,
        total_price: getTotalPrice()
      });
      
      toast({
        title: "Заказ оформлен",
        description: "Ваш заказ успешно оформлен! Мы свяжемся с вами в ближайшее время для подтверждения.",
      });
      
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось оформить заказ. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const sendOrderConfirmation = async () => {
    const adminEmail = 'rassolenko.maxim@yandex.ru';
    
    // Вариант 1: Использовать сервис отправки email напрямую
    try {
      await orderService.sendEmailNotification(adminEmail, {
        items,
        customerName: orderForm.customer_name,
        totalPrice: getTotalPrice()
      });
      console.log('Уведомление отправлено');
    } catch (error) {
      console.error('Ошибка отправки уведомления:', error);
    }
    
    // Или вариант 2: Просто закомментировать неиспользуемый код
    // notifications.sendToAdmin('despot551@yandex.ru', orderData); // Ошибка здесь
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
        {/* Кнопка назад */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-matrix-green/10 border border-matrix-green/30 rounded-md text-matrix-green hover:bg-matrix-green/20 transition-colors mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Вернуться назад
        </button>
        
        <h1 className="text-3xl font-bold text-white mb-8">Корзина</h1>
        
        {items.length === 0 ? (
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-500" />
            <h2 className="text-2xl text-white mb-4">Ваша корзина пуста</h2>
            <p className="text-gray-400 mb-6">Добавьте товары в корзину, чтобы оформить заказ</p>
            <Link to="/catalog" className="inline-block bg-matrix-green text-black px-6 py-3 rounded-md hover:bg-matrix-green/90 transition-colors">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center border-b border-gray-800 pb-6">
                      <div className="w-24 h-24 bg-black/50 rounded-lg overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      
                      <div className="flex-1 sm:ml-6">
                        <Link to={`/product/${item.id}`} className="text-lg font-medium text-white hover:text-matrix-green transition-colors">
                          {item.name}
                        </Link>
                        
                        {item.memory && (
                          <p className="text-gray-400 text-sm mt-1">Объем памяти: {item.memory}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center justify-between mt-4">
                          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-md bg-black/50 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            
                            <span className="text-white w-8 text-center">{item.quantity}</span>
                            
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-md bg-black/50 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col">
                              {item.discount_price ? (
                                <>
                                  <span className="text-white font-bold">
                                    {item.discount_price.toLocaleString('ru-RU')} ₽
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {item.price.toLocaleString('ru-RU')} ₽
                                  </span>
                                </>
                              ) : (
                                <span className="text-white font-bold">
                                  {item.price.toLocaleString('ru-RU')} ₽
                                </span>
                              )}
                            </div>
                            
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 rounded-md text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Оформление заказа</h2>
                
                <form onSubmit={handleSubmitOrder}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="customer_name" className="block text-gray-400 mb-1">Ваше имя *</label>
                      <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        value={orderForm.customer_name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black/50 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="customer_phone" className="block text-gray-400 mb-1">Телефон *</label>
                      <input
                        type="tel"
                        id="customer_phone"
                        name="customer_phone"
                        value={orderForm.customer_phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black/50 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="customer_email" className="block text-gray-400 mb-1">Email *</label>
                      <input
                        type="email"
                        id="customer_email"
                        name="customer_email"
                        value={orderForm.customer_email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black/50 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="customer_address" className="block text-gray-400 mb-1">Адрес доставки *</label>
                      <input
                        type="text"
                        id="customer_address"
                        name="customer_address"
                        value={orderForm.customer_address}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black/50 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="comment" className="block text-gray-400 mb-1">Комментарий к заказу</label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={orderForm.comment}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-black/50 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-matrix-green"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Товары ({items.length}):</span>
                      <div className="text-right">
                        {items.map((item) => (
                          <>
                            {item.discount_price ? (
                              <>
                                <div className="text-white font-bold">
                                  {(item.discount_price * item.quantity).toLocaleString('ru-RU')} ₽
                                </div>
                                <div className="text-sm text-gray-400 line-through">
                                  {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                </div>
                              </>
                            ) : (
                              <div className="text-white font-bold">
                                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    </div>
                    
                    
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Итого к оплате:</span>
                      <span className="text-white">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-matrix-green text-black py-3 rounded-md flex items-center justify-center font-medium hover:bg-matrix-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Оформление...</span>
                        <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                      </>
                    ) : (
                      'Оформить заказ'
                    )}
                  </button>
                  
                  <p className="text-gray-400 text-xs mt-4 text-center">
                    Нажимая кнопку "Оформить заказ", вы соглашаетесь с <Link to="/terms" className="text-matrix-green">условиями пользования</Link> и <Link to="/privacy" className="text-matrix-green">политикой конфиденциальности</Link>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart; 