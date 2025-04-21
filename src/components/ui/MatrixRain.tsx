
import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  density?: number;
  speed?: number;
  opacity?: number;
  color?: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({
  density = 30,
  speed = 1.5,
  opacity = 0.06,
  color = '#00FF41'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Расширенный набор символов для более интересного эффекта
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>[]{}|:;"\'`~!@#$%^&*()_+-=';
    const columns = Math.floor(canvas.width / 16); // Регулируем размер символов
    const drops: number[] = [];
    const fontSize: number[] = []; // Различные размеры шрифтов
    const glyphOpacity: number[] = []; // Индивидуальная прозрачность
    const glyphColor: string[] = []; // Индивидуальный цвет

    // Дополнительные цвета для интересного визуала
    const colorVariations = [
      color,
      '#33ff33',
      '#66ff66',
      '#00cc00',
      '#99ff99'
    ];

    // Инициализируем массивы
    for(let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -canvas.height;
      fontSize[i] = Math.floor(Math.random() * 5) + 12; // От 12 до 16
      glyphOpacity[i] = Math.random() * 0.5 + 0.5; // От 0.5 до 1.0
      glyphColor[i] = colorVariations[Math.floor(Math.random() * colorVariations.length)];
    }

    const draw = () => {
      // Добавляем полупрозрачный черный фон для эффекта размытия
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 * speed})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for(let i = 0; i < drops.length; i++) {
        // Для каждой колонки выбираем произвольный символ
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Вычисляем позицию x с небольшими вариациями
        const x = i * 16 + Math.random() * 4 - 2;
        
        // Устанавливаем шрифт и цвет
        ctx.font = `${fontSize[i]}px "Courier New"`;
        
        // Создаем градиент для эффекта свечения
        const gradient = ctx.createLinearGradient(x, drops[i] - fontSize[i], x, drops[i]);
        gradient.addColorStop(0, 'rgba(0, 255, 65, 0.1)');
        gradient.addColorStop(1, glyphColor[i]);
        
        // Применяем цвет с прозрачностью
        ctx.fillStyle = gradient;
        ctx.globalAlpha = glyphOpacity[i] * opacity * 2; // Усиливаем эффект
        
        // Рисуем символ
        ctx.fillText(text, x, drops[i]);
        
        // Иногда добавляем свечение
        if (Math.random() > 0.99) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.fillText(text, x, drops[i]);
          ctx.shadowBlur = 0;
        }
        
        // Перемещаем капли вниз с различной скоростью
        drops[i] += fontSize[i] * 0.5 * speed;
        
        // Случайно меняем прозрачность
        if (Math.random() > 0.95) {
          glyphOpacity[i] = Math.random() * 0.5 + 0.5;
        }
        
        // Сбрасываем капли, чтобы они появлялись сверху
        if (drops[i] > canvas.height && Math.random() > 0.975 - speed/10) {
          drops[i] = Math.random() * -100;
          // Иногда меняем размер шрифта и цвет
          if (Math.random() > 0.8) {
            fontSize[i] = Math.floor(Math.random() * 5) + 12;
            glyphColor[i] = colorVariations[Math.floor(Math.random() * colorVariations.length)];
          }
        }
      }
    };

    // Создаем эффект волны, время от времени добавляя больше символов
    const createWave = () => {
      const waveStart = Math.floor(Math.random() * columns);
      const waveWidth = Math.floor(Math.random() * 10) + 5;
      
      for (let i = waveStart; i < waveStart + waveWidth && i < columns; i++) {
        if (i >= 0 && i < columns) {
          drops[i] = 0;
          glyphOpacity[i] = 1.0; // Полная видимость
        }
      }
    };

    // Периодически создаем волны
    const waveInterval = setInterval(createWave, 5000);

    const interval = setInterval(draw, 33); // ~30fps

    return () => {
      clearInterval(interval);
      clearInterval(waveInterval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [density, speed, opacity, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ opacity: opacity * 2.5 }} // Усиливаем общую видимость
    />
  );
};

export default MatrixRain;
