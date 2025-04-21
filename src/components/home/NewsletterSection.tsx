
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { SendHorizontal } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, введите ваш email.",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, согласитесь с условиями.",
      });
      return;
    }
    
    setLoading(true);
    
    // Симуляция отправки данных
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Успешно!",
        description: "Вы подписались на нашу рассылку новостей.",
        className: "bg-matrix-green/20 border-matrix-green text-white",
      });
      setEmail('');
      setAgreedToTerms(false);
    }, 1500);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-matrix-dark to-black relative overflow-hidden">
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-matrix-green/20 to-transparent"></div>
        
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i}
            className="absolute text-lg opacity-5 text-matrix-green font-mono"
            style={{ 
              top: `${10 + Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            {Math.random() > 0.5 ? '10' : '01'}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-xl tech-border transform hover:shadow-matrix-green/20 transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Будьте в <span className="text-matrix-green">курсе</span>
            </h2>
            <p className="text-gray-400">
              Подпишитесь на нашу рассылку, чтобы первыми узнавать о новых продуктах, 
              специальных предложениях и эксклюзивных событиях
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:border-matrix-green text-white pr-12"
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-matrix-green/20 p-2 rounded-md hover:bg-matrix-green/40 transition-colors disabled:opacity-50"
              >
                <SendHorizontal size={20} className={`text-matrix-green ${loading ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)} 
                className="border-gray-600 data-[state=checked]:bg-matrix-green data-[state=checked]:border-matrix-green" 
              />
              <label 
                htmlFor="terms" 
                className="text-sm text-gray-400 cursor-pointer"
              >
                Я согласен(на) получать новости и предложения от Apple Matrix и принимаю{' '}
                <a href="#" className="text-matrix-green hover:underline">политику конфиденциальности</a>
              </label>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-2 gap-4 md:grid-cols-4">
            {['Новые релизы', 'Специальные предложения', 'Советы и трюки', 'События'].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-matrix-green/10 mb-2">
                  <span className="text-matrix-green text-xs font-mono">0{i+1}</span>
                </div>
                <p className="text-gray-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
