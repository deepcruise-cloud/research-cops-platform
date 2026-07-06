(function() {
  // Theme initialization to prevent FOUC (Flash of Unstyled Content)
  // File: theme.js
  
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }
  
  initTheme();

  // Handle setting up event listener once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Find all theme toggles on the page
    const toggleBtns = document.querySelectorAll('#theme-toggle');
    
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Broadcast custom event so dynamic charts/SVG nodes can adjust if necessary
        window.dispatchEvent(new Event('themechange'));
      });
    });
  });
})();
