import { CartItem } from '../hooks/useCart';

interface EmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  totalPrice: number;
  orderId: number;
  comment?: string;
}

// Функция для отправки email через API
export const sendOrderNotification = async (data: EmailData): Promise<void> => {
  try {
    // Формируем HTML-таблицу с товарами
    const itemsTable = data.items.map(item => `
      <tr>
        <td style="padding: 10px; text-align: left; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.price.toLocaleString('ru-RU')} ₽</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${(item.price * item.quantity).toLocaleString('ru-RU')} ₽</td>
      </tr>
    `).join('');

    // Отправляем запрос на API-эндпоинт
    const response = await fetch('/api/send-email.mjs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        itemsTable,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}; 