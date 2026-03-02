import { signInWithGoogle, signUpWithEmail, supabase } from "./auth.js";

const signupForm = document.getElementById("signupForm");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const confirmPasswordEl = document.getElementById("confirmPassword");
const submitBtn = document.getElementById("submitBtn");
const googleBtn = document.getElementById("googleBtn");
const messageEl = document.getElementById("message");
const errorEl = document.getElementById("error");

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.remove("hidden");
}

function hideMessage() {
  messageEl.textContent = "";
  messageEl.classList.add("hidden");
}

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

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError();
  hideMessage();

  const email = emailEl.value.trim();
  const password = passwordEl.value;
  const confirmPassword = confirmPasswordEl.value;

  if (!email) {
    showError("Please enter your email.");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating...";

  try {
    const { data, error } = await signUpWithEmail(email, password);
    if (error) throw error;

    if (data?.session) {
      window.location.href = "index.html";
      return;
    }

    showMessage("Account created. Check your email to confirm, then sign in.");
    signupForm.reset();
  } catch (error) {
    showError(error?.message || "Could not create account.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Create account";
  }
});

googleBtn?.addEventListener("click", async () => {
  hideError();
  hideMessage();
  await signInWithGoogle();
});

redirectIfLoggedIn();
