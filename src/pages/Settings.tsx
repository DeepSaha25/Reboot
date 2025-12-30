import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/useOnboarding';
import { BuddyManager } from '@/components/BuddyManager';
import {
  User, Shield, Bell, Download, Trash2,
  ChevronRight, Moon, HelpCircle, ExternalLink,
  AlertTriangle, X
} from 'lucide-react';

export const Settings = () => {
  const navigate = useNavigate();
  const { profile, resetProfile } = useOnboarding();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showBuddyModal, setShowBuddyModal] = useState(false);

  const handleReset = () => {
    resetProfile();
    navigate('/');
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          description: profile.anonymousName,
          action: () => { },
        },
        {
          icon: Shield,
          label: 'Privacy',
          description: profile.privacyLevel === 'anonymous' ? 'Anonymous' : 'Named',
          action: () => { },
        },
      ],
    },
    {
      title: 'Safety Network',
      items: [
        {
          icon: User,
          label: 'Manage Buddies',
          description: 'Trusted contacts for emergencies',
          action: () => setShowBuddyModal(true),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Reminders & check-ins',
          action: () => { },
        },
        {
          icon: Moon,
          label: 'Appearance',
          description: 'Dark theme (default)',
          action: () => { },
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: Download,
          label: 'Export Data',
          description: 'Download your journey data',
          action: () => { },
        },
        {
          icon: Trash2,
          label: 'Reset Progress',
          description: 'Start fresh (cannot be undone)',
          action: () => setShowResetConfirm(true),
          danger: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          description: 'Get answers to common questions',
          action: () => { },
        },
        {
          icon: AlertTriangle,
          label: 'Emergency Resources',
          description: 'Crisis helplines & support',
          action: () => { },
          highlight: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Settings" />

      <main className="px-4 py-6 space-y-6">
        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <div key={section.title} className="animate-fade-in" style={{ animationDelay: `${sectionIndex * 50}ms` }}>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              {section.title}
            </h2>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {section.items.map((item, index) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-muted transition-colors ${index !== section.items.length - 1 ? 'border-b border-border' : ''
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.danger
                    ? 'bg-destructive/20'
                    : item.highlight
                      ? 'bg-warning/20'
                      : 'bg-muted'
                    }`}>
                    <item.icon className={`w-5 h-5 ${item.danger
                      ? 'text-destructive'
                      : item.highlight
                        ? 'text-warning'
                        : 'text-muted-foreground'
                      }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${item.danger ? 'text-destructive' : 'text-foreground'}`}>
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Disclaimer */}
        <div className="p-4 bg-card/50 rounded-2xl border border-border/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-xs text-muted-foreground text-center">
            REBOOT is not a substitute for professional medical advice, diagnosis, or treatment.
            If you're in crisis, please contact a mental health professional or emergency services.
          </p>
        </div>

        {/* Version */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '250ms' }}>
          <p className="text-xs text-muted-foreground">REBOOT v1.0.0</p>
          <a
            href="#"
            className="text-xs text-primary flex items-center justify-center gap-1 mt-1"
          >
            Privacy Policy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </main>

      <BottomNav />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Reset All Progress?</h3>
              <p className="text-sm text-muted-foreground">
                This will delete all your streaks, history, and settings. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Buddy Modal */}
      {showBuddyModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Safety Network</h3>
              <button
                onClick={() => setShowBuddyModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <BuddyManager />
            <div className="mt-4 pt-4 border-t border-border">
              <Button onClick={() => setShowBuddyModal(false)} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
