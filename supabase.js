// js/supabase.js — Supabase client singleton
// Reads env vars injected by Vite (or window.__ENV__ for plain HTML deployments)

const SUPABASE_URL  = import.meta.env?.VITE_SUPABASE_URL  ?? window.__ENV__?.VITE_SUPABASE_URL;
const SUPABASE_KEY  = import.meta.env?.VITE_SUPABASE_ANON_KEY ?? window.__ENV__?.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[HappySpoon] Supabase env vars missing. Check your .env file.');
}

// Using the CDN build (loaded via index.html <script type="module">)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
