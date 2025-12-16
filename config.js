const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api`;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const QUARTIERS = ['Muhumba', 'Nguba', 'Avenue Gouverneur', 'Hippodrome', 'Labotte'];

export { API_BASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, QUARTIERS };
