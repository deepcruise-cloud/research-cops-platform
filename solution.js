// Research COPS - Solutions Detail Page Controller
// Renders dynamic technical summaries and custom interactive SVG simulations for all 9 solutions.

const SOLUTION_DATA = {
  management: {
    badge: "DI Research Core Engine",
    title: "DI Research Core Engine",
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
          <div style="width: 100%; height: 100%; display: flex; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 6px;">
            <!-- Left Sidebar Menu -->
            <div style="width: 125px; background: rgba(0,0,0,0.5); border-right: 1px solid rgba(4,203,194,0.15); display: flex; flex-direction: column; padding: 10px 6px; box-sizing: border-box; flex-shrink: 0; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 12px; padding: 0 4px;">
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #04cbc2; box-shadow: 0 0 5px #04cbc2;"></span>
                  <span style="color: #ffffff; font-size: 9px; font-weight: 700; letter-spacing: 0.5px;">DI ENGINE</span>
                </div>
                <!-- Vertical Menu Items -->
                <div style="display: flex; flex-direction: column; gap: 3px;" id="di-menu-list">
                  <button class="di-menu-btn" data-step="0" style="background: rgba(4,203,194,0.1); border: 1px solid rgba(4,203,194,0.35); color: #ffffff; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%;">1. Target Aud</button>
                  <button class="di-menu-btn" data-step="1" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%;">2. Feasibility</button>
                  <button class="di-menu-btn" data-step="2" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%;">3. Survey Design</button>
                  <button class="di-menu-btn" data-step="3" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%;">4. Translate</button>
                  <button class="di-menu-btn" data-step="4" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%;">5. Router Links</button>
                  <button class="di-menu-btn" data-step="5" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%;">6. Live Field</button>
                  <button class="di-menu-btn" data-step="6" style="background: transparent; border: 1px solid transparent; color: #94a3b8; font-family: inherit; font-size: 8.5px; text-align: left; padding: 5px 6px; border-radius: 3px; cursor: pointer; outline: none; transition: all 0.2s; width: 100%;">7. Analytics</button>
                </div>
              </div>
              <!-- Status bar -->
              <div style="font-family: monospace; font-size: 7.5px; color: #64748b; padding: 0 4px;" id="di-engine-status">CYCLE: STG 1</div>
            </div>
            <!-- Content Viewport -->
            <div style="flex-grow: 1; display: flex; flex-direction: column; padding: 10px; box-sizing: border-box; overflow: hidden;" id="di-viewport">
              <!-- Content loaded via init() -->
            </div>
          </div>
        `,
        init: () => {
          const menuBtns = document.querySelectorAll('.di-menu-btn');
          const viewport = document.getElementById('di-viewport');
          const statusEl = document.getElementById('di-engine-status');
          if (!menuBtns.length || !viewport || !statusEl) return;

          const screens = [
            {
              title: "1. TARGET AUDIENCE IDENTIFICATION",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <div>
                    <div style="font-size: 9px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Target Criteria</div>
                    <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-bottom: 6px;">B2B Decision Makers</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                      <span style="font-size: 8px; background: rgba(4,203,194,0.1); border: 1px solid rgba(4,203,194,0.2); padding: 2px 6px; border-radius: 10px; color: #ffffff;">IT Leaders (VP+)</span>
                      <span style="font-size: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 10px; color: #94a3b8;">SaaS Sectors</span>
                      <span style="font-size: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 10px; color: #94a3b8;">US / UK / EU</span>
                      <span style="font-size: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 10px; color: #94a3b8;">N = 500 Target</span>
                    </div>
                  </div>
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; box-sizing: border-box;">
                    <div style="font-size: 8px; color: #94a3b8; text-transform: uppercase; margin-bottom: 3px;">Audience Matching Engine</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="flex-grow: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden;">
                        <div id="scr1-bar" style="width: 0%; height: 100%; background: #04cbc2; transition: width 1s ease;"></div>
                      </div>
                      <span style="font-size: 9px; color: #04cbc2; font-family: monospace; font-weight: bold;" id="scr1-pct">0%</span>
                    </div>
                  </div>
                </div>
              `,
              init: () => {
                const bar = document.getElementById('scr1-bar');
                const pct = document.getElementById('scr1-pct');
                if (bar && pct) {
                  setTimeout(() => {
                    bar.style.width = '100%';
                    pct.textContent = '100%';
                  }, 100);
                }
              }
            },
            {
              title: "2. FEASIBILITY METER",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding-bottom: 2px;">
                  <div>
                    <div style="font-size: 9px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Feasibility Score</div>
                    <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-bottom: 6px;">Launch Scoping Diagnostics</div>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-around; margin: 6px 0;">
                    <svg width="50" height="50" viewBox="0 0 36 36" style="transform: rotate(-90deg); flex-shrink: 0;">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4" />
                      <circle id="scr2-gauge" cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="100, 100" stroke-dashoffset="100" style="transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1);" />
                    </svg>
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-size: 16px; font-weight: bold; color: #ffffff; font-family: monospace;" id="scr2-val">0%</span>
                      <span style="font-size: 8px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Scoping OK</span>
                    </div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; box-sizing: border-box;">
                    <div style="background: rgba(255,255,255,0.02); padding: 5px; border-radius: 4px; text-align: center;">
                      <div style="font-size: 7.5px; color: #94a3b8;">Est. CPI</div>
                      <div style="font-size: 11px; font-weight: bold; color: #04cbc2; margin-top: 1px;">$8.50</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 5px; border-radius: 4px; text-align: center;">
                      <div style="font-size: 7.5px; color: #94a3b8;">Est. Field Time</div>
                      <div style="font-size: 11px; font-weight: bold; color: #04cbc2; margin-top: 1px;">3 Days</div>
                    </div>
                  </div>
                </div>
              `,
              init: () => {
                const gauge = document.getElementById('scr2-gauge');
                const val = document.getElementById('scr2-val');
                if (gauge && val) {
                  setTimeout(() => {
                    gauge.setAttribute('stroke-dashoffset', '12'); // 88%
                    let count = 0;
                    const interval = setInterval(() => {
                      count += 2;
                      if (count >= 88) {
                        count = 88;
                        clearInterval(interval);
                      }
                      val.textContent = count + '%';
                    }, 20);
                  }, 100);
                }
              }
            },
            {
              title: "3. AI PROMPT SURVEY BUILDER",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
                  <div>
                    <div style="font-size: 9px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">AI Prompts Survey Design</div>
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(4,203,194,0.15); padding: 6px 10px; border-radius: 4px; font-family: monospace; font-size: 8.5px; color: #04cbc2; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="scr3-prompt">> </div>
                  </div>
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; opacity: 0; transform: translateY(8px); transition: all 0.5s ease; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box;" id="scr3-q">
                    <div style="font-size: 8px; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px;">Generated Logic Block</div>
                    <div style="font-size: 10.5px; color: #ffffff; font-weight: bold; line-height: 1.2; margin-bottom: 4px;">Q1: How do you rate reporting latency?</div>
                    <div style="display: flex; flex-direction: column; gap: 3px;">
                      <div style="font-size: 8px; background: rgba(255,255,255,0.03); padding: 3px 5px; border-radius: 3px; color: #e2e8f0; border: 1px solid rgba(255,255,255,0.04);">Option: Extremely Latent to Real-Time</div>
                    </div>
                  </div>
                </div>
              `,
              init: () => {
                const input = document.getElementById('scr3-prompt');
                const qcard = document.getElementById('scr3-q');
                if (input && qcard) {
                  const query = "Generate B2B tech survey on BI latency...";
                  let cIdx = 0;
                  const type = () => {
                    if (cIdx <= query.length) {
                      input.textContent = "> " + query.substring(0, cIdx) + "_";
                      cIdx++;
                      setTimeout(type, 25);
                    } else {
                      input.textContent = "> " + query;
                      qcard.style.opacity = '1';
                      qcard.style.transform = 'translateY(0)';
                    }
                  };
                  setTimeout(type, 100);
                }
              }
            },
            {
              title: "4. MULTI-LANGUAGE TRANSLATOR",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
                  <div>
                    <div style="font-size: 9px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Survey Localization</div>
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 5px 8px; border-radius: 4px; font-size: 8.5px; color: #94a3b8; line-height: 1.2; margin-bottom: 5px;">
                      <strong>EN Source:</strong> "How do you rate reporting latency?"
                    </div>
                  </div>
                  <div style="background: rgba(4,203,194,0.03); border: 1px solid rgba(4,203,194,0.15); padding: 8px; border-radius: 4px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                    <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold;" id="scr4-label">DE (German)</div>
                    <div style="font-size: 10px; color: #ffffff; font-style: italic; line-height: 1.3; margin: 3px 0;" id="scr4-text">"Wie bewerten Sie die Berichtslatenz?"</div>
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 8px; font-family: monospace; color: #10b981; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 3px; box-sizing: border-box;">
                      <span>Routing Index match</span>
                      <span style="color: #64748b;" id="scr4-status">Synced</span>
                    </div>
                  </div>
                </div>
              `,
              init: () => {
                const label = document.getElementById('scr4-label');
                const text = document.getElementById('scr4-text');
                const status = document.getElementById('scr4-status');
                if (!label || !text || !status) return;

                const translations = [
                  { l: "DE (German)", t: '"Wie bewerten Sie die Berichtslatenz?"' },
                  { l: "ES (Spanish)", t: '"¿Cómo califica la latencia de informes?"' },
                  { l: "JA (Japanese)", t: '"レポート遅延をどのように評価しますか？"' }
                ];
                let idx = 0;
                const cycle = () => {
                  idx = (idx + 1) % translations.length;
                  status.textContent = "Translating...";
                  status.style.color = "#f59e0b";
                  text.style.opacity = '0.3';
                  setTimeout(() => {
                    if (label && text && status) {
                      label.textContent = translations[idx].l;
                      text.textContent = translations[idx].t;
                      text.style.opacity = '1';
                      status.textContent = "✓ Synced";
                      status.style.color = "#10b981";
                    }
                  }, 600);
                };
                const interval = setInterval(cycle, 2000);
                return () => clearInterval(interval);
              }
            },
            {
              title: "5. SURVEY DISPATCH LINKS",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
                  <div>
                    <div style="font-size: 9px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Deploy Routing Channels</div>
                    <div style="font-size: 10px; color: #94a3b8; line-height: 1.2; margin-bottom: 6px;">Secure link distribution mapped to panel router paths.</div>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px; box-sizing: border-box;">
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 5px 6px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; gap: 4px;">
                      <span style="font-family: monospace; font-size: 7.5px; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1;">Link: OpinionGenie Panel</span>
                      <button id="scr5-c1" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; font-size: 7.5px; padding: 2px 4px; border-radius: 3px; cursor: pointer; outline: none;">Copy</button>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 5px 6px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; gap: 4px;">
                      <span style="font-family: monospace; font-size: 7.5px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1;">Link: External Suppliers</span>
                      <button id="scr5-c2" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 7.5px; padding: 2px 4px; border-radius: 3px; cursor: pointer; outline: none;">Copy</button>
                    </div>
                  </div>
                  <div style="font-family: monospace; font-size: 8px; color: #10b981; text-align: center; margin-top: 4px; flex-shrink: 0;">
                    ✓ Dispatch links verified & secure
                  </div>
                </div>
              `,
              init: () => {
                const c1 = document.getElementById('scr5-c1');
                const c2 = document.getElementById('scr5-c2');
                if (c1) {
                  c1.addEventListener('click', (e) => {
                    e.stopPropagation();
                    c1.textContent = "Copied!";
                    c1.style.background = "#10b981";
                    c1.style.borderColor = "#10b981";
                    setTimeout(() => {
                      c1.textContent = "Copy";
                      c1.style.background = "rgba(4,203,194,0.15)";
                      c1.style.borderColor = "#04cbc2";
                    }, 1200);
                  });
                }
                if (c2) {
                  c2.addEventListener('click', (e) => {
                    e.stopPropagation();
                    c2.textContent = "Copied!";
                    c2.style.background = "#10b981";
                    c2.style.borderColor = "#10b981";
                    setTimeout(() => {
                      c2.textContent = "Copy";
                      c2.style.background = "rgba(255,255,255,0.03)";
                      c2.style.borderColor = "rgba(255,255,255,0.08)";
                    }, 1200);
                  });
                }
              }
            },
            {
              title: "6. REALTIME TELEMETRY FIELDING",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                      <span style="font-size: 9px; color: #04cbc2; font-weight: bold; text-transform: uppercase;">Quota Tracker</span>
                      <span style="font-size: 7.5px; color: #10b981; font-family: monospace; display: flex; align-items: center; gap: 3px;"><span class="live-pulse" style="width: 4px; height: 4px; box-shadow: 0 0 4px #10b981;"></span>Active</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 5px 8px; border-radius: 4px; box-sizing: border-box;">
                      <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8; font-family: monospace; margin-bottom: 2px;">
                        <span>Target US IT Leaders</span>
                        <span id="scr6-completes">142/150</span>
                      </div>
                      <div style="height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden;">
                        <div id="scr6-bar" style="width: 94%; height: 100%; background: #04cbc2; transition: width 0.5s ease;"></div>
                      </div>
                    </div>
                  </div>
                  <!-- Telemetry activity logs -->
                  <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.05); padding: 5px; border-radius: 4px; flex-grow: 1; display: flex; flex-direction: column; gap: 3px; overflow: hidden; font-family: monospace; font-size: 7.5px; box-sizing: border-box; margin-top: 4px;" id="scr6-logs">
                    <div style="color: #64748b;">> Telemetry socket established...</div>
                  </div>
                </div>
              `,
              init: () => {
                const logs = document.getElementById('scr6-logs');
                const comp = document.getElementById('scr6-completes');
                const bar = document.getElementById('scr6-bar');
                if (!logs || !comp || !bar) return;

                let count = 142;
                const target = 150;
                const templates = [
                  { text: "[PASS] Session #2951: Fingerprint verified", col: "#10b981" },
                  { text: "[PASS] Session #2952: Proxy VPN test pass", col: "#10b981" },
                  { text: "[BLOCK] Session #2953: Speeder logic detected", col: "#ef4444" },
                  { text: "[PASS] Session #2954: Demographics match ok", col: "#10b981" },
                  { text: "[BLOCK] Session #2955: VPN proxy reject", col: "#f59e0b" }
                ];
                let idx = 0;
                const runLog = () => {
                  const item = templates[idx % templates.length];
                  idx++;
                  if (item.text.includes("[PASS]") && count < target) {
                    count++;
                    comp.textContent = count + "/" + target;
                    bar.style.width = ((count / target) * 100) + "%";
                  }
                  const div = document.createElement('div');
                  div.style.color = item.col;
                  div.textContent = "> " + item.text;
                  div.style.opacity = '0';
                  div.style.transition = 'opacity 0.2s';
                  logs.appendChild(div);
                  setTimeout(() => div.style.opacity = '1', 50);
                  if (logs.children.length > 5) {
                    logs.removeChild(logs.children[1]);
                  }
                };
                const interval = setInterval(runLog, 1200);
                return () => clearInterval(interval);
              }
            },
            {
              title: "7. REPORTING & BI ANALYTICS",
              html: `
                <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
                  <div>
                    <div style="font-size: 9px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Report Deliverables</div>
                    <div style="font-size: 11px; color: #ffffff; font-weight: bold; line-height: 1.2; margin-bottom: 4px;">Dynamic Graphs & Data Compiles</div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 6px; flex-grow: 1; overflow: hidden; margin-bottom: 4px; box-sizing: border-box;">
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 5px; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between;">
                      <span style="font-size: 7px; color: #94a3b8; text-transform: uppercase;">Completes curve</span>
                      <div style="height: 30px; width: 100%;">
                        <svg width="100%" height="100%" viewBox="0 0 100 30" style="overflow: visible;">
                          <path id="scr7-line" d="M0,25 Q20,10 40,20 T80,5 T100,15" fill="none" stroke="#04cbc2" stroke-width="2.5" />
                        </svg>
                      </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 5px; border-radius: 4px; display: flex; align-items: flex-end; justify-content: space-around;">
                      <div id="scr7-b1" style="width: 7px; height: 30%; background: #04cbc2; border-radius: 1px; transition: height 1s ease;"></div>
                      <div id="scr7-b2" style="width: 7px; height: 60%; background: #04cbc2; border-radius: 1px; transition: height 1s ease;"></div>
                      <div id="scr7-b3" style="width: 7px; height: 85%; background: #10b981; border-radius: 1px; transition: height 1s ease;"></div>
                    </div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                    <button style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; font-size: 7.5px; padding: 4px 0; border-radius: 3px; font-family: inherit; font-weight: bold; cursor: pointer; outline: none; border-style: solid;">Export SPSS</button>
                    <button style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 7.5px; padding: 4px 0; border-radius: 3px; font-family: inherit; cursor: pointer; outline: none; border-style: solid;">Download PPTX</button>
                  </div>
                </div>
              `,
              init: () => {
                const line = document.getElementById('scr7-line');
                const b1 = document.getElementById('scr7-b1');
                const b2 = document.getElementById('scr7-b2');
                const b3 = document.getElementById('scr7-b3');
                if (line) {
                  line.style.strokeDasharray = "150";
                  line.style.strokeDashoffset = "150";
                  setTimeout(() => {
                    line.style.transition = "stroke-dashoffset 1.5s ease-in-out";
                    line.style.strokeDashoffset = "0";
                  }, 100);
                }
                const update = () => {
                  if (b1 && b2 && b3) {
                    b1.style.height = (Math.floor(Math.random() * 30) + 20) + "%";
                    b2.style.height = (Math.floor(Math.random() * 30) + 45) + "%";
                    b3.style.height = (Math.floor(Math.random() * 20) + 75) + "%";
                  }
                };
                setTimeout(update, 100);
                const interval = setInterval(update, 1800);
                return () => clearInterval(interval);
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
            statusEl.textContent = isPaused ? 'PAUSED' : 'AUTO STG: ' + (stepIdx + 1) + '/7';

            viewport.innerHTML = `
              <div style="flex-grow: 1; display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
                <div style="font-size: 10.5px; font-weight: bold; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px; margin-bottom: 8px; flex-shrink: 0; letter-spacing: 0.5px; text-transform: uppercase;">
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
            }, 4500);
          };

          loadStep(currentStep);
          startCycle();

          return () => {
            clearInterval(cycleTimer);
            if (activeSubCleanup) activeSubCleanup();
          };
        }
      };
    }
  },
  sampling: {
    badge: "Audience & Reach",
    title: "DI Response Engine",
    desc: "Access over 2 million pre-profiled B2B professionals, healthcare specialists, and consumer audiences across 31 countries. Sourced through our verified partner networks and our proprietary panel Opinion Genie to deliver high-fidelity target cohorts.",
    capabilities: [
      { title: "Double Opt-In Panels", text: "Respondents pass through multi-tier verification before entering the active sample pool." },
      { title: "Dynamic Sampling Router", text: "Automated respondent allocation matching demographics to active targets." },
      { title: "B2B & Enterprise Segments", text: "Target decision makers by industry vertical, company size, and executive seniority." },
      { title: "Healthcare & HCP Access", text: "Reach verified physicians, nurses, specialists, and patient cohorts." }
    ],
    architecture: "Integrates with Opinion Genie and external panel registries via secure, authenticated OAuth 2.0 endpoints. Employs real-time routing algorithms that calculate feasibility profiles on the fly.",
    caption: "DI Response Engine Interface",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 6px;">
            <!-- Left side: Router Stats console -->
            <div style="padding: 12px; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; background: rgba(0,0,0,0.2); box-sizing: border-box;">
              <div>
                <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">OpinionGenie Router</div>
                <div style="font-size: 13px; font-weight: bold; color: #ffffff; line-height: 1.2; margin: 4px 0;">Live Target Routing</div>
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 6px; border-radius: 4px; margin-top: 4px;">
                  <div style="display: flex; justify-content: space-between; font-size: 7.5px; color: #94a3b8; font-family: monospace;">
                    <span>Incidence Rate</span>
                    <span style="color: #04cbc2;">34%</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 7.5px; color: #94a3b8; font-family: monospace; margin-top: 2px;">
                    <span>Dropout Ratio</span>
                    <span style="color: #ef4444;">1.8%</span>
                  </div>
                </div>
              </div>
              <!-- Completed counter progress ring -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="46" height="46" viewBox="0 0 36 36" style="transform: rotate(-90deg); flex-shrink: 0;">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="3.5" />
                  <circle id="router-gauge" cx="18" cy="18" r="15.915" fill="none" stroke="#04cbc2" stroke-width="3.5" stroke-dasharray="100, 100" stroke-dashoffset="100" style="transition: stroke-dashoffset 0.1s linear;" />
                </svg>
                <div>
                  <div style="font-size: 8px; color: #94a3b8;">Completes</div>
                  <div style="font-size: 15px; font-weight: bold; color: #ffffff; font-family: monospace;" id="router-count">0</div>
                </div>
              </div>
            </div>
            <!-- Right side: Geographic Map Coordinates -->
            <div style="position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; box-sizing: border-box;">
              <svg width="100%" height="100%" viewBox="0 0 200 280" style="position: absolute; top: 0; left: 0;">
                <style>
                  .node-pt { fill: #04cbc2; }
                  .node-pulsing { animation: mapNodePulse 2.5s infinite; }
                  @keyframes mapNodePulse {
                    0% { r: 5; opacity: 0.6; }
                    50% { r: 12; opacity: 0.15; }
                    100% { r: 5; opacity: 0.6; }
                  }
                </style>
                <!-- Dotted map elements -->
                <circle cx="30" cy="70" r="1.5" fill="rgba(255,255,255,0.06)" />
                <circle cx="80" cy="50" r="1.5" fill="rgba(255,255,255,0.06)" />
                <circle cx="140" cy="80" r="1.5" fill="rgba(255,255,255,0.06)" />
                <circle cx="60" cy="160" r="1.5" fill="rgba(255,255,255,0.06)" />
                <circle cx="120" cy="190" r="1.5" fill="rgba(255,255,255,0.06)" />
                
                <!-- Glowing Nodes -->
                <circle cx="80" cy="50" r="10" fill="rgba(4,203,194,0.15)" class="node-pulsing" />
                <circle cx="80" cy="50" r="3.5" class="node-pt" />
                <circle cx="140" cy="80" r="10" fill="rgba(4,203,194,0.15)" class="node-pulsing" />
                <circle cx="140" cy="80" r="3.5" class="node-pt" />
                <circle cx="60" cy="160" r="10" fill="rgba(4,203,194,0.15)" class="node-pulsing" />
                <circle cx="60" cy="160" r="3.5" class="node-pt" />
                
                <!-- Central Core Routing Node -->
                <circle cx="100" cy="120" r="8" fill="#04cbc2" style="filter: drop-shadow(0 0 5px #04cbc2);" />
                <line x1="80" y1="50" x2="100" y2="120" stroke="rgba(4,203,194,0.35)" stroke-dasharray="2 2" />
                <line x1="140" y1="80" x2="100" y2="120" stroke="rgba(4,203,194,0.35)" stroke-dasharray="2 2" />
                <line x1="60" y1="160" x2="100" y2="120" stroke="rgba(4,203,194,0.35)" stroke-dasharray="2 2" />
              </svg>
              <!-- Small scrolling pipeline logs inside map -->
              <div style="position: absolute; bottom: 8px; width: 90%; background: rgba(0,0,0,0.65); border: 1px solid rgba(255,255,255,0.05); padding: 4px 6px; border-radius: 4px; font-family: monospace; font-size: 7.5px; color: #10b981; text-align: left; box-sizing: border-box; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" id="router-logs">> Routing initialized...</div>
            </div>
          </div>
        `,
        init: () => {
          const countEl = document.getElementById('router-count');
          const gauge = document.getElementById('router-gauge');
          const logs = document.getElementById('router-logs');
          if (!countEl || !gauge || !logs) return;

          let count = 0;
          const target = 500;
          const routeLogs = [
            "> [ROUTE] IP Match: US target linked",
            "> [ROUTE] OpinionGenie panel matched",
            "> [VERIFY] Digital footprint checklist ok",
            "> [ROUTE] APAC region target matched",
            "> [VERIFY] VPN/Speeder check cleared"
          ];
          let logIdx = 0;

          const timer = setInterval(() => {
            count += Math.floor(Math.random() * 8) + 2;
            if (count >= target) count = target;
            countEl.textContent = count;
            
            const pct = (count / target) * 100;
            gauge.setAttribute('stroke-dashoffset', 100 - pct);

            if (Math.random() < 0.35) {
              logs.textContent = routeLogs[logIdx % routeLogs.length];
              logIdx++;
            }

            if (count === target) {
              setTimeout(() => {
                count = 0;
                countEl.textContent = '0';
                gauge.setAttribute('stroke-dashoffset', 100);
              }, 1500);
            }
          }, 120);

          return () => clearInterval(timer);
        }
      };
    }
  },
  development: {
    badge: "Research Design",
    title: "DI - Survey Design Engine",
    desc: "Our design methodology tools allow research teams to build responsive question models, set up branching logic flows, configure skip constraints, and preview mobile layouts in real-time.",
    capabilities: [
      { title: "Visual Question Builder", text: "Drag-and-drop elements to format single choice, matrix tables, grids, and numeric answers." },
      { title: "Branching Logic Flows", text: "Visual rule designer to map skip logic, routing paths, and conditional loops based on responses." },
      { title: "Device-Responsive Layouts", text: "Automatic layout formatting optimizing rendering across desktop, tablet, and mobile browsers." },
      { title: "Interactive Media Stimuli", text: "Securely host and track respondent engagement with video concepts, audio segments, and image carousels." }
    ],
    architecture: "Compiles JSON question schemas compatible with all major rendering engines (Decipher, Qualtrics, Confirmit) via automated mapping APIs.",
    caption: "DI Survey Design Engine Workspace",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: grid; grid-template-columns: 1.1fr 1fr; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 6px;">
            <!-- Left side: Visual Builder cards stack -->
            <div style="padding: 10px; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
              <div>
                <div style="font-size: 8.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 6px;">Design Panel</div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="background: rgba(4,203,194,0.06); border: 1px solid rgba(4,203,194,0.2); padding: 6px 8px; border-radius: 4px; font-size: 10px; color: #ffffff;">
                    <strong>Q1: Multiple Choice</strong>
                    <div style="font-size: 8px; color: #04cbc2; margin-top: 1px;">Incidence profiling</div>
                  </div>
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 6px 8px; border-radius: 4px; font-size: 10px; color: #94a3b8;">
                    <strong>Q2: Grid Matrix</strong>
                    <div style="font-size: 8px; color: rgba(255,255,255,0.2); margin-top: 1px;">Features scoring</div>
                  </div>
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 6px 8px; border-radius: 4px; font-size: 10px; color: #94a3b8;">
                    <strong>Skip Logic #1</strong>
                    <div style="font-size: 8px; color: #ef4444; margin-top: 1px;">If Q1 &lt; 3 ➔ Skip Q3</div>
                  </div>
                </div>
              </div>
              <div style="font-family: monospace; font-size: 8px; color: #64748b;">[SCHEMA: OK | 100% COMPILED]</div>
            </div>
            <!-- Right side: Device Previews -->
            <div style="display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; box-sizing: border-box; padding: 6px;">
              <!-- Simulated smartphone frame -->
              <div style="width: 135px; height: 250px; border-radius: 16px; border: 4px solid #1e293b; background: #000000; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 8px 20px rgba(0,0,0,0.6); position: relative; box-sizing: border-box;">
                <!-- Notch -->
                <div style="width: 44px; height: 10px; background: #1e293b; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; align-self: center; flex-shrink: 0;"></div>
                <!-- Device Viewport Screen -->
                <div id="dev-screen" style="flex-grow: 1; padding: 10px 8px; display: flex; flex-direction: column; justify-content: space-between; background: #050a0a; overflow: hidden; box-sizing: border-box; transition: background 0.3s;">
                  <div>
                    <div style="font-size: 7.5px; color: #04cbc2; text-transform: uppercase; font-family: monospace;">Question 1/25</div>
                    <div style="font-size: 9.5px; color: #ffffff; font-weight: bold; margin-top: 4px; line-height: 1.2;" id="dev-q-txt">Do you make IT decisions?</div>
                    <!-- Choices list -->
                    <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 8px;" id="dev-opts">
                      <button id="opt-btn-1" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #94a3b8; padding: 5px; border-radius: 3px; font-size: 7.5px; text-align: left; cursor: pointer; outline: none; width: 100%;">Yes, primary decision maker</button>
                      <button id="opt-btn-2" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #94a3b8; padding: 5px; border-radius: 3px; font-size: 7.5px; text-align: left; cursor: pointer; outline: none; width: 100%;">Yes, secondary influence</button>
                      <button id="opt-btn-3" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #94a3b8; padding: 5px; border-radius: 3px; font-size: 7.5px; text-align: left; cursor: pointer; outline: none; width: 100%;">No involvement</button>
                    </div>
                  </div>
                  <button id="dev-submit" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; padding: 5px; border-radius: 3px; font-size: 8px; font-weight: bold; width: 100%; cursor: pointer; outline: none; border-style: solid;">Submit response</button>
                </div>
              </div>
              <!-- Floating cursor animation -->
              <div id="dev-cursor" style="position: absolute; width: 12px; height: 12px; background: rgba(4,203,194,0.8); border: 2px solid #ffffff; border-radius: 50%; top: 180px; left: 110px; pointer-events: none; transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94); box-shadow: 0 0 6px rgba(4,203,194,0.8); z-index: 99;"></div>
            </div>
          </div>
        `,
        init: () => {
          const cursor = document.getElementById('dev-cursor');
          const opt1 = document.getElementById('opt-btn-1');
          const submit = document.getElementById('dev-submit');
          const screen = document.getElementById('dev-screen');
          const qText = document.getElementById('dev-q-txt');
          const opts = document.getElementById('dev-opts');
          if (!cursor || !opt1 || !submit || !screen || !qText || !opts) return;

          let step = 0;
          const runSurveyAnimation = () => {
            if (step === 0) {
              screen.style.background = '#050a0a';
              qText.textContent = 'Do you make IT decisions?';
              opts.style.display = 'flex';
              submit.style.display = 'block';
              submit.textContent = 'Submit response';
              submit.style.background = 'rgba(4,203,194,0.15)';
              submit.style.borderColor = '#04cbc2';
              opt1.style.background = 'rgba(255,255,255,0.03)';
              opt1.style.borderColor = 'rgba(255,255,255,0.06)';
              opt1.style.color = '#94a3b8';

              cursor.style.top = '130px';
              cursor.style.left = '100px';
              step = 1;
            } else if (step === 1) {
              opt1.style.background = 'rgba(4,203,194,0.1)';
              opt1.style.borderColor = '#04cbc2';
              opt1.style.color = '#ffffff';

              cursor.style.top = '210px';
              cursor.style.left = '90px';
              step = 2;
            } else if (step === 2) {
              submit.style.background = '#10b981';
              submit.style.borderColor = '#10b981';
              submit.textContent = '✓ Syncing data...';
              step = 3;
            } else if (step === 3) {
              opts.style.display = 'none';
              submit.style.display = 'none';
              qText.innerHTML = '<div style="text-align: center; padding: 25px 0;"><div style="font-size: 20px; color: #10b981;">✓</div><div style="font-size: 10px; font-weight: bold; margin-top: 8px; color: #ffffff;">Survey Complete</div><div style="font-size: 7.5px; color: #94a3b8; margin-top: 3px;">Completions Synced</div></div>';
              cursor.style.top = '80px';
              cursor.style.left = '140px';
              step = 0;
            }
          };

          runSurveyAnimation();
          const interval = setInterval(runSurveyAnimation, 1800);
          return () => clearInterval(interval);
        }
      };
    }
  },
  programming: {
    badge: "Systems Engineering",
    title: "DI Survey Programming Engine",
    desc: "Implement complex routing schemas, quotas management, custom JavaScript validation widgets, and secure external database callbacks in our cloud IDE environment.",
    capabilities: [
      { title: "Custom Logic Engines", text: "Deploy advanced script rule branching, loops, and show/hide constraints based on logic arrays." },
      { title: "Live Quotas Controller", text: "Auto-routing redirects that close target brackets and update redirect urls on limits exhaustion." },
      { title: "JavaScript Widgets API", text: "Embed secure dynamic elements, calculations models, and media triggers in the questionnaire stream." },
      { title: "API Endpoints Sync", text: "Automated callbacks that post encrypted complete data packets to specified secure APIs endpoints." }
    ],
    architecture: "Compiles logical rulesets into executable serverless functions running on our edge node mesh to ensure zero-latency routing.",
    caption: "DI Survey Programming Engine IDE",
    getVisual: () => {
      return {
        html: `
          <div style="display: grid; grid-template-columns: 100px 1.2fr 1fr; width: 100%; height: 100%; font-family: monospace; font-size: 10px; background: #070f0e; border-radius: 6px; overflow: hidden; position: relative; box-sizing: border-box;">
            <!-- Left sidebar: File explorer list -->
            <div style="border-right: 1px solid rgba(255,255,255,0.05); padding: 10px 6px; background: rgba(0,0,0,0.3); box-sizing: border-box; overflow: hidden;">
              <div style="font-size: 8px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-bottom: 6px;">PROJECT</div>
              <div style="display: flex; flex-direction: column; gap: 4px; color: #94a3b8; font-size: 8.5px;">
                <span style="color: #04cbc2;">● rules.js</span>
                <span>  quotas.config</span>
                <span>  redirects.js</span>
                <span>  sync_hook.py</span>
              </div>
            </div>
            <!-- Center Editor -->
            <div style="border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box;">
              <div style="background: rgba(0,0,0,0.4); padding: 6px 8px; color: #94a3b8; font-size: 8.5px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; box-sizing: border-box; flex-shrink: 0;">
                <span>rules.js</span>
                <span style="color: #04cbc2; font-weight: bold;">EDIT</span>
              </div>
              <pre id="prog-code" style="margin: 0; padding: 10px; color: #04cbc2; line-height: 1.3; overflow: hidden; white-space: pre-wrap; word-break: break-all; flex-grow: 1; box-sizing: border-box;"></pre>
            </div>
            <!-- Right terminal console -->
            <div style="display: flex; flex-direction: column; overflow: hidden; background: rgba(0,0,0,0.5); box-sizing: border-box;">
              <div style="background: rgba(0,0,0,0.4); padding: 6px 8px; color: #94a3b8; font-size: 8.5px; border-bottom: 1px solid rgba(255,255,255,0.05); box-sizing: border-box; flex-shrink: 0;">live_console</div>
              <div id="prog-logs" style="margin: 0; padding: 8px; color: #94a3b8; line-height: 1.4; overflow: hidden; display: flex; flex-direction: column; gap: 4px; flex-grow: 1; box-sizing: border-box;"></div>
            </div>
            <!-- Dynamic Floating compiler validation indicator badge -->
            <div id="prog-badge" style="position: absolute; bottom: 12px; right: 12px; width: 110px; background: rgba(10,25,25,0.85); backdrop-filter: blur(8px); border: 1px solid rgba(4,203,194,0.3); border-radius: 4px; padding: 6px 8px; display: flex; align-items: center; gap: 6px; transform: translateY(40px); opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2); box-sizing: border-box; z-index: 99;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; flex-shrink: 0;"></div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 8px; color: #10b981; font-weight: bold; line-height: 1.1;">COMPILE OK</span>
                <span style="font-size: 7.5px; color: #94a3b8; font-family: monospace;">Edge Deploy OK</span>
              </div>
            </div>
          </div>
        `,
        init: () => {
          const editor = document.getElementById('prog-code');
          const consoleLogs = document.getElementById('prog-logs');
          const badge = document.getElementById('prog-badge');
          if (!editor || !consoleLogs || !badge) return;

          const lines = [
            "// Validate IP proxy",
            "const sync = new SchemaRouter();",
            "sync.on('request', (res) => {",
            "  if (res.isProxy()) {",
            "    return res.reject('PROXY_VPN');",
            "  }",
            "  res.postToS3();",
            "});"
          ];

          const logs = [
            { t: "[OK] Init rules schema", c: "#10b981" },
            { t: "[API] Link server online", c: "#04cbc2" },
            { t: "[PASS] Complete ID #2918", c: "#10b981" },
            { t: "[PASS] Complete ID #2919", c: "#10b981" },
            { t: "[WARN] VPN proxy block #2920", c: "#f59e0b" },
            { t: "[API] Sync completed packets", c: "#04cbc2" }
          ];

          let lIdx = 0;
          let charIdx = 0;
          let logIdx = 0;

          const type = () => {
            if (!editor) return;
            if (lIdx < lines.length) {
              const text = lines[lIdx];
              if (charIdx <= text.length) {
                editor.textContent = lines.slice(0, lIdx).join('\n') + '\n' + text.substring(0, charIdx) + '_';
                charIdx++;
                setTimeout(type, 15);
              } else {
                lIdx++;
                charIdx = 0;
                setTimeout(type, 80);
              }
            } else {
              editor.textContent = lines.join('\n');
              setTimeout(printLog, 300);
            }
          };

          const printLog = () => {
            if (!consoleLogs || !badge) return;
            if (logIdx < logs.length) {
              const item = logs[logIdx];
              const logEl = document.createElement('div');
              logEl.style.color = item.c;
              logEl.textContent = item.t;
              consoleLogs.appendChild(logEl);
              logIdx++;
              setTimeout(printLog, 400);
            } else {
              badge.style.opacity = '1';
              badge.style.transform = 'translateY(0)';
              setTimeout(() => {
                badge.style.opacity = '0';
                badge.style.transform = 'translateY(40px)';
                setTimeout(() => {
                  editor.textContent = '';
                  consoleLogs.innerHTML = '';
                  lIdx = 0;
                  charIdx = 0;
                  logIdx = 0;
                  type();
                }, 500);
              }, 3000);
            }
          };

          type();
          return () => {};
        }
      };
    }
  },
  translations: {
    badge: "Global Localization",
    title: "DI Translation Engine",
    desc: "Translate, review, and synchronize survey templates across 25+ languages. Our localization platform preserves semantic intent, formatting variables, and routing logic integrity.",
    capabilities: [
      { title: "Split-Pane Editor", text: "Dedicated translation sheets showing English source strings side-by-side with target language inputs." },
      { title: "Variables Isolation", text: "Compiler locking that prevents translators from modifying HTML tags, piping variables, and scripting logic." },
      { title: "Contextual Translation", text: "Professional human translators portal with built-in sector-specific glossaries and syntax auditing." },
      { title: "Logic Schema Sync", text: "Translates text values while mapping matching rules indices to verify routing loops function identically." }
    ],
    architecture: "Interfaces with global Translation Management Systems (TMS) via authenticated REST APIs to sync strings and format schemas.",
    caption: "DI Translation Engine Portal",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 6px;">
            <!-- Language Toolbar EN ➔ target -->
            <div style="background: rgba(0,0,0,0.4); padding: 8px; display: flex; justify-content: space-around; border-bottom: 1px solid rgba(4,203,194,0.15); flex-shrink: 0; box-sizing: border-box;">
              <span class="lang-tab" data-lang="0" style="background: rgba(4,203,194,0.1); border: 1px solid #04cbc2; color: #ffffff; padding: 3px 8px; border-radius: 3px; font-family: monospace; font-size: 9px; cursor: pointer; transition: all 0.2s;">EN ➔ DE</span>
              <span class="lang-tab" data-lang="1" style="background: transparent; border: 1px solid transparent; color: #94a3b8; padding: 3px 8px; border-radius: 3px; font-family: monospace; font-size: 9px; cursor: pointer; transition: all 0.2s;">EN ➔ ES</span>
              <span class="lang-tab" data-lang="2" style="background: transparent; border: 1px solid transparent; color: #94a3b8; padding: 3px 8px; border-radius: 3px; font-family: monospace; font-size: 9px; cursor: pointer; transition: all 0.2s;">EN ➔ JA</span>
            </div>
            <!-- Split translation workspace -->
            <div style="display: grid; grid-template-rows: 1fr 1.1fr; gap: 6px; padding: 10px; flex-grow: 1; overflow: hidden; box-sizing: border-box;">
              <!-- Source English String -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 8px; border-radius: 4px; box-sizing: border-box;">
                <div style="font-size: 7.5px; color: #94a3b8; text-transform: uppercase; font-family: monospace;">Source text string</div>
                <div style="font-size: 11px; color: #ffffff; margin-top: 4px; line-height: 1.3;">"What cloud infrastructure does your company run on?"</div>
              </div>
              <!-- Target Translation String -->
              <div id="trans-card-sec" style="background: rgba(4,203,194,0.03); border: 1px solid rgba(4,203,194,0.15); padding: 8px; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
                <div>
                  <div id="trans-title" style="font-size: 7.5px; color: #04cbc2; font-weight: bold; text-transform: uppercase; font-family: monospace;">DE (German)</div>
                  <div id="trans-text-sec" style="font-size: 10.5px; color: #ffffff; margin-top: 4px; line-height: 1.3;">"Auf welcher Cloud-Infrastruktur läuft Ihr Unternehmen hauptsächlich?"</div>
                </div>
                <!-- Validation accuracy indicators -->
                <div style="display: flex; justify-content: space-between; font-size: 7.5px; font-family: monospace; color: #10b981; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 4px; box-sizing: border-box;">
                  <span>Accuracy: [99.1% Confidence]</span>
                  <span id="trans-sync">Synced</span>
                </div>
              </div>
            </div>
          </div>
        `,
        init: () => {
          const tabs = document.querySelectorAll('.lang-tab');
          const label = document.getElementById('trans-title');
          const text = document.getElementById('trans-text-sec');
          const sync = document.getElementById('trans-sync');
          if (!tabs.length || !label || !text || !sync) return;

          const dataList = [
            { l: "DE (German)", t: '"Auf welcher Cloud-Infrastruktur läuft Ihr Unternehmen hauptsächlich?"', c: "99.1% Confidence" },
            { l: "ES (Spanish)", t: '"¿En qué infraestructura de nube se ejecuta su empresa principalmente?"', c: "98.7% Confidence" },
            { l: "JA (Japanese)", t: '"貴社は主にどのクラウドインフラを使用していますか？"', c: "99.5% Confidence" }
          ];

          let idx = 0;
          const cycle = () => {
            idx = (idx + 1) % dataList.length;
            tabs.forEach((tab, i) => {
              if (i === idx) {
                tab.style.background = 'rgba(4,203,194,0.1)';
                tab.style.borderColor = '#04cbc2';
                tab.style.color = '#ffffff';
              } else {
                tab.style.background = 'transparent';
                tab.style.borderColor = 'transparent';
                tab.style.color = '#94a3b8';
              }
            });

            sync.textContent = "Syncing...";
            sync.style.color = "#f59e0b";
            text.style.opacity = '0.3';

            setTimeout(() => {
              if (label && text && sync) {
                label.textContent = dataList[idx].l;
                text.textContent = dataList[idx].t;
                text.style.opacity = '1';
                sync.textContent = "Synced";
                sync.style.color = "#10b981";
              }
            }, 600);
          };

          const timer = setInterval(cycle, 3200);
          return () => clearInterval(timer);
        }
      };
    }
  },
  processing: {
    badge: "Data Cleanliness",
    title: "DI Data Processing Engine",
    desc: "Run automated data cleansing pipelines to filter out fraudulent entries. The ETL engine audits speeds, device fingerprints, VPN proxy headers, and duplicate entries to compile clean datasets.",
    capabilities: [
      { title: "ETL Cleansing Pipeline", text: "Runs datasets through a 12-point quality validation loop to identify cognitive anomalies." },
      { title: "Speeder & Bot Filters", text: "Flag and quarantine respondents who run script bots or bypass questionnaire reading timelines." },
      { title: "IP & VPN Shield", text: "Blocks duplicate IP entries and rejects traffic routing through anonymous VPN proxy networks." },
      { title: "Multi-Format Export", text: "One-click data compiles exported cleanly into SPSS (.sav), raw CSV text, and Microsoft Excel sheets." }
    ],
    architecture: "Applies cleaning algorithms at the data ingestion gateway, forwarding audited logs to secure S3 storage blocks.",
    caption: "DI Data Processing Engine Dashboard",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box; border-radius: 6px;">
            <!-- Top section Ingress Pipeline path -->
            <div style="background: rgba(0,0,0,0.3); padding: 8px 10px; height: 75px; border-bottom: 1px solid rgba(4,203,194,0.15); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-around; flex-shrink: 0; box-sizing: border-box;">
              <svg width="100%" height="100%" viewBox="0 0 250 60" style="position: absolute; top: 0; left: 0;">
                <!-- Line paths -->
                <line x1="30" y1="30" x2="220" y2="30" stroke="rgba(255,255,255,0.04)" stroke-width="4" stroke-linecap="round" />
                <line id="etl-line" x1="30" y1="30" x2="220" y2="30" stroke="#04cbc2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10, 80" stroke-dashoffset="0" />
                <!-- Circles representing validator gateways -->
                <circle cx="30" cy="30" r="10" fill="#04524e" stroke="#04cbc2" stroke-width="1.5" />
                <circle cx="95" cy="30" r="10" fill="#04524e" stroke="#04cbc2" stroke-width="1.5" />
                <circle cx="160" cy="30" r="10" fill="#04524e" stroke="#04cbc2" stroke-width="1.5" />
                <circle cx="225" cy="30" r="10" fill="#04524e" stroke="#04cbc2" stroke-width="1.5" />
              </svg>
              <!-- Label overlay -->
              <div style="z-index: 2; text-align: center; font-size: 7px; color: #ffffff; font-weight: bold; width: 45px; line-height: 1.1;">INGEST<br><span style="color: #04cbc2; font-family: monospace;">[INPUT]</span></div>
              <div style="z-index: 2; text-align: center; font-size: 7px; color: #ffffff; font-weight: bold; width: 45px; line-height: 1.1;">VPN SHIELD<br><span style="color: #04cbc2; font-family: monospace;">[SECURE]</span></div>
              <div style="z-index: 2; text-align: center; font-size: 7px; color: #ffffff; font-weight: bold; width: 45px; line-height: 1.1;">SPEEDER<br><span style="color: #04cbc2; font-family: monospace;">[AUDIT]</span></div>
              <div style="z-index: 2; text-align: center; font-size: 7px; color: #ffffff; font-weight: bold; width: 45px; line-height: 1.1;">SYNC S3<br><span style="color: #10b981; font-family: monospace;">[DELIVER]</span></div>
            </div>
            <!-- Bottom section: Live table grid -->
            <div style="flex-grow: 1; padding: 10px; overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box;">
              <div style="display: flex; justify-content: space-between; font-size: 8px; color: #94a3b8; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; flex-shrink: 0;">
                <span>Ingested Sessions Stream</span>
                <span style="color: #10b981;" id="etl-count">Cleansed: 2,481</span>
              </div>
              <div id="etl-grid" style="display: flex; flex-direction: column; gap: 3px; overflow: hidden; flex-grow: 1; font-family: monospace; font-size: 8.5px; box-sizing: border-box;">
                <!-- Table Row items appended dynamically -->
              </div>
            </div>
          </div>
        `,
        init: () => {
          const grid = document.getElementById('etl-grid');
          const countEl = document.getElementById('etl-count');
          const line = document.getElementById('etl-line');
          if (!grid || !countEl || !line) return;

          let count = 2481;
          let offset = 0;
          const flowTimer = setInterval(() => {
            offset -= 2;
            if (line) line.style.strokeDashoffset = offset;
          }, 30);

          const ids = ['#28941', '#28942', '#28943', '#28944', '#28945', '#28946', '#28947', '#28948'];
          const audits = [
            { status: '[PASS]', col: '#10b981', loi: '312s' },
            { status: '[PASS]', col: '#10b981', loi: '405s' },
            { status: '[FAIL: Speeder]', col: '#ef4444', loi: '35s' },
            { status: '[PASS]', col: '#10b981', loi: '280s' },
            { status: '[FAIL: Proxy]', col: '#f59e0b', loi: '298s' }
          ];

          let rowIdx = 0;
          const addRow = () => {
            if (!grid || !countEl) return;
            rowIdx++;
            const id = ids[rowIdx % ids.length];
            const item = audits[Math.floor(Math.random() * audits.length)];

            if (item.status === '[PASS]') {
              count++;
              countEl.textContent = 'Cleansed: ' + count.toLocaleString();
            }

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.background = 'rgba(255,255,255,0.02)';
            row.style.border = '1px solid ' + (item.col === '#10b981' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)');
            row.style.padding = '5px 8px';
            row.style.borderRadius = '3px';
            row.style.opacity = '0';
            row.style.transform = 'translateY(-6px)';
            row.style.transition = 'all 0.3s ease';

            row.innerHTML = `<span style="color: #ffffff;">${id}</span><span style="color: #94a3b8;">LOI: ${item.loi}</span><span style="color: ${item.col}; font-weight: bold;">${item.status}</span>`;

            grid.insertBefore(row, grid.firstChild);

            setTimeout(() => {
              row.style.opacity = '1';
              row.style.transform = 'translateY(0)';
            }, 30);

            if (grid.children.length > 3) {
              grid.removeChild(grid.lastChild);
            }
          };

          for (let i = 0; i < 3; i++) { addRow(); }
          const appendTimer = setInterval(addRow, 2400);

          return () => {
            clearInterval(flowTimer);
            clearInterval(appendTimer);
          };
        }
      };
    }
  },
  consulting: {
    badge: "Business Intelligence",
    title: "DI Analytics Engine",
    desc: "Transform raw survey completions into executive summaries, interactive dashboards, and boardroom-ready strategic recommendations compiled by our analysts.",
    capabilities: [
      { title: "Interactive Dashboards", text: "Create custom client portal filters to cross-tabulate demographics, regions, and dates on the fly." },
      { title: "Executive Summaries", text: "Synthesized executive recommendation decks compiled by market analysts outlining key strategic actions." },
      { title: "Significance Audits", text: "Statistical testing calculations mapping margin-of-error parameters and data confidence scores." },
      { title: "Editable Presentations", text: "Direct templates export into fully-formatted, editable PowerPoint slides decks and PDF structures." }
    ],
    architecture: "Queries normalized database layers to generate BI visualization streams using secure GraphQL schemas.",
    caption: "DI Analytics Engine BI Cockpit",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; padding: 10px; box-sizing: border-box; justify-content: space-between; border-radius: 6px;">
            <!-- Realtime Telemetry KPI Tiles -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; flex-shrink: 0; box-sizing: border-box;">
              <!-- KPI 1 -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 6px; border-radius: 4px; display: flex; align-items: center; gap: 8px; box-sizing: border-box;">
                <svg width="24" height="24" viewBox="0 0 36 36" style="transform: rotate(-90deg); flex-shrink: 0;">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="4" />
                  <circle id="bi-gauge" cx="18" cy="18" r="15.915" fill="none" stroke="#04cbc2" stroke-width="4" stroke-dasharray="100, 100" stroke-dashoffset="100" style="transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);" />
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 11px; font-weight: bold; color: #ffffff; font-family: monospace;" id="bi-gauge-val">0%</span>
                  <span style="font-size: 7px; color: #94a3b8; text-transform: uppercase;">Confidence</span>
                </div>
              </div>
              <!-- KPI 2 -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 6px; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                <span style="font-size: 7.5px; color: #94a3b8; text-transform: uppercase;">Incidence Rate</span>
                <span style="font-size: 13px; font-weight: bold; color: #10b981; font-family: monospace; margin-top: 1px;">38.4%</span>
              </div>
            </div>
            <!-- Central Chart area-fill curves -->
            <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 8px; border-radius: 4px; flex-grow: 1; margin: 6px 0; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
              <span style="font-size: 7.5px; color: #94a3b8; text-transform: uppercase;">Response rate curve</span>
              <div style="height: 50px; width: 100%; margin-top: 4px;">
                <svg width="100%" height="100%" viewBox="0 0 160 50" style="overflow: visible;">
                  <defs>
                    <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#04cbc2" stop-opacity="0.3" />
                      <stop offset="100%" stop-color="#04cbc2" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <path id="bi-curve-fill" d="M0,45 Q30,20 60,35 T120,10 T160,30 L160,50 L0,50 Z" fill="url(#chart-glow)" style="opacity: 0; transition: opacity 1s ease;" />
                  <path id="bi-curve" d="M0,45 Q30,20 60,35 T120,10 T160,30" fill="none" stroke="#04cbc2" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </div>
            </div>
            <!-- Export bar footer -->
            <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 4px; font-family: monospace; font-size: 8px; color: #94a3b8; text-align: center; flex-shrink: 0; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.04);">
              Database: <span style="color: #10b981;">CLEANED & SYNCD</span>
            </div>
          </div>
        `,
        init: () => {
          const gauge = document.getElementById('bi-gauge');
          const gaugeVal = document.getElementById('bi-gauge-val');
          const curve = document.getElementById('bi-curve');
          const fill = document.getElementById('bi-curve-fill');
          if (!gauge || !gaugeVal || !curve || !fill) return;

          // Animate line chart path drawing
          const length = 250;
          curve.style.strokeDasharray = length;
          curve.style.strokeDashoffset = length;
          fill.style.opacity = '0';

          const drawGraph = () => {
            if (!curve || !fill) return;
            curve.style.strokeDashoffset = length;
            fill.style.opacity = '0';
            setTimeout(() => {
              if (curve) {
                curve.style.transition = 'stroke-dashoffset 1.8s ease-in-out';
                curve.style.strokeDashoffset = '0';
              }
            }, 100);
            setTimeout(() => {
              if (fill) {
                fill.style.transition = 'opacity 0.8s ease';
                fill.style.opacity = '1';
              }
            }, 1600);
          };

          drawGraph();
          const lineTimer = setInterval(drawGraph, 8000);

          // Animate circular gauge
          gauge.setAttribute('stroke-dashoffset', '100');
          setTimeout(() => {
            gauge.setAttribute('stroke-dashoffset', '26'); // 74%
            let val = 0;
            const textTimer = setInterval(() => {
              val += 2;
              if (val >= 74) {
                val = 74;
                clearInterval(textTimer);
              }
              if (gaugeVal) gaugeVal.textContent = val + '%';
            }, 30);
          }, 300);

          return () => {
            clearInterval(lineTimer);
          };
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
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
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
    document.title = `Research COPS | ${data.title}`;

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
  if (initialId === 'workflow-hub') {
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
      back: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>`
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
            { label: "CPI Estimate & Calculator", icon: "cpi", chip: "pricing" },
            { label: "Workflow Automation Hub", icon: "workflow", chip: "workflow" },
            { label: "Enterprise ERP & Integrations", icon: "erp", chip: "integrations" },
            { label: "Get Custom Quote & Demo", icon: "quote", chip: "quote" }
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
          addBotMessage("To estimate pricing in real-time, click 'Launch Audience Estimator' at the bottom of the page to redirect to our CPI calculator.");
        } else if (chipType === 'workflow') {
          addBotMessage("Our Enterprise Workflow Hub routes HR, Billing, BI Reports, and performance coaching models. Select 'Enterprise Workflow Hub' from our solutions menu to see the architecture.");
        } else if (chipType === 'quote') {
          addBotMessage("We would love to build a custom solution blueprint and sandbox demo for you! Please type your **Full Name, Work Email, and project brief** below and send it. Once submitted, you'll be able to book a call directly on our calendar.");
          renderQuickChips([]);
        } else if (chipType === 'trigger-calendly-link') {
          addBotMessage("Great choice! Booking a video call helps us align on parameters and demonstrate our system capabilities. Click the link below to select a time:");
          addBotMessage(`📅 <strong><a href="${rcCalendlyUrl}" target="_blank" style="color: var(--turquoise-accent); text-decoration: underline;">Schedule Call on Calendly</a></strong>`);
          renderQuickChips([
            { label: "Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'trigger-submit-flow') {
          addBotMessage("Please submit your details via our Contact form on the homepage and our sales team will email a custom platform integration review.");
          renderQuickChips([
            { label: "Schedule Call instead", icon: "calendar", chip: "trigger-calendly-link" },
            { label: "Main Menu", icon: "back", chip: "go-main" }
          ]);
        } else if (chipType === 'go-main') {
          addBotMessage("What general area would you like to inquire about?");
          renderQuickChips([
            { label: "CPI Estimate & Calculator", icon: "cpi", chip: "pricing" },
            { label: "Workflow Automation Hub", icon: "workflow", chip: "workflow" },
            { label: "Enterprise ERP & Integrations", icon: "erp", chip: "integrations" },
            { label: "Get Custom Quote & Demo", icon: "quote", chip: "quote" }
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
