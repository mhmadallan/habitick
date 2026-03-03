// Initialize and manage dark mode theme
function initTheme() {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  
  console.log('initTheme called, themeToggle element:', themeToggle);
  
  // Load saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  
  console.log('Saved theme:', savedTheme, 'Prefers dark:', prefersDark, 'Will set dark:', isDark);
  
  // Set initial theme
  if (isDark) {
    html.classList.add('dark');
    if (themeToggle) themeToggle.textContent = '☀️';
    console.log('Dark mode enabled, html class:', html.className);
  } else {
    html.classList.remove('dark');
    if (themeToggle) themeToggle.textContent = '🌙';
    console.log('Light mode enabled, html class:', html.className);
  }
  
  // Handle toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDarkMode = html.classList.toggle('dark');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
      console.log('Theme toggled to:', isDarkMode ? 'dark' : 'light', 'html class:', html.className);
    });
  } else {
    console.warn('themeToggle button not found');
  }
}

// Initialize immediately if DOM is ready, or wait for it
if (document.readyState === 'loading') {
  console.log('DOM still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  console.log('DOM already loaded, initializing theme immediately');
  initTheme();
}
