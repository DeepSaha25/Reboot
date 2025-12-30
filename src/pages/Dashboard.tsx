import { useState, useEffect } from 'react';
import { Flame, BookOpen, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SoberCounter } from '@/components/SoberCounter';
import { LessonCard } from '@/components/LessonCard';
import { CravingModal } from '@/components/CravingModal';
import { BottomNav } from '@/components/BottomNav';
import { useStreak } from '@/hooks/useStreak';
import { useCraving } from '@/hooks/useCraving';
import { LESSON_TOPICS, MOTIVATIONAL_MESSAGES, ADDICTION_TYPES } from '@/utils/constants';

export const Dashboard = () => {
  const { streakData, hasActiveStreak, recordRelapse } = useStreak();
  const { isModalOpen, openCravingModal, closeCravingModal, logCraving, getTodayCravings } = useCraving();
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [todayGoal] = useState('Take 3 deep breaths when you feel a craving');

  // Get random motivational message on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    setMotivationalMessage(MOTIVATIONAL_MESSAGES[randomIndex]);
  }, []);

  // Calculate time and money saved (example for smoking)
  const getTimeSaved = () => {
    if (!streakData) return null;
    // Assume 10 min per session, 5 sessions/day
    const minutesSaved = streakData.currentStreak * 50;
    const hours = Math.floor(minutesSaved / 60);
    return hours > 0 ? `${hours}h` : `${minutesSaved}m`;
  };

  const getMoneySaved = () => {
    if (!streakData) return null;
    // Rough estimate: $10/day saved
    const saved = streakData.currentStreak * 10;
    return saved > 0 ? `$${saved}` : null;
  };

  const handleCravingComplete = (overcame: boolean, notes?: string) => {
    logCraving({
      intensity: 5,
      overcame,
      notes,
    });

    if (!overcame && streakData) {
      recordRelapse(notes);
    }

    closeCravingModal();
  };

  const getAddictionLabel = () => {
    if (!streakData) return 'Clean';
    const addiction = ADDICTION_TYPES.find(a => a.id === streakData.addictionType);
    return addiction ? 'free' : 'clean';
  };

  const todayCravings = getTodayCravings();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl safe-area-inset-top">
        <div className="flex items-center justify-between h-14 px-4">
          <div>
            <h1 className="text-lg font-bold text-foreground">REBOOT</h1>
          </div>
          <div className="flex items-center gap-2">
            {todayCravings.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {todayCravings.filter(c => c.overcame).length}/{todayCravings.length} cravings overcome
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Motivational message */}
        <div className="text-center animate-fade-in">
          <p className="text-muted-foreground italic">"{motivationalMessage}"</p>
        </div>

        {/* Sober Counter */}
        <div className="flex justify-center py-4 animate-slide-up">
          <SoberCounter
            currentStreak={streakData?.currentStreak || 0}
            bestStreak={streakData?.bestStreak || 0}
            addictionLabel={getAddictionLabel()}
          />
        </div>

        {/* Emergency Craving Button */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Button
            onClick={openCravingModal}
            variant="emergency"
            size="xl"
            className="w-full max-w-xs"
          >
            <Flame className="w-6 h-6" />
            I'M CRAVING
          </Button>
        </div>

        {/* Stats Row */}
        {hasActiveStreak && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {getTimeSaved() && (
              <div className="p-4 bg-card rounded-2xl border border-border">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">Time Saved</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{getTimeSaved()}</p>
              </div>
            )}
            {getMoneySaved() && (
              <div className="p-4 bg-card rounded-2xl border border-border">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-medium">Money Saved</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{getMoneySaved()}</p>
              </div>
            )}
          </div>
        )}

        {/* Today's Micro-goal */}
        <div className="p-4 bg-card rounded-2xl border border-border animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 text-foreground mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-medium">Today's Goal</span>
          </div>
          <p className="text-muted-foreground">{todayGoal}</p>
        </div>

        {/* Reset Streak Button (Requested Feature) */}
        <div className="flex justify-center pt-2 pb-4 animate-fade-in" style={{ animationDelay: '350ms' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to reset your streak? This cannot be undone.')) {
                recordRelapse('Manual Reset');
              }
            }}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            Reset Streak
          </Button>
        </div>

        {/* Next Lesson */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Continue Learning</span>
            </div>
          </div>
          <LessonCard
            title={LESSON_TOPICS[0].title}
            description={LESSON_TOPICS[0].description}
            duration={LESSON_TOPICS[0].duration}
            category={LESSON_TOPICS[0].category}
          />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Craving Modal */}
      <CravingModal
        isOpen={isModalOpen}
        onClose={closeCravingModal}
        onComplete={handleCravingComplete}
      />
    </div>
  );
};

export default Dashboard;
