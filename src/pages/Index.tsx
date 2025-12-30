import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';

const Index = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useOnboarding();

  useEffect(() => {
    if (!isLoading) {
      if (profile.hasCompletedOnboarding) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [profile, isLoading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center animate-pulse">
        <h1 className="text-2xl font-bold text-primary">REBOOT</h1>
      </div>
    </div>
  );
};

export default Index;
