import { createServerClient } from "@supabase/ssr";
import type { CookieOptions, SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, normalizeOptions(options))
            );
          } catch {
            // Server Component - cookies are read-only
          }
        },
      },
    }
  );
}

function normalizeOptions(options?: CookieOptions) {
  if (!options) return undefined;
  if (options.sameSite === undefined) return options;
  return {
    ...options,
    sameSite: normalizeSameSite(options),
  };
}

function normalizeSameSite(options: CookieOptions) {
  if (options.sameSite === true) return "strict";
  if (options.sameSite === false) return undefined;
  return options.sameSite;
}
