// src/lib/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fill these with your Supabase project values.
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

const isConfigured =
  SUPABASE_URL.trim().length > 0 && SUPABASE_ANON_KEY.trim().length > 0;

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // React Native does not use URL-based auth flow
      },
    })
  : null;

export const supabaseConfigured = isConfigured;

// Throws a clear error when Supabase is not configured.
export const ensureSupabase = (): SupabaseClient => {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.',
    );
  }
  return supabase;
};
