import { useState, useCallback } from 'react';

export interface CravingEntry {
  id: string;
  timestamp: string;
  intensity: number; // 1-10
  trigger?: string;
  overcame: boolean;
  technique?: string;
  notes?: string;
}

const STORAGE_KEY = 'reboot_craving_log';

export const useCraving = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'breathing' | 'grounding' | 'journal' | 'complete'>('breathing');

  // Log a craving
  const logCraving = useCallback((entry: Omit<CravingEntry, 'id' | 'timestamp'>) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const entries: CravingEntry[] = stored ? JSON.parse(stored) : [];
      
      const newEntry: CravingEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...entry,
      };
      
      entries.push(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      
      return newEntry;
    } catch (error) {
      console.error('Error logging craving:', error);
      return null;
    }
  }, []);

  // Get craving history
  const getCravingHistory = useCallback((): CravingEntry[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting craving history:', error);
      return [];
    }
  }, []);

  // Get today's cravings
  const getTodayCravings = useCallback((): CravingEntry[] => {
    const today = new Date().toISOString().split('T')[0];
    return getCravingHistory().filter(entry => 
      entry.timestamp.startsWith(today)
    );
  }, [getCravingHistory]);

  // Open emergency craving modal
  const openCravingModal = useCallback(() => {
    setCurrentPhase('breathing');
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeCravingModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentPhase('breathing');
  }, []);

  // Move to next phase
  const nextPhase = useCallback(() => {
    setCurrentPhase(prev => {
      switch (prev) {
        case 'breathing': return 'grounding';
        case 'grounding': return 'journal';
        case 'journal': return 'complete';
        default: return 'breathing';
      }
    });
  }, []);

  // Get stats
  const getStats = useCallback(() => {
    const history = getCravingHistory();
    const overcome = history.filter(e => e.overcame).length;
    const total = history.length;
    
    return {
      total,
      overcome,
      successRate: total > 0 ? Math.round((overcome / total) * 100) : 0,
      averageIntensity: total > 0 
        ? Math.round(history.reduce((sum, e) => sum + e.intensity, 0) / total * 10) / 10 
        : 0,
    };
  }, [getCravingHistory]);

  return {
    isModalOpen,
    currentPhase,
    openCravingModal,
    closeCravingModal,
    nextPhase,
    logCraving,
    getCravingHistory,
    getTodayCravings,
    getStats,
  };
};

export default useCraving;
