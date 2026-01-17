import type { CookieOptions, SetAllCookies } from "@supabase/ssr";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie.split("; ").map((cookie) => {
            const [name, ...rest] = cookie.split("=");
            return { name, value: decodeURIComponent(rest.join("=")) };
          });
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            let cookieString = `${name}=${encodeURIComponent(value)}`;

            if (options?.path) {
              cookieString += `; path=${options.path}`;
            }
            if (options?.maxAge) {
              cookieString += `; max-age=${options.maxAge}`;
            }
            if (options?.domain) {
              cookieString += `; domain=${options.domain}`;
            }
            if (options?.sameSite !== undefined) {
              const sameSite = normalizeSameSite(options);
              if (sameSite) {
                cookieString += `; samesite=${sameSite}`;
              }
            }
            if (options?.secure) {
              cookieString += `; secure`;
            }

            document.cookie = cookieString;
          });
        },
      },
    }
  );
}

function normalizeSameSite(options?: CookieOptions) {
  if (!options || options.sameSite === undefined) return undefined;
  if (options.sameSite === true) return "strict";
  if (options.sameSite === false) return undefined;
  return options.sameSite;
}
