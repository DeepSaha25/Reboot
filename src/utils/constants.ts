// Addiction types available in the app
export const ADDICTION_TYPES = [
  { id: 'phone', label: 'Phone / Social Media', icon: 'Smartphone', color: 'primary' },
  { id: 'smoking', label: 'Smoking / Vaping', icon: 'Cigarette', color: 'warning' },
  { id: 'alcohol', label: 'Alcohol', icon: 'Wine', color: 'warning' },
  { id: 'porn', label: 'Porn / Masturbation', icon: 'Eye', color: 'destructive' },
  { id: 'gaming', label: 'Gaming', icon: 'Gamepad2', color: 'primary' },
  { id: 'streaming', label: 'Binge Watching', icon: 'Tv', color: 'primary' },
  { id: 'food', label: 'Junk Food / Overeating', icon: 'Cookie', color: 'warning' },
  { id: 'caffeine', label: 'Caffeine', icon: 'Coffee', color: 'warning' },
  { id: 'custom', label: 'Something Else', icon: 'Plus', color: 'muted' },
] as const;

// Common triggers
export const COMMON_TRIGGERS = [
  { id: 'stress', label: 'Stress', icon: 'Zap' },
  { id: 'boredom', label: 'Boredom', icon: 'Clock' },
  { id: 'loneliness', label: 'Loneliness', icon: 'User' },
  { id: 'anxiety', label: 'Anxiety', icon: 'AlertCircle' },
  { id: 'sadness', label: 'Sadness', icon: 'Frown' },
  { id: 'anger', label: 'Frustration', icon: 'Flame' },
  { id: 'tiredness', label: 'Tiredness', icon: 'Moon' },
  { id: 'celebration', label: 'Celebration', icon: 'PartyPopper' },
  { id: 'social', label: 'Social Pressure', icon: 'Users' },
  { id: 'morning', label: 'Morning Routine', icon: 'Sun' },
  { id: 'night', label: 'Late Night', icon: 'Moon' },
  { id: 'work', label: 'Work Breaks', icon: 'Briefcase' },
] as const;

// Milestones
export const MILESTONES = [
  { days: 1, label: '1 Day', badge: '🌱', message: 'Every journey begins with a single day.' },
  { days: 3, label: '3 Days', badge: '🌿', message: 'Your brain is starting to rewire.' },
  { days: 7, label: '1 Week', badge: '🌳', message: 'One week strong. The hardest part is behind you.' },
  { days: 14, label: '2 Weeks', badge: '⭐', message: 'Two weeks of growth and healing.' },
  { days: 30, label: '1 Month', badge: '🏆', message: 'A full month of reclaiming your life.' },
  { days: 60, label: '2 Months', badge: '💎', message: 'Your new habits are becoming second nature.' },
  { days: 90, label: '3 Months', badge: '👑', message: '90 days! A major turning point in recovery.' },
  { days: 180, label: '6 Months', badge: '🔥', message: 'Half a year of strength and resilience.' },
  { days: 365, label: '1 Year', badge: '🌟', message: 'One year free. You are an inspiration.' },
] as const;

// Grounding exercise steps (5-4-3-2-1)
export const GROUNDING_STEPS = [
  { count: 5, sense: 'things you can SEE', icon: 'Eye' },
  { count: 4, sense: 'things you can TOUCH', icon: 'Hand' },
  { count: 3, sense: 'things you can HEAR', icon: 'Ear' },
  { count: 2, sense: 'things you can SMELL', icon: 'Wind' },
  { count: 1, sense: 'thing you can TASTE', icon: 'Apple' },
] as const;

// Motivational messages (non-toxic, supportive)
export const MOTIVATIONAL_MESSAGES = [
  "You are rewriting your story, one choice at a time.",
  "Discomfort is the price of admission to a new life.",
  "Don't trade what you want most for what you want now.",
  "You are not your thoughts. You are the observer.",
  "The only way out is through.",
  "Your future self is begging you to keep going.",
  "Recovery is about progress, not perfection.",
  "This craving is temporary. Your goals are forever.",
  "You are stronger than a chemical impulse.",
  "Every time you say no, you get stronger.",
] as const;

// Lesson topics
export const LESSON_TOPICS = [
  {
    id: 'how-addiction-works',
    title: 'How Addiction Works',
    description: 'Understanding the science behind addiction',
    duration: '4 min',
    category: 'Foundations',
  },
  {
    id: 'dopamine-reset',
    title: 'The Dopamine Reset',
    description: 'Resetting your brain\'s reward system',
    duration: '5 min',
    category: 'Science',
  },
  {
    id: 'trigger-awareness',
    title: 'Trigger Awareness',
    description: 'Identifying and managing your triggers',
    duration: '3 min',
    category: 'Skills',
  },
  {
    id: 'relapse-recovery',
    title: 'Recovering from Relapse',
    description: 'Bouncing back without shame',
    duration: '4 min',
    category: 'Recovery',
  },
  {
    id: 'replacement-habits',
    title: 'Building Replacement Habits',
    description: 'Creating healthier alternatives',
    duration: '5 min',
    category: 'Skills',
  },
  {
    id: 'self-compassion',
    title: 'Self-Compassion Practice',
    description: 'Being kind to yourself in recovery',
    duration: '4 min',
    category: 'Mindset',
  },
] as const;
