import { useState } from 'react';
import { Plus, Trash2, Phone, User as UserIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuddies } from '@/hooks/useBuddies';

export const BuddyManager = () => {
    const { buddies, addBuddy, removeBuddy } = useBuddies();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName && newPhone) {
            addBuddy(newName, newPhone);
            setNewName('');
            setNewPhone('');
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-foreground">Your Buddies</h3>
                    <p className="text-sm text-muted-foreground">
                        Trusted contacts you can call in an emergency.
                    </p>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Buddy
                    </Button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="p-4 bg-muted/50 rounded-xl border border-border animate-fade-in space-y-3">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">New Contact</h4>
                        <button type="button" onClick={() => setIsAdding(false)}>
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Name (e.g. Alex)"
                                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                autoFocus
                            />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                                type="tel"
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                placeholder="Phone Number"
                                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={!newName || !newPhone} className="w-full">
                        Save Contact
                    </Button>
                </form>
            )}

            <div className="space-y-2">
                {buddies.length === 0 && !isAdding && (
                    <div className="text-center py-6 border-2 border-dashed border-muted rounded-xl">
                        <p className="text-sm text-muted-foreground">No buddies added yet.</p>
                    </div>
                )}

                {buddies.map((buddy) => (
                    <div
                        key={buddy.id}
                        className="flex items-center justify-between p-3 bg-card border border-border rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                    {buddy.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-foreground">{buddy.name}</p>
                                <p className="text-xs text-muted-foreground">{buddy.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={`tel:${buddy.phone}`}
                                className="p-2 hover:bg-muted rounded-full text-green-500 transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                            </a>
                            <button
                                onClick={() => removeBuddy(buddy.id)}
                                className="p-2 hover:bg-destructive/10 rounded-full text-destructive transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
