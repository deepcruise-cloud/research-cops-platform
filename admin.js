// Research COPS - Admin Portal Controller
// Integrates Firebase Authentication and Firestore with a robust LocalStorage fallback
// Manages Blogs, News, Polls, Leads, and General Site Settings (Footer & Policies)

const firebaseConfig = {
  apiKey: "AIzaSyDknEqerA09CE3PT0L0m-nISkBCBPitWEw",
  authDomain: "research-cops-platform-e6520.firebaseapp.com",
  projectId: "research-cops-platform-e6520",
  storageBucket: "research-cops-platform-e6520.firebasestorage.app",
  messagingSenderId: "992558119740",
  appId: "1:992558119740:web:c484f96c5b774e9d17fc39",
  measurementId: "G-11SKJM62QW"
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

const DEFAULT_POLICIES = {
  privacy: {
    title: "Privacy Policy",
    content: `# Privacy Policy\n\nAt **Research COPS**, accessible from [https://researchcops.com](https://researchcops.com), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Research COPS and how we use it.\n\nIf you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.\n\n## 1. Consent\nBy using our website, you hereby consent to our Privacy Policy and agree to its terms.\n\n## 2. Information We Collect\nThe personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.\n* If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.\n* When you request a B2B project estimate or chat with our Support Genie, we collect contact credentials (name, email, phone) alongside project parameters (sample size, CPI margin) to build your proposal.\n\n## 3. How We Use Your Information\nWe use the information we collect in various ways, including to:\n* Provide, operate, and maintain our website\n* Improve, personalize, and expand our website\n* Understand and analyze how you use our website\n* Develop new products, services, features, and functionality\n* Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes\n* Send you emails\n* Find and prevent fraud\n\n## 4. Log Files\nResearch COPS follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.`
  },
  terms: {
    title: "Terms & Conditions",
    content: `# Terms & Conditions\n\nWelcome to **Research COPS**!\n\nThese terms and conditions outline the rules and regulations for the use of Research COPS's Website, located at [https://researchcops.com](https://researchcops.com).\n\nBy accessing this website we assume you accept these terms and conditions. Do not continue to use Research COPS if you do not agree to take all of the terms and conditions stated on this page.\n\n## 1. Cookies\nWe employ the use of cookies. By accessing Research COPS, you agreed to use cookies in agreement with the Research COPS's Privacy Policy.\n\nMost interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.\n\n## 2. License\nUnless otherwise stated, Research COPS and/or its licensors own the intellectual property rights for all material on Research COPS. All intellectual property rights are reserved. You may access this from Research COPS for your own personal use subjected to restrictions set in these terms and conditions.\n\nYou must not:\n* Republish material from Research COPS\n* Sell, rent or sub-license material from Research COPS\n* Reproduce, duplicate or copy material from Research COPS\n* Redistribute content from Research COPS`
  },
  cookies: {
    title: "Cookies Policy",
    content: `# Cookies Policy\n\nThis is the Cookies Policy for **Research COPS**, accessible from [https://researchcops.com](https://researchcops.com).\n\n## 1. What Are Cookies\nAs is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use them and why we need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.\n\n## 2. How We Use Cookies\nWe use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not.`
  }
};

// Initialize Database Connection Mode
function initDatabaseMode() {
  const isConfigured = firebaseConfig && 
                       firebaseConfig.apiKey && 
                       !firebaseConfig.apiKey.startsWith("YOUR_") && 
                       firebaseConfig.apiKey !== "";

  if (isConfigured && typeof firebase !== "undefined") {
    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      auth = firebase.auth();
      dbMode = "firebase";
      console.log("Admin Portal: Live Firebase DB Connected successfully.");
      checkAndSeedFirestore();
    } catch (e) {
      console.error("Firebase init failed. Reverting to LocalStorage:", e);
      setupLocalFallback();
    }
  } else {
    setupLocalFallback();
  }
}

// Check and Seed Default Content into clean Firestore Database
function checkAndSeedFirestore() {
  if (dbMode !== "firebase" || !db) return;

  // Seeding default blogs
  db.collection("blogs").limit(1).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("Firestore 'blogs' collection is empty. Seeding default blogs...");
        const batch = db.batch();
        DEFAULT_BLOGS.forEach(blog => {
          const docRef = db.collection("blogs").doc(blog.id);
          batch.set(docRef, blog);
        });
        batch.commit()
          .then(() => {
            console.log("Firestore 'blogs' collection successfully seeded.");
            renderBlogsList();
          })
          .catch(err => console.error("Error seeding blogs:", err));
      }
    });

  // Seeding default news
  db.collection("news").limit(1).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("Firestore 'news' collection is empty. Seeding default news...");
        const batch = db.batch();
        DEFAULT_NEWS.forEach(item => {
          const docRef = db.collection("news").doc(item.id);
          batch.set(docRef, item);
        });
        batch.commit()
          .then(() => {
            console.log("Firestore 'news' collection successfully seeded.");
            renderNewsList();
          })
          .catch(err => console.error("Error seeding news:", err));
      }
    });

  // Seeding default polls
  db.collection("polls").limit(1).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("Firestore 'polls' collection is empty. Seeding default polls...");
        const batch = db.batch();
        DEFAULT_POLLS.forEach(poll => {
          const docRef = db.collection("polls").doc(poll.id);
          batch.set(docRef, poll);
        });
        batch.commit()
          .then(() => {
            console.log("Firestore 'polls' collection successfully seeded.");
            renderPollFormAndStats();
          })
          .catch(err => console.error("Error seeding polls:", err));
      }
    });
}

function setupLocalFallback() {
  dbMode = "local";
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
  const logoutBtns = document.querySelectorAll("#admin-logout-btn, #admin-logout-btn-sidebar");

  if (dbMode === "firebase") {
    auth.onAuthStateChanged(user => {
      if (user) {
        activeUser = user;
        loginScreen.style.display = "none";
        controlCenter.style.display = "block";
        if (userDisplay) userDisplay.textContent = user.email;
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

    logoutBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        auth.signOut();
      });
    });
  } else {
    // LocalStorage Auth Mock
    const checkSession = () => {
      const loggedIn = sessionStorage.getItem("rc_admin_logged_in") === "true";
      if (loggedIn) {
        loginScreen.style.display = "none";
        controlCenter.style.display = "block";
        if (userDisplay) userDisplay.textContent = "admin@researchcops.com";
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

    logoutBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        sessionStorage.removeItem("rc_admin_logged_in");
        checkSession();
      });
    });
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
      } else if (target === "panel-settings") {
        loadFooterSettingsAdmin();
        loadPolicySettingsAdmin();
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
  loadFooterSettingsAdmin();
  loadPolicySettingsAdmin();
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
            document.getElementById("blog-preview-pane").innerHTML = '<p style="color: var(--text-muted); font-style: italic;">As you type in the editor, your post will render here in real time...</p>';
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
        document.getElementById("blog-preview-pane").innerHTML = '<p style="color: var(--text-muted); font-style: italic;">As you type in the editor, your post will render here in real time...</p>';
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

// Simple Markdown Compiler
function compileMarkdown(markdown) {
  if (!markdown) return "";
  let html = markdown;

  // Escape HTML tags to prevent XSS in preview (allowing only safe tags we create)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

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

  // Images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Paragraphs
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li>') || trimmed.startsWith('<img') || trimmed.startsWith('<p>')) return line;
    return `<p>${line}</p>`;
  });
  
  return processedLines.filter(l => l !== "").join('\n');
}

// Editor Markdown Toolbar Insertion Helper
function insertMarkdown(textarea, format) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);
  
  let replacement = "";
  let cursorOffset = 0;
  
  switch(format) {
    case "bold":
      replacement = `**${selected || "bold"}**`;
      cursorOffset = selected ? 0 : 2;
      break;
    case "italic":
      replacement = `*${selected || "italic"}*`;
      cursorOffset = selected ? 0 : 1;
      break;
    case "h2":
      replacement = `\n## ${selected || "Heading 2"}\n`;
      cursorOffset = selected ? 0 : 1;
      break;
    case "h3":
      replacement = `\n### ${selected || "Heading 3"}\n`;
      cursorOffset = selected ? 0 : 1;
      break;
    case "list":
      replacement = `\n* ${selected || "Item"}\n`;
      cursorOffset = selected ? 0 : 1;
      break;
    case "link":
      replacement = `[${selected || "Link Text"}](https://)`;
      cursorOffset = selected ? 0 : 11;
      break;
    case "image":
      replacement = `![${selected || "Image Caption"}](https://)`;
      cursorOffset = selected ? 0 : 12;
      break;
  }
  
  textarea.value = text.substring(0, start) + replacement + text.substring(end);
  textarea.focus();
  
  const newCursorPos = start + replacement.length - cursorOffset;
  textarea.setSelectionRange(newCursorPos, newCursorPos);
  
  // Trigger input event to update live preview
  textarea.dispatchEvent(new Event("input"));
}

// 10b. LEADS OPERATIONS
function renderLeadsList() {
  const tableBody = document.getElementById("leads-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";
  
  if (dbMode === "firebase") {
    db.collection("leads").get()
      .then(snapshot => {
        const leads = [];
        snapshot.forEach(doc => {
          const lead = doc.data();
          lead.id = doc.id;
          leads.push(lead);
        });
        leads.sort((a, b) => {
          const tA = a.timestamp || 0;
          const tB = b.timestamp || 0;
          return tB - tA;
        });
        injectLeadsIntoTable(tableBody, leads);
      })
      .catch(err => {
        console.error("Error fetching leads from Firestore:", err);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ef4444; padding: 30px;">Error loading leads from cloud database: ${escapeHtml(err.message)}</td></tr>`;
      });
  } else {
    const leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
    leads.sort((a, b) => {
      const tA = a.timestamp || 0;
      const tB = b.timestamp || 0;
      return tB - tA;
    });
    injectLeadsIntoTable(tableBody, leads);
  }
}

function injectLeadsIntoTable(tableBody, leads) {
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
      <td><span class="status-badge ${lead.source && lead.source.includes('Genie') ? 'badge-purple' : 'badge-emerald'}" style="font-size: 10px; padding: 2px 6px;">${escapeHtml(lead.source) || 'Form'}</span></td>
      <td>
        <button class="btn-delete-lead" data-id="${lead.id}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 14px;" title="Delete Lead">🗑</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  // Attach delete listeners
  tableBody.querySelectorAll(".btn-delete-lead").forEach(btn => {
    btn.addEventListener("click", () => {
      const leadId = btn.getAttribute("data-id");
      deleteLead(leadId);
    });
  });
}

function deleteLead(id) {
  if (confirm("Are you sure you want to delete this lead?")) {
    if (dbMode === "firebase") {
      db.collection("leads").doc(id).delete()
        .then(() => {
          renderLeadsList();
        })
        .catch(err => {
          alert("Failed to delete lead from Firestore: " + err.message);
        });
    } else {
      let leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
      leads = leads.filter(l => l.id !== id);
      localStorage.setItem('rc_leads', JSON.stringify(leads));
      renderLeadsList();
    }
  }
}

function clearAllLeads() {
  if (confirm("Are you sure you want to clear all leads? This cannot be undone.")) {
    if (dbMode === "firebase") {
      db.collection("leads").get()
        .then(snapshot => {
          const batch = db.batch();
          snapshot.forEach(doc => {
            batch.delete(doc.ref);
          });
          return batch.commit().then(() => {
            renderLeadsList();
            alert("All leads cleared from Firestore!");
          });
        })
        .catch(err => {
          alert("Failed to clear leads from Firestore: " + err.message);
        });
    } else {
      localStorage.setItem('rc_leads', JSON.stringify([]));
      renderLeadsList();
    }
  }
}

// 10c. CSV GENERATION AND DOWNLOAD ENGINE
function downloadLeadsCSV() {
  let leadsPromise;
  if (dbMode === "firebase") {
    leadsPromise = db.collection("leads").get().then(snapshot => {
      const leads = [];
      snapshot.forEach(doc => {
        const lead = doc.data();
        lead.id = doc.id;
        leads.push(lead);
      });
      leads.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      return leads;
    });
  } else {
    const leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
    leads.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    leadsPromise = Promise.resolve(leads);
  }
  
  leadsPromise.then(leads => {
    if (leads.length === 0) {
      alert("No leads available to export.");
      return;
    }
    
    const headers = ["Date", "Name", "Company", "Email", "Phone", "CPI ($)", "Budget ($)", "Message", "Source"];
    
    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    };
    
    let csvContent = headers.map(escapeCSV).join(",") + "\r\n";
    
    leads.forEach(lead => {
      const row = [
        lead.date || "",
        lead.name || "",
        lead.company || "",
        lead.email || "",
        lead.phone || "",
        lead.cpi || "",
        lead.budget || "",
        lead.message || "",
        lead.source || "Form"
      ];
      csvContent += row.map(escapeCSV).join(",") + "\r\n";
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `research_cops_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }).catch(err => {
    console.error("Error generating leads CSV:", err);
    alert("Error downloading CSV: " + err.message);
  });
}

function downloadPollCSV() {
  const adminPollSelect = document.getElementById("admin-poll-active-select");
  if (!adminPollSelect) return;
  const selectedId = adminPollSelect.value;
  if (selectedId === "new") {
    alert("Please select a saved poll to download results.");
    return;
  }
  
  const poll = adminPollsList.find(p => p.id === selectedId);
  if (!poll) {
    alert("Poll not found.");
    return;
  }
  
  const aVotes = poll.options.a.votes || 0;
  const bVotes = poll.options.b.votes || 0;
  const cVotes = poll.options.c.votes || 0;
  const dVotes = poll.options.d.votes || 0;
  const total = aVotes + bVotes + cVotes + dVotes;
  
  const pct = (votes) => total > 0 ? ((votes / total) * 100).toFixed(1) : "0.0";
  
  const headers = ["Question", "Option Label", "Option Text", "Votes", "Percentage (%)"];
  const rows = [
    [poll.question, "Option A", poll.options.a.text, aVotes, pct(aVotes)],
    [poll.question, "Option B", poll.options.b.text, bVotes, pct(bVotes)],
    [poll.question, "Option C", poll.options.c.text, cVotes, pct(cVotes)],
    [poll.question, "Option D", poll.options.d.text, dVotes, pct(dVotes)],
    [poll.question, "Total", "All Choices", total, "100.0"]
  ];
  
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  };
  
  let csvContent = headers.map(escapeCSV).join(",") + "\r\n";
  rows.forEach(row => {
    csvContent += row.map(escapeCSV).join(",") + "\r\n";
  });
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `poll_results_${selectedId}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 10d. FOOTER AND POLICY CONFIGURATION
function loadFooterSettingsAdmin() {
  const footerDesc = document.getElementById("settings-footer-desc");
  const footerPhone = document.getElementById("settings-footer-phone");
  const footerEmailInfo = document.getElementById("settings-footer-email-info");
  const footerEmailBidding = document.getElementById("settings-footer-email-bidding");
  const footerAddress = document.getElementById("settings-footer-address");

  if (!footerDesc) return;

  const defaultFooter = {
    description: "Precision data collection infrastructure for global market research. 2M+ verified panelists globally through our partner network and our panel Opinion Genie.",
    phone: "+91-0120-605-1391",
    emailInfo: "info-team@researchcops.com",
    emailBidding: "Bidding-team@researchcops.com",
    address: "T4-A11, NX One Avenue, Plot No - 17,\nTechzone 4, Greater Noida, UP 201306"
  };

  const populateFooterForm = (data) => {
    footerDesc.value = data.description || defaultFooter.description;
    footerPhone.value = data.phone || defaultFooter.phone;
    footerEmailInfo.value = data.emailInfo || defaultFooter.emailInfo;
    footerEmailBidding.value = data.emailBidding || defaultFooter.emailBidding;
    footerAddress.value = data.address || defaultFooter.address;
  };

  if (dbMode === "firebase" && db) {
    db.collection("settings").doc("footer").get()
      .then(doc => {
        if (doc.exists) {
          populateFooterForm(doc.data());
        } else {
          populateFooterForm(defaultFooter);
        }
      })
      .catch(err => {
        console.error("Error loading admin footer settings:", err);
        populateFooterForm(defaultFooter);
      });
  } else {
    const localFooter = JSON.parse(localStorage.getItem("rc_footer_settings"));
    if (localFooter) {
      populateFooterForm(localFooter);
    } else {
      populateFooterForm(defaultFooter);
    }
  }
}

function saveFooterSettingsAdmin(e) {
  e.preventDefault();
  const description = document.getElementById("settings-footer-desc").value.trim();
  const phone = document.getElementById("settings-footer-phone").value.trim();
  const emailInfo = document.getElementById("settings-footer-email-info").value.trim();
  const emailBidding = document.getElementById("settings-footer-email-bidding").value.trim();
  const address = document.getElementById("settings-footer-address").value.trim();

  const footerData = { description, phone, emailInfo, emailBidding, address };

  if (dbMode === "firebase" && db) {
    db.collection("settings").doc("footer").set(footerData)
      .then(() => {
        alert("Footer settings saved successfully to Cloud Database!");
      })
      .catch(err => {
        alert("Error saving footer settings to Firebase: " + err.message);
      });
  } else {
    localStorage.setItem("rc_footer_settings", JSON.stringify(footerData));
    alert("Footer settings saved to LocalStorage database!");
  }
}

function loadPolicySettingsAdmin() {
  const policySelect = document.getElementById("settings-policy-select");
  const policyTitleInput = document.getElementById("settings-policy-title");
  const policyContentArea = document.getElementById("settings-policy-content");
  const policyPreviewPane = document.getElementById("policy-preview-pane");

  if (!policySelect || !policyTitleInput || !policyContentArea) return;

  const activeId = policySelect.value;

  const populatePolicyForm = (title, content) => {
    policyTitleInput.value = title;
    policyContentArea.value = content;
    if (policyPreviewPane) {
      policyPreviewPane.innerHTML = compileMarkdown(content);
    }
  };

  if (dbMode === "firebase" && db) {
    db.collection("policies").doc(activeId).get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          populatePolicyForm(data.title, data.content);
        } else {
          const fallback = DEFAULT_POLICIES[activeId] || { title: "", content: "" };
          populatePolicyForm(fallback.title, fallback.content);
        }
      })
      .catch(err => {
        console.error("Error loading policy for edit:", err);
        const fallback = DEFAULT_POLICIES[activeId] || { title: "", content: "" };
        populatePolicyForm(fallback.title, fallback.content);
      });
  } else {
    const localPolicies = JSON.parse(localStorage.getItem("rc_policies") || "{}");
    if (localPolicies[activeId]) {
      populatePolicyForm(localPolicies[activeId].title, localPolicies[activeId].content);
    } else {
      const fallback = DEFAULT_POLICIES[activeId] || { title: "", content: "" };
      populatePolicyForm(fallback.title, fallback.content);
    }
  }
}

function savePolicySettingsAdmin(e) {
  if (e) e.preventDefault();
  const policySelect = document.getElementById("settings-policy-select");
  const policyTitle = document.getElementById("settings-policy-title").value.trim();
  const policyContent = document.getElementById("settings-policy-content").value.trim();

  if (!policySelect) return;
  const activeId = policySelect.value;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const d = new Date();
  const updatedDate = `Last Updated: ${months[d.getMonth()]} ${d.getFullYear()}`;

  const policyData = {
    title: policyTitle,
    content: policyContent,
    updated: updatedDate
  };

  if (dbMode === "firebase" && db) {
    db.collection("policies").doc(activeId).set(policyData)
      .then(() => {
        alert("Policy changes saved successfully to Cloud Database!");
      })
      .catch(err => {
        alert("Error saving policy to Firebase: " + err.message);
      });
  } else {
    const localPolicies = JSON.parse(localStorage.getItem("rc_policies") || "{}");
    localPolicies[activeId] = policyData;
    localStorage.setItem("rc_policies", JSON.stringify(localPolicies));
    alert("Policy changes saved to LocalStorage database!");
  }
}

// 11. DOM INITIALIZATION RUNNER
document.addEventListener("DOMContentLoaded", () => {
  initDatabaseMode();
  setupAuth();
  setupTabs();
  setupFormSubmissions();
  
  // Set up leads hook
  const btnClearLeads = document.getElementById("btn-clear-leads");
  if (btnClearLeads) {
    btnClearLeads.addEventListener("click", clearAllLeads);
  }
  
  const btnDownloadLeads = document.getElementById("btn-download-leads");
  if (btnDownloadLeads) {
    btnDownloadLeads.addEventListener("click", downloadLeadsCSV);
  }

  const btnDownloadPoll = document.getElementById("btn-download-poll");
  if (btnDownloadPoll) {
    btnDownloadPoll.addEventListener("click", downloadPollCSV);
  }

  // Setup markdown live previews
  const blogContent = document.getElementById("blog-content");
  const blogPreview = document.getElementById("blog-preview-pane");
  if (blogContent && blogPreview) {
    blogContent.addEventListener("input", () => {
      blogPreview.innerHTML = compileMarkdown(blogContent.value);
    });
  }

  const policyContent = document.getElementById("settings-policy-content");
  const policyPreview = document.getElementById("policy-preview-pane");
  if (policyContent && policyPreview) {
    policyContent.addEventListener("input", () => {
      policyPreview.innerHTML = compileMarkdown(policyContent.value);
    });
  }

  // Setup editor toolbar insertions
  document.querySelectorAll(".toolbar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const format = btn.getAttribute("data-format");
      const textarea = document.getElementById("blog-content");
      if (textarea) {
        insertMarkdown(textarea, format);
      }
    });
  });

  document.querySelectorAll(".policy-toolbar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const format = btn.getAttribute("data-format");
      const textarea = document.getElementById("settings-policy-content");
      if (textarea) {
        insertMarkdown(textarea, format);
      }
    });
  });

  // Setup policy settings panel select triggers & forms
  const policySelect = document.getElementById("settings-policy-select");
  if (policySelect) {
    policySelect.addEventListener("change", loadPolicySettingsAdmin);
  }

  const footerSettingsForm = document.getElementById("footer-settings-form");
  if (footerSettingsForm) {
    footerSettingsForm.addEventListener("submit", saveFooterSettingsAdmin);
  }

  const policySettingsForm = document.getElementById("policy-editor-form");
  if (policySettingsForm) {
    policySettingsForm.addEventListener("submit", savePolicySettingsAdmin);
  }
});
