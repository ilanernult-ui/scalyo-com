import { supabase } from "@/integrations/supabase/client";

export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  token_type: string;
}

/**
 * Vérifie si un token Google est expiré ou va expirer bientôt
 */
export const isTokenExpired = (expiresAt: string, bufferMinutes = 5): boolean => {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const buffer = bufferMinutes * 60 * 1000; // Convertir en millisecondes
  return now.getTime() + buffer >= expiry.getTime();
};

/**
 * Rafraîchit un token d'accès Google en utilisant le refresh token
 */
export const refreshGoogleToken = async (refreshToken: string): Promise<GoogleTokens | null> => {
  try {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Erreur refresh token: ${data.error_description || data.error}`);
    }

    return {
      access_token: data.access_token,
      refresh_token: refreshToken, // Le refresh token reste le même
      expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      token_type: data.token_type || 'Bearer',
    };
  } catch (error) {
    console.error('Erreur lors du refresh du token Google:', error);
    return null;
  }
};

/**
 * Récupère et rafraîchit si nécessaire les tokens Google pour un utilisateur et connecteur
 */
export const getValidGoogleTokens = async (
  userId: string,
  connectorId: string
): Promise<GoogleTokens | null> => {
  try {
    // Récupérer les tokens depuis la base de données
    const { data, error } = await supabase
      .from('data_connectors')
      .select('config')
      .eq('user_id', userId)
      .eq('connector_id', connectorId)
      .single();

    if (error || !data?.config) {
      console.error('Tokens non trouvés:', error);
      return null;
    }

    const tokens = data.config as GoogleTokens;

    // Vérifier si le token est expiré
    if (isTokenExpired(tokens.expires_at)) {
      console.log('Token expiré, tentative de refresh...');
      const newTokens = await refreshGoogleToken(tokens.refresh_token);

      if (newTokens) {
        // Sauvegarder les nouveaux tokens
        await supabase
          .from('data_connectors')
          .update({
            config: newTokens,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('connector_id', connectorId);

        return newTokens;
      } else {
        console.error('Échec du refresh du token');
        return null;
      }
    }

    return tokens;
  } catch (error) {
    console.error('Erreur lors de la récupération des tokens:', error);
    return null;
  }
};

/**
 * Effectue un appel API à Google Analytics avec gestion automatique des tokens
 */
export const callGoogleAnalyticsAPI = async (
  userId: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const tokens = await getValidGoogleTokens(userId, 'google_analytics');

  if (!tokens) {
    throw new Error('Tokens Google non disponibles ou expirés');
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `https://analyticsdata.googleapis.com/v1beta/${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};