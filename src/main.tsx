import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Debug: Vérifier les variables d'environnement au chargement
console.log('🔧 Chargement de l\'application...');
console.log('🔍 Variables d\'environnement Vite:');
console.log('- VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✅ Défini' : '❌ Non défini');
console.log('- VITE_GOOGLE_CLIENT_SECRET:', import.meta.env.VITE_GOOGLE_CLIENT_SECRET ? '✅ Défini' : '❌ Non défini');
console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Défini' : '❌ Non défini');

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
