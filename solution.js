// Research COPS - Solutions Detail Page Controller
// Renders dynamic technical summaries and custom interactive SVG simulations for all 9 solutions.

const SOLUTION_DATA = {
  management: {
    badge: "Project Delivery",
    title: "Full-Cycle Project Management",
    desc: "Our project management suite provides end-to-end campaign tracking, automated scoping, live field operations checklists, and data delivery timelines in a unified collaborative dashboard.",
    capabilities: [
      { title: "Full Campaign Scoping", text: "Automated feasibility checks that cross-reference target specifications with panel quotas instantly." },
      { title: "Live Field Management", text: "Real-time fielding monitoring tracking daily completes, response ratios, and drop-out locations." },
      { title: "Automated Quality Gates", text: "Cleanses data at ingestion, running speeder checks, attention filters, and VPN proxy blocks." },
      { title: "Structured Data Delivery", text: "Instant data compilation and export into SPSS (.sav), CSV, and Excel tables format." }
    ],
    architecture: "Deploys HTML5 tracker widgets and connects to core operations databases via secure WebSocket APIs to synchronize fielding schedules.",
    caption: "Active Project Delivery Dashboard",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box;">
            <!-- Header -->
            <div style="background: rgba(0,0,0,0.4); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(4,203,194,0.15);">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #04cbc2; box-shadow: 0 0 6px #04cbc2;"></span>
                <span style="color: #ffffff; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">PROJECT TRACKER</span>
              </div>
              <span style="font-size: 11px; color: #94a3b8; background: rgba(4,203,194,0.1); padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(4,203,194,0.2);" id="pm-stage-badge">Scoping</span>
            </div>
            <!-- Kanban Columns -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 12px; flex-grow: 1; overflow: hidden;">
              <!-- Col 1 -->
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; gap: 8px;">
                <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">1. Scoping</div>
                <div id="pm-card-1" style="background: rgba(4,203,194,0.06); border: 1px solid rgba(4,203,194,0.2); padding: 8px; border-radius: 4px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(4,203,194,0.15);">
                  <div style="font-size: 11px; color: #ffffff; font-weight: 500; margin-bottom: 4px;">Campaign #842B</div>
                  <div style="font-size: 9px; color: #04cbc2; display: flex; align-items: center; gap: 4px; font-family: monospace;" id="pm-card-1-status">Active...</div>
                </div>
              </div>
              <!-- Col 2 -->
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; gap: 8px;">
                <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">2. In Field</div>
                <div id="pm-card-2" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; opacity: 0.4; transition: all 0.3s;">
                  <div style="font-size: 11px; color: #ffffff; font-weight: 500; margin-bottom: 4px;">Campaign #842B</div>
                  <div style="font-size: 9px; color: #94a3b8; font-family: monospace;" id="pm-card-2-status">Router Dispatch</div>
                </div>
              </div>
              <!-- Col 3 -->
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; gap: 8px;">
                <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">3. Audit</div>
                <div id="pm-card-3" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; opacity: 0.4; transition: all 0.3s;">
                  <div style="font-size: 11px; color: #ffffff; font-weight: 500; margin-bottom: 4px;">Campaign #842B</div>
                  <div style="font-size: 9px; color: #94a3b8; font-family: monospace;" id="pm-card-3-status">Speeder Check</div>
                </div>
              </div>
              <!-- Col 4 -->
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; gap: 8px;">
                <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">4. Delivered</div>
                <div id="pm-card-4" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; opacity: 0.4; transition: all 0.3s;">
                  <div style="font-size: 11px; color: #ffffff; font-weight: 500; margin-bottom: 4px;">Campaign #842B</div>
                  <div style="font-size: 9px; color: #94a3b8; font-family: monospace;" id="pm-card-4-status">SPSS Output</div>
                </div>
              </div>
            </div>
            <!-- Console Log -->
            <div style="background: rgba(0,0,0,0.5); padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.05); height: 80px; overflow: hidden; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box;">
              <div id="pm-console" style="font-family: monospace; font-size: 11px; color: #04cbc2; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">> Initializing project scheduler...</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                <div style="flex-grow: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden;">
                  <div id="pm-progress-bar" style="width: 25%; height: 100%; background: #04cbc2; border-radius: 2px; transition: width 0.5s ease;"></div>
                </div>
                <span style="font-size: 10px; color: #94a3b8; font-family: monospace;" id="pm-progress-pct">25%</span>
              </div>
            </div>
          </div>
        `,
        init: () => {
          let stage = 0;
          const consoleOutput = document.getElementById('pm-console');
          const stageBadge = document.getElementById('pm-stage-badge');
          const progressBar = document.getElementById('pm-progress-bar');
          const progressPct = document.getElementById('pm-progress-pct');
          const c1 = document.getElementById('pm-card-1');
          const c2 = document.getElementById('pm-card-2');
          const c3 = document.getElementById('pm-card-3');
          const c4 = document.getElementById('pm-card-4');
          const s1 = document.getElementById('pm-card-1-status');
          const s2 = document.getElementById('pm-card-2-status');
          const s3 = document.getElementById('pm-card-3-status');
          const s4 = document.getElementById('pm-card-4-status');

          const runTimeline = () => {
            // Reset card styles
            [c1, c2, c3, c4].forEach((c, idx) => {
              c.style.background = 'rgba(255,255,255,0.02)';
              c.style.borderColor = 'rgba(255,255,255,0.05)';
              c.style.opacity = '0.4';
              c.style.boxShadow = 'none';
            });
            [s1, s2, s3, s4].forEach((s, idx) => {
              s.style.color = '#94a3b8';
              s.textContent = idx === 0 ? 'Feasibility Check' : idx === 1 ? 'Router Dispatch' : idx === 2 ? 'Speeder Check' : 'SPSS Output';
            });

            if (stage === 0) {
              c1.style.background = 'rgba(4,203,194,0.08)';
              c1.style.borderColor = '#04cbc2';
              c1.style.opacity = '1';
              c1.style.boxShadow = '0 4px 12px rgba(4,203,194,0.15)';
              s1.innerHTML = '<span style="display:inline-block; width:6px; height:6px; background:#04cbc2; border-radius:50%; box-shadow:0 0 6px #04cbc2; margin-right:4px;"></span>Active...';
              s1.style.color = '#04cbc2';
              stageBadge.textContent = 'Scoping';
              progressBar.style.width = '25%';
              progressPct.textContent = '25%';
              consoleOutput.textContent = '> [SYSTEM] Feasibility engine analyzing target parameters...';
              stage = 1;
            } else if (stage === 1) {
              c1.style.opacity = '0.8';
              s1.textContent = '✓ Scoped';
              s1.style.color = '#10b981';
              
              c2.style.background = 'rgba(4,203,194,0.08)';
              c2.style.borderColor = '#04cbc2';
              c2.style.opacity = '1';
              c2.style.boxShadow = '0 4px 12px rgba(4,203,194,0.15)';
              s2.innerHTML = '<span style="display:inline-block; width:6px; height:6px; background:#04cbc2; border-radius:50%; box-shadow:0 0 6px #04cbc2; margin-right:4px;"></span>In Field';
              s2.style.color = '#04cbc2';
              stageBadge.textContent = 'In Field';
              progressBar.style.width = '50%';
              progressPct.textContent = '50%';
              consoleOutput.textContent = '> [FIELD] Distributing survey router. Real-time quota filling...';
              stage = 2;
            } else if (stage === 2) {
              c1.style.opacity = '0.8';
              s1.textContent = '✓ Scoped';
              s1.style.color = '#10b981';
              c2.style.opacity = '0.8';
              s2.textContent = '✓ Collected';
              s2.style.color = '#10b981';

              c3.style.background = 'rgba(4,203,194,0.08)';
              c3.style.borderColor = '#04cbc2';
              c3.style.opacity = '1';
              c3.style.boxShadow = '0 4px 12px rgba(4,203,194,0.15)';
              s3.innerHTML = '<span style="display:inline-block; width:6px; height:6px; background:#04cbc2; border-radius:50%; box-shadow:0 0 6px #04cbc2; margin-right:4px;"></span>Auditing...';
              s3.style.color = '#04cbc2';
              stageBadge.textContent = 'Audit';
              progressBar.style.width = '75%';
              progressPct.textContent = '75%';
              consoleOutput.textContent = '> [QUALITY] Running speeder & deduplication script algorithms...';
              stage = 3;
            } else if (stage === 3) {
              c1.style.opacity = '0.8';
              s1.textContent = '✓ Scoped';
              s1.style.color = '#10b981';
              c2.style.opacity = '0.8';
              s2.textContent = '✓ Collected';
              s2.style.color = '#10b981';
              c3.style.opacity = '0.8';
              s3.textContent = '✓ Cleansed';
              s3.style.color = '#10b981';

              c4.style.background = 'rgba(16,185,129,0.08)';
              c4.style.borderColor = '#10b981';
              c4.style.opacity = '1';
              c4.style.boxShadow = '0 4px 12px rgba(16,185,129,0.15)';
              s4.textContent = '✓ Delivered';
              s4.style.color = '#10b981';
              stageBadge.textContent = 'Delivered';
              progressBar.style.width = '100%';
              progressPct.textContent = '100%';
              consoleOutput.textContent = '> [DELIVERED] Final database compiled. Format label: SPSS .sav';
              stage = 0;
            }
          };

          runTimeline();
          const timer = setInterval(runTimeline, 4000);
          return () => clearInterval(timer);
        }
      };
    }
  },
  sampling: {
    badge: "Audience & Reach",
    title: "Global Online Sampling",
    desc: "Access over 2 million pre-profiled B2B professionals, healthcare specialists, and consumer audiences across 31 countries. Sourced through our verified partner networks and our proprietary panel Opinion Genie to deliver high-fidelity target cohorts.",
    capabilities: [
      { title: "Double Opt-In Panels", text: "Respondents pass through multi-tier verification before entering the active sample pool." },
      { title: "Dynamic Sampling Router", text: "Automated respondent allocation matching demographics to active targets." },
      { title: "B2B & Enterprise Segments", text: "Target decision makers by industry vertical, company size, and executive seniority." },
      { title: "Healthcare & HCP Access", text: "Reach verified physicians, nurses, specialists, and patient cohorts." }
    ],
    architecture: "Integrates with Opinion Genie and external panel registries via secure, authenticated OAuth 2.0 endpoints. Employs real-time routing algorithms that calculate feasibility profiles on the fly.",
    caption: "Real-Time Audience Profiling & Feasibility Router",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box;">
            <!-- Left side: Map and Router Nodes -->
            <div style="position: relative; border-right: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
              <svg width="100%" height="100%" viewBox="0 0 200 280" style="position: absolute; top: 0; left: 0;">
                <style>
                  .map-node { fill: #04cbc2; }
                  .map-pulse { animation: map-pulse-glow 2.5s infinite; }
                  @keyframes map-pulse-glow {
                    0% { r: 6; opacity: 0.6; }
                    50% { r: 12; opacity: 0.15; }
                    100% { r: 6; opacity: 0.6; }
                  }
                </style>
                <!-- Dots for map abstraction -->
                <circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.08)" />
                <circle cx="70" cy="60" r="1.5" fill="rgba(255,255,255,0.08)" />
                <circle cx="150" cy="70" r="1.5" fill="rgba(255,255,255,0.08)" />
                <circle cx="50" cy="160" r="1.5" fill="rgba(255,255,255,0.08)" />
                <circle cx="130" cy="200" r="1.5" fill="rgba(255,255,255,0.08)" />
                <!-- Map Active Nodes -->
                <circle cx="70" cy="60" r="10" fill="rgba(4,203,194,0.15)" class="map-pulse" />
                <circle cx="70" cy="60" r="4" class="map-node" />
                <circle cx="150" cy="70" r="10" fill="rgba(4,203,194,0.15)" class="map-pulse" />
                <circle cx="150" cy="70" r="4" class="map-node" />
                <circle cx="50" cy="160" r="10" fill="rgba(4,203,194,0.15)" class="map-pulse" />
                <circle cx="50" cy="160" r="4" class="map-node" />
                <!-- Central Hub -->
                <circle cx="100" cy="120" r="8" fill="#04cbc2" />
                <line x1="70" y1="60" x2="100" y2="120" stroke="rgba(4,203,194,0.3)" stroke-width="1" stroke-dasharray="3 3" />
                <line x1="150" y1="70" x2="100" y2="120" stroke="rgba(4,203,194,0.3)" stroke-width="1" stroke-dasharray="3 3" />
                <line x1="50" y1="160" x2="100" y2="120" stroke="rgba(4,203,194,0.3)" stroke-width="1" stroke-dasharray="3 3" />
              </svg>
              <div style="position: absolute; bottom: 12px; font-family: monospace; font-size: 9px; color: #94a3b8; text-transform: uppercase;">Sampling Nodes Map</div>
            </div>
            <!-- Right side: Target Profiler details -->
            <div style="padding: 16px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; background: rgba(0,0,0,0.2); box-sizing: border-box;">
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="font-size: 10px; color: #04cbc2; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Target segment</div>
                <div style="font-size: 14px; font-weight: 600; color: #ffffff; line-height: 1.2;">IT Decision Makers (VP+)</div>
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 8px; border-radius: 4px;">
                  <div style="font-size: 9px; color: #94a3b8;">Feasibility Index</div>
                  <div style="font-size: 12px; color: #10b981; font-weight: 600; margin-top: 2px;">98.4% Available</div>
                </div>
              </div>
              <!-- Circle Progress Meter -->
              <div style="display: flex; align-items: center; gap: 12px;">
                <svg width="60" height="60" viewBox="0 0 36 36" style="transform: rotate(-90deg); flex-shrink: 0;">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="3" />
                  <circle id="sampling-progress-circle" cx="18" cy="18" r="15.915" fill="none" stroke="#04cbc2" stroke-width="3" stroke-dasharray="100, 100" stroke-dashoffset="100" style="transition: stroke-dashoffset 0.1s linear;" />
                </svg>
                <div>
                  <div style="font-size: 9px; color: #94a3b8;">Total Completes</div>
                  <div style="font-size: 18px; font-weight: 700; color: #ffffff; font-family: monospace;" id="sampling-completes-val">0</div>
                </div>
              </div>
            </div>
          </div>
        `,
        init: () => {
          const completesVal = document.getElementById('sampling-completes-val');
          const circle = document.getElementById('sampling-progress-circle');
          let completes = 0;
          const target = 500;

          const interval = setInterval(() => {
            completes += Math.floor(Math.random() * 8) + 2;
            if (completes >= target) {
              completes = target;
            }
            completesVal.textContent = completes;
            
            const pct = (completes / target) * 100;
            const offset = 100 - pct;
            circle.setAttribute('stroke-dashoffset', offset);

            if (completes === target) {
              setTimeout(() => {
                completes = 0;
                completesVal.textContent = '0';
                circle.setAttribute('stroke-dashoffset', 100);
              }, 1500);
            }
          }, 100);

          return () => clearInterval(interval);
        }
      };
    }
  },
  development: {
    badge: "Research Design",
    title: "Survey Design & Methodology",
    desc: "Our design methodology tools allow research teams to build responsive question models, set up branching logic flows, configure skip constraints, and preview mobile layouts in real-time.",
    capabilities: [
      { title: "Visual Question Builder", text: "Drag-and-drop elements to format single choice, matrix tables, grids, and numeric answers." },
      { title: "Branching Logic Flows", text: "Visual rule designer to map skip logic, routing paths, and conditional loops based on responses." },
      { title: "Device-Responsive Layouts", text: "Automatic layout formatting optimizing rendering across desktop, tablet, and mobile browsers." },
      { title: "Interactive Media Stimuli", text: "Securely host and track respondent engagement with video concepts, audio segments, and image carousels." }
    ],
    architecture: "Compiles JSON question schemas compatible with all major rendering engines (Decipher, Qualtrics, Confirmit) via automated mapping APIs.",
    caption: "SaaS Survey Builder & Mobile Device Simulator",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: grid; grid-template-columns: 1.1fr 1fr; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box;">
            <!-- Left side: Builder Workspace -->
            <div style="padding: 12px; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden;">
              <div>
                <div style="font-size: 10px; color: #04cbc2; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Builder Elements</div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(4,203,194,0.15); padding: 8px; border-radius: 4px; font-size: 11px; color: #ffffff;">
                    <strong>Q1: Multiple Choice</strong>
                    <div style="font-size: 9px; color: #94a3b8; margin-top: 2px;">NPS Rating Segment</div>
                  </div>
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; font-size: 11px; color: #94a3b8;">
                    <strong>Q2: Grid Matrix</strong>
                    <div style="font-size: 9px; color: rgba(255,255,255,0.2); margin-top: 2px;">Features evaluation</div>
                  </div>
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; font-size: 11px; color: #94a3b8;">
                    <strong>Logic: Skip Branch</strong>
                    <div style="font-size: 9px; color: #04cbc2; margin-top: 2px;">If Q1 &lt; 7 ➔ Skip Q3</div>
                  </div>
                </div>
              </div>
              <div style="font-family: monospace; font-size: 9px; color: #64748b;">[SCHEMA: OK | 100% VALIDATED]</div>
            </div>
            <!-- Right side: Device Preview -->
            <div style="display: flex; align-items: center; justify-content: center; position: relative;">
              <!-- Mobile Phone Frame -->
              <div style="width: 145px; height: 260px; border-radius: 20px; border: 4px solid #1e293b; background: #000000; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.6); position: relative; box-sizing: border-box;">
                <!-- Camera notch -->
                <div style="width: 50px; height: 12px; background: #1e293b; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; align-self: center; flex-shrink: 0;"></div>
                <!-- Screen Content -->
                <div id="survey-device-screen" style="flex-grow: 1; padding: 12px 8px; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s; background: #050a0a; overflow: hidden; box-sizing: border-box;">
                  <div>
                    <div style="font-size: 8px; color: #04cbc2; text-transform: uppercase;">Q1: NPS Evaluation</div>
                    <div style="font-size: 10px; color: #ffffff; font-weight: 600; margin-top: 4px; line-height: 1.2;" id="survey-device-q">How likely are you to recommend us?</div>
                    <!-- Options -->
                    <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 10px;" id="survey-device-opts">
                      <button id="dev-opt-1" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; padding: 6px; border-radius: 4px; font-size: 8px; text-align: left; cursor: pointer; outline: none; width: 100%;">10 - Extremely Likely</button>
                      <button id="dev-opt-2" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; padding: 6px; border-radius: 4px; font-size: 8px; text-align: left; cursor: pointer; outline: none; width: 100%;">8 - Somewhat Likely</button>
                      <button id="dev-opt-3" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; padding: 6px; border-radius: 4px; font-size: 8px; text-align: left; cursor: pointer; outline: none; width: 100%;">5 - Neutral</button>
                    </div>
                  </div>
                  <button id="dev-submit-btn" style="background: rgba(4,203,194,0.15); border: 1px solid #04cbc2; color: #ffffff; padding: 6px; border-radius: 4px; font-size: 9px; font-weight: bold; width: 100%; cursor: pointer; outline: none; border-style: solid;">Submit</button>
                </div>
              </div>
              <!-- Animated Cursor Pointer -->
              <div id="survey-device-cursor" style="position: absolute; width: 14px; height: 14px; background: rgba(4,203,194,0.8); border: 2px solid #ffffff; border-radius: 50%; top: 180px; left: 110px; pointer-events: none; transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); box-shadow: 0 0 8px rgba(4,203,194,0.8); z-index: 100;"></div>
            </div>
          </div>
        `,
        init: () => {
          const cursor = document.getElementById('survey-device-cursor');
          const opt1 = document.getElementById('dev-opt-1');
          const submit = document.getElementById('dev-submit-btn');
          const screen = document.getElementById('survey-device-screen');
          const qTitle = document.getElementById('survey-device-q');
          const opts = document.getElementById('survey-device-opts');

          let cycle = 0;

          const runSurveyAnimation = () => {
            if (!cursor || !opt1 || !submit || !screen || !qTitle || !opts) return;
            if (cycle === 0) {
              // Reset screen
              screen.style.background = '#050a0a';
              qTitle.textContent = 'How likely are you to recommend us?';
              qTitle.style.opacity = '1';
              opts.style.display = 'flex';
              submit.style.display = 'block';
              submit.textContent = 'Submit';
              submit.style.background = 'rgba(4,203,194,0.15)';
              submit.style.borderColor = '#04cbc2';
              opt1.style.background = 'rgba(255,255,255,0.03)';
              opt1.style.borderColor = 'rgba(255,255,255,0.08)';
              opt1.style.color = '#94a3b8';
              
              // Move to Option 1
              cursor.style.top = '145px';
              cursor.style.left = '120px';
              cycle = 1;
            } else if (cycle === 1) {
              // Click Option 1
              opt1.style.background = 'rgba(4,203,194,0.1)';
              opt1.style.borderColor = '#04cbc2';
              opt1.style.color = '#ffffff';
              // Move to Submit
              cursor.style.top = '215px';
              cursor.style.left = '110px';
              cycle = 2;
            } else if (cycle === 2) {
              // Click Submit
              submit.style.background = '#10b981';
              submit.style.borderColor = '#10b981';
              submit.textContent = '✓ Submitting...';
              cycle = 3;
            } else if (cycle === 3) {
              // Screen Success
              opts.style.display = 'none';
              submit.style.display = 'none';
              qTitle.innerHTML = '<div style="text-align:center; padding: 30px 10px; box-sizing: border-box;"><div style="font-size: 24px; color: #10b981;">✓</div><div style="font-size: 11px; font-weight: bold; margin-top: 10px; color:#ffffff;">Survey Complete</div><div style="font-size: 8px; color: #94a3b8; margin-top: 4px;">Data Synced to S3</div></div>';
              cursor.style.top = '90px';
              cursor.style.left = '160px';
              cycle = 0;
            }
          };

          runSurveyAnimation();
          const interval = setInterval(runSurveyAnimation, 2000);
          return () => clearInterval(interval);
        }
      };
    }
  },
  programming: {
    badge: "Systems Engineering",
    title: "Advanced Survey Programming",
    desc: "Implement complex routing schemas, quotas management, custom JavaScript validation widgets, and secure external database callbacks in our cloud IDE environment.",
    capabilities: [
      { title: "Custom Logic Engines", text: "Deploy advanced script rule branching, loops, and show/hide constraints based on logic arrays." },
      { title: "Live Quotas Controller", text: "Auto-routing redirects that close target brackets and update redirect urls on limits exhaustion." },
      { title: "JavaScript Widgets API", text: "Embed secure dynamic elements, calculations models, and media triggers in the questionnaire stream." },
      { title: "API Endpoints Sync", text: "Automated callbacks that post encrypted complete data packets to specified secure APIs endpoints." }
    ],
    architecture: "Compiles logical rulesets into executable serverless functions running on our edge node mesh to ensure zero-latency routing.",
    caption: "Cloud Logic Validator IDE & Terminal Simulation",
    getVisual: () => {
      return {
        html: `
          <div style="display: grid; grid-template-columns: 1.15fr 1fr; width: 100%; height: 100%; font-family: monospace; font-size: 11px; background: #070f0e; border-radius: 6px; overflow: hidden; position: relative; box-sizing: border-box;">
            <!-- Left Pane: Code Editor -->
            <div style="border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; overflow: hidden;">
              <div style="background: rgba(0,0,0,0.3); padding: 8px; color: #94a3b8; font-size: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; box-sizing: border-box;">
                <span>validation_schema.js</span>
                <span style="color: #04cbc2;">● ACTIVE</span>
              </div>
              <pre id="editor-code" style="margin: 0; padding: 12px; color: #04cbc2; line-height: 1.4; overflow: hidden; white-space: pre-wrap; word-break: break-all; flex-grow: 1; box-sizing: border-box;"></pre>
            </div>
            <!-- Right Pane: Terminal Console -->
            <div style="display: flex; flex-direction: column; overflow: hidden; background: rgba(0,0,0,0.4); box-sizing: border-box;">
              <div style="background: rgba(0,0,0,0.3); padding: 8px; color: #94a3b8; font-size: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); box-sizing: border-box;">compiler_logs</div>
              <div id="console-logs" style="margin: 0; padding: 12px; color: #94a3b8; line-height: 1.5; overflow: hidden; display: flex; flex-direction: column; gap: 6px; flex-grow: 1; box-sizing: border-box;"></div>
            </div>
            <!-- Floating Glass Card Validation Badge -->
            <div id="logic-val-badge" style="position: absolute; bottom: 20px; right: 20px; width: 140px; background: rgba(10,25,25,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(4,203,194,0.3); border-radius: 6px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; transform: translateY(50px); opacity: 0; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-sizing: border-box;">
              <div style="width: 8px; height: 8px; border-radius:50%; background: #10b981; box-shadow: 0 0 8px #10b981; flex-shrink:0;"></div>
              <div style="display:flex; flex-direction:column;">
                <span style="font-size: 9px; color: #10b981; font-weight: bold; text-transform: uppercase; line-height:1.2;">RULE DEPLOYED</span>
                <span style="font-size: 8px; color: #94a3b8; font-family: monospace;">Schema: 100% OK</span>
              </div>
            </div>
          </div>
        `,
        init: () => {
          const editor = document.getElementById('editor-code');
          const terminal = document.getElementById('console-logs');
          const valBadge = document.getElementById('logic-val-badge');
          if (!editor || !terminal || !valBadge) return;
          
          const codeLines = [
            "// Survey Logic Rule",
            "const validator = new RuleEngine();",
            "validator.registerRule('speeds', {",
            "  minLOI: 300, // 5 min",
            "  straightLines: true",
            "});",
            "",
            "validator.on('respondent_route', (res) => {",
            "  if (res.isSpeeder()) {",
            "    return res.reject('SPEED_LMT');",
            "  }",
            "  res.saveComplete();",
            "});"
          ];

          const consoleLogs = [
            { text: "[OK] Init Validation Schema", color: "#10b981" },
            { text: "[API] Connecting to router...", color: "#94a3b8" },
            { text: "[OK] Core sync active", color: "#10b981" },
            { text: "[RUN] Listening on port 443...", color: "#04cbc2" },
            { text: "[PASS] Session ID #2841: Valid IP", color: "#10b981" },
            { text: "[PASS] Session ID #2841: Passed check Q4", color: "#10b981" },
            { text: "[BLOCK] Session ID #2842: Speeder check fail", color: "#ef4444" },
            { text: "[API] Webhook complete #2841 fired", color: "#04cbc2" }
          ];

          let codeCharIdx = 0;
          let codeLineIdx = 0;
          let logIdx = 0;

          const typeCode = () => {
            if (!editor) return;
            if (codeLineIdx < codeLines.length) {
              const currentLineText = codeLines[codeLineIdx];
              if (codeCharIdx <= currentLineText.length) {
                editor.textContent = codeLines.slice(0, codeLineIdx).join('\n') + '\n' + currentLineText.substring(0, codeCharIdx) + '_';
                codeCharIdx++;
                setTimeout(typeCode, 20);
              } else {
                codeLineIdx++;
                codeCharIdx = 0;
                setTimeout(typeCode, 100);
              }
            } else {
              editor.textContent = codeLines.join('\n');
              setTimeout(printLog, 500);
            }
          };

          const printLog = () => {
            if (!terminal || !valBadge) return;
            if (logIdx < consoleLogs.length) {
              const log = consoleLogs[logIdx];
              const logEl = document.createElement('div');
              logEl.style.color = log.color;
              logEl.textContent = log.text;
              terminal.appendChild(logEl);
              logIdx++;
              setTimeout(printLog, 600);
            } else {
              valBadge.style.opacity = '1';
              valBadge.style.transform = 'translateY(0)';
              
              setTimeout(() => {
                valBadge.style.opacity = '0';
                valBadge.style.transform = 'translateY(50px)';
                setTimeout(() => {
                  editor.textContent = '';
                  terminal.innerHTML = '';
                  codeLineIdx = 0;
                  codeCharIdx = 0;
                  logIdx = 0;
                  typeCode();
                }, 500);
              }, 4000);
            }
          };

          typeCode();
          return () => {};
        }
      };
    }
  },
  translations: {
    badge: "Global Localization",
    title: "Multi-Language Localization",
    desc: "Translate, review, and synchronize survey templates across 25+ languages. Our localization platform preserves semantic intent, formatting variables, and routing logic integrity.",
    capabilities: [
      { title: "Split-Pane Editor", text: "Dedicated translation sheets showing English source strings side-by-side with target language inputs." },
      { title: "Variables Isolation", text: "Compiler locking that prevents translators from modifying HTML tags, piping variables, and scripting logic." },
      { title: "Contextual Translation", text: "Professional human translators portal with built-in sector-specific glossaries and syntax auditing." },
      { title: "Logic Schema Sync", text: "Translates text values while mapping matching rules indices to verify routing loops function identically." }
    ],
    architecture: "Interfaces with global Translation Management Systems (TMS) via authenticated REST APIs to sync strings and format schemas.",
    caption: "Real-time Multi-Language Translation Portal",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box;">
            <!-- Language Buttons -->
            <div style="background: rgba(0,0,0,0.4); padding: 12px; display: flex; justify-content: space-around; border-bottom: 1px solid rgba(4,203,194,0.15); flex-shrink: 0; box-sizing: border-box;">
              <button class="lang-btn" data-lang="en" style="background: rgba(4,203,194,0.1); border: 1px solid #04cbc2; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.3s; outline: none;">EN</button>
              <button class="lang-btn" data-lang="de" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 4px 10px; border-radius: 4px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.3s; outline: none;">DE</button>
              <button class="lang-btn" data-lang="es" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 4px 10px; border-radius: 4px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.3s; outline: none;">ES</button>
              <button class="lang-btn" data-lang="ja" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 4px 10px; border-radius: 4px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.3s; outline: none;">JA</button>
              <button class="lang-btn" data-lang="fr" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 4px 10px; border-radius: 4px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.3s; outline: none;">FR</button>
            </div>
            <!-- Split pane contents -->
            <div style="display: grid; grid-template-rows: 1fr 1.2fr; gap: 8px; padding: 12px; flex-grow: 1; overflow: hidden; box-sizing: border-box;">
              <!-- English source pane -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 10px; border-radius: 6px; box-sizing: border-box;">
                <div style="font-size: 9px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">Source (English)</div>
                <div style="font-size: 12px; color: #ffffff; margin-top: 6px; line-height: 1.4;">"Which cloud infrastructure does your company primarily run on?"</div>
              </div>
              <!-- Translation target pane -->
              <div id="trans-card" style="background: rgba(4,203,194,0.04); border: 1px solid rgba(4,203,194,0.15); padding: 10px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-sizing: border-box; overflow: hidden;">
                <div>
                  <div id="trans-label" style="font-size: 9px; color: #04cbc2; font-weight: bold; text-transform: uppercase;">Target Output: EN (English)</div>
                  <div id="trans-text" style="font-size: 12px; color: #ffffff; margin-top: 6px; line-height: 1.4;">"Which cloud infrastructure does your company primarily run on?"</div>
                </div>
                <!-- Loading progress bar -->
                <div id="trans-progress" style="width: 100%; height: 3px; background: rgba(4,203,194,0.1); border-radius: 2px; overflow: hidden; opacity: 0; margin: 8px 0; box-sizing: border-box;">
                  <div id="trans-progress-bar" style="width: 0%; height: 100%; background: #04cbc2; border-radius: 2px;"></div>
                </div>
                <div style="font-family: monospace; font-size: 8px; color: #10b981; display: flex; justify-content: space-between; flex-shrink: 0; box-sizing: border-box;">
                  <span>Logic intact: [Skip Rule #4: Passed]</span>
                  <span style="color: #64748b;" id="trans-status">Synced</span>
                </div>
              </div>
            </div>
          </div>
        `,
        init: () => {
          const btns = document.querySelectorAll('.lang-btn');
          const transCard = document.getElementById('trans-card');
          const transLabel = document.getElementById('trans-label');
          const transText = document.getElementById('trans-text');
          const progress = document.getElementById('trans-progress');
          const progressBar = document.getElementById('trans-progress-bar');
          const transStatus = document.getElementById('trans-status');
          if (!btns.length || !transCard || !transLabel || !transText || !progress || !progressBar || !transStatus) return;

          const translations = {
            en: {
              label: "Target Output: EN (English)",
              text: '"Which cloud infrastructure does your company primarily run on?"'
            },
            de: {
              label: "Target Output: DE (German)",
              text: '"Auf welcher Cloud-Infrastruktur läuft Ihr Unternehmen hauptsächlich?"'
            },
            es: {
              label: "Target Output: ES (Spanish)",
              text: '"¿En qué infraestructura de nube se ejecuta principalmente su empresa?"'
            },
            ja: {
              label: "Target Output: JA (Japanese)",
              text: '"貴社は主にどのクラウドインフラを使用していますか？"'
            },
            fr: {
              label: "Target Output: FR (French)",
              text: '"Sur quelle infrastructure de cloud votre entreprise fonctionne-t-elle principalement?"'
            }
          };

          const changeLang = (lang) => {
            btns.forEach(b => {
              if (b.getAttribute('data-lang') === lang) {
                b.style.background = 'rgba(4,203,194,0.1)';
                b.style.borderColor = '#04cbc2';
                b.style.color = '#ffffff';
              } else {
                b.style.background = 'rgba(255,255,255,0.03)';
                b.style.borderColor = 'rgba(255,255,255,0.08)';
                b.style.color = 'var(--text-muted)';
              }
            });

            progress.style.opacity = '1';
            progressBar.style.width = '0%';
            transStatus.textContent = 'Translating...';
            transStatus.style.color = '#f59e0b';
            
            let pWidth = 0;
            const tInterval = setInterval(() => {
              pWidth += 20;
              progressBar.style.width = pWidth + '%';
              if (pWidth >= 100) {
                clearInterval(tInterval);
                progress.style.opacity = '0';
                transLabel.textContent = translations[lang].label;
                transText.textContent = translations[lang].text;
                transStatus.textContent = '✓ Synced';
                transStatus.style.color = '#10b981';
              }
            }, 80);
          };

          let idx = 0;
          const langs = ['en', 'de', 'es', 'ja', 'fr'];
          
          const cycleLangs = () => {
            idx = (idx + 1) % langs.length;
            changeLang(langs[idx]);
          };
          
          const cycleTimer = setInterval(cycleLangs, 3500);

          btns.forEach(b => {
            b.addEventListener('click', () => {
              clearInterval(cycleTimer);
              const l = b.getAttribute('data-lang');
              idx = langs.indexOf(l);
              changeLang(l);
            });
          });

          return () => clearInterval(cycleTimer);
        }
      };
    }
  },
  processing: {
    badge: "Data Cleanliness",
    title: "Data Processing & Delivery",
    desc: "Run automated data cleansing pipelines to filter out fraudulent entries. The ETL engine audits speeds, device fingerprints, VPN proxy headers, and duplicate entries to compile clean datasets.",
    capabilities: [
      { title: "ETL Cleansing Pipeline", text: "Runs datasets through a 12-point quality validation loop to identify cognitive anomalies." },
      { title: "Speeder & Bot Filters", text: "Flag and quarantine respondents who run script bots or bypass questionnaire reading timelines." },
      { title: "IP & VPN Shield", text: "Blocks duplicate IP entries and rejects traffic routing through anonymous VPN proxy networks." },
      { title: "Multi-Format Export", text: "One-click data compiles exported cleanly into SPSS (.sav), raw CSV text, and Microsoft Excel sheets." }
    ],
    architecture: "Applies cleaning algorithms at the data ingestion gateway, forwarding audited logs to secure S3 storage blocks.",
    caption: "ETL Data Pipeline & Live Cleanliness Grid",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; box-sizing: border-box;">
            <!-- Pipeline Nodes Flow -->
            <div style="background: rgba(0,0,0,0.3); padding: 12px; height: 100px; border-bottom: 1px solid rgba(4,203,194,0.15); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-around; flex-shrink:0; box-sizing: border-box;">
              <svg width="100%" height="100%" viewBox="0 0 360 80" style="position: absolute; top: 0; left: 0;">
                <!-- Connective lines -->
                <line x1="45" y1="40" x2="315" y2="40" stroke="rgba(255,255,255,0.05)" stroke-width="6" stroke-linecap="round" />
                <line id="etl-flow-line" x1="45" y1="40" x2="315" y2="40" stroke="#04cbc2" stroke-width="6" stroke-linecap="round" stroke-dasharray="15, 120" stroke-dashoffset="0" />
                <!-- Nodes -->
                <circle cx="45" cy="40" r="14" fill="#04524e" stroke="#04cbc2" stroke-width="2" />
                <circle cx="135" cy="40" r="14" fill="#04524e" stroke="#04cbc2" stroke-width="2" />
                <circle cx="225" cy="40" r="14" fill="#04524e" stroke="#04cbc2" stroke-width="2" />
                <circle cx="315" cy="40" r="14" fill="#04524e" stroke="#04cbc2" stroke-width="2" />
              </svg>
              <div style="z-index: 2; text-align: center; font-size: 8px; color: #ffffff; font-weight: bold; width: 60px;">INGEST<br><span style="color: #04cbc2; font-family: monospace;">[INPUT]</span></div>
              <div style="z-index: 2; text-align: center; font-size: 8px; color: #ffffff; font-weight: bold; width: 60px;">VPN CHECK<br><span style="color: #04cbc2; font-family: monospace;">[SHIELD]</span></div>
              <div style="z-index: 2; text-align: center; font-size: 8px; color: #ffffff; font-weight: bold; width: 60px;">SPEEDER<br><span style="color: #04cbc2; font-family: monospace;">[AUDIT]</span></div>
              <div style="z-index: 2; text-align: center; font-size: 8px; color: #ffffff; font-weight: bold; width: 60px;">SYNC<br><span style="color: #10b981; font-family: monospace;">[DELIVER]</span></div>
            </div>
            <!-- Live Table Grid -->
            <div style="flex-grow: 1; padding: 12px; overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box;">
              <div style="display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; font-weight: bold; margin-bottom: 6px; text-transform: uppercase; flex-shrink:0;">
                <span>Live Audited Sessions</span>
                <span style="color: #10b981;" id="processed-count">Total Cleansed: 2481</span>
              </div>
              <!-- Table rows container -->
              <div id="etl-table" style="display: flex; flex-direction: column; gap: 4px; overflow: hidden; flex-grow: 1; font-family: monospace; font-size: 10px; box-sizing: border-box;">
                <!-- Row 1 -->
                <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); padding: 6px 10px; border-radius: 4px;">
                  <span style="color: #ffffff;">#28841-A</span>
                  <span style="color: #94a3b8;">LOI: 312s</span>
                  <span style="color: #10b981; font-weight: bold;">[PASS]</span>
                </div>
              </div>
            </div>
          </div>
        `,
        init: () => {
          const table = document.getElementById('etl-table');
          const pCount = document.getElementById('processed-count');
          const flowLine = document.getElementById('etl-flow-line');
          if (!table || !pCount || !flowLine) return;
          
          let totalCleansed = 2481;
          let offset = 0;
          
          const flowInterval = setInterval(() => {
            offset -= 2;
            if (flowLine) flowLine.style.strokeDashoffset = offset;
          }, 30);

          const sessionIds = ['#28842-B', '#28843-C', '#28844-D', '#28845-E', '#28846-F', '#28847-G', '#28848-H', '#28849-I'];
          const faults = [
            { status: '[PASS]', color: '#10b981', loi: '341s' },
            { status: '[PASS]', color: '#10b981', loi: '402s' },
            { status: '[FAIL: Speeder]', color: '#ef4444', loi: '42s' },
            { status: '[PASS]', color: '#10b981', loi: '280s' },
            { status: '[FAIL: Proxy]', color: '#f59e0b', loi: '315s' },
            { status: '[PASS]', color: '#10b981', loi: '381s' }
          ];

          let rowIdx = 0;

          const addTableRow = () => {
            if (!table || !pCount) return;
            rowIdx++;
            const id = sessionIds[rowIdx % sessionIds.length];
            const fault = faults[Math.floor(Math.random() * faults.length)];
            
            if (fault.status === '[PASS]') {
              totalCleansed++;
              pCount.textContent = 'Total Cleansed: ' + totalCleansed;
            }

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justify = 'space-between';
            row.style.background = 'rgba(255,255,255,0.02)';
            row.style.border = '1px solid ' + (fault.color === '#10b981' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)');
            row.style.padding = '6px 10px';
            row.style.borderRadius = '4px';
            row.style.opacity = '0';
            row.style.transform = 'translateY(-10px)';
            row.style.transition = 'all 0.3s ease';

            row.innerHTML = '<span style="color: #ffffff;">' + id + '</span><span style="color: #94a3b8;">LOI: ' + fault.loi + '</span><span style="color: ' + fault.color + '; font-weight: bold;">' + fault.status + '</span>';

            table.insertBefore(row, table.firstChild);
            
            setTimeout(() => {
              row.style.opacity = '1';
              row.style.transform = 'translateY(0)';
            }, 50);

            if (table.children.length > 4) {
              table.removeChild(table.lastChild);
            }
          };

          for(let i=0; i<3; i++) { addTableRow(); }
          const tableInterval = setInterval(addTableRow, 2500);

          return () => {
            clearInterval(flowInterval);
            clearInterval(tableInterval);
          };
        }
      };
    }
  },
  consulting: {
    badge: "Business Intelligence",
    title: "Strategic Insights & Reporting",
    desc: "Transform raw survey completions into executive summaries, interactive dashboards, and boardroom-ready strategic recommendations compiled by our analysts.",
    capabilities: [
      { title: "Interactive Dashboards", text: "Create custom client portal filters to cross-tabulate demographics, regions, and dates on the fly." },
      { title: "Executive Summaries", text: "Synthesized executive recommendation decks compiled by market analysts outlining key strategic actions." },
      { title: "Significance Audits", text: "Statistical testing calculations mapping margin-of-error parameters and data confidence scores." },
      { title: "Editable Presentations", text: "Direct templates export into fully-formatted, editable PowerPoint slides decks and PDF structures." }
    ],
    architecture: "Queries normalized database layers to generate BI visualization streams using secure GraphQL schemas.",
    caption: "SaaS Business Intelligence Analytics Dashboard",
    getVisual: () => {
      return {
        html: `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #070f0e; font-family: 'Space Grotesk', sans-serif; overflow: hidden; padding: 12px; box-sizing: border-box; justify-content: space-between;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; flex-shrink:0;">
              <span style="font-size: 11px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px;">EXECUTIVE BI PANEL</span>
              <span style="font-size: 9px; color: #10b981; font-family: monospace;">✓ Live Report Sync</span>
            </div>
            <!-- Core Visual Widgets -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex-grow: 1; margin: 8px 0; overflow: hidden; box-sizing: border-box;">
              <!-- Left top: Donut chart -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Completes Score</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <svg width="40" height="40" viewBox="0 0 36 36" style="transform: rotate(-90deg); flex-shrink:0;">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="4" />
                    <circle id="bi-donut" cx="18" cy="18" r="15.915" fill="none" stroke="#04cbc2" stroke-width="4" stroke-dasharray="100, 100" stroke-dashoffset="100" style="transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);" />
                  </svg>
                  <div>
                    <div style="font-size: 14px; font-weight: 700; color: #ffffff;" id="bi-score-txt">72%</div>
                    <div style="font-size: 8px; color: #94a3b8; line-height:1;">Reliability</div>
                  </div>
                </div>
              </div>
              <!-- Right top: Line Graph -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Trend Line</div>
                <div style="height: 40px; width: 100%;">
                  <svg width="100%" height="100%" viewBox="0 0 160 40" style="overflow:visible;">
                    <path id="bi-line" d="M0,35 Q30,15 60,25 T120,5 T160,20" fill="none" stroke="#04cbc2" stroke-width="2.5" stroke-linecap="round" />
                  </svg>
                </div>
              </div>
              <!-- Left bottom: Live Feed logs -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; gap: 4px; overflow: hidden; box-sizing: border-box;">
                <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; flex-shrink:0;">Completed Feeds</div>
                <div style="font-family: monospace; font-size: 8px; color: #10b981; white-space:nowrap;">➔ Healthcare Panel: 100%</div>
                <div style="font-family: monospace; font-size: 8px; color: #04cbc2; white-space:nowrap;">➔ IT Leader Panel: 98%</div>
              </div>
              <!-- Right bottom: Vertical Columns Graph -->
              <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Confidence</div>
                <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 35px; padding-top: 4px; box-sizing: border-box;">
                  <div id="bi-bar-1" style="width: 10px; height: 40%; background: #04cbc2; border-radius: 2px; transition: height 1.5s ease-in-out;"></div>
                  <div id="bi-bar-2" style="width: 10px; height: 75%; background: #04cbc2; border-radius: 2px; transition: height 1.5s ease-in-out;"></div>
                  <div id="bi-bar-3" style="width: 10px; height: 90%; background: #10b981; border-radius: 2px; transition: height 1.5s ease-in-out;"></div>
                </div>
              </div>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; font-family: monospace; font-size: 9px; color: #94a3b8; text-align: center; flex-shrink:0; box-sizing: border-box;">
              Database Status: <span style="color: #10b981;">CLEANSED & NORMALIZED</span>
            </div>
          </div>
        `,
        init: () => {
          const donut = document.getElementById('bi-donut');
          const score = document.getElementById('bi-score-txt');
          const line = document.getElementById('bi-line');
          const bar1 = document.getElementById('bi-bar-1');
          const bar2 = document.getElementById('bi-bar-2');
          const bar3 = document.getElementById('bi-bar-3');

          if (line) {
            const length = 200;
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;
            setTimeout(() => {
              line.style.transition = 'stroke-dashoffset 2s ease-in-out';
              line.style.strokeDashoffset = '0';
            }, 200);
          }

          if (donut) {
            donut.style.strokeDashoffset = '100';
            setTimeout(() => {
              donut.style.strokeDashoffset = '28';
            }, 500);
          }

          const updateBars = () => {
            if (bar1 && bar2 && bar3) {
              bar1.style.height = (Math.floor(Math.random() * 40) + 30) + '%';
              bar2.style.height = (Math.floor(Math.random() * 30) + 55) + '%';
              bar3.style.height = (Math.floor(Math.random() * 20) + 80) + '%';
            }
          };
          updateBars();
          const barTimer = setInterval(updateBars, 3000);

          return () => clearInterval(barTimer);
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
