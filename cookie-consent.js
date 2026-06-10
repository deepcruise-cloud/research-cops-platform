// Research COPS - Cookie Consent Banner Manager
// Dynamically constructs, styles, and injects GDPR-compliant consent controls.
// Aligns layouts to prevent overlapping with the Support Genie chatbot.

document.addEventListener("DOMContentLoaded", () => {
  const CONSENT_KEY = "rc_cookie_consent";
  const activeConsent = localStorage.getItem(CONSENT_KEY);

  // If consent is already given, do not show banner
  if (activeConsent) {
    return;
  }

  // 1. Shift Support Genie position upwards
  document.body.classList.add("cookie-banner-active");

  // 2. Create Banner Container
  const banner = document.createElement("div");
  banner.id = "cookie-consent-banner";
  banner.className = "cookie-banner-card glass-card";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");

  // 3. Inject Banner Markup
  banner.innerHTML = `
    <div class="cookie-banner-content">
      <div class="cookie-banner-header">
        <svg class="cookie-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#04cbc2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5z"></path>
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path>
          <circle cx="7.5" cy="11.5" r="1" fill="#04cbc2"></circle>
          <circle cx="11.5" cy="16.5" r="1.5" fill="#04cbc2"></circle>
          <circle cx="15.5" cy="11.5" r="1" fill="#04cbc2"></circle>
        </svg>
        <h4>Cookie & Data Consent</h4>
      </div>
      <p>
        We use essential local storage cookies to maintain administrator sessions, protect platform API security, cache calculator scoping estimates, and save Support Genie chatbot conversations. 
        By choosing <strong>Accept All</strong>, you agree to our terms. Read our <a href="policy.html?id=cookies" class="cookie-policy-link">Cookies Policy</a>.
      </p>
    </div>
    <div class="cookie-banner-actions">
      <button id="btn-cookie-decline" class="btn btn-outline btn-sm" aria-label="Decline cookies">Decline</button>
      <button id="btn-cookie-accept" class="btn btn-primary btn-sm" aria-label="Accept all cookies">Accept All</button>
    </div>
  `;

  // 4. Append to DOM
  document.body.appendChild(banner);

  // 5. Setup Action Event Listeners
  const btnAccept = document.getElementById("btn-cookie-accept");
  const btnDecline = document.getElementById("btn-cookie-decline");

  const dismissBanner = (status) => {
    localStorage.setItem(CONSENT_KEY, status);
    
    // Add fade-out animation class
    banner.classList.add("fade-out");
    
    // Transition Support Genie back down smoothly
    document.body.classList.remove("cookie-banner-active");

    // Remove element from DOM after transition finishes
    setTimeout(() => {
      banner.remove();
    }, 400);
  };

  if (btnAccept) {
    btnAccept.addEventListener("click", () => dismissBanner("accepted"));
  }

  if (btnDecline) {
    btnDecline.addEventListener("click", () => dismissBanner("declined"));
  }
});
