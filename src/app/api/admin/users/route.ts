import { createAdminSupabaseClient, isAdmin } from "@/lib/adminUtils";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export interface UserInfo {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  lastSignInAt: string | null;
  emailVerified: boolean;
  cvCount: number;
  isAdmin: boolean;
}

/**
 * GET /api/admin/users
 * Récupère la liste de tous les utilisateurs avec leurs informations
 * Nécessite des droits administrateur
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est authentifié et admin
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Utiliser le service role pour accéder à tous les utilisateurs
    const adminSupabase = createAdminSupabaseClient();

    // Récupérer tous les utilisateurs depuis auth.users
    const { data: users, error: usersError } =
      await adminSupabase.auth.admin.listUsers();

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des utilisateurs" },
        { status: 500 }
      );
    }

    // Compter le nombre de CVs par utilisateur
    const userIds = users.users.map((u) => u.id);
    const { data: cvCounts, error: cvError } = await adminSupabase
      .from("cvs")
      .select("user_id")
      .in("user_id", userIds);

    if (cvError) {
      console.error("Error fetching CV counts:", cvError);
      // Continuer même si on ne peut pas récupérer les comptes de CV
    }

    // Créer un map du nombre de CVs par utilisateur
    const cvCountMap = new Map<string, number>();
    if (cvCounts) {
      cvCounts.forEach((cv) => {
        const count = cvCountMap.get(cv.user_id) || 0;
        cvCountMap.set(cv.user_id, count + 1);
      });
    }

    // Formater les données utilisateur
    const usersInfo: UserInfo[] = users.users.map((u) => ({
      id: u.id,
      email: u.email || "Email non disponible",
      name: u.user_metadata?.full_name || undefined,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at || null,
      emailVerified: u.email_confirmed_at !== null,
      cvCount: cvCountMap.get(u.id) || 0,
      isAdmin: u.user_metadata?.isAdmin === true,
    }));

    // Trier par date de création (plus récent en premier)
    usersInfo.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(usersInfo);
  } catch (error) {
    console.error("Server error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/users
 * Met à jour les métadonnées d'un utilisateur (notamment le statut admin)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est authentifié et admin
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, isAdmin: newAdminStatus } = body;

    if (!userId || typeof newAdminStatus !== "boolean") {
      return NextResponse.json(
        { error: "userId et isAdmin sont requis" },
        { status: 400 }
      );
    }

    // Utiliser le service role pour mettre à jour les métadonnées utilisateur
    const adminSupabase = createAdminSupabaseClient();

    // Récupérer les métadonnées actuelles
    const { data: userData, error: getUserError } =
      await adminSupabase.auth.admin.getUserById(userId);

    if (getUserError || !userData?.user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour les métadonnées
    const updatedMetadata = {
      ...userData.user.user_metadata,
      isAdmin: newAdminStatus,
    };

    const { error: updateError } =
      await adminSupabase.auth.admin.updateUserById(userId, {
        user_metadata: updatedMetadata,
      });

    if (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour de l'utilisateur" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
