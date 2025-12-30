import { useState, useCallback, useEffect } from 'react';

export interface UserProfile {
  hasCompletedOnboarding: boolean;
  anonymousName: string;
  addictions: {
    type: string;
    customName?: string;
    quitGoal: 'reduce' | 'stop';
    triggers: string[];
    startDate: string;
  }[];
  privacyLevel: 'anonymous' | 'named';
  hasAccountabilityBuddy: boolean;
  buddyContact?: string;
}

const STORAGE_KEY = 'reboot_user_profile';

const generateAnonymousName = (): string => {
  const adjectives = ['Brave', 'Strong', 'Calm', 'Rising', 'Growing', 'Healing', 'Peaceful', 'Hopeful'];
  const nouns = ['Phoenix', 'Warrior', 'Climber', 'Voyager', 'Seeker', 'Pioneer', 'Spirit', 'Soul'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999);
  return `${adj}${noun}${num}`;
};

const defaultProfile: UserProfile = {
  hasCompletedOnboarding: false,
  anonymousName: '',
  addictions: [],
  privacyLevel: 'anonymous',
  hasAccountabilityBuddy: false,
};

export const useOnboarding = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  // Load profile from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        setProfile({
          ...defaultProfile,
          anonymousName: generateAnonymousName(),
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    setIsLoading(false);
  }, []);

  // Save profile
  const saveProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Add addiction
  const addAddiction = useCallback((addiction: UserProfile['addictions'][0]) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        addictions: [...prev.addictions, addiction],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(() => {
    saveProfile({ hasCompletedOnboarding: true });
  }, [saveProfile]);

  // Reset profile (for testing)
  const resetProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('reboot_streak_data');
    localStorage.removeItem('reboot_craving_log');
    setProfile({
      ...defaultProfile,
      anonymousName: generateAnonymousName(),
    });
    setCurrentStep(0);
  }, []);

  // Navigation
  const nextStep = useCallback(() => setCurrentStep(s => s + 1), []);
  const prevStep = useCallback(() => setCurrentStep(s => Math.max(0, s - 1)), []);
  const goToStep = useCallback((step: number) => setCurrentStep(step), []);

  return {
    profile,
    isLoading,
    currentStep,
    saveProfile,
    addAddiction,
    completeOnboarding,
    resetProfile,
    nextStep,
    prevStep,
    goToStep,
  };
};

export default useOnboarding;
