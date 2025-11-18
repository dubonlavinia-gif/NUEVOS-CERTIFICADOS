// Configuración de Supabase
const SUPABASE_URL = ''https://Imnabxxctowzqqgqnxne.supabase.co'';
const SUPABASE_ANON_KEY = 'const SUPABASE_ANON_KEY =:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbmFieHhjdG93enFxZ3FueG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTM1ODEsImV4cCI6MjA3ODk4OTU4MX0.PyfAXJy--RR2i_38IppUcP7U8SjE6gG4INynnULEGgw

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportar para uso en otros archivos
window.supabaseClient = supabaseClient;

