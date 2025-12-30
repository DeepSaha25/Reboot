import { useState, useEffect, useCallback } from 'react';

export interface StreakData {
  addictionType: string;
  startDate: string;
  currentStreak: number;
  bestStreak: number;
  lastCheckIn: string | null;
  totalRelapses: number;
  history: {
    date: string;
    type: 'start' | 'relapse' | 'milestone';
    note?: string;
  }[];
}

const STORAGE_KEY = 'reboot_streak_data';

const calculateDaysBetween = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const useStreak = (addictionType: string = 'default') => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load streak data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const allData = JSON.parse(stored) as Record<string, StreakData>;
          if (allData[addictionType]) {
            // Calculate current streak based on start date
            const data = allData[addictionType];
            const today = new Date().toISOString().split('T')[0];
            const currentStreak = calculateDaysBetween(data.startDate, today);
            setStreakData({
              ...data,
              currentStreak,
              bestStreak: Math.max(data.bestStreak, currentStreak),
            });
          }
        }
      } catch (error) {
        console.error('Error loading streak data:', error);
      }
      setIsLoading(false);
    };
    loadData();
  }, [addictionType]);

  // Save streak data to localStorage
  const saveData = useCallback((data: StreakData) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allData = stored ? JSON.parse(stored) : {};
      allData[addictionType] = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  }, [addictionType]);

  // Start a new streak
  const startStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const newData: StreakData = {
      addictionType,
      startDate: today,
      currentStreak: 0,
      bestStreak: streakData?.bestStreak || 0,
      lastCheckIn: today,
      totalRelapses: streakData?.totalRelapses || 0,
      history: [
        ...(streakData?.history || []),
        { date: today, type: 'start' },
      ],
    };
    setStreakData(newData);
    saveData(newData);
  }, [addictionType, streakData, saveData]);

  // Record a relapse (gentle, non-punishing)
  const recordRelapse = useCallback((trigger?: string, feeling?: string) => {
    if (!streakData) return;

    const today = new Date().toISOString().split('T')[0];
    const newData: StreakData = {
      ...streakData,
      startDate: today,
      currentStreak: 0,
      totalRelapses: streakData.totalRelapses + 1,
      lastCheckIn: today,
      history: [
        ...streakData.history,
        {
          date: today,
          type: 'relapse',
          note: trigger ? `Trigger: ${trigger}. Feeling: ${feeling || 'Not specified'}` : undefined,
        },
      ],
    };
    setStreakData(newData);
    saveData(newData);
  }, [streakData, saveData]);

  // Record a milestone
  const recordMilestone = useCallback((milestone: string) => {
    if (!streakData) return;

    const today = new Date().toISOString().split('T')[0];
    const newData: StreakData = {
      ...streakData,
      lastCheckIn: today,
      history: [
        ...streakData.history,
        { date: today, type: 'milestone', note: milestone },
      ],
    };
    setStreakData(newData);
    saveData(newData);
  }, [streakData, saveData]);

  // Check if user has reached a milestone
  const getMilestone = useCallback((): string | null => {
    if (!streakData) return null;
    const { currentStreak } = streakData;
    
    const milestones = [
      { days: 1, label: '1 Day' },
      { days: 3, label: '3 Days' },
      { days: 7, label: '1 Week' },
      { days: 14, label: '2 Weeks' },
      { days: 30, label: '1 Month' },
      { days: 60, label: '2 Months' },
      { days: 90, label: '3 Months' },
      { days: 180, label: '6 Months' },
      { days: 365, label: '1 Year' },
    ];

    const reached = milestones.find(m => m.days === currentStreak);
    return reached?.label || null;
  }, [streakData]);

  return {
    streakData,
    isLoading,
    startStreak,
    recordRelapse,
    recordMilestone,
    getMilestone,
    hasActiveStreak: !!streakData,
  };
};

export default useStreak;
