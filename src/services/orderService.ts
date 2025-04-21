import { supabase } from '../lib/supabase';
import { CartItem } from '../hooks/useCart';
import { sendOrderNotification } from '../api/email-api';

export interface OrderData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  items: CartItem[];
  total_price: number;
  comment?: string;
}

export interface Order extends OrderData {
  id: number;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export const orderService = {
  async createOrder(orderData: OrderData): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        status: 'new'
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    // Отправляем email-уведомление
    try {
      await sendOrderNotification({
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        customerAddress: data.customer_address,
        items: data.items,
        totalPrice: data.total_price,
        orderId: data.id,
        comment: data.comment
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Не прерываем выполнение, даже если отправка email не удалась
    }
    
    return data;
  },
  
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getOrderById(id: number): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async updateOrderStatus(id: number, status: Order['status']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating order status:`, error);
      throw error;
    }
  }
}; 