import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Users, MessageCircle, UserPlus, Shield, Send, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Community = () => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'chat'>('rooms');
  const [message, setMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    { id: 1, user: 'Anonymous Owl', text: 'Day 3 has been really hard for me.', time: '10:30 AM', isMe: false },
    { id: 2, user: 'Hopeful Fox', text: 'You got this! Try the breathing exercise.', time: '10:31 AM', isMe: false },
    { id: 3, user: 'Calm Bear', text: 'I just finished a 7 day streak. It gets easier.', time: '10:32 AM', isMe: false },
  ]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: 'You',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        user: 'Supportive Bot',
        text: 'Great to hear from you! We are all in this together.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const rooms = [
    { id: 'general', name: 'General Support', online: 24, icon: Users },
    { id: 'anxiety', name: 'Anxiety & Stress', online: 12, icon: MessageCircle },
    { id: 'night', name: 'Late Night Watch', online: 8, icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Community" />

      <main className="flex flex-col h-[calc(100vh-8rem)]">
        {activeTab === 'rooms' ? (
          <div className="p-4 space-y-6 animate-fade-in">
            {/* Privacy Notice */}
            <div className="p-4 bg-card rounded-2xl border border-border flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Anonymous & Safe</h3>
                <p className="text-sm text-muted-foreground">
                  Your identity is hidden. Support others without revealing who you are.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Live Rooms</h2>
              <div className="space-y-3">
                {rooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setActiveTab('chat')}
                    className="w-full p-4 bg-card border border-border rounded-2xl flex items-center justify-between hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <room.icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-foreground">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">{room.online} people online</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Join</Button>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Find a Buddy</h2>
              <div className="p-4 bg-card border border-border rounded-2xl text-center">
                <UserPlus className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-foreground font-medium">Looking for an accountability partner?</p>
                <p className="text-sm text-muted-foreground mb-4">Get matched with someone on the same journey.</p>
                <Button className="w-full">Find Match</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-slide-up">
            <div className="bg-card border-b border-border p-4 flex items-center justify-between">
              <button onClick={() => setActiveTab('rooms')} className="text-sm text-muted-foreground hover:text-foreground">
                &larr; Leave Room
              </button>
              <span className="font-medium">General Support</span>
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 ${msg.isMe
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted text-foreground rounded-tl-none'
                    }`}>
                    {!msg.isMe && <p className="text-xs font-medium mb-1 opacity-70">{msg.user}</p>}
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-[10px] mt-1 opacity-50 text-right">{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-background border-t border-border flex gap-2">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-muted border-none rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="icon" className="rounded-full w-10 h-10 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Community;
