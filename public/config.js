export const SUPABASE_URL = "https://dnsixjnweygqzootghnw.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuc2l4am53ZXlncXpvb3RnaG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3ODE0OTcsImV4cCI6MjA4NDM1NzQ5N30.RupprhYcwt-wo1REapQbWyIsuubmO9FAS_bAvdrkrwY";

const apiBaseFromGlobal = window.HABITICK_API_BASE_URL || "";
const apiBaseFromMeta = document
	.querySelector('meta[name="habitick-api-base"]')
	?.getAttribute("content") || "";

const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

export const API_BASE_URL = (apiBaseFromGlobal || apiBaseFromMeta || (isLocalhost ? "http://localhost:3000" : "")).replace(/\/$/, "");

export function apiUrl(path) {
	if (!path.startsWith("/")) throw new Error("apiUrl path must start with '/'");
	return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}