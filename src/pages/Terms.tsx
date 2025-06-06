import React, { useEffect, useState } from 'react';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/ui/Footer';
import MatrixRain from '../components/ui/MatrixRain';

const Terms = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-black via-matrix-dark to-black">
      <MatrixRain density={20} speed={1.2} opacity={0.05} color="#00FF41" />
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Условия <span className="text-matrix-green">пользования</span>
              </h1>
              
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 md:p-8 text-gray-300 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">1. Общие положения</h2>
                  <p className="mb-2">
                    Настоящие Условия пользования (далее — «Условия») регулируют отношения между MΛTR1X Market (далее — «Компания») и пользователями (далее — «Пользователи») интернет-магазина, расположенного по адресу matrix-market.ru (далее — «Сайт»).
                  </p>
                  <p>
                    Используя Сайт, Пользователь подтверждает, что прочитал, понял и согласен соблюдать настоящие Условия. Если Пользователь не согласен с Условиями, он должен прекратить использование Сайта.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">2. Регистрация и учетная запись</h2>
                  <p className="mb-2">
                    Для совершения покупок на Сайте Пользователю может потребоваться создание учетной записи. Пользователь обязуется предоставлять точную, актуальную и полную информацию при регистрации и поддерживать эту информацию в актуальном состоянии.
                  </p>
                  <p className="mb-2">
                    Пользователь несет ответственность за сохранение конфиденциальности своих учетных данных и за все действия, совершаемые с использованием его учетной записи.
                  </p>
                  <p>
                    Компания оставляет за собой право отказать в регистрации, приостановить или удалить учетную запись Пользователя по своему усмотрению без объяснения причин.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">3. Заказы и оплата</h2>
                  <p className="mb-2">
                    Оформляя заказ на Сайте, Пользователь соглашается с условиями продажи товаров, включая цену, способы доставки и оплаты.
                  </p>
                  <p className="mb-2">
                    Компания оставляет за собой право изменять цены, ассортимент товаров и условия продажи без предварительного уведомления.
                  </p>
                  <p>
                    Оплата товаров осуществляется способами, указанными на Сайте. Компания не несет ответственности за действия платежных систем.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">4. Доставка и возврат</h2>
                  <p className="mb-2">
                    Условия доставки товаров указываются на Сайте. Компания не гарантирует точные сроки доставки, так как они могут зависеть от третьих лиц.
                  </p>
                  <p>
                    Возврат товаров осуществляется в соответствии с законодательством Российской Федерации и условиями, указанными на Сайте.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">5. Интеллектуальная собственность</h2>
                  <p className="mb-2">
                    Все материалы, размещенные на Сайте, включая тексты, изображения, логотипы, программный код и дизайн, являются интеллектуальной собственностью Компании или ее партнеров и защищены законодательством об авторском праве.
                  </p>
                  <p>
                    Пользователю запрещается копировать, распространять, изменять или иным образом использовать материалы Сайта без письменного разрешения Компании.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">6. Ограничение ответственности</h2>
                  <p className="mb-2">
                    Компания предоставляет Сайт «как есть» без каких-либо гарантий. Компания не несет ответственности за любые убытки, возникшие в результате использования или невозможности использования Сайта.
                  </p>
                  <p>
                    Компания не гарантирует, что Сайт будет работать бесперебойно, быстро, безопасно или без ошибок.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">7. Изменение условий</h2>
                  <p>
                    Компания оставляет за собой право изменять настоящие Условия в любое время без предварительного уведомления. Новая редакция Условий вступает в силу с момента ее размещения на Сайте, если иное не предусмотрено новой редакцией Условий.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">8. Применимое право</h2>
                  <p>
                    Настоящие Условия регулируются и толкуются в соответствии с законодательством Российской Федерации. Любые споры, возникающие из настоящих Условий, подлежат разрешению в соответствии с законодательством Российской Федерации.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">9. Контактная информация</h2>
                  <p>
                    По всем вопросам, связанным с использованием Сайта, Пользователь может обратиться в Компанию по адресу электронной почты: info@matrix-market.ru или по телефону: +7 (495) 123-45-67.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms; 