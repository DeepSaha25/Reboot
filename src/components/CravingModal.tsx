import { useState, useEffect, useCallback } from 'react';
import { X, Wind, Eye, Hand, Pencil, Phone, Droplets, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuddies } from '@/hooks/useBuddies';
import { GROUNDING_STEPS } from '@/utils/constants';

interface CravingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (overcame: boolean, notes?: string) => void;
}

type Phase = 'breathing' | 'grounding' | 'journal' | 'actions' | 'complete';

export const CravingModal = ({ isOpen, onClose, onComplete }: CravingModalProps) => {
  const { buddies } = useBuddies();
  const [phase, setPhase] = useState<Phase>('breathing');
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [timeLeft, setTimeLeft] = useState(30);
  const [groundingStep, setGroundingStep] = useState(0);
  const [journalNote, setJournalNote] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhase('breathing');
      setTimeLeft(30);
      setGroundingStep(0);
      setJournalNote('');
    }
  }, [isOpen]);

  // Breathing Timer Logic
  useEffect(() => {
    if (phase === 'breathing' && isOpen) {
      // 4s in, 4s hold, 6s out cycle
      const cycleLength = 14000;
      const interval = setInterval(() => {
        const now = Date.now();
        const cycleTime = now % cycleLength;
        if (cycleTime < 4000) setBreathPhase('in');
        else if (cycleTime < 8000) setBreathPhase('hold');
        else setBreathPhase('out');
      }, 100);

      const countdown = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(countdown);
      };
    }
  }, [phase, isOpen]);

  const handleNextPhase = useCallback(() => {
    switch (phase) {
      case 'breathing':
        setPhase('grounding');
        break;
      case 'grounding':
        setPhase('journal');
        break;
      case 'journal':
        setPhase('actions');
        break;
      case 'actions':
        setPhase('complete');
        break;
      case 'complete':
        onComplete(true, journalNote);
        break;
    }
  }, [phase, journalNote, onComplete]);

  const handleGroundingNext = () => {
    if (groundingStep < GROUNDING_STEPS.length - 1) {
      setGroundingStep(prev => prev + 1);
    } else {
      handleNextPhase();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fade-in text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-6 safe-area-inset-top">
        <div>
          {phase !== 'complete' && (
            <p className="text-sm text-gray-400">You're not alone with this urge.</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-12 max-w-md mx-auto w-full">
        {/* Title */}
        {phase !== 'complete' && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Ride out this craving, gently.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              This feeling will pass. Stay with your body, not the urge. Take it one breath at a time.
            </p>
          </div>
        )}

        {/* BREATHING PHASE */}
        {phase === 'breathing' && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div className="flex justify-between items-center text-sm font-medium text-gray-400 mb-8">
              <span>30-second breathing</span>
              <span>In for 4s, hold 4s, out for 6s.</span>
            </div>

            <div className="flex-1 flex items-center justify-center py-12">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Visual Breathing Circle */}
                <div className={`absolute inset-0 border-4 border-emerald-500/20 rounded-full transition-all duration-1000 ${breathPhase === 'in' ? 'scale-110' : breathPhase === 'hold' ? 'scale-110' : 'scale-100'
                  }`} />
                <div className={`w-48 h-48 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-[4000ms] ${breathPhase === 'in' ? 'scale-100 opacity-100' : breathPhase === 'hold' ? 'scale-100 opacity-90' : 'scale-75 opacity-80'
                  }`}>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-black">
                      {breathPhase === 'in' && 'Inhale'}
                      {breathPhase === 'hold' && 'Hold'}
                      {breathPhase === 'out' && 'Exhale'}
                    </span>
                    <span className="text-sm text-black/60 font-medium">
                      {timeLeft}s left
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {timeLeft === 0 && (
              <Button onClick={handleNextPhase} className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-14 rounded-2xl text-lg animate-fade-in">
                Start Grounding
              </Button>
            )}
          </div>
        )}

        {/* GROUNDING PHASE */}
        {phase === 'grounding' && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div>
              <p className="text-gray-400 mb-6">5-4-3-2-1 Grounding</p>
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                  {groundingStep === 0 && <Eye className="w-8 h-8" />}
                  {groundingStep === 1 && <Hand className="w-8 h-8" />}
                  {groundingStep === 2 && <Wind className="w-8 h-8" />}
                  {groundingStep === 3 && <Droplets className="w-8 h-8" />}
                  {groundingStep === 4 && <CheckCircle className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Find {GROUNDING_STEPS[groundingStep].count} {GROUNDING_STEPS[groundingStep].sense}
                </h3>
                <p className="text-gray-400">
                  Look around your environment. Take your time.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {GROUNDING_STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= groundingStep ? 'w-8 bg-emerald-500' : 'w-2 bg-white/20'}`} />
                ))}
              </div>
              <Button onClick={handleGroundingNext} className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-14 rounded-2xl text-lg">
                Next Sense
              </Button>
            </div>
          </div>
        )}

        {/* JOURNAL PHASE */}
        {phase === 'journal' && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div>
              <p className="text-gray-400 mb-4">Put this moment into one sentence.</p>
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="e.g. I feel lonely and my brain wants a quick escape."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg text-white placeholder:text-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <Button onClick={handleNextPhase} className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-14 rounded-2xl text-lg">
                Continue to Reset
              </Button>
              <button onClick={handleNextPhase} className="w-full text-gray-500 text-sm py-2">
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* ACTIONS PHASE */}
        {phase === 'actions' && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div className="space-y-6">
              <p className="text-gray-400">Almost there. Choose a physical reset.</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Buddy Buttons */}
                {buddies.length > 0 ? (
                  buddies.map(buddy => (
                    <a
                      key={buddy.id}
                      href={`tel:${buddy.phone}`}
                      className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors gap-3"
                    >
                      <Phone className="w-6 h-6 text-emerald-500" />
                      <span className="text-sm font-medium">
                        Call {buddy.name}
                      </span>
                    </a>
                  ))
                ) : (
                  <button className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl opacity-50 cursor-not-allowed gap-3">
                    <Phone className="w-6 h-6 text-gray-500" />
                    <span className="text-sm font-medium text-gray-500">
                      No Buddy Added
                    </span>
                  </button>
                )}

                <a
                  href="sms:?body=I'm having a hard time right now, are you free to talk?"
                  className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors gap-3"
                >
                  <Pencil className="w-6 h-6 text-emerald-500" />
                  <span className="text-sm font-medium">Message Buddy</span>
                </a>

                <button className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors gap-3 col-span-2">
                  <Droplets className="w-6 h-6 text-emerald-500" />
                  <span className="text-sm font-medium">Cold Water Reset</span>
                </button>
              </div>
            </div>

            <Button
              onClick={() => {
                // Complete success
                onComplete(true, journalNote);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-14 rounded-2xl text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              I've ridden this wave
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CravingModal;
