"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  ArrowRight,
} from "lucide-react";
import { getFeatureOptions, getLightOptions } from './lib/features';

const STEPS = [
  { id: 1, title: 'Стиль интерьера' },
  { id: 2, title: 'Примеры' },
];

const STYLE_CARDS = [
  {
    id: 'neoclassic',
    title: 'Неоклассика',
    description: 'Элегантность классики в современном прочтении. Благородные фактуры, симметрия и изысканный декор.',
    icon: '/icons/neo.png',
  },
  {
    id: 'eco',
    title: 'Джапанди и Эко-стиль',
    description: 'Природные материалы, зелёные акценты и спокойная палитра. Тёплый свет, живые фактуры и ощущение "дома в природе".',
    icon: '/icons/jap.png',
  },
  {
    id: 'scandinavian',
    title: 'Скандинавский интерьер',
    description: 'Светлый воздух, натуральное дерево и чистые линии. Максимум уюта при минимуме деталей.',
    icon: '/icons/scandinavian_interior.png',
  }
];

const ROOM_EXAMPLES = [
  { 
    id: 'kitchen', 
    title: 'Кухня', 
    description: 'Современная и функциональная',
    icon: '/icons/kitchen.png',
  },
  { 
    id: 'living', 
    title: 'Гостиная', 
    description: 'Уютная зона для отдыха',
    icon: '/icons/gostinaya.png',
  },
  { 
    id: 'bathroom', 
    title: 'Ванная', 
    description: 'Уютная и расслабляющая',
    icon: '/icons/vanna.png',
  },
  { 
    id: 'bedroom', 
    title: 'Спальня', 
    description: 'Тихая и комфортная',
    icon: '/icons/spalna.png',
  }
];

const STYLE_SETTINGS = {
  brightness: {
    label: 'Яркость',
    options: [
      { id: 'dim', label: 'Приглуш.' },
      { id: 'normal', label: 'Норма' },
      { id: 'bright', label: 'Ярко' }
    ]
  },
  contrast: {
    label: 'Контраст',
    options: [
      { id: 'soft', label: 'Мягкий' },
      { id: 'natural', label: 'Естеств.' },
      { id: 'high', label: 'Высокий' }
    ]
  },
  lighting: {
    label: 'Освещение',
    options: [
      { id: 'warm', label: 'Теплое' },
      { id: 'neutral', label: 'Нейтр.' },
      { id: 'cool', label: 'Холодное' }
    ]
  },
  palette: {
    label: 'Палитра',
    options: [
      { id: 'mono', label: 'Моно' },
      { id: 'pastel', label: 'Пастель' },
      { id: 'rich', label: 'Насыщ.' }
    ]
  },
  time: {
    label: 'Время суток',
    options: [
      { id: 'morning', label: 'Утро' },
      { id: 'day', label: 'День' },
      { id: 'evening', label: 'Ночь' }
    ]
  }
};

const ZODIAC_SIGNS = [
  { name: 'Козерог', symbol: '♑', start: { m: 12, d: 22 }, end: { m: 1, d: 19 }, vibe: 'Статусный и строгий' },
  { name: 'Водолей', symbol: '♒', start: { m: 1, d: 20 }, end: { m: 2, d: 18 }, vibe: 'Футуристичный и легкий' },
  { name: 'Рыбы', symbol: '♓', start: { m: 2, d: 19 }, end: { m: 3, d: 20 }, vibe: 'Мечтательный и мягкий' },
  { name: 'Овен', symbol: '♈', start: { m: 3, d: 21 }, end: { m: 4, d: 19 }, vibe: 'Динамичный и смелый' },
  { name: 'Телец', symbol: '♉', start: { m: 4, d: 20 }, end: { m: 5, d: 20 }, vibe: 'Уютный и тактильный' },
  { name: 'Близнецы', symbol: '♊', start: { m: 5, d: 21 }, end: { m: 6, d: 20 }, vibe: 'Воздушный и эклектичный' },
  { name: 'Рак', symbol: '♋', start: { m: 6, d: 21 }, end: { m: 7, d: 22 }, vibe: 'Домашний и спокойный' },
  { name: 'Лев', symbol: '♌', start: { m: 7, d: 23 }, end: { m: 8, d: 22 }, vibe: 'Роскошный и театральный' },
  { name: 'Дева', symbol: '♍', start: { m: 8, d: 23 }, end: { m: 9, d: 22 }, vibe: 'Лаконичный и упорядоченный' },
  { name: 'Весы', symbol: '♎', start: { m: 9, d: 23 }, end: { m: 10, d: 22 }, vibe: 'Гармоничный и изящный' },
  { name: 'Скорпион', symbol: '♏', start: { m: 10, d: 23 }, end: { m: 11, d: 21 }, vibe: 'Таинственный и глубокий' },
  { name: 'Стрелец', symbol: '♐', start: { m: 11, d: 22 }, end: { m: 12, d: 21 }, vibe: 'Свободный и этнический' }
];

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFamilySize, setSelectedFamilySize] = useState<string>('kitchen');
  const [selectedWizardStyle, setSelectedWizardStyle] = useState<string>('neoclassic');
  const [styleConfig, setStyleConfig] = useState({
    brightness: 'normal',
    contrast: 'natural',
    lighting: 'neutral',
    palette: 'pastel',
    time: 'day',
    zodiac: ''
  });

  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({
    kitchen: [],
    living: [],
    bathroom: [],
    bedroom: []
  });
  const [selectedLightFeatures, setSelectedLightFeatures] = useState<Record<string, string[]>>({
    kitchen: [],
    living: [],
    bathroom: [],
    bedroom: []
  });
  const [showSettings, setShowSettings] = useState(false);
  const [step3SettingsMode, setStep3SettingsMode] = useState<"features" | "light">("features");
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  const toggleFeature = (feature: string) => {
    const currentRoom = selectedFamilySize;
    setSelectedFeatures(prev => {
      const currentList = prev[currentRoom] || [];
      const newList = currentList.includes(feature)
        ? currentList.filter(f => f !== feature)
        : [...currentList, feature];
      return { ...prev, [currentRoom]: newList };
    });
  };

  const toggleLightFeature = (feature: string) => {
    const currentRoom = selectedFamilySize;
    setSelectedLightFeatures(prev => {
      const currentList = prev[currentRoom] || [];
      const newList = currentList.includes(feature)
        ? currentList.filter(f => f !== feature)
        : [...currentList, feature];
      return { ...prev, [currentRoom]: newList };
    });
  };

  const currentItems = useMemo(() => {
    if (currentStep === 1) return STYLE_CARDS;
    return ROOM_EXAMPLES;
  }, [currentStep]);

  const extendedItems = useMemo(() => {
    if (currentItems.length < 2) return currentItems;
    
    const first = { ...currentItems[0], uniqueKey: 'clone-first' };
    const last = { ...currentItems[currentItems.length - 1], uniqueKey: 'clone-last' };
    
    return [last, ...currentItems, first];
  }, [currentItems]);

  const availableFeatures = useMemo(() => {
    return getFeatureOptions(selectedWizardStyle as any, selectedFamilySize as any);
  }, [selectedWizardStyle, selectedFamilySize]);
  const visibleFeatures = useMemo(() => {
    return availableFeatures.slice(0, 9);
  }, [availableFeatures]);

  const availableLightOptions = useMemo(() => {
    return getLightOptions(selectedWizardStyle as any, selectedFamilySize as any);
  }, [selectedWizardStyle, selectedFamilySize]);
  const visibleLightOptions = useMemo(() => {
    return availableLightOptions.slice(0, 9);
  }, [availableLightOptions]);

  useEffect(() => {
    if (carouselRef.current && extendedItems.length > currentItems.length) {
      const container = carouselRef.current;
      
      setTimeout(() => {
        if (!carouselRef.current) return;
        const items = carouselRef.current.children;
        if (items.length > 1) {
          const firstRealItem = items[1] as HTMLElement;
          const centerOffset = (container.clientWidth - firstRealItem.offsetWidth) / 2;
          container.scrollTo({
            left: firstRealItem.offsetLeft - centerOffset,
            behavior: 'instant'
          });
        }
      }, 100);
    }
  }, [extendedItems.length, currentItems.length, currentStep]);

  const handleScroll = () => {
    if (!carouselRef.current || isProgrammaticScroll) return;
    
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const items = Array.from(container.children) as HTMLElement[];
    
    if (items.length <= 1) return;

    const containerCenter = scrollLeft + container.clientWidth / 2;
    
    let minDiff = Infinity;
    let closestIndex = 0;
    
    items.forEach((item, index) => {
      if (index === items.length - 1 && item.classList.contains('spacer')) return;
      
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const diff = Math.abs(itemCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    const visibleItem = extendedItems[closestIndex];
    if (visibleItem) {
      if (currentStep === 1 && visibleItem.id !== selectedWizardStyle) {
        setSelectedWizardStyle(visibleItem.id);
      } else if (currentStep === 2 && visibleItem.id !== selectedFamilySize) {
        setSelectedFamilySize(visibleItem.id);
      }
    }

    if (closestIndex === 0) {
      const realLastIndex = extendedItems.length - 2;
      const targetItem = items[realLastIndex];
      const centerOffset = (container.clientWidth - targetItem.offsetWidth) / 2;
      
      if (Math.abs(container.scrollLeft - (items[0].offsetLeft - centerOffset)) < 10) {
        setIsProgrammaticScroll(true);
        container.scrollTo({
          left: targetItem.offsetLeft - centerOffset,
          behavior: 'instant'
        });
        setTimeout(() => setIsProgrammaticScroll(false), 50);
      }
    } else if (closestIndex === extendedItems.length - 1) {
      const realFirstIndex = 1;
      const targetItem = items[realFirstIndex];
      const centerOffset = (container.clientWidth - targetItem.offsetWidth) / 2;
      
      if (Math.abs(container.scrollLeft - (items[extendedItems.length - 1].offsetLeft - centerOffset)) < 10) {
        setIsProgrammaticScroll(true);
        container.scrollTo({
          left: targetItem.offsetLeft - centerOffset,
          behavior: 'instant'
        });
        setTimeout(() => setIsProgrammaticScroll(false), 50);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'instant' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'instant' });
      }
    }
  };

  const scrollPrev = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const items = Array.from(container.children) as HTMLElement[];
    if (items.length <= 1) return;

    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;
    
    let minDiff = Infinity;
    let closestIndex = 0;
    
    items.forEach((item, index) => {
      if (index === items.length - 1 && item.classList.contains('spacer')) return;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const diff = Math.abs(itemCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    if (closestIndex === 0) {
      const realLastIndex = extendedItems.length - 2;
      const realLast = items[realLastIndex];
      const centerOffset = (container.clientWidth - realLast.offsetWidth) / 2;
      
      setIsProgrammaticScroll(true);
      container.scrollTo({ left: realLast.offsetLeft - centerOffset, behavior: 'instant' });
      
      setTimeout(() => {
        setIsProgrammaticScroll(false);
        const prevIndex = realLastIndex - 1;
        if (prevIndex > 0) {
           const prevItem = items[prevIndex];
           const prevOffset = (container.clientWidth - prevItem.offsetWidth) / 2;
           container.scrollTo({ left: prevItem.offsetLeft - prevOffset, behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    const targetIndex = closestIndex - 1;
    if (targetIndex >= 0) { 
       const targetItem = items[targetIndex];
       const centerOffset = (container.clientWidth - targetItem.offsetWidth) / 2;
       container.scrollTo({
         left: targetItem.offsetLeft - centerOffset,
         behavior: 'smooth'
       });
    }
  };

  const scrollNext = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const items = Array.from(container.children) as HTMLElement[];
    if (items.length <= 1) return;

    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;
    
    let minDiff = Infinity;
    let closestIndex = 0;
    
    items.forEach((item, index) => {
      if (index === items.length - 1 && item.classList.contains('spacer')) return;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const diff = Math.abs(itemCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    if (closestIndex === extendedItems.length - 1) {
      const realFirstIndex = 1;
      const realFirst = items[realFirstIndex];
      const centerOffset = (container.clientWidth - realFirst.offsetWidth) / 2;
      
      setIsProgrammaticScroll(true);
      container.scrollTo({ left: realFirst.offsetLeft - centerOffset, behavior: 'instant' });
      
      setTimeout(() => {
        setIsProgrammaticScroll(false);
        const nextIndex = realFirstIndex + 1;
        if (nextIndex < extendedItems.length - 1) {
           const nextItem = items[nextIndex];
           const nextOffset = (container.clientWidth - nextItem.offsetWidth) / 2;
           container.scrollTo({ left: nextItem.offsetLeft - nextOffset, behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    const targetIndex = closestIndex + 1;
    if (targetIndex < extendedItems.length) { 
       const targetItem = items[targetIndex];
       const centerOffset = (container.clientWidth - targetItem.offsetWidth) / 2;
       container.scrollTo({
         left: targetItem.offsetLeft - centerOffset,
         behavior: 'smooth'
       });
    }
  };

  const handleCardClick = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const items = Array.from(container.children) as HTMLElement[];
    if (index >= items.length) return;

    const clickedItem = extendedItems[index];
    if (clickedItem) {
      if (currentStep === 1 && clickedItem.id !== selectedWizardStyle) {
        setSelectedWizardStyle(clickedItem.id);
      } else if (currentStep === 2 && clickedItem.id !== selectedFamilySize) {
        setSelectedFamilySize(clickedItem.id);
      }
    }

    const targetItem = items[index];
    const centerOffset = (container.clientWidth - targetItem.offsetWidth) / 2;
    
    container.scrollTo({
      left: targetItem.offsetLeft - centerOffset,
      behavior: 'smooth'
    });
  };

  return (
    <main className="flex flex-col items-center justify-start text-gray-900 h-screen max-w-md mx-auto bg-[#fdfbf7] relative overflow-hidden">
      
      {/* Header */}
      <div className="w-full flex justify-between items-center px-4 py-2 z-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold animate-shimmer bg-[linear-gradient(110deg,#856c45,45%,#e3d3b8,55%,#856c45)] bg-[length:200%_100%] bg-clip-text text-transparent">
            Ferma Design
          </h1>
          <span className="text-sm text-gray-500 font-medium">{STEPS[currentStep - 1].title}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#856c45]/10 px-3 py-1.5 rounded-full border border-[#856c45]/20 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#856c45] fill-[#856c45]" />
            <span className="text-xs font-bold text-[#856c45]">5</span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="w-full px-4 mb-2 z-10">
        <div className="flex gap-1 w-full">
          {STEPS.map((step) => (
            <div 
              key={step.id} 
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                step.id <= currentStep ? 'bg-[#856c45]' : 'bg-gray-200'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div 
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-8 h-full items-start pt-0 scrollbar-hide"
      >
        {extendedItems.map((item, index) => {
          let isSelected = false;
          if (currentStep === 1) isSelected = selectedWizardStyle === item.id;
          else isSelected = selectedFamilySize === item.id;
            
          const uniqueKey = (item as any).uniqueKey || item.id;
          
          return (
            <div
              key={`${uniqueKey}-${index}`}
               onClick={() => handleCardClick(index)}
               className={`relative flex-shrink-0 w-[85vw] md:w-[340px] h-[72vh] flex flex-col items-center p-6 border rounded-[32px] transition-all duration-300 snap-center overflow-hidden cursor-pointer active:scale-90
                 ${isSelected 
                   ? 'border-[#856c45] ring-1 ring-[#856c45] scale-95 bg-[#e9e1d2] shadow-inner' 
                  : 'border-gray-200 scale-100 bg-white shadow-xl'
                }`}
            >
              <div className="relative w-full aspect-square mb-3 flex-shrink-0 rounded-[24px] overflow-hidden shadow-sm">
                <img
                  src={(item as any).icon}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              <div className="flex flex-col items-center text-center w-full mt-2 mb-6">
                <h2 className="text-3xl font-bold text-[#856c45] mb-1">{item.title}</h2>
                <p className="text-gray-500 text-base px-4 mb-4">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
        <div className="w-2 flex-shrink-0 spacer" />
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-3 rounded-full shadow-lg text-[#856c45] hover:bg-white transition-all backdrop-blur-sm"
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-3 rounded-full shadow-lg text-[#856c45] hover:bg-white transition-all backdrop-blur-sm"
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>

      
      
      {/* Main Action Button */}
      <div className="fixed bottom-4 left-0 right-0 px-6 flex flex-col items-center gap-3 z-50">
        {(currentStep === 1 || currentStep === 2) && !showSettings && (
          <button
            type="button"
            onClick={() => {
              setStep3SettingsMode("features");
              setShowSettings(true);
            }}
            className="px-12 bg-[#fdfbf7] text-[#856c45] py-3 rounded-[20px] font-bold border border-[#856c45] shadow-md hover:bg-[#fdfbf7]/80 transition-all duration-200 active:scale-95"
          >
            Параметры
          </button>
        )}
        
        {showSettings && (
          <button
            type="button"
            onClick={() => setShowSettings(false)}
            className="px-12 bg-gray-100 text-gray-700 py-3 rounded-[20px] font-medium transition-all duration-200 active:scale-95"
          >
            Закрыть настройки
          </button>
        )}
        
        {currentStep === 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="px-12 bg-[#856c45] text-white py-3 rounded-[20px] font-bold shadow-lg hover:bg-[#7a5a3a] transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            Далее
            <ArrowRight size={16} />
          </button>
        )}
        
        {currentStep === 2 && (
          <div className="relative">
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="bg-white/80 p-3 rounded-full shadow-lg text-[#856c45] hover:bg-white transition-all backdrop-blur-sm absolute left-0 -translate-x-20"
                aria-label="Назад"
              >
                <ChevronLeft size={20} />
              </button>
              <Link 
                href={`/create?plan=budget&style=${selectedWizardStyle}&family=${selectedFamilySize}&brightness=${styleConfig.brightness}&contrast=${styleConfig.contrast}&lighting=${styleConfig.lighting}&palette=${styleConfig.palette}&time=${styleConfig.time}&features=${selectedFeatures[selectedFamilySize]?.join(',')}&lightFeatures=${selectedLightFeatures[selectedFamilySize]?.join(',')}`} 
                className="px-12 bg-[#856c45] text-white py-3 rounded-[20px] font-bold shadow-lg hover:bg-[#7a5a3a] transition-all duration-200 active:scale-95 text-center flex items-center justify-center gap-2"
              >
                Генерация
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Settings Drawer */}
      {(currentStep === 1 || currentStep === 2) && (
        <div className={`fixed inset-x-0 bottom-0 bg-white rounded-t-[32px] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] transition-transform duration-300 z-[60] flex flex-col max-h-[80vh] overflow-y-auto max-w-md mx-auto
          ${showSettings ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div 
            className="w-full flex justify-center pt-3 pb-4 cursor-pointer"
            onClick={() => setShowSettings(!showSettings)}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div className="px-6 pb-24 flex flex-col gap-6">
            {currentStep === 1 ? (
              <>
                {Object.entries(STYLE_SETTINGS).map(([key, setting]) => (
                  <div key={key} className="flex flex-col gap-3">
                    <h3 className="text-base font-bold text-[#856c45]">{setting.label}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {setting.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setStyleConfig(prev => ({ ...prev, [key]: option.id }))}
                          className={`py-2 rounded-xl border transition-all duration-200 text-xs font-medium ${
                            (styleConfig as any)[key] === option.id
                              ? "bg-[#856c45] text-white border-[#856c45] shadow-md"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-[#856c45]">
                    {step3SettingsMode === "light" ? "Свет" : "Детали интерьера"} ({ROOM_EXAMPLES.find(r => r.id === selectedFamilySize)?.title || "Комната"})
                  </h3>
                  <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
                    <button
                      type="button"
                      onClick={() => setStep3SettingsMode("features")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        step3SettingsMode === "features"
                          ? "bg-[#856c45] text-white"
                          : "text-gray-600 hover:bg-white"
                      }`}
                    >
                      Детали
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep3SettingsMode("light")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        step3SettingsMode === "light"
                          ? "bg-[#856c45] text-white"
                          : "text-gray-600 hover:bg-white"
                      }`}
                    >
                      Свет
                    </button>
                  </div>
                </div>

                {step3SettingsMode === "light" ? (
                  availableLightOptions.length ? (
                    <div className="grid grid-cols-3 gap-2">
                      {visibleLightOptions.map((feature) => (
                         <button
                           key={feature.id}
                           type="button"
                           onClick={() => toggleLightFeature(feature.id)}
                           aria-label={feature.label}
                           className={`p-3 rounded-xl border transition-all duration-200 text-left flex flex-col ${
                             (selectedLightFeatures[selectedFamilySize] || []).includes(feature.id)
                               ? "bg-[#e3d3b8] text-[#856c45] border-[#d9c7a8] shadow-md"
                               : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                           }`}
                         >
                           <div className="relative w-full aspect-[1/1] rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                             <Image
                               src={feature.image}
                               alt={feature.label}
                               width={256}
                               height={256}
                               quality={60}
                               unoptimized
                               className="object-contain"
                             />
                           </div>
                          <div className="mt-2 text-[10px] font-semibold leading-tight h-8 overflow-hidden">
                            {feature.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {(["lighting", "time"] as const).map((key) => (
                        <div key={key} className="flex flex-col gap-3">
                          <h3 className="text-base font-bold text-[#856c45]">{STYLE_SETTINGS[key].label}</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {STYLE_SETTINGS[key].options.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setStyleConfig(prev => ({ ...prev, [key]: option.id }))}
                                className={`py-2 rounded-xl border transition-all duration-200 text-xs font-medium ${
                                  (styleConfig as any)[key] === option.id
                                    ? "bg-[#856c45] text-white border-[#856c45] shadow-md"
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {visibleFeatures.map((feature) => (
                         <button
                           key={feature.id}
                           type="button"
                           onClick={() => toggleFeature(feature.id)}
                           aria-label={feature.label}
                           className={`p-3 rounded-xl border transition-all duration-200 text-left flex flex-col ${
                             (selectedFeatures[selectedFamilySize] || []).includes(feature.id)
                               ? "bg-[#e3d3b8] text-[#856c45] border-[#d9c7a8] shadow-md"
                               : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                           }`}
                         >
                           <div className="relative w-full aspect-[1/1] rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                             <Image
                               src={feature.image}
                               alt={feature.label}
                               width={256}
                               height={256}
                               quality={60}
                               unoptimized
                               className="object-contain"
                             />
                           </div>
                          <div className="mt-2 text-[10px] font-semibold leading-tight h-8 overflow-hidden">
                            {feature.label}
                          </div>
                        </button>
                      ))}
                    </div>
                    {!availableFeatures.length && (
                      <div className="text-xs text-gray-500">
                        Для этого стиля скоро добавим подборку деталей.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
