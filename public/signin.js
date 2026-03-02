import { signInWithEmail, signInWithGoogle, supabase } from "./auth.js";

const signinForm = document.getElementById("signinForm");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const googleBtn = document.getElementById("googleBtn");
const errorEl = document.getElementById("error");

function showError(text) {
  errorEl.textContent = text;
  errorEl.classList.remove("hidden");
}

function hideError() {
  errorEl.textContent = "";
  errorEl.classList.add("hidden");
}

async function redirectIfLoggedIn() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session?.user) {
    window.location.href = "index.html";
  }
}

signinForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError();

  const email = emailEl.value.trim();
  const password = passwordEl.value;

  if (!email) {
    showError("Please enter your email.");
    return;
  }

  if (!password) {
    showError("Please enter your password.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in...";

  try {
    const { error } = await signInWithEmail(email, password);
    if (error) throw error;

    window.location.href = "index.html";
  } catch (error) {
    showError(error?.message || "Could not sign in.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Sign in";
  }
});

googleBtn?.addEventListener("click", async () => {
  hideError();
  await signInWithGoogle();
});

redirectIfLoggedIn();
