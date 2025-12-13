import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/user/change-password
 * Change le mot de passe de l'utilisateur authentifié
 * Nécessite l'ancien mot de passe pour vérification
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "L'ancien et le nouveau mot de passe sont requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          error: "Le nouveau mot de passe doit contenir au moins 6 caractères",
        },
        { status: 400 }
      );
    }

    // Vérifier que l'ancien mot de passe est correct en essayant de se reconnecter
    if (!user.email) {
      return NextResponse.json(
        { error: "Email utilisateur non trouvé" },
        { status: 400 }
      );
    }

    // Tenter une connexion avec l'ancien mot de passe pour vérifier
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { error: "Ancien mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Si la vérification réussit, changer le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error("Error updating password:", updateError);
      if (
        updateError.message.includes("same as old") ||
        updateError.message.includes("Password should be different")
      ) {
        return NextResponse.json(
          { error: "Le nouveau mot de passe doit être différent de l'ancien" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Erreur lors du changement de mot de passe" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mot de passe modifié avec succès",
    });
  } catch (error) {
    console.error("Server error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
