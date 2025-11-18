// Este archivo inicializa el cliente de Supabase
// IMPORTANTE: Asegúrate de que tu llave ANÓNIMA esté entre comillas simples.

const SUPABASE_URL = 'https://Imnabxxctowzqqgqnxne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbmFieHhjdG93enFxZ3FueG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTM1ODEsImV4cCI6MjA3ODk4OTU4MX0.PyfAXJy--RR2i_38IppUcP7U8SjE6gG4INynnULEGgw'; // <--- ¡Pega tu llave aquí!
// Esto usa la librería que cargamos en el HTML
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Exportar para que todos los demás scripts puedan usarlo
window.supabaseClient = supabaseClient;
