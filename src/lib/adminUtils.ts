import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "./supabaseServer";

/**
 * Vérifie si un utilisateur est administrateur
 * Les admins sont déterminés via les metadata utilisateur: user_metadata.isAdmin === true
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    // Vérifier si l'utilisateur a le flag isAdmin dans ses metadata
    return user.user_metadata?.isAdmin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Crée un client Supabase avec le service role key pour accéder à toutes les données
 * Utilisé uniquement dans les routes admin côté serveur
 */
export function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY n'est pas définie dans les variables d'environnement"
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
