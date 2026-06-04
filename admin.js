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
    title: "Concept Testing: Maximizing Validation for Early-Stage Product Dev",
    category: "Methodology",
    readtime: "5 min read",
    excerpt: "How to structure rapid validation surveys that yield clear direction, optimize LOI, and prevent cognitive overload.",
    content: "Concept testing is a critical phase in product development. This article outlines the key steps to structure surveys that yield clear direction, optimize Length of Interview (LOI), and prevent cognitive overload.\n\n### Key Pillars of Concept Testing\n1. **Define Clear Objectives**: Know exactly what hypothesis you are testing before writing the first question.\n2. **Optimize Respondent Flow**: Keep surveys under 10 minutes to minimize drop-offs and straight-lining behavior.\n3. **Dynamic Visual Aids**: Embed high-fidelity screenshots or videos of the concept to keep engagement levels high.\n\nBy following this structured approach, researchers can secure higher data validation scores and more actionable B2B/consumer insights.",
    date: "May 2026",
    featured: false,
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: "blog-2",
    title: "Device Comparison: Mobile vs. Desktop Response Quality in B2B",
    category: "Technology",
    readtime: "6 min read",
    excerpt: "A comparative study of completion rates and survey straight-lining behavior across form factors in enterprise environments.",
    content: "A comparative study of completion rates and survey straight-lining behavior across form factors in enterprise environments. With over 60% of respondents initiating surveys on mobile devices, optimizing the mobile survey experience is no longer optional.\n\n### Key Findings\n* **Completion Rates**: Desktops still maintain a 5% higher completion rate for surveys exceeding 20 minutes.\n* **Data Quality**: Open-ended responses are 45% longer and more detailed when completed on desktop keyboards.\n* **Attention Fails**: Mobile users are twice as likely to fail speeder and VPN checks if the survey UI is not fully responsive.\n\nWe recommend implementing a mobile-first design strategy with large touch targets and minimum vertical scrolling.",
    date: "April 2026",
    featured: false,
    timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000
  },
  {
    id: "blog-3",
    title: "Navigating Healthcare Panels: Reaching HCPs and C-Suite",
    category: "Methodology",
    readtime: "8 min read",
    excerpt: "Strategies for recruiting, profiling, and rewarding low-incidence healthcare professionals and decision-makers.",
    content: "Strategies for recruiting, profiling, and rewarding low-incidence healthcare professionals and decision-makers.\n\nHealthcare research requires access to specialized, high-demand cohorts. Standard panel recruitment fails when attempting to survey active physicians, oncologists, or hospital executives.\n\n### Strategic Takeaways\n1. **Double-Blind Verification**: Cross-reference credentials against national databases (e.g., NPI in the US).\n2. **Custom Incentive Models**: Traditional cash incentives are ineffective; offer professional development credits or charitable donation match programs.\n3. **Micro-LOI Optimization**: Healthcare professionals are time-starved. Design modular 5-minute surveys that can be completed between shifts.\n\nBy building highly trusted, niche sub-panels, Research COPS ensures client studies achieve rapid feasibility clearance.",
    date: "March 2026",
    featured: false,
    timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000
  },
  {
    id: "blog-featured",
    title: "The Science of Quality: Shielding Online Panels from AI Bot Intrusion",
    category: "Methodology",
    readtime: "6 min read",
    excerpt: "How generative AI is changing the landscape of data fraud in survey panels, and the multi-layered cryptographic safeguards required to protect survey data integrity.",
    content: "How generative AI is changing the landscape of data fraud in survey panels, and the multi-layered cryptographic safeguards required to protect survey data integrity.\n\nAs LLMs and autonomous agents grow more sophisticated, traditional CAPTCHAs are no longer sufficient to secure research panels. Cybercriminals utilize automated scripts to speed through surveys and claim digital incentives.\n\n### The Anti-Fraud Defensive Grid\n* **Entropy Mapping**: Analyze keystroke intervals and mouse telemetry to distinguish humans from bots.\n* **Residential Proxy Blocking**: Blacklist traffic originating from VPN nodes or residential proxy pools.\n* **Dynamic Verification**: Inject real-time cognitive checks that require human logic to solve, filtering out machine automated responses.\n\nResearch COPS incorporates these state-of-the-art defenses directly into our OpinionGenie core panel engine.",
    date: "June 2026",
    featured: true,
    timestamp: Date.now()
  }
];

const DEFAULT_NEWS = [
  {
    id: "news-1",
    title: "Opinion Genie v3.4 Cryptographic Fingerprinting Live",
    category: "Security",
    details: "Rollout of device-level entropy mapping reduces duplicate respondent profiles by 99.4% globally.",
    date: "June 2026",
    timestamp: Date.now()
  },
  {
    id: "news-2",
    title: "Enhanced GDPR Rules for B2B Trackers",
    category: "Compliance",
    details: "Automated variables hashing during real-time sync checkpoints with external client CRMs.",
    date: "May 2026",
    timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000
  },
  {
    id: "news-3",
    title: "Advanced Proxy Database Integration",
    category: "Anti-Fraud",
    details: "Real-time threat evaluation for residential proxies and micro-VPN routing networks.",
    date: "April 2026",
    timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000
  }
];

const DEFAULT_POLL = {
  id: "active-poll",
  question: "What is your primary research pipeline bottleneck?",
  options: {
    a: { text: "Panel Feasibility Verification", votes: 45 },
    b: { text: "Data Deduplication & Fraud", votes: 78 },
    c: { text: "Slow Turnaround Times", votes: 32 },
    d: { text: "Legacy ERP Integration Issues", votes: 19 }
  }
};

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

  // Pre-seed tables if empty
  if (!localStorage.getItem("rc_blogs")) {
    localStorage.setItem("rc_blogs", JSON.stringify(DEFAULT_BLOGS));
  }
  if (!localStorage.getItem("rc_news")) {
    localStorage.setItem("rc_news", JSON.stringify(DEFAULT_NEWS));
  }
  if (!localStorage.getItem("rc_poll")) {
    localStorage.setItem("rc_poll", JSON.stringify(DEFAULT_POLL));
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
    });
  });
}

// 5. Data Fetch & Load Engine
function loadDashboardData() {
  renderBlogsList();
  renderNewsList();
  renderPollFormAndStats();
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
function renderPollFormAndStats() {
  const pollQuestion = document.getElementById("poll-question");
  const pollA = document.getElementById("poll-opt-a");
  const pollB = document.getElementById("poll-opt-b");
  const pollC = document.getElementById("poll-opt-c");
  const pollD = document.getElementById("poll-opt-d");

  if (dbMode === "firebase") {
    db.collection("polls").doc("active-poll").get()
      .then(doc => {
        if (doc.exists) {
          const pollData = doc.data();
          populatePollUI(pollData);
          // Set inputs to match
          if (pollQuestion) pollQuestion.value = pollData.question;
          if (pollA) pollA.value = pollData.options.a.text;
          if (pollB) pollB.value = pollData.options.b.text;
          if (pollC) pollC.value = pollData.options.c.text;
          if (pollD) pollD.value = pollData.options.d.text;
        } else {
          // Initialize poll in Firestore if missing
          db.collection("polls").doc("active-poll").set(DEFAULT_POLL)
            .then(() => renderPollFormAndStats());
        }
      })
      .catch(err => {
        console.error("Error reading active poll: ", err);
      });
  } else {
    const pollData = JSON.parse(localStorage.getItem("rc_poll")) || DEFAULT_POLL;
    populatePollUI(pollData);
    if (pollQuestion) pollQuestion.value = pollData.question;
    if (pollA) pollA.value = pollData.options.a.text;
    if (pollB) pollB.value = pollData.options.b.text;
    if (pollC) pollC.value = pollData.options.c.text;
    if (pollD) pollD.value = pollData.options.d.text;
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

  // Format Helper for Dates
  const getFormattedDate = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Blog Submision
  if (blogForm) {
    blogForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("blog-title").value.trim();
      const category = document.getElementById("blog-category").value;
      const readtime = document.getElementById("blog-readtime").value.trim();
      const excerpt = document.getElementById("blog-excerpt").value.trim();
      const content = document.getElementById("blog-content").value.trim();

      const newBlog = {
        title,
        category,
        readtime,
        excerpt,
        content,
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

      const newNews = {
        title,
        category,
        details,
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

  // Active Poll Config Submission
  if (pollForm) {
    pollForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const question = document.getElementById("poll-question").value.trim();
      const optA = document.getElementById("poll-opt-a").value.trim();
      const optB = document.getElementById("poll-opt-b").value.trim();
      const optC = document.getElementById("poll-opt-c").value.trim();
      const optD = document.getElementById("poll-opt-d").value.trim();

      // Keep votes from matching options if they align, or reset them
      // To keep things simple, modifying the question or option text retains structure with 0 votes on configuration change (acts as a new poll)
      const newPoll = {
        id: "active-poll",
        question,
        options: {
          a: { text: optA, votes: 0 },
          b: { text: optB, votes: 0 },
          c: { text: optC, votes: 0 },
          d: { text: optD, votes: 0 }
        }
      };

      if (dbMode === "firebase") {
        db.collection("polls").doc("active-poll").set(newPoll)
          .then(() => {
            renderPollFormAndStats();
            alert("Active poll updated and votes reset!");
          })
          .catch(err => {
            alert("Firebase Error updating poll: " + err.message);
          });
      } else {
        localStorage.setItem("rc_poll", JSON.stringify(newPoll));
        // Clear user vote cookie block as well for the new poll
        localStorage.removeItem("rc_user_voted");
        renderPollFormAndStats();
        alert("Active poll updated in LocalStorage and votes reset!");
      }
    });
  }

  // Reset votes click
  if (resetPollBtn) {
    resetPollBtn.addEventListener("click", () => {
      if (!confirm("Are you sure you want to reset all vote counts to 0 for the active poll?")) return;

      if (dbMode === "firebase") {
        db.collection("polls").doc("active-poll").get()
          .then(doc => {
            if (doc.exists) {
              const poll = doc.data();
              poll.options.a.votes = 0;
              poll.options.b.votes = 0;
              poll.options.c.votes = 0;
              poll.options.d.votes = 0;
              return db.collection("polls").doc("active-poll").set(poll);
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
        const poll = JSON.parse(localStorage.getItem("rc_poll")) || DEFAULT_POLL;
        poll.options.a.votes = 0;
        poll.options.b.votes = 0;
        poll.options.c.votes = 0;
        poll.options.d.votes = 0;
        localStorage.setItem("rc_poll", JSON.stringify(poll));
        localStorage.removeItem("rc_user_voted");
        renderPollFormAndStats();
        alert("Votes reset in LocalStorage database!");
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

// 11. DOM INITIALIZATION RUNNER
document.addEventListener("DOMContentLoaded", () => {
  initDatabaseMode();
  setupAuth();
  setupTabs();
  setupFormSubmissions();
});
