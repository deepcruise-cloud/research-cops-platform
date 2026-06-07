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
  let rcCalendlyUrl = "https://calendly.com/researchcops/30min";

  // Seeding backup configurations
  const RC_DEFAULT_BLOGS = [
    {
      id: "blog-1",
      title: "Agentic AI Orchestration: The Central Control Plane of 2026 Enterprise Workflows",
      category: "Automation",
      readtime: "6 min read",
      excerpt: "How autonomous agents with human-in-the-loop controls are replacing rigid rule-based scripts to coordinate complex B2B operations.",
      content: "In 2026, enterprise workflow automation has moved far beyond simple task execution. Organizations are shifting from automating isolated tasks to implementing unified control planes that orchestrate end-to-end processes across hybrid cloud environments and legacy databases. The rise of Agentic AI is the defining trend of 2026. Task-specific AI agents, now integrated into 40% of enterprise software, are reasoning and making operational decisions within guardrails while preserving critical human-in-the-loop (HITL) checkpoints for compliance.",
      date: "May 2026",
      featured: false,
      timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600"
    },
    {
      id: "blog-2",
      title: "Rethinking Database Sync: High-Performance GraphQL Middleware & Schema Mapping",
      category: "Integration",
      readtime: "5 min read",
      excerpt: "Techniques for connecting siloed legacy databases with modern SaaS endpoints using selective querying and schema-less integration.",
      content: "Connecting legacy systems with modern SaaS tools represents a major challenge for growing enterprises. Traditionally, developers had to build rigid, custom DB-links and SQL extraction scripts that were expensive to maintain. In 2026, GraphQL gateways have emerged as the standard middleware layer for database sync. This architecture allows developers to run selective column queries and manage schemas dynamically, reducing API payload sizes by 65% and preventing integration discrepancies.",
      date: "April 2026",
      featured: false,
      timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600"
    },
    {
      id: "blog-3",
      title: "Governed Intelligence: Cryptographic Policy Checks and Audit Trails in HRMS Automation",
      category: "Security",
      readtime: "8 min read",
      excerpt: "Establishing strict role-based access logs and zero-knowledge encryption protocols across automated employee onboarding flows.",
      content: "With AI agents and workflow scripts gaining increased authority over enterprise database systems, establishing proper governance has become a business risk priority. Credible automated HRMS platforms must embed audit trails and identity policy controls directly into their orchestration layer. This includes adopting zero-knowledge storage configurations and TLS 1.3 encryption protocols for employee profiles, protecting payroll allocations, document routing, and security rosters from data exposure.",
      date: "March 2026",
      featured: false,
      timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600"
    },
    {
      id: "blog-featured",
      title: "Self-Optimizing Middleware: AI-Assisted Index Tuning in Legacy ERP Syncs",
      category: "Database",
      readtime: "6 min read",
      excerpt: "How self-optimizing pipelines audit database queries, detect database latency spikes, and optimize queries automatically.",
      content: "Manual database query indexing is slow and fails to scale with dynamic SaaS environments. Modern enterprise middleware incorporates self-optimizing pipelines that monitor queries in real-time. By applying AI-assisted index tuning, the system automatically detects slow query execution times across custom ERP syncs, modifying indexing strategies and improving database retrieval rates by up to 3.5x without human developer intervention.",
      date: "June 2026",
      featured: true,
      timestamp: Date.now(),
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600"
    }
  ];

  const RC_DEFAULT_NEWS = [
    {
      id: "news-1",
      title: "Automated Ledger Reconciliation Engine v2.1 Released",
      category: "Platform",
      details: "Deployment of cross-register ledger matching engine reduces reconciliation cycles from days to under 15 minutes.",
      date: "June 2026",
      timestamp: Date.now(),
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600"
    },
    {
      id: "news-2",
      title: "Custom ERP Sync Connector Upgraded to REST OAuth 2.0",
      category: "Security",
      details: "Integration of automated token refresh sequences and role-based data views for secure database mapping.",
      date: "May 2026",
      timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600"
    },
    {
      id: "news-3",
      title: "HRMS Onboarding Workflows Speed Up",
      category: "Automation",
      details: "Optimized automated script mappings reduce new hire document routing times by 80% globally.",
      date: "April 2026",
      timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600"
    },
    {
      id: "news-4",
      title: "Distributed Ledger Reconciliation Hub Implemented",
      category: "Platform",
      details: "A new distributed validation protocol achieves high-performance ledger sync with sub-millisecond latencies across global clusters.",
      date: "June 2026",
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=600"
    },
    {
      id: "news-5",
      title: "AI-Assisted Database Query Index Tuning System Live",
      category: "Database",
      details: "AI-assisted index optimization automatically detects slow queries in ERP database middlewares, improving retrieval rates by 3.5x.",
      date: "May 2026",
      timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600"
    },
    {
      id: "news-6",
      title: "Zero-Knowledge Encryption Enforced for HRMS Personnel Records",
      category: "Security",
      details: "Upgrade enforces zero-knowledge architecture and TLS 1.3 data transfer protocols for all integrated employee profiles.",
      date: "April 2026",
      timestamp: Date.now() - 50 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=600"
    }
  ];

  const RC_DEFAULT_POLLS = [
    {
      id: "poll-1",
      question: "What is your organization's primary operational bottleneck?",
      options: {
        a: { text: "Manual Billing & Reconciliation", votes: 45 },
        b: { text: "Siloed HRMS & Employee Data", votes: 78 },
        c: { text: "Legacy ERP Integration Issues", votes: 32 },
        d: { text: "Inefficient Document Workflows", votes: 19 }
      }
    },
    {
      id: "poll-2",
      question: "Which database integration technology is most critical for your ERP sync?",
      options: {
        a: { text: "Real-time API Webhooks", votes: 62 },
        b: { text: "Scheduled SQL Batch Jobs", votes: 29 },
        c: { text: "Message Queues (RabbitMQ/Kafka)", votes: 41 },
        d: { text: "Direct Database DB-Links", votes: 15 }
      }
    },
    {
      id: "poll-3",
      question: "What is the biggest hurdle in your custom HRMS automation workflow?",
      options: {
        a: { text: "Legacy Software Incompatibility", votes: 53 },
        b: { text: "High API Maintenance Overhead", votes: 38 },
        c: { text: "Data Format/Schema Discrepancies", votes: 71 },
        d: { text: "Security, Compliance & HIPAA Audits", votes: 24 }
      }
    }
  ];

  const RC_TREND_POLLS = {
    Automation: {
      id: "poll-trend-automation",
      question: "What is your biggest operational concern with Agentic AI integration?",
      options: {
        a: { text: "AI hallucinations & decision errors", votes: 42 },
        b: { text: "High API usage & token costs", votes: 24 },
        c: { text: "Security compliance & data leaks", votes: 53 },
        d: { text: "Integrating with legacy ERP data", votes: 19 }
      }
    },
    Security: {
      id: "poll-trend-security",
      question: "Which security layer is most critical for your automated database syncs?",
      options: {
        a: { text: "Zero-Knowledge Encryption (ZKP)", votes: 31 },
        b: { text: "Strict role-based access logs (RBAC)", votes: 64 },
        c: { text: "VPN/IP address verification gates", votes: 18 },
        d: { text: "Third-party dependency scanning", votes: 27 }
      }
    },
    Compliance: {
      id: "poll-trend-compliance",
      question: "What is your main driver for establishing automated audit trails?",
      options: {
        a: { text: "Compliance with GDPR/CCPA data laws", votes: 58 },
        b: { text: "Preventing internal security breaches", votes: 36 },
        c: { text: "Client requests & vendor verification", votes: 22 },
        d: { text: "Simplifying manual annual audits", votes: 14 }
      }
    },
    Integration: {
      id: "poll-trend-integration",
      question: "Which integration middleware architecture is most critical for your operations?",
      options: {
        a: { text: "Real-time API Webhooks", votes: 62 },
        b: { text: "Scheduled SQL Batch Jobs", votes: 29 },
        c: { text: "Message Queues (RabbitMQ/Kafka)", votes: 41 },
        d: { text: "Direct Database DB-Links", votes: 15 }
      }
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
    
    // Strip YAML front matter if present
    let contentStr = markdown.trim();
    if (contentStr.startsWith("---")) {
      const parts = contentStr.split("---");
      if (parts.length >= 3) {
        contentStr = parts.slice(2).join("---").trim();
      }
    }
    
    let html = rcEscapeHtml(contentStr);
    
    // Code blocks (triple backticks)
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); padding: 15px; border-radius: var(--radius-sm); overflow-x: auto; font-family: monospace; font-size: 13.5px; color: var(--turquoise-accent); margin: 15px 0; white-space: pre-wrap; word-break: break-all;">$1</pre>');
    
    // Inline code (single backtick)
    html = html.replace(/`([^`\n]+)`/g, '<code style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 90%; color: var(--turquoise-accent);">$1</code>');

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
    
    // Markdown Links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: var(--turquoise-accent); text-decoration: underline;">$1</a>');
    
    // Blockquotes
    html = html.replace(/^&gt;\s+(.*?)$/gm, '<blockquote style="border-left: 3px solid var(--turquoise-accent); padding-left: 15px; margin: 15px 0; color: var(--text-muted); font-style: italic;">$1</blockquote>');

    // Split paragraphs
    const lines = html.split(/\n\n+/);
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<pre') || trimmed.startsWith('<blockquote')) {
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
    
    // Migration check: Clear old market research content or legacy poll formats to allow fresh seeding
    const legacyCheck = localStorage.getItem("rc_blogs");
    const hasOldPollVal = localStorage.getItem("rc_poll");
    if (hasOldPollVal || (legacyCheck && (
      !legacyCheck.includes("image") ||
      legacyCheck.includes("concept-testing") || 
      legacyCheck.includes("bot-intrusion") || 
      legacyCheck.includes("panelist") || 
      legacyCheck.includes("OpinionGenie") ||
      legacyCheck.includes("Panel") || 
      legacyCheck.includes("Survey") ||
      legacyCheck.includes("Opinion Genie")
    ))) {
      console.log("Legacy data or single-poll detected. Clearing database keys to transition to multi-poll system.");
      localStorage.removeItem("rc_blogs");
      localStorage.removeItem("rc_news");
      localStorage.removeItem("rc_poll");
      localStorage.removeItem("rc_polls");
      localStorage.removeItem("rc_user_voted");
    }

    if (!localStorage.getItem("rc_blogs")) {
      localStorage.setItem("rc_blogs", JSON.stringify(RC_DEFAULT_BLOGS));
    }
    if (!localStorage.getItem("rc_news")) {
      localStorage.setItem("rc_news", JSON.stringify(RC_DEFAULT_NEWS));
    }
    if (!localStorage.getItem("rc_polls")) {
      localStorage.setItem("rc_polls", JSON.stringify(RC_DEFAULT_POLLS));
    }
  }

  // State Management
  let allFeedItems = [];
  let currentCategoryFilter = "all";
  let currentSearchQuery = "";
  let liveFeedActive = false;
  let liveTrendingCategory = "Integration";

  // Elements
  const feedList = document.getElementById("insights-feed-list");
  const feedView = document.getElementById("feed-view-container");
  const readerView = document.getElementById("reader-view-container");
  const readerArticle = document.getElementById("reader-article-content");
  
  const searchInput = document.getElementById("insights-search-input");
  const filterTags = document.querySelectorAll(".filter-tag");
  
  const backBtn = document.getElementById("reader-back-btn");
  const backBtnFooter = document.getElementById("reader-back-btn-footer");

  const liveFeedSwitch = document.getElementById("live-feed-switch");
  const liveFeedPulse = document.getElementById("live-feed-pulse");
  const liveFeedStatusText = document.getElementById("live-feed-status-text");

  // Toggle switch listener
  if (liveFeedSwitch) {
    liveFeedSwitch.addEventListener("change", (e) => {
      liveFeedActive = e.target.checked;
      
      // Reset filter tags visually
      filterTags.forEach(b => b.classList.remove("active"));
      const allTag = Array.from(filterTags).find(b => b.getAttribute("data-filter") === "all");
      if (allTag) allTag.classList.add("active");
      
      // Clear filters
      if (searchInput) searchInput.value = "";
      currentSearchQuery = "";
      currentCategoryFilter = "all";
      
      if (liveFeedActive) {
        if (liveFeedPulse) liveFeedPulse.classList.add("active");
        if (liveFeedStatusText) liveFeedStatusText.textContent = "Live Feed Active (Connected)";
        sessionStorage.removeItem("rc_trend_poll_autoswitch");
      } else {
        if (liveFeedPulse) liveFeedPulse.classList.remove("active");
        if (liveFeedStatusText) liveFeedStatusText.textContent = "Curated Insights (Offline Mode)";
        
        // Reset active poll to poll-1 if currently on a trend poll
        const activeSelect = document.getElementById("poll-active-select");
        if (activeSelect && activeSelect.value.startsWith("poll-trend-")) {
          activeSelect.value = "poll-1";
        }
        sessionStorage.removeItem("rc_trend_poll_autoswitch");
      }
      
      loadHubFeed();
    });
  }

  function fetchLiveGlobalArticles() {
    if (feedList) {
      feedList.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <span class="live-pulse active" style="width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
          Fetching live global trends...
        </div>
      `;
    }
    
    Promise.all([
      fetch("https://dev.to/api/articles?tag=news&per_page=15").then(res => res.json()),
      fetch("https://dev.to/api/articles?tag=technology&per_page=15").then(res => res.json())
    ])
    .then(([dbArticles, autoArticles]) => {
      const seen = new Set();
      const combined = [];
      
      const processArticle = (item, defaultCat) => {
        if (!item || seen.has(item.id)) return;
        seen.add(item.id);
        
        let category = defaultCat;
        const tags = (item.tag_list || []).map(t => t.toLowerCase());
        
        if (tags.some(t => t.includes("sports") || t.includes("sport") || t.includes("game") || t.includes("olympic"))) {
          category = "Sports";
        } else if (tags.some(t => t.includes("tech") || t.includes("technology") || t.includes("code") || t.includes("program") || t.includes("dev") || t.includes("ai") || t.includes("api") || t.includes("database"))) {
          category = "Tech";
        } else if (tags.some(t => t.includes("business") || t.includes("startup") || t.includes("career") || t.includes("management") || t.includes("marketing"))) {
          category = "Business";
        } else if (tags.some(t => t.includes("finance") || t.includes("money") || t.includes("crypto") || t.includes("bitcoin") || t.includes("stock") || t.includes("bank"))) {
          category = "Finance";
        } else if (tags.some(t => t.includes("global") || t.includes("world") || t.includes("news") || t.includes("earth") || t.includes("country"))) {
          category = "Global";
        } else {
          category = "Other";
        }
        
        let displayDate = "Live";
        if (item.published_at) {
          const d = new Date(item.published_at);
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          displayDate = `${months[d.getMonth()]} ${d.getFullYear()}`;
        }
        
        combined.push({
          id: item.id.toString(),
          title: item.title,
          category: category,
          readtime: `${item.reading_time_minutes || 3} min read`,
          excerpt: item.description || "No description provided.",
          content: "", 
          date: displayDate,
          featured: false,
          timestamp: item.published_at ? new Date(item.published_at).getTime() : Date.now(),
          type: "live-article",
          image: item.cover_image || item.social_image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600"
        });
      };
      
      if (Array.isArray(dbArticles)) {
        dbArticles.forEach(item => processArticle(item, "News"));
      }
      if (Array.isArray(autoArticles)) {
        autoArticles.forEach(item => processArticle(item, "Integration"));
      }
      
      combined.sort((a, b) => b.timestamp - a.timestamp);
      allFeedItems = combined;
      
      // Calculate trending category from articles
      const categoryCounts = { Automation: 0, Security: 0, Compliance: 0, Integration: 0 };
      combined.forEach(item => {
        if (categoryCounts[item.category] !== undefined) {
          categoryCounts[item.category]++;
        }
      });
      let maxCat = "Integration";
      let maxVal = -1;
      for (const cat in categoryCounts) {
        if (categoryCounts[cat] > maxVal) {
          maxVal = categoryCounts[cat];
          maxCat = cat;
        }
      }
      liveTrendingCategory = maxCat;
      
      applyFiltersAndRender();
      checkUrlForDeepLinking();
      renderActivePollWidget();
    })
    .catch(err => {
      console.error("Error fetching live DEV.to feed:", err);
      if (feedList) {
        feedList.innerHTML = `
          <div class="glass-card" style="padding: 40px; text-align: center; color: var(--text-muted); border-radius: var(--radius-md);">
            Failed to connect to the live global feed. Check your internet connection or toggle back to Curated Insights.
          </div>
        `;
      }
    });
  }

  // Initialize and Fetch Hub Feed Data
  function loadHubFeed() {
    if (liveFeedActive) {
      fetchLiveGlobalArticles();
      return;
    }
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
      card.style.padding = "0";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.overflow = "hidden";
      
      const displayCategory = item.type === "news" ? `News: ${item.category}` : 
                              item.type === "live-article" ? `Global: ${item.category}` : item.category;

      const imageUrl = item.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600";

      card.innerHTML = `
        <div style="width: 100%; height: 160px; overflow: hidden; position: relative; border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
          <img src="${imageUrl}" alt="${rcEscapeHtml(item.title)}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600';" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" class="feed-card-image">
        </div>
        <div style="padding: 18px; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: var(--turquoise-accent); margin-bottom: 8px;">
            ${rcEscapeHtml(displayCategory)}
          </div>
          <h4 style="font-family: var(--font-family-display); font-size: 15.5px; font-weight: 600; color: var(--text-light); line-height: 1.45; margin-bottom: 12px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; min-height: 44px;">
            ${rcEscapeHtml(item.title)}
          </h4>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.04); padding-top: 10px; font-size: 11.5px; color: var(--text-muted);">
            <span>📅 ${rcEscapeHtml(item.date)}</span>
            <span>⏱ ${rcEscapeHtml(item.readtime)}</span>
          </div>
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
      filtered = filtered.filter(item => item.category === currentCategoryFilter);
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
      const article = allFeedItems.find(item => item.id.toString() === id.toString() && item.type === type);
      if (article) {
        showArticleInReader(article);
      } else if (type === "live-article") {
        // Fetch article detail directly from API even if not in current allFeedItems list (deep linked)
        const placeholder = {
          id: id,
          type: "live-article",
          title: "Loading Live Trend...",
          category: "Technology",
          date: "Live",
          readtime: "Calculating...",
          content: ""
        };
        showArticleInReader(placeholder);
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
    const isLive = article.type === "live-article";
    const headerBadgeClass = isNews ? "badge-teal" : "blog-cat";
    const headerCategory = isNews ? `News Alerts: ${article.category}` : 
                            isLive ? `Global: ${article.category}` : article.category;
    
    // Check if we need to fetch details for a live article
    if (isLive && !article.content) {
      readerArticle.innerHTML = `
        <div style="margin-bottom: 20px;">
          <span class="blog-cat" style="display:inline-block; margin-bottom: 15px;">Global: ${rcEscapeHtml(article.category)}</span>
          <h1 style="font-family: var(--font-family-display); font-size: 32px; font-weight: 700; color: var(--text-light); line-height:1.3; margin-bottom: 15px;">
            ${rcEscapeHtml(article.title)}
          </h1>
          <div style="display: flex; gap: 20px; font-size: 13.5px; color: var(--text-muted); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px;">
            <span>📅 Date: <strong>${rcEscapeHtml(article.date)}</strong></span>
            <span>⏱ Length: <strong>${rcEscapeHtml(article.readtime)}</strong></span>
          </div>
        </div>
        
        <div style="text-align: center; padding: 60px 0; color: var(--text-muted);">
          <span class="live-pulse active" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-bottom: 12px;"></span>
          <p>Retrieving article details from DEV.to API...</p>
        </div>
      `;

      fetch(`https://dev.to/api/articles/${article.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && (data.body_markdown || data.description)) {
            article.content = data.body_markdown || data.description;
            if (data.title) article.title = data.title;
            if (data.reading_time_minutes) article.readtime = `${data.reading_time_minutes} min read`;
            
            let displayDate = "Live";
            if (data.published_at) {
              const d = new Date(data.published_at);
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              displayDate = `${months[d.getMonth()]} ${d.getFullYear()}`;
            }
            article.date = displayDate;
            
            // Re-render now that content is loaded
            showArticleInReader(article);
          } else {
            throw new Error("No content received");
          }
        })
        .catch(err => {
          console.error("Error retrieving article details:", err);
          readerArticle.innerHTML = `
            <div style="margin-bottom: 20px;">
              <span class="blog-cat" style="display:inline-block; margin-bottom: 15px; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444;">Connection Error</span>
              <h1 style="font-family: var(--font-family-display); font-size: 32px; font-weight: 700; color: var(--text-light); line-height:1.3; margin-bottom: 15px;">
                Failed to fetch article details
              </h1>
            </div>
            <p style="color: var(--text-muted); line-height: 1.6;">We were unable to load the full markdown body from the DEV.to API. Please check your network connection and try again.</p>
          `;
        });
      return;
    }

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

      ${isLive ? `
      <!-- Live Transparency Note -->
      <div style="margin-top: 40px; padding: 15px; background: rgba(4, 203, 194, 0.05); border: 1px solid rgba(4, 203, 194, 0.15); border-radius: var(--radius-sm); font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
        <span class="live-pulse active" style="width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>
        <span>This article was fetched live via the public DEV.to API on global developer trends.</span>
      </div>
      ` : ""}
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
  function getTrendingPollObject(allPolls) {
    const trendPollTemplate = RC_TREND_POLLS[liveTrendingCategory] || RC_TREND_POLLS.Integration;
    const existing = allPolls.find(p => p.id === trendPollTemplate.id);
    if (existing) {
      return existing;
    } else {
      if (rcDbMode === "firebase") {
        rcDb.collection("polls").doc(trendPollTemplate.id).set(trendPollTemplate).catch(console.error);
      } else {
        const localPolls = JSON.parse(localStorage.getItem("rc_polls")) || RC_DEFAULT_POLLS;
        if (!localPolls.some(p => p.id === trendPollTemplate.id)) {
          localPolls.push(trendPollTemplate);
          localStorage.setItem("rc_polls", JSON.stringify(localPolls));
        }
      }
      return trendPollTemplate;
    }
  }

  function populatePollSelector(polls, activeSelectEl) {
    if (!activeSelectEl) return;
    const currentVal = activeSelectEl.value;
    activeSelectEl.innerHTML = "";
    polls.forEach(poll => {
      const opt = document.createElement("option");
      opt.value = poll.id;
      
      const isTrend = poll.id.startsWith("poll-trend-");
      opt.textContent = isTrend ? `🔥 [Trend] ${poll.question.slice(0, 35)}...` : (poll.question.length > 50 ? poll.question.slice(0, 47) + "..." : poll.question);
      activeSelectEl.appendChild(opt);
    });
    if (currentVal && polls.some(p => p.id === currentVal)) {
      activeSelectEl.value = currentVal;
    } else if (polls.length > 0) {
      activeSelectEl.value = polls[0].id;
    }
  }

  function renderActivePollWidget() {
    const pollCard = document.querySelector(".poll-card");
    const pollForm = document.getElementById("poll-widget-form");
    const votedMsg = document.getElementById("poll-widget-voted-msg");
    const pollQuestionEl = document.getElementById("poll-widget-question");
    const activeSelect = document.getElementById("poll-active-select");

    if (!pollCard || !pollForm) return;

    if (rcDbMode === "firebase") {
      rcDb.collection("polls").get()
        .then(snapshot => {
          let polls = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            polls.push(data);
          });
          if (polls.length === 0) {
            polls = [...RC_DEFAULT_POLLS];
          }

          if (liveFeedActive) {
            const trendPoll = getTrendingPollObject(polls);
            polls = [trendPoll, ...polls.filter(p => p.id !== trendPoll.id)];
            if (activeSelect && !activeSelect.value.startsWith("poll-trend-") && !sessionStorage.getItem("rc_trend_poll_autoswitch")) {
              activeSelect.value = trendPoll.id;
              sessionStorage.setItem("rc_trend_poll_autoswitch", "true");
            }
          }

          const expectedLength = polls.length;
          if (activeSelect && activeSelect.children.length !== expectedLength) {
            populatePollSelector(polls, activeSelect);
            activeSelect.onchange = () => {
              renderActivePollWidget();
            };
          }
          const selectedId = activeSelect ? activeSelect.value : (polls[0] ? polls[0].id : "poll-1");
          const selectedPoll = polls.find(p => p.id === selectedId) || polls[0] || RC_DEFAULT_POLLS[0];
          setupPollUI(selectedPoll, pollCard, pollForm, votedMsg, pollQuestionEl);
        })
        .catch(err => {
          console.error("Error loading active polls:", err);
          fallbackLocalPolls(activeSelect, pollCard, pollForm, votedMsg, pollQuestionEl);
        });
    } else {
      fallbackLocalPolls(activeSelect, pollCard, pollForm, votedMsg, pollQuestionEl);
    }
  }

  function fallbackLocalPolls(activeSelect, pollCard, pollForm, votedMsg, pollQuestionEl) {
    let polls = JSON.parse(localStorage.getItem("rc_polls")) || RC_DEFAULT_POLLS;

    if (liveFeedActive) {
      const trendPoll = getTrendingPollObject(polls);
      polls = JSON.parse(localStorage.getItem("rc_polls")) || RC_DEFAULT_POLLS;
      polls = [trendPoll, ...polls.filter(p => p.id !== trendPoll.id)];
      if (activeSelect && !activeSelect.value.startsWith("poll-trend-") && !sessionStorage.getItem("rc_trend_poll_autoswitch")) {
        activeSelect.value = trendPoll.id;
        sessionStorage.setItem("rc_trend_poll_autoswitch", "true");
      }
    }

    const expectedLength = polls.length;
    if (activeSelect && activeSelect.children.length !== expectedLength) {
      populatePollSelector(polls, activeSelect);
      activeSelect.onchange = () => {
        renderActivePollWidget();
      };
    }
    const selectedId = activeSelect ? activeSelect.value : (polls[0] ? polls[0].id : "poll-1");
    const selectedPoll = polls.find(p => p.id === selectedId) || polls[0] || RC_DEFAULT_POLLS[0];
    setupPollUI(selectedPoll, pollCard, pollForm, votedMsg, pollQuestionEl);
  }

  function setupPollUI(poll, pollCard, pollForm, votedMsg, pollQuestionEl) {
    if (pollQuestionEl) pollQuestionEl.textContent = poll.question;

    document.getElementById("poll-widget-lbl-a").textContent = poll.options.a.text;
    document.getElementById("poll-widget-lbl-b").textContent = poll.options.b.text;
    document.getElementById("poll-widget-lbl-c").textContent = poll.options.c.text;
    document.getElementById("poll-widget-lbl-d").textContent = poll.options.d.text;

    const userVoted = localStorage.getItem("rc_voted_" + poll.id) === "true";

    const aVotes = poll.options.a.votes || 0;
    const bVotes = poll.options.b.votes || 0;
    const cVotes = poll.options.c.votes || 0;
    const dVotes = poll.options.d.votes || 0;
    const total = aVotes + bVotes + cVotes + dVotes;

    const pct = (votes) => total > 0 ? Math.round((votes / total) * 100) : 0;

    document.getElementById("poll-widget-total-votes").textContent = `Total Votes: ${total}`;

    const submitBtn = document.getElementById("poll-widget-submit");

    pollForm.querySelectorAll('input[name="poll-vote"]').forEach(input => {
      input.checked = false;
    });

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
      resetOptionPercentages();

      pollForm.onsubmit = (e) => {
        e.preventDefault();
        const selectedOpt = pollForm.querySelector('input[name="poll-vote"]:checked');
        if (!selectedOpt) return;

        const val = selectedOpt.value;

        if (rcDbMode === "firebase") {
          rcDb.collection("polls").doc(poll.id).update({
            [`options.${val}.votes`]: firebase.firestore.FieldValue.increment(1)
          })
          .then(() => {
            localStorage.setItem("rc_voted_" + poll.id, "true");
            renderActivePollWidget();
          })
          .catch(err => {
            alert("Voting error: " + err.message);
          });
        } else {
          const localPolls = JSON.parse(localStorage.getItem("rc_polls")) || RC_DEFAULT_POLLS;
          const pollIndex = localPolls.findIndex(p => p.id === poll.id);
          if (pollIndex !== -1) {
            localPolls[pollIndex].options[val].votes = (localPolls[pollIndex].options[val].votes || 0) + 1;
            localStorage.setItem("rc_polls", JSON.stringify(localPolls));
          }
          localStorage.setItem("rc_voted_" + poll.id, "true");
          renderActivePollWidget();
        }
      };
    }
  }

  function resetOptionPercentages() {
    const keys = ["a", "b", "c", "d"];
    keys.forEach(key => {
      const pctEl = document.getElementById(`poll-widget-pct-${key}`);
      const barEl = document.getElementById(`poll-widget-bar-${key}`);
      const labelEl = pctEl ? pctEl.closest(".poll-option-label") : null;
      if (pctEl) pctEl.textContent = "";
      if (barEl) barEl.style.width = "0%";
      if (labelEl) {
        labelEl.style.cursor = "pointer";
        labelEl.style.background = "";
      }
    });
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
  loadFooterSettings();

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
      if (data.calendly) {
        rcCalendlyUrl = data.calendly;
      }
    }
  }

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
