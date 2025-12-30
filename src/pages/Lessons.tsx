import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { LessonCard } from '@/components/LessonCard';
import { LESSON_TOPICS } from '@/utils/constants';
import { BookOpen, Brain, Lightbulb, Heart, RefreshCw, Leaf } from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  'Foundations': BookOpen,
  'Science': Brain,
  'Skills': Lightbulb,
  'Recovery': RefreshCw,
  'Mindset': Heart,
};

export const Lessons = () => {
  const [completedLessons] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(LESSON_TOPICS.map(l => l.category))];

  const filteredLessons = selectedCategory
    ? LESSON_TOPICS.filter(l => l.category === selectedCategory)
    : LESSON_TOPICS;

  const progress = Math.round((completedLessons.length / LESSON_TOPICS.length) * 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Learn" />

      <main className="px-4 py-6 space-y-6">
        {/* Progress Overview */}
        <div className="p-4 bg-card rounded-2xl border border-border animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Your Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedLessons.length}/{LESSON_TOPICS.length} completed
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-fade-in" style={{ animationDelay: '100ms' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            All
          </button>
          {categories.map(category => {
            const Icon = categoryIcons[category] || BookOpen;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category}
              </button>
            );
          })}
        </div>

        {/* Lessons List */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {filteredLessons.map((lesson, index) => (
            <div key={lesson.id} style={{ animationDelay: `${index * 50}ms` }}>
              <LessonCard
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                category={lesson.category}
                isCompleted={completedLessons.includes(lesson.id)}
              />
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="p-4 bg-card/50 rounded-2xl border border-border/50 text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-sm text-muted-foreground">
            More lessons coming soon. We're working on content tailored to your journey.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Lessons;
