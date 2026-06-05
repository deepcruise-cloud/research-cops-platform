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
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
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
      content: `# Privacy Policy

At **Research COPS**, accessible from [https://researchcops.com](https://researchcops.com), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Research COPS and how we use it.

If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.

## 1. Consent
By using our website, you hereby consent to our Privacy Policy and agree to its terms.

## 2. Information We Collect
The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
* If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
* When you request a B2B project estimate or chat with our Support Genie, we collect contact credentials (name, email, phone) alongside project parameters (sample size, CPI margin) to build your proposal.

## 3. How We Use Your Information
We use the information we collect in various ways, including to:
* Provide, operate, and maintain our website
* Improve, personalize, and expand our website
* Understand and analyze how you use our website
* Develop new products, services, features, and functionality
* Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes
* Send you emails
* Find and prevent fraud

## 4. Log Files
Research COPS follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.`
    },
    terms: {
      title: "Terms & Conditions",
      date: "Last Updated: June 2026",
      content: `# Terms & Conditions

Welcome to **Research COPS**!

These terms and conditions outline the rules and regulations for the use of Research COPS's Website, located at [https://researchcops.com](https://researchcops.com).

By accessing this website we assume you accept these terms and conditions. Do not continue to use Research COPS if you do not agree to take all of the terms and conditions stated on this page.

## 1. Cookies
We employ the use of cookies. By accessing Research COPS, you agreed to use cookies in agreement with the Research COPS's Privacy Policy.

Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.

## 2. License
Unless otherwise stated, Research COPS and/or its licensors own the intellectual property rights for all material on Research COPS. All intellectual property rights are reserved. You may access this from Research COPS for your own personal use subjected to restrictions set in these terms and conditions.

You must not:
* Republish material from Research COPS
* Sell, rent or sub-license material from Research COPS
* Reproduce, duplicate or copy material from Research COPS
* Redistribute content from Research COPS

## 3. B2B Project Estimates
Estimates generated by our landing page CPI Calculator or Support Genie chatbot represent initial automated scoping models. Final contract pricing, feasibility scores, and fielding timelines are subject to verification and formal agreement by the Research COPS bidding desk.

## 4. Reservation of Rights
We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.`
    },
    cookies: {
      title: "Cookies Policy",
      date: "Last Updated: June 2026",
      content: `# Cookies Policy

This is the Cookies Policy for **Research COPS**, accessible from [https://researchcops.com](https://researchcops.com).

## 1. What Are Cookies
As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use them and why we need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.

## 2. How We Use Cookies
We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.

## 3. The Cookies We Set
* **Account/Session Cookies**: If you log into our admin portal, cookies are used to manage the active session. This prevents you from having to log in every single time you visit a new page.
* **Forms-related Cookies**: When you submit data through a form such as those found on contact pages or poll widgets, cookies may be set to remember your user details for future correspondence.
* **Support Genie Chat Cookies**: We use session storage cookies to remember your chatbot conversation steps and welcome tooltip dismissals during a single active browsing session.

## 4. Disabling Cookies
You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.`
    }
  };

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

});
