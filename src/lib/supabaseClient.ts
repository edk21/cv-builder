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
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: {
              path?: string;
              maxAge?: number;
              domain?: string;
              sameSite?: string;
              secure?: boolean;
            };
          }>
        ) {
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
            if (options?.sameSite) {
              cookieString += `; samesite=${options.sameSite}`;
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
