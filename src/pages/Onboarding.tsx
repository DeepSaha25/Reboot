import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useStreak } from '@/hooks/useStreak';
import { ADDICTION_TYPES, COMMON_TRIGGERS } from '@/utils/constants';

export const Onboarding = () => {
  const navigate = useNavigate();
  const { profile, saveProfile, addAddiction, completeOnboarding, currentStep, nextStep, prevStep } = useOnboarding();
  const { startStreak } = useStreak();
  
  const [selectedAddiction, setSelectedAddiction] = useState<string>('');
  const [customAddiction, setCustomAddiction] = useState('');
  const [quitGoal, setQuitGoal] = useState<'reduce' | 'stop'>('stop');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [privacyLevel, setPrivacyLevel] = useState<'anonymous' | 'named'>('anonymous');

  const totalSteps = 5;

  const handleComplete = () => {
    // Save addiction data
    const addictionType = selectedAddiction === 'custom' ? customAddiction : selectedAddiction;
    addAddiction({
      type: addictionType,
      customName: selectedAddiction === 'custom' ? customAddiction : undefined,
      quitGoal,
      triggers: selectedTriggers,
      startDate: new Date().toISOString().split('T')[0],
    });
    
    // Save privacy level
    saveProfile({ privacyLevel });
    
    // Start streak
    startStreak();
    
    // Complete onboarding
    completeOnboarding();
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const toggleTrigger = (triggerId: string) => {
    setSelectedTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(t => t !== triggerId)
        : [...prev, triggerId]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedAddiction !== '' && (selectedAddiction !== 'custom' || customAddiction.trim() !== '');
      case 2: return quitGoal !== null;
      case 3: return selectedTriggers.length > 0;
      case 4: return privacyLevel !== null;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      {currentStep > 0 && (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl safe-area-inset-top">
          <div className="h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={prevStep}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-sm text-muted-foreground">
              {currentStep} of {totalSteps}
            </span>
            <div className="w-10" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* Step 0: Welcome */}
        {currentStep === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="mb-8">
              <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                REBOOT
              </h1>
              <p className="text-xl text-primary font-medium mb-4">
                Break the habit. Rebuild yourself.
              </p>
              <p className="text-muted-foreground max-w-xs mx-auto">
                A calm, judgment-free space to help you overcome any addiction—at your own pace.
              </p>
            </div>

            <div className="w-full max-w-xs space-y-4">
              <Button onClick={nextStep} size="xl" className="w-full">
                Begin Your Journey
                <ChevronRight className="w-5 h-5" />
              </Button>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                100% private. Your data stays on your device.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Choose Addiction */}
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col animate-fade-in pt-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What would you like to quit?
              </h2>
              <p className="text-muted-foreground">
                Choose what you're working on. You can add more later.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-24">
              {ADDICTION_TYPES.map((addiction) => (
                <button
                  key={addiction.id}
                  onClick={() => setSelectedAddiction(addiction.id)}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-200 ${
                    selectedAddiction === addiction.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-muted-foreground/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedAddiction === addiction.id ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    <span className="text-xl">
                      {addiction.id === 'phone' && '📱'}
                      {addiction.id === 'smoking' && '🚬'}
                      {addiction.id === 'alcohol' && '🍷'}
                      {addiction.id === 'porn' && '🔞'}
                      {addiction.id === 'gaming' && '🎮'}
                      {addiction.id === 'streaming' && '📺'}
                      {addiction.id === 'food' && '🍪'}
                      {addiction.id === 'caffeine' && '☕'}
                      {addiction.id === 'custom' && '➕'}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">{addiction.label}</span>
                </button>
              ))}

              {selectedAddiction === 'custom' && (
                <input
                  type="text"
                  value={customAddiction}
                  onChange={(e) => setCustomAddiction(e.target.value)}
                  placeholder="Describe your habit..."
                  className="w-full p-4 bg-card border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
              <Button 
                onClick={nextStep} 
                disabled={!canProceed()}
                size="lg" 
                className="w-full"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Quit Goal */}
        {currentStep === 2 && (
          <div className="flex-1 flex flex-col animate-fade-in pt-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What's your goal?
              </h2>
              <p className="text-muted-foreground">
                There's no wrong answer. Be honest with yourself.
              </p>
            </div>

            <div className="space-y-4 flex-1">
              <button
                onClick={() => setQuitGoal('stop')}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                  quitGoal === 'stop'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <h3 className="text-lg font-semibold text-foreground mb-1">Stop completely</h3>
                <p className="text-muted-foreground text-sm">
                  I want to quit this habit for good.
                </p>
              </button>

              <button
                onClick={() => setQuitGoal('reduce')}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                  quitGoal === 'reduce'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <h3 className="text-lg font-semibold text-foreground mb-1">Reduce gradually</h3>
                <p className="text-muted-foreground text-sm">
                  I want to cut back and regain control.
                </p>
              </button>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
              <Button 
                onClick={nextStep} 
                disabled={!canProceed()}
                size="lg" 
                className="w-full"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Triggers */}
        {currentStep === 3 && (
          <div className="flex-1 flex flex-col animate-fade-in pt-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What triggers your cravings?
              </h2>
              <p className="text-muted-foreground">
                Select all that apply. This helps us support you better.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
              <div className="grid grid-cols-2 gap-3">
                {COMMON_TRIGGERS.map((trigger) => (
                  <button
                    key={trigger.id}
                    onClick={() => toggleTrigger(trigger.id)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${
                      selectedTriggers.includes(trigger.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-muted-foreground/30'
                    }`}
                  >
                    <span className="text-2xl">
                      {trigger.id === 'stress' && '⚡'}
                      {trigger.id === 'boredom' && '😐'}
                      {trigger.id === 'loneliness' && '💭'}
                      {trigger.id === 'anxiety' && '😰'}
                      {trigger.id === 'sadness' && '😢'}
                      {trigger.id === 'anger' && '😤'}
                      {trigger.id === 'tiredness' && '😴'}
                      {trigger.id === 'celebration' && '🎉'}
                      {trigger.id === 'social' && '👥'}
                      {trigger.id === 'morning' && '🌅'}
                      {trigger.id === 'night' && '🌙'}
                      {trigger.id === 'work' && '💼'}
                    </span>
                    <span className="text-sm font-medium text-foreground">{trigger.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
              <Button 
                onClick={nextStep} 
                disabled={!canProceed()}
                size="lg" 
                className="w-full"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Privacy */}
        {currentStep === 4 && (
          <div className="flex-1 flex flex-col animate-fade-in pt-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Your privacy matters
              </h2>
              <p className="text-muted-foreground">
                Choose how you want to appear in the community.
              </p>
            </div>

            <div className="space-y-4 flex-1">
              <button
                onClick={() => setPrivacyLevel('anonymous')}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                  privacyLevel === 'anonymous'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Stay anonymous</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  You'll appear as "<span className="text-foreground">{profile.anonymousName}</span>" in the community.
                </p>
              </button>

              <button
                onClick={() => setPrivacyLevel('named')}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                  privacyLevel === 'named'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <h3 className="text-lg font-semibold text-foreground mb-1">Use my name</h3>
                <p className="text-muted-foreground text-sm">
                  Share your real name with accountability buddies.
                </p>
              </button>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
              <Button 
                onClick={nextStep}
                size="lg" 
                className="w-full"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Ready */}
        {currentStep === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="mb-8">
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto animate-pulse-soft">
                <span className="text-6xl">🌱</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                You're ready to begin
              </h2>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Every journey starts with a single step. Today is Day 1 of your new chapter.
              </p>
            </div>

            <div className="w-full max-w-xs space-y-4">
              <Button onClick={handleComplete} size="xl" className="w-full">
                Start Day 1
                <Sparkles className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
