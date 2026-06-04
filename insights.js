// Research COPS - Insights Hub Page Controller
// Supports searching, dynamic filtering, active poll sync, and deep-linked markdown reading mode.

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

  // 3. Database Configurations (Identical to app.js)
  const rcFirebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  let rcDbMode = "local";
  let rcDb = null;

  // Seeding backup configurations
  const RC_DEFAULT_BLOGS = [
    {
      id: "blog-1",
      title: "Automating ERP Integrations: Bridging Database Silos in Enterprise Environments",
      category: "Integration",
      readtime: "6 min read",
      excerpt: "How custom middleware and automated sync routines eliminate manual invoicing errors, streamline data mapping, and reduce overhead by 75%.",
      content: "ERP integrations represent one of the most critical backbones of modern B2B business operations. When records are siloed across isolated systems, team productivity drops and entry errors multiply.\n\n### Key Pillars of ERP Database Synchronization\n1. **Establish Secure API Middlewares**: Implement robust OAuth 2.0 validation checks to safeguard token requests.\n2. **Optimize Data Mappings**: Resolve discrepancies by setting strict primary key mapping routines.\n3. **Automate Invoice Reconciliations**: Establish hourly sync gates that query billing endpoints, run auditing algorithms, and log reports automatically.\n\nBy following this structured approach, enterprises can achieve complete data harmony and streamline operational speed.",
      date: "May 2026",
      featured: false,
      timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000
    },
    {
      id: "blog-2",
      title: "Workforce Optimization: Designing Next-Gen HRMS Workflows",
      category: "Automation",
      readtime: "5 min read",
      excerpt: "Strategies for automating employee onboarding, payroll allocations, and performance evaluations without database discrepancies.",
      content: "Workforce optimization is no longer just about management—it is about technology. Siloed employee records, manual payroll calculation scripts, and disconnected onboarding spreadsheets slow down human resources.\n\n### Strategic Onboarding Flows\n* **Single-Point Dispatch**: Entering a new hire automatically maps profiles to payroll registers, active directories, and security rosters.\n* **Automated Escalation Logic**: Triggers custom notifications to coordinators when tasks linger in cue.\n* **Real-time Payroll Auditing**: Automated background checkpoints scan ledger registers to eliminate discrepancy flags before allocations execute.\n\nModern workflow configurations keep teams agile, reducing admin lifecycle delays.",
      date: "April 2026",
      featured: false,
      timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000
    },
    {
      id: "blog-3",
      title: "Secure Middleware: Auditing Enterprise Database Sync Protocols",
      category: "Security",
      readtime: "8 min read",
      excerpt: "Establishing robust cryptographic security and token rotations across internal database integrations.",
      content: "When synchronizing logs and operational data between external endpoints and main ERP clusters, establishing high-standard database security is critical.\n\n### Security Best Practices\n1. **Cryptographic Validation**: Hash sensitive variables using secure protocols prior to data synchronization checkpoints.\n2. **Dynamic Token Rotation**: Rotate API tokens dynamically and monitor endpoints for unauthorized access traces.\n3. **Role-Based Access Logs**: Configure custom permissions so only designated admin sessions can update sync settings.\n\nEnsuring strict compliance protections helps protect valuable operations from network breaches.",
      date: "March 2026",
      featured: false,
      timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000
    },
    {
      id: "blog-featured",
      title: "The ROI of Automation: Eliminating Manual Reconciliations",
      category: "Automation",
      readtime: "6 min read",
      excerpt: "How enterprise automation platforms audit billing registers, match ledger logs, and minimize transaction processing delays.",
      content: "Manual billing reconciliation is slow, expensive, and prone to user error. Automated ledger matching engines can scan registers, verify billing logs, and resolve discrepancies in seconds.\n\n### The Operations Advantage\n* **Ledger Auditing**: Match incoming ledgers against internal database invoices instantly.\n* **Discrepancy Flags**: Identify and report mismatch issues in real-time, preventing transaction delays.\n* **Automated Callbacks**: Trigger API webhooks to update dashboard metrics as soon as matching resolves.\n\nResearch COPS custom workflow connectors are engineered to automate operations directly across enterprise setups.",
      date: "June 2026",
      featured: true,
      timestamp: Date.now()
    }
  ];

  const RC_DEFAULT_NEWS = [
    {
      id: "news-1",
      title: "Automated Ledger Reconciliation Engine v2.1 Released",
      category: "Platform",
      details: "Deployment of cross-register ledger matching engine reduces reconciliation cycles from days to under 15 minutes.",
      date: "June 2026",
      timestamp: Date.now()
    },
    {
      id: "news-2",
      title: "Custom ERP Sync Connector Upgraded to REST OAuth 2.0",
      category: "Security",
      details: "Integration of automated token refresh sequences and role-based data views for secure database mapping.",
      date: "May 2026",
      timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000
    },
    {
      id: "news-3",
      title: "HRMS Onboarding Workflows Speed Up",
      category: "Automation",
      details: "Optimized automated script mappings reduce new hire document routing times by 80% globally.",
      date: "April 2026",
      timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000
    }
  ];

  const RC_DEFAULT_POLL = {
    id: "active-poll",
    question: "What is your organization's primary operational bottleneck?",
    options: {
      a: { text: "Manual Billing & Reconciliation", votes: 45 },
      b: { text: "Siloed HRMS & Employee Data", votes: 78 },
      c: { text: "Legacy ERP Integration Issues", votes: 32 },
      d: { text: "Inefficient Document Workflows", votes: 19 }
    }
  };

  // Helper function to escape HTML
  function rcEscapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Compile Markdown to Basic Styled HTML
  function compileMarkdown(markdown) {
    if (!markdown) return "";
    let html = rcEscapeHtml(markdown);
    
    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3 style="color:var(--turquoise-accent); font-family:var(--font-family-display); font-size: 19px; font-weight:600; margin-top:25px; margin-bottom:12px;">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 style="color:var(--text-light); font-family:var(--font-family-display); font-size: 22px; font-weight:600; margin-top:30px; margin-bottom:15px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 style="color:var(--text-light); font-family:var(--font-family-display); font-size: 26px; font-weight:700; margin-top:35px; margin-bottom:20px;">$1</h1>');
    
    // List elements
    html = html.replace(/^\* (.*?)$/gm, '<li style="margin-left: 24px; margin-bottom: 8px; color: var(--text-light); list-style-type: square; line-height: 1.6;">$1</li>');
    html = html.replace(/^- (.*?)$/gm, '<li style="margin-left: 24px; margin-bottom: 8px; color: var(--text-light); list-style-type: square; line-height: 1.6;">$1</li>');
    html = html.replace(/^\d+\.\s+(.*?)$/gm, '<li style="margin-left: 24px; margin-bottom: 8px; color: var(--text-light); list-style-type: decimal; line-height: 1.6;">$1</li>');

    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Split paragraphs
    const lines = html.split(/\n\n+/);
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li')) {
        return line;
      }
      return `<p style="margin-bottom: 15px; line-height: 1.7; color: #cbd5e1; font-size: 15px;">${line}</p>`;
    });

    return formatted.join("\n");
  }

  // Database Connection Initialization
  const rcIsFirebaseConfigured = () => {
    return rcFirebaseConfig && 
           rcFirebaseConfig.apiKey && 
           !rcFirebaseConfig.apiKey.startsWith("YOUR_") && 
           rcFirebaseConfig.apiKey !== "";
  };

  if (rcIsFirebaseConfigured() && typeof firebase !== "undefined") {
    try {
      firebase.initializeApp(rcFirebaseConfig);
      rcDb = firebase.firestore();
      rcDbMode = "firebase";
      console.log("Insights Hub: Database Connection -> Live Firebase");
    } catch (e) {
      console.error("Insights Hub: Firebase failed. LocalStorage Fallback enabled:", e);
      setupInsightsLocalFallback();
    }
  } else {
    setupInsightsLocalFallback();
  }

  function setupInsightsLocalFallback() {
    rcDbMode = "local";
    console.log("Insights Hub: Database Connection -> LocalStorage Fallback Mode");
    
    // Migration check: Clear old market research content to allow new workflow/HRMS/ERP content to seed
    const legacyCheck = localStorage.getItem("rc_blogs");
    if (legacyCheck && (
      legacyCheck.includes("concept-testing") || 
      legacyCheck.includes("bot-intrusion") || 
      legacyCheck.includes("panelist") || 
      legacyCheck.includes("OpinionGenie") ||
      legacyCheck.includes("Panel") || 
      legacyCheck.includes("Survey") ||
      legacyCheck.includes("Opinion Genie")
    )) {
      console.log("Legacy market research data detected in localStorage. Clearing database keys to re-seed.");
      localStorage.removeItem("rc_blogs");
      localStorage.removeItem("rc_news");
      localStorage.removeItem("rc_poll");
      localStorage.removeItem("rc_user_voted");
    }

    if (!localStorage.getItem("rc_blogs")) {
      localStorage.setItem("rc_blogs", JSON.stringify(RC_DEFAULT_BLOGS));
    }
    if (!localStorage.getItem("rc_news")) {
      localStorage.setItem("rc_news", JSON.stringify(RC_DEFAULT_NEWS));
    }
    if (!localStorage.getItem("rc_poll")) {
      localStorage.setItem("rc_poll", JSON.stringify(RC_DEFAULT_POLL));
    }
  }

  // State Management
  let allFeedItems = [];
  let currentCategoryFilter = "all";
  let currentSearchQuery = "";

  // Elements
  const feedList = document.getElementById("insights-feed-list");
  const feedView = document.getElementById("feed-view-container");
  const readerView = document.getElementById("reader-view-container");
  const readerArticle = document.getElementById("reader-article-content");
  
  const searchInput = document.getElementById("insights-search-input");
  const filterTags = document.querySelectorAll(".filter-tag");
  
  const backBtn = document.getElementById("reader-back-btn");
  const backBtnFooter = document.getElementById("reader-back-btn-footer");

  // Initialize and Fetch Hub Feed Data
  function loadHubFeed() {
    if (rcDbMode === "firebase") {
      // Fetch both blogs and news and compile
      Promise.all([
        rcDb.collection("blogs").orderBy("timestamp", "desc").get(),
        rcDb.collection("news").orderBy("timestamp", "desc").get()
      ]).then(([blogsSnap, newsSnap]) => {
        allFeedItems = [];
        
        blogsSnap.forEach(doc => {
          const blog = doc.data();
          blog.id = doc.id;
          blog.type = "blog";
          allFeedItems.push(blog);
        });

        newsSnap.forEach(doc => {
          const news = doc.data();
          news.id = doc.id;
          news.type = "news";
          // Map schema keys to display items
          news.readtime = "Quick read";
          news.excerpt = news.details.length > 120 ? news.details.slice(0, 117) + "..." : news.details;
          news.content = news.details;
          allFeedItems.push(news);
        });

        // Seed fallbacks if DB empty
        if (allFeedItems.length === 0) {
          loadLocalFeedItems();
        } else {
          allFeedItems.sort((a, b) => b.timestamp - a.timestamp);
        }
        
        applyFiltersAndRender();
        checkUrlForDeepLinking();
      }).catch(err => {
        console.error("Error fetching live database feed:", err);
        loadLocalFeedItems();
        applyFiltersAndRender();
        checkUrlForDeepLinking();
      });
    } else {
      loadLocalFeedItems();
      applyFiltersAndRender();
      checkUrlForDeepLinking();
    }
  }

  function loadLocalFeedItems() {
    allFeedItems = [];
    const localBlogs = JSON.parse(localStorage.getItem("rc_blogs") || "[]");
    const localNews = JSON.parse(localStorage.getItem("rc_news") || "[]");

    localBlogs.forEach(blog => {
      blog.type = "blog";
      allFeedItems.push(blog);
    });

    localNews.forEach(news => {
      news.type = "news";
      news.readtime = "Quick read";
      news.excerpt = news.details.length > 120 ? news.details.slice(0, 117) + "..." : news.details;
      news.content = news.details;
      allFeedItems.push(news);
    });

    allFeedItems.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Render cards
  function renderFeedCards(items) {
    if (!feedList) return;
    feedList.innerHTML = "";

    if (items.length === 0) {
      feedList.innerHTML = `
        <div class="glass-card" style="padding: 40px; text-align: center; color: var(--text-muted); border-radius: var(--radius-md);">
          No matching articles found. Try adjusting your search query or filters.
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "blog-card glass-card insights-feed-card";
      card.style.cursor = "pointer";
      
      const badgeClass = item.type === "news" ? "badge-teal" : "blog-cat";
      const displayCategory = item.type === "news" ? `News: ${item.category}` : item.category;

      card.innerHTML = `
        <div class="${badgeClass}" style="display: inline-block; margin-bottom: 12px;">${rcEscapeHtml(displayCategory)}</div>
        <h4 style="font-family: var(--font-family-display); font-size: 19px; font-weight: 600; color: var(--text-light); margin-bottom: 10px;">
          ${rcEscapeHtml(item.title)}
        </h4>
        <p style="color: var(--text-muted); font-size: 13.5px; line-height: 1.5; margin-bottom: 15px;">
          ${rcEscapeHtml(item.excerpt)}
        </p>
        <div class="blog-meta" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 12px; font-size: 12px; color: var(--text-muted);">
          <span>📅 ${rcEscapeHtml(item.date)}</span>
          <span style="display: flex; align-items: center; gap: 15px;">
            <span>⏱ ${rcEscapeHtml(item.readtime)}</span>
            <span class="blog-link" style="color: var(--turquoise-accent); font-weight:600; text-decoration: underline;">Read Detail &rarr;</span>
          </span>
        </div>
      `;

      card.addEventListener("click", () => {
        setReaderUrlParam(item.type, item.id);
      });

      feedList.appendChild(card);
    });
  }

  // Filter application
  function applyFiltersAndRender() {
    let filtered = allFeedItems;

    // Filter by category
    if (currentCategoryFilter !== "all") {
      if (currentCategoryFilter === "News") {
        filtered = filtered.filter(item => item.type === "news");
      } else {
        filtered = filtered.filter(item => item.category === currentCategoryFilter && item.type === "blog");
      }
    }

    // Filter by search
    if (currentSearchQuery !== "") {
      const q = currentSearchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    renderFeedCards(filtered);
  }

  // Search input change
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value.trim();
      applyFiltersAndRender();
    });
  }

  // Filter tag buttons
  filterTags.forEach(btn => {
    btn.addEventListener("click", () => {
      filterTags.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategoryFilter = btn.getAttribute("data-filter");
      applyFiltersAndRender();
    });
  });

  // READER MODE CONTROLLER
  function setReaderUrlParam(type, id) {
    const params = new URLSearchParams(window.location.search);
    params.set("type", type);
    params.set("id", id);
    window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
    checkUrlForDeepLinking();
  }

  function clearReaderUrlParam() {
    window.history.pushState({}, "", window.location.pathname);
    checkUrlForDeepLinking();
  }

  function checkUrlForDeepLinking() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const type = params.get("type");

    if (id && type) {
      const article = allFeedItems.find(item => item.id === id && item.type === type);
      if (article) {
        showArticleInReader(article);
      } else {
        // Fallback if not loaded/found
        showFeedView();
      }
    } else {
      showFeedView();
    }
  }

  function showArticleInReader(article) {
    if (!readerView || !feedView || !readerArticle) return;
    
    feedView.style.display = "none";
    readerView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });

    const isNews = article.type === "news";
    const headerBadgeClass = isNews ? "badge-teal" : "blog-cat";
    const headerCategory = isNews ? `News Alerts: ${article.category}` : article.category;
    
    const displayBodyHtml = isNews ? `<p style="font-size:16px; line-height:1.7; color:#e2e8f0; white-space: pre-wrap;">${rcEscapeHtml(article.content)}</p>` : compileMarkdown(article.content);

    readerArticle.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="${headerBadgeClass}" style="display:inline-block; margin-bottom: 15px;">${rcEscapeHtml(headerCategory)}</span>
        <h1 style="font-family: var(--font-family-display); font-size: 32px; font-weight: 700; color: var(--text-light); line-height:1.3; margin-bottom: 15px;">
          ${rcEscapeHtml(article.title)}
        </h1>
        <div style="display: flex; gap: 20px; font-size: 13.5px; color: var(--text-muted); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px;">
          <span>📅 Date: <strong>${rcEscapeHtml(article.date)}</strong></span>
          <span>⏱ Length: <strong>${rcEscapeHtml(article.readtime)}</strong></span>
        </div>
      </div>
      
      <!-- Content Area -->
      <div class="reader-markdown-body" style="margin-top: 30px;">
        ${displayBodyHtml}
      </div>
    `;
  }

  function showFeedView() {
    if (!readerView || !feedView) return;
    readerView.style.display = "none";
    feedView.style.display = "block";
  }

  // Hook back actions
  if (backBtn) backBtn.addEventListener("click", clearReaderUrlParam);
  if (backBtnFooter) backBtnFooter.addEventListener("click", clearReaderUrlParam);

  // 4. SIDEBAR POLL WIDGET SYNC (Identical to app.js)
  function renderActivePollWidget() {
    const pollCard = document.querySelector(".poll-card");
    const pollForm = document.getElementById("poll-widget-form");
    const votedMsg = document.getElementById("poll-widget-voted-msg");
    const pollQuestionEl = document.getElementById("poll-widget-question");

    if (!pollCard || !pollForm) return;

    if (rcDbMode === "firebase") {
      rcDb.collection("polls").doc("active-poll").get()
        .then(doc => {
          if (doc.exists) {
            setupPollUI(doc.data(), pollCard, pollForm, votedMsg, pollQuestionEl);
          } else {
            setupPollUI(RC_DEFAULT_POLL, pollCard, pollForm, votedMsg, pollQuestionEl);
          }
        })
        .catch(err => {
          console.error("Sidebar Poll error: ", err);
          setupPollUI(RC_DEFAULT_POLL, pollCard, pollForm, votedMsg, pollQuestionEl);
        });
    } else {
      const pollData = JSON.parse(localStorage.getItem("rc_poll")) || RC_DEFAULT_POLL;
      setupPollUI(pollData, pollCard, pollForm, votedMsg, pollQuestionEl);
    }
  }

  function setupPollUI(poll, pollCard, pollForm, votedMsg, pollQuestionEl) {
    if (pollQuestionEl) pollQuestionEl.textContent = poll.question;

    document.getElementById("poll-widget-lbl-a").textContent = poll.options.a.text;
    document.getElementById("poll-widget-lbl-b").textContent = poll.options.b.text;
    document.getElementById("poll-widget-lbl-c").textContent = poll.options.c.text;
    document.getElementById("poll-widget-lbl-d").textContent = poll.options.d.text;

    const userVoted = localStorage.getItem("rc_user_voted") === "active-poll";

    const aVotes = poll.options.a.votes || 0;
    const bVotes = poll.options.b.votes || 0;
    const cVotes = poll.options.c.votes || 0;
    const dVotes = poll.options.d.votes || 0;
    const total = aVotes + bVotes + cVotes + dVotes;

    const pct = (votes) => total > 0 ? Math.round((votes / total) * 100) : 0;

    document.getElementById("poll-widget-total-votes").textContent = `Total Votes: ${total}`;

    const submitBtn = document.getElementById("poll-widget-submit");

    if (userVoted) {
      pollCard.classList.add("voted");
      if (submitBtn) submitBtn.style.display = "none";
      pollForm.querySelectorAll('input[name="poll-vote"]').forEach(input => input.disabled = true);
      votedMsg.style.display = "block";

      showOptionPercentages(pct(aVotes), pct(bVotes), pct(cVotes), pct(dVotes));
    } else {
      pollCard.classList.remove("voted");
      if (submitBtn) submitBtn.style.display = "block";
      pollForm.querySelectorAll('input[name="poll-vote"]').forEach(input => input.disabled = false);
      votedMsg.style.display = "none";

      pollForm.onsubmit = (e) => {
        e.preventDefault();
        const selectedOpt = pollForm.querySelector('input[name="poll-vote"]:checked');
        if (!selectedOpt) return;

        const val = selectedOpt.value;

        if (rcDbMode === "firebase") {
          rcDb.collection("polls").doc("active-poll").update({
            [`options.${val}.votes`]: firebase.firestore.FieldValue.increment(1)
          })
          .then(() => {
            localStorage.setItem("rc_user_voted", "active-poll");
            renderActivePollWidget();
          })
          .catch(err => {
            alert("Voting error: " + err.message);
          });
        } else {
          const localPoll = JSON.parse(localStorage.getItem("rc_poll")) || RC_DEFAULT_POLL;
          localPoll.options[val].votes = (localPoll.options[val].votes || 0) + 1;
          localStorage.setItem("rc_poll", JSON.stringify(localPoll));
          localStorage.setItem("rc_user_voted", "active-poll");
          renderActivePollWidget();
        }
      };
    }
  }

  function showOptionPercentages(aPct, bPct, cPct, dPct) {
    const pcts = [aPct, bPct, cPct, dPct];
    const keys = ["a", "b", "c", "d"];

    keys.forEach((key, idx) => {
      const pctEl = document.getElementById(`poll-widget-pct-${key}`);
      const barEl = document.getElementById(`poll-widget-bar-${key}`);
      const labelEl = pctEl.closest(".poll-option-label");

      if (pctEl) pctEl.textContent = `${pcts[idx]}%`;
      
      setTimeout(() => {
        if (barEl) barEl.style.width = `${pcts[idx]}%`;
      }, 100);

      if (labelEl) {
        labelEl.style.cursor = "default";
        labelEl.style.background = "rgba(255, 255, 255, 0.015)";
      }
    });
  }

  // Load Everything
  loadHubFeed();
  renderActivePollWidget();
});
