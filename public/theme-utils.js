// Initialize and manage dark mode theme
export function initTheme() {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  
  // Load saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  
  // Set initial theme
  if (isDark) {
    html.classList.add('dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  } else {
    html.classList.remove('dark');
    if (themeToggle) themeToggle.textContent = '🌙';
  }
  
  // Handle toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDarkMode = html.classList.toggle('dark');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    });
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', initTheme);
