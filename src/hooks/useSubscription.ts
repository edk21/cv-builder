"use client";

import { useState, useEffect } from "react";
import type { SubscriptionCheck } from "@/lib/subscriptionService";

/**
 * Client-side: Fetch subscription status from API
 */
async function fetchSubscriptionStatus(): Promise<SubscriptionCheck | null> {
  try {
    const response = await fetch('/api/user/subscription');
    if (!response.ok) {
      console.error('Failed to fetch subscription status:', response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return null;
  }
}

/**
 * React hook to fetch and manage subscription status
 * Returns subscription information and permissions
 */
export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionCheck | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await fetchSubscriptionStatus();
      setSubscription(data);
    } catch (error) {
      console.error("Error refreshing subscription:", error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    subscription,
    loading,
    refresh,
    // Convenience properties (with safe defaults)
    isPremium: subscription?.isPremium || false,
    planType: subscription?.planType || "free",
    cvCount: subscription?.cvCount || 0,
    cvLimit: subscription?.cvLimit,
    canCreateCV: subscription?.canCreateCV || false,
    canSaveCV: subscription?.canSaveCV || false,
    canDownloadCV: subscription?.canDownloadCV || false,
    canDuplicate: subscription?.canDuplicate || false,
  };
}
