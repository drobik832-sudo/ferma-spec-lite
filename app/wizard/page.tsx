"use client";

import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";

// --- Data Constants ---
const ROOMS = [
  { id: 'hallway', label: 'Прихожая', cost: 150000, days: 7 },
  { id: 'living', label: 'Гостиная', label_genitive: 'Гостиной', cost: 450000, days: 20 },
  { id: 'bedroom', label: 'Спальня', cost: 400000, days: 18 },
  { id: 'kids', label: 'Детская', cost: 400000, days: 18 },
  { id: 'kitchen', label: 'Кухня', cost: 550000, days: 25 },
  { id: 'bathroom', label: 'Санузел', cost: 450000, days: 20 },
  { id: 'balcony', label: 'Балкон', cost: 100000, days: 7 },
];

const PROPERTY_TYPES = [
  { id: 'office', label: 'Офис', multiplier: 1.1, abstractPrice: '~2.0 млн' },
  { id: 'apartment', label: 'Квартира', multiplier: 1.0, abstractPrice: '~2.8 млн' },
  { id: 'house', label: 'Дом', multiplier: 1.4, abstractPrice: '~4.5 млн' },
];

const BASE_PLANS = [
  {
    id: "premium",
    title: "Премиум",
    icon: "/icons/premium.png",
    overlayIcon: "/icons/gem1.png",
    description: "Авторский надзор и элитные материалы",
    multiplier: 3.5,
  },
  {
    id: "optimal",
    title: "Оптимум",
    icon: "/icons/medium.png",
    overlayIcon: "/icons/gold1.png",
    description: "Лучшее соотношение цены и качества",
    multiplier: 1.8,
  },
  {
    id: "budget",
    title: "Бюджет",
    icon: "/icons/budget.png",
    overlayIcon: "/icons/wallet1.png",
    description: "Типовой ремонт, базовые материалы",
    multiplier: 1,
  },
];

const INTERIOR_STYLES = [
  { id: 'loft', label: 'Лофт', image: '/images/loft.jpg', description: 'Кирпич, бетон, открытые коммуникации' },
  { id: 'classic', label: 'Классика', image: '/images/classic.jpg', description: 'Лепнина, симметрия, пастельные тона' },
  { id: 'modern', label: 'Современный', image: '/images/modern.jpg', description: 'Минимализм, функциональность, свет' },
];

// --- Components ---

const StepHero = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-fade-in">
    <h1 className="text-4xl md:text-6xl font-bold text-[#856c45]">
      Создай пространство<br />своей мечты
    </h1>
    <p className="text-gray-600 text-lg max-w-xl">
      Пройди короткий путь от идеи до готового дизайн-проекта и сметы.
    </p>
    <button
      onClick={onStart}
      className="group flex items-center gap-2 px-8 py-4 bg-[#856c45] text-white rounded-full text-xl font-semibold shadow-lg hover:bg-[#6b5636] transition-all hover:scale-105"
    >
      Начать создание
      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

const StepStyle = ({ selectedStyle, onSelect }: { selectedStyle: string | null, onSelect: (id: string) => void }) => (
  <div className="flex flex-col items-center w-full animate-fade-in">
    <h2 className="text-2xl font-bold text-[#856c45] mb-8">Выберите стиль интерьера</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      {INTERIOR_STYLES.map((style) => (
        <div
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
            selectedStyle === style.id
              ? 'border-[#856c45] shadow-xl scale-105'
              : 'border-gray-200 hover:border-[#856c45]/50'
          }`}
        >
          <div className="h-48 bg-gray-200 relative">
            {/* Placeholder for images */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              [Изображение {style.label}]
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="font-bold text-lg mb-1">{style.label}</h3>
            <p className="text-xs text-gray-500">{style.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StepProperty = ({ 
  selectedType, 
  onSelectType,
  area,
  setArea
}: { 
  selectedType: string[], 
  onSelectType: (id: string) => void,
  area: number,
  setArea: (val: number) => void
}) => (
  <div className="flex flex-col items-center w-full max-w-2xl animate-fade-in space-y-12">
    
    {/* Property Type */}
    <div className="w-full text-center">
      <h2 className="text-2xl font-bold text-[#856c45] mb-6">Тип недвижимости</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={`px-6 py-3 rounded-xl border transition-all duration-200 font-medium text-lg ${
              selectedType.includes(type.id)
                ? "bg-[#856c45] text-white border-[#856c45] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#856c45]"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>

    {/* Area Slider */}
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-700">Площадь</h3>
        <span className="text-2xl font-bold text-[#856c45]">{area} м²</span>
      </div>
      <input
        type="range"
        min="20"
        max="300"
        step="1"
        value={area}
        onChange={(e) => setArea(Number(e.target.value))}
        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#856c45]"
      />
      <div className="flex justify-between text-sm text-gray-400 mt-2">
        <span>20 м²</span>
        <span>300 м²</span>
      </div>
    </div>

  </div>
);

const StepRooms = ({ selectedRooms, onToggle }: { selectedRooms: string[], onToggle: (id: string) => void }) => (
  <div className="flex flex-col items-center w-full max-w-4xl animate-fade-in">
    <h2 className="text-2xl font-bold text-[#856c45] mb-8">Какие помещения ремонтируем?</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {ROOMS.map((room) => (
        <button
          key={room.id}
          onClick={() => onToggle(room.id)}
          className={`px-5 py-2.5 rounded-full border transition-all duration-200 text-sm md:text-base font-medium ${
            selectedRooms.includes(room.id)
              ? "bg-[#856c45] text-white border-[#856c45] shadow-md transform scale-105"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#856c45] hover:text-[#856c45]"
          }`}
        >
          {room.label}
        </button>
      ))}
    </div>
  </div>
);

const StepResult = ({ plans }: { plans: any[] }) => (
  <div className="flex flex-col items-center w-full animate-fade-in">
    <h2 className="text-3xl font-bold text-[#856c45] mb-2">Ваш предварительный расчет</h2>
    <p className="text-gray-500 mb-10">Мы подготовили три варианта реализации</p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-7xl">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="flex flex-col items-center p-6 border border-gray-200 rounded-2xl hover:border-[#856c45]/50 transition-colors bg-white shadow-sm hover:shadow-xl"
        >
          <div className="relative w-64 h-64 mb-6">
            <Image
              src={plan.icon}
              alt={plan.title}
              fill
              className="object-contain"
            />
            <div className="absolute top-2 right-2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
              <div className="relative w-5 h-5">
                <Image
                  src={plan.overlayIcon}
                  alt="badge"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-[#856c45]">{plan.title}</h2>
          <p className="text-gray-600 text-center text-sm mb-6 min-h-[40px]">
            {plan.description}
          </p>
          <div className="w-full space-y-3 bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Срок</span>
              <span className="font-bold text-gray-800">{plan.time}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Бюджет</span>
              <span className="font-bold text-[#856c45] text-lg">{plan.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <button className="mt-12 px-10 py-4 bg-green-600 text-white rounded-full font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2">
       Получить детальную смету в Telegram
    </button>
  </div>
);

// --- Main Wizard Component ---

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['hallway', 'kitchen', 'living', 'bathroom']);
  const [selectedProperties, setSelectedProperties] = useState<string[]>(['apartment']);
  const [area, setArea] = useState<number>(60);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const totalSteps = 5;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleRoom = (roomId: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  const toggleProperty = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const calculatedPlans = useMemo(() => {
    let baseCost = 0;
    let baseDays = 0;

    selectedRooms.forEach(roomId => {
      const room = ROOMS.find(r => r.id === roomId);
      if (room) {
        baseCost += room.cost;
        baseDays += room.days;
      }
    });

    let totalMultiplier = 0;
    if (selectedProperties.length === 0) {
      totalMultiplier = 1;
    } else {
      selectedProperties.forEach(propId => {
        const prop = PROPERTY_TYPES.find(p => p.id === propId);
        if (prop) {
          totalMultiplier += prop.multiplier;
        }
      });
    }

    const adjustedBaseCost = baseCost * totalMultiplier * (area / 60);
    const adjustedBaseDays = baseDays * totalMultiplier * (1 + (area - 60) / 200);

    return BASE_PLANS.map(plan => {
      const totalCost = adjustedBaseCost * plan.multiplier;
      const totalDays = adjustedBaseDays * plan.multiplier;

      const priceStr = totalCost > 0 
        ? (totalCost >= 1000000 
            ? `${(totalCost / 1000000).toFixed(1)} млн ₽` 
            : `${Math.round(totalCost).toLocaleString('ru-RU')} ₽`)
        : "0 ₽";

      let timeStr = "";
      if (totalDays === 0) {
        timeStr = "0 дней";
      } else if (totalDays < 7) {
        timeStr = `${Math.ceil(totalDays)} дн.`;
      } else if (totalDays < 30) {
        const weeks = Math.ceil(totalDays / 7);
        timeStr = `${weeks} нед.`;
      } else {
        const months = Math.ceil(totalDays / 30);
        timeStr = `${months} мес.`;
      }

      return { ...plan, price: priceStr, time: timeStr };
    });
  }, [selectedRooms, selectedProperties, area]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-[#fdfbf7] text-gray-900 relative overflow-hidden">
      
      {/* Progress Bar (hidden on Hero) */}
      {step > 1 && (
        <div className="w-full max-w-xl h-1.5 bg-gray-200 rounded-full mt-8 mb-8 mx-4">
          <div 
            className="h-full bg-[#856c45] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      )}

      <div className="w-full max-w-6xl px-4 flex-grow flex flex-col items-center justify-center pb-24">
        {step === 1 && <StepHero onStart={nextStep} />}
        {step === 2 && <StepStyle selectedStyle={selectedStyle} onSelect={(id) => { setSelectedStyle(id); }} />}
        {step === 3 && <StepProperty selectedType={selectedProperties} onSelectType={toggleProperty} area={area} setArea={setArea} />}
        {step === 4 && <StepRooms selectedRooms={selectedRooms} onToggle={toggleRoom} />}
        {step === 5 && <StepResult plans={calculatedPlans} />}
      </div>

      {/* Navigation Buttons (Bottom Fixed for Mobile) */}
      {step > 1 && (
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 flex justify-between items-center z-50">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 font-medium hover:text-[#856c45] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </button>
          
          {step < totalSteps && (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-[#856c45] text-white rounded-full font-bold shadow-md hover:bg-[#6b5636] transition-all"
            >
              Далее
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </main>
  );
}
