// Research COPS - Solutions Detail Page Controller
// Renders dynamic technical summaries and custom interactive SVG simulations for all 9 solutions.

const SOLUTION_DATA = {
  management: {
    badge: "Operations Infrastructure",
    title: "Full-Cycle Project Management",
    desc: "From initial RFP scoping to final delivery, our dedicated project management team handles the entire lifecycle of your studies. We coordinate logistics, manage quotas, enforce quality checkpoints, and provide real-time dashboards so you can focus on analysis.",
    capabilities: [
      { title: "RFP & Feasibility Scoping", text: "Detailed audience analysis and cost estimates within 24 hours of brief." },
      { title: "Active Quota Management", text: "Real-time monitoring and adjustment of demographic cohorts to prevent over-target completes." },
      { title: "Multi-Vendor Orchestration", text: "We coordinate with global partners, managing all communication and delivery details." },
      { title: "Daily Status Telemetry", text: "Receive daily automated progress reports and live telemetry links for your projects." }
    ],
    architecture: "Built on our internal Project Operations Control Plane (PO-CP), our system monitors field speed, completion ratios, and drop-out locations, dynamically adjusting routers to optimize response collection speeds.",
    caption: "Operational project roadmap milestone simulation",
    getVisual: () => {
      return {
        html: `
          <svg width="100%" height="100%" viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
              .node-pulse { animation: pulse 2s infinite; }
              .active-line { stroke-dasharray: 8 4; animation: dash 20s linear infinite; }
              .checkmark { stroke-dasharray: 20; stroke-dashoffset: 20; animation: draw-check 0.8s ease forwards; }
              @keyframes pulse {
                0% { r: 12; fill: rgba(4, 203, 194, 0.2); }
                50% { r: 18; fill: rgba(4, 203, 194, 0.4); }
                100% { r: 12; fill: rgba(4, 203, 194, 0.2); }
              }
              @keyframes dash { to { stroke-dashoffset: -1000; } }
              @keyframes draw-check { to { stroke-dashoffset: 0; } }
              .label-text { font-family: 'Space Grotesk', sans-serif; font-size: 11px; fill: #94a3b8; font-weight: 500; }
              .header-text { font-family: 'Space Grotesk', sans-serif; font-size: 13px; fill: #ffffff; font-weight: 600; }
              .status-text { font-family: monospace; font-size: 11px; fill: #04cbc2; }
            </style>
            <!-- Grid Lines -->
            <path d="M10 50 H390 M10 100 H390 M10 150 H390 M10 200 H390 M10 250 H390 M10 300 H390" stroke="rgba(255,255,255,0.02)" stroke-width="1" />
            
            <!-- Connection Lines -->
            <path d="M 60,190 L 200,190" id="line-1" stroke="rgba(4, 203, 194, 0.2)" stroke-width="3" />
            <path d="M 200,190 L 340,190" id="line-2" stroke="rgba(255, 255, 255, 0.1)" stroke-width="3" />
            
            <path d="M 60,190 L 200,190" id="line-1-active" class="active-line" stroke="#04cbc2" stroke-width="3" style="display: none;" />
            <path d="M 200,190 L 340,190" id="line-2-active" class="active-line" stroke="#04cbc2" stroke-width="3" style="display: none;" />

            <!-- Milestone 1 -->
            <circle cx="60" cy="190" r="16" fill="rgba(10,20,20,0.8)" stroke="#04cbc2" stroke-width="2" id="node-1" />
            <circle cx="60" cy="190" r="12" fill="none" class="node-pulse" id="pulse-1" style="display: none;" />
            
            <!-- Milestone 2 -->
            <circle cx="200" cy="190" r="16" fill="rgba(10,20,20,0.8)" stroke="rgba(255,255,255,0.15)" stroke-width="2" id="node-2" />
            <circle cx="200" cy="190" r="12" fill="none" class="node-pulse" id="pulse-2" style="display: none;" />

            <!-- Milestone 3 -->
            <circle cx="340" cy="190" r="16" fill="rgba(10,20,20,0.8)" stroke="rgba(255,255,255,0.15)" stroke-width="2" id="node-3" />
            <circle cx="340" cy="190" r="12" fill="none" class="node-pulse" id="pulse-3" style="display: none;" />

            <!-- Labels -->
            <text x="60" y="150" text-anchor="middle" class="header-text">1. RFP Scoping</text>
            <text x="60" y="230" text-anchor="middle" class="label-text" id="node-1-status">Waiting</text>
            
            <text x="200" y="150" text-anchor="middle" class="header-text">2. Field Launch</text>
            <text x="200" y="230" text-anchor="middle" class="label-text" id="node-2-status">Waiting</text>

            <text x="340" y="150" text-anchor="middle" class="header-text">3. Quality Clean</text>
            <text x="340" y="230" text-anchor="middle" class="label-text" id="node-3-status">Waiting</text>

            <!-- Live Status Console -->
            <rect x="20" y="280" width="360" height="60" rx="6" fill="rgba(0,0,0,0.3)" stroke="rgba(4,203,194,0.1)" />
            <text x="40" y="315" class="status-text" id="console-output">> Initializing project scheduler...</text>
          </svg>
        `,
        init: () => {
          let stage = 0;
          const consoleOutput = document.getElementById('console-output');
          const node1 = document.getElementById('node-1');
          const node2 = document.getElementById('node-2');
          const node3 = document.getElementById('node-3');
          const pulse1 = document.getElementById('pulse-1');
          const pulse2 = document.getElementById('pulse-2');
          const pulse3 = document.getElementById('pulse-3');
          const line1 = document.getElementById('line-1-active');
          const line2 = document.getElementById('line-2-active');
          
          const s1 = document.getElementById('node-1-status');
          const s2 = document.getElementById('node-2-status');
          const s3 = document.getElementById('node-3-status');

          const runTimeline = () => {
            if (stage === 0) {
              // Node 1 Active
              node1.setAttribute('stroke', '#04cbc2');
              node2.setAttribute('stroke', 'rgba(255,255,255,0.15)');
              node3.setAttribute('stroke', 'rgba(255,255,255,0.15)');
              pulse1.style.display = 'block';
              pulse2.style.display = 'none';
              pulse3.style.display = 'none';
              line1.style.display = 'none';
              line2.style.display = 'none';
              s1.textContent = 'Active...';
              s1.style.fill = '#04cbc2';
              s2.textContent = 'Waiting';
              s2.style.fill = '#94a3b8';
              s3.textContent = 'Waiting';
              s3.style.fill = '#94a3b8';
              consoleOutput.textContent = '> [SYSTEM] Feasibility engine analyzing target parameters...';
              stage = 1;
            } else if (stage === 1) {
              // Node 1 Complete, Transition to Node 2
              node1.setAttribute('stroke', '#10b981');
              pulse1.style.display = 'none';
              s1.textContent = '✓ Scoped';
              s1.style.fill = '#10b981';
              
              line1.style.display = 'block';
              node2.setAttribute('stroke', '#04cbc2');
              pulse2.style.display = 'block';
              s2.textContent = 'In Field...';
              s2.style.fill = '#04cbc2';
              consoleOutput.textContent = '> [FIELD] Distributing survey router. Real-time quota filling...';
              stage = 2;
            } else if (stage === 2) {
              // Node 2 Complete, Transition to Node 3
              node2.setAttribute('stroke', '#10b981');
              pulse2.style.display = 'none';
              s2.textContent = '✓ Collected';
              s2.style.fill = '#10b981';
              
              line2.style.display = 'block';
              node3.setAttribute('stroke', '#04cbc2');
              pulse3.style.display = 'block';
              s3.textContent = 'Auditing...';
              s3.style.fill = '#04cbc2';
              consoleOutput.textContent = '> [QUALITY] Running speeder & deduplication script algorithms...';
              stage = 3;
            } else if (stage === 3) {
              // Node 3 Complete
              node3.setAttribute('stroke', '#10b981');
              pulse3.style.display = 'none';
              s3.textContent = '✓ Delivered';
              s3.style.fill = '#10b981';
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
    caption: "Global routing nodes & sample packets traffic",
    getVisual: () => {
      return {
        html: `
          <svg width="100%" height="100%" viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
              .glow-pulse { animation: radial-pulse 3s infinite; }
              .packet { animation: motion 4s linear infinite; }
              @keyframes radial-pulse {
                0% { r: 15; opacity: 0.15; }
                50% { r: 25; opacity: 0.35; }
                100% { r: 15; opacity: 0.15; }
              }
              .map-dot { fill: rgba(255,255,255,0.06); }
              .core-text { font-family: 'Space Grotesk', sans-serif; font-size: 11px; fill: #ffffff; font-weight: 600; }
              .node-text { font-family: 'Space Grotesk', sans-serif; font-size: 10px; fill: #94a3b8; }
            </style>
            <!-- Map background abstraction -->
            <g class="map-dot">
              <circle cx="50" cy="70" r="2" /><circle cx="70" cy="65" r="2" /><circle cx="90" cy="80" r="2" />
              <circle cx="60" cy="120" r="2" /><circle cx="80" cy="140" r="2" /><circle cx="100" cy="110" r="2" />
              <circle cx="280" cy="70" r="2" /><circle cx="310" cy="85" r="2" /><circle cx="330" cy="60" r="2" />
              <circle cx="290" cy="130" r="2" /><circle cx="320" cy="140" r="2" /><circle cx="340" cy="110" r="2" />
              <circle cx="120" cy="270" r="2" /><circle cx="140" cy="290" r="2" /><circle cx="160" cy="260" r="2" />
              <circle cx="260" cy="280" r="2" /><circle cx="280" cy="300" r="2" /><circle cx="300" cy="270" r="2" />
            </g>

            <!-- Connection lines to core -->
            <line x1="90" y1="90" x2="200" y2="190" stroke="rgba(4,203,194,0.3)" stroke-width="1.5" stroke-dasharray="3 3" />
            <line x1="310" y1="90" x2="200" y2="190" stroke="rgba(4,203,194,0.3)" stroke-width="1.5" stroke-dasharray="3 3" />
            <line x1="100" y1="290" x2="200" y2="190" stroke="rgba(4,203,194,0.3)" stroke-width="1.5" stroke-dasharray="3 3" />
            <line x1="300" y1="290" x2="200" y2="190" stroke="rgba(4,203,194,0.3)" stroke-width="1.5" stroke-dasharray="3 3" />

            <!-- Core routing node -->
            <circle cx="200" cy="190" r="20" fill="var(--teal-brand)" opacity="0.3" class="glow-pulse" />
            <circle cx="200" cy="190" r="14" fill="#04524e" stroke="#04cbc2" stroke-width="2" />
            <text x="200" y="194" text-anchor="middle" class="core-text">OpinionGenie</text>

            <!-- Satellite US Node -->
            <circle cx="90" cy="90" r="8" fill="rgba(10,20,20,0.8)" stroke="#04cbc2" stroke-width="2" />
            <text x="90" y="74" text-anchor="middle" class="node-text">US B2B</text>

            <!-- Satellite EU Node -->
            <circle cx="310" cy="90" r="8" fill="rgba(10,20,20,0.8)" stroke="#04cbc2" stroke-width="2" />
            <text x="310" y="74" text-anchor="middle" class="node-text">Europe Core</text>

            <!-- Satellite LATAM Node -->
            <circle cx="100" cy="290" r="8" fill="rgba(10,20,20,0.8)" stroke="#04cbc2" stroke-width="2" />
            <text x="100" y="312" text-anchor="middle" class="node-text">LATAM Hub</text>

            <!-- Satellite APAC Node -->
            <circle cx="300" cy="290" r="8" fill="rgba(10,20,20,0.8)" stroke="#04cbc2" stroke-width="2" />
            <text x="300" y="312" text-anchor="middle" class="node-text">APAC Core</text>

            <!-- Animated Packets using animateMotion -->
            <circle r="3" fill="#04cbc2">
              <animateMotion dur="3s" repeatCount="indefinite" path="M 90,90 L 200,190" />
            </circle>
            <circle r="3" fill="#10b981">
              <animateMotion dur="4.2s" repeatCount="indefinite" path="M 200,190 L 310,90" />
            </circle>
            <circle r="3" fill="#04cbc2">
              <animateMotion dur="3.5s" repeatCount="indefinite" path="M 100,290 L 200,190" />
            </circle>
            <circle r="3" fill="#10b981">
              <animateMotion dur="2.8s" repeatCount="indefinite" path="M 200,190 L 300,290" />
            </circle>
          </svg>
        `,
        init: () => {
          // Pure CSS and declarative SVG animations run autonomously here.
          return () => {};
        }
      };
    }
  },
  development: {
    badge: "Research Design",
    title: "Survey Design & Methodology",
    desc: "Optimize survey engagement, completion rates, and cognitive load. Our research architects design questionnaire structures that reduce respondent fatigue and prevent bias.",
    capabilities: [
      { title: "Questionnaire Optimization", text: "Structuring question phrasing and layouts for optimal mobile and desktop completions." },
      { title: "Bias Mitigation Rules", text: "Applying randomization, rotation, and screeners to prevent response styling." },
      { title: "Cognitive Load Mapping", text: "Analyzing response times per question to highlight areas causing survey drop-off." },
      { title: "Methodology Advisory", text: "Guidance on sampling frames, weighting, and representative profiling." }
    ],
    architecture: "Utilizes historical response analytics models to score questionnaires on complexity, predictive completion rate, and fatigue indices prior to launching in field.",
    caption: "Methodological logic tree & respondent paths",
    getVisual: () => {
      return {
        html: `
          <svg width="100%" height="100%" viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
              .branch-line { stroke: rgba(255,255,255,0.08); stroke-width: 1.5; }
              .highlight-line { stroke-width: 2; stroke-dasharray: 5 5; animation: pipe-dash 15s linear infinite; }
              @keyframes pipe-dash { to { stroke-dashoffset: -500; } }
              .step-lbl { font-family: 'Space Grotesk', sans-serif; font-size: 11px; fill: #ffffff; font-weight: 500; }
              .condition-lbl { font-family: monospace; font-size: 9px; fill: #04cbc2; }
            </style>
            <!-- Tree connections -->
            <path d="M 200,50 L 200,120" class="branch-line" />
            <path d="M 200,120 L 90,200" class="branch-line" />
            <path d="M 200,120 L 310,200" class="branch-line" />
            <path d="M 90,200 L 200,280" class="branch-line" />
            <path d="M 310,200 L 200,280" class="branch-line" />

            <!-- Active glowing paths -->
            <path d="M 200,50 L 200,120 L 90,200 L 200,280" class="highlight-line" stroke="rgba(4,203,194,0.4)" />
            <path d="M 200,50 L 200,120 L 310,200 L 200,280" class="highlight-line" stroke="rgba(16,185,129,0.4)" />

            <!-- Tree nodes -->
            <!-- Root -->
            <rect x="140" y="30" width="120" height="30" rx="4" fill="rgba(10,20,20,0.8)" stroke="#04cbc2" stroke-width="1.5" />
            <text x="200" y="48" text-anchor="middle" class="step-lbl">Screener Gate</text>

            <!-- Branch Split -->
            <circle cx="200" cy="120" r="14" fill="#04524e" stroke="#04cbc2" stroke-width="1.5" />
            <text x="200" y="124" text-anchor="middle" class="step-lbl" style="font-size: 10px;">IF</text>

            <!-- Branch Left -->
            <rect x="30" y="185" width="120" height="30" rx="4" fill="rgba(10,20,20,0.8)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
            <text x="90" y="203" text-anchor="middle" class="step-lbl">B2B Route</text>
            <text x="145" y="155" class="condition-lbl">Decision Maker</text>

            <!-- Branch Right -->
            <rect x="250" y="185" width="120" height="30" rx="4" fill="rgba(10,20,20,0.8)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
            <text x="310" y="203" text-anchor="middle" class="step-lbl">Consumer Route</text>
            <text x="215" y="155" class="condition-lbl">General Pub</text>

            <!-- Merge -->
            <rect x="140" y="265" width="120" height="30" rx="4" fill="rgba(10,20,20,0.8)" stroke="#10b981" stroke-width="1.5" />
            <text x="200" y="283" text-anchor="middle" class="step-lbl">Quota Validation</text>

            <!-- Moving respondent dot streams -->
            <circle r="4" fill="#04cbc2">
              <animateMotion dur="4s" repeatCount="indefinite" path="M 200,50 L 200,120 L 90,200 L 200,280" />
            </circle>
            <circle r="4" fill="#10b981" begin="2s">
              <animateMotion dur="4s" repeatCount="indefinite" path="M 200,50 L 200,120 L 310,200 L 200,280" />
            </circle>
          </svg>
        `,
        init: () => {
          return () => {};
        }
      };
    }
  },
  programming: {
    badge: "Systems Engineering",
    title: "Advanced Survey Programming",
    desc: "Transform complex questionnaires into interactive, robust web surveys. We support advanced skip logics, multimedia integration, complex quotas, and device-responsive styling.",
    capabilities: [
      { title: "Complex Skip & Branching", text: "Deploying nested logic rules, loops, and show/hide constraints based on answers." },
      { title: "Dynamic Text Piping", text: "Injecting answers from previous questions into headers and choices in real-time." },
      { title: "Multimedia Stimuli Integration", text: "Securely hosting and tracking interactions with video, audio, and image assets." },
      { title: "Device-Adaptive Styling", text: "Custom CSS layout overlays optimizing survey rendering on mobile, tablet, and desktop." }
    ],
    architecture: "Deploys HTML5/JS widgets and integrates with core engines (Decipher, Qualtrics, Confirmit) via custom JavaScript APIs to manage complex data captures and validation checks.",
    caption: "Code console simulator typing script validations",
    getVisual: () => {
      return {
        html: `
          <div style="display: grid; grid-template-columns: 1.1fr 1fr; width: 100%; height: 100%; font-family: monospace; font-size: 11px; background: rgba(5,10,10,0.55);">
            <!-- Left Pane: Code Editor -->
            <div style="border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; overflow: hidden;">
              <div style="background: rgba(0,0,0,0.3); padding: 8px; color: var(--text-muted); font-size: 10px; border-bottom: 1px solid rgba(255,255,255,0.05);">validation_schema.js</div>
              <pre id="editor-code" style="margin: 0; padding: 12px; color: #04cbc2; line-height: 1.4; overflow: hidden; white-space: pre-wrap; word-break: break-all;"></pre>
            </div>
            <!-- Right Pane: Terminal Console -->
            <div style="display: flex; flex-direction: column; overflow: hidden;">
              <div style="background: rgba(0,0,0,0.3); padding: 8px; color: var(--text-muted); font-size: 10px; border-bottom: 1px solid rgba(255,255,255,0.05);">runtime_console</div>
              <div id="console-logs" style="margin: 0; padding: 12px; color: var(--text-body); line-height: 1.5; overflow: hidden; display: flex; flex-direction: column; gap: 6px;"></div>
            </div>
          </div>
        `,
        init: () => {
          const editor = document.getElementById('editor-code');
          const terminal = document.getElementById('console-logs');
          
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
            { text: "[OK] Init Validation Schema module", color: "#10b981" },
            { text: "[API] Connecting to redirect servers...", color: "#94a3b8" },
            { text: "[OK] API Router connection active", color: "#10b981" },
            { text: "[RUN] Listening on port 443...", color: "#04cbc2" },
            { text: "[PASS] Session ID #2841: Valid IP", color: "#10b981" },
            { text: "[PASS] Session ID #2841: Attention check Q4 ok", color: "#10b981" },
            { text: "[BLOCK] Session ID #2842: Speed alert (LOI 112s)", color: "#ef4444" },
            { text: "[API] Callback triggered for complete #2841", color: "#04cbc2" }
          ];

          let codeCharIdx = 0;
          let codeLineIdx = 0;
          let logIdx = 0;

          const typeCode = () => {
            if (codeLineIdx < codeLines.length) {
              const currentLineText = codeLines[codeLineIdx];
              if (codeCharIdx <= currentLineText.length) {
                editor.textContent = codeLines.slice(0, codeLineIdx).join('\n') + '\n' + currentLineText.substring(0, codeCharIdx) + '_';
                codeCharIdx++;
              } else {
                codeLineIdx++;
                codeCharIdx = 0;
              }
            } else {
              // Reset editor when full
              setTimeout(() => {
                editor.textContent = "";
                codeCharIdx = 0;
                codeLineIdx = 0;
              }, 4000);
            }
          };

          const addLog = () => {
            if (logIdx < consoleLogs.length) {
              const log = consoleLogs[logIdx];
              const logLine = document.createElement('div');
              logLine.style.color = log.color;
              logLine.textContent = log.text;
              terminal.appendChild(logLine);
              logIdx++;

              // Keep console scrolled to bottom
              terminal.scrollTop = terminal.scrollHeight;
            } else {
              setTimeout(() => {
                terminal.innerHTML = "";
                logIdx = 0;
              }, 2000);
            }
          };

          const codeInterval = setInterval(typeCode, 40);
          const logInterval = setInterval(addLog, 1500);

          return () => {
            clearInterval(codeInterval);
            clearInterval(logInterval);
          };
        }
      };
    }
  },
  translations: {
    badge: "Localization & Global",
    title: "Multi-Language Localization",
    desc: "Translate and adapt your studies for a global audience. We preserve logical integrity and semantic nuances across more than 25 languages.",
    capabilities: [
      { title: "Expert Translation Review", text: "Experienced linguists specialized in market research adapt survey text." },
      { title: "Logic Integrity Preservation", text: "Ensuring routing instructions and text piping work seamlessly post-translation." },
      { title: "Overlay File Compiling", text: "Compiling clean XML, Excel, or JSON translation overlay sheets for survey software imports." },
      { title: "Cultural Adaptation (Localization)", text: "Adjusting currency, formatting, and cultural references to ensure high-fidelity responses." }
    ],
    architecture: "Utilizes a localized terms dictionary schema combined with manual translation verification to prevent encoding discrepancies and keep survey skip rules functional.",
    caption: "Real-time multilingual translation switcher",
    getVisual: () => {
      return {
        html: `
          <div style="display: flex; flex-direction: column; width: 100%; height: 100%; padding: 20px; box-sizing: border-box; justify-content: space-between;">
            <!-- Language buttons -->
            <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;">
              <button class="lang-btn active" data-lang="en" style="background: rgba(4,203,194,0.1); border: 1px solid #04cbc2; color: #ffffff; padding: 6px 12px; border-radius: 4px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.3s;">EN</button>
              <button class="lang-btn" data-lang="de" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 6px 12px; border-radius: 4px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.3s;">DE</button>
              <button class="lang-btn" data-lang="es" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 6px 12px; border-radius: 4px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.3s;">ES</button>
              <button class="lang-btn" data-lang="ja" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 6px 12px; border-radius: 4px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.3s;">JA</button>
            </div>

            <!-- Translate display area -->
            <div class="glass-card" style="padding: 24px; text-align: center; background: rgba(0,0,0,0.3); border: 1px solid rgba(4,203,194,0.08); flex-grow: 1; display: flex; flex-direction: column; justify-content: center; transition: all 0.3s;" id="trans-card">
              <span id="trans-label" style="font-family: monospace; font-size: 10px; color: var(--turquoise-accent); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.1em;">Target Output Language: EN</span>
              <p id="trans-text" style="font-family: var(--font-family-display); font-size: 18px; color: #ffffff; line-height: 1.5; font-weight: 500; transition: opacity 0.3s;">
                "Which cloud infrastructure does your company primarily run on?"
              </p>
            </div>
            
            <!-- Connection indicators -->
            <div style="text-align: center; margin-top: 15px; font-family: monospace; font-size: 11px; color: #10b981;">
              ✓ Logic check intact: <span style="color: #ffffff;">[Skip Rule #4: Active]</span>
            </div>
          </div>
        `,
        init: () => {
          const btns = document.querySelectorAll('.lang-btn');
          const transCard = document.getElementById('trans-card');
          const transLabel = document.getElementById('trans-label');
          const transText = document.getElementById('trans-text');

          const translations = {
            en: {
              label: "Target Output Language: EN (English)",
              text: '"Which cloud infrastructure does your company primarily run on?"'
            },
            de: {
              label: "Target Output Language: DE (German)",
              text: '"Auf welcher Cloud-Infrastruktur läuft Ihr Unternehmen hauptsächlich?"'
            },
            es: {
              label: "Target Output Language: ES (Spanish)",
              text: '"¿En qué infraestructura de nube se ejecuta principalmente su empresa?"'
            },
            ja: {
              label: "Target Output Language: JA (Japanese)",
              text: '"貴社は主にどのクラウドインフラを使用していますか？"'
            }
          };

          const changeLang = (lang) => {
            // Remove active classes
            btns.forEach(b => {
              b.classList.remove('active');
              b.style.background = 'rgba(255,255,255,0.03)';
              b.style.borderColor = 'rgba(255,255,255,0.08)';
              b.style.color = 'var(--text-muted)';
            });

            // Set active
            const activeBtn = Array.from(btns).find(b => b.getAttribute('data-lang') === lang);
            if (activeBtn) {
              activeBtn.style.background = 'rgba(4,203,194,0.1)';
              activeBtn.style.borderColor = '#04cbc2';
              activeBtn.style.color = '#ffffff';
            }

            // Animate card swap
            transText.style.opacity = '0';
            setTimeout(() => {
              transLabel.textContent = translations[lang].label;
              transText.textContent = translations[lang].text;
              transText.style.opacity = '1';
            }, 300);
          };

          // Attach click actions
          btns.forEach(btn => {
            btn.addEventListener('click', () => {
              clearInterval(rotateTimer);
              const lang = btn.getAttribute('data-lang');
              changeLang(lang);
            });
          });

          // Auto rotate
          const langs = ['en', 'de', 'es', 'ja'];
          let currentIdx = 0;
          const rotate = () => {
            currentIdx = (currentIdx + 1) % langs.length;
            changeLang(langs[currentIdx]);
          };
          const rotateTimer = setInterval(rotate, 3500);

          return () => clearInterval(rotateTimer);
        }
      };
    }
  },
  processing: {
    badge: "Data Pipeline",
    title: "Data Processing & Delivery",
    desc: "Receive clean, formatted, and validated datasets. We apply automated cleaning pipelines to filter invalid data and deliver files in SPSS, CSV, or custom analytics formats.",
    capabilities: [
      { title: "12-Point Quality Framework", text: "Automated filters flag duplicates, speeders, straight-liners, and bots." },
      { title: "Custom Data Exports", text: "Format delivery in fully labeled SPSS (.sav), comma-separated values (.csv), or Excel." },
      { title: "Open-End Coding", text: "Linguistic categorization of open-text responses into structured analysis codes." },
      { title: "Cross-Tabulation Engines", text: "Generate data tables, banner sheets, and significance testing reports." }
    ],
    architecture: "Processed data flows through an ETL pipeline built on Node/Python that parses respondent metadata, runs validation modules, and exports clean databases.",
    caption: "Data purification pipeline conveyor system",
    getVisual: () => {
      return {
        html: `
          <svg width="100%" height="100%" viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
              .pipe { stroke: rgba(255,255,255,0.06); stroke-width: 8; stroke-linecap: round; }
              .pipe-glow { stroke: #04cbc2; stroke-width: 8; stroke-linecap: round; stroke-dasharray: 10 110; animation: pipe-travel 6s linear infinite; }
              .filter-gate { fill: rgba(10,20,20,0.9); stroke: rgba(255,255,255,0.15); stroke-width: 1.5; }
              .gate-lbl { font-family: monospace; font-size: 8px; fill: #64748b; font-weight: bold; }
              .counter-val { font-family: monospace; font-size: 15px; fill: #10b981; font-weight: bold; }
              .counter-lbl { font-family: 'Space Grotesk', sans-serif; font-size: 9px; fill: #94a3b8; }
              @keyframes pipe-travel { to { stroke-dashoffset: -360; } }
            </style>
            <!-- Background Lines -->
            <path d="M 50,190 L 350,190" class="pipe" />
            <path d="M 50,190 L 350,190" class="pipe-glow" />

            <!-- Filter Barrier 1 -->
            <rect x="120" y="150" width="30" height="80" rx="4" class="filter-gate" id="gate-1" />
            <text x="135" y="140" text-anchor="middle" class="gate-lbl">GEO-IP</text>

            <!-- Filter Barrier 2 -->
            <rect x="200" y="150" width="30" height="80" rx="4" class="filter-gate" id="gate-2" />
            <text x="215" y="140" text-anchor="middle" class="gate-lbl">DUPS</text>

            <!-- Filter Barrier 3 -->
            <rect x="280" y="150" width="30" height="80" rx="4" class="filter-gate" id="gate-3" />
            <text x="295" y="140" text-anchor="middle" class="gate-lbl">SPEEDS</text>

            <!-- Containers -->
            <text x="50" y="115" text-anchor="middle" class="gate-lbl" style="fill: var(--turquoise-accent); font-size: 10px;">RAW DATA</text>
            <circle cx="50" cy="190" r="14" fill="#060f0e" stroke="rgba(4,203,194,0.3)" stroke-width="1.5" />

            <text x="350" y="115" text-anchor="middle" class="gate-lbl" style="fill: var(--emerald-success); font-size: 10px;">CLEAN DATA</text>
            <circle cx="350" cy="190" r="14" fill="#060f0e" stroke="rgba(16,185,129,0.3)" stroke-width="1.5" />

            <!-- Counters and Dashboard -->
            <rect x="20" y="270" width="360" height="70" rx="6" fill="rgba(0,0,0,0.3)" stroke="rgba(4,203,194,0.06)" />
            
            <g transform="translate(45, 290)">
              <text x="0" y="18" class="counter-val" id="total-processed" style="fill: var(--turquoise-accent);">0</text>
              <text x="0" y="32" class="counter-lbl">Total Inputs</text>
            </g>
            <g transform="translate(170, 290)">
              <text x="0" y="18" class="counter-val" id="total-rejected" style="fill: #ef4444;">0</text>
              <text x="0" y="32" class="counter-lbl">Fraud Blocked</text>
            </g>
            <g transform="translate(290, 290)">
              <text x="0" y="18" class="counter-val" id="total-clean">0</text>
              <text x="0" y="32" class="counter-lbl">Completes</text>
            </g>

            <!-- Dynamic Node Streams -->
            <circle r="4" fill="#04cbc2" id="node-active" style="display:none;"></circle>
          </svg>
        `,
        init: () => {
          let processed = 2100;
          let rejected = 244;
          let clean = 1856;

          const activeNode = document.getElementById('node-active');
          const gate1 = document.getElementById('gate-1');
          const gate2 = document.getElementById('gate-2');
          const gate3 = document.getElementById('gate-3');

          const tProcessed = document.getElementById('total-processed');
          const tRejected = document.getElementById('total-rejected');
          const tClean = document.getElementById('total-clean');

          tProcessed.textContent = processed;
          tRejected.textContent = rejected;
          tClean.textContent = clean;

          const runEtlAnimation = () => {
            activeNode.style.display = 'block';
            let pos = 50;
            let speed = 4;
            let nodeType = Math.random(); // 0-0.7: clean, 0.7-0.8: GeoIP fraud, 0.8-0.9: Duplicate, 0.9-1.0: Speeder

            activeNode.setAttribute('cx', pos);
            activeNode.setAttribute('cy', 190);

            if (nodeType < 0.7) {
              activeNode.setAttribute('fill', '#10b981'); // Green (Clean)
            } else if (nodeType < 0.8) {
              activeNode.setAttribute('fill', '#ef4444'); // Red (GeoIP Fail)
            } else if (nodeType < 0.9) {
              activeNode.setAttribute('fill', '#f59e0b'); // Yellow (Dup)
            } else {
              activeNode.setAttribute('fill', '#ec4899'); // Pink (Speeder)
            }

            const frame = () => {
              pos += speed;
              activeNode.setAttribute('cx', pos);

              // Collision checkpoints
              if (pos >= 120 && pos <= 130) {
                if (nodeType >= 0.7 && nodeType < 0.8) {
                  // Blocked by Geo-IP
                  gate1.setAttribute('fill', '#ef4444');
                  rejected++;
                  tRejected.textContent = rejected;
                  processed++;
                  tProcessed.textContent = processed;
                  setTimeout(() => gate1.setAttribute('fill', 'rgba(10,20,20,0.9)'), 300);
                  activeNode.style.display = 'none';
                  clearInterval(animTimer);
                  return;
                }
              }

              if (pos >= 200 && pos <= 210) {
                if (nodeType >= 0.8 && nodeType < 0.9) {
                  // Blocked by Duplicate Filter
                  gate2.setAttribute('fill', '#f59e0b');
                  rejected++;
                  tRejected.textContent = rejected;
                  processed++;
                  tProcessed.textContent = processed;
                  setTimeout(() => gate2.setAttribute('fill', 'rgba(10,20,20,0.9)'), 300);
                  activeNode.style.display = 'none';
                  clearInterval(animTimer);
                  return;
                }
              }

              if (pos >= 280 && pos <= 290) {
                if (nodeType >= 0.9) {
                  // Blocked by Speeder check
                  gate3.setAttribute('fill', '#ec4899');
                  rejected++;
                  tRejected.textContent = rejected;
                  processed++;
                  tProcessed.textContent = processed;
                  setTimeout(() => gate3.setAttribute('fill', 'rgba(10,20,20,0.9)'), 300);
                  activeNode.style.display = 'none';
                  clearInterval(animTimer);
                  return;
                }
              }

              if (pos >= 350) {
                // Completed successfully!
                processed++;
                tProcessed.textContent = processed;
                clean++;
                tClean.textContent = clean;
                activeNode.style.display = 'none';
                clearInterval(animTimer);
              }
            };

            const animTimer = setInterval(frame, 16);
          };

          runEtlAnimation();
          const loopTimer = setInterval(runEtlAnimation, 1800);

          return () => {
            clearInterval(loopTimer);
          };
        }
      };
    }
  },
  consulting: {
    badge: "Business Intelligence",
    title: "Strategic Insights & Reporting",
    desc: "Convert raw numbers into boardroom-ready intelligence. Our strategic analysts build executive summaries, core statistical charts, and interactive dashboards to support decision-making.",
    capabilities: [
      { title: "Executive Presentation Decks", text: "Summarizing complex studies into high-impact PowerPoint summaries." },
      { title: "Statistical Significance", text: "Conducting t-tests, z-tests, and correlation analysis to find true drivers." },
      { title: "Interactive BI Dashboards", text: "Building visual dashboards utilizing PowerBI, Tableau, or custom web portals." },
      { title: "Recommendation Matrix", text: "Mapping insights to strategic business initiatives and operational opportunities." }
    ],
    architecture: "Leverages custom charting libraries and statistical algorithms to analyze data sets and output formatted vector graphs and dashboards.",
    caption: "Real-time drawing charts & dashboard metrics",
    getVisual: () => {
      return {
        html: `
          <svg width="100%" height="100%" viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
              .chart-line { stroke: #04cbc2; stroke-width: 2.5; stroke-linecap: round; }
              .chart-fill { fill: url(#chart-grad); fill-opacity: 0.1; }
              .grid-line { stroke: rgba(255,255,255,0.03); stroke-width: 1.5; }
              .bar-rect { fill: url(#bar-grad); transition: height 1s ease; }
              .donut-track { stroke: rgba(255,255,255,0.05); stroke-width: 10; fill: none; }
              .donut-fill { stroke: #10b981; stroke-width: 10; fill: none; stroke-linecap: round; stroke-dasharray: 120 200; }
              .lbl { font-family: 'Space Grotesk', sans-serif; font-size: 10px; fill: #94a3b8; }
              .stat-num { font-family: monospace; font-size: 16px; fill: #ffffff; font-weight: bold; }
            </style>
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#04cbc2" />
                <stop offset="100%" stop-color="#04cbc2" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="bar-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#04cbc2" />
                <stop offset="100%" stop-color="#04524e" />
              </linearGradient>
            </defs>

            <!-- Background Grid -->
            <path d="M 40,50 L 360,50 M 40,100 L 360,100 M 40,150 L 360,150" class="grid-line" />

            <!-- Left: Line Chart Area -->
            <g transform="translate(10, 20)">
              <!-- Axis -->
              <line x1="30" y1="160" x2="190" y2="160" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
              <line x1="30" y1="40" x2="30" y2="160" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

              <!-- Line path -->
              <path d="M 30,140 Q 60,90 90,110 T 150,50 T 190,70" class="chart-line" id="line-graph" />
              <!-- Fill under line -->
              <path d="M 30,140 Q 60,90 90,110 T 150,50 T 190,70 L 190,160 L 30,160 Z" class="chart-fill" id="line-fill" />
              
              <!-- Draw circles on peak points -->
              <circle cx="150" cy="50" r="4" fill="#10b981" />
              <text x="150" y="38" text-anchor="middle" class="lbl" style="fill: #10b981; font-weight: bold;">Peak Trend</text>
            </g>

            <!-- Right: Circular Donut Widget -->
            <g transform="translate(280, 100)">
              <circle cx="0" cy="0" r="30" class="donut-track" />
              <circle cx="0" cy="0" r="30" class="donut-fill" id="donut-slice" />
              <text x="0" y="4" text-anchor="middle" class="stat-num" style="font-size: 11px;">72%</text>
              <text x="0" y="48" text-anchor="middle" class="lbl">Correlation</text>
            </g>

            <!-- Bottom: 3-column data boxes -->
            <rect x="20" y="240" width="360" height="90" rx="8" fill="rgba(10,20,20,0.8)" stroke="rgba(4,203,194,0.06)" />
            
            <g transform="translate(45, 265)">
              <text x="0" y="18" class="stat-num" id="insight-completes">2,480</text>
              <text x="0" y="32" class="lbl">Completes Audited</text>
              <text x="0" y="48" class="lbl" style="fill: #10b981;">✓ 100% Validated</text>
            </g>
            <g transform="translate(170, 265)">
              <text x="0" y="18" class="stat-num">95.4%</text>
              <text x="0" y="32" class="lbl">Confidence Level</text>
              <text x="0" y="48" class="lbl" style="fill: var(--turquoise-accent);">Standard Alpha 0.05</text>
            </g>
            <g transform="translate(290, 265)">
              <text x="0" y="18" class="stat-num">±1.9%</text>
              <text x="0" y="32" class="lbl">Margin of Error</text>
              <text x="0" y="48" class="lbl" style="fill: #f59e0b;">Confidence Interval</text>
            </g>
          </svg>
        `,
        init: () => {
          const lGraph = document.getElementById('line-graph');
          const lFill = document.getElementById('line-fill');
          const donut = document.getElementById('donut-slice');
          const counter = document.getElementById('insight-completes');

          // Animate line chart path drawing
          if (lGraph && lFill) {
            const length = 250;
            lGraph.style.strokeDasharray = length;
            lGraph.style.strokeDashoffset = length;
            lFill.style.opacity = '0';

            const drawGraph = () => {
              lGraph.style.strokeDashoffset = length;
              lFill.style.opacity = '0';

              setTimeout(() => {
                lGraph.style.transition = 'stroke-dashoffset 2s ease-in-out';
                lGraph.style.strokeDashoffset = '0';
              }, 100);

              setTimeout(() => {
                lFill.style.transition = 'opacity 1s ease';
                lFill.style.opacity = '1';
              }, 1800);
            };
            drawGraph();
            var lineTimer = setInterval(drawGraph, 8000);
          }

          // Animate Donut Gauge
          if (donut) {
            donut.style.strokeDashoffset = '200';
            setTimeout(() => {
              donut.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)';
              donut.style.strokeDashoffset = '60'; // 72% filled
            }, 500);
          }

          // Counter ticker
          let compVal = 2480;
          const tickCompletes = () => {
            compVal += Math.floor(Math.random() * 3) + 1;
            counter.textContent = compVal.toLocaleString();
          };
          const counterTimer = setInterval(tickCompletes, 2000);

          return () => {
            clearInterval(lineTimer);
            clearInterval(counterTimer);
          };
        }
      };
    }
  },
  automation: {
    badge: "Consulting & SaaS",
    title: "Business Consulting & Automation",
    desc: "Optimize operational workflows and design custom automated pipelines. We advise on SaaS strategy, product layouts, and system integration to scale efficiency.",
    capabilities: [
      { title: "Workflow Audit & Blueprinting", text: "Mapping out manual processes to identify bottlenecks and design automation plans." },
      { title: "Custom SaaS Architecture", text: "Designing databases, API structures, and micro-frontend layouts for operations." },
      { title: "Systems Integration Mapping", text: "Connecting legacy CRM/ERP tools with modern SaaS platforms via webhooks." },
      { title: "Scale Advisory", text: "Consulting on product engineering, team operations, and tech stack choices." }
    ],
    architecture: "We build secure serverless orchestration models using AWS Lambda, Google Cloud Functions, or low-code infrastructure to automate business events.",
    caption: "Operational webhook event routing schematic",
    getVisual: () => {
      return {
        html: `
          <svg width="100%" height="100%" viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
              .schematic-box { fill: rgba(10,20,20,0.85); stroke: rgba(255,255,255,0.08); stroke-width: 1.5; }
              .active-pulse { animation: glow 2s infinite; }
              .link-arrow { stroke-width: 2; stroke-dasharray: 4 4; animation: flow-travel 10s linear infinite; }
              .lbl-node { font-family: 'Space Grotesk', sans-serif; font-size: 10px; fill: #ffffff; font-weight: 500; }
              .status-box { font-family: monospace; font-size: 9px; fill: #94a3b8; }
              @keyframes flow-travel { to { stroke-dashoffset: -200; } }
              @keyframes glow {
                0% { filter: drop-shadow(0 0 2px rgba(4,203,194,0.1)); }
                50% { filter: drop-shadow(0 0 8px rgba(4,203,194,0.6)); }
                100% { filter: drop-shadow(0 0 2px rgba(4,203,194,0.1)); }
              }
            </style>

            <!-- Flow Paths -->
            <path d="M 90,80 L 200,80" class="link-arrow" stroke="#04cbc2" id="arrow-1" />
            <path d="M 200,80 L 310,80" class="link-arrow" stroke="rgba(255,255,255,0.08)" id="arrow-2" />
            <path d="M 200,110 L 200,180" class="link-arrow" stroke="rgba(255,255,255,0.08)" id="arrow-3" />
            
            <!-- Webhook card (Start) -->
            <rect x="20" y="50" width="70" height="60" rx="4" class="schematic-box" stroke="#04cbc2" id="node-wh" />
            <text x="55" y="80" text-anchor="middle" class="lbl-node">Webhook</text>
            <text x="55" y="98" text-anchor="middle" class="status-box" id="wh-stat">TRIGGER</text>

            <!-- Lambda Engine (Center) -->
            <rect x="160" y="50" width="80" height="60" rx="4" class="schematic-box" id="node-lm" />
            <text x="200" y="80" text-anchor="middle" class="lbl-node">Orchestrator</text>
            <text x="200" y="98" text-anchor="middle" class="status-box" id="lm-stat">IDLE</text>

            <!-- Slack Alert (Branch A) -->
            <rect x="310" y="50" width="70" height="60" rx="4" class="schematic-box" id="node-sk" />
            <text x="345" y="80" text-anchor="middle" class="lbl-node">Slack Alert</text>
            <text x="345" y="98" text-anchor="middle" class="status-box" id="sk-stat">IDLE</text>

            <!-- DB Sync (Branch B) -->
            <rect x="160" y="180" width="80" height="60" rx="4" class="schematic-box" id="node-db" />
            <text x="200" y="210" text-anchor="middle" class="lbl-node">Database Sync</text>
            <text x="200" y="228" text-anchor="middle" class="status-box" id="db-stat">IDLE</text>

            <!-- Logs terminal output -->
            <rect x="20" y="270" width="360" height="70" rx="6" fill="rgba(0,0,0,0.35)" stroke="rgba(4,203,194,0.06)" />
            <text x="40" y="300" font-family="monospace" font-size="10px" fill="#10b981" id="log-line-1">> Operational event monitor active.</text>
            <text x="40" y="320" font-family="monospace" font-size="10px" fill="#94a3b8" id="log-line-2">> System status: listening for complete events...</text>
          </svg>
        `,
        init: () => {
          let step = 0;
          
          const nodeWh = document.getElementById('node-wh');
          const nodeLm = document.getElementById('node-lm');
          const nodeSk = document.getElementById('node-sk');
          const nodeDb = document.getElementById('node-db');

          const statWh = document.getElementById('wh-stat');
          const statLm = document.getElementById('lm-stat');
          const statSk = document.getElementById('sk-stat');
          const statDb = document.getElementById('db-stat');

          const arrow1 = document.getElementById('arrow-1');
          const arrow2 = document.getElementById('arrow-2');
          const arrow3 = document.getElementById('arrow-3');

          const log1 = document.getElementById('log-line-1');
          const log2 = document.getElementById('log-line-2');

          const runFlow = () => {
            if (step === 0) {
              // Webhook fires
              nodeWh.setAttribute('stroke', '#04cbc2');
              nodeWh.classList.add('active-pulse');
              statWh.textContent = 'FIRED!';
              statWh.style.fill = '#04cbc2';
              
              statLm.textContent = 'IDLE'; statLm.style.fill = '#64748b';
              statSk.textContent = 'IDLE'; statSk.style.fill = '#64748b';
              statDb.textContent = 'IDLE'; statDb.style.fill = '#64748b';

              nodeLm.setAttribute('stroke', 'rgba(255,255,255,0.08)');
              nodeSk.setAttribute('stroke', 'rgba(255,255,255,0.08)');
              nodeDb.setAttribute('stroke', 'rgba(255,255,255,0.08)');
              nodeLm.classList.remove('active-pulse');
              nodeSk.classList.remove('active-pulse');
              nodeDb.classList.remove('active-pulse');

              arrow1.setAttribute('stroke', '#04cbc2');
              arrow2.setAttribute('stroke', 'rgba(255,255,255,0.08)');
              arrow3.setAttribute('stroke', 'rgba(255,255,255,0.08)');

              log1.textContent = '> [EVENT] Webhook received complete: Respondent #4829';
              log1.style.fill = '#04cbc2';
              log2.textContent = '> [PENDING] Dispatching to central orchestrator router...';
              step = 1;
            } else if (step === 1) {
              // Orchestrator processing
              nodeWh.classList.remove('active-pulse');
              nodeWh.setAttribute('stroke', '#10b981');
              statWh.textContent = 'RESOLVED';
              statWh.style.fill = '#10b981';

              nodeLm.setAttribute('stroke', '#04cbc2');
              nodeLm.classList.add('active-pulse');
              statLm.textContent = 'ROUTING...';
              statLm.style.fill = '#04cbc2';

              arrow2.setAttribute('stroke', '#04cbc2');
              arrow3.setAttribute('stroke', '#04cbc2');

              log1.textContent = '> [ROUTING] Complete #4829 meets target validation parameters.';
              log1.style.fill = '#10b981';
              log2.textContent = '> [PROCESS] Triggering parallel Slack notification & ERP sync pipelines.';
              step = 2;
            } else if (step === 2) {
              // Slack & DB fires
              nodeLm.classList.remove('active-pulse');
              nodeLm.setAttribute('stroke', '#10b981');
              statLm.textContent = 'COMPLETED';
              statLm.style.fill = '#10b981';

              nodeSk.setAttribute('stroke', '#10b981');
              nodeSk.classList.add('active-pulse');
              statSk.textContent = 'SENT';
              statSk.style.fill = '#10b981';

              nodeDb.setAttribute('stroke', '#10b981');
              nodeDb.classList.add('active-pulse');
              statDb.textContent = 'SYNCED';
              statDb.style.fill = '#10b981';

              log1.textContent = '> [SUCCESS] Slack notification posted to #operations channel.';
              log1.style.fill = '#10b981';
              log2.textContent = '> [SUCCESS] PostgreSQL client profile database synchronized.';
              step = 0;
            }
          };

          runFlow();
          const timer = setInterval(runFlow, 3500);

          return () => clearInterval(timer);
        }
      };
    }
  },
  "workflow-hub": {
    badge: "Enterprise Platform",
    title: "Enterprise Workflow Automation Hub",
    desc: "Supercharge your business operations. Our unified automation platform bridges the gap between hiring systems, finance tools, client analytics dashboards, and employee performance metrics.",
    capabilities: [
      { title: "HRMS & Onboarding Pipelines", text: "Automating candidate screening, onboarding checklists, email provisioning, and payroll database sync." },
      { title: "Financial Billing Audits", text: "Real-time billing matching, automated cash-flow ledger reconciliations, and secure invoice payouts." },
      { title: "Executive Analytics Dashboard", text: "Consolidating logistics, client health indexes, and warehouse operations database logs." },
      { title: "Performance Coaching Logic", text: "Tracking employee metrics and automatically compiling/delivering coaching summaries." }
    ],
    architecture: "Core workflow orchestrator running on secure microservice networks with OAuth2 integrations, custom schema mapping middleware, and 99.9% uptime SLA.",
    caption: "Central automation hub core engine matrix",
    getVisual: () => {
      return {
        html: `
          <svg width="100%" height="100%" viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <style>
              .ring-rot-1 { transform-origin: 200px 190px; animation: rot-clockwise 20s linear infinite; }
              .ring-rot-2 { transform-origin: 200px 190px; animation: rot-counter 15s linear infinite; }
              .connection-pulse { stroke-dasharray: 4 4; stroke: rgba(4,203,194,0.3); animation: dash-path 8s linear infinite; }
              .sat-box { fill: rgba(10,20,20,0.9); stroke: rgba(255,255,255,0.08); stroke-width: 1.5; }
              .txt-bold { font-family: 'Space Grotesk', sans-serif; font-size: 11px; fill: #ffffff; font-weight: 600; }
              .txt-dim { font-family: monospace; font-size: 8px; fill: #04cbc2; }
              @keyframes rot-clockwise { to { transform: rotate(360deg); } }
              @keyframes rot-counter { to { transform: rotate(-360deg); } }
              @keyframes dash-path { to { stroke-dashoffset: -100; } }
            </style>
            <!-- Core Matrix rings -->
            <circle cx="200" cy="190" r="50" stroke="rgba(4,203,194,0.15)" stroke-width="1" />
            <circle cx="200" cy="190" r="50" stroke="#04cbc2" stroke-width="1.5" class="ring-rot-1" stroke-dasharray="25 60 10 30" />
            
            <circle cx="200" cy="190" r="30" stroke="rgba(16,185,129,0.15)" stroke-width="1" />
            <circle cx="200" cy="190" r="30" stroke="#10b981" stroke-width="1" class="ring-rot-2" stroke-dasharray="10 30 5 15" />

            <!-- Core Hub Center -->
            <circle cx="200" cy="190" r="16" fill="#04524e" stroke="#04cbc2" stroke-width="2" />
            <text x="200" y="194" text-anchor="middle" font-family="monospace" font-size="10px" fill="#ffffff" font-weight="bold">HUB</text>

            <!-- Connections to Satellite Boxes -->
            <path d="M 200,140 L 200,80" class="connection-pulse" />
            <path d="M 200,240 L 200,300" class="connection-pulse" />
            <path d="M 150,190 L 80,190" class="connection-pulse" />
            <path d="M 250,190 L 320,190" class="connection-pulse" />

            <!-- Sat 1: HRMS (Top) -->
            <rect x="150" y="40" width="100" height="40" rx="4" class="sat-box" stroke="#04cbc2" />
            <text x="200" y="58" text-anchor="middle" class="txt-bold">HRMS Core</text>
            <text x="200" y="70" text-anchor="middle" class="txt-dim" id="sat-hrms-log">PROVISIONING</text>

            <!-- Sat 2: Billing (Bottom) -->
            <rect x="150" y="300" width="100" height="40" rx="4" class="sat-box" stroke="rgba(255,255,255,0.08)" />
            <text x="200" y="318" text-anchor="middle" class="txt-bold">Financial Ops</text>
            <text x="200" y="330" text-anchor="middle" class="txt-dim" style="color:#64748b;" id="sat-finance-log">MONITORING</text>

            <!-- Sat 3: Analytics (Left) -->
            <rect x="20" y="170" width="60" height="40" rx="4" class="sat-box" stroke="rgba(255,255,255,0.08)" />
            <text x="50" y="188" text-anchor="middle" class="txt-bold" style="font-size: 9px;">BI Report</text>
            <text x="50" y="200" text-anchor="middle" class="txt-dim" style="color:#64748b;" id="sat-bi-log">ACTIVE</text>

            <!-- Sat 4: Coach (Right) -->
            <rect x="320" y="170" width="60" height="40" rx="4" class="sat-box" stroke="rgba(255,255,255,0.08)" />
            <text x="350" y="188" text-anchor="middle" class="txt-bold" style="font-size: 9px;">Coach Engine</text>
            <text x="350" y="200" text-anchor="middle" class="txt-dim" style="color:#64748b;" id="sat-coach-log">ACTIVE</text>

            <!-- Floating Data Packets -->
            <circle r="3.5" fill="#04cbc2">
              <animateMotion dur="2.5s" repeatCount="indefinite" path="M 200,140 L 200,80" />
            </circle>
            <circle r="3.5" fill="#10b981" begin="1s">
              <animateMotion dur="3s" repeatCount="indefinite" path="M 200,240 L 200,300" />
            </circle>
            <circle r="3.5" fill="#04cbc2">
              <animateMotion dur="2.8s" repeatCount="indefinite" path="M 150,190 L 80,190" />
            </circle>
            <circle r="3.5" fill="#10b981">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M 320,190 L 250,190" />
            </circle>
          </svg>
        `,
        init: () => {
          let tick = 0;
          const hrmsLog = document.getElementById('sat-hrms-log');
          const financeLog = document.getElementById('sat-finance-log');
          const biLog = document.getElementById('sat-bi-log');
          const coachLog = document.getElementById('sat-coach-log');

          const updateSatLogs = () => {
            tick++;
            if (tick % 4 === 1) {
              hrmsLog.textContent = "PAYROLL VERIFY"; hrmsLog.style.fill = "#10b981";
              financeLog.textContent = "BILL MATCHED"; financeLog.style.fill = "#10b981";
            } else if (tick % 4 === 2) {
              biLog.textContent = "DAILY DIGEST"; biLog.style.fill = "#04cbc2";
              coachLog.textContent = "METRIC ANALYZED"; coachLog.style.fill = "#10b981";
            } else if (tick % 4 === 3) {
              hrmsLog.textContent = "SYNC COMPLETE"; hrmsLog.style.fill = "#10b981";
              financeLog.textContent = "AUDITING FLOW"; financeLog.style.fill = "#04cbc2";
            } else {
              hrmsLog.textContent = "ACTIVE MON"; hrmsLog.style.fill = "#64748b";
              financeLog.textContent = "IDLE"; financeLog.style.fill = "#64748b";
              biLog.textContent = "ACTIVE"; biLog.style.fill = "#64748b";
              coachLog.textContent = "ACTIVE"; coachLog.style.fill = "#64748b";
            }
          };

          const timer = setInterval(updateSatLogs, 2500);
          return () => clearInterval(timer);
        }
      };
    }
  }
};

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

  // 6. SupportGenie Widget Actions (Identical to app.js chatbot layout triggers)
  const genieTrigger = document.getElementById('support-genie-trigger');
  const genieBox = document.getElementById('support-genie-box');
  const genieClose = document.getElementById('chatbox-close');
  const chatForm = document.getElementById('chatbox-input-form');
  const chatInput = document.getElementById('chatbox-input');
  const chatLogs = document.getElementById('chatbox-messages');

  if (genieTrigger && genieBox && genieClose) {
    let chatOnboarded = false;
    let typingIndicatorElement = null;

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
        <div class="chat-message-avatar"><img src="support_genie_avatar.png" alt="SupportGenie" class="genie-avatar-img"></div>
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

    const triggerChatOnboarding = () => {
      if (chatOnboarded) return;
      chatOnboarded = true;

      // Clear the container
      chatLogs.innerHTML = '';

      showTypingIndicator();

      setTimeout(() => {
        hideTypingIndicator();
        addBotMessage("Hello! I am <strong>SupportGenie</strong>, your virtual assistant. How can I help you today?");
        
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          addBotMessage("Select a quick topic below or type your question:");
          
          // Render chips dynamically
          const chipsContainer = document.createElement('div');
          chipsContainer.className = 'chat-chips-container';
          const chipsData = [
            { label: "📊 CPI Estimate & Calculator", chip: "pricing" },
            { label: "👥 Workflow Automation Hub", chip: "workflow" },
            { label: "🔒 Enterprise ERP & Integrations", chip: "integrations" },
            { label: "✉ Get Custom Quote & Demo", chip: "quote" }
          ];

          chipsData.forEach(data => {
            const btn = document.createElement('button');
            btn.className = 'chat-chip';
            btn.setAttribute('data-chip', data.chip);
            btn.textContent = data.label;
            btn.addEventListener('click', () => {
              handleChipClick(btn);
            });
            chipsContainer.appendChild(btn);
          });
          chatLogs.appendChild(chipsContainer);
          chatLogs.scrollTop = chatLogs.scrollHeight;
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
        triggerChatOnboarding();
      });
    }

    genieTrigger.addEventListener('click', () => {
      if (welcomeBubble) welcomeBubble.classList.remove('active');
      sessionStorage.setItem('genie_welcome_closed', 'true');
      
      const isOpening = !genieBox.classList.contains('active');
      genieBox.classList.toggle('active');
      if (isOpening) {
        triggerChatOnboarding();
      }
    });

    genieClose.addEventListener('click', () => {
      genieBox.classList.remove('active');
    });

    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;

        addUsrMessage(msg);
        chatInput.value = '';

        showTypingIndicator();

        // Standard auto response
        setTimeout(() => {
          hideTypingIndicator();
          addBotMessage("Thank you for your message! Our bidding and technical teams will review your request. For immediate quotes, please use our CPI Estimator on the homepage.");
        }, 1200);
      });
    }

    // Handle Quick Reply chips
    const handleChipClick = (chip) => {
      const text = chip.textContent;
      addUsrMessage(text);
      
      showTypingIndicator();

      setTimeout(() => {
        hideTypingIndicator();
        const chipType = chip.getAttribute('data-chip');
        if (chipType === 'pricing') {
          addBotMessage("To estimate pricing in real-time, click 'Launch Audience Estimator' at the bottom of the page to redirect to our CPI calculator.");
        } else if (chipType === 'workflow') {
          addBotMessage("Our Enterprise Workflow Hub routes HR, Billing, BI Reports, and performance coaching models. Select 'Enterprise Workflow Hub' from our solutions menu to see the architecture.");
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
});
