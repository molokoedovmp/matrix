import nodemailer from 'nodemailer';

// Создаем транспорт для отправки email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'molokoedovmp@gmail.com', // Ваш email
    pass: 'tnixbmakiznoxwcm' // Ваш пароль приложения
  }
});

// Тестовое письмо
const testEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"MΛTR1X Market" <molokoedovmp@gmail.com>',
      to: 'rassolenko.maxim@yandex.ru', // Куда отправить тестовое письмо
      subject: 'Тестовое письмо от MΛTR1X Market',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00FF41; text-align: center;">Тестовое письмо</h2>
          <p>Это тестовое письмо для проверки работы Nodemailer.</p>
          <p>Если вы видите это письмо, значит настройка выполнена правильно!</p>
        </div>
      `
    });

    console.log('Тестовое письмо отправлено:', info.messageId);
  } catch (error) {
    console.error('Ошибка при отправке тестового письма:', error);
  }
};

// Запускаем тест
testEmail(); 