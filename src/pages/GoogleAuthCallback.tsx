import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
const db = supabase as any;
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const GoogleAuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  console.log('🔄 GoogleAuthCallback: Composant chargé');
  console.log('🔍 URL actuelle:', window.location.href);
  console.log('🔍 Search params:', Object.fromEntries(searchParams.entries()));

  useEffect(() => {
    console.log('⚡ useEffect de GoogleAuthCallback déclenché');
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Erreur d'autorisation Google : ${error}`);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('Code d\'autorisation manquant');
          return;
        }

        if (!user) {
          setStatus('error');
          setMessage('Utilisateur non authentifié');
          return;
        }

        // Parser le state pour récupérer le connectorId
        let connectorId = 'google_analytics'; // Par défaut
        if (state) {
          try {
            const stateData = JSON.parse(decodeURIComponent(state));
            connectorId = stateData.connectorId || 'google_analytics';
          } catch (e) {
            console.warn('Impossible de parser le state:', e);
          }
        }

        // Échange du code via Edge Function sécurisée (client_secret côté serveur)
        // ⚠️ redirect_uri DOIT être identique à celle envoyée à l'autorisation
        const redirectUri = `${window.location.origin}/auth/google/callback`;

        const { data: tokenData, error: fnError } = await supabase.functions.invoke(
          'google-oauth-exchange',
          { body: { code, redirect_uri: redirectUri } }
        );

        if (fnError) {
          throw new Error(`Erreur d'échange : ${fnError.message}`);
        }
        if (!tokenData || (tokenData as any).error) {
          throw new Error(`Erreur OAuth : ${(tokenData as any)?.error || 'inconnue'}`);
        }

        // Stocker les tokens dans la base de données
        const { error: dbError } = await db
          .from('data_connectors')
          .upsert(
            {
              user_id: user.id,
              connector_id: connectorId,
              status: 'connected',
              config: {
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
                token_type: tokenData.token_type,
              },
              last_sync_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,connector_id' }
          );

        if (dbError) {
          throw new Error(`Erreur de sauvegarde: ${dbError.message}`);
        }

        setStatus('success');
        setMessage('Connexion Google Analytics réussie !');

        // Rediriger vers le dashboard Google Analytics après 2 secondes
        setTimeout(() => {
          navigate('/dashboard/google-analytics');
        }, 2000);

      } catch (err) {
        console.error('Erreur lors du callback OAuth:', err);
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Erreur inconnue lors de la connexion');
      }
    };

    handleCallback();
  }, [searchParams, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-lg border p-6 text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h2 className="text-xl font-semibold">Connexion en cours...</h2>
              <p className="text-muted-foreground">
                Traitement de votre autorisation Google Analytics
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
              <h2 className="text-xl font-semibold text-green-700">Connexion réussie !</h2>
              <p className="text-muted-foreground">{message}</p>
              <p className="text-sm text-muted-foreground">
                Redirection vers vos connecteurs...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
              <h2 className="text-xl font-semibold text-red-700">Erreur de connexion</h2>
              <p className="text-muted-foreground">{message}</p>
              <Button
                onClick={() => navigate('/dashboard?tab=connectors')}
                className="mt-4"
              >
                Retour aux connecteurs
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;