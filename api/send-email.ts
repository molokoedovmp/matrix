import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      totalPrice,
      orderId,
      comment,
      itemsTable
    } = request.body;

    // Создаем транспорт для отправки email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.VITE_PUBLIC_NODEMAILER_USER,
        pass: process.env.VITE_PUBLIC_NODEMAILER_PASS
      }
    });

    // Email администратора
    const ADMIN_EMAIL = 'molokoedovmp@gmail.com';

    // Формируем HTML-письмо
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00FF41; text-align: center;">Новый заказ #${orderId}</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Информация о клиенте:</h3>
          <p><strong>Имя:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Телефон:</strong> ${customerPhone}</p>
          <p><strong>Адрес доставки:</strong> ${customerAddress}</p>
          ${comment ? `<p><strong>Комментарий:</strong> ${comment}</p>` : ''}
        </div>
        
        <h3>Заказанные товары:</h3>
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
            ${itemsTable}
            <tr style="font-weight: bold;">
              <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #ddd;">Итого:</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${totalPrice.toLocaleString('ru-RU')} ₽</td>
            </tr>
          </tbody>
        </table>
        
        <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
          Это автоматическое уведомление от MΛTR1X Market. Пожалуйста, не отвечайте на это письмо.
        </p>
      </div>
    `;

    // Отправляем email
    await transporter.sendMail({
      from: `"MΛTR1X Market" <${process.env.VITE_PUBLIC_NODEMAILER_USER}>`,
      to: ADMIN_EMAIL,
      subject: `Новый заказ #${orderId} от ${customerName}`,
      html: htmlContent
    });

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return response.status(500).json({ error: 'Failed to send email' });
  }
} 