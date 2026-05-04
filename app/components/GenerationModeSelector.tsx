'use client';

import { useState, useEffect } from 'react';

export type GenerationMode = 'local' | 'remote';

interface GenerationModeSelectorProps {
  onModeChange: (mode: GenerationMode) => void;
  currentMode: GenerationMode;
}

export function GenerationModeSelector({ onModeChange, currentMode }: GenerationModeSelectorProps) {
  const [mode, setMode] = useState<GenerationMode>(currentMode);

  useEffect(() => {
    // Load saved mode from localStorage
    const savedMode = localStorage.getItem('generationMode') as GenerationMode;
    if (savedMode && (savedMode === 'local' || savedMode === 'remote')) {
      setMode(savedMode);
      onModeChange(savedMode);
    }
  }, []);

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);
    localStorage.setItem('generationMode', newMode);
    onModeChange(newMode);
  };

  return (
    <div className="bg-white rounded-xl border border-[#e3d3b8] p-4 mb-4">
      <h3 className="text-sm font-medium text-[#856c45] mb-3">Режим генерации</h3>
      <div className="grid grid-cols-2 gap-3">
        <div 
          onClick={() => handleModeChange('local')}
          className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${
            mode === 'local' 
              ? 'bg-[#856c45] text-white' 
              : 'bg-[#f8f1e6] text-[#856c45] hover:bg-[#f0e6d6]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <div className="font-medium text-sm">Локально</div>
            <div className={`text-xs ${mode === 'local' ? 'text-white/80' : 'text-[#856c45]/70'}`}>Ваш ComfyUI</div>
          </div>
        </div>

        <div 
          onClick={() => handleModeChange('remote')}
          className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${
            mode === 'remote' 
              ? 'bg-[#856c45] text-white' 
              : 'bg-[#f8f1e6] text-[#856c45] hover:bg-[#f0e6d6]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <div>
            <div className="font-medium text-sm">Удаленно</div>
            <div className={`text-xs ${mode === 'remote' ? 'text-white/80' : 'text-[#856c45]/70'}`}>Облачный API</div>
          </div>
        </div>
      </div>

      {mode === 'local' && (
        <div className="mt-3 p-2 bg-[#f8f1e6] rounded text-xs text-[#856c45]">
          <strong>Локальный режим:</strong> Используется ComfyUI на вашем компьютере (http://127.0.0.1:8188)
        </div>
      )}

      {mode === 'remote' && (
        <div className="mt-3 p-2 bg-[#f8f1e6] rounded text-xs text-[#856c45]">
          <strong>Удаленный режим:</strong> Используется облачный API для генерации
        </div>
      )}
    </div>
  );
}

export default GenerationModeSelector;
