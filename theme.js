(function() {
  // Theme initialization to prevent FOUC (Flash of Unstyled Content)
  // File: theme.js
  
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }
  
  initTheme();

  function updateToggleLabels() {
    const isDark = document.documentElement.classList.contains('dark');
    const labels = document.querySelectorAll('.theme-toggle-label');
    labels.forEach(lbl => {
      lbl.textContent = isDark ? 'Dark Mode' : 'Light Mode';
    });
  }

  // Handle setting up event listener once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    updateToggleLabels();
    
    // Find all theme toggles on the page
    const toggleBtns = document.querySelectorAll('#theme-toggle');
    
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateToggleLabels();
        
        // Broadcast custom event so dynamic charts/SVG nodes can adjust if necessary
        window.dispatchEvent(new Event('themechange'));
      });
    });
  });
})();
