// Research COPS - Admin Portal Controller
// Integrates Firebase Authentication and Firestore with a robust LocalStorage fallback

// 1. Firebase Configuration (Replace with your own credentials)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. Database Mode & State Initialize
let dbMode = "local"; // "firebase" or "local"
let db = null;
let auth = null;
let activeUser = null;

// Default initial mock database values for LocalStorage Mode
const DEFAULT_BLOGS = [
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

const DEFAULT_NEWS = [
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

const DEFAULT_POLLS = [
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

// Initialize Database Connection Mode
function initDatabaseMode() {
  const isConfigured = firebaseConfig && 
                       firebaseConfig.apiKey && 
                       !firebaseConfig.apiKey.startsWith("YOUR_") && 
                       firebaseConfig.apiKey !== "";

  const dbStatusBanner = document.getElementById("db-status");

  if (isConfigured && typeof firebase !== "undefined") {
    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      auth = firebase.auth();
      dbMode = "firebase";

      // Configure banner
      if (dbStatusBanner) {
        dbStatusBanner.className = "db-status-banner connected";
        dbStatusBanner.innerHTML = `
          <span class="status-badge badge-emerald">Connected</span>
          <p>Connected to Live Firebase Cloud Database.</p>
        `;
      }
      console.log("Admin Portal: Live Firebase DB Connected successfully.");
    } catch (e) {
      console.error("Firebase init failed. Reverting to LocalStorage:", e);
      setupLocalFallback(dbStatusBanner);
    }
  } else {
    setupLocalFallback(dbStatusBanner);
  }
}

function setupLocalFallback(bannerEl) {
  dbMode = "local";
  if (bannerEl) {
    bannerEl.className = "db-status-banner";
    bannerEl.innerHTML = `
      <span class="status-badge badge-amber">LocalStorage Mode</span>
      <p>Using LocalStorage Fallback database. Setup Firebase credentials in admin.js to sync live.</p>
    `;
  }
  console.log("Admin Portal: LocalStorage database initialized.");

  // Migration check: Clear old market research content to allow new workflow/HRMS/ERP content to seed
  const legacyCheck = localStorage.getItem("rc_blogs");
  if (legacyCheck && (
    !legacyCheck.includes("image") ||
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
    localStorage.removeItem("rc_polls");
    localStorage.removeItem("rc_user_voted");
  }

  // Pre-seed tables if empty
  if (!localStorage.getItem("rc_blogs")) {
    localStorage.setItem("rc_blogs", JSON.stringify(DEFAULT_BLOGS));
  }
  if (!localStorage.getItem("rc_news")) {
    localStorage.setItem("rc_news", JSON.stringify(DEFAULT_NEWS));
  }
  if (!localStorage.getItem("rc_polls")) {
    localStorage.setItem("rc_polls", JSON.stringify(DEFAULT_POLLS));
  }
}

// 3. User Authentication Watcher
function setupAuth() {
  const loginScreen = document.getElementById("admin-login-screen");
  const controlCenter = document.getElementById("admin-control-center");
  const userDisplay = document.getElementById("user-display");
  const loginForm = document.getElementById("admin-login-form");
  const loginError = document.getElementById("login-error");
  const logoutBtn = document.getElementById("admin-logout-btn");

  if (dbMode === "firebase") {
    auth.onAuthStateChanged(user => {
      if (user) {
        activeUser = user;
        loginScreen.style.display = "none";
        controlCenter.style.display = "block";
        if (userDisplay) userDisplay.textContent = `User: ${user.email}`;
        loadDashboardData();
      } else {
        activeUser = null;
        loginScreen.style.display = "block";
        controlCenter.style.display = "none";
      }
    });

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        loginError.textContent = "";
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        auth.signInWithEmailAndPassword(email, password)
          .catch(error => {
            console.error(error);
            loginError.textContent = `Auth Error: ${error.message}`;
          });
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        auth.signOut();
      });
    }
  } else {
    // LocalStorage Auth Mock
    const checkSession = () => {
      const loggedIn = sessionStorage.getItem("rc_admin_logged_in") === "true";
      if (loggedIn) {
        loginScreen.style.display = "none";
        controlCenter.style.display = "block";
        if (userDisplay) userDisplay.textContent = "Session: admin@researchcops.com";
        loadDashboardData();
      } else {
        loginScreen.style.display = "block";
        controlCenter.style.display = "none";
      }
    };

    checkSession();

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        loginError.textContent = "";
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        // Simple hardcoded login for sandbox testing
        if (email === "admin@researchcops.com" && password === "adminpassword") {
          sessionStorage.setItem("rc_admin_logged_in", "true");
          checkSession();
        } else {
          loginError.textContent = "Invalid login credentials. Hint: use admin@researchcops.com / adminpassword";
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("rc_admin_logged_in");
        checkSession();
      });
    }
  }
}

// 4. Tab Navigation Controller
function setupTabs() {
  const tabs = document.querySelectorAll(".admin-tab-btn");
  const panels = document.querySelectorAll(".admin-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const target = tab.getAttribute("data-target");
      const targetPanel = document.getElementById(target);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }

      if (target === "panel-leads") {
        renderLeadsList();
      }
    });
  });
}

// 5. Data Fetch & Load Engine
function loadDashboardData() {
  renderBlogsList();
  renderNewsList();
  renderPollFormAndStats();
  renderLeadsList();
}

// 6. BLOG OPERATIONS
function renderBlogsList() {
  const tableBody = document.getElementById("blogs-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (dbMode === "firebase") {
    db.collection("blogs").orderBy("timestamp", "desc").get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const blog = doc.data();
          blog.id = doc.id;
          appendBlogRow(tableBody, blog);
        });
      })
      .catch(err => {
        console.error("Error reading blogs: ", err);
      });
  } else {
    // LocalStorage Read
    const blogs = JSON.parse(localStorage.getItem("rc_blogs") || "[]");
    blogs.sort((a, b) => b.timestamp - a.timestamp);
    blogs.forEach(blog => {
      appendBlogRow(tableBody, blog);
    });
  }
}

function appendBlogRow(container, blog) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>
      <strong>${escapeHtml(blog.title)}</strong>
      ${blog.featured ? '<span class="status-badge badge-emerald" style="font-size:9px; margin-left:5px;">Featured</span>' : ''}
    </td>
    <td>${escapeHtml(blog.category)}</td>
    <td style="text-align: center;">
      <button class="btn-danger delete-blog-btn" data-id="${blog.id}">Delete</button>
    </td>
  `;
  container.appendChild(tr);

  // Attach delete listener
  tr.querySelector(".delete-blog-btn").addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteBlog(id);
    }
  });
}

function deleteBlog(id) {
  if (dbMode === "firebase") {
    db.collection("blogs").doc(id).delete()
      .then(() => {
        renderBlogsList();
      })
      .catch(err => {
        alert("Failed to delete from Firebase: " + err.message);
      });
  } else {
    let blogs = JSON.parse(localStorage.getItem("rc_blogs") || "[]");
    blogs = blogs.filter(b => b.id !== id);
    localStorage.setItem("rc_blogs", JSON.stringify(blogs));
    renderBlogsList();
  }
}

// 7. NEWS OPERATIONS
function renderNewsList() {
  const tableBody = document.getElementById("news-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (dbMode === "firebase") {
    db.collection("news").orderBy("timestamp", "desc").get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const item = doc.data();
          item.id = doc.id;
          appendNewsRow(tableBody, item);
        });
      })
      .catch(err => {
        console.error("Error reading news: ", err);
      });
  } else {
    const news = JSON.parse(localStorage.getItem("rc_news") || "[]");
    news.sort((a, b) => b.timestamp - a.timestamp);
    news.forEach(item => {
      appendNewsRow(tableBody, item);
    });
  }
}

function appendNewsRow(container, item) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><strong>${escapeHtml(item.title)}</strong></td>
    <td>${escapeHtml(item.category)}</td>
    <td style="text-align: center;">
      <button class="btn-danger delete-news-btn" data-id="${item.id}">Delete</button>
    </td>
  `;
  container.appendChild(tr);

  tr.querySelector(".delete-news-btn").addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");
    if (confirm("Are you sure you want to delete this news alert?")) {
      deleteNews(id);
    }
  });
}

function deleteNews(id) {
  if (dbMode === "firebase") {
    db.collection("news").doc(id).delete()
      .then(() => {
        renderNewsList();
      })
      .catch(err => {
        alert("Failed to delete from Firebase: " + err.message);
      });
  } else {
    let news = JSON.parse(localStorage.getItem("rc_news") || "[]");
    news = news.filter(n => n.id !== id);
    localStorage.setItem("rc_news", JSON.stringify(news));
    renderNewsList();
  }
}

// 8. POLL OPERATIONS
let adminPollsList = [];

function populateAdminPollSelector(polls, selectEl) {
  if (!selectEl) return;
  const currentVal = selectEl.value;
  selectEl.innerHTML = "";
  
  polls.forEach(poll => {
    const opt = document.createElement("option");
    opt.value = poll.id;
    opt.textContent = poll.question.length > 50 ? poll.question.slice(0, 47) + "..." : poll.question;
    selectEl.appendChild(opt);
  });
  
  const newOpt = document.createElement("option");
  newOpt.value = "new";
  newOpt.textContent = "[ + Create New Poll ]";
  selectEl.appendChild(newOpt);
  
  if (currentVal && (polls.some(p => p.id === currentVal) || currentVal === "new")) {
    selectEl.value = currentVal;
  } else if (polls.length > 0) {
    selectEl.value = polls[0].id;
  }
}

function renderPollFormAndStats() {
  const pollQuestion = document.getElementById("poll-question");
  const pollA = document.getElementById("poll-opt-a");
  const pollB = document.getElementById("poll-opt-b");
  const pollC = document.getElementById("poll-opt-c");
  const pollD = document.getElementById("poll-opt-d");
  const adminPollSelect = document.getElementById("admin-poll-active-select");

  if (dbMode === "firebase") {
    db.collection("polls").get()
      .then(snapshot => {
        adminPollsList = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          adminPollsList.push(data);
        });
        if (adminPollsList.length === 0) {
          adminPollsList = DEFAULT_POLLS;
        }
        setupAdminPollUI(adminPollsList, adminPollSelect, pollQuestion, pollA, pollB, pollC, pollD);
      })
      .catch(err => {
        console.error("Error loading polls for admin:", err);
      });
  } else {
    adminPollsList = JSON.parse(localStorage.getItem("rc_polls")) || DEFAULT_POLLS;
    setupAdminPollUI(adminPollsList, adminPollSelect, pollQuestion, pollA, pollB, pollC, pollD);
  }
}

function setupAdminPollUI(polls, selectEl, pollQuestion, pollA, pollB, pollC, pollD) {
  if (!selectEl) return;
  
  if (selectEl.children.length === 0) {
    populateAdminPollSelector(polls, selectEl);
    selectEl.onchange = () => {
      onAdminPollSelectionChange(polls, selectEl, pollQuestion, pollA, pollB, pollC, pollD);
    };
  } else {
    // Sync list options but preserve selection
    populateAdminPollSelector(polls, selectEl);
  }
  
  onAdminPollSelectionChange(polls, selectEl, pollQuestion, pollA, pollB, pollC, pollD);
}

function onAdminPollSelectionChange(polls, selectEl, pollQuestion, pollA, pollB, pollC, pollD) {
  const selectedId = selectEl.value;
  const submitBtn = document.getElementById("admin-poll-submit-btn");
  
  if (selectedId === "new") {
    if (pollQuestion) pollQuestion.value = "";
    if (pollA) pollA.value = "";
    if (pollB) pollB.value = "";
    if (pollC) pollC.value = "";
    if (pollD) pollD.value = "";
    if (submitBtn) submitBtn.textContent = "Create Poll";
    
    // Show empty stats dashboard
    populatePollUI({
      question: "New Poll Questionnaire Draft",
      options: {
        a: { text: "Option A", votes: 0 },
        b: { text: "Option B", votes: 0 },
        c: { text: "Option C", votes: 0 },
        d: { text: "Option D", votes: 0 }
      }
    });
  } else {
    const selectedPoll = polls.find(p => p.id === selectedId) || polls[0];
    if (selectedPoll) {
      if (pollQuestion) pollQuestion.value = selectedPoll.question;
      if (pollA) pollA.value = selectedPoll.options.a.text;
      if (pollB) pollB.value = selectedPoll.options.b.text;
      if (pollC) pollC.value = selectedPoll.options.c.text;
      if (pollD) pollD.value = selectedPoll.options.d.text;
      if (submitBtn) submitBtn.textContent = "Save Poll Settings";
      populatePollUI(selectedPoll);
    }
  }
}

function populatePollUI(poll) {
  const pollTitle = document.getElementById("admin-poll-title");
  const totalVotesEl = document.getElementById("admin-poll-total");

  if (pollTitle) pollTitle.textContent = poll.question;

  const aVotes = poll.options.a.votes || 0;
  const bVotes = poll.options.b.votes || 0;
  const cVotes = poll.options.c.votes || 0;
  const dVotes = poll.options.d.votes || 0;
  const total = aVotes + bVotes + cVotes + dVotes;

  const pct = (votes) => total > 0 ? Math.round((votes / total) * 100) : 0;

  // Labels and Values
  document.getElementById("lbl-opt-a").textContent = poll.options.a.text;
  document.getElementById("val-opt-a").textContent = `${aVotes} votes (${pct(aVotes)}%)`;
  document.getElementById("fill-opt-a").style.width = `${pct(aVotes)}%`;

  document.getElementById("lbl-opt-b").textContent = poll.options.b.text;
  document.getElementById("val-opt-b").textContent = `${bVotes} votes (${pct(bVotes)}%)`;
  document.getElementById("fill-opt-b").style.width = `${pct(bVotes)}%`;

  document.getElementById("lbl-opt-c").textContent = poll.options.c.text;
  document.getElementById("val-opt-c").textContent = `${cVotes} votes (${pct(cVotes)}%)`;
  document.getElementById("fill-opt-c").style.width = `${pct(cVotes)}%`;

  document.getElementById("lbl-opt-d").textContent = poll.options.d.text;
  document.getElementById("val-opt-d").textContent = `${dVotes} votes (${pct(dVotes)}%)`;
  document.getElementById("fill-opt-d").style.width = `${pct(dVotes)}%`;

  if (totalVotesEl) totalVotesEl.textContent = `Total Votes: ${total}`;
}

// 9. FORM SUBMIT HANDLERS
function setupFormSubmissions() {
  const blogForm = document.getElementById("blog-form");
  const newsForm = document.getElementById("news-form");
  const pollForm = document.getElementById("poll-form");
  const resetPollBtn = document.getElementById("reset-poll-votes");
  const deletePollBtn = document.getElementById("delete-poll");
  const adminPollSelect = document.getElementById("admin-poll-active-select");

  // Format Helper for Dates
  const getFormattedDate = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Blog Submission
  if (blogForm) {
    blogForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("blog-title").value.trim();
      const category = document.getElementById("blog-category").value;
      const readtime = document.getElementById("blog-readtime").value.trim();
      const excerpt = document.getElementById("blog-excerpt").value.trim();
      const content = document.getElementById("blog-content").value.trim();
      const imageEl = document.getElementById("blog-image");
      const image = imageEl ? imageEl.value.trim() : "";

      const newBlog = {
        title,
        category,
        readtime,
        excerpt,
        content,
        image: image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
        date: getFormattedDate(),
        featured: false,
        timestamp: Date.now()
      };

      if (dbMode === "firebase") {
        db.collection("blogs").add(newBlog)
          .then(() => {
            blogForm.reset();
            renderBlogsList();
            alert("Blog published successfully!");
          })
          .catch(err => {
            alert("Firebase Error publishing blog: " + err.message);
          });
      } else {
        const blogs = JSON.parse(localStorage.getItem("rc_blogs") || "[]");
        newBlog.id = "blog-" + Date.now();
        blogs.push(newBlog);
        localStorage.setItem("rc_blogs", JSON.stringify(blogs));
        blogForm.reset();
        renderBlogsList();
        alert("Blog published to LocalStorage database!");
      }
    });
  }

  // News Submission
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("news-title").value.trim();
      const category = document.getElementById("news-category").value;
      const details = document.getElementById("news-details").value.trim();
      const imageEl = document.getElementById("news-image");
      const image = imageEl ? imageEl.value.trim() : "";

      const newNews = {
        title,
        category,
        details,
        image: image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600",
        date: getFormattedDate(),
        timestamp: Date.now()
      };

      if (dbMode === "firebase") {
        db.collection("news").add(newNews)
          .then(() => {
            newsForm.reset();
            renderNewsList();
            alert("News alert published successfully!");
          })
          .catch(err => {
            alert("Firebase Error publishing news: " + err.message);
          });
      } else {
        const news = JSON.parse(localStorage.getItem("rc_news") || "[]");
        newNews.id = "news-" + Date.now();
        news.push(newNews);
        localStorage.setItem("rc_news", JSON.stringify(news));
        newsForm.reset();
        renderNewsList();
        alert("News alert published to LocalStorage database!");
      }
    });
  }

  // Poll Settings Form Submit
  if (pollForm) {
    pollForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedId = adminPollSelect.value;
      const question = document.getElementById("poll-question").value.trim();
      const optA = document.getElementById("poll-opt-a").value.trim();
      const optB = document.getElementById("poll-opt-b").value.trim();
      const optC = document.getElementById("poll-opt-c").value.trim();
      const optD = document.getElementById("poll-opt-d").value.trim();

      if (selectedId === "new") {
        // Create new poll
        const newId = "poll-" + Date.now();
        const newPoll = {
          id: newId,
          question,
          options: {
            a: { text: optA, votes: 0 },
            b: { text: optB, votes: 0 },
            c: { text: optC, votes: 0 },
            d: { text: optD, votes: 0 }
          }
        };

        if (dbMode === "firebase") {
          db.collection("polls").doc(newId).set(newPoll)
            .then(() => {
              adminPollSelect.innerHTML = ""; // Force rebuild list
              renderPollFormAndStats();
              alert("New poll created and activated successfully!");
            })
            .catch(err => {
              alert("Firebase Error creating poll: " + err.message);
            });
        } else {
          const localPolls = JSON.parse(localStorage.getItem("rc_polls")) || DEFAULT_POLLS;
          localPolls.push(newPoll);
          localStorage.setItem("rc_polls", JSON.stringify(localPolls));
          
          adminPollSelect.innerHTML = ""; // Force rebuild list
          localStorage.setItem("admin_last_selected_poll", newId);
          setTimeout(() => {
            adminPollSelect.value = newId;
            renderPollFormAndStats();
          }, 100);
          alert("New poll created in LocalStorage database!");
        }
      } else {
        // Update existing poll
        if (dbMode === "firebase") {
          db.collection("polls").doc(selectedId).get()
            .then(doc => {
              if (doc.exists) {
                const poll = doc.data();
                poll.question = question;
                poll.options.a.text = optA;
                poll.options.b.text = optB;
                poll.options.c.text = optC;
                poll.options.d.text = optD;
                return db.collection("polls").doc(selectedId).set(poll);
              }
            })
            .then(() => {
              adminPollSelect.innerHTML = ""; // Force list title update
              renderPollFormAndStats();
              alert("Poll settings updated successfully!");
            })
            .catch(err => {
              alert("Firebase Error updating poll: " + err.message);
            });
        } else {
          const localPolls = JSON.parse(localStorage.getItem("rc_polls")) || DEFAULT_POLLS;
          const idx = localPolls.findIndex(p => p.id === selectedId);
          if (idx !== -1) {
            localPolls[idx].question = question;
            localPolls[idx].options.a.text = optA;
            localPolls[idx].options.b.text = optB;
            localPolls[idx].options.c.text = optC;
            localPolls[idx].options.d.text = optD;
            localStorage.setItem("rc_polls", JSON.stringify(localPolls));
          }
          adminPollSelect.innerHTML = ""; // Force list title update
          renderPollFormAndStats();
          alert("Poll settings updated in LocalStorage!");
        }
      }
    });
  }

  // Reset votes click
  if (resetPollBtn) {
    resetPollBtn.addEventListener("click", () => {
      const selectedId = adminPollSelect.value;
      if (selectedId === "new") return;

      if (!confirm("Are you sure you want to reset all vote counts to 0 for this poll?")) return;

      if (dbMode === "firebase") {
        db.collection("polls").doc(selectedId).get()
          .then(doc => {
            if (doc.exists) {
              const poll = doc.data();
              poll.options.a.votes = 0;
              poll.options.b.votes = 0;
              poll.options.c.votes = 0;
              poll.options.d.votes = 0;
              return db.collection("polls").doc(selectedId).set(poll);
            }
          })
          .then(() => {
            renderPollFormAndStats();
            alert("Votes reset successfully!");
          })
          .catch(err => {
            alert("Firebase Error resetting votes: " + err.message);
          });
      } else {
        const localPolls = JSON.parse(localStorage.getItem("rc_polls")) || DEFAULT_POLLS;
        const idx = localPolls.findIndex(p => p.id === selectedId);
        if (idx !== -1) {
          localPolls[idx].options.a.votes = 0;
          localPolls[idx].options.b.votes = 0;
          localPolls[idx].options.c.votes = 0;
          localPolls[idx].options.d.votes = 0;
          localStorage.setItem("rc_polls", JSON.stringify(localPolls));
          // Clear local voted cookies for this poll ID
          localStorage.removeItem("rc_voted_" + selectedId);
        }
        renderPollFormAndStats();
        alert("Votes reset in LocalStorage database!");
      }
    });
  }

  // Delete poll click
  if (deletePollBtn) {
    deletePollBtn.addEventListener("click", () => {
      const selectedId = adminPollSelect.value;
      if (selectedId === "new") return;

      if (dbMode === "firebase") {
        // Count total polls
        db.collection("polls").get()
          .then(snapshot => {
            if (snapshot.size <= 1) {
              alert("Cannot delete the only remaining poll in the database.");
              return;
            }
            if (!confirm("Are you sure you want to delete this poll permanently?")) return;
            
            db.collection("polls").doc(selectedId).delete()
              .then(() => {
                adminPollSelect.innerHTML = "";
                renderPollFormAndStats();
                alert("Poll deleted successfully!");
              });
          })
          .catch(err => {
            alert("Error: " + err.message);
          });
      } else {
        const localPolls = JSON.parse(localStorage.getItem("rc_polls")) || DEFAULT_POLLS;
        if (localPolls.length <= 1) {
          alert("Cannot delete the only remaining poll in the database.");
          return;
        }
        if (!confirm("Are you sure you want to delete this poll permanently?")) return;

        const filtered = localPolls.filter(p => p.id !== selectedId);
        localStorage.setItem("rc_polls", JSON.stringify(filtered));
        localStorage.removeItem("rc_voted_" + selectedId);
        adminPollSelect.innerHTML = "";
        renderPollFormAndStats();
        alert("Poll deleted from LocalStorage database!");
      }
    });
  }
}

// 10. HELPER FUNCTIONS
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 10b. LEADS OPERATIONS
function renderLeadsList() {
  const tableBody = document.getElementById("leads-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";
  
  const leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
  
  if (leads.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">No leads received yet. Complete the CPI calculator or chat with the Support Genie to submit leads.</td></tr>`;
    return;
  }
  
  leads.forEach(lead => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-size: 12px; color: var(--text-muted);">${escapeHtml(lead.date) || 'N/A'}</td>
      <td><strong>${escapeHtml(lead.name) || 'N/A'}</strong><br><span style="font-size: 11px; color: var(--text-muted);">${escapeHtml(lead.company) || 'N/A'}</span></td>
      <td style="font-size: 12.5px;"><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a><br><span style="font-size: 11px; color: var(--text-muted);">${escapeHtml(lead.phone) || 'N/A'}</span></td>
      <td><span class="status-badge badge-teal" style="font-size:10px; padding: 2px 6px;">CPI: ${escapeHtml(lead.cpi) || 'N/A'}</span><br><span style="font-size:11px; color:var(--turquoise-accent); font-weight: 500;">Budget: ${escapeHtml(lead.budget) || 'N/A'}</span></td>
      <td style="font-size: 12.5px; line-height: 1.4; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: normal;">${escapeHtml(lead.message) || 'N/A'}</td>
      <td><span class="status-badge ${lead.source === 'Support Genie Chatbot' ? 'badge-purple' : 'badge-emerald'}" style="font-size: 10px; padding: 2px 6px;">${escapeHtml(lead.source) || 'Form'}</span></td>
      <td>
        <button class="btn-delete-lead" data-id="${lead.id}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 14px;" title="Delete Lead">🗑</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  // Attach delete listeners
  document.querySelectorAll(".btn-delete-lead").forEach(btn => {
    btn.removeAttribute("onclick");
    btn.addEventListener("click", () => {
      const leadId = btn.getAttribute("data-id");
      deleteLead(leadId);
    });
  });
}

function deleteLead(id) {
  if (confirm("Are you sure you want to delete this lead?")) {
    let leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
    leads = leads.filter(l => l.id !== id);
    localStorage.setItem('rc_leads', JSON.stringify(leads));
    renderLeadsList();
  }
}

function clearAllLeads() {
  if (confirm("Are you sure you want to clear all leads? This cannot be undone.")) {
    localStorage.setItem('rc_leads', JSON.stringify([]));
    renderLeadsList();
  }
}

function setupLeadsHook() {
  const btnClearLeads = document.getElementById("btn-clear-leads");
  if (btnClearLeads) {
    btnClearLeads.addEventListener("click", clearAllLeads);
  }
}

// 11. DOM INITIALIZATION RUNNER
document.addEventListener("DOMContentLoaded", () => {
  initDatabaseMode();
  setupAuth();
  setupTabs();
  setupFormSubmissions();
  setupLeadsHook();
});
