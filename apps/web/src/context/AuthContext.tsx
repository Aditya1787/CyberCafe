import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseFrontendConfigured } from '../api/client.js';
import { PREDEFINED_STAFF_ACCOUNTS } from '../api/directSupabase.js';

export interface AdminProfile {
  id: string;
  display_name: string;
  role: 'admin' | 'staff';
  designation?: string;
  badge?: string;
  email?: string;
  is_active: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: AdminProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  predefinedStaff: typeof PREDEFINED_STAFF_ACCOUNTS;
}

const LOCAL_STAFF_SESSION_KEY = 'baba_cafe_staff_session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as AdminProfile);
      }
    } catch {
      // Profile fetch fallback handled via local session
    }
  };

  useEffect(() => {
    // 1. Check local staff session first
    try {
      const savedStaff = localStorage.getItem(LOCAL_STAFF_SESSION_KEY);
      if (savedStaff) {
        const staffObj = JSON.parse(savedStaff) as AdminProfile;
        setProfile(staffObj);
        setUser({ id: staffObj.id, email: staffObj.email } as User);
        setIsLoading(false);
        return;
      }
    } catch {
      // Ignore
    }

    if (!isSupabaseFrontendConfigured) {
      setIsLoading(false);
      return;
    }

    // 2. Live Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check predefined 4 Staff Credentials
    const staffMatch = PREDEFINED_STAFF_ACCOUNTS.find(
      (s) => s.email.toLowerCase() === cleanEmail && s.password === cleanPassword
    );

    if (staffMatch) {
      const staffProfile: AdminProfile = {
        id: staffMatch.id,
        display_name: staffMatch.displayName,
        role: staffMatch.role,
        designation: staffMatch.designation,
        badge: staffMatch.badge,
        email: staffMatch.email,
        is_active: true,
      };

      setProfile(staffProfile);
      setUser({ id: staffMatch.id, email: staffMatch.email } as User);
      localStorage.setItem(LOCAL_STAFF_SESSION_KEY, JSON.stringify(staffProfile));

      // Attempt background Supabase auth if connected
      if (isSupabaseFrontendConfigured) {
        try {
          await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
        } catch {
          // Local staff authorization continues
        }
      }

      return { error: null };
    }

    // Live Supabase Authentication
    if (isSupabaseFrontendConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          return { error };
        }

        if (data.user) {
          await fetchProfile(data.user.id);
        }

        return { error: null };
      } catch (err) {
        return { error: err as Error };
      }
    }

    return {
      error: new Error('Invalid email or password. Please use one of the 4 staff accounts provided below.')
    };
  };

  const signOut = async () => {
    try {
      if (isSupabaseFrontendConfigured) {
        await supabase.auth.signOut();
      }
    } finally {
      localStorage.removeItem(LOCAL_STAFF_SESSION_KEY);
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  };

  // Staff and Admin roles both have full dashboard access
  const isAdmin = Boolean(profile && (profile.role === 'admin' || profile.role === 'staff') && profile.is_active);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isAdmin,
        isLoading,
        signIn,
        signOut,
        predefinedStaff: PREDEFINED_STAFF_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
