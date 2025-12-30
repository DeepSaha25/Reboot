import { ProgressRing } from './ProgressRing';
import { MILESTONES } from '@/utils/constants';

interface SoberCounterProps {
  currentStreak: number;
  bestStreak: number;
  addictionLabel?: string;
}

export const SoberCounter = ({ 
  currentStreak, 
  bestStreak, 
  addictionLabel = 'Clean'
}: SoberCounterProps) => {
  // Calculate progress to next milestone
  const getNextMilestone = () => {
    return MILESTONES.find(m => m.days > currentStreak) || MILESTONES[MILESTONES.length - 1];
  };

  const getCurrentMilestone = () => {
    return [...MILESTONES].reverse().find(m => m.days <= currentStreak);
  };

  const nextMilestone = getNextMilestone();
  const currentMilestone = getCurrentMilestone();
  
  // Calculate progress percentage
  const prevMilestoneDay = currentMilestone?.days || 0;
  const progressToNext = nextMilestone 
    ? ((currentStreak - prevMilestoneDay) / (nextMilestone.days - prevMilestoneDay)) * 100
    : 100;

  return (
    <div className="flex flex-col items-center space-y-4 animate-fade-in">
      {/* Main counter ring */}
      <ProgressRing 
        progress={Math.min(progressToNext, 100)} 
        size={220} 
        strokeWidth={10}
      >
        <div className="flex flex-col items-center">
          {currentMilestone && (
            <span className="text-3xl mb-1">{currentMilestone.badge}</span>
          )}
          <span className="text-5xl font-bold text-foreground tabular-nums">
            {currentStreak}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            {currentStreak === 1 ? 'day' : 'days'} {addictionLabel.toLowerCase()}
          </span>
        </div>
      </ProgressRing>

      {/* Next milestone indicator */}
      {nextMilestone && currentStreak < nextMilestone.days && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">
              {nextMilestone.days - currentStreak} days
            </span>{' '}
            until {nextMilestone.label}
          </p>
        </div>
      )}

      {/* Best streak */}
      {bestStreak > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-2xl border border-border">
          <span className="text-xs text-muted-foreground">Best streak:</span>
          <span className="text-sm font-semibold text-foreground">
            {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      )}
    </div>
  );
};

export default SoberCounter;
