import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { checkSubscriptionLimits } from "@/lib/subscriptionService";

/**
 * GET - Get current user's subscription status and limits
 * Returns SubscriptionCheck object with all permissions
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    // Get subscription limits for this user
    const subscriptionCheck = await checkSubscriptionLimits(user.id);

    return NextResponse.json(subscriptionCheck);
  } catch (error) {
    console.error("Error in GET /api/user/subscription:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération de l'abonnement" },
      { status: 500 }
    );
  }
}
