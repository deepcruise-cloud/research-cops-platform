// Research COPS: shared data layer for the redesigned pages.
// It uses the same Firebase project, Firestore collections and lead schema as
// app.js and admin.js, so leads, settings and blogs keep flowing through the admin.
// Firebase is initialised lazily (on DOMContentLoaded, or on first use) so that on
// insights.html / policy.html the original scripts initialise it first and we reuse that app.
(function () {
  const rcFirebaseConfig = {
    apiKey: "AIzaSyDknEqerA09CE3PT0L0m-nISkBCBPitWEw",
    authDomain: "research-cops-platform-e6520.firebaseapp.com",
    projectId: "research-cops-platform-e6520",
    storageBucket: "research-cops-platform-e6520.firebasestorage.app",
    messagingSenderId: "992558119740",
    appId: "1:992558119740:web:c484f96c5b774e9d17fc39",
    measurementId: "G-11SKJM62QW"
  };

  let db, tried = false;
  function getDb() {
    if (tried) return db;
    tried = true;
    if (typeof firebase === "undefined") return (db = null);
    try {
      if (!firebase.apps.length) firebase.initializeApp(rcFirebaseConfig);
      db = firebase.firestore();
    } catch (e) {
      console.error("RC: Firebase failed, falling back to LocalStorage:", e);
      db = null;
    }
    return db;
  }

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Same shape as app.js leads: { id, timestamp, date, name, email, company, phone, cpi, budget, message, source }
  function saveLead(fields) {
    const lead = Object.assign({
      id: "lead_" + Date.now(),
      timestamp: Date.now(),
      date: new Date().toLocaleString(),
      name: "", email: "", company: "", phone: "",
      cpi: "N/A", budget: "N/A", message: "", source: "Website Form"
    }, fields);
    const d = getDb();
    if (d) return d.collection("leads").doc(lead.id).set(lead).then(() => lead);
    try {
      const leads = JSON.parse(localStorage.getItem("rc_leads") || "[]");
      leads.unshift(lead);
      localStorage.setItem("rc_leads", JSON.stringify(leads));
    } catch (e) { /* storage unavailable */ }
    return Promise.resolve(lead);
  }

  let calendly = "https://calendly.com/deepak-monga-researchcops/30min";

  // Footer + Calendly settings edited in admin (settings/footer)
  function applySettings(data) {
    if (!data) return;
    const $ = id => document.getElementById(id);
    if (data.description && $("footer-desc")) $("footer-desc").textContent = data.description;
    if (data.phone && $("footer-phone")) { $("footer-phone").textContent = data.phone; $("footer-phone").href = "tel:" + data.phone.replace(/[^\d+]/g, ""); }
    if ((data.emailInfo || data.emailBidding) && $("footer-emails")) {
      $("footer-emails").innerHTML = [data.emailInfo, data.emailBidding].filter(Boolean).map(e => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join("<br>");
    }
    if (data.address && $("footer-address")) $("footer-address").innerHTML = esc(data.address).replace(/\n/g, "<br>");
    if (data.calendly) {
      calendly = data.calendly;
      document.querySelectorAll("[data-calendly]").forEach(a => (a.href = calendly));
    }
  }

  // Latest blogs from admin (collection "blogs"), rendered into [data-latest-blogs]
  function renderLatestBlogs(d) {
    const box = document.querySelector("[data-latest-blogs]");
    if (!box || !d) return;
    d.collection("blogs").orderBy("timestamp", "desc").limit(3).get().then(snap => {
      if (snap.empty) return;
      box.innerHTML = snap.docs.map((doc, i) => {
        const b = doc.data();
        const bg = b.image ? ` style="background:linear-gradient(180deg,rgba(6,20,19,.1),rgba(6,20,19,.55)),url('${esc(b.image)}') center/cover"` : "";
        return `<a class="icard${i === 0 ? " feature" : ""}" href="/insights.html?type=blog&id=${encodeURIComponent(doc.id)}">
          <div class="thumb"${bg}></div>
          <div class="body"><span class="meta">${esc(b.category || "Insights")}${b.date ? " · " + esc(b.date) : ""}</span><h3>${esc(b.title)}</h3><p>${esc(b.excerpt || "")}</p><span class="more">Read article →</span></div>
        </a>`;
      }).join("");
    }).catch(err => console.warn("RC: could not load blogs", err));
  }

  document.addEventListener("DOMContentLoaded", () => {
    const d = getDb();
    const p = d
      ? d.collection("settings").doc("footer").get().then(doc => (doc.exists ? doc.data() : null)).catch(() => null)
      : Promise.resolve((() => { try { return JSON.parse(localStorage.getItem("rc_footer_settings")); } catch (e) { return null; } })());
    p.then(applySettings);
    renderLatestBlogs(d);
  });

  window.RC = { saveLead, esc, get calendly() { return calendly; } };
})();
