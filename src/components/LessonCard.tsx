import { ChevronRight, Check } from 'lucide-react';

interface LessonCardProps {
  title: string;
  description: string;
  duration: string;
  category: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

export const LessonCard = ({
  title,
  description,
  duration,
  category,
  isCompleted = false,
  isLocked = false,
  onClick,
}: LessonCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`w-full p-4 bg-card border border-border rounded-2xl flex items-center gap-4 transition-all duration-200 ${
        isLocked 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-muted hover:border-muted-foreground/30 active:scale-[0.99]'
      }`}
    >
      {/* Status indicator */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
        isCompleted 
          ? 'bg-primary/20' 
          : 'bg-muted'
      }`}>
        {isCompleted ? (
          <Check className="w-6 h-6 text-primary" />
        ) : (
          <span className="text-lg font-semibold text-muted-foreground">
            {duration.replace(' min', '')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
    </button>
  );
};

export default LessonCard;
