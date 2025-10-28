import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Watermark } from '@/types';

interface WatermarkContextType {
  watermarks: Watermark[];
  activeWatermark: string | null;
  addWatermark: (watermark: Omit<Watermark, 'id'>) => string;
  removeWatermark: (id: string) => void;
  updateWatermark: (id: string, updates: Partial<Watermark>) => void;
  setActiveWatermark: (id: string | null) => void;
  getActiveWatermark: () => Watermark | null;
}

const WatermarkContext = createContext<WatermarkContextType | undefined>(undefined);

export const useWatermark = () => {
  const context = useContext(WatermarkContext);
  if (!context) {
    throw new Error('useWatermark must be used within WatermarkProvider');
  }
  return context;
};

interface WatermarkProviderProps {
  children: ReactNode;
}

export const WatermarkProvider: React.FC<WatermarkProviderProps> = ({ children }) => {
  const [watermarks, setWatermarks] = useState<Watermark[]>([]);
  const [activeWatermark, setActiveWatermark] = useState<string | null>(null);

  const addWatermark = useCallback((watermark: Omit<Watermark, 'id'>) => {
    const id = `wm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newWatermark: Watermark = { ...watermark, id };
    
    setWatermarks((prev) => [...prev, newWatermark]);
    return id;
  }, []);

  const removeWatermark = useCallback((id: string) => {
    setWatermarks((prev) => prev.filter((w) => w.id !== id));
    if (activeWatermark === id) {
      setActiveWatermark(null);
    }
  }, [activeWatermark]);

  const updateWatermark = useCallback((id: string, updates: Partial<Watermark>) => {
    setWatermarks((prev) =>
      prev.map((watermark) =>
        watermark.id === id ? { ...watermark, ...updates } : watermark
      )
    );
  }, []);

  const getActiveWatermark = useCallback(() => {
    return watermarks.find((w) => w.id === activeWatermark) || null;
  }, [watermarks, activeWatermark]);

  return (
    <WatermarkContext.Provider
      value={{
        watermarks,
        activeWatermark,
        addWatermark,
        removeWatermark,
        updateWatermark,
        setActiveWatermark,
        getActiveWatermark,
      }}
    >
      {children}
    </WatermarkContext.Provider>
  );
};
