// Research Centric Ops - Solutions Detail Page Controller
// Renders dynamic technical summaries and custom interactive SVG simulations for all 9 solutions.

const SOLUTION_DATA = {
  management: {
    badge: "Deepsight Insights (DI) Research Core Engine",
    title: "Deepsight Insights (DI) Research Core Engine",
    desc: "Our project management suite provides end-to-end campaign tracking, automated scoping, live field operations checklists, and data delivery timelines in a unified collaborative dashboard.",
    capabilities: [
      { title: "Full Campaign Scoping", text: "Automated feasibility checks that cross-reference target specifications with panel quotas instantly." },
      { title: "Live Field Management", text: "Real-time fielding monitoring tracking daily completes, response ratios, and drop-out locations." },
      { title: "Automated Quality Gates", text: "Cleanses data at ingestion, running speeder checks, attention filters, and VPN proxy blocks." },
      { title: "Structured Data Delivery", text: "Instant data compilation and export into SPSS (.sav), CSV, and Excel tables format." }
    ],
    architecture: "Deploys HTML5 tracker widgets and connects to core operations databases via secure WebSocket APIs to synchronize fielding schedules.",
    caption: "DI Research Core Engine Workspace Dashboard",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; background: #050a0a; font-family: 'Inter', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 8px; border: 1px solid rgba(4,203,194,0.15); position: relative; color: #cbd5e1; user-select: none;">
            <!-- Top ribbon -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 28px; background: rgba(10,20,20,0.95); border-bottom: 1px solid rgba(4,203,194,0.15); display: flex; align-items: center; justify-content: space-between; padding: 0 10px; box-sizing: border-box; z-index: 10;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="display: flex; gap: 4px;">
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #ef4444;"></span>
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #f59e0b;"></span>
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981;"></span>
                </span>
                <span style="font-family: 'Space Grotesk', sans-serif; font-size: 8px; color: #94a3b8; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">DI CORE ENGINE / WORKSPACE</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 8px; color: #04cbc2; font-weight: 600; font-family: monospace;">
                <span style="width: 5px; height: 5px; border-radius: 50%; background: #10b981; box-shadow: 0 0 5px #10b981; animation: core-pulse 2s infinite;"></span>
                <span id="core-live-time">00:00:00 AM</span>
              </div>
            </div>

            <!-- Left Sidebar Menu -->
            <div style="width: 130px; background: rgba(3,6,6,0.92); border-right: 1px solid rgba(4,203,194,0.15); display: flex; flex-direction: column; padding: 36px 6px 10px 6px; box-sizing: border-box; flex-shrink: 0; justify-content: space-between; position: relative;">
              <div>
                <span style="font-size: 7px; color: #64748b; font-weight: bold; text-transform: uppercase; display: block; padding: 0 4px 4px 4px; border-bottom: 1px solid rgba(255,255,255,0.03); margin-bottom: 6px; font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.5px;">Workspace Nav</span>
                <div style="display: flex; flex-direction: column; gap: 4px;" id="di-menu-list">
                  <button class="di-menu-btn" data-step="0" style="background: rgba(4,203,194,0.1); border: 1px solid rgba(4,203,194,0.3); color: #ffffff; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 4px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%; display: flex; align-items: center; gap: 4px;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                    Target Audience
                  </button>
                  <button class="di-menu-btn" data-step="1" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 4px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%; display: flex; align-items: center; gap: 4px;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    Check Feasibility
                  </button>
                  <button class="di-menu-btn" data-step="2" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 4px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%; display: flex; align-items: center; gap: 4px;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    AI Survey Designer
                  </button>
                  <button class="di-menu-btn" data-step="3" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 4px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%; display: flex; align-items: center; gap: 4px;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    Localization Sync
                  </button>
                  <button class="di-menu-btn" data-step="4" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 4px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%; display: flex; align-items: center; gap: 4px;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    Link Distribution
                  </button>
                  <button class="di-menu-btn" data-step="5" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 4px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%; display: flex; align-items: center; gap: 4px;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Supplier Bridge
                  </button>
                  <button class="di-menu-btn" data-step="6" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 4px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%; display: flex; align-items: center; gap: 4px;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    Live fielding
                  </button>
                  <button class="di-menu-btn" data-step="7" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 4px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%; display: flex; align-items: center; gap: 4px;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    Analytics & Reports
                  </button>
                </div>
              </div>
              <!-- Status bar -->
              <div style="font-family: monospace; font-size: 7px; color: #64748b; padding: 0 4px; display: flex; justify-content: space-between; align-items: center;" id="di-engine-status">
                <span>CONN: ONLINE</span>
              </div>
            </div>

            <!-- Content Viewport -->
            <div style="flex-grow: 1; display: flex; flex-direction: column; padding: 38px 12px 10px 12px; box-sizing: border-box; overflow: hidden; position: relative;" id="di-viewport">
              <!-- Content loaded via init() -->
            </div>
          </div>

          <style>
            @keyframes core-pulse {
              0% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
              50% { opacity: 1; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
              100% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
          </style>
        `,
        init: () => {
          const menuBtns = document.querySelectorAll('.di-menu-btn');
          const viewport = document.getElementById('di-viewport');
          const statusEl = document.getElementById('di-engine-status');
          const liveTimeEl = document.getElementById('core-live-time');
          if (!menuBtns.length || !viewport || !statusEl) return;

          // Start a live ticking clock inside core top ribbon
          const timer = setInterval(() => {
            if (liveTimeEl) {
              const now = new Date();
              liveTimeEl.textContent = now.toTimeString().split(' ')[0] + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
            }
          }, 1000);

          const screens = [
            {
              title: "1. Target Audience Identification",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <div>
                    <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif;">Profile Cohorts Segment</div>
                    <div style="font-size: 10px; font-weight: bold; color: #ffffff; margin-bottom: 6px;">Select Cohort Criteria:</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;" id="scr1-checks">
                      <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                          <input type="checkbox" id="scr1-chk-1" checked style="accent-color: #04cbc2; cursor: pointer; width: 11px; height: 11px;">
                          <span>IT Decision Makers</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                          <input type="checkbox" id="scr1-chk-2" style="accent-color: #04cbc2; cursor: pointer; width: 11px; height: 11px;">
                          <span>Healthcare Specialists</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                          <input type="checkbox" id="scr1-chk-3" checked style="accent-color: #04cbc2; cursor: pointer; width: 11px; height: 11px;">
                          <span>DevOps & Cloud Buyers</span>
                        </label>
                      </div>
                      <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                          <input type="checkbox" id="scr1-chk-4" style="accent-color: #04cbc2; cursor: pointer; width: 11px; height: 11px;">
                          <span>Finance Executives</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 6px; font-size: 9px; color: #cbd5e1; cursor: pointer;">
                          <input type="checkbox" id="scr1-chk-5" checked style="accent-color: #04cbc2; cursor: pointer; width: 11px; height: 11px;">
                          <span>B2B Tech Consumers</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div style="background: rgba(4,203,194,0.03); border: 1px solid rgba(4,203,194,0.12); padding: 8px 10px; border-radius: 6px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                      <span style="font-size: 7.5px; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Panel Pool Size</span>
                      <strong style="color: #04cbc2; font-family: monospace; font-size: 11px;" id="scr1-pool">45,280</strong>
                    </div>
                    <div>
                      <span style="font-size: 7.5px; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Feasibility Score</span>
                      <strong style="color: #10b981; font-family: monospace; font-size: 11px;" id="scr1-feas">HIGH (85%)</strong>
                    </div>
                  </div>
                </div>
              `,
              init: () => {
                const chk1 = document.getElementById('scr1-chk-1');
                const chk2 = document.getElementById('scr1-chk-2');
                const chk3 = document.getElementById('scr1-chk-3');
                const chk4 = document.getElementById('scr1-chk-4');
                const chk5 = document.getElementById('scr1-chk-5');
                const pool = document.getElementById('scr1-pool');
                const feas = document.getElementById('scr1-feas');
                
                const update = () => {
                  let count = 0;
                  let selected = 0;
                  if (chk1 && chk1.checked) { count += 32000; selected++; }
                  if (chk2 && chk2.checked) { count += 8500; selected++; }
                  if (chk3 && chk3.checked) { count += 15400; selected++; }
                  if (chk4 && chk4.checked) { count += 6200; selected++; }
                  if (chk5 && chk5.checked) { count += 250000; selected++; }
                  
                  if (pool) pool.textContent = count.toLocaleString();
                  if (feas) {
                    if (selected === 0) {
                      feas.textContent = "SELECT CRITERIA";
                      feas.style.color = "#ef4444";
                    } else if (selected <= 2) {
                      feas.textContent = "VERY HIGH (95%)";
                      feas.style.color = "#10b981";
                    } else if (selected <= 4) {
                      feas.textContent = "HIGH (82%)";
                      feas.style.color = "#10b981";
                    } else {
                      feas.textContent = "MODERATE (64%)";
                      feas.style.color = "#f59e0b";
                    }
                  }
                };

                [chk1, chk2, chk3, chk4, chk5].forEach(chk => {
                  if (chk) chk.addEventListener('change', update);
                });
                update();
                return () => {};
              }
            },
            {
              title: "2. Check Feasibility Engine",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <div>
                    <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif;">Scoping Estimator</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      <div>
                        <div style="display: flex; justify-content: space-between; font-size: 9px; color: #cbd5e1; margin-bottom: 2px;">
                          <span>Sample Size (N)</span>
                          <strong style="color: #04cbc2; font-family: monospace;" id="scr2-n-val">250</strong>
                        </div>
                        <input type="range" id="scr2-n-slider" min="50" max="2000" step="50" value="250" style="width: 100%; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; outline: none; accent-color: #04cbc2; cursor: pointer;">
                      </div>
                      <div>
                        <div style="display: flex; justify-content: space-between; font-size: 9px; color: #cbd5e1; margin-bottom: 2px;">
                          <span>Length of Interview (LOI)</span>
                          <strong style="color: #04cbc2; font-family: monospace;" id="scr2-loi-val">15 min</strong>
                        </div>
                        <input type="range" id="scr2-loi-slider" min="5" max="45" step="1" value="15" style="width: 100%; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; outline: none; accent-color: #04cbc2; cursor: pointer;">
                      </div>
                    </div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; box-sizing: border-box; background: rgba(0,0,0,0.25); border: 1px solid rgba(4,203,194,0.12); padding: 8px; border-radius: 6px; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <svg width="30" height="30" viewBox="0 0 36 36" style="transform: rotate(-90deg); flex-shrink: 0;">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4px" />
                        <circle id="scr2-gauge" cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" stroke-width="4px" stroke-dasharray="100, 100" stroke-dashoffset="15" style="transition: stroke-dashoffset 0.3s;" />
                      </svg>
                      <div>
                        <div style="font-size: 13px; font-weight: bold; color: #ffffff; font-family: monospace;" id="scr2-feas-val">85%</div>
                        <div style="font-size: 7px; color: #94a3b8; text-transform: uppercase;">Feasible</div>
                      </div>
                    </div>
                    <div style="display: flex; flex-direction: column; justify-content: center; border-left: 1px solid rgba(255,255,255,0.05); padding-left: 10px;">
                      <span style="font-size: 7.5px; color: #94a3b8; text-transform: uppercase;">Estimated CPI</span>
                      <strong style="font-size: 13px; color: #04cbc2; font-family: monospace; margin-top: 1px;" id="scr2-cpi-val">$7.50</strong>
                    </div>
                  </div>
                </div>
              `,
              init: () => {
                const nSlider = document.getElementById('scr2-n-slider');
                const loiSlider = document.getElementById('scr2-loi-slider');
                const nVal = document.getElementById('scr2-n-val');
                const loiVal = document.getElementById('scr2-loi-val');
                const gauge = document.getElementById('scr2-gauge');
                const feasVal = document.getElementById('scr2-feas-val');
                const cpiVal = document.getElementById('scr2-cpi-val');
                
                const update = () => {
                  if (!nSlider || !loiSlider) return;
                  const n = parseInt(nSlider.value, 10);
                  const loi = parseInt(loiSlider.value, 10);
                  
                  if (nVal) nVal.textContent = n;
                  if (loiVal) loiVal.textContent = loi + ' min';
                  
                  const cpi = 4.00 + (loi * 0.20) + (n * 0.001);
                  if (cpiVal) cpiVal.textContent = '$' + cpi.toFixed(2);
                  
                  let feas = Math.round(100 - (n * 0.02) - (loi * 0.8));
                  if (feas > 98) feas = 98;
                  if (feas < 15) feas = 15;
                  
                  if (feasVal) feasVal.textContent = feas + '%';
                  if (gauge) {
                    gauge.setAttribute('stroke-dashoffset', 100 - feas);
                    if (feas < 45) {
                      gauge.setAttribute('stroke', '#ef4444');
                    } else if (feas < 75) {
                      gauge.setAttribute('stroke', '#f59e0b');
                    } else {
                      gauge.setAttribute('stroke', '#10b981');
                    }
                  }
                };

                [nSlider, loiSlider].forEach(slider => {
                  if (slider) slider.addEventListener('input', update);
                });
                update();
                return () => {};
              }
            },
            {
              title: "3. AI Survey Designer",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <div>
                    <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif;">AI Prompt Editor</div>
                    <div style="display: flex; gap: 4px; margin-bottom: 6px;">
                      <textarea id="scr3-prompt" style="flex-grow: 1; height: 32px; background: rgba(0,0,0,0.45); border: 1px solid rgba(4,203,194,0.25); color: #ffffff; font-family: inherit; font-size: 8.5px; padding: 4px; border-radius: 4px; outline: none; resize: none; line-height: 1.25;">Generate cloud tech usage and purchase frequency survey question...</textarea>
                      <button id="scr3-btn" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; font-size: 9px; font-weight: bold; padding: 0 8px; border-radius: 4px; cursor: pointer; outline: none; white-space: nowrap;">Design</button>
                    </div>
                  </div>
                  <!-- Dynamic preview card -->
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; box-sizing: border-box; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 90px;" id="scr3-panel">
                    <div>
                      <div style="font-size: 7.5px; color: #04cbc2; font-family: monospace; margin-bottom: 2px;" id="scr3-q-type">SINGLE CHOICE</div>
                      <div style="font-size: 10px; font-weight: bold; color: #ffffff; line-height: 1.25; margin-bottom: 6px;" id="scr3-q-text">Which primary cloud provider does your firm use?</div>
                      <div style="display: flex; flex-direction: column; gap: 4px;" id="scr3-choices">
                        <!-- populated by init -->
                      </div>
                    </div>
                  </div>
                </div>
              `,
              init: () => {
                const promptArea = document.getElementById('scr3-prompt');
                const btn = document.getElementById('scr3-btn');
                const qType = document.getElementById('scr3-q-type');
                const qText = document.getElementById('scr3-q-text');
                const choices = document.getElementById('scr3-choices');
                const panel = document.getElementById('scr3-panel');
                if (!promptArea || !btn || !qText || !choices || !panel) return;

                const prompts = [
                  {
                    prompt: "Generate cloud tech usage and purchase frequency survey question...",
                    type: "SINGLE CHOICE",
                    q: "Which primary cloud provider does your firm use?",
                    opts: ["Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)"]
                  },
                  {
                    prompt: "Generate healthcare diagnostic devices usage checklist...",
                    type: "MULTIPLE CHOICE",
                    q: "Which diagnostic instruments do you utilize weekly?",
                    opts: ["MRI Scanner", "CT Spectrometer", "Ultrasound Sonograph"]
                  },
                  {
                    prompt: "Generate net promoter score feedback survey...",
                    type: "NPS MATRIX (10-POINT SCALE)",
                    q: "How likely are you to recommend our products?",
                    opts: ["Extremely Likely", "Neutral / Unsure", "Not Likely"]
                  }
                ];

                let promptIdx = 0;

                const updateView = (item) => {
                  qType.textContent = item.type;
                  qText.textContent = item.q;
                  choices.innerHTML = '';
                  
                  const inputType = item.type.includes("MULTIPLE") ? "checkbox" : "radio";
                  item.opts.forEach((opt, index) => {
                    const lbl = document.createElement('label');
                    lbl.style.display = 'flex';
                    lbl.style.alignItems = 'center';
                    lbl.style.gap = '5px';
                    lbl.style.fontSize = '8.5px';
                    lbl.style.color = '#cbd5e1';
                    lbl.style.background = 'rgba(255,255,255,0.01)';
                    lbl.style.border = '1px solid rgba(255,255,255,0.04)';
                    lbl.style.padding = '4px 6px';
                    lbl.style.borderRadius = '3px';
                    lbl.style.cursor = 'pointer';
                    
                    const checkedAttribute = index === 0 ? 'checked' : '';
                    lbl.innerHTML = `<input type="${inputType}" name="scr3-r" ${checkedAttribute} style="accent-color: #04cbc2; cursor: pointer;"><span>${opt}</span>`;
                    choices.appendChild(lbl);
                  });
                };

                btn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  promptIdx = (promptIdx + 1) % prompts.length;
                  const item = prompts[promptIdx];
                  
                  btn.textContent = "Writing...";
                  btn.disabled = true;
                  panel.style.opacity = '0.2';
                  panel.style.transform = 'translateY(4px)';
                  panel.style.transition = 'all 0.2s';
                  
                  // Simulate typing
                  promptArea.value = "";
                  let cIdx = 0;
                  const chars = item.prompt;
                  const type = () => {
                    if (cIdx <= chars.length) {
                      promptArea.value = chars.substring(0, cIdx);
                      cIdx += 2;
                      setTimeout(type, 10);
                    } else {
                      btn.textContent = "Design";
                      btn.disabled = false;
                      updateView(item);
                      panel.style.opacity = '1';
                      panel.style.transform = 'translateY(0)';
                    }
                  };
                  type();
                });

                updateView(prompts[0]);
                return () => {};
              }
            },
            {
              title: "4. Localization Sync",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <!-- Language Tabs -->
                  <div style="display: flex; gap: 4px; background: rgba(0,0,0,0.3); padding: 4px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; box-sizing: border-box;">
                    <button class="scr4-tab" data-lang="DE" style="flex-grow: 1; background: rgba(4,203,194,0.1); border: 1px solid rgba(4,203,194,0.3); color: #ffffff; font-family: inherit; font-size: 8px; font-weight: bold; padding: 3px 0; border-radius: 3px; cursor: pointer; outline: none;">DE (German)</button>
                    <button class="scr4-tab" data-lang="ES" style="flex-grow: 1; background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8px; padding: 3px 0; border-radius: 3px; cursor: pointer; outline: none;">ES (Spanish)</button>
                    <button class="scr4-tab" data-lang="JA" style="flex-grow: 1; background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8px; padding: 3px 0; border-radius: 3px; cursor: pointer; outline: none;">JA (Japanese)</button>
                  </div>
                  <!-- Translation Cards Split -->
                  <div style="display: flex; flex-direction: column; gap: 4px; flex-grow: 1; margin: 6px 0; overflow: hidden; justify-content: center; box-sizing: border-box;">
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 5px 8px; border-radius: 4px; box-sizing: border-box;">
                      <div style="font-size: 7px; color: #64748b; font-family: monospace; text-transform: uppercase;">Source String</div>
                      <div style="font-size: 9.5px; color: #ffffff; line-height: 1.25; margin-top: 1px;">"Which primary cloud provider does your firm use?"</div>
                    </div>
                    <div style="background: rgba(4,203,194,0.02); border: 1px solid rgba(4,203,194,0.12); padding: 5px 8px; border-radius: 4px; box-sizing: border-box;" id="scr4-box">
                      <div style="font-size: 7px; color: #04cbc2; font-family: monospace; text-transform: uppercase;" id="scr4-lbl">DE Translation</div>
                      <textarea id="scr4-text" style="width: 100%; background: transparent; border: none; outline: none; color: #ffffff; font-family: inherit; font-size: 9.5px; line-height: 1.25; resize: none; height: 32px; padding: 0; margin-top: 1px;">"Welchen primären Cloud-Anbieter nutzt Ihr Unternehmen?"</textarea>
                    </div>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px; box-sizing: border-box; flex-shrink: 0;">
                    <span style="font-size: 8px; color: #10b981; font-family: monospace; display: flex; align-items: center; gap: 3px;" id="scr4-sync">
                      <span style="width: 4px; height: 4px; border-radius: 50%; background: #10b981; box-shadow: 0 0 4px #10b981;"></span>
                      100% Logic Match verified
                    </span>
                    <button id="scr4-save" style="background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #ffffff; font-size: 7.5px; font-weight: bold; padding: 2px 6px; border-radius: 2px; cursor: pointer; outline: none;">Save Sync</button>
                  </div>
                </div>
              `,
              init: () => {
                const tabs = document.querySelectorAll('.scr4-tab');
                const lbl = document.getElementById('scr4-lbl');
                const text = document.getElementById('scr4-text');
                const sync = document.getElementById('scr4-sync');
                const save = document.getElementById('scr4-save');
                const box = document.getElementById('scr4-box');
                if (!tabs.length || !lbl || !text || !sync || !save) return;

                const trans = {
                  DE: {
                    lbl: "DE Translation (German)",
                    text: '"Welchen primären Cloud-Anbieter nutzt Ihr Unternehmen?"',
                    match: "100% Logic Match verified"
                  },
                  ES: {
                    lbl: "ES Translation (Spanish)",
                    text: '"¿Qué proveedor de nube principal utiliza su empresa?"',
                    match: "98.7% Logic Match verified"
                  },
                  JA: {
                    lbl: "JA Translation (Japanese)",
                    text: '"貴社はどのプライマリクラウドプロバイダーを使用していますか？"',
                    match: "100% Logic Match verified"
                  }
                };

                tabs.forEach(tab => {
                  tab.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const lang = tab.getAttribute('data-lang');
                    tabs.forEach(t => {
                      if (t === tab) {
                        t.style.background = 'rgba(4,203,194,0.1)';
                        t.style.borderColor = 'rgba(4,203,194,0.3)';
                        t.style.color = '#ffffff';
                      } else {
                        t.style.background = 'transparent';
                        t.style.borderColor = 'transparent';
                        t.style.color = '#94a3b8';
                      }
                    });

                    box.style.opacity = '0.3';
                    setTimeout(() => {
                      lbl.textContent = trans[lang].lbl;
                      text.value = trans[lang].text;
                      sync.innerHTML = `<span style="width: 4px; height: 4px; border-radius: 50%; background: #10b981; box-shadow: 0 0 4px #10b981;"></span> ${trans[lang].match}`;
                      sync.style.color = '#10b981';
                      box.style.opacity = '1';
                    }, 150);
                  });
                });

                text.addEventListener('input', () => {
                  sync.innerHTML = `<span style="width: 4px; height: 4px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 4px #f59e0b;"></span> Unsaved edits in progress...`;
                  sync.style.color = '#f59e0b';
                });

                save.addEventListener('click', (e) => {
                  e.stopPropagation();
                  save.textContent = "Syncing...";
                  save.style.background = "rgba(4,203,194,0.15)";
                  save.style.borderColor = "#04cbc2";
                  setTimeout(() => {
                    save.textContent = "Save Sync";
                    save.style.background = "rgba(16,185,129,0.15)";
                    save.style.borderColor = "#10b981";
                    sync.innerHTML = `<span style="width: 4px; height: 4px; border-radius: 50%; background: #10b981; box-shadow: 0 0 4px #10b981;"></span> Verified & Synced to CDN`;
                    sync.style.color = '#10b981';
                  }, 800);
                });

                return () => {};
              }
            },
            {
              title: "5. Link Distribution",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <div>
                    <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif;">Link Router Gateway</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 6px;">
                      <select id="scr5-channel" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(4,203,194,0.25); color: #ffffff; font-family: inherit; font-size: 8.5px; padding: 4px; border-radius: 3px; outline: none; cursor: pointer;">
                        <option value="genie">OpinionGenie Panel</option>
                        <option value="supp">External Suppliers</option>
                        <option value="client">Client-Owned Panel</option>
                      </select>
                      <button id="scr5-deploy" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; font-size: 8.5px; font-weight: bold; padding: 4px 0; border-radius: 3px; cursor: pointer; outline: none;">Generate Link</button>
                    </div>
                  </div>
                  <!-- Created links list -->
                  <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 6px; border-radius: 4px; flex-grow: 1; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: 80px; box-sizing: border-box;" id="scr5-list">
                    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 4px 6px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.03);" class="scr5-row">
                      <span style="font-family: monospace; font-size: 7.5px; color: #cbd5e1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 130px;">r.opg.com/ad89f81a</span>
                      <button class="scr5-copy" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 7.5px; padding: 2px 4px; border-radius: 2px; cursor: pointer; outline: none;">Copy</button>
                    </div>
                  </div>
                </div>
              `,
              init: () => {
                const deploy = document.getElementById('scr5-deploy');
                const channel = document.getElementById('scr5-channel');
                const list = document.getElementById('scr5-list');
                if (!deploy || !channel || !list) return;

                const makeCopyHandler = (btn, url) => {
                  btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    btn.textContent = "Copied!";
                    btn.style.background = "#10b981";
                    btn.style.borderColor = "#10b981";
                    btn.style.color = "#ffffff";
                    
                    const cap = document.getElementById('visual-caption');
                    if (cap) {
                      const old = cap.textContent;
                      cap.textContent = "✓ Link copied: " + url;
                      setTimeout(() => { cap.textContent = old; }, 2000);
                    }

                    setTimeout(() => {
                      btn.textContent = "Copy";
                      btn.style.background = "rgba(255,255,255,0.03)";
                      btn.style.borderColor = "rgba(255,255,255,0.08)";
                      btn.style.color = "#94a3b8";
                    }, 1200);
                  });
                };

                const initialBtn = list.querySelector('.scr5-copy');
                if (initialBtn) makeCopyHandler(initialBtn, "r.opg.com/ad89f81a");

                deploy.addEventListener('click', (e) => {
                  e.stopPropagation();
                  const val = channel.value;
                  const prefix = val === 'genie' ? 'opg.com' : val === 'supp' ? 'ext.net' : 'client.org';
                  const hash = Math.random().toString(16).substring(2, 10);
                  const url = `r.${prefix}/${hash}`;

                  const row = document.createElement('div');
                  row.style.display = 'flex';
                  row.style.justifyContent = 'space-between';
                  row.style.alignItems = 'center';
                  row.style.background = 'rgba(0,0,0,0.2)';
                  row.style.padding = '4px 6px';
                  row.style.borderRadius = '3px';
                  row.style.border = '1px solid rgba(4,203,194,0.1)';
                  row.style.animation = 'fadeInPanel 0.3s ease-out';
                  row.className = 'scr5-row';

                  row.innerHTML = `<span style="font-family: monospace; font-size: 7.5px; color: #cbd5e1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 130px;">${url}</span><button class="scr5-copy" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 7.5px; padding: 2px 4px; border-radius: 2px; cursor: pointer; outline: none;">Copy</button>`;
                  
                  list.insertBefore(row, list.firstChild);
                  if (list.children.length > 3) {
                    list.removeChild(list.lastChild);
                  }

                  const newBtn = row.querySelector('.scr5-copy');
                  makeCopyHandler(newBtn, url);
                });

                return () => {};
              }
            },
            {
              title: "6. Supplier Bridge",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <div>
                    <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif;">Sample Allocation Mix</div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                      <div>
                        <div style="display: flex; justify-content: space-between; font-size: 9px; color: #cbd5e1; margin-bottom: 2px;">
                          <span>OpinionGenie Panel (Internal)</span>
                          <span style="color: #04cbc2; font-family: monospace; font-weight: bold;" id="scr6-opg-val">60%</span>
                        </div>
                        <input type="range" id="scr6-slider" min="0" max="100" step="5" value="60" style="width: 100%; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; outline: none; accent-color: #04cbc2; cursor: pointer;">
                      </div>
                      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 5px 8px; border-radius: 4px;">
                        <span style="font-size: 8px; color: #64748b;">External Suppliers Split:</span>
                        <strong style="font-size: 10px; color: #ffffff; font-family: monospace;" id="scr6-ext-val">40%</strong>
                      </div>
                    </div>
                  </div>
                  <div style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); padding: 6px; border-radius: 3px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <div style="width: 5px; height: 5px; border-radius: 50%; background: #10b981; box-shadow: 0 0 4px #10b981;"></div>
                      <span style="font-size: 8.5px; color: #10b981; font-weight: bold; font-family: monospace;">API Bridges Online</span>
                    </div>
                    <span style="font-size: 7.5px; color: #94a3b8;">Avg CPI: <span id="scr6-avg-cpi" style="color: #ffffff; font-weight: bold;">$6.20</span></span>
                  </div>
                </div>
              `,
              init: () => {
                const slider = document.getElementById('scr6-slider');
                const opgVal = document.getElementById('scr6-opg-val');
                const extVal = document.getElementById('scr6-ext-val');
                const avgCpi = document.getElementById('scr6-avg-cpi');
                if (!slider || !opgVal || !extVal || !avgCpi) return;

                const update = () => {
                  const val = parseInt(slider.value, 10);
                  opgVal.textContent = val + "%";
                  extVal.textContent = (100 - val) + "%";

                  const cpi = (val * 4.50 + (100 - val) * 8.50) / 100;
                  avgCpi.textContent = "$" + cpi.toFixed(2);
                };

                slider.addEventListener('input', update);
                update();
                return () => {};
              }
            },
            {
              title: "7. Live Fielding Logs",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                    <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase;">Fielding Dashboard</div>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 8px; color: #ef4444; font-weight: bold; cursor: pointer;">
                      <input type="checkbox" id="scr7-shield-toggle" checked style="accent-color: #ef4444; cursor: pointer; transform: scale(0.85);">
                      <span>VPN SHIELD ACTIVE</span>
                    </label>
                  </div>
                  <!-- Quota stats bar -->
                  <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); padding: 5px 8px; border-radius: 4px; margin: 4px 0; box-sizing: border-box; flex-shrink: 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8; font-family: monospace; margin-bottom: 2px;">
                      <span>Quota Completes</span>
                      <strong style="color: #ffffff;"><span id="scr7-comp-val">204</span> / 300</strong>
                    </div>
                    <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.04); border-radius: 3px; overflow: hidden; border: 1px solid rgba(4,203,194,0.1);">
                      <div id="scr7-progress" style="width: 68%; height: 100%; background: linear-gradient(90deg, var(--teal-brand, #04524e), #04cbc2); border-radius: 3px; transition: width 0.5s;"></div>
                    </div>
                  </div>
                  <!-- Telco ping log explorer -->
                  <div style="background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.04); padding: 6px; border-radius: 4px; flex-grow: 1; display: flex; flex-direction: column; gap: 3px; font-family: monospace; font-size: 8px; overflow-y: auto; max-height: 70px; box-sizing: border-box;" id="scr7-log">
                    <div style="color: #64748b;">> Telemetry bridge listening...</div>
                  </div>
                </div>
              `,
              init: () => {
                const log = document.getElementById('scr7-log');
                const shield = document.getElementById('scr7-shield-toggle');
                const compVal = document.getElementById('scr7-comp-val');
                const progress = document.getElementById('scr7-progress');
                if (!log || !shield || !compVal || !progress) return;

                let count = 204;

                const addLog = () => {
                  if (!log) return;
                  const row = document.createElement('div');
                  const now = new Date();
                  const time = now.toTimeString().split(' ')[0];
                  
                  const isSecure = shield.checked;
                  const randomUser = 'RESP_' + Math.floor(Math.random() * 89999 + 10000);
                  const regions = ['US', 'UK', 'DE', 'IN', 'JP', 'CA'];
                  const reg = regions[Math.floor(Math.random() * regions.length)];
                  
                  let txt = '';
                  let color = '#cbd5e1';

                  if (isSecure && Math.random() < 0.18) {
                    txt = `[${time}] > ${randomUser} (${reg}) blocked: VPN Proxy detected`;
                    color = '#ef4444';
                  } else {
                    count++;
                    if (compVal) compVal.textContent = count;
                    if (progress) {
                      const pct = Math.min((count / 300) * 100, 100);
                      progress.style.width = pct + "%";
                    }
                    txt = `[${time}] > ${randomUser} (${reg}) verified: Ingest complete.`;
                    color = '#10b981';
                  }

                  row.style.color = color;
                  row.textContent = txt;
                  log.appendChild(row);
                  log.scrollTop = log.scrollHeight;

                  if (log.children.length > 8) {
                    log.removeChild(log.firstChild);
                  }
                };

                const interval = setInterval(addLog, 3000);
                return () => clearInterval(interval);
              }
            },
            {
              title: "8. Analytics & Reports",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; margin-bottom: 2px;">
                    <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase;">Reporting Terminal</div>
                    <select id="scr8-chart-type" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(4,203,194,0.3); color: #04cbc2; font-family: inherit; font-size: 8px; padding: 2px; border-radius: 2px; outline: none; cursor: pointer;">
                      <option value="line">Line: Completes Timeline</option>
                      <option value="bar">Bar: Industry Sectors</option>
                    </select>
                  </div>
                  <!-- SVG charts wrapper -->
                  <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 6px; border-radius: 4px; flex-grow: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; height: 75px; box-sizing: border-box; position: relative;">
                    <!-- Line Chart -->
                    <svg id="scr8-chart-line" width="100%" height="100%" viewBox="0 0 160 50" style="overflow: visible; display: block;">
                      <g stroke="rgba(255,255,255,0.05)" stroke-width="0.5">
                        <line x1="20" y1="10" x2="150" y2="10" />
                        <line x1="20" y1="25" x2="150" y2="25" />
                        <line x1="20" y1="40" x2="150" y2="40" />
                      </g>
                      <!-- Chart path -->
                      <path d="M 20 40 Q 50 15 80 30 T 140 10" fill="none" stroke="#04cbc2" stroke-width="1.5" />
                      <!-- Points -->
                      <circle cx="20" cy="40" r="2.5" fill="#ffffff" />
                      <circle cx="50" cy="22" r="2.5" fill="#04cbc2" />
                      <circle cx="80" cy="30" r="2.5" fill="#04cbc2" />
                      <circle cx="110" cy="21" r="2.5" fill="#04cbc2" />
                      <circle cx="140" cy="10" r="2.5" fill="#10b981" />
                    </svg>
                    <!-- Bar Chart -->
                    <svg id="scr8-chart-bar" width="100%" height="100%" viewBox="0 0 160 50" style="overflow: visible; display: none;">
                      <!-- Grid lines -->
                      <g stroke="rgba(255,255,255,0.05)" stroke-width="0.5">
                        <line x1="20" y1="10" x2="150" y2="10" />
                        <line x1="20" y1="25" x2="150" y2="25" />
                        <line x1="20" y1="40" x2="150" y2="40" />
                      </g>
                      <!-- Bars -->
                      <rect x="25" y="15" width="15" height="25" fill="#04cbc2" rx="1" />
                      <rect x="55" y="25" width="15" height="15" fill="#04cbc2" rx="1" />
                      <rect x="85" y="8" width="15" height="32" fill="#10b981" rx="1" />
                      <rect x="115" y="20" width="15" height="20" fill="#04cbc2" rx="1" />
                    </svg>
                  </div>
                  <!-- Compile Exporter -->
                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px; box-sizing: border-box; flex-shrink: 0;">
                    <span style="font-size: 8px; color: #10b981; font-family: monospace;">✓ Live DB reporting sync</span>
                    <button id="scr8-export-btn" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; font-size: 7.5px; font-weight: bold; padding: 2px 6px; border-radius: 2px; cursor: pointer; outline: none;">Export PDF</button>
                  </div>
                </div>
              `,
              init: () => {
                const chartType = document.getElementById('scr8-chart-type');
                const chartLine = document.getElementById('scr8-chart-line');
                const chartBar = document.getElementById('scr8-chart-bar');
                const exportBtn = document.getElementById('scr8-export-btn');
                if (!chartType || !chartLine || !chartBar || !exportBtn) return;

                chartType.addEventListener('change', () => {
                  if (chartType.value === 'line') {
                    chartLine.style.display = 'block';
                    chartBar.style.display = 'none';
                  } else {
                    chartLine.style.display = 'none';
                    chartBar.style.display = 'block';
                  }
                });

                exportBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  exportBtn.textContent = "Compiling...";
                  exportBtn.disabled = true;
                  setTimeout(() => {
                    exportBtn.textContent = "✓ Exported";
                    setTimeout(() => {
                      exportBtn.textContent = "Export PDF";
                      exportBtn.disabled = false;
                    }, 1200);
                  }, 800);
                });

                return () => {};
              }
            }
          ];

          let currentStep = 0;
          let activeSubCleanup = null;
          let cycleTimer = null;
          let isPaused = false;

          const loadStep = (stepIdx) => {
            if (activeSubCleanup) {
              activeSubCleanup();
              activeSubCleanup = null;
            }

            menuBtns.forEach((btn, idx) => {
              if (idx === stepIdx) {
                btn.style.background = 'rgba(4,203,194,0.1)';
                btn.style.borderColor = 'rgba(4,203,194,0.35)';
                btn.style.color = '#ffffff';
              } else {
                btn.style.background = 'transparent';
                btn.style.borderColor = 'transparent';
                btn.style.color = '#94a3b8';
              }
            });

            const stepData = screens[stepIdx];
            statusEl.innerHTML = `<span>STAGE: ${stepIdx + 1}/${screens.length}</span><span style="color: ${isPaused ? '#f59e0b' : '#10b981'}; font-weight: bold;">[${isPaused ? 'PAUSED' : 'AUTO'}]</span>`;

            viewport.innerHTML = `
              <div style="flex-grow: 1; display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
                <div style="font-size: 10px; font-weight: bold; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px; margin-bottom: 8px; flex-shrink: 0; letter-spacing: 0.5px; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif;">
                  ${stepData.title}
                </div>
                <div style="flex-grow: 1; overflow: hidden;">
                  ${stepData.html}
                </div>
              </div>
            `;

            if (stepData.init) {
              activeSubCleanup = stepData.init();
            }
          };

          menuBtns.forEach((btn, idx) => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              isPaused = true;
              clearInterval(cycleTimer);
              currentStep = idx;
              loadStep(currentStep);
            });
          });

          const startCycle = () => {
            cycleTimer = setInterval(() => {
              currentStep = (currentStep + 1) % screens.length;
              loadStep(currentStep);
            }, 6000);
          };

          loadStep(currentStep);
          startCycle();

          return () => {
            clearInterval(timer);
            clearInterval(cycleTimer);
            if (activeSubCleanup) activeSubCleanup();
          };
        }
      };
    }
  },
  sampling: {
    badge: "DI Response Engine",
    title: "DI Response Engine",
    desc: "Access over 2 million pre-profiled B2B professionals, healthcare specialists, and consumer audiences across 31 countries. Sourced through our verified partner networks and our proprietary panel Opinion Genie to deliver high-fidelity target cohorts.",
    capabilities: [
      { title: "Double Opt-In Panels", text: "Respondents pass through multi-tier verification before entering the active sample pool." },
      { title: "Dynamic Sampling Router", text: "Automated respondent allocation matching demographics to active targets." },
      { title: "B2B & Enterprise Segments", text: "Target decision makers by industry vertical, company size, and executive seniority." },
      { title: "Healthcare & HCP Access", text: "Reach verified physicians, nurses, specialists, and patient cohorts." }
    ],
    architecture: "Integrates with Opinion Genie and external panel registries via secure, authenticated OAuth 2.0 endpoints. Employs real-time routing algorithms that calculate feasibility profiles on the fly.",
    caption: "DI Response Engine Console Dashboard",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #050a0a; font-family: 'Inter', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 8px; padding: 10px; border: 1px solid rgba(4,203,194,0.15); color: #cbd5e1; position: relative; user-select: none;">
            <!-- Top ribbon -->
            <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 6px; margin-bottom: 8px; flex-shrink: 0; box-sizing: border-box;">
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 5px; border-radius: 4px; text-align: center;">
                <span style="font-size: 7.5px; color: #94a3b8; display: block; text-transform: uppercase;">Active Panelists</span>
                <strong style="font-size: 11px; color: #ffffff; font-family: monospace;" id="sam-panelists-count">2,481,902</strong>
              </div>
              <div style="background: rgba(4,203,194,0.02); border: 1px solid rgba(4,203,194,0.15); padding: 5px; border-radius: 4px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <div style="width: 5px; height: 5px; border-radius: 50%; background: #04cbc2; box-shadow: 0 0 4px #04cbc2;"></div>
                <strong style="font-size: 9px; color: #ffffff; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif;">OpinionGenie Connected</strong>
              </div>
            </div>
            <!-- Tabs Menu -->
            <div style="display: flex; gap: 4px; background: rgba(0,0,0,0.3); padding: 3px; border-radius: 4px; margin-bottom: 8px; flex-shrink: 0; box-sizing: border-box;">
              <button class="sam-tab active" data-target="sam-pane-config" style="flex-grow: 1; background: rgba(4,203,194,0.1); border: 1px solid rgba(4,203,194,0.3); color: #ffffff; font-family: inherit; font-size: 8px; font-weight: bold; padding: 4px 0; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s;">1. Router Config</button>
              <button class="sam-tab" data-target="sam-pane-map" style="flex-grow: 1; background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8px; padding: 4px 0; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s;">2. Routing Nodes</button>
              <button class="sam-tab" data-target="sam-pane-dir" style="flex-grow: 1; background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8px; padding: 4px 0; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s;">3. Panel Directory</button>
            </div>
            <!-- Panes Stack -->
            <div style="flex-grow: 1; overflow: hidden; position: relative; box-sizing: border-box;" id="sam-panes">
              <!-- Pane 1: Router Config -->
              <div id="sam-pane-config" class="sam-panel-pane" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; box-sizing: border-box; margin-bottom: 6px;">
                  <div>
                    <span style="font-size: 7.5px; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 2px;">Target Region</span>
                    <select id="sam-region" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-family: inherit; font-size: 9px; padding: 4px; border-radius: 3px; outline: none; cursor: pointer;">
                      <option value="na">North America</option>
                      <option value="eu">Europe (EMEA)</option>
                      <option value="apac">Asia Pacific (APAC)</option>
                      <option value="latam">LATAM & MEA</option>
                    </select>
                  </div>
                  <div>
                    <span style="font-size: 7.5px; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 2px;">Audience Vertical</span>
                    <select id="sam-vertical" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-family: inherit; font-size: 9px; padding: 4px; border-radius: 3px; outline: none; cursor: pointer;">
                      <option value="tech">B2B Technology</option>
                      <option value="hc">Healthcare Specialist</option>
                      <option value="cons">General Consumer</option>
                    </select>
                  </div>
                </div>
                <!-- Sliders and numbers -->
                <div style="margin-bottom: 6px;">
                  <div style="display: flex; justify-content: space-between; font-size: 9px; color: #e2e8f0; margin-bottom: 2px;">
                    <span>Target Completes</span>
                    <strong style="color: #04cbc2; font-family: monospace;" id="sam-n-val">300</strong>
                  </div>
                  <input type="range" id="sam-n-slider" min="50" max="2000" step="50" value="300" style="width: 100%; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; outline: none; accent-color: #04cbc2; cursor: pointer;">
                </div>
                <!-- Dynamic routing stats -->
                <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 6px 8px; border-radius: 4px; box-sizing: border-box; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                  <div>
                    <span style="font-size: 7px; color: #64748b; text-transform: uppercase; display: block;">Matching Pool</span>
                    <span style="color: #04cbc2; font-weight: bold; font-family: monospace; font-size: 10px;" id="sam-pool-val">324,500</span>
                  </div>
                  <div>
                    <span style="font-size: 7px; color: #64748b; text-transform: uppercase; display: block;">Est. Response Rate</span>
                    <span style="color: #10b981; font-weight: bold; font-family: monospace; font-size: 10px;" id="sam-rr-val">42%</span>
                  </div>
                </div>
              </div>
              <!-- Pane 2: Map Node Routing -->
              <div id="sam-pane-map" class="sam-panel-pane" style="display: none; flex-direction: column; height: 100%; justify-content: space-between;">
                <div style="font-size: 8px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; display: flex; justify-content: space-between;">
                  <span>Active Routing Pipelines</span>
                  <span style="color: #10b981; font-weight: bold;" id="sam-routing-nodes-count">✔ Nodes Synchronized</span>
                </div>
                <div style="flex-grow: 1; border: 1px solid rgba(255,255,255,0.03); background: rgba(0,0,0,0.35); border-radius: 4px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; height: 120px;">
                  <!-- Styled world map background dots -->
                  <svg width="100%" height="100%" viewBox="0 0 200 100" style="overflow: visible;">
                    <g opacity="0.12" fill="#04cbc2">
                      <circle cx="20" cy="30" r="1.2" /><circle cx="28" cy="28" r="1" /><circle cx="36" cy="25" r="1.5" />
                      <circle cx="25" cy="40" r="1.2" /><circle cx="33" cy="42" r="1.3" /><circle cx="42" cy="48" r="1" />
                      <circle cx="110" cy="20" r="1.3" /><circle cx="120" cy="18" r="1.5" /><circle cx="130" cy="22" r="1.2" />
                      <circle cx="115" cy="30" r="1" /><circle cx="125" cy="35" r="1.2" /><circle cx="135" cy="38" r="1.4" />
                      <circle cx="155" cy="45" r="1.5" /><circle cx="165" cy="50" r="1" /><circle cx="175" cy="55" r="1.3" />
                      <circle cx="160" cy="65" r="1.2" /><circle cx="170" cy="70" r="1.4" /><circle cx="180" cy="75" r="1.5" />
                    </g>
                    <!-- Server Nodes -->
                    <!-- OPG Hub -->
                    <circle cx="100" cy="50" r="5" fill="#10b981" />
                    <circle cx="100" cy="50" r="10" fill="none" stroke="#10b981" stroke-width="0.5" stroke-dasharray="2 2" />
                    <text x="100" y="62" fill="#10b981" font-size="6" text-anchor="middle" font-family="monospace" font-weight="bold">OPG HUB</text>
                    
                    <!-- Region Nodes -->
                    <g id="sam-map-nodes">
                      <circle cx="30" cy="25" r="3.5" fill="#04cbc2" id="node-na" />
                      <text x="30" y="18" fill="#e2e8f0" font-size="6" text-anchor="middle">NA</text>
                      
                      <circle cx="160" cy="30" r="3" fill="#64748b" id="node-eu" />
                      <text x="160" y="23" fill="#e2e8f0" font-size="6" text-anchor="middle">EU</text>
                      
                      <circle cx="170" cy="75" r="3" fill="#64748b" id="node-apac" />
                      <text x="170" y="83" fill="#e2e8f0" font-size="6" text-anchor="middle">APAC</text>
                      
                      <circle cx="50" cy="70" r="3" fill="#64748b" id="node-latam" />
                      <text x="50" y="78" fill="#e2e8f0" font-size="6" text-anchor="middle">LATAM</text>
                    </g>
                    
                    <!-- Path connections -->
                    <path d="M30,25 Q65,20 100,50" fill="none" stroke="#04cbc2" stroke-width="1" stroke-dasharray="3 3" id="path-na" />
                    <path d="M160,30 Q130,25 100,50" fill="none" stroke="#64748b" stroke-width="0.5" id="path-eu" />
                    <path d="M170,75 Q135,70 100,50" fill="none" stroke="#64748b" stroke-width="0.5" id="path-apac" />
                    <path d="M50,70 Q75,65 100,50" fill="none" stroke="#64748b" stroke-width="0.5" id="path-latam" />
                  </svg>
                </div>
              </div>
              <!-- Pane 3: Panel Directory -->
              <div id="sam-pane-dir" class="sam-panel-pane" style="display: none; flex-direction: column; justify-content: space-between; height: 100%;">
                <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); padding: 4px; border-radius: 4px; display: flex; flex-direction: column; gap: 4px; flex-grow: 1; overflow-y: auto; box-sizing: border-box; max-height: 110px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 3px; font-size: 8px;">
                    <span style="color: #ffffff; font-weight: bold;">🇺🇸 United States Panel</span>
                    <span style="color: #04cbc2; font-family: monospace;">820,400 active</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 3px; font-size: 8px;">
                    <span style="color: #ffffff; font-weight: bold;">🇬🇧 United Kingdom Panel</span>
                    <span style="color: #04cbc2; font-family: monospace;">245,100 active</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 3px; font-size: 8px;">
                    <span style="color: #ffffff; font-weight: bold;">🇯🇵 Japan Panel</span>
                    <span style="color: #04cbc2; font-family: monospace;">185,900 active</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 3px; font-size: 8px;">
                    <span style="color: #ffffff; font-weight: bold;">🇩🇪 Germany Panel</span>
                    <span style="color: #04cbc2; font-family: monospace;">164,200 active</span>
                  </div>
                </div>
                <div style="font-size: 7.5px; color: #10b981; font-family: monospace; text-align: center; margin-top: 4px;">
                  ℹ Live Sync active with OpinionGenie database
                </div>
              </div>
            </div>
          </div>
        `,
        init: () => {
          const tabs = document.querySelectorAll('.sam-tab');
          const panes = document.querySelectorAll('.sam-panel-pane');
          const regSelect = document.getElementById('sam-region');
          const vertSelect = document.getElementById('sam-vertical');
          const poolVal = document.getElementById('sam-pool-val');
          const rrVal = document.getElementById('sam-rr-val');
          const slider = document.getElementById('sam-n-slider');
          const nVal = document.getElementById('sam-n-val');

          if (!tabs.length || !panes.length) return;

          tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
              e.stopPropagation();
              const target = tab.getAttribute('data-target');
              tabs.forEach(t => {
                if (t === tab) {
                  t.classList.add('active');
                  t.style.background = 'rgba(4,203,194,0.1)';
                  t.style.borderColor = 'rgba(4,203,194,0.3)';
                  t.style.color = '#ffffff';
                } else {
                  t.classList.remove('active');
                  t.style.background = 'transparent';
                  t.style.borderColor = 'transparent';
                  t.style.color = '#94a3b8';
                }
              });

              panes.forEach(p => {
                if (p.id === target) {
                  p.style.display = 'flex';
                } else {
                  p.style.display = 'none';
                }
              });
            });
          });

          const updateRouterConfig = () => {
            if (!regSelect || !vertSelect || !poolVal || !rrVal || !slider || !nVal) return;
            const r = regSelect.value;
            const v = vertSelect.value;
            const n = parseInt(slider.value, 10);
            nVal.textContent = n;

            let pool = 120000;
            let rr = 34;

            if (r === 'na') { pool += 150000; rr += 5; }
            else if (r === 'eu') { pool += 80000; rr += 2; }
            else if (r === 'apac') { pool += 30000; rr -= 5; }
            else { pool += 10000; rr -= 8; }

            if (v === 'tech') { pool -= 50000; rr -= 4; }
            else if (v === 'hc') { pool -= 90000; rr += 12; }
            else { pool += 110000; rr += 2; }

            pool = Math.round(pool * (1 + (n / 2000)));

            poolVal.textContent = pool.toLocaleString();
            rrVal.textContent = rr + "%";

            const nodes = ['na', 'eu', 'apac', 'latam'];
            nodes.forEach(nodeKey => {
              const nodeEl = document.getElementById('node-' + nodeKey);
              const pathEl = document.getElementById('path-' + nodeKey);
              if (!nodeEl || !pathEl) return;
              if (nodeKey === r) {
                nodeEl.setAttribute('fill', '#04cbc2');
                nodeEl.setAttribute('r', '4.5');
                pathEl.setAttribute('stroke', '#04cbc2');
                pathEl.setAttribute('stroke-width', '1.2');
                pathEl.setAttribute('stroke-dasharray', '3 3');
              } else {
                nodeEl.setAttribute('fill', '#64748b');
                nodeEl.setAttribute('r', '3');
                pathEl.setAttribute('stroke', '#64748b');
                pathEl.setAttribute('stroke-width', '0.5');
                pathEl.removeAttribute('stroke-dasharray');
              }
            });
          };

          [regSelect, vertSelect].forEach(sel => {
            if (sel) sel.addEventListener('change', updateRouterConfig);
          });
          if (slider) {
            slider.addEventListener('input', updateRouterConfig);
          }

          const panelistCount = document.getElementById('sam-panelists-count');
          const panelistInterval = setInterval(() => {
            if (!panelistCount) return;
            let cur = parseInt(panelistCount.textContent.replace(/,/g, ''), 10);
            cur += Math.floor(Math.random() * 3) + 1;
            panelistCount.textContent = cur.toLocaleString();
          }, 4000);

          updateRouterConfig();

          return () => {
            clearInterval(panelistInterval);
          };
        }
      };
    }
  },
  development: {
    badge: "DI - Survey Design Engine",
    title: "DI - Survey Design Engine",
    desc: "Our design methodology tools allow research teams to B2B question models, set up branching logic flows, configure skip constraints, and preview mobile layouts in real-time.",
    capabilities: [
      { title: "Visual Question Builder", text: "Drag-and-drop elements to format single choice, matrix tables, grids, and numeric answers." },
      { title: "Branching Logic Flows", text: "Visual rule designer to map skip logic, routing paths, and conditional loops based on responses." },
      { title: "Device-Responsive Layouts", text: "Automatic layout formatting optimizing rendering across desktop, tablet, and mobile browsers." },
      { title: "Interactive Media Stimuli", text: "Securely host and track respondent engagement with video concepts, audio segments, and image carousels." }
    ],
    architecture: "Compiles JSON question schemas compatible with all major rendering engines (Decipher, Qualtrics, Confirmit) via automated mapping APIs.",
    caption: "DI - Survey Design Engine Editor Workspace",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: grid; grid-template-columns: 1.1fr 0.9fr; background: #050a0a; font-family: 'Inter', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 8px; border: 1px solid rgba(4,203,194,0.15); color: #cbd5e1; user-select: none;">
            <!-- Left side: Visual Builder editor card -->
            <div style="padding: 10px; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif;">Schema Designer</span>
                  <button id="des-add-opt" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; font-size: 8px; font-weight: bold; padding: 2px 5px; border-radius: 2px; cursor: pointer; outline: none;">+ Option</button>
                </div>
                <!-- Question Editor Card -->
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 8px; border-radius: 4px; box-sizing: border-box;">
                  <span style="font-size: 7px; color: #64748b; font-family: monospace; text-transform: uppercase;">Element Class</span>
                  <select id="des-type" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-family: inherit; font-size: 8.5px; padding: 3px; border-radius: 2px; margin: 2px 0 6px 0; outline: none; cursor: pointer;">
                    <option value="single">Single Select Choice</option>
                    <option value="multi">Multiple Choice Grid</option>
                  </select>
                  <span style="font-size: 7px; color: #64748b; font-family: monospace; text-transform: uppercase;">Question Text</span>
                  <input type="text" id="des-input-txt" value="Which cloud infrastructure do you prefer?" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-family: inherit; font-size: 9px; padding: 4px; border-radius: 2px; outline: none; margin-top: 2px; box-sizing: border-box;">
                </div>
                <!-- Options list editor -->
                <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 3px;" id="des-list-opts">
                  <div style="display: flex; align-items: center; gap: 4px;" class="des-opt-row">
                    <input type="text" value="Amazon Web Services" class="des-opt-input" style="flex-grow: 1; background: transparent; border: 1px dashed rgba(255,255,255,0.1); color: #94a3b8; font-family: inherit; font-size: 8px; padding: 2px 4px; outline: none;">
                    <button class="des-opt-del" style="background: transparent; border: none; color: #ef4444; font-size: 9px; cursor: pointer; outline: none; padding: 0 2px;">×</button>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;" class="des-opt-row">
                    <input type="text" value="Microsoft Azure" class="des-opt-input" style="flex-grow: 1; background: transparent; border: 1px dashed rgba(255,255,255,0.1); color: #94a3b8; font-family: inherit; font-size: 8px; padding: 2px 4px; outline: none;">
                    <button class="des-opt-del" style="background: transparent; border: none; color: #ef4444; font-size: 9px; cursor: pointer; outline: none; padding: 0 2px;">×</button>
                  </div>
                </div>
              </div>
              <div style="font-family: monospace; font-size: 7px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px; display: flex; justify-content: space-between;">
                <span>SCHEMA STATUS: OK</span>
                <span style="color: #04cbc2;">JSON EXPORT READY</span>
              </div>
            </div>
            <!-- Right side: Device Previews -->
            <div style="display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; box-sizing: border-box; padding: 6px;">
              <!-- Simulated smartphone frame -->
              <div style="width: 125px; height: 230px; border-radius: 16px; border: 4px solid #1e293b; background: #000000; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 8px 20px rgba(0,0,0,0.6); position: relative; box-sizing: border-box;">
                <!-- Notch -->
                <div style="width: 40px; height: 10px; background: #1e293b; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; align-self: center; flex-shrink: 0;"></div>
                <!-- Device Viewport Screen -->
                <div id="sim-screen" style="flex-grow: 1; padding: 8px 6px; display: flex; flex-direction: column; justify-content: space-between; background: #050a0a; overflow: hidden; box-sizing: border-box;">
                  <div>
                    <div style="font-size: 7px; color: #04cbc2; text-transform: uppercase; font-family: monospace; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                      <span>Live Preview</span>
                      <span id="sim-live-time-clock">09:41 AM</span>
                    </div>
                    <div style="font-size: 9px; color: #ffffff; font-weight: bold; margin-top: 4px; line-height: 1.2;" id="sim-q-txt">Which cloud infrastructure do you prefer?</div>
                    <!-- Choices list -->
                    <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 8px;" id="sim-opts">
                      <!-- Filled dynamically -->
                    </div>
                  </div>
                  <button id="sim-submit" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; padding: 4px; border-radius: 3px; font-size: 7.5px; font-weight: bold; width: 100%; cursor: pointer; outline: none; border-style: solid; transition: all 0.2s;">Submit Response</button>
                </div>
              </div>
            </div>
          </div>
        `,
        init: () => {
          const typeSelect = document.getElementById('des-type');
          const inputTxt = document.getElementById('des-input-txt');
          const addOpt = document.getElementById('des-add-opt');
          const listOpts = document.getElementById('des-list-opts');
          const simText = document.getElementById('sim-q-txt');
          const simOpts = document.getElementById('sim-opts');
          const simSubmit = document.getElementById('sim-submit');
          const phoneClockEl = document.getElementById('sim-live-time-clock');

          if (!typeSelect || !inputTxt || !addOpt || !listOpts || !simText || !simOpts || !simSubmit) return;

          // Simple live clock for the phone mockup preview
          const phoneTimer = setInterval(() => {
            if (phoneClockEl) {
              const now = new Date();
              let hours = now.getHours();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12 || 12;
              const mins = String(now.getMinutes()).padStart(2, '0');
              phoneClockEl.textContent = `${hours}:${mins} ${ampm}`;
            }
          }, 5000);

          const updatePreview = () => {
            simText.textContent = inputTxt.value;
            simOpts.innerHTML = '';
            
            const isMulti = typeSelect.value === 'multi';
            const optInputs = listOpts.querySelectorAll('.des-opt-input');
            
            optInputs.forEach((inp, idx) => {
              const text = inp.value || "Option " + (idx + 1);
              const label = document.createElement('label');
              label.style.display = 'flex';
              label.style.alignItems = 'center';
              label.style.gap = '5px';
              label.style.fontSize = '8px';
              label.style.color = '#94a3b8';
              label.style.background = 'rgba(255,255,255,0.02)';
              label.style.border = '1px solid rgba(255,255,255,0.05)';
              label.style.padding = '4px 6px';
              label.style.borderRadius = '3px';
              label.style.cursor = 'pointer';
              label.style.transition = 'all 0.15s';

              const inputType = isMulti ? 'checkbox' : 'radio';
              label.innerHTML = `<input type="${inputType}" name="sim-r" style="accent-color: #04cbc2; cursor: pointer; margin: 0; width: 10px; height: 10px;"><span>${text}</span>`;
              
              const chkInput = label.querySelector('input');
              chkInput.addEventListener('change', () => {
                if (!isMulti) {
                  const allLabels = simOpts.querySelectorAll('label');
                  allLabels.forEach(l => {
                    l.style.background = 'rgba(255,255,255,0.02)';
                    l.style.borderColor = 'rgba(255,255,255,0.05)';
                    l.style.color = '#94a3b8';
                  });
                }
                if (chkInput.checked) {
                  label.style.background = 'rgba(4,203,194,0.05)';
                  label.style.borderColor = '#04cbc2';
                  label.style.color = '#ffffff';
                } else {
                  label.style.background = 'rgba(255,255,255,0.02)';
                  label.style.borderColor = 'rgba(255,255,255,0.05)';
                  label.style.color = '#94a3b8';
                }
              });

              simOpts.appendChild(label);
            });
          };

          const attachDel = (btn) => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const row = btn.closest('.des-opt-row');
              const allRows = listOpts.querySelectorAll('.des-opt-row');
              if (allRows.length > 1) {
                row.remove();
                updatePreview();
              }
            });
          };

          listOpts.querySelectorAll('.des-opt-del').forEach(attachDel);

          addOpt.addEventListener('click', (e) => {
            e.stopPropagation();
            const allRows = listOpts.querySelectorAll('.des-opt-row');
            if (allRows.length >= 4) return;

            const row = document.createElement('div');
            row.className = 'des-opt-row';
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '4px';

            const defaultVal = allRows.length === 2 ? "Google Cloud Platform" : "Oracle Cloud";
            row.innerHTML = `<input type="text" value="${defaultVal}" class="des-opt-input" style="flex-grow: 1; background: transparent; border: 1px dashed rgba(255,255,255,0.1); color: #94a3b8; font-family: inherit; font-size: 8px; padding: 2px 4px; outline: none;"><button class="des-opt-del" style="background: transparent; border: none; color: #ef4444; font-size: 9px; cursor: pointer; outline: none; padding: 0 2px;">×</button>`;

            listOpts.appendChild(row);
            const delBtn = row.querySelector('.des-opt-del');
            attachDel(delBtn);

            const inp = row.querySelector('.des-opt-input');
            inp.addEventListener('input', updatePreview);

            updatePreview();
          });

          inputTxt.addEventListener('input', updatePreview);
          typeSelect.addEventListener('change', updatePreview);

          simSubmit.addEventListener('click', (e) => {
            e.stopPropagation();
            simSubmit.textContent = "Syncing Logic Schema...";
            simSubmit.style.background = "#10b981";
            simSubmit.style.borderColor = "#10b981";

            setTimeout(() => {
              simSubmit.textContent = "✓ Data Sync OK";
              setTimeout(() => {
                simSubmit.textContent = "Submit Response";
                simSubmit.style.background = "rgba(4,203,194,0.15)";
                simSubmit.style.borderColor = "#04cbc2";
              }, 1200);
            }, 800);
          });

          listOpts.querySelectorAll('.des-opt-input').forEach(inp => {
            inp.addEventListener('input', updatePreview);
          });

          updatePreview();

          return () => {
            clearInterval(phoneTimer);
          };
        }
      };
    }
  },
  translations: {
    badge: "DI Translation Engine",
    title: "DI Translation Engine",
    desc: "Translate, review, and synchronize survey templates across 25+ languages. Our localization platform preserves semantic intent, formatting variables, and routing logic integrity.",
    capabilities: [
      { title: "Split-Pane Editor", text: "Dedicated translation sheets showing English source strings side-by-side with target language inputs." },
      { title: "Variables Isolation", text: "Compiler locking that prevents translators from modifying HTML tags, piping variables, and scripting logic." },
      { title: "Contextual Translation", text: "Professional human translators portal with built-in sector-specific glossaries and syntax auditing." },
      { title: "Logic Schema Sync", text: "Translates text values while mapping matching rules indices to verify routing loops function identically." }
    ],
    architecture: "Interfaces with global Translation Management Systems (TMS) via authenticated REST APIs to sync strings and format schemas.",
    caption: "DI Translation Engine Portal Sheets Editor",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #050a0a; font-family: 'Inter', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 8px; padding: 10px; border: 1px solid rgba(4,203,194,0.15); color: #cbd5e1; user-select: none;">
            <!-- Language Selector header toolbar -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px; flex-shrink: 0; box-sizing: border-box;">
              <div style="display: flex; gap: 4px; background: rgba(0,0,0,0.3); padding: 2px; border-radius: 4px;">
                <button class="tra-tab active" data-lang="DE" style="background: rgba(4,203,194,0.1); border: 1px solid rgba(4,203,194,0.3); color: #ffffff; font-family: inherit; font-size: 8px; font-weight: bold; padding: 2px 6px; border-radius: 2px; cursor: pointer; outline: none; transition: all 0.2s;">EN ➔ DE</button>
                <button class="tra-tab" data-lang="ES" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8px; padding: 2px 6px; border-radius: 2px; cursor: pointer; outline: none; transition: all 0.2s;">EN ➔ ES</button>
                <button class="tra-tab" data-lang="JA" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8px; padding: 2px 6px; border-radius: 2px; cursor: pointer; outline: none; transition: all 0.2s;">EN ➔ JA</button>
              </div>
              <button id="tra-auto" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; font-size: 8px; font-weight: bold; padding: 2px 6px; border-radius: 2px; cursor: pointer; outline: none; display: flex; align-items: center; gap: 2px;">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Auto-Fill
              </button>
            </div>
            <!-- Translator sheet content -->
            <div style="flex-grow: 1; display: grid; grid-template-rows: 1fr 1.2fr; gap: 6px; margin: 8px 0; overflow: hidden; box-sizing: border-box;">
              <!-- English Source questions list -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 6px 8px; border-radius: 4px; box-sizing: border-box;">
                <div style="font-size: 7.5px; color: #64748b; font-family: monospace; text-transform: uppercase;">Source String</div>
                <div style="font-size: 9.5px; color: #ffffff; font-weight: bold; line-height: 1.25; margin-top: 2px;" id="tra-src-txt">"What cloud infrastructure does your company run on primarily?"</div>
              </div>
              <!-- Target Translation textarea sheet card -->
              <div style="background: rgba(4,203,194,0.02); border: 1px solid rgba(4,203,194,0.15); padding: 6px 8px; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;" id="tra-card">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 7.5px; color: #04cbc2; font-family: monospace; text-transform: uppercase;" id="tra-lbl">DE (GERMAN)</span>
                    <span style="font-size: 7.5px; color: #10b981; font-family: monospace; font-weight: bold;" id="tra-accuracy">Confidence: 99.2%</span>
                  </div>
                  <textarea id="tra-input" style="width: 100%; background: transparent; border: none; outline: none; color: #ffffff; font-family: inherit; font-size: 9.5px; line-height: 1.25; resize: none; height: 36px; padding: 0; margin-top: 3px;" spellcheck="false">"Auf welcher Cloud-Infrastruktur läuft Ihr Unternehmen hauptsächlich?"</textarea>
                </div>
                <!-- live validation status code -->
                <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 3px; font-family: monospace; font-size: 7.5px; color: #10b981; flex-shrink: 0;" id="tra-status">
                  <span>Logic check: OK</span>
                  <span>Synced to Cloud CDN</span>
                </div>
              </div>
            </div>
            <!-- Sync Action footer button -->
            <button id="tra-sync-btn" style="background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #ffffff; font-size: 9px; font-weight: bold; padding: 5px 0; border-radius: 3px; cursor: pointer; outline: none; width: 100%;">Approve & Push Translation</button>
          </div>
        `,
        init: () => {
          const tabs = document.querySelectorAll('.tra-tab');
          const autoBtn = document.getElementById('tra-auto');
          const input = document.getElementById('tra-input');
          const lbl = document.getElementById('tra-lbl');
          const acc = document.getElementById('tra-accuracy');
          const status = document.getElementById('tra-status');
          const syncBtn = document.getElementById('tra-sync-btn');
          const card = document.getElementById('tra-card');

          if (!tabs.length || !autoBtn || !input || !lbl || !acc || !status || !syncBtn) return;

          const translations = {
            DE: {
              lbl: "DE (GERMAN)",
              text: '"Auf welcher Cloud-Infrastruktur läuft Ihr Unternehmen hauptsächlich?"',
              acc: "Confidence: 99.2%",
              match: "Logic check: OK",
              statusText: "Synced to Cloud CDN"
            },
            ES: {
              lbl: "ES (SPANISH)",
              text: '"¿En qué infraestructura de nube se ejecuta su empresa principalmente?"',
              acc: "Confidence: 98.6%",
              match: "Logic check: OK",
              statusText: "Synced to Cloud CDN"
            },
            JA: {
              lbl: "JA (JAPANESE)",
              text: '"貴社は主にどのクラウドインフラを使用していますか？"',
              acc: "Confidence: 99.5%",
              match: "Logic check: OK",
              statusText: "Synced to Cloud CDN"
            }
          };

          let currentLang = 'DE';

          tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
              e.stopPropagation();
              const lang = tab.getAttribute('data-lang');
              currentLang = lang;
              
              tabs.forEach(t => {
                if (t === tab) {
                  t.style.background = 'rgba(4,203,194,0.1)';
                  t.style.borderColor = 'rgba(4,203,194,0.3)';
                  t.style.color = '#ffffff';
                  t.classList.add('active');
                } else {
                  t.style.background = 'transparent';
                  t.style.borderColor = 'transparent';
                  t.style.color = '#94a3b8';
                  t.classList.remove('active');
                }
              });

              card.style.opacity = '0.3';
              setTimeout(() => {
                lbl.textContent = translations[lang].lbl;
                input.value = translations[lang].text;
                acc.textContent = translations[lang].acc;
                status.innerHTML = `<span>${translations[lang].match}</span><span>${translations[lang].statusText}</span>`;
                status.style.color = '#10b981';
                card.style.opacity = '1';
              }, 150);
            });
          });

          autoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            input.value = "";
            let chars = translations[currentLang].text;
            let cIdx = 0;
            autoBtn.disabled = true;
            autoBtn.textContent = "Translating...";
            
            const type = () => {
              if (cIdx <= chars.length) {
                input.value = chars.substring(0, cIdx);
                cIdx++;
                setTimeout(type, 12);
              } else {
                autoBtn.disabled = false;
                autoBtn.textContent = "Auto-Fill";
                status.innerHTML = `<span>Logic check: OK</span><span>Local edited</span>`;
                status.style.color = '#f59e0b';
              }
            };
            type();
          });

          input.addEventListener('input', () => {
            status.innerHTML = `<span>Logic validation pending</span><span>Local edited</span>`;
            status.style.color = '#f59e0b';
          });

          syncBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            syncBtn.textContent = "Deploying to CDN...";
            syncBtn.disabled = true;
            syncBtn.style.background = "rgba(4,203,194,0.15)";
            syncBtn.style.borderColor = "#04cbc2";

            setTimeout(() => {
              syncBtn.textContent = "Approve & Push Translation";
              syncBtn.disabled = false;
              syncBtn.style.background = "rgba(16,185,129,0.15)";
              syncBtn.style.borderColor = "#10b981";
              status.innerHTML = `<span>Logic check: OK</span><span>Synced to Cloud CDN</span>`;
              status.style.color = '#10b981';

              const cap = document.getElementById('visual-caption');
              if (cap) {
                cap.textContent = "✓ Sync Success: Translations deployed globally.";
                setTimeout(() => { cap.textContent = "DI Translation Engine Portal Sheets Editor"; }, 2000);
              }
            }, 1000);
          });

          return () => {};
        }
      };
    }
  },
  processing: {
    badge: "DI Survey Security Engine",
    title: "DI Survey Security Engine",
    desc: "Deploy automated respondent auditing and real-time fraud mitigation to secure study parameters. The security engine automatically detects and blocks speeders, duplicate browser fingerprints, VPN routing, and straightlining anomalies.",
    capabilities: [
      { title: "Multi-Layer Security Shield", text: "Runs datasets through a 12-point quality validation loop to identify cognitive anomalies and bot activity." },
      { title: "Speeder & Bot Filters", text: "Flag and quarantine respondents who run script bots or bypass questionnaire reading timelines." },
      { title: "IP & VPN Shield", text: "Blocks duplicate IP entries and rejects traffic routing through anonymous VPN proxy networks." },
      { title: "Digital Fingerprinting", text: "Unique browser hashing identifies and merges duplicate respondents across campaigns." }
    ],
    architecture: "Applies real-time cleaning and auditing algorithms at the response entry gateway, quarantining flagged records instantly.",
    caption: "DI Survey Security Engine ETL Pipeline Manager",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: grid; grid-template-columns: 100px 1.25fr; background: #050a0a; font-family: 'Inter', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 8px; padding: 10px; border: 1px solid rgba(4,203,194,0.15); color: #cbd5e1; position: relative; user-select: none;">
            <!-- Left Pane: Pipeline switches -->
            <div style="border-right: 1px solid rgba(255,255,255,0.05); padding-right: 8px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
              <div>
                <div style="font-size: 8px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; font-family: 'Space Grotesk', sans-serif;">ETL Filters</div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <label style="display: flex; flex-direction: column; font-size: 8.5px; color: #cbd5e1; cursor: pointer; gap: 2px;">
                    <span>VPN Block</span>
                    <input type="checkbox" id="etl-chk-vpn" checked style="accent-color: #04cbc2; cursor: pointer; align-self: flex-start; transform: scale(0.9);">
                  </label>
                  <label style="display: flex; flex-direction: column; font-size: 8.5px; color: #cbd5e1; cursor: pointer; gap: 2px;">
                    <span>Speeder check</span>
                    <input type="checkbox" id="etl-chk-speed" checked style="accent-color: #04cbc2; cursor: pointer; align-self: flex-start; transform: scale(0.9);">
                  </label>
                  <label style="display: flex; flex-direction: column; font-size: 8.5px; color: #cbd5e1; cursor: pointer; gap: 2px;">
                    <span>Straightline</span>
                    <input type="checkbox" id="etl-chk-line" style="accent-color: #04cbc2; cursor: pointer; align-self: flex-start; transform: scale(0.9);">
                  </label>
                </div>
              </div>
              <!-- stats -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); padding: 4px; border-radius: 2px; text-align: center; font-size: 7.5px;">
                <span style="color: #94a3b8;">Confidence</span>
                <strong style="display: block; color: #10b981; font-family: monospace;" id="etl-confidence">94.8%</strong>
              </div>
            </div>
            <!-- Right Pane: Table data cleaner -->
            <div style="padding-left: 8px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; box-sizing: border-box;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 8px; color: #94a3b8; font-weight: bold; margin-bottom: 4px;">
                  <span>QUARANTINE QUEUE</span>
                  <span style="color: #ef4444;" id="etl-q-count">1 Flagged</span>
                </div>
                <!-- Interactive stream -->
                <div style="display: flex; flex-direction: column; gap: 4px;" id="etl-stream">
                  <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.20); padding: 4px 6px; border-radius: 3px; align-items: center; justify-content: space-between; box-sizing: border-box;" class="etl-row">
                    <div>
                      <div style="font-family: monospace; font-size: 8px; color: #ffffff;">RESP #48291</div>
                      <div style="font-size: 7.5px; color: #f59e0b;">Speeder: LOI 45s</div>
                    </div>
                    <button class="etl-review" style="background: rgba(245,158,11,0.15); border: 1px solid #f59e0b; color: #ffffff; font-size: 7.5px; font-weight: bold; padding: 2px 4px; border-radius: 2px; cursor: pointer; outline: none; justify-self: end; border-style: solid;">Review</button>
                  </div>
                </div>
              </div>
              <!-- Ingress stats count and exporter -->
              <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 6px; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px; box-sizing: border-box; flex-shrink: 0;">
                <div>
                  <span style="font-size: 7px; color: #94a3b8; text-transform: uppercase; display: block;">Clean Ingested</span>
                  <strong style="font-size: 11px; color: #ffffff; font-family: monospace;" id="etl-clean-count">1,280</strong>
                </div>
                <button id="etl-export" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; font-size: 8.5px; font-weight: bold; padding: 4px 0; border-radius: 3px; cursor: pointer; outline: none; border-style: solid; transition: all 0.2s;">Compile SPSS</button>
              </div>
            </div>
            <!-- Side drawer review overlay -->
            <div id="etl-drawer" style="position: absolute; top: 0; right: 0; bottom: 0; width: 140px; background: rgba(5,15,15,0.96); border-left: 1px solid rgba(4,203,194,0.25); backdrop-filter: blur(10px); display: none; flex-direction: column; justify-content: space-between; padding: 8px; box-sizing: border-box; z-index: 99; animation: slide-in-right 0.25s ease-out;">
              <div>
                <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px; font-family: 'Space Grotesk', sans-serif;">Audit Session</div>
                <div style="font-size: 8px; color: #cbd5e1; display: flex; flex-direction: column; gap: 4px; line-height: 1.2;">
                  <span>• Target: US Cloud Segment</span>
                  <span>• Completes: 45s (LOI 15m)</span>
                  <span>• Straightline: 94%</span>
                  <span style="color: #ef4444; font-weight: bold;">• Classification: BOT</span>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 6px;">
                <button id="etl-act-discard" style="background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #ffffff; font-size: 8px; font-weight: bold; padding: 3px 0; border-radius: 2px; cursor: pointer; outline: none; border-style: solid;">Purge</button>
                <button id="etl-act-approve" style="background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #ffffff; font-size: 8px; font-weight: bold; padding: 3px 0; border-radius: 2px; cursor: pointer; outline: none; border-style: solid;">Admit</button>
              </div>
            </div>
          </div>
        `,
        init: () => {
          const chkVpn = document.getElementById('etl-chk-vpn');
          const chkSpeed = document.getElementById('etl-chk-speed');
          const chkLine = document.getElementById('etl-chk-line');
          const confidence = document.getElementById('etl-confidence');
          const qCount = document.getElementById('etl-q-count');
          const cleanCount = document.getElementById('etl-clean-count');
          const exportBtn = document.getElementById('etl-export');
          const stream = document.getElementById('etl-stream');
          const reviewBtn = stream.querySelector('.etl-review');
          const drawer = document.getElementById('etl-drawer');
          const actDiscard = document.getElementById('etl-act-discard');
          const actApprove = document.getElementById('etl-act-approve');

          if (!chkVpn || !chkSpeed || !chkLine || !confidence || !qCount || !cleanCount || !exportBtn || !stream || !reviewBtn || !drawer || !actDiscard || !actApprove) return;

          const updateConfidence = () => {
            let score = 50.0;
            if (chkVpn.checked) score += 25.4;
            if (chkSpeed.checked) score += 19.4;
            if (chkLine.checked) score += 13.8;
            
            confidence.textContent = score.toFixed(1) + "%";
            if (score < 70) {
              confidence.style.color = '#ef4444';
            } else if (score < 90) {
              confidence.style.color = '#f59e0b';
            } else {
              confidence.style.color = '#10b981';
            }
          };

          [chkVpn, chkSpeed, chkLine].forEach(chk => {
            chk.addEventListener('change', updateConfidence);
          });

          reviewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            drawer.style.display = 'flex';
          });

          let cleanSum = 1280;
          const resolve = (admit) => {
            drawer.style.display = 'none';
            const row = stream.querySelector('.etl-row');
            if (row) row.remove();
            
            qCount.textContent = "0 Flagged";
            qCount.style.color = '#10b981';
            stream.innerHTML = `<div style="font-size: 8px; color: #10b981; font-style: italic; text-align: center; padding: 12px 0;">✓ Quarantine cleared. All pipelines clean.</div>`;

            if (admit) {
              cleanSum++;
              cleanCount.textContent = cleanSum.toLocaleString();
            }
          };

          actDiscard.addEventListener('click', (e) => {
            e.stopPropagation();
            resolve(false);
          });
          actApprove.addEventListener('click', (e) => {
            e.stopPropagation();
            resolve(true);
          });

          exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const oldText = exportBtn.textContent;
            exportBtn.textContent = "Exporting...";
            exportBtn.disabled = true;

            setTimeout(() => {
              exportBtn.textContent = "✓ Saved (.sav)";
              setTimeout(() => {
                exportBtn.textContent = oldText;
                exportBtn.disabled = false;
              }, 1200);
            }, 900);
          });

          return () => {};
        }
      };
    }
  },
  consulting: {
    badge: "DI Analytics Engine",
    title: "DI Analytics Engine",
    desc: "Transform raw survey completions into executive summaries, interactive dashboards, and boardroom-ready strategic recommendations compiled by our analysts.",
    capabilities: [
      { title: "Interactive Dashboards", text: "Create custom client portal filters to cross-tabulate demographics, regions, and dates on the fly." },
      { title: "Executive Summaries", text: "Synthesized executive recommendation decks compiled by market analysts outlining key strategic actions." },
      { title: "Significance Audits", text: "Statistical testing calculations mapping margin-of-error parameters and data confidence scores." },
      { title: "Editable Presentations", text: "Direct templates export into fully-formatted, editable PowerPoint slides decks and PDF structures." }
    ],
    architecture: "Queries normalized database layers to generate BI visualization streams using secure GraphQL schemas.",
    caption: "DI Analytics Engine BI Cockpit Dashboard",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #050a0a; font-family: 'Inter', sans-serif; overflow: hidden; padding: 10px; box-sizing: border-box; justify-content: space-between; border-radius: 8px; border: 1px solid rgba(4,203,194,0.15); color: #cbd5e1; user-select: none;">
            <!-- Dropdowns controls -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; flex-shrink: 0; box-sizing: border-box; margin-bottom: 6px;">
              <div>
                <span style="font-size: 7.5px; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 2px;">Demographic Cohort</span>
                <select id="bi-cohort" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-family: inherit; font-size: 8.5px; padding: 3px; border-radius: 3px; outline: none; cursor: pointer;">
                  <option value="all">All Industries</option>
                  <option value="tech">Tech & SaaS Only</option>
                  <option value="fin">Finance Sector</option>
                </select>
              </div>
              <div>
                <span style="font-size: 7.5px; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 2px;">Geographic Filter</span>
                <select id="bi-geo" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-family: inherit; font-size: 8.5px; padding: 3px; border-radius: 3px; outline: none; cursor: pointer;">
                  <option value="all">All Countries</option>
                  <option value="us">United States (US)</option>
                  <option value="eu">Europe (EU)</option>
                </select>
              </div>
            </div>
            <!-- KPI blocks row -->
            <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 4px; flex-shrink: 0; box-sizing: border-box; margin-bottom: 6px;">
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 4px; border-radius: 3px; display: flex; align-items: center; gap: 4px; box-sizing: border-box;">
                <svg width="18" height="18" viewBox="0 0 36 36" style="transform: rotate(-90deg); flex-shrink: 0;">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4px" />
                  <circle id="bi-gauge" cx="18" cy="18" r="15.915" fill="none" stroke="#04cbc2" stroke-width="4px" stroke-dasharray="100, 100" stroke-dashoffset="24" style="transition: stroke-dashoffset 0.5s;" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 9.5px; font-weight: bold; color: #ffffff; font-family: monospace; line-height: 1.1;" id="bi-gauge-val">76%</span>
                  <span style="font-size: 6px; color: #94a3b8; text-transform: uppercase;">Confidence</span>
                </div>
              </div>
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 4px; border-radius: 3px; text-align: center; box-sizing: border-box;">
                <span style="font-size: 6px; color: #94a3b8; text-transform: uppercase; display: block;">Incidence</span>
                <strong style="font-size: 10.5px; color: #ffffff; font-family: monospace; display: block; margin-top: 1px;" id="bi-inc-val">38.4%</strong>
              </div>
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 4px; border-radius: 3px; text-align: center; box-sizing: border-box;">
                <span style="font-size: 6px; color: #94a3b8; text-transform: uppercase; display: block;">Completes</span>
                <strong style="font-size: 10.5px; color: #10b981; font-family: monospace; display: block; margin-top: 1px;" id="bi-completes-val">384</strong>
              </div>
            </div>
            <!-- Dynamic SVG Bars Chart area -->
            <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 6px; border-radius: 4px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden; margin-bottom: 6px;">
              <span style="font-size: 7px; color: #64748b; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif;" id="bi-chart-title">Response Distribution</span>
              <div style="height: 38px; width: 100%; margin-top: 2px;">
                <svg width="100%" height="100%" viewBox="0 0 160 40" style="overflow: visible;">
                  <g>
                    <rect id="bi-bar-1" x="25" y="10" width="14" height="30" fill="#04cbc2" rx="1" style="transition: height 0.5s, y 0.5s;" />
                    <rect id="bi-bar-2" x="60" y="15" width="14" height="25" fill="#04cbc2" rx="1" style="transition: height 0.5s, y 0.5s;" />
                    <rect id="bi-bar-3" x="95" y="5" width="14" height="35" fill="#10b981" rx="1" style="transition: height 0.5s, y 0.5s;" />
                    <rect id="bi-bar-4" x="130" y="20" width="14" height="20" fill="#04cbc2" rx="1" style="transition: height 0.5s, y 0.5s;" />
                  </g>
                </svg>
              </div>
            </div>
            <!-- Slide Deck Compiler CTA -->
            <button id="bi-deck" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; font-size: 8.5px; font-weight: bold; padding: 4px 0; border-radius: 3px; cursor: pointer; outline: none; flex-shrink: 0; width: 100%; border-style: solid; transition: all 0.2s;">Compile PowerPoint Slide Deck</button>
          </div>
        `,
        init: () => {
          const cohort = document.getElementById('bi-cohort');
          const geo = document.getElementById('bi-geo');
          const gauge = document.getElementById('bi-gauge');
          const gaugeVal = document.getElementById('bi-gauge-val');
          const incVal = document.getElementById('bi-inc-val');
          const compVal = document.getElementById('bi-completes-val');
          const chartTitle = document.getElementById('bi-chart-title');
          const bar1 = document.getElementById('bi-bar-1');
          const bar2 = document.getElementById('bi-bar-2');
          const bar3 = document.getElementById('bi-bar-3');
          const bar4 = document.getElementById('bi-bar-4');
          const deckBtn = document.getElementById('bi-deck');

          if (!cohort || !geo || !gauge || !gaugeVal || !incVal || !compVal || !chartTitle || !bar1 || !bar2 || !bar3 || !bar4 || !deckBtn) return;

          const updateBI = () => {
            const c = cohort.value;
            const g = geo.value;

            let baseComp = 384;
            let baseInc = 38.4;
            let confidence = 76;
            
            let h1 = 30, h2 = 25, h3 = 35, h4 = 20;

            if (c === 'tech') {
              baseComp = 182;
              baseInc = 22.1;
              confidence = 94;
              h1 = 15; h2 = 38; h3 = 22; h4 = 10;
              chartTitle.textContent = "Tech sector responses distribution";
            } else if (c === 'fin') {
              baseComp = 98;
              baseInc = 15.6;
              confidence = 88;
              h1 = 35; h2 = 12; h3 = 18; h4 = 28;
              chartTitle.textContent = "Finance sector responses distribution";
            } else {
              chartTitle.textContent = "Global responses distribution";
            }

            if (g === 'us') {
              baseComp = Math.round(baseComp * 0.6);
              baseInc += 4.5;
            } else if (g === 'eu') {
              baseComp = Math.round(baseComp * 0.3);
              baseInc -= 3.1;
            }

            compVal.textContent = baseComp;
            incVal.textContent = baseInc.toFixed(1) + "%";
            gaugeVal.textContent = confidence + "%";
            gauge.setAttribute('stroke-dashoffset', 100 - confidence);

            const drawBar = (bar, height) => {
              bar.setAttribute('height', height);
              bar.setAttribute('y', 40 - height);
            };
            drawBar(bar1, h1);
            drawBar(bar2, h2);
            drawBar(bar3, h3);
            drawBar(bar4, h4);
          };

          [cohort, geo].forEach(sel => {
            sel.addEventListener('change', updateBI);
          });

          deckBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deckBtn.textContent = "Generating Decks...";
            deckBtn.disabled = true;
            deckBtn.style.background = "rgba(4,203,194,0.15)";
            deckBtn.style.borderColor = "#04cbc2";

            setTimeout(() => {
              deckBtn.textContent = "✓ Downloaded PPTX";
              setTimeout(() => {
                deckBtn.textContent = "Compile PowerPoint Slide Deck";
                deckBtn.disabled = false;
                deckBtn.style.background = "rgba(4,203,194,0.15)";
                deckBtn.style.borderColor = "#04cbc2";
              }, 1500);
            }, 1200);
          });

          updateBI();
          return () => {};
        }
      };
    }
  }
};


document.addEventListener('DOMContentLoaded', () => {

  // Firebase Configurations
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
      console.log("Solutions Page: Database Connection -> Live Firebase");
    } catch (e) {
      console.error("Solutions Page: Firebase failed. LocalStorage Fallback enabled:", e);
    }
  }

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

  // 3. Dynamic Solution Loading Orchestration
  let activeCleanup = null;

  const loadSolution = (id) => {
    // Clean up previous animation/interval loops
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }

    const data = SOLUTION_DATA[id];
    if (!data) {
      // Fallback
      window.location.href = "index.html#services";
      return;
    }

    // Update Head Title for SEO best practices
    document.title = `Research Centric Ops | ${data.title}`;

    // Update structural text elements
    document.getElementById('solution-badge').textContent = data.badge;
    document.getElementById('solution-title').textContent = data.title;
    document.getElementById('solution-desc').textContent = data.desc;
    document.getElementById('solution-architecture').textContent = data.architecture;
    document.getElementById('visual-caption').textContent = data.caption;

    // Compile capabilities grid checklist
    const capGrid = document.getElementById('solution-capabilities-grid');
    capGrid.innerHTML = '';
    data.capabilities.forEach(cap => {
      const item = document.createElement('div');
      item.className = 'capability-item';
      item.innerHTML = `
        <svg class="capability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <div class="capability-text">
          <h4>${cap.title}</h4>
          <p>${cap.text}</p>
        </div>
      `;
      capGrid.appendChild(item);
    });

    // Populate animation panel viewport
    const viewport = document.getElementById('visual-viewport');
    viewport.innerHTML = '';
    const visual = data.getVisual();
    viewport.innerHTML = visual.html;
    if (visual.init) {
      activeCleanup = visual.init();
    }
  };

  // 4. Initial trigger based on URL Query parameters
  const params = new URLSearchParams(window.location.search);
  let initialId = params.get('id') || 'sampling';
  if (initialId === 'workflow-hub' || initialId === 'automation') {
    window.location.href = 'workflow-hub.html';
    return;
  }
  if (!SOLUTION_DATA[initialId]) {
    initialId = 'sampling';
  }
  loadSolution(initialId);

  // 5. Intercept dropdown selection links to trigger instant transition without full page load
  const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('solution.html?id=')) {
        e.preventDefault();
        const id = href.split('=')[1];
        
        // Push state in history so browser back/forward buttons work
        history.pushState({ solutionId: id }, '', `solution.html?id=${id}`);
        
        // Load the solution dynamically
        loadSolution(id);

        // Collapse mobile menu if open
        if (mobileToggle && navMenu) {
          mobileToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }

        // Smooth scroll to top of content on transitions
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Handle browser back/forward popstate actions
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.solutionId) {
      loadSolution(e.state.solutionId);
    } else {
      // Re-read query params fallback
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id') || 'sampling';
      loadSolution(id);
    }
  });

  // 6. Support Genie Widget Actions (Identical to app.js chatbot layout triggers)
  const genieTrigger = document.getElementById('support-genie-trigger');
  const genieBox = document.getElementById('support-genie-box');
  const genieClose = document.getElementById('chatbox-close');
  const chatForm = document.getElementById('chatbox-input-form');
  const chatInput = document.getElementById('chatbox-input');
  const chatLogs = document.getElementById('chatbox-messages');

  if (genieTrigger && genieBox && genieClose) {
    let chatOnboarded = false;
    let typingIndicatorElement = null;

    const chatbotIcons = {
      cpi: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
      workflow: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      erp: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
      quote: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      calendar: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      back: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>`,
      support: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
      globe: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
    };

    const genieAvatarHtml = '<img src="support_genie_avatar.png" alt="Support Genie" class="genie-avatar-img">';

    const showTypingIndicator = () => {
      if (typingIndicatorElement || !chatLogs) return;
      typingIndicatorElement = document.createElement('div');
      typingIndicatorElement.className = 'typing-indicator';
      typingIndicatorElement.innerHTML = '<span></span><span></span><span></span>';
      chatLogs.appendChild(typingIndicatorElement);
      chatLogs.scrollTop = chatLogs.scrollHeight;
    };
   
    const hideTypingIndicator = () => {
      if (typingIndicatorElement && chatLogs) {
        chatLogs.removeChild(typingIndicatorElement);
        typingIndicatorElement = null;
      }
    };

    const addBotMessage = (text) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'chat-message-wrapper bot-wrapper';
      wrapper.innerHTML = `
        <div class="chat-message-avatar">${genieAvatarHtml}</div>
        <div class="chat-message bot-msg">
          <p>${text}</p>
        </div>
      `;
      chatLogs.appendChild(wrapper);
      chatLogs.scrollTop = chatLogs.scrollHeight;
    };

    const addUsrMessage = (text) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'chat-message-wrapper user-wrapper';
      wrapper.innerHTML = `
        <div class="chat-message user-msg">
          <p>${text}</p>
        </div>
      `;
      chatLogs.appendChild(wrapper);
      chatLogs.scrollTop = chatLogs.scrollHeight;
    };

    const renderQuickChips = (chipsList) => {
      const existingChips = chatLogs.querySelectorAll('.chat-chips-container');
      existingChips.forEach(c => c.remove());

      if (chipsList.length === 0) return;

      const chipsContainer = document.createElement('div');
      chipsContainer.className = 'chat-chips-container';

      chipsList.forEach(data => {
        const btn = document.createElement('button');
        btn.className = 'chat-chip';
        btn.setAttribute('data-chip', data.chip);
        
        const svgIcon = chatbotIcons[data.icon] || '';
        btn.innerHTML = `${svgIcon}<span>${data.label}</span>`;
        
        btn.addEventListener('click', () => {
          handleChipClick(btn);
        });
        chipsContainer.appendChild(btn);
      });

      chatLogs.appendChild(chipsContainer);
      chatLogs.scrollTop = chatLogs.scrollHeight;
    };

    const triggerChatOnboarding = () => {
      if (chatOnboarded) return;
      chatOnboarded = true;

      // Clear the container
      chatLogs.innerHTML = '';

      showTypingIndicator();

      setTimeout(() => {
        hideTypingIndicator();
        addBotMessage("Hello! I am <strong>Support Genie</strong>, your virtual assistant. How can I help you today?");
        
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          addBotMessage("Select a quick topic below or type your question:");
          
          renderQuickChips([
            { label: "CPI & Feasibility Calculator", icon: "cpi", chip: "pricing" },
            { label: "Survey Sampling & Panels", icon: "globe", chip: "sampling" },
            { label: "Research Project Support", icon: "support", chip: "research-support" },
            { label: "Request a Custom Quote", icon: "quote", chip: "quote" },
            { label: "Enterprise Automation Add-On", icon: "workflow", chip: "automation-addon" }
          ]);
        }, 1200);
      }, 1000);
    };

    // Proactive Welcome Bubble
    const welcomeBubble = document.getElementById('genie-welcome-bubble');
    const welcomeClose = document.getElementById('welcome-bubble-close');

    if (welcomeBubble && welcomeClose) {
      setTimeout(() => {
        const hasClosed = sessionStorage.getItem('genie_welcome_closed') === 'true';
        const isChatActive = genieBox.classList.contains('active');
        if (!hasClosed && !isChatActive) {
          welcomeBubble.classList.add('active');
        }
      }, 4000);

      welcomeClose.addEventListener('click', (e) => {
        e.stopPropagation();
        welcomeBubble.classList.remove('active');
        sessionStorage.setItem('genie_welcome_closed', 'true');
      });

      welcomeBubble.addEventListener('click', (e) => {
        welcomeBubble.classList.remove('active');
        sessionStorage.setItem('genie_welcome_closed', 'true');
        genieBox.classList.add('active');
        if (genieTrigger) genieTrigger.classList.add('active');
        triggerChatOnboarding();
      });
    }

    genieTrigger.addEventListener('click', () => {
      if (welcomeBubble) welcomeBubble.classList.remove('active');
      sessionStorage.setItem('genie_welcome_closed', 'true');
      
      const isOpening = !genieBox.classList.contains('active');
      genieBox.classList.toggle('active');
      genieTrigger.classList.toggle('active');
      if (isOpening) {
        triggerChatOnboarding();
      }
    });

    genieClose.addEventListener('click', () => {
      genieBox.classList.remove('active');
      if (genieTrigger) genieTrigger.classList.remove('active');
    });

    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;

        addUsrMessage(msg);
        chatInput.value = '';

        // Save lead to Database/LocalStorage
        try {
          const lead = {
            id: 'lead_' + Date.now(),
            timestamp: Date.now(),
            date: new Date().toLocaleString(),
            name: 'Visitor (Solutions Chat)',
            email: 'N/A',
            company: 'N/A',
            phone: 'N/A',
            cpi: 'N/A',
            budget: 'N/A',
            message: msg,
            source: 'Support Genie (Solutions Subpage)'
          };
          if (rcDbMode === "firebase" && rcDb) {
            rcDb.collection("leads").doc(lead.id).set(lead)
              .then(() => console.log("Solution chat lead saved to Firestore:", lead.id))
              .catch(err => console.error("Firestore error saving lead:", err));
          } else {
            const leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
            leads.unshift(lead);
            localStorage.setItem('rc_leads', JSON.stringify(leads));
          }
          console.log("Solution chat lead logged successfully:", lead);
        } catch (err) {
          console.error("Error saving solution chat lead:", err);
        }

        showTypingIndicator();

        // Standard auto response
        setTimeout(() => {
          hideTypingIndicator();
          addBotMessage("Thank you! Your details have been submitted successfully. To speed up your onboarding, select a convenient time below to schedule your alignment call directly:");
          renderQuickChips([
            { label: "Schedule Call Directly", icon: "calendar", chip: "trigger-calendly-link" },
            { label: "Main Menu", icon: "back", chip: "go-main" }
          ]);
        }, 1200);
      });
    }

    // Handle Quick Reply chips
    const handleChipClick = (chip) => {
      const spanEl = chip.querySelector('span');
      const text = spanEl ? spanEl.textContent.trim() : chip.textContent.trim();
      addUsrMessage(text);
      
      showTypingIndicator();
 
      setTimeout(() => {
        hideTypingIndicator();
        const chipType = chip.getAttribute('data-chip');
        if (chipType === 'pricing') {
          addBotMessage("To estimate pricing in real-time, click 'Launch Audience Estimator' at the bottom of the page or navigate to our homepage CPI calculator.");
          renderQuickChips([
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'sampling') {
          addBotMessage("We deliver high-fidelity survey responses from 2M+ respondents globally across B2B, Healthcare, and Consumer panels.");
          renderQuickChips([
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'research-support') {
          addBotMessage("You’ve reached Research Project Support. I can help with survey design, sampling methodology, translations, and data security & fraud prevention best practices. What do you need help with today?");
          renderQuickChips([
            { label: "Survey / Questionnaire Design", icon: "support", chip: "rs-design" },
            { label: "Feasibility & Targeting Advice", icon: "cpi", chip: "rs-feasibility" },
            { label: "Translations & Localisation", icon: "globe", chip: "rs-translations" },
            { label: "Data Security & Fraud Prevention", icon: "erp", chip: "rs-security" },
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'rs-design') {
          addBotMessage("Our research consultants help you optimize your questionnaires for engagement, length of interview (LOI), and device responsiveness to ensure maximum completion rates and clean data.");
          renderQuickChips([
            { label: "Request a Custom Quote", icon: "quote", chip: "quote" },
            { label: "Back to Support Menu", icon: "back", chip: "research-support" },
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'rs-feasibility') {
          addBotMessage("We leverage detailed profiling metadata across 2M+ respondents to calculate feasibility, target low-incidence populations, and model accurate pricing.");
          renderQuickChips([
            { label: "Request a Custom Quote", icon: "quote", chip: "quote" },
            { label: "Back to Support Menu", icon: "back", chip: "research-support" },
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'rs-translations') {
          addBotMessage("We offer native professional translation and localization services for multi-country studies to ensure linguistic accuracy and cultural relevance.");
          renderQuickChips([
            { label: "Request a Custom Quote", icon: "quote", chip: "quote" },
            { label: "Back to Support Menu", icon: "back", chip: "research-support" },
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'rs-security') {
          addBotMessage("Our platform features real-time fraud mitigation including device fingerprinting, VPN checks, honeypots, and speeder controls to guarantee data integrity.");
          renderQuickChips([
            { label: "Request a Custom Quote", icon: "quote", chip: "quote" },
            { label: "Back to Support Menu", icon: "back", chip: "research-support" },
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'automation-addon') {
          addBotMessage("We offer custom integration and automation add-ons for enterprise research teams to streamline survey pipelines, sync research databases, and automate supporting workflows. Which area would you like to explore?");
          renderQuickChips([
            { label: "Workflow Automation Hub", icon: "workflow", chip: "workflow" },
            { label: "ERP & Database Integrations", icon: "erp", chip: "integrations" },
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'workflow') {
          addBotMessage("Our Enterprise Workflow Hub routes HR, Billing, BI Reports, and performance coaching models. Select 'Enterprise Workflow Hub' from our solutions menu to see the architecture.");
          renderQuickChips([
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'integrations') {
          addBotMessage("We connect custom pipelines directly to central ERP databases (zero downtime parallel sync). Contact our bidding team to request a schema audit.");
          renderQuickChips([
            { label: "Return to Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'quote') {
          addBotMessage("We would love to build a custom solution blueprint and sandbox demo for you! Please type your **Full Name, Work Email, and project brief** below and send it. Once submitted, you'll be able to book a call directly on our calendar.");
          renderQuickChips([]);
        } else if (chipType === 'trigger-calendly-link') {
          addBotMessage("Great choice! Booking a video call helps us align on parameters and demonstrate our system capabilities. Click the link below to select a time:");
          addBotMessage(`📅 <strong><a href="${rcCalendlyUrl}" target="_blank" style="color: var(--turquoise-accent); text-decoration: underline;">Schedule Call on Calendly</a></strong>`);
          renderQuickChips([
            { label: "Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'go-main') {
          addBotMessage("What general area would you like to inquire about?");
          renderQuickChips([
            { label: "CPI & Feasibility Calculator", icon: "cpi", chip: "pricing" },
            { label: "Survey Sampling & Panels", icon: "globe", chip: "sampling" },
            { label: "Research Project Support", icon: "support", chip: "research-support" },
            { label: "Request a Custom Quote", icon: "quote", chip: "quote" },
            { label: "Enterprise Automation Add-On", icon: "workflow", chip: "automation-addon" }
          ]);
        } else {
          addBotMessage("Please submit your details via our Contact form on the homepage and our sales team will email a custom platform integration review.");
        }
      }, 1200);
    };

    // Attach to any existing hardcoded chips if they are clicked before onboarding resets container
    document.querySelectorAll('.chat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        handleChipClick(chip);
      });
    });
  }

  loadFooterSettings();

  function loadFooterSettings() {
    const footerDesc = document.getElementById("footer-desc");
    const footerPhone = document.getElementById("footer-phone");
    const footerEmails = document.getElementById("footer-emails");
    const footerAddress = document.getElementById("footer-address");

    function escapeHtml(str) {
      if (!str) return "";
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

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
        if (data.emailInfo) emailsHtml += `<a href="mailto:${escapeHtml(data.emailInfo)}">${escapeHtml(data.emailInfo)}</a><br>`;
        if (data.emailBidding) emailsHtml += `<a href="mailto:${escapeHtml(data.emailBidding)}">${escapeHtml(data.emailBidding)}</a>`;
        footerEmails.innerHTML = emailsHtml;
      }
      if (footerAddress && data.address) {
        footerAddress.innerHTML = escapeHtml(data.address).replace(/\n/g, "<br>");
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
