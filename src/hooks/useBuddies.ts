import { useState, useEffect, useCallback } from 'react';

export interface Buddy {
    id: string;
    name: string;
    phone: string;
}

const STORAGE_KEY = 'reboot_buddies';

export const useBuddies = () => {
    const [buddies, setBuddies] = useState<Buddy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load buddies from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setBuddies(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading buddies:', error);
        }
        setIsLoading(false);
    }, []);

    // Save buddies to localStorage
    const saveBuddies = useCallback((newBuddies: Buddy[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newBuddies));
            setBuddies(newBuddies);
        } catch (error) {
            console.error('Error saving buddies:', error);
        }
    }, []);

    const addBuddy = useCallback((name: string, phone: string) => {
        const newBuddy: Buddy = {
            id: Date.now().toString(),
            name,
            phone,
        };
        saveBuddies([...buddies, newBuddy]);
    }, [buddies, saveBuddies]);

    const removeBuddy = useCallback((id: string) => {
        const newBuddies = buddies.filter(b => b.id !== id);
        saveBuddies(newBuddies);
    }, [buddies, saveBuddies]);

    const updateBuddy = useCallback((id: string, updates: Partial<Buddy>) => {
        const newBuddies = buddies.map(b =>
            b.id === id ? { ...b, ...updates } : b
        );
        saveBuddies(newBuddies);
    }, [buddies, saveBuddies]);

    return {
        buddies,
        isLoading,
        addBuddy,
        removeBuddy,
        updateBuddy,
    };
};

export default useBuddies;
