// Research COPS: Support Genie chat widget (rule-based, no AI backend).
// Mirrors the flows of the original app.js Genie. Leads are saved through RC.saveLead
// with source "Support Genie Chatbot", the same value admin already shows.
(function () {
  const esc = s => (window.RC ? RC.esc(s) : String(s));
  const css = `
.genie-fab{position:fixed;right:22px;bottom:22px;z-index:60;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;background:#061413 url('/support_genie_avatar.png') center/cover;box-shadow:0 12px 30px -8px rgba(0,0,0,.45),0 0 0 3px #04cbc2}
.genie-fab:focus-visible{outline:3px solid #04cbc2;outline-offset:3px}
.genie-hint{position:fixed;right:92px;bottom:34px;z-index:60;background:#fff;color:#0d1b1a;font:500 13.5px Inter,system-ui,sans-serif;padding:9px 14px;border-radius:12px;box-shadow:0 10px 30px -10px rgba(0,0,0,.35);max-width:220px}
.genie-hint button{background:none;border:0;margin-left:8px;cursor:pointer;color:#6b7f7c;font-size:15px}
.genie{position:fixed;right:22px;bottom:96px;z-index:61;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 130px));display:none;flex-direction:column;background:#0b201f;border:1px solid #1c3836;border-radius:18px;overflow:hidden;box-shadow:0 30px 70px -20px rgba(0,0,0,.6);font:14.5px/1.5 Inter,system-ui,sans-serif;color:#e6f2f1}
.genie.open{display:flex}
.genie-head{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #1c3836;background:#061413}
.genie-head img{width:36px;height:36px;border-radius:50%;object-fit:cover}
.genie-head b{display:block;font:600 15px 'Space Grotesk',Inter,sans-serif}
.genie-head small{color:#04cbc2;font-size:12px}
.genie-head button{margin-left:auto;background:none;border:0;color:#a3c2c0;font-size:22px;cursor:pointer;line-height:1}
.genie-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}
.gm{max-width:86%;padding:10px 13px;border-radius:14px;white-space:pre-line}
.gm.bot{background:#12302e;border-top-left-radius:4px}
.gm.me{background:#04cbc2;color:#04211f;align-self:flex-end;border-top-right-radius:4px}
.gm a{color:#04cbc2;font-weight:600}
.gm.me a{color:#04211f}
.genie-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 12px}
.genie-chips button{background:transparent;border:1px solid #2a4c49;color:#e6f2f1;border-radius:999px;padding:7px 12px;font:500 13px Inter,sans-serif;cursor:pointer}
.genie-chips button:hover{border-color:#04cbc2;color:#04cbc2}
.genie-form{display:flex;gap:8px;padding:12px;border-top:1px solid #1c3836}
.genie-form input{flex:1;background:#061413;border:1px solid #1c3836;border-radius:10px;padding:10px 12px;color:#e6f2f1;font:14px Inter,sans-serif}
.genie-form input:focus{outline:2px solid rgba(4,203,194,.5)}
.genie-form button{background:#04cbc2;color:#04211f;border:0;border-radius:10px;padding:0 14px;font-weight:600;cursor:pointer}
body.cookie-banner-active .genie-hint{display:none}
@media (max-width:768px){body.cookie-banner-active .genie-fab{bottom:240px}}
@media (max-width:520px){.genie-hint{display:none}.genie{right:16px;bottom:88px}.genie-fab{right:16px;bottom:16px}}`;
  const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  const fab = Object.assign(document.createElement("button"), { className: "genie-fab", type: "button" });
  fab.setAttribute("aria-label", "Chat with Support Genie");
  const hint = document.createElement("div"); hint.className = "genie-hint";
  hint.innerHTML = 'Need a CPI or feasibility check? Ask Genie.<button aria-label="Dismiss">×</button>';
  const box = document.createElement("div"); box.className = "genie"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Support Genie chat");
  box.innerHTML = `<div class="genie-head"><img src="/support_genie_avatar.png" alt=""><div><b>Support Genie</b><small>● Online · replies instantly</small></div><button type="button" aria-label="Close chat">×</button></div>
    <div class="genie-log" aria-live="polite"></div><div class="genie-chips"></div>
    <form class="genie-form"><input placeholder="Type a message…" aria-label="Message"><button type="submit">Send</button></form>`;
  document.body.append(fab, hint, box);
  const log = box.querySelector(".genie-log"), chipsEl = box.querySelector(".genie-chips"), form = box.querySelector("form"), input = form.querySelector("input");

  let hinted = false; try { hinted = sessionStorage.getItem("rc_genie_hint") === "1"; } catch (e) {}
  if (hinted) hint.remove();
  const hideHint = () => { hint.remove(); try { sessionStorage.setItem("rc_genie_hint", "1"); } catch (e) {} };
  hint.querySelector("button").onclick = hideHint;

  const say = (html, who = "bot") => { const m = document.createElement("div"); m.className = "gm " + who; m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; };
  const chips = list => { chipsEl.innerHTML = ""; list.forEach(([label, fn]) => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.onclick = () => { say(esc(label), "me"); setTimeout(fn, 250); }; chipsEl.appendChild(b); }); };

  // ---- conversation state ----
  const st = { step: null, est: {}, lead: {}, topic: "" };
  const calendly = () => `<a href="${(window.RC && RC.calendly) || "https://calendly.com/researchcops/30min"}" target="_blank" rel="noopener">Book a 30-min call</a>`;
  const BASE = { consumer: 3.2, b2b: 9.5, hcp: 24, patients: 12 };

  function menu() {
    st.step = null;
    say("How can I help? Pick a topic or just type your question.");
    chips([["CPI & feasibility estimate", startEstimate], ["Panel & sampling questions", panelInfo], ["The Research Centric OPS platform", platformInfo], ["Request a custom quote", () => startLead("Custom quote request")], ["Workflow automation add-on", automationInfo], ["Talk to a person", human]]);
  }
  function startEstimate() {
    st.topic = "CPI estimate"; st.est = {};
    say("Let's size it. Which audience?");
    chips([["Consumers", () => est("consumer")], ["B2B professionals", () => est("b2b")], ["Healthcare professionals", () => est("hcp")], ["Patients", () => est("patients")]]);
  }
  function est(panel) { st.est.panel = panel; st.step = "est-n"; chips([]); say("How many completes do you need? (e.g. 300)"); }
  function finishEstimate() {
    const { panel, n, loi } = st.est;
    const loiF = 1 + Math.max(0, loi - 10) * 0.045;
    const cpi = Math.max(BASE[panel] * 1.15 * loiF * (n >= 1000 ? 0.92 : 1), panel === "consumer" ? 1.5 : 7);
    st.est.cpi = "$" + cpi.toFixed(2); st.est.total = "$" + Math.round(cpi * n).toLocaleString("en-US");
    say(`Indicative estimate (US, 25–50% incidence):\n<b>CPI ≈ ${st.est.cpi}</b> · Total ≈ <b>${st.est.total}</b>\n\nYour final price depends on market, incidence and quotas. For the full breakdown, use the <a href="/#estimator">CPI estimator</a>.`);
    const label = { consumer: "Consumers", b2b: "B2B professionals", hcp: "Healthcare professionals", patients: "Patients" }[panel];
    st.topic = `CPI estimate: ${label}, N=${n}, LOI ${loi} min`;
    chips([["Get a firm quote", () => startLead(st.topic)], ["Start over", startEstimate], ["Main menu", menu]]);
  }
  function panelInfo() {
    say("We field through Opinion Genie, our own panel, plus API-integrated partner panels. Feasibility covers 44 market profiles and 70 audience types in 8 categories, including B2B, Healthcare Professionals and Patients.\n\nEvery survey link runs fraud and quality checks: geo-IP, proxy/VPN blocking, fingerprinting, our own human-verification check and a 0–100 quality score per response.");
    chips([["Feasibility for my audience", startEstimate], ["Download panel book", () => startLead("Panel book request")], ["Main menu", menu]]);
  }
  function platformInfo() {
    say('Research Centric OPS runs every step of a study on one platform: Feasibility & Costing, Survey Builder, Translation, Sample Collection, data quality checks, and Data Processing & Reporting, with 33 question types and 24 methodologies.\n\n<a href="/platform/">Explore the platform</a> · <a href="/pricing/">See plans</a> · <a href="https://diy.researchcops.com" target="_blank" rel="noopener">Sign in</a>');
    chips([["Book a live demo", () => startLead("Platform demo request")], ["Main menu", menu]]);
  }
  function automationInfo() {
    say('Our enterprise add-on connects research pipelines with your CRM, HRMS, ERP and finance systems: automated invoicing, document workflows and operations dashboards.\n\n<a href="/solutions/workflow-automation/">Learn more</a> · <a href="/workflow-hub.html">Open the interactive demo</a>');
    chips([["Book a workflow audit", () => startLead("Workflow automation enquiry")], ["Main menu", menu]]);
  }
  function human() {
    say(`Our team works around the clock.\n📧 <a href="mailto:info-team@researchcops.com">info-team@researchcops.com</a>\n📨 Bids: <a href="mailto:Bidding-team@researchcops.com">Bidding-team@researchcops.com</a>\n📞 <a href="tel:+9101206051391">+91 0120 605 1391</a>\n📅 ${calendly()}`);
    chips([["Leave my details", () => startLead("Callback request")], ["Main menu", menu]]);
  }
  function startLead(topic) { st.topic = topic; st.lead = {}; st.step = "lead-name"; chips([]); say("Great. What's your name?"); }
  function saveLead() {
    const msg = `${st.topic}${st.lead.note ? "\n\n" + st.lead.note : ""}`;
    const done = () => { say(`Thanks, ${esc(st.lead.name)}! A research lead will email you within one business day.\n\nIf you'd like to talk sooner: ${calendly()}`); chips([["Main menu", menu]]); st.step = null; };
    if (!window.RC) return done();
    RC.saveLead({ name: st.lead.name, email: st.lead.email, company: st.lead.company || "Chatbot User", phone: st.lead.phone || "", cpi: st.est.cpi || "N/A", budget: st.est.total || "N/A", message: msg, source: "Support Genie Chatbot" })
      .then(done).catch(err => { console.error(err); say("Sorry, I couldn't save that. Please email info-team@researchcops.com."); });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const v = input.value.trim(); if (!v) return;
    say(esc(v), "me"); input.value = "";
    setTimeout(() => handle(v), 250);
  });

  function handle(v) {
    switch (st.step) {
      case "est-n": { const n = parseInt(v.replace(/\D/g, ""), 10); if (!n || n < 10) return say("Please enter a number of completes, e.g. 300."); st.est.n = n; st.step = "est-loi"; return say("And the survey length in minutes? (e.g. 15)"); }
      case "est-loi": { const l = parseInt(v.replace(/\D/g, ""), 10); if (!l || l > 90) return say("Please enter the length in minutes, e.g. 15."); st.est.loi = l; st.step = null; return finishEstimate(); }
      case "lead-name": st.lead.name = v.slice(0, 120); st.step = "lead-email"; return say("Thanks. What's your work email?");
      case "lead-email": if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return say("That email doesn't look right. Could you check it?"); st.lead.email = v; st.step = "lead-company"; return say("Which company are you with?");
      case "lead-company": st.lead.company = v.slice(0, 160); st.step = "lead-phone"; chips([["Skip", () => { st.step = "lead-note"; say("Anything else we should know? (audience, markets, timing) Or type 'no'."); }]]); return say("Phone number? (optional)");
      case "lead-phone": st.lead.phone = v.slice(0, 30); st.step = "lead-note"; chips([]); return say("Anything else we should know? (audience, markets, timing) Or type 'no'.");
      case "lead-note": st.lead.note = /^no$/i.test(v) ? "" : v.slice(0, 2000); chips([]); return saveLead();
    }
    const q = v.toLowerCase();
    if (/cpi|price|cost|quote|feasib|budget/.test(q)) return startEstimate();
    if (/panel|sample|respondent|country|countries|b2b|hcp|doctor/.test(q)) return panelInfo();
    if (/platform|software|saas|module|plan|demo|login/.test(q)) return platformInfo();
    if (/hrms|erp|payroll|automat|crm|workflow/.test(q)) return automationInfo();
    if (/human|person|call|phone|email|contact|talk/.test(q)) return human();
    say("I'm not sure about that one, but our team can help.");
    chips([["Talk to a person", human], ["Main menu", menu]]);
  }

  let started = false;
  const toggle = open => {
    box.classList.toggle("open", open); hideHint();
    if (open && !started) { started = true; say("Hi! I'm Genie, the Research COPS assistant. I can estimate CPI, answer panel questions or set up a quote."); menu(); }
    if (open) input.focus();
  };
  fab.onclick = () => toggle(!box.classList.contains("open"));
  box.querySelector(".genie-head button").onclick = () => toggle(false);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && box.classList.contains("open")) toggle(false); });
})();
