import { createServerSupabaseClient } from "./supabaseServer";

// Type definitions for subscriptions
export type SubscriptionPlan = 'free' | 'premium' | 'enterprise';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export interface Subscription {
  id: string;
  userId: string;
  planType: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionCheck {
  isPremium: boolean;
  planType: SubscriptionPlan;
  status: SubscriptionStatus;
  endDate: string | null;
  cvCount: number;
  cvLimit: number | null; // null = unlimited
  canCreateCV: boolean;
  canSaveCV: boolean;
  canDownloadCV: boolean;
  canDuplicate: boolean;
}

/**
 * Server-side: Get user's active subscription
 * Returns the most recent active subscription with valid end_date
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // No active subscription found - this is not necessarily an error
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching subscription:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      planType: data.plan_type as SubscriptionPlan,
      status: data.status as SubscriptionStatus,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return null;
  }
}

/**
 * Server-side: Count user's CVs
 */
export async function getUserCVCount(userId: string): Promise<number> {
  try {
    const supabase = await createServerSupabaseClient();

    const { count, error } = await supabase
      .from('cvs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error counting CVs:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getUserCVCount:', error);
    return 0;
  }
}

/**
 * Server-side: Check subscription status and CV limits
 * This is the main function used by API routes to determine what a user can do
 */
export async function checkSubscriptionLimits(userId: string): Promise<SubscriptionCheck> {
  try {
    const subscription = await getUserSubscription(userId);
    const cvCount = await getUserCVCount(userId);

    // Default to free plan if no subscription found
    const planType: SubscriptionPlan = subscription?.planType || 'free';
    const isPremium = planType === 'premium' || planType === 'enterprise';

    // Free tier: 2 CV limit
    // Premium/Enterprise: unlimited CVs
    const cvLimit = isPremium ? null : 2;

    // Free users can create a 3rd CV in preview mode (canCreateCV = true)
    // But they can only save/download 2 CVs (canSaveCV = false for 3rd)
    const canCreateCV = isPremium || cvCount < 3;
    const canSaveCV = isPremium || cvCount < 2;
    const canDownloadCV = isPremium || cvCount < 2;
    const canDuplicate = isPremium || cvCount < 2;

    return {
      isPremium,
      planType,
      status: subscription?.status || 'active',
      endDate: subscription?.endDate || null,
      cvCount,
      cvLimit,
      canCreateCV,
      canSaveCV,
      canDownloadCV,
      canDuplicate,
    };
  } catch (error) {
    console.error('Error in checkSubscriptionLimits:', error);
    // Return safe defaults on error (treat as free user with no CVs)
    return {
      isPremium: false,
      planType: 'free',
      status: 'active',
      endDate: null,
      cvCount: 0,
      cvLimit: 1,
      canCreateCV: true,
      canSaveCV: true,
      canDownloadCV: true,
      canDuplicate: true,
    };
  }
}

// Note: fetchSubscriptionStatus has been moved to the useSubscription hook
// to avoid importing server-side code in client components

/**
 * Server-side: Create or update subscription
 * Used by admin panel or payment webhooks to manage subscriptions
 *
 * @param userId - The user's ID
 * @param planType - The subscription plan type
 * @param endDate - Optional expiration date (null for unlimited/lifetime)
 */
export async function upsertSubscription(
  userId: string,
  planType: SubscriptionPlan,
  endDate: string | null = null
): Promise<Subscription | null> {
  try {
    const supabase = await createServerSupabaseClient();

    // First, cancel all existing active subscriptions for this user
    // This ensures we don't have multiple active subscriptions
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('status', 'active');

    // Create new subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: endDate,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }

    if (!data) {
      console.error('No data returned from subscription insert');
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      planType: data.plan_type as SubscriptionPlan,
      status: data.status as SubscriptionStatus,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error in upsertSubscription:', error);
    return null;
  }
}

/**
 * Server-side: Get all user CVs ordered by creation date
 * Helper function to determine CV index (1st, 2nd, etc.)
 */
export async function getUserCVs(userId: string): Promise<{ id: string; created_at: string }[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('cvs')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching user CVs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserCVs:', error);
    return [];
  }
}

/**
 * Server-side: Check if a specific CV can be accessed by a user
 * Takes into account subscription limits and CV order
 *
 * @param userId - The user's ID
 * @param cvId - The CV's ID
 * @returns Object with canEdit, canSave, canDownload permissions
 */
export async function checkCVAccess(
  userId: string,
  cvId: string
): Promise<{ canEdit: boolean; canSave: boolean; canDownload: boolean }> {
  try {
    const limits = await checkSubscriptionLimits(userId);
    const userCVs = await getUserCVs(userId);

    // Find the index of this CV (0-based)
    const cvIndex = userCVs.findIndex(cv => cv.id === cvId);

    if (cvIndex === -1) {
      // CV not found or doesn't belong to user
      return { canEdit: false, canSave: false, canDownload: false };
    }

    // Premium users can do everything
    if (limits.isPremium) {
      return { canEdit: true, canSave: true, canDownload: true };
    }

    // Free users can only edit/save/download their first two CVs (index 0 and 1)
    // They can edit 3rd+ CVs but cannot save or download them (preview mode)
    const isWithinFreeLimit = cvIndex <= 1;

    return {
      canEdit: true, // Free users can edit all their CVs
      canSave: isWithinFreeLimit, // Can only save first two CVs
      canDownload: isWithinFreeLimit, // Can only download first two CVs
    };
  } catch (error) {
    console.error('Error in checkCVAccess:', error);
    return { canEdit: false, canSave: false, canDownload: false };
  }
}
