import { supabase, signOut } from "./auth.js";

const userEmailEl = document.getElementById("userEmail");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

function setLoggedOut() {
  userEmailEl.textContent = "—";
  loginBtn.classList.remove("hidden");
  signupBtn?.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
}

function setLoggedIn(email) {
  userEmailEl.textContent = email;
  loginBtn.classList.add("hidden");
  signupBtn?.classList.add("hidden");
  logoutBtn.classList.remove("hidden");
}

// This waits for Supabase to load the session from storage
async function initAuthUI() {
  // 1) Read session (this is the most reliable on first load)
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user?.email) setLoggedIn(session.user.email);
  else setLoggedOut();

  // 2) Keep UI in sync if auth changes later
  supabase.auth.onAuthStateChange((_event, newSession) => {
    if (newSession?.user?.email) setLoggedIn(newSession.user.email);
    else setLoggedOut();
  });

  loginBtn?.addEventListener("click", () => {
    window.location.href = "signin.html";
  });
  signupBtn?.addEventListener("click", () => {
    window.location.href = "signup.html";
  });
  logoutBtn?.addEventListener("click", async () => {
  await signOut();
  window.location.href = "index.html";
});

}

initAuthUI();
