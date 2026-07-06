(function() {
  // Theme initialization to prevent FOUC (Flash of Unstyled Content)
  // File: theme.js
  
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // default is dark mode
    document.documentElement.classList.toggle('light', savedTheme === 'light');
  }
  
  initTheme();

  function updateToggleLabels() {
    const isLight = document.documentElement.classList.contains('light');
    const labels = document.querySelectorAll('.theme-toggle-label');
    labels.forEach(lbl => {
      lbl.textContent = isLight ? 'Light Mode' : 'Dark Mode';
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
        const isLight = document.documentElement.classList.toggle('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateToggleLabels();
        
        // Broadcast custom event so dynamic charts/SVG nodes can adjust if necessary
        window.dispatchEvent(new Event('themechange'));
      });
    });
  });
})();
