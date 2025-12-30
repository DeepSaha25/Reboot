import { useState } from 'react';
import { CravingModal } from '@/components/CravingModal';
import { BottomNav } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { useCraving } from '@/hooks/useCraving';
import { useStreak } from '@/hooks/useStreak';
import { Flame, Wind, Heart, Phone, Droplets, Music } from 'lucide-react';

export const Craving = () => {
  const [showModal, setShowModal] = useState(false);
  const { logCraving, getStats } = useCraving();
  const { recordRelapse } = useStreak();

  const stats = getStats();

  const quickActions = [
    { icon: Wind, label: 'Breathing Exercise', action: () => setShowModal(true) },
    { icon: Droplets, label: 'Cold Water Reset' },
    { icon: Music, label: 'Play Calming Music' },
    { icon: Phone, label: 'Call Your Buddy' },
    { icon: Heart, label: 'Practice Self-Care' },
  ];

  const handleCravingComplete = (overcame: boolean, notes?: string) => {
    logCraving({
      intensity: 5,
      overcame,
      notes,
    });

    if (!overcame) {
      recordRelapse(notes);
    }

    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Craving Support" />

      <main className="px-4 py-6 space-y-6">
        {/* Emergency button */}
        <div className="flex flex-col items-center py-8 animate-fade-in">
          <button
            onClick={() => setShowModal(true)}
            className="w-40 h-40 rounded-full bg-primary flex flex-col items-center justify-center shadow-glow animate-pulse-soft hover:scale-105 transition-transform"
          >
            <Flame className="w-12 h-12 text-primary-foreground mb-2" />
            <span className="text-primary-foreground font-semibold text-lg">SOS</span>
          </button>
          <p className="text-muted-foreground text-sm mt-4 font-medium">
            Tap for immediate relief
          </p>
        </div>

        {/* Stats */}
        {stats.total > 0 && (
          <div className="p-4 bg-card rounded-2xl border border-border animate-fade-in">
            <h3 className="font-medium text-foreground mb-3">Your Progress</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.overcome}</p>
                <p className="text-xs text-muted-foreground">Overcome</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.successRate}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h3 className="font-medium text-foreground mb-3">Tools</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={action.label}
                onClick={action.action}
                className="w-full p-4 bg-card border border-border rounded-2xl flex items-center gap-4 hover:bg-muted transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{action.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reminder */}
        <div className="p-4 bg-card/50 rounded-2xl border border-border/50 text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-sm text-muted-foreground">
            Remember: Cravings typically last 15-20 minutes. You've got this. 💪
          </p>
        </div>
      </main>

      <BottomNav />

      <CravingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleCravingComplete}
      />
    </div>
  );
};

export default Craving;
