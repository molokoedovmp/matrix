import nodemailer from 'nodemailer';
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

// Создаем транспорт для отправки email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: import.meta.env.VITE_PUBLIC_NODEMAILER_USER,
    pass: import.meta.env.VITE_PUBLIC_NODEMAILER_PASS
  }
});

// Email администратора, который будет получать уведомления
const ADMIN_EMAIL = 'rassolenko.maxim@yandex.ru'; // Замените на нужный email

export const sendOrderNotification = async (data: EmailData): Promise<void> => {
  try {
    // Формируем HTML-таблицу с товарами
    const itemsTable = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f3f3;">
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Товар</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Количество</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Цена</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Сумма</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td style="padding: 10px; text-align: left; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.price.toLocaleString('ru-RU')} ₽</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${(item.price * item.quantity).toLocaleString('ru-RU')} ₽</td>
            </tr>
          `).join('')}
          <tr style="font-weight: bold;">
            <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #ddd;">Итого:</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${data.totalPrice.toLocaleString('ru-RU')} ₽</td>
          </tr>
        </tbody>
      </table>
    `;

    // Формируем HTML-письмо
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00FF41; text-align: center;">Новый заказ #${data.orderId}</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Информация о клиенте:</h3>
          <p><strong>Имя:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Телефон:</strong> ${data.customerPhone}</p>
          <p><strong>Адрес доставки:</strong> ${data.customerAddress}</p>
          ${data.comment ? `<p><strong>Комментарий:</strong> ${data.comment}</p>` : ''}
        </div>
        
        <h3>Заказанные товары:</h3>
        ${itemsTable}
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${window.location.origin}/admin/orders" style="background-color: #00FF41; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Перейти к управлению заказами
          </a>
        </div>
        
        <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
          Это автоматическое уведомление от MΛTR1X Market. Пожалуйста, не отвечайте на это письмо.
        </p>
      </div>
    `;

    // Отправляем email
    await transporter.sendMail({
      from: `"MΛTR1X Market" <${import.meta.env.VITE_PUBLIC_NODEMAILER_USER}>`,
      to: ADMIN_EMAIL,
      subject: `Новый заказ #${data.orderId} от ${data.customerName}`,
      html: htmlContent
    });

    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}; 