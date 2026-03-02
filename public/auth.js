import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
     storageKey: "life-tasks-auth"   // ⭐ force one shared key

  }
});

/**
 * Sends the user to Google sign-in.
 * After login, Google redirects back to your app.
 */
export async function signInWithGoogle() {
  const currentPath = window.location.pathname;
  const basePath = currentPath.endsWith("/")
    ? currentPath
    : currentPath.slice(0, currentPath.lastIndexOf("/") + 1);

  await supabase.auth.signInWithOAuth({ provider: "google",  options: {
      redirectTo: `${window.location.origin}${basePath}index.html`,
      queryParams: { prompt: "select_account" }
    } 
});
}

/** Logs the user out */
export async function signOut() {
  await supabase.auth.signOut();
}

/** Returns current logged-in user (or null) */
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

/** Returns access token for authenticated calls (or null) */
export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}
