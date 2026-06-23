// Research COPS - Legal Policies Page Controller
// Fetches, compiles, and renders Privacy, Terms, and Cookies policies dynamically.
// Also loads dynamic company footer details.

document.addEventListener('DOMContentLoaded', () => {

  // 1. Header Scroll Dynamics
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('header-floating');
      } else {
        header.classList.remove('header-floating');
      }
    });
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const navDropdown = document.querySelector('.nav-dropdown');

  if (mobileToggle && navMenu) {
    // 1. Create/Retrieve Backdrop Overlay
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }

    // 2. Clone CTA button into drawer for mobile access
    let mobileCta = navMenu.querySelector('.mobile-cta');
    if (!mobileCta) {
      const desktopCta = document.querySelector('.nav-actions .btn');
      const href = desktopCta ? desktopCta.getAttribute('href') : 'index.html#contact';
      
      mobileCta = document.createElement('a');
      mobileCta.href = href;
      mobileCta.className = 'btn btn-primary btn-block mobile-cta';
      mobileCta.style.marginTop = '16px';
      mobileCta.textContent = 'Get a Quote';
      navMenu.appendChild(mobileCta);
      
      mobileCta.addEventListener('click', () => {
        closeMobileMenu();
      });
    }

    const closeMobileMenu = () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('nav-active');
      if (navDropdown) {
        navDropdown.classList.remove('active');
      }
    };

    // Toggle menu events
    mobileToggle.addEventListener('click', () => {
      const isActive = mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      overlay.classList.toggle('active', isActive);
      document.body.classList.toggle('nav-active', isActive);
      
      if (!isActive && navDropdown) {
        navDropdown.classList.remove('active');
      }
    });

    // Close menu when clicking the overlay
    overlay.addEventListener('click', closeMobileMenu);

    // Close menu when clicking normal links inside
    const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Handle solutions submenu toggle
  if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        navDropdown.classList.toggle('active');
      }
    });
  }

  // 3. Database Configurations
  const rcFirebaseConfig = {
    apiKey: "AIzaSyDknEqerA09CE3PT0L0m-nISkBCBPitWEw",
    authDomain: "research-cops-platform-e6520.firebaseapp.com",
    projectId: "research-cops-platform-e6520",
    storageBucket: "research-cops-platform-e6520.firebasestorage.app",
    messagingSenderId: "992558119740",
    appId: "1:992558119740:web:c484f96c5b774e9d17fc39",
    measurementId: "G-11SKJM62QW"
  };

  let rcDbMode = "local";
  let rcDb = null;

  const rcIsFirebaseConfigured = () => {
    return rcFirebaseConfig && 
           rcFirebaseConfig.apiKey && 
           !rcFirebaseConfig.apiKey.startsWith("YOUR_") && 
           rcFirebaseConfig.apiKey !== "";
  };

  if (rcIsFirebaseConfigured() && typeof firebase !== "undefined") {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(rcFirebaseConfig);
      }
      rcDb = firebase.firestore();
      rcDbMode = "firebase";
      console.log("Policy Hub: Database Connection -> Live Firebase");
    } catch (e) {
      console.error("Policy Hub: Firebase failed. LocalStorage Fallback enabled:", e);
    }
  }

  // 4. Default Policy Templates (HTML/Markdown fallback if database empty)
  const DEFAULT_POLICIES = {
    privacy: {
      title: "Privacy Policy",
      date: "Last Updated: June 2026",
      content: `# Privacy Policy\n\nAt **Research COPS** (accessible from [https://researchcops.com](https://researchcops.com)), one of our main priorities is the privacy of our visitors, B2B clients, and panel respondents. This Privacy Policy outlines the types of information we collect, how it is recorded and utilized, and the data protection measures we enforce across our global online sampling network, B2B APIs, and our proprietary **OpinionGenie** panel engine (accessible at [https://opiniongenie.com](https://opiniongenie.com)).\n\nIf you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at [info-team@researchcops.com](mailto:info-team@researchcops.com).\n\n## 1. Scope & Consent\nThis Privacy Policy applies to the Research COPS website, B2B research integrations, APIs, automated dashboard tools, and the OpinionGenie panel platform. By accessing our services, requesting project estimations via our CPI Calculator, utilizing our Support Genie chatbot, or enrolling in our survey panels, you consent to the collection and processing of your information under the terms of this policy.\n\n## 2. Information We Collect & Sources\nWe collect several categories of information depending on your interaction with our platforms:\n\n### A. Client and B2B Partner Data\n* **Contact Credentials**: Representative names, corporate email addresses, telephone numbers, and business mailing addresses.\n* **Billing and Payment Information**: Bank details, credit card processors, and invoice history required for project execution.\n* **Estimate Parameters**: Project scoping variables, sample sizes (N), target regions, demographics, and length of interview (LOI) entered in our CPI Calculator.\n* **Integration Metadata**: OAuth developer tokens, API keys, and target callback webhook URL configurations.\n\n### B. Respondent and Panelist Data (via OpinionGenie)\n* **Demographic Variables**: Age, gender, country, zip/postal code, household size, marital status, education level, and personal income.\n* **Professional and B2B Targeting Variables**: Employment status, job title, industry sector, company size, department, seniority level, and purchasing authority.\n* **Healthcare Specialist Profiling (HCP)**: Medical specialty, license number/NPI, practice setting, patient volume, and prescribing habits.\n* **Survey Responses**: Raw answers, feedback, text logs, and multimedia files submitted during active survey participation.\n\n### C. Technical Security and Audit Data\n* **Network Identifiers**: IP addresses, ISP details, and geographic coordinates (country, region, city).\n* **Device Signatures**: Browser user-agent strings, operating system versions, display resolutions, and hardware digital fingerprints.\n* **Quality Assurance Metrics**: Response-timing logs (speeders analysis), straight-lining indicators, and duplicate attempt scores.\n* **Traffic Quality**: VPN, proxy, and Tor exit node routing verification logs.\n\n## 3. How We Use Your Information\nWe process your personal information for specific, legally grounded operational purposes:\n* **Operating Research Infrastructure**: Launching B2B client surveys, routing eligible respondents, managing survey quotas, and compiling clean SPSS/CSV datasets.\n* **Anti-Fraud Security Audits**: Running real-time automated quality checks including speeder analysis, proxy/VPN blocking, and digital fingerprint deduplication to eliminate fraudulent response records.\n* **B2B API Integrations**: Syncing data quotas and sending real-time webhook status callbacks (Complete, Terminate, Overquota, Quality Terminate) to client CRM, ERP, or HRMS systems.\n* **Chatbot and Site Customization**: Caching Support Genie conversations, storing calculator defaults, and retaining welcome greeting bubble display states.\n* **Member Incentives**: Calculating panel points and processing financial payouts or gift card rewards for OpinionGenie members.\n\n## 4. Legal Basis for Processing (GDPR)\nFor users within the European Economic Area (EEA), we process personal data under the following legal grounds:\n* **Consent**: When you explicitly opt-in to join the OpinionGenie panel, receive newsletters, or share sensitive profiling data (e.g., healthcare specialties).\n* **Performance of a Contract**: When processing is necessary to execute client research agreements, manage B2B APIs, or distribute respondent incentives.\n* **Legitimate Interests**: To enforce platform security, perform quality control audits, detect survey bots, and maintain panel data integrity.\n\n## 5. Global Data Rights (GDPR & CCPA)\nWe respect your privacy rights and provide comprehensive compliance tools:\n* **Right to Access & Portability**: You can request a copy of the personal data we hold about you in a structured, machine-readable format.\n* **Right to Erasure & Rectification**: You can request that we correct inaccurate details or delete your panel account and associated profile data completely.\n* **Right to Object & Restrict**: You have the right to object to or restrict specific processing operations, such as data profiling or marketing outreach.\n* **CCPA \"Do Not Sell or Share\"**: We do not sell, rent, or trade your personally identifiable information to third parties. Respondents can opt-out of panel data sharing at any time.\n* **Exercise Your Rights**: To submit an access or deletion request, please email our data protection officer at [info-team@researchcops.com](mailto:info-team@researchcops.com). We will respond within 30 days.\n\n## 6. Data Transfer & Retention\n* **Cross-Border Transfers**: Research COPS operates across 31 countries. When transferring data internationally, we utilize Standard Contractual Clauses (SCCs) to ensure equivalent protection levels.\n* **Client Data Retention**: Billing logs and representative contract records are retained for 7 years to meet accounting compliance obligations.\n* **Respondent Data Retention**: OpinionGenie panel profiles are stored for the duration of the account membership. Survey response metadata and security audit logs are retained for 24 months to run historical fraud pattern analysis.\n\n## 7. Security Safeguards\nResearch COPS enforces enterprise-grade security protocols to protect your data:\n* **Encryption Standards**: All data in transit is encrypted using TLS 1.3, and databases at rest utilize AES-256 cryptographic standards.\n* **Access Isolation**: zero-knowledge configurations isolate identifying details from survey datasets.\n* **Access Control**: Role-based access control (RBAC) limits database tables only to verified research architects and systems engineers.`
    },
    terms: {
      title: "Terms & Conditions",
      date: "Last Updated: June 2026",
      content: `# Terms & Conditions\n\nWelcome to **Research COPS**!\n\nThese Terms & Conditions outline the rules and regulations for using the Research COPS website, B2B services, APIs, and the proprietary **OpinionGenie** panel platform, located at [https://researchcops.com](https://researchcops.com) and associated subdomains.\n\nBy accessing this website, utilizing our Support Genie chatbot, connecting to our webhook endpoints, or registering as an OpinionGenie respondent, you agree to comply with these terms. If you do not agree, you must discontinue using all our services immediately.\n\n## 1. B2B Services & CPI Calculator Projections\n* **Non-Binding Scoping**: All CPI calculations, project budgets, feasibility scores, and fielding timelines generated by our landing page CPI Calculator or the Support Genie chatbot are automated simulations for scoping.\n* **Final Bidding Desk Approval**: Formal project pricing, feasibility approvals, and schedules are subject to review and verification by the Research COPS bidding desk. No contract is formed until a formal statement of work is signed.\n\n## 2. API Integration & Webhook Compliance\n* **Credential Protection**: B2B partners integrating with the Research COPS sampling engine must keep OAuth keys, API tokens, and access credentials strictly confidential. You are solely responsible for any database queries or webhook actions triggered via your credentials.\n* **Rate Limits and Usage**: API consumers must adhere to rate limits and query constraints. Excessive queries, scraping, or attempts to bypass quota restrictions will result in token revocation and service suspension.\n* **Endpoint Security**: You agree to maintain a secure server endpoint to receive webhook callbacks. Research COPS is not liable for data exposure or security failures on client systems.\n\n## 3. Quality Control & Fraud Prevention\n* **Quality Gate Audits**: Every survey response passes through our security stack. We audit response speed (speeder checks), straight-lining patterns, VPN/proxy headers, and duplicate device IDs.\n* **Right to Reject Completes**: Research COPS reserves the absolute right to reject survey completions that fail automated quality gate audits. Clients will not be invoiced for rejected records, and respondents will not receive panel credits.\n* **Forfeiture and Deactivation**: Panelists who submit fraudulent data, bypass security gates, or run multiple accounts will have their accounts deactivated and all accumulated panel rewards forfeited.\n\n## 4. Survey & Concept Confidentiality\n* **Confidentiality Obligation**: As an OpinionGenie respondent or B2B evaluator, you may be exposed to proprietary concepts, advertisements, logo designs, video clips, or pre-release products. \n* **Prohibition of Leaks**: You are strictly prohibited from copying, photographing, screen-recording, or sharing survey materials on any public forum, social network, or platform. Any disclosure of confidential survey materials constitutes a material breach and will result in account termination and legal action for monetary damages.\n\n## 5. Intellectual Property Rights\n* **Proprietary Elements**: Unless otherwise stated, Research COPS and/or its licensors own all intellectual property rights for all material on this platform. This includes our proprietary survey programming logic, CPI Calculator algorithms, dashboard visualizations, API structures, and the OpinionGenie panel brand.\n* **License Restrictions**: You may not copy, republish, reproduce, sell, or rent any core codebase, website content, or panel database schemas from Research COPS.\n\n## 6. Disclaimers & Limitation of Liability\n* **As-Is Provision**: All services, trend feeds, insights articles, and automated reports are provided on an \"as-is\" and \"as-available\" basis, without warranties of any kind.\n* **No Reliance**: Advice or market insights displayed on our Insights Hub are for B2B informational purposes only and should not be relied upon as legal, financial, or strategic decisions.\n* **Limitation of Damages**: To the maximum extent permitted by law, Research COPS is not liable for direct, indirect, punitive, or consequential damages, including lost profits, database corruption, or system downtime arising from B2B API integrations. Clients agree to indemnify Research COPS for sync layer failures on the client side.`
    },
    cookies: {
      title: "Cookies Policy",
      date: "Last Updated: June 2026",
      content: `# Cookies Policy\n\nThis is the Cookies Policy for **Research COPS**, accessible from [https://researchcops.com](https://researchcops.com) and associated subdomains.\n\n## 1. What Are Cookies\nAs is common practice with almost all professional B2B websites, our platforms use cookies, which are tiny files downloaded to your computer, to improve your experience. This document outlines the information they collect, how we use them, and why we store these cookies. We also explain how you can prevent cookies from being saved, though doing so may degrade or break key features of the platform.\n\n## 2. How We Use Cookies\nWe utilize cookies for essential operations, security verification, and state caching:\n\n### A. Essential & Security Cookies\n* **Admin Authentication**: For administrators accessing the admin panel, we set session cookies to maintain your login status, avoiding the need to re-authenticate on every page.\n* **Fraud Prevention**: We employ security cookies to detect proxy/VPN usage, prevent multiple survey attempts from the same device, and identify robotic traffic.\n\n### B. Functional & Personalization Cookies\n* **Support Genie Chatbot**: Temporary cookies save chat dialog threads, keep track of input responses during screening, and cache chatbot tooltip welcome bubble close events.\n* **Calculator Parameters**: Cookies cache CPI calculator inputs (sample size, LOI, targeting parameters), allowing users to return to contact forms without losing their work.\n* **Call Scheduling**: Temporary state is saved when toggling between contact forms and the Calendly widget.\n\n### C. Performance & Analytics Cookies\n* **Traffic Insights**: We use Google Analytics cookies to track aggregate visitor behaviors, page view times, and referral paths to optimize platform performance. This data is fully anonymized.\n\n## 3. Managing and Disabling Cookies\nYou can prevent the setting of cookies by adjusting the settings in your browser (see your browser Help menu). Please note that disabling cookies will disable the CPI Calculator caching, Support Genie chatbot chat states, survey routing features, and admin dashboard authentication. Therefore, it is highly recommended to leave cookies enabled for a smooth platform experience.`
    }
  };;

  // Helper: Escape HTML
  function rcEscapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Simple Markdown Compiler
  function compileMarkdown(markdown) {
    if (!markdown) return "";
    let html = markdown;

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullet Lists
    html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, ''); // Join lists

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Paragraphs
    const lines = html.split('\n');
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li>')) return line;
      return `<p>${line}</p>`;
    });
    
    return processedLines.filter(l => l !== "").join('\n');
  }

  // Dynamic Footer Loader
  function loadFooterSettings() {
    const footerDesc = document.getElementById("footer-desc");
    const footerPhone = document.getElementById("footer-phone");
    const footerEmails = document.getElementById("footer-emails");
    const footerAddress = document.getElementById("footer-address");

    if (rcDbMode === "firebase" && rcDb) {
      rcDb.collection("settings").doc("footer").get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            updateFooterDOM(data);
          }
        })
        .catch(err => console.error("Error loading dynamic footer settings:", err));
    } else {
      const localFooter = JSON.parse(localStorage.getItem("rc_footer_settings"));
      if (localFooter) {
        updateFooterDOM(localFooter);
      }
    }

    function updateFooterDOM(data) {
      if (footerDesc && data.description) footerDesc.textContent = data.description;
      if (footerPhone && data.phone) {
        footerPhone.textContent = data.phone;
        footerPhone.href = `tel:${data.phone}`;
      }
      if (footerEmails && (data.emailInfo || data.emailBidding)) {
        let emailsHtml = "";
        if (data.emailInfo) emailsHtml += `<a href="mailto:${rcEscapeHtml(data.emailInfo)}">${rcEscapeHtml(data.emailInfo)}</a><br>`;
        if (data.emailBidding) emailsHtml += `<a href="mailto:${rcEscapeHtml(data.emailBidding)}">${rcEscapeHtml(data.emailBidding)}</a>`;
        footerEmails.innerHTML = emailsHtml;
      }
      if (footerAddress && data.address) {
        footerAddress.innerHTML = rcEscapeHtml(data.address).replace(/\n/g, "<br>");
      }
    }
  }

  // Fetch and display active policy
  function displayPolicy(policyId) {
    const loader = document.getElementById("policy-loader");
    const header = document.getElementById("policy-header");
    const viewer = document.getElementById("policy-content-viewer");
    const pTitle = document.getElementById("policy-title");
    const pDate = document.getElementById("policy-date");

    if (!loader || !viewer) return;

    // Show loading indicator, hide viewer
    loader.style.display = "flex";
    header.style.display = "none";
    viewer.style.display = "none";

    // Update active nav class
    document.querySelectorAll(".policy-nav-link").forEach(link => {
      link.classList.remove("active");
    });
    const activeLink = document.getElementById(`nav-${policyId}`);
    if (activeLink) activeLink.classList.add("active");

    const renderPolicyData = (title, content, updatedDate) => {
      pTitle.textContent = title;
      pDate.textContent = updatedDate || "June 2026";
      viewer.innerHTML = compileMarkdown(content);

      loader.style.display = "none";
      header.style.display = "block";
      viewer.style.display = "block";
    };

    if (rcDbMode === "firebase" && rcDb) {
      rcDb.collection("policies").doc(policyId).get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            renderPolicyData(data.title, data.content, data.updated);
          } else {
            // Seeding/Fallback
            const fallback = DEFAULT_POLICIES[policyId];
            renderPolicyData(fallback.title, fallback.content, "June 2026");
          }
        })
        .catch(err => {
          console.error("Firestore error loading policy, falling back:", err);
          const fallback = DEFAULT_POLICIES[policyId];
          renderPolicyData(fallback.title, fallback.content, "June 2026");
        });
    } else {
      // LocalStorage fallback
      const localPolicies = JSON.parse(localStorage.getItem("rc_policies") || "{}");
      if (localPolicies[policyId]) {
        renderPolicyData(localPolicies[policyId].title, localPolicies[policyId].content, localPolicies[policyId].updated);
      } else {
        const fallback = DEFAULT_POLICIES[policyId];
        renderPolicyData(fallback.title, fallback.content, "June 2026");
      }
    }
  }

  // Parse URL ID parameters
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Setup tab switcher event listeners
  function setupPolicyNav() {
    document.querySelectorAll(".policy-nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const hrefAttr = link.getAttribute("href");
        const policyId = hrefAttr.split("id=")[1];
        
        displayPolicy(policyId);
        
        // Push state to browser history
        history.pushState(null, "", hrefAttr);
      });
    });
  }

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    const policyId = getQueryParam("id") || "privacy";
    displayPolicy(policyId);
  });

  // Initialization sequence
  setTimeout(() => {
    loadFooterSettings();
    setupPolicyNav();
    const activePolicy = getQueryParam("id") || "privacy";
    displayPolicy(activePolicy);
  }, 100);

  // ----------------------------------------------------
  // Interactive Glass Card Cursor Spotlight
  // ----------------------------------------------------
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

});
