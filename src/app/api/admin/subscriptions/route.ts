import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminUtils";
import { upsertSubscription, SubscriptionPlan } from "@/lib/subscriptionService";

/**
 * PATCH - Update a user's subscription (admin only)
 * Request body: { userId: string, planType: SubscriptionPlan, endDate?: string | null }
 */
export async function PATCH(request: NextRequest) {
  try {
    // Check admin privileges
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json(
        {
          error: "Accès refusé",
          message: "Droits administrateur requis pour cette opération.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, planType, endDate } = body;

    // Validate required fields
    if (!userId || !planType) {
      return NextResponse.json(
        { error: "userId et planType sont requis" },
        { status: 400 }
      );
    }

    // Validate planType
    const validPlanTypes: SubscriptionPlan[] = ['free', 'premium', 'enterprise'];
    if (!validPlanTypes.includes(planType)) {
      return NextResponse.json(
        {
          error: "Plan invalide",
          message: `planType doit être: ${validPlanTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Update or create subscription
    const subscription = await upsertSubscription(
      userId,
      planType,
      endDate !== undefined ? endDate : null
    );

    if (!subscription) {
      return NextResponse.json(
        {
          error: "Erreur lors de la mise à jour de l'abonnement",
          message: "Impossible de créer ou mettre à jour l'abonnement.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Abonnement mis à jour vers ${planType}`,
      subscription,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/subscriptions:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour de l'abonnement" },
      { status: 500 }
    );
  }
}
