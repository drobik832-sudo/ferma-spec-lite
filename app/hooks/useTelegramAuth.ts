
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            username?: string;
          };
        };
        ready: () => void;
        openLink?: (url: string) => void;
        openInvoice?: (url: string, callback?: (status: string) => void) => void;
      };
    };
  }
}

export type UserData = {
  telegram_id: number;
  first_name: string;
  username: string | null;
  stars: number;
};

export function useTelegramAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initData, setInitData] = useState<string>("");

  useEffect(() => {
    async function initUser() {
      if (typeof window !== 'undefined' && !window.Telegram?.WebApp?.initDataUnsafe?.user) {
         console.log('Using Mock Data (No Telegram User detected)');
         setUser({
            telegram_id: 12345,
            first_name: "Test User",
            username: "tester",
            stars: 5
         });
         setLoading(false);
         return;
      }

      if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
        setLoading(false);
        return;
      }

      setInitData(window.Telegram.WebApp.initData || "");
      const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
      
      if (!tgUser) {
        setLoading(false);
        return;
      }

      try {
        const balanceResponse = await fetch("/api/stars/balance", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ initData: window.Telegram.WebApp.initData || "" })
        });
        const balancePayload = await balanceResponse.json().catch(() => ({}));
        if (balanceResponse.ok && balancePayload?.ok === true && typeof balancePayload?.stars === "number") {
          setUser({
            telegram_id: tgUser.id,
            first_name: tgUser.first_name,
            username: tgUser.username || null,
            stars: balancePayload.stars
          });
          setLoading(false);
          return;
        }

        if (!supabase) {
          setUser({
            telegram_id: tgUser.id,
            first_name: tgUser.first_name,
            username: tgUser.username || null,
            stars: 5
          });
          setLoading(false);
          return;
        }
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('telegram_id', tgUser.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Supabase fetch error:', fetchError);
            setError(fetchError.message);
        }

        if (existingUser) {
          setUser(existingUser);
        } else {
          const newUser = {
            telegram_id: tgUser.id,
            first_name: tgUser.first_name,
            username: tgUser.username || null,
            stars: 5
          };

          const { data: createdUser, error: insertError } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();

          if (!insertError && createdUser) {
            setUser(createdUser);
          } else {
            console.error('Error creating user:', insertError);
            setError(insertError?.message || 'Create failed');
            setUser(newUser); 
          }
        }
      } catch (e: any) {
        console.error('Error in auth:', e);
        setError(e.message);
        setUser({
            telegram_id: tgUser.id,
            first_name: tgUser.first_name,
            username: tgUser.username || null,
            stars: 5
        });
      } finally {
        setLoading(false);
      }
    }

    initUser();
  }, []);

  return { user, loading, error, initData };
}
