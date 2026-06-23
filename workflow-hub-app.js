/**
 * Research Centric Ops - Enterprise Workflow Automation Core
 * Interactive Dashboard & Simulator Logic (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. LIVE SYSTEM TIME CLOCK
  // ==========================================
  const liveDateSpan = document.getElementById('sim-live-date');
  const liveTimeSpan = document.getElementById('sim-live-time');
  const welcomeLiveDate = document.getElementById('welcome-live-date');

  function updateLiveClock() {
    const now = new Date();
    
    // Format Date: e.g., 11 Jun 2026
    const day = now.getDate();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const weekday = weekdays[now.getDay()];
    
    if (liveDateSpan) {
      liveDateSpan.textContent = `${day} ${month} ${year}`;
    }
    if (welcomeLiveDate) {
      welcomeLiveDate.textContent = `${weekday}, ${day} ${months[now.getMonth()]} ${year}`;
    }

    // Format Time: e.g., 02:30:15 am
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    if (liveTimeSpan) {
      liveTimeSpan.textContent = strTime;
    }
  }

  // Update clock every second
  setInterval(updateLiveClock, 1000);
  updateLiveClock();


  // ==========================================
  // 2. VIEW SWAPPING (LANDING VS SIMULATOR)
  // ==========================================
  const landingView = document.getElementById('landing-view');
  const simulatorView = document.getElementById('simulator-view');
  const launchSimulatorBtns = document.querySelectorAll('.btn-launch-simulator');
  const closeSimulatorBtn = document.getElementById('btn-close-simulator');
  const sidebarSignOutBtn = document.getElementById('btn-sidebar-signout');

  function toggleSimulatorMode(show) {
    if (show) {
      landingView.style.display = 'none';
      simulatorView.style.display = 'block';
      updateLiveClock();
    } else {
      landingView.style.display = 'block';
      simulatorView.style.display = 'none';
    }
  }

  launchSimulatorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('modal-login-gate');
      if (modal) modal.classList.add('active');
    });
  });

  if (closeSimulatorBtn) {
    closeSimulatorBtn.addEventListener('click', () => {
      isSessionActive = false;
      toggleSimulatorMode(false);
    });
  }
  if (sidebarSignOutBtn) {
    sidebarSignOutBtn.addEventListener('click', () => {
      isSessionActive = false;
      toggleSimulatorMode(false);
    });
  }

  // "Open Demo" shortcuts inside Landing Page modules cards (Gate Protected)
  const simShortcuts = document.querySelectorAll('.btn-sim-shortcut');
  simShortcuts.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTab = e.currentTarget.getAttribute('data-target');
      if (!isSessionActive) {
        pendingTargetTab = targetTab;
        const modal = document.getElementById('modal-login-gate');
        if (modal) modal.classList.add('active');
      } else {
        toggleSimulatorMode(true);
        switchSimulatorTab(targetTab);
      }
    });
  });


  // ==========================================
  // 3. COLLAPSIBLE SIDEBAR & MODULE ROUTER
  // ==========================================
  const navCategoryGroups = document.querySelectorAll('.nav-category-group');
  const navItemBtns = document.querySelectorAll('.nav-item-btn');
  const viewportPanels = document.querySelectorAll('.sim-content-pane > div');
  const simHeaderTitle = document.getElementById('sim-view-header-title');

  // Collapse / Expand Category Groups
  navCategoryGroups.forEach(group => {
    const headerBtn = group.querySelector('.nav-cat-header');
    headerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = group.classList.contains('active');
      
      // Close other category groups
      navCategoryGroups.forEach(g => g.classList.remove('active'));
      
      // Toggle current group
      if (!isActive) {
        group.classList.add('active');
      }
    });
  });

  // Switch Sub-tabs Viewports
  function switchSimulatorTab(targetId) {
    // 1. Update Sidebar Active Button
    navItemBtns.forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        btn.classList.add('active');
        // Ensure its parent category group is expanded
        const parentGroup = btn.closest('.nav-category-group');
        navCategoryGroups.forEach(g => g.classList.remove('active'));
        parentGroup.classList.add('active');
        
        // Update top header title text
        if (simHeaderTitle) {
          const categoryName = parentGroup.querySelector('.nav-cat-header span').textContent;
          simHeaderTitle.textContent = btn.textContent;
          document.querySelector('.top-sub-breadcrumb').textContent = `DeepSight Insights / ${categoryName}`;
        }
      } else {
        btn.classList.remove('active');
      }
    });

    // 2. Toggle active viewport panel
    viewportPanels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  navItemBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-target');
      switchSimulatorTab(targetId);
    });
  });

  // Link to View Monthly Attendance from Dashboard
  const linkViewMonthlyAttendance = document.getElementById('link-view-monthly-attendance');
  if (linkViewMonthlyAttendance) {
    linkViewMonthlyAttendance.addEventListener('click', (e) => {
      e.preventDefault();
      switchSimulatorTab('tab-hr-attendance');
    });
  }


  // ==========================================
  // 4. CORE HR: ATTENDANCE CLOCKING SIMULATOR
  // ==========================================
  const btnClockBreak = document.getElementById('btn-clock-break');
  const btnClockEndBreak = document.getElementById('btn-clock-end-break');
  const btnClockLogout = document.getElementById('btn-clock-logout');

  const dashboardStatusLabel = document.getElementById('dashboard-status-label');
  const clockFirstLogin = document.getElementById('clock-first-login');
  const clockLastLogout = document.getElementById('clock-last-logout');

  const shiftHoursTimer = document.getElementById('shift-hours-timer');
  const shiftEffectiveTimer = document.getElementById('shift-effective-timer');
  const shiftBreakTimer = document.getElementById('shift-break-timer');

  let breakSeconds = 0;
  let effectiveSeconds = 19 * 3600 + 41 * 60 + 24; // starting at 19:41:24
  let shiftSeconds = 0; // Starts at 00:00:00 as shown in Screenshot 1
  
  let attendanceState = 'present'; // present, break, loggedout
  let timerInterval = null;

  function formatDuration(totalSecs) {
    const h = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const s = String(totalSecs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function startAttendanceTimers() {
    timerInterval = setInterval(() => {
      if (attendanceState === 'present') {
        effectiveSeconds++;
        shiftSeconds++;
        if (shiftHoursTimer) shiftHoursTimer.textContent = formatDuration(shiftSeconds);
        if (shiftEffectiveTimer) shiftEffectiveTimer.textContent = formatDuration(effectiveSeconds);
      } else if (attendanceState === 'break') {
        breakSeconds++;
        if (shiftBreakTimer) shiftBreakTimer.textContent = formatDuration(breakSeconds);
      }
    }, 1000);
  }

  // Start timers on startup
  startAttendanceTimers();

  if (btnClockBreak) {
    btnClockBreak.addEventListener('click', () => {
      attendanceState = 'break';
      if (dashboardStatusLabel) {
        dashboardStatusLabel.textContent = 'On Break';
        dashboardStatusLabel.className = 'val text-amber';
      }
      btnClockBreak.disabled = true;
      btnClockEndBreak.disabled = false;
    });
  }

  if (btnClockEndBreak) {
    btnClockEndBreak.addEventListener('click', () => {
      attendanceState = 'present';
      if (dashboardStatusLabel) {
        dashboardStatusLabel.textContent = 'Present';
        dashboardStatusLabel.className = 'val text-green';
      }
      btnClockBreak.disabled = false;
      btnClockEndBreak.disabled = true;
    });
  }

  if (btnClockLogout) {
    btnClockLogout.addEventListener('click', () => {
      attendanceState = 'loggedout';
      if (dashboardStatusLabel) {
        dashboardStatusLabel.textContent = 'Logged Out';
        dashboardStatusLabel.className = 'val text-muted';
      }
      
      // Set logout timestamp to current local time
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      if (clockLastLogout) {
        clockLastLogout.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
      }

      // Update Dashboard status card icon to warning/red
      const greenIcon = document.querySelector('.stat-widget .widget-icon.green');
      if (greenIcon) {
        greenIcon.innerHTML = '&#10060;';
        greenIcon.className = 'widget-icon red';
      }

      // Disable all buttons
      btnClockBreak.disabled = true;
      btnClockEndBreak.disabled = true;
      btnClockLogout.disabled = true;

      // Update team ratio status
      const ratioLabel = document.getElementById('team-ratio');
      const ratioLabelAtt = document.getElementById('team-ratio-att');
      if (ratioLabel) ratioLabel.textContent = '4/9 Present';
      if (ratioLabelAtt) ratioLabelAtt.textContent = '4/9 Present';

      // Gray out avatar in team list
      const teamItems = document.querySelectorAll('.team-scroll-list .team-member-item');
      if (teamItems[0]) {
        const statusDot = teamItems[0].querySelector('.status-dot');
        if (statusDot) {
          statusDot.className = 'status-dot red';
          statusDot.textContent = 'Out';
        }
      }

      clearInterval(timerInterval);
    });
  }


  // ==========================================
  // 5. CORE HR: LEAVE WORKFLOW SUB-TABS & ACTIONS
  // ==========================================
  const subtabButtons = document.querySelectorAll('#leave-subtabs-menu .btn-subtab');
  const leavePanes = document.querySelectorAll('.leave-tabs-panes-container .leave-pane');

  subtabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-target');
      
      // Remove active from buttons
      subtabButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      // Remove active from panes
      leavePanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });


  // ==========================================
  // 6. CORE HR: PAYROLL STRUCT & MASKING SIMULATOR
  // ==========================================
  const employeeSalaries = {
    AW: {
      name: 'Alexander Wright',
      basic: 120000,
      hra: 48000,
      special: 17600,
      totalEarn: 185600,
      tds: 22500,
      pf: 12000,
      ptax: 2500,
      att_ded: 380,
      totalDed: 37380,
      absentDays: 22
    },
    DV: {
      name: 'David K. Vance',
      basic: 80000,
      hra: 32000,
      special: 11500,
      totalEarn: 123500,
      tds: 12000,
      pf: 8000,
      ptax: 2000,
      att_ded: 0,
      totalDed: 22000,
      absentDays: 0
    },
    MB: {
      name: 'Marcus Bennett',
      basic: 65000,
      hra: 26000,
      special: 9000,
      totalEarn: 100000,
      tds: 8000,
      pf: 6500,
      ptax: 1500,
      att_ded: 1200,
      totalDed: 17200,
      absentDays: 2
    },
    CO: {
      name: 'Clara Oswald',
      basic: 75000,
      hra: 30000,
      special: 10000,
      totalEarn: 115000,
      tds: 10000,
      pf: 7500,
      ptax: 2000,
      att_ded: 450,
      totalDed: 19950,
      absentDays: 1
    }
  };

  let isSessionActive = false;
  let pendingTargetTab = null;

  let amountsVisible = false;
  const btnToggleAmounts = document.getElementById('btn-toggle-amounts');
  const lblToggleAmounts = document.getElementById('lbl-toggle-amounts');
  const payrollEmpSelector = document.getElementById('payroll-emp-selector');

  // Elements to update
  const grossStat = document.getElementById('payroll-stat-gross');
  const netStat = document.getElementById('payroll-stat-net');
  const dedStat = document.getElementById('payroll-stat-deductions');

  const psBasic = document.getElementById('ps-val-basic');
  const psHra = document.getElementById('ps-val-hra');
  const psSpecial = document.getElementById('ps-val-special');
  const psTotalEarn = document.getElementById('ps-val-total-earn');

  const psTds = document.getElementById('ps-val-tds');
  const psPf = document.getElementById('ps-val-pf');
  const psPtax = document.getElementById('ps-val-ptax');
  const psAttDed = document.getElementById('ps-val-att-ded');
  const psTotalDed = document.getElementById('ps-val-total-ded');

  const psDedTotal = document.getElementById('ps-val-ded-total');
  const psAbsentNum = document.querySelector('.metric-block.block-absent .val-num');

  function formatRupee(value) {
    return '₹ ' + value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderPayroll() {
    const selectedEmpId = payrollEmpSelector ? payrollEmpSelector.value : 'AW';
    const emp = employeeSalaries[selectedEmpId];
    if (!emp) return;

    // Update absent days widget
    if (psAbsentNum) {
      psAbsentNum.textContent = emp.absentDays;
      if (emp.absentDays > 0) {
        psAbsentNum.className = 'val-num text-red';
      } else {
        psAbsentNum.className = 'val-num';
      }
    }

    if (amountsVisible) {
      if (lblToggleAmounts) lblToggleAmounts.textContent = 'Hide Amounts';
      
      // Update top stats (aggregated/simulated)
      if (grossStat) grossStat.textContent = formatRupee(185600 + 123500 + 100000 + 115000);
      if (netStat) netStat.textContent = formatRupee(148220 + 101500 + 82800 + 95050);
      if (dedStat) dedStat.textContent = formatRupee(37380 + 22000 + 17200 + 19950);

      // Update Split Payslip details
      if (psBasic) psBasic.textContent = formatRupee(emp.basic);
      if (psHra) psHra.textContent = formatRupee(emp.hra);
      if (psSpecial) psSpecial.textContent = formatRupee(emp.special);
      if (psTotalEarn) psTotalEarn.textContent = formatRupee(emp.totalEarn);

      if (psTds) psTds.textContent = formatRupee(emp.tds);
      if (psPf) psPf.textContent = formatRupee(emp.pf);
      if (psPtax) psPtax.textContent = formatRupee(emp.ptax);
      if (psAttDed) psAttDed.textContent = formatRupee(emp.att_ded);
      if (psTotalDed) psTotalDed.textContent = formatRupee(emp.totalDed);
      if (psDedTotal) psDedTotal.textContent = formatRupee(emp.totalDed);

      // Update right-side register amounts
      const registerItems = document.querySelectorAll('.register-employee-item');
      registerItems.forEach(item => {
        const empName = item.querySelector('.name').textContent;
        // Search by name matching key
        let targetKey = Object.keys(employeeSalaries).find(k => employeeSalaries[k].name === empName);
        if (targetKey) {
          item.querySelector('.val-salary').textContent = formatRupee(employeeSalaries[targetKey].totalEarn);
        }
      });

    } else {
      if (lblToggleAmounts) lblToggleAmounts.textContent = 'Show Amounts';
      
      // Mask everything
      if (grossStat) grossStat.textContent = '₹......';
      if (netStat) netStat.textContent = '₹......';
      if (dedStat) dedStat.textContent = '₹......';

      if (psBasic) psBasic.textContent = '₹......';
      if (psHra) psHra.textContent = '₹......';
      if (psSpecial) psSpecial.textContent = '₹......';
      if (psTotalEarn) psTotalEarn.textContent = '₹......';

      if (psTds) psTds.textContent = '₹......';
      if (psPf) psPf.textContent = '₹......';
      if (psPtax) psPtax.textContent = '₹......';
      if (psAttDed) psAttDed.textContent = '₹......';
      if (psTotalDed) psTotalDed.textContent = '₹......';
      if (psDedTotal) psDedTotal.textContent = '₹......';

      const registerSalaries = document.querySelectorAll('.reg-emp-amount-badge .val-salary');
      registerSalaries.forEach(el => el.textContent = '₹......');
    }
    
    // Sync other interactive panels with payroll masking state
    if (typeof renderReferrals === 'function') renderReferrals();
    if (typeof calculateCoachScore === 'function') calculateCoachScore();
  }

  if (btnToggleAmounts) {
    btnToggleAmounts.addEventListener('click', () => {
      amountsVisible = !amountsVisible;
      renderPayroll();
    });
  }

  if (payrollEmpSelector) {
    payrollEmpSelector.addEventListener('change', renderPayroll);
  }

  // Initialize payroll view
  renderPayroll();


  // ==========================================
  // 7. TALENT: RECRUITMENT OFFER DOCUMENT GENERATOR
  // ==========================================
  const offerNameInput = document.getElementById('offer-name');
  const offerRoleInput = document.getElementById('offer-role');
  const offerSalaryInput = document.getElementById('offer-salary');
  const btnGenerateOffer = document.getElementById('btn-generate-offer');
  
  const offerDocContainer = document.getElementById('offer-doc-container');
  const docCandidateName = document.getElementById('doc-candidate-name');
  const docCandidateRole = document.getElementById('doc-candidate-role');
  const docCandidateSalary = document.getElementById('doc-candidate-salary');

  if (btnGenerateOffer) {
    btnGenerateOffer.addEventListener('click', () => {
      const name = offerNameInput.value.trim() || 'Candidate';
      const role = offerRoleInput.value.trim() || 'Role';
      const salary = parseFloat(offerSalaryInput.value) || 0;

      docCandidateName.textContent = name;
      docCandidateRole.textContent = role;
      docCandidateSalary.textContent = `$${salary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      offerDocContainer.style.display = 'block';
      offerDocContainer.style.animation = 'fadeInPanel 0.4s ease-out';
    });
  }


  // ==========================================
  // 8. TALENT: ONBOARDING CHECKLIST INTERACTIVITY
  // ==========================================
  const checklistCheckboxes = document.querySelectorAll('.checklist-items-grid input[type="checkbox"]');
  checklistCheckboxes.forEach(chk => {
    chk.addEventListener('change', (e) => {
      const parentLabel = e.currentTarget.closest('.check-item-line');
      if (e.currentTarget.checked) {
        parentLabel.classList.add('completed');
      } else {
        parentLabel.classList.remove('completed');
      }
    });
  });


  // ==========================================
  // 9. TALENT: PERFORMANCE & OKR PROGRESS SLIDERS
  // ==========================================
  const okrSliders = document.querySelectorAll('.okr-slider');
  okrSliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      const okrId = e.currentTarget.getAttribute('data-okr-id');
      const val = e.currentTarget.value;
      
      document.getElementById(`okr-${okrId}-val`).textContent = `${val}% Complete`;
      document.getElementById(`okr-${okrId}-bar`).style.width = `${val}%`;
    });
  });


  // ==========================================
  // 10. OPERATIONS: COST MARGIN SIMULATOR
  // ==========================================
  const commRevenueInput = document.getElementById('comm-revenue');
  const commCostsInput = document.getElementById('comm-costs');
  const commRevVal = document.getElementById('comm-rev-val');
  const commCostsVal = document.getElementById('comm-costs-val');
  const commMarginProfit = document.getElementById('comm-margin-profit');
  const commMarginPct = document.getElementById('comm-margin-pct');

  function calculateMargins() {
    if (!commRevenueInput || !commCostsInput) return;
    const revenue = parseFloat(commRevenueInput.value);
    const costs = parseFloat(commCostsInput.value);

    if (commRevVal) commRevVal.textContent = `$${revenue.toLocaleString()}`;
    if (commCostsVal) commCostsVal.textContent = `$${costs.toLocaleString()}`;

    const profit = revenue - costs;
    const marginPct = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

    if (commMarginProfit) commMarginProfit.textContent = `$${profit.toLocaleString()}`;
    if (commMarginPct) commMarginPct.textContent = `${marginPct}%`;
    
    // Change margin box coloring based on efficiency metrics
    const pctLabelBox = document.getElementById('comm-margin-pct');
    if (pctLabelBox) {
      if (marginPct < 15) {
        pctLabelBox.className = 'val text-red';
      } else if (marginPct < 40) {
        pctLabelBox.className = 'val text-amber';
      } else {
        pctLabelBox.className = 'val text-gradient';
      }
    }
  }

  if (commRevenueInput && commCostsInput) {
    commRevenueInput.addEventListener('input', calculateMargins);
    commCostsInput.addEventListener('input', calculateMargins);
    calculateMargins();
  }


  // ==========================================
  // 11. FINANCE: INVOICE APPROVAL QUEUE
  // ==========================================
  document.querySelectorAll('.btn-invoice-approve').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rowId = e.currentTarget.getAttribute('data-row-id');
      const row = document.getElementById(`inv-row-${rowId}`);
      if (row) {
        // Change Status badge
        const statusCell = row.cells[4];
        statusCell.innerHTML = '<span class="badge badge-green">Dispatched</span>';
        
        // Hide button
        e.currentTarget.disabled = true;
        e.currentTarget.textContent = 'Dispatched';
      }
    });
  });


  // ==========================================
  // 12. PRICING CALCULATOR (LANDING PAGE)
  // ==========================================
  const sliderSeats = document.getElementById('calc-seats');
  const sliderTransactions = document.getElementById('calc-transactions');
  const sliderLegacyCost = document.getElementById('calc-legacy-cost');

  const valSeats = document.getElementById('seats-val');
  const valTransactions = document.getElementById('transactions-val');
  const valLegacyCost = document.getElementById('legacy-cost-val');

  const outLegacyCost = document.getElementById('out-legacy-cost');
  const outDeepsightCost = document.getElementById('out-deepsight-cost');
  const outSavings = document.getElementById('out-savings');
  const outSavingsPct = document.getElementById('out-savings-pct');

  const DEEPSIGHT_FLAT_ANNUAL_COST = 9600; // $800 * 12 months flat rate

  function calculatePricing() {
    if (!sliderSeats || !sliderTransactions || !sliderLegacyCost) return;
    const seats = parseInt(sliderSeats.value, 10);
    const transactions = parseInt(sliderTransactions.value, 10);
    const legacyAnnualMaintenance = parseInt(sliderLegacyCost.value, 10);

    // Update labels
    valSeats.textContent = `${seats} Users`;
    valTransactions.textContent = `${transactions.toLocaleString()} Syncs`;
    valLegacyCost.textContent = `$${legacyAnnualMaintenance.toLocaleString()}`;

    // Legacy ERP Cost formula: (Seats * $250 / seat / year) + maintenance
    const legacyTotalCost = (seats * 250) + legacyAnnualMaintenance;

    // Research Centric Ops flat cost
    const deepsightTotalCost = DEEPSIGHT_FLAT_ANNUAL_COST;

    const savings = Math.max(0, legacyTotalCost - deepsightTotalCost);
    const savingsPercent = legacyTotalCost > 0 ? Math.round((savings / legacyTotalCost) * 100) : 0;

    // Update outputs
    outLegacyCost.textContent = `$${legacyTotalCost.toLocaleString()} /yr`;
    outDeepsightCost.textContent = `$${deepsightTotalCost.toLocaleString()} /yr`;
    outSavings.textContent = `$${savings.toLocaleString()} /yr`;
    outSavingsPct.textContent = `${savingsPercent}% Saved`;

    if (savingsPercent > 50) {
      outSavingsPct.style.background = '#10b981';
    } else {
      outSavingsPct.style.background = '#059669';
    }
  }

  if (sliderSeats && sliderTransactions && sliderLegacyCost) {
    sliderSeats.addEventListener('input', calculatePricing);
    sliderTransactions.addEventListener('input', calculatePricing);
    sliderLegacyCost.addEventListener('input', calculatePricing);
    calculatePricing();
  }


  // ==========================================
  // 13. FAQ ACCORDION HANDLERS
  // ==========================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.faq-card');
      const answer = card.querySelector('.faq-answer');
      const chevron = card.querySelector('.faq-chevron');

      const isOpen = card.classList.contains('active');

      if (isOpen) {
        card.classList.remove('active');
        answer.style.maxHeight = null;
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      } else {
        card.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });
  });


  // ==========================================
  // 14. INITIALIZE LEAD CAPTURE MODAL
  // ==========================================
  const modalContact = document.getElementById('modal-contact');
  const triggerBtns = document.querySelectorAll('.btn-trigger-scoping');
  const btnCloseModal = document.getElementById('btn-modal-close');
  const btnCancelForm = document.getElementById('btn-cancel-scoping');
  const scopingForm = document.getElementById('contact-scoping-form');
  const successPane = document.getElementById('scoping-success-pane');
  const btnCloseSuccess = document.getElementById('btn-close-success');

  function openModal() {
    if (modalContact) modalContact.classList.add('active');
    if (scopingForm) scopingForm.style.display = 'block';
    if (successPane) successPane.style.display = 'none';

    // Seed description based on calculator sliders
    const messageField = document.getElementById('form-message');
    if (messageField && sliderSeats) {
      messageField.value = `We are looking to migrate our legacy B2B workflow setup. Our parameters: [Active seats: ${sliderSeats.value}, monthly transaction volume: ${parseInt(sliderTransactions.value).toLocaleString()}, current ERP maintenance: $${parseInt(sliderLegacyCost.value).toLocaleString()}]. We are interested in automation modules for Core HR, Recruitment Pipelines, and Financial Invoicing.`;
    }
  }

  function closeModal() {
    if (modalContact) modalContact.classList.remove('active');
    if (scopingForm) scopingForm.reset();
  }

  triggerBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelForm) btnCancelForm.addEventListener('click', closeModal);
  if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', closeModal);

  if (modalContact) {
    modalContact.addEventListener('click', (e) => {
      if (e.target === modalContact) {
        closeModal();
      }
    });
  }

  if (scopingForm) {
    scopingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const lead = {
        name: document.getElementById('form-name').value,
        company: document.getElementById('form-company').value,
        email: document.getElementById('form-email').value,
        phone: document.getElementById('form-phone').value,
        scopeNotes: document.getElementById('form-message').value,
        dateSubmitted: new Date().toISOString()
      };

      let currentLeads = JSON.parse(localStorage.getItem('deepsight_leads') || '[]');
      currentLeads.push(lead);
      localStorage.setItem('deepsight_leads', JSON.stringify(currentLeads));

      scopingForm.style.display = 'none';
      successPane.style.display = 'flex';
    });
  }


  // ==========================================
  // 15. RECRUITMENT PIPELINE CONTROLLER
  // ==========================================
  let candidatesList = [
    { id: 1, name: 'Sarah Jenkins', role: 'Product Designer', stage: 'screening' },
    { id: 2, name: 'David Kim', role: 'Frontend dev', stage: 'screening' },
    { id: 3, name: 'Alex Chen', role: 'Lead QA Tester', stage: 'interview' },
    { id: 4, name: 'Emma Watson', role: 'Marketing Strategist', stage: 'offer' }
  ];

  const pipelineContainer = document.getElementById('pipeline-stages-container');
  const modalAddCandidate = document.getElementById('modal-add-candidate');
  const btnShowAddCandidate = document.getElementById('btn-show-add-candidate-modal');
  const btnCloseCandidateModal = document.getElementById('btn-close-candidate-modal');
  const formNewCandidate = document.getElementById('form-new-candidate');

  function renderPipeline() {
    if (!pipelineContainer) return;
    
    const columns = {
      screening: { title: 'Screening', items: [] },
      interview: { title: 'Interviewing', items: [] },
      offer: { title: 'Offer Made', items: [] }
    };
    
    candidatesList.forEach(cand => {
      if (columns[cand.stage]) {
        columns[cand.stage].items.push(cand);
      }
    });

    let html = '';
    for (let key in columns) {
      const col = columns[key];
      html += `<div class="pipeline-column">
        <h4>${col.title}</h4>`;
      col.items.forEach(item => {
        html += `<div class="pipeline-card"><span>${item.name}</span><small>${item.role}</small></div>`;
      });
      html += `</div>`;
    }
    pipelineContainer.innerHTML = html;
  }

  if (btnShowAddCandidate) {
    btnShowAddCandidate.addEventListener('click', () => modalAddCandidate.classList.add('active'));
  }
  if (btnCloseCandidateModal) {
    btnCloseCandidateModal.addEventListener('click', () => modalAddCandidate.classList.remove('active'));
  }
  if (formNewCandidate) {
    formNewCandidate.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cand-name').value;
      const role = document.getElementById('cand-role').value;
      const stage = document.getElementById('cand-stage').value;
      
      candidatesList.push({
        id: candidatesList.length + 1,
        name,
        role,
        stage
      });
      
      renderPipeline();
      formNewCandidate.reset();
      modalAddCandidate.classList.remove('active');
    });
  }
  renderPipeline();


  // ==========================================
  // 16. NOTICE BOARD CONTROLLER
  // ==========================================
  const modalAddNotice = document.getElementById('modal-add-notice');
  const btnAddNotice = document.getElementById('btn-add-notice');
  const btnCloseNoticeModal = document.getElementById('btn-close-notice-modal');
  const formNewNotice = document.getElementById('form-new-notice');
  const noticesContainer = document.getElementById('notices-list-container');

  if (btnAddNotice) {
    btnAddNotice.addEventListener('click', () => modalAddNotice.classList.add('active'));
  }
  if (btnCloseNoticeModal) {
    btnCloseNoticeModal.addEventListener('click', () => modalAddNotice.classList.remove('active'));
  }
  if (formNewNotice) {
    formNewNotice.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('notice-title').value;
      const category = document.getElementById('notice-category').value;
      const content = document.getElementById('notice-content').value;
      const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      
      let badgeClass = 'badge-green';
      if (category === 'HR Operations') badgeClass = 'badge-blue';
      if (category === 'IT Security') badgeClass = 'badge-yellow';
      if (category === 'General') badgeClass = 'badge-green';

      const noticeCard = document.createElement('div');
      noticeCard.className = 'notice-card glass-card';
      noticeCard.innerHTML = `
        <div class="notice-header">
          <span class="notice-badge ${badgeClass}">${category}</span>
          <span class="notice-date">${date}</span>
        </div>
        <h3>${title}</h3>
        <p class="notice-desc">${content}</p>
        <div class="notice-author">
          <div class="avatar">AW</div>
          <span class="author-info">Posted by <strong>Alexander Wright</strong> &bull; Managing Director</span>
        </div>
      `;
      
      if (noticesContainer) {
        noticesContainer.insertBefore(noticeCard, noticesContainer.firstChild);
      }
      
      formNewNotice.reset();
      modalAddNotice.classList.remove('active');
    });
  }


  // ==========================================
  // 17. REFERRAL SYSTEM CONTROLLER
  // ==========================================
  const modalAddReferral = document.getElementById('modal-add-referral');
  const btnAddReferral = document.getElementById('btn-add-referral');
  const btnCloseReferralModal = document.getElementById('btn-close-referral-modal');
  const formNewReferral = document.getElementById('form-new-referral');
  const referralsTableBody = document.getElementById('referrals-table-body');
  
  const refSubmitted = document.getElementById('ref-stat-submitted');
  const refHired = document.getElementById('ref-stat-hired');
  const refProgress = document.getElementById('ref-stat-progress');
  const refBonus = document.getElementById('ref-stat-bonus');

  let referralsList = [
    { id: 1, name: 'Sarah Jenkins', role: 'UI/UX Designer', referrer: 'David K. Vance', date: '12 May 2026', status: 'Hired', bonus: 10000, paid: true },
    { id: 2, name: 'Michael Chang', role: 'Operations Analyst', referrer: 'Clara Oswald', date: '28 May 2026', status: 'Interview', bonus: 5000, paid: false },
    { id: 3, name: 'Alice Smith', role: 'React Developer', referrer: 'Alexander Wright', date: '02 Jun 2026', status: 'Screening', bonus: 5000, paid: false }
  ];

  function updateReferralStats() {
    if (!refSubmitted) return;
    const total = referralsList.length;
    const hired = referralsList.filter(r => r.status === 'Hired').length;
    const progress = referralsList.filter(r => r.status !== 'Hired' && r.status !== 'Rejected').length;
    const earned = referralsList.filter(r => r.status === 'Hired').reduce((sum, r) => sum + r.bonus, 0);

    refSubmitted.textContent = `${total} submitted`;
    refHired.textContent = `${hired} placed`;
    refProgress.textContent = `${progress} active`;
    refBonus.innerHTML = `<span class="masked-amount">${!amountsVisible ? '₹......' : '₹' + earned.toLocaleString()}</span>`;
  }

  window.renderReferrals = function() {
    if (!referralsTableBody) return;
    let html = '';
    referralsList.forEach(ref => {
      let badgeClass = 'badge-yellow';
      if (ref.status === 'Hired') badgeClass = 'badge-green';
      if (ref.status === 'Rejected') badgeClass = 'badge-red';

      let actionHtml = ref.paid 
        ? `<span class="text-green" style="font-size: 11px; font-weight: 600;">Paid</span>`
        : `<button class="btn btn-outline btn-xs btn-override-salary">View Details</button>`;

      const bonusVal = !amountsVisible ? '₹......' : '₹' + ref.bonus.toLocaleString();

      html += `<tr>
        <td><strong>${ref.name}</strong></td>
        <td>${ref.role}</td>
        <td>${ref.referrer}</td>
        <td>${ref.date}</td>
        <td><span class="badge ${badgeClass}">${ref.status}</span></td>
        <td><span class="masked-amount">${bonusVal}</span></td>
        <td>${actionHtml}</td>
      </tr>`;
    });
    referralsTableBody.innerHTML = html;
    updateReferralStats();
  }

  if (btnAddReferral) {
    btnAddReferral.addEventListener('click', () => modalAddReferral.classList.add('active'));
  }
  if (btnCloseReferralModal) {
    btnCloseReferralModal.addEventListener('click', () => modalAddReferral.classList.remove('active'));
  }
  if (formNewReferral) {
    formNewReferral.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('ref-name').value;
      const role = document.getElementById('ref-role').value;
      const referrer = document.getElementById('ref-referrer').value;
      const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      referralsList.push({
        id: referralsList.length + 1,
        name,
        role,
        referrer,
        date,
        status: 'Screening',
        bonus: 5000,
        paid: false
      });

      window.renderReferrals();
      formNewReferral.reset();
      modalAddReferral.classList.remove('active');
    });
  }
  window.renderReferrals();


  // ==========================================
  // 18. SMART COACH CONTROLLER
  // ==========================================
  const coachCheckboxes = document.querySelectorAll('.coach-task-chk');
  const coachProgressPercent = document.getElementById('coach-progress-percent');
  const coachProgressBarFill = document.getElementById('coach-progress-bar-fill');
  const coachMonthScore = document.getElementById('coach-month-score');
  const coachLeaderboardScore = document.getElementById('coach-leaderboard-score');
  const coachPointsAway = document.getElementById('coach-points-away');
  const coachPayoutPct = document.getElementById('coach-payout-pct');
  const coachIncentiveAmount = document.getElementById('coach-incentive-amount');

  window.calculateCoachScore = function() {
    if (!coachMonthScore) return;
    let totalWeight = 0;
    let completedWeight = 0;
    
    coachCheckboxes.forEach(chk => {
      const weight = parseInt(chk.getAttribute('data-weight'), 10);
      totalWeight += weight;
      if (chk.checked) {
        completedWeight += weight;
      }
    });

    const completionPercent = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
    // Map base score: 0 completed = 0, all completed = 127
    const score = Math.round((completedWeight / totalWeight) * 127);
    
    if (coachProgressPercent) {
      coachProgressPercent.textContent = `${completionPercent}% of target`;
    }
    if (coachProgressBarFill) {
      coachProgressBarFill.style.width = `${completionPercent}%`;
    }
    if (coachMonthScore) {
      coachMonthScore.textContent = score;
    }
    if (coachLeaderboardScore) {
      coachLeaderboardScore.textContent = `${score} pts`;
    }

    const pointsAway = Math.max(0, 120 - score);
    if (coachPointsAway) {
      coachPointsAway.textContent = pointsAway > 0 ? `${pointsAway} points` : '0 points';
    }

    // Payout logic
    let payoutPct = 100;
    if (score >= 120) payoutPct = 120;
    else if (score >= 100) payoutPct = 100 + (score - 100);
    else payoutPct = Math.max(50, score);

    if (coachPayoutPct) {
      coachPayoutPct.textContent = `${payoutPct}%`;
    }

    // Incentive logic
    const incentiveValue = Math.round(payoutPct * 150);
    if (coachIncentiveAmount) {
      coachIncentiveAmount.innerHTML = `<span class="masked-amount">${!amountsVisible ? '₹......' : '₹' + incentiveValue.toLocaleString()}</span>`;
    }
  }

  coachCheckboxes.forEach(chk => {
    chk.addEventListener('change', window.calculateCoachScore);
  });
  window.calculateCoachScore();

  // Scorecard subtabs switcher
  const scorecardSubtabs = document.querySelectorAll('#scorecard-subtabs .btn-subtab');
  const scorecardPanes = document.querySelectorAll('.scorecard-panes-container .leave-pane');

  scorecardSubtabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-target');
      scorecardSubtabs.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      scorecardPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });


  // ==========================================
  // 19. ACCESS CONTROL & USER SIMULATOR
  // ==========================================
  const accessUserSelect = document.getElementById('access-user-select');
  const accessRoleSelect = document.getElementById('access-role-select');
  const btnSavePermissions = document.getElementById('btn-save-permissions');
  
  const simAvatarBox = document.getElementById('sim-avatar-box');
  const simUserName = document.getElementById('sim-user-name');
  const simUserRoleBadge = document.getElementById('sim-user-role-badge');
  const btnSimulateActiveUser = document.getElementById('btn-simulate-active-user');

  const permCoreHR = document.getElementById('perm-core-hr');
  const permTalent = document.getElementById('perm-talent');
  const permOps = document.getElementById('perm-ops');
  const permFinance = document.getElementById('perm-finance');

  // Permission database
  const userPermissions = {
    AW: { name: 'Alexander Wright', role: 'C-level / Administrator', core: true, talent: true, ops: true, finance: true },
    CO: { name: 'Clara Oswald', role: 'HR Manager', core: true, talent: true, ops: false, finance: false },
    DV: { name: 'David K. Vance', role: 'Lead Engineer', core: true, talent: false, ops: true, finance: false },
    MB: { name: 'Marcus Bennett', role: 'Employee / Analyst', core: true, talent: false, ops: false, finance: false }
  };

  if (accessUserSelect) {
    accessUserSelect.addEventListener('change', () => {
      const userKey = accessUserSelect.value;
      const data = userPermissions[userKey];
      if (!data) return;

      // Update inputs
      if (data.role.includes('C-level') || data.role.includes('Admin')) accessRoleSelect.value = 'Admin';
      else if (data.role.includes('HR')) accessRoleSelect.value = 'HR';
      else if (data.role.includes('Engineer')) accessRoleSelect.value = 'Engineer';
      else accessRoleSelect.value = 'Employee';

      permCoreHR.checked = data.core;
      permTalent.checked = data.talent;
      permOps.checked = data.ops;
      permFinance.checked = data.finance;

      // Update simulator details
      simAvatarBox.textContent = userKey;
      simUserName.textContent = data.name;
      simUserRoleBadge.textContent = data.role;
    });
  }

  if (btnSavePermissions) {
    btnSavePermissions.addEventListener('click', () => {
      const userKey = accessUserSelect.value;
      const data = userPermissions[userKey];
      if (!data) return;

      data.core = permCoreHR.checked;
      data.talent = permTalent.checked;
      data.ops = permOps.checked;
      data.finance = permFinance.checked;

      alert(`Permissions for ${data.name} saved successfully!`);
    });
  }

  if (btnSimulateActiveUser) {
    btnSimulateActiveUser.addEventListener('click', () => {
      const userKey = accessUserSelect.value;
      const data = userPermissions[userKey];
      if (!data) return;

      alert(`Simulating system view as: ${data.name} (${data.role})`);

      // Update sidebar header user profile card
      document.querySelector('.sidebar-footer-profile .profile-avatar').textContent = userKey;
      document.querySelector('.sidebar-footer-profile .name').textContent = data.name;
      document.querySelector('.sidebar-footer-profile .role').textContent = data.role;

      // Adjust navigation visibility
      const navGroups = document.querySelectorAll('.sidebar-nav .nav-category-group');
      if (navGroups[0]) navGroups[0].style.display = data.core ? 'block' : 'none'; // Core HR
      if (navGroups[1]) navGroups[1].style.display = data.talent ? 'block' : 'none'; // Talent
      if (navGroups[2]) navGroups[2].style.display = data.ops ? 'block' : 'none'; // Operations
      if (navGroups[3]) navGroups[3].style.display = data.finance ? 'block' : 'none'; // Finance

      // Reset to dashboard if active tab is no longer permitted
      if (!data.core) {
        // Find first active group and click its first option
        const permittedGroup = [...navGroups].find(g => g.style.display !== 'none');
        if (permittedGroup) {
          const firstBtn = permittedGroup.querySelector('.nav-item-btn');
          if (firstBtn) firstBtn.click();
        }
      }
    });
  }


  // ==========================================
  // 20. FINANCE REPORTS SUB-TABS CONTROLLER
  // ==========================================
  const btnFinanceOverview = document.getElementById('btn-finance-overview');
  const btnFinanceReports = document.getElementById('btn-finance-reports');
  const financeOverviewPane = document.getElementById('finance-overview-pane');
  const financeReportsPane = document.getElementById('finance-reports-pane');

  if (btnFinanceOverview && btnFinanceReports) {
    btnFinanceOverview.addEventListener('click', () => {
      btnFinanceOverview.classList.add('active');
      btnFinanceOverview.classList.replace('btn-outline', 'btn-primary');
      
      btnFinanceReports.classList.remove('active');
      btnFinanceReports.classList.replace('btn-primary', 'btn-outline');
      
      financeOverviewPane.classList.add('active');
      financeReportsPane.classList.remove('active');
    });

    btnFinanceReports.addEventListener('click', () => {
      btnFinanceReports.classList.add('active');
      btnFinanceReports.classList.replace('btn-outline', 'btn-primary');
      
      btnFinanceOverview.classList.remove('active');
      btnFinanceOverview.classList.replace('btn-primary', 'btn-outline');
      
      financeReportsPane.classList.add('active');
      financeOverviewPane.classList.remove('active');
    });
  }

  // Report category switching logic
  const reportCategoryBtns = document.querySelectorAll('.btn-report-category');
  const reportSubpanes = document.querySelectorAll('.report-content-box > div');

  reportCategoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetReport = e.currentTarget.getAttribute('data-report');
      
      // Update buttons
      reportCategoryBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      // Toggle report view
      let found = false;
      reportSubpanes.forEach(pane => {
        if (pane.id === `report-${targetReport}`) {
          pane.classList.add('active');
          found = true;
        } else {
          pane.classList.remove('active');
        }
      });

      // Fallback if report subpane not explicitly written
      if (!found) {
        fallbackSubpanes(targetReport);
      }
    });
  });

  function fallbackSubpanes(reportKey) {
    reportSubpanes.forEach(p => p.classList.remove('active'));
    const fallback = document.getElementById('report-other-generic');
    const title = document.getElementById('report-generic-title');
    if (fallback && title) {
      const formatted = reportKey.split('-').map(w => w.toUpperCase()).join(' ') + ' REPORT';
      title.textContent = `${formatted} LOADED`;
      fallback.classList.add('active');
    }
  }

  // ==========================================
  // 9. TALENT: HR DOCUMENTS CONTROLLER
  // ==========================================
  let hrDocuments = [
    {
      id: 'DOC-001',
      title: 'Assistant Project Manager Appointment Letter',
      type: 'Appointment Letter',
      employee: 'Jane Cooper',
      date: '2023-04-03',
      status: 'ACTIVE',
      notes: 'Standard appointment letter for Jane Cooper as Assistant Project Manager. Monthly compensation ₹12,00,000 per annum flat B2B.'
    },
    {
      id: 'DOC-002',
      title: 'Senior Engineer Performance Appraisal',
      type: 'Appraisal',
      employee: 'David K. Vance',
      date: '2026-06-01',
      status: 'ACTIVE',
      notes: 'Annual appraisal review for David K. Vance. Performance rating: Outstanding. Basic adjusted to ₹80,000.'
    },
    {
      id: 'DOC-003',
      title: 'Performance Improvement Plan (PIP) Notice',
      type: 'PIP',
      employee: 'Marcus Bennett',
      date: '2026-05-15',
      status: 'ACTIVE',
      notes: '90-day Performance Improvement Plan. Reviews scheduled bi-weekly.'
    },
    {
      id: 'DOC-004',
      title: 'Information Security & Compliance Policy',
      type: 'Policy',
      employee: 'All Employees',
      date: '2026-01-01',
      status: 'ACTIVE',
      notes: 'Mandatory company device updates, password rotations, and VPN network guidelines.'
    },
    {
      id: 'DOC-005',
      title: 'Notice of Relieving & Asset Recovery',
      type: 'Relieving Letter',
      employee: 'Robert Fox',
      date: '2026-04-30',
      status: 'CLOSED',
      notes: 'Robert Fox relieving and release certificate. Assets returned and cleared.'
    }
  ];

  let selectedDocId = 'DOC-001';
  let activeDocFilter = 'All';

  const docTbody = document.getElementById('doc-registry-tbody');
  const docDetailsPane = document.getElementById('doc-details-pane');
  const docFilterBtns = document.querySelectorAll('.btn-doc-filter');

  const btnOpenDocModal = document.getElementById('btn-open-create-doc-modal');
  const btnCloseDocModal = document.getElementById('btn-close-doc-modal');
  const modalCreateDoc = document.getElementById('modal-create-document');
  const formCreateDoc = document.getElementById('form-create-doc');

  function renderDocuments() {
    if (!docTbody) return;
    docTbody.innerHTML = '';

    const filtered = hrDocuments.filter(d => {
      if (activeDocFilter === 'All') return true;
      return d.type === activeDocFilter;
    });

    // Update stats dynamically
    const statVisible = document.getElementById('doc-stat-visible');
    const statActive = document.getElementById('doc-stat-active');
    const statClosed = document.getElementById('doc-stat-closed');

    if (statVisible) statVisible.textContent = filtered.length;
    if (statActive) statActive.textContent = filtered.filter(d => d.status === 'ACTIVE').length;
    if (statClosed) statClosed.textContent = filtered.filter(d => d.status === 'CLOSED').length;

    if (filtered.length === 0) {
      docTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">No documents found matching this filter.</td></tr>`;
      renderDocDetails(null);
      return;
    }

    filtered.forEach(doc => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      if (doc.id === selectedDocId) {
        tr.style.background = 'rgba(4, 203, 194, 0.08)';
        tr.style.borderColor = 'var(--turquoise-accent)';
      }

      const statusBadge = doc.status === 'ACTIVE' 
        ? '<span class="badge badge-green">ACTIVE</span>' 
        : '<span class="badge badge-outline">CLOSED</span>';

      const formattedDate = new Date(doc.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      tr.innerHTML = `
        <td>
          <div style="font-weight: 600; color: var(--text-light);">${doc.title}</div>
          <div style="font-size: 10px; color: var(--text-muted);">${doc.type}</div>
        </td>
        <td>${doc.employee}</td>
        <td>${formattedDate}</td>
        <td>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            ${statusBadge}
            <span style="font-size: 11px; color: var(--text-muted);">Pending</span>
          </div>
        </td>
      `;

      tr.addEventListener('click', () => {
        selectedDocId = doc.id;
        renderDocuments();
      });

      docTbody.appendChild(tr);
    });

    // Sync details view
    const currentDoc = hrDocuments.find(d => d.id === selectedDocId);
    if (currentDoc && filtered.some(d => d.id === selectedDocId)) {
      renderDocDetails(currentDoc);
    } else if (filtered.length > 0) {
      selectedDocId = filtered[0].id;
      renderDocDetails(filtered[0]);
    } else {
      renderDocDetails(null);
    }
  }

  function getDocumentTemplateHtml(doc) {
    if (doc.type === 'Appointment Letter') {
      return `
        <div class="letter-template" style="border: 1px solid var(--glass-border); padding: 16px; border-radius: 4px; background: rgba(0,0,0,0.2); font-size: 12px; line-height: 1.5; color: var(--text-normal); max-height: 250px; overflow-y: auto;">
          <p><strong>Research Centric Ops</strong><br>New Delhi, India</p>
          <p>Date: ${new Date(doc.date).toLocaleDateString('en-IN')}</p>
          <p><strong>Subject: Appointment Letter for ${doc.employee}</strong></p>
          <p>Dear ${doc.employee},</p>
          <p>We are pleased to offer you an appointment for the position of Assistant Project Manager. You will be responsible for coordinating B2B panel activities, local scoping schedules, and client communications.</p>
          <p>Your flat-rate compensation and terms are as discussed. Please review and return a signed copy.</p>
          <p>Sincerely,<br>HR Operations Manager</p>
        </div>
      `;
    }
    if (doc.type === 'Warning') {
      return `
        <div class="letter-template" style="border: 1px solid rgba(239, 68, 68, 0.2); padding: 16px; border-radius: 4px; background: rgba(239, 68, 68, 0.02); font-size: 12px; line-height: 1.5; color: var(--text-normal); max-height: 250px; overflow-y: auto;">
          <p style="color: var(--error-red);"><strong>OFFICIAL WARNING LETTER</strong></p>
          <p>Date: ${new Date(doc.date).toLocaleDateString('en-IN')}</p>
          <p><strong>To: ${doc.employee}</strong></p>
          <p>This is a formal notice concerning recent operational deviations or compliance concerns. Specifically: <em>${doc.notes}</em>.</p>
          <p>Failure to correct this behavior within the next review cycle may lead to further disciplinary actions up to contract termination.</p>
          <p>Authorized Signature,<br>Management Board</p>
        </div>
      `;
    }
    if (doc.type === 'Appraisal') {
      return `
        <div class="letter-template" style="border: 1px solid var(--glass-border); padding: 16px; border-radius: 4px; background: rgba(16, 185, 129, 0.02); font-size: 12px; line-height: 1.5; color: var(--text-normal); max-height: 250px; overflow-y: auto;">
          <p><strong>Research Centric Ops &mdash; Performance Appraisal</strong></p>
          <p>Date: ${new Date(doc.date).toLocaleDateString('en-IN')}</p>
          <p>Dear ${doc.employee},</p>
          <p>Based on your performance review, the Board is pleased to revise your salary and compensation framework. Revise notes: <em>${doc.notes}</em>.</p>
          <p>We appreciate your dedication and contribution to global research delivery.</p>
          <p>Best Regards,<br> Alexander Wright</p>
        </div>
      `;
    }
    return `
      <div class="letter-template" style="border: 1px solid var(--glass-border); padding: 16px; border-radius: 4px; background: rgba(0,0,0,0.2); font-size: 12px; line-height: 1.5; color: var(--text-normal); max-height: 250px; overflow-y: auto;">
        <p><strong>Research Centric Ops &mdash; Corporate Document</strong></p>
        <p>Document ID: ${doc.id}<br>Type: ${doc.type}</p>
        <p>Employee: ${doc.employee}</p>
        <p><strong>Notes:</strong><br>${doc.notes}</p>
        <p>This document constitutes an official record in the Research Centric Ops HRMS directory database system.</p>
      </div>
    `;
  }

  function renderDocDetails(doc) {
    if (!docDetailsPane) return;
    if (!doc) {
      docDetailsPane.innerHTML = `
        <div class="empty-state-placeholder" style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 36px; margin-bottom: 10px;">📄</div>
          <p>Select a document from the registry on the left to view detailed preview, download PDF, or delete records.</p>
        </div>
      `;
      return;
    }

    const formattedDate = new Date(doc.date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    docDetailsPane.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px;">
        <div>
          <h3 style="margin: 0 0 4px 0; font-size: 16px; color: var(--text-light); font-weight: 600;">${doc.title}</h3>
          <span style="font-size: 11px; color: var(--text-muted);">Document ID: <strong>${doc.id}</strong></span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline btn-xs btn-delete-doc" data-id="${doc.id}" style="color: var(--error-red); border-color: rgba(239, 68, 68, 0.25); background: transparent;">Delete</button>
          <span class="badge" style="background: rgba(4, 203, 194, 0.15); color: var(--turquoise-accent); border: 1px solid var(--turquoise-accent);">${doc.type.toUpperCase()}</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12.5px;">
        <div>
          <span style="color: var(--text-muted); display: block; font-size: 10px; font-weight: 700; text-transform: uppercase;">EMPLOYEE</span>
          <strong style="color: var(--text-light);">${doc.employee}</strong>
        </div>
        <div>
          <span style="color: var(--text-muted); display: block; font-size: 10px; font-weight: 700; text-transform: uppercase;">ISSUE DATE</span>
          <strong style="color: var(--text-light);">${formattedDate}</strong>
        </div>
      </div>

      <div style="font-size: 12.5px;">
        <span style="color: var(--text-muted); display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">NOTES / SCOPE</span>
        <p style="margin: 0; line-height: 1.4; color: var(--text-normal);">${doc.notes}</p>
      </div>

      <div style="margin-top: 10px;">
        <span style="color: var(--text-muted); display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">LIVE LETTER PREVIEW</span>
        ${getDocumentTemplateHtml(doc)}
      </div>

      <div style="margin-top: auto; display: flex; gap: 10px;">
        <button class="btn btn-primary btn-block btn-download-doc-pdf" data-id="${doc.id}" style="background: var(--turquoise-accent); color: #000; font-weight: 600;">Download Document PDF</button>
      </div>
    `;

    // Bind delete button
    const btnDelete = docDetailsPane.querySelector('.btn-delete-doc');
    if (btnDelete) {
      btnDelete.addEventListener('click', (e) => {
        const idToDelete = e.currentTarget.getAttribute('data-id');
        hrDocuments = hrDocuments.filter(d => d.id !== idToDelete);
        renderDocuments();
      });
    }

    // Bind download button
    const btnDownload = docDetailsPane.querySelector('.btn-download-doc-pdf');
    if (btnDownload) {
      btnDownload.addEventListener('click', (e) => {
        const idToDownload = e.currentTarget.getAttribute('data-id');
        alert(`Generating and downloading PDF for Document: ${idToDownload}`);
      });
    }
  }

  // Bind filter buttons
  docFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      docFilterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeDocFilter = e.currentTarget.getAttribute('data-filter');
      renderDocuments();
    });
  });

  // Modal open/close controls
  if (btnOpenDocModal) {
    btnOpenDocModal.addEventListener('click', () => {
      if (modalCreateDoc) modalCreateDoc.classList.add('active');
      // Autofill date & generate ID
      const dateInput = document.getElementById('doc-issue-date');
      const idInput = document.getElementById('doc-id-input');
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      if (idInput) {
        const nextNum = hrDocuments.length + 1;
        idInput.value = `DOC-${String(nextNum).padStart(3, '0')}`;
      }
    });
  }

  if (btnCloseDocModal) {
    btnCloseDocModal.addEventListener('click', () => {
      if (modalCreateDoc) modalCreateDoc.classList.remove('active');
    });
  }

  // Create document form submit
  if (formCreateDoc) {
    formCreateDoc.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('doc-title-input').value;
      const type = document.getElementById('doc-type-select').value;
      const employee = document.getElementById('doc-emp-select').value;
      const date = document.getElementById('doc-issue-date').value;
      const id = document.getElementById('doc-id-input').value;
      const notes = document.getElementById('doc-notes').value;

      const newDoc = {
        id,
        title,
        type,
        employee,
        date,
        status: 'ACTIVE',
        notes
      };

      hrDocuments.unshift(newDoc);
      selectedDocId = id;
      
      if (modalCreateDoc) modalCreateDoc.classList.remove('active');
      formCreateDoc.reset();
      
      renderDocuments();
    });
  }

  // Initial render of documents
  renderDocuments();


  // ==========================================
  // 10. PAYSLIP MODAL CONTROLLER
  // ==========================================
  const btnPreviewPayslip = document.getElementById('btn-preview-payslip');
  const modalPayslip = document.getElementById('modal-payslip-preview');
  const btnClosePayslipModal = document.getElementById('btn-close-payslip-modal');
  const btnDownloadPayslipPdf = document.getElementById('btn-download-payslip-pdf');

  function numberToRupeesWords(amount) {
    if (amount === 0) return 'Zero';
    
    const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const doubleDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const formatTens = (num) => {
      if (num < 10) return singleDigits[num];
      if (num < 20) return doubleDigits[num - 10];
      return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + singleDigits[num % 10] : '');
    };
    
    let result = '';
    let temp = amount;
    
    if (temp >= 100000) {
      const lakhs = Math.floor(temp / 100000);
      result += formatTens(lakhs) + ' Lakh ';
      temp %= 100000;
    }
    
    if (temp >= 10000) {
      const thousands = Math.floor(temp / 1000);
      result += formatTens(thousands) + ' Thousand ';
      temp %= 1000;
    } else if (temp >= 1000) {
      const thousands = Math.floor(temp / 1000);
      result += formatTens(thousands) + ' Thousand ';
      temp %= 1000;
    }
    
    if (temp >= 100) {
      const hundreds = Math.floor(temp / 100);
      result += formatTens(hundreds) + ' Hundred ';
      temp %= 100;
    }
    
    if (temp > 0) {
      if (result !== '') result += 'and ';
      result += formatTens(temp);
    }
    
    return 'Rupees ' + result.trim() + ' Only';
  }

  function updatePayslipModal() {
    const selectedEmpId = payrollEmpSelector ? payrollEmpSelector.value : 'AW';
    const emp = employeeSalaries[selectedEmpId];
    if (!emp) return;

    // Map fields
    const modalName = document.getElementById('payslip-modal-emp-name');
    const modalId = document.getElementById('payslip-modal-emp-id');
    const modalDesignation = document.getElementById('payslip-modal-designation');
    const modalDept = document.getElementById('payslip-modal-dept');
    const modalPaidDays = document.getElementById('payslip-modal-paid-days');
    const modalAbsentDays = document.getElementById('payslip-modal-absent-days');

    const mBasic = document.getElementById('payslip-modal-basic');
    const mHra = document.getElementById('payslip-modal-hra');
    const mSpecial = document.getElementById('payslip-modal-special');
    const mBonus = document.getElementById('payslip-modal-bonus');
    const mGross = document.getElementById('payslip-modal-gross');

    const mPf = document.getElementById('payslip-modal-pf');
    const mTds = document.getElementById('payslip-modal-tds');
    const mPtax = document.getElementById('payslip-modal-ptax');
    const mAttDed = document.getElementById('payslip-modal-att-ded');
    const mTotalDed = document.getElementById('payslip-modal-total-ded');

    const mNetPay = document.getElementById('payslip-modal-net-pay');
    const mNetWords = document.getElementById('payslip-modal-net-words');

    // Mappings of mock profiles info
    const empInfo = {
      AW: { id: '1', designation: 'C-level', dept: 'Management', doj: 'Apr 2026' },
      DV: { id: '2', designation: 'Lead Architect', dept: 'Engineering', doj: 'Jul 2024' },
      MB: { id: '3', designation: 'Operations Associate', dept: 'Operations', doj: 'Nov 2025' },
      CO: { id: '4', designation: 'HR Manager', dept: 'Human Resources', doj: 'Sep 2024' }
    };
    const info = empInfo[selectedEmpId] || { id: '99', designation: 'Employee', dept: 'Operations', doj: 'Jan 2026' };

    if (modalName) modalName.textContent = emp.name;
    if (modalId) modalId.textContent = info.id;
    if (modalDesignation) modalDesignation.textContent = info.designation;
    if (modalDept) modalDept.textContent = info.dept;
    
    const dojEl = document.getElementById('payslip-modal-doj');
    if (dojEl) dojEl.textContent = info.doj;

    if (modalAbsentDays) modalAbsentDays.textContent = emp.absentDays;
    if (modalPaidDays) modalPaidDays.textContent = 22 - emp.absentDays;

    if (mBonus) {
      mBonus.textContent = amountsVisible ? formatRupee(0) : '₹......';
    }

    if (amountsVisible) {
      if (mBasic) mBasic.textContent = formatRupee(emp.basic);
      if (mHra) mHra.textContent = formatRupee(emp.hra);
      if (mSpecial) mSpecial.textContent = formatRupee(emp.special);
      if (mGross) mGross.textContent = formatRupee(emp.totalEarn);

      if (mPf) mPf.textContent = formatRupee(emp.pf);
      if (mPtax) mPtax.textContent = formatRupee(emp.ptax);
      if (mTds) mTds.textContent = formatRupee(emp.tds);
      if (mAttDed) mAttDed.textContent = formatRupee(emp.att_ded);
      if (mTotalDed) mTotalDed.textContent = formatRupee(emp.totalDed);

      const netAmount = emp.totalEarn - emp.totalDed;
      if (mNetPay) mNetPay.textContent = formatRupee(netAmount);
      if (mNetWords) mNetWords.textContent = numberToRupeesWords(netAmount);
    } else {
      if (mBasic) mBasic.textContent = '₹......';
      if (mHra) mHra.textContent = '₹......';
      if (mSpecial) mSpecial.textContent = '₹......';
      if (mGross) mGross.textContent = '₹......';

      if (mPf) mPf.textContent = '₹......';
      if (mPtax) mPtax.textContent = '₹......';
      if (mTds) mTds.textContent = '₹......';
      if (mAttDed) mAttDed.textContent = '₹......';
      if (mTotalDed) mTotalDed.textContent = '₹......';

      if (mNetPay) mNetPay.textContent = '₹......';
      if (mNetWords) mNetWords.textContent = 'Masked';
    }
  }

  if (btnPreviewPayslip) {
    btnPreviewPayslip.addEventListener('click', () => {
      updatePayslipModal();
      if (modalPayslip) modalPayslip.classList.add('active');
    });
  }

  if (btnClosePayslipModal) {
    btnClosePayslipModal.addEventListener('click', () => {
      if (modalPayslip) modalPayslip.classList.remove('active');
    });
  }

  if (btnDownloadPayslipPdf) {
    btnDownloadPayslipPdf.addEventListener('click', () => {
      const selectedEmpId = payrollEmpSelector ? payrollEmpSelector.value : 'AW';
      const emp = employeeSalaries[selectedEmpId];
      alert(`Downloading Payslip PDF for employee: ${emp ? emp.name : 'Alexander Wright'}`);
    });
  }

  // ==========================================================================
  // 21. PRODUCT TOUR (LANDING PAGE TABS)
  // ==========================================================================
  const tourTabs = document.querySelectorAll('.btn-tour-tab');
  const tourPanes = document.querySelectorAll('.tour-pane');

  tourTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tourKey = e.currentTarget.getAttribute('data-tour');
      
      // Update tabs UI
      tourTabs.forEach(t => {
        t.classList.remove('btn-primary', 'active');
        t.classList.add('btn-outline');
      });
      e.currentTarget.classList.add('btn-primary', 'active');
      e.currentTarget.classList.remove('btn-outline');

      // Update tour pane UI
      tourPanes.forEach(pane => {
        if (pane.id === `tour-${tourKey}`) {
          pane.style.display = 'block';
        } else {
          pane.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 22. DEMO LOGIN GATE MODAL CONTROLLERS
  // ==========================================================================
  const modalLoginGate = document.getElementById('modal-login-gate');
  const btnCloseLoginModal = document.getElementById('btn-close-login-modal');
  const btnLoginTabCredentials = document.getElementById('btn-login-tab-credentials');
  const btnLoginTabRequest = document.getElementById('btn-login-tab-request');
  const loginCredentialsPane = document.getElementById('login-credentials-pane');
  const loginRequestForm = document.getElementById('login-request-form');
  const btnLaunchDemoSession = document.getElementById('btn-launch-demo-session');
  const loginProfileSelect = document.getElementById('login-profile-select');

  if (btnCloseLoginModal) {
    btnCloseLoginModal.addEventListener('click', () => {
      modalLoginGate.classList.remove('active');
    });
  }

  if (btnLoginTabCredentials && btnLoginTabRequest) {
    btnLoginTabCredentials.addEventListener('click', () => {
      btnLoginTabCredentials.className = 'btn btn-primary btn-sm';
      btnLoginTabRequest.className = 'btn btn-outline btn-sm';
      loginCredentialsPane.style.display = 'block';
      loginRequestForm.style.display = 'none';
    });

    btnLoginTabRequest.addEventListener('click', () => {
      btnLoginTabRequest.className = 'btn btn-primary btn-sm';
      btnLoginTabCredentials.className = 'btn btn-outline btn-sm';
      loginRequestForm.style.display = 'flex';
      loginCredentialsPane.style.display = 'none';
    });
  }

  if (btnLaunchDemoSession) {
    btnLaunchDemoSession.addEventListener('click', () => {
      const usernameVal = document.getElementById('login-username').value;
      const passwordVal = document.getElementById('login-password').value;
      const errorMsgEl = document.getElementById('login-error-msg');
      
      if (usernameVal !== 'Demo User 1' || passwordVal !== 'Demo@101111') {
        errorMsgEl.textContent = 'Invalid username or password. Please use authorized credentials.';
        errorMsgEl.style.display = 'block';
        return;
      }
      
      errorMsgEl.style.display = 'none';
      const selectedProfile = loginProfileSelect.value;
      
      // Mark session active
      isSessionActive = true;
      
      // Select user in simulator Access Control select
      if (accessUserSelect) {
        accessUserSelect.value = selectedProfile;
        accessUserSelect.dispatchEvent(new Event('change'));
      }

      // Hide login gate
      modalLoginGate.classList.remove('active');

      // Launch session
      toggleSimulatorMode(true);

      // Trigger simulator active user change automatically
      if (btnSimulateActiveUser) {
        btnSimulateActiveUser.click();
      }

      // Route to pending target tab if any
      if (pendingTargetTab) {
        switchSimulatorTab(pendingTargetTab);
        pendingTargetTab = null;
      }
    });
  }

      if (loginRequestForm) {
    loginRequestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      try {
        const reqLead = {
          id: 'demo_req_' + Date.now(),
          timestamp: Date.now(),
          name: document.getElementById('login-request-name').value,
          email: document.getElementById('login-request-email').value,
          company: document.getElementById('login-request-company').value,
          source: 'Demo Request Form'
        };
        const leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
        leads.unshift(reqLead);
        localStorage.setItem('rc_leads', JSON.stringify(leads));
      } catch (err) {
        console.error(err);
      }

      // Hide form and tabs selector row
      loginRequestForm.style.display = 'none';
      const selectorRow = document.querySelector('.modal-form > .form-row');
      if (selectorRow) {
        selectorRow.style.display = 'none';
      }
      
      // Expand modal for Calendly iframe
      const modalOverlay = document.getElementById('modal-login-gate');
      if (modalOverlay) {
        const card = modalOverlay.querySelector('.modal-card');
        if (card) {
          card.style.maxWidth = '750px';
          card.style.width = '95%';
        }
      }
      
      // Show Calendly scheduler container
      const loginCalendlyContainer = document.getElementById('login-calendly-container');
      if (loginCalendlyContainer) {
        loginCalendlyContainer.style.display = 'block';
      }
    });
  }


  // ==========================================================================
  // 24. INVOICING MODULE AND REGISTRY CONTROLLER
  // ==========================================================================
  const btnInvoiceRegistryTab = document.getElementById('btn-invoice-registry-tab');
  const btnInvoiceQueueTab = document.getElementById('btn-invoice-queue-tab');
  const invoiceRegistryPane = document.getElementById('invoice-registry-pane');
  const invoiceQueuePane = document.getElementById('invoice-queue-pane');
  const btnTriggerCreateInvoice = document.getElementById('btn-trigger-create-invoice');
  const modalCreateInvoice = document.getElementById('modal-create-invoice');
  const btnCloseInvoiceModal = document.getElementById('btn-close-invoice-modal');
  const formCreateInvoice = document.getElementById('form-create-invoice');

  const invoiceRegistryTbody = document.getElementById('invoice-registry-tbody');
  const invoiceQueueTbody = document.getElementById('invoice-queue-tbody');
  const dashboardInvoicesTbody = document.getElementById('dashboard-invoices-tbody');
  const dashboardInvoiceCount = document.getElementById('dashboard-invoice-count');

  let invoices = [
    { id: 'INV-1001', client: 'Apex Holdings', date: '2026-06-01', amount: 25000, currency: 'USD ($)', dept: 'Operations', status: 'Dispatched' },
    { id: 'INV-1002', client: 'Beta Agency', date: '2026-06-05', amount: 14500, currency: 'EUR (€)', dept: 'Sales / BD', status: 'Paid' }
  ];

  let invoiceQueue = [
    { id: 'INV-9021', client: 'Apex Holdings', amount: 25000, currency: 'USD ($)', dept: 'Operations', status: 'Draft' },
    { id: 'INV-9022', client: 'Beta Agency', amount: 14500, currency: 'EUR (€)', dept: 'HR Suite', status: 'Draft' }
  ];

  function renderInvoiceTables() {
    if (invoiceRegistryTbody) {
      invoiceRegistryTbody.innerHTML = '';
      invoices.forEach(inv => {
        const tr = document.createElement('tr');
        const badgeClass = inv.status === 'Paid' ? 'badge-green' : 'badge-outline';
        tr.innerHTML = `
          <td style="padding: 10px; font-weight:600;">${inv.id}</td>
          <td style="padding: 10px;">${inv.client}</td>
          <td style="padding: 10px;">${inv.date}</td>
          <td style="padding: 10px; text-align:right;">${inv.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          <td style="padding: 10px;">${inv.currency}</td>
          <td style="padding: 10px;">${inv.dept}</td>
          <td style="padding: 10px; text-align:center;"><span class="badge ${badgeClass}">${inv.status}</span></td>
        `;
        invoiceRegistryTbody.appendChild(tr);
      });
    }

    if (invoiceQueueTbody) {
      invoiceQueueTbody.innerHTML = '';
      if (invoiceQueue.length === 0) {
        invoiceQueueTbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:15px; color:var(--text-muted);">No pending approvals in queue</td></tr>';
      } else {
        invoiceQueue.forEach((inv, idx) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td style="padding: 10px; font-weight:600;">${inv.id}</td>
            <td style="padding: 10px;">${inv.dept}</td>
            <td style="padding: 10px;">${inv.client}</td>
            <td style="padding: 10px; text-align:right;">${inv.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td style="padding: 10px;">${inv.currency}</td>
            <td style="padding: 10px; text-align:center;"><span class="badge badge-outline">Pending Approval</span></td>
            <td style="padding: 10px; text-align:center;">
              <button class="btn btn-primary btn-xs btn-approve-pay" data-idx="${idx}">Approve &amp; Proceed to Pay</button>
            </td>
          `;
          
          tr.querySelector('.btn-approve-pay').addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-idx'));
            const approved = invoiceQueue[index];
            
            // Remove from queue
            invoiceQueue.splice(index, 1);
            
            // Add to Registry
            invoices.unshift({
              id: approved.id,
              client: approved.client,
              date: new Date().toISOString().split('T')[0],
              amount: approved.amount,
              currency: approved.currency,
              dept: approved.dept,
              status: 'Paid'
            });

            alert(`Invoice ${approved.id} Approved & Paid successfully!`);
            renderInvoiceTables();
            syncInvoicesToDashboard();
          });

          invoiceQueueTbody.appendChild(tr);
        });
      }
    }
  }

  function syncInvoicesToDashboard() {
    if (!dashboardInvoicesTbody) return;
    dashboardInvoicesTbody.innerHTML = '';
    
    if (invoices.length === 0) {
      dashboardInvoicesTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:12px; color:var(--text-muted);">No invoices generated yet</td></tr>';
      if (dashboardInvoiceCount) dashboardInvoiceCount.textContent = '0 Invoices';
      return;
    }

    if (dashboardInvoiceCount) dashboardInvoiceCount.textContent = `${invoices.length} Invoices`;

    invoices.slice(0, 4).forEach(inv => {
      const tr = document.createElement('tr');
      const badgeClass = inv.status === 'Paid' ? 'badge-green' : 'badge-outline';
      tr.innerHTML = `
        <td style="padding: 8px; font-weight:600; font-size:12px;">${inv.id}</td>
        <td style="padding: 8px; font-size:12px;">${inv.client}</td>
        <td style="padding: 8px; text-align:right; font-size:12px; font-family:var(--font-family-mono);">${inv.amount.toLocaleString()}</td>
        <td style="padding: 8px; text-align:center;"><span class="badge ${badgeClass}" style="font-size: 9px; padding: 1px 4px;">${inv.status}</span></td>
      `;
      dashboardInvoicesTbody.appendChild(tr);
    });
  }

  if (btnInvoiceRegistryTab && btnInvoiceQueueTab) {
    btnInvoiceRegistryTab.addEventListener('click', () => {
      btnInvoiceRegistryTab.className = 'btn btn-primary btn-sm btn-subtab-invoice active';
      btnInvoiceQueueTab.className = 'btn btn-outline btn-sm btn-subtab-invoice';
      invoiceRegistryPane.style.display = 'block';
      invoiceQueuePane.style.display = 'none';
    });

    btnInvoiceQueueTab.addEventListener('click', () => {
      btnInvoiceQueueTab.className = 'btn btn-primary btn-sm btn-subtab-invoice active';
      btnInvoiceRegistryTab.className = 'btn btn-outline btn-sm btn-subtab-invoice';
      invoiceQueuePane.style.display = 'block';
      invoiceRegistryPane.style.display = 'none';
    });
  }

  if (btnTriggerCreateInvoice) {
    btnTriggerCreateInvoice.addEventListener('click', () => {
      modalCreateInvoice.classList.add('active');
      const dateInput = document.getElementById('inv-date');
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    });
  }
  if (btnCloseInvoiceModal) {
    btnCloseInvoiceModal.addEventListener('click', () => {
      modalCreateInvoice.classList.remove('active');
    });
  }

  if (formCreateInvoice) {
    formCreateInvoice.addEventListener('submit', (e) => {
      e.preventDefault();
      const client = document.getElementById('inv-client').value;
      const amount = parseFloat(document.getElementById('inv-amount').value);
      const currency = document.getElementById('inv-currency').value;
      const dept = document.getElementById('inv-dept').value;
      const date = document.getElementById('inv-date').value;
      
      const newId = `INV-${invoices.length + 1001}`;
      
      invoices.unshift({
        id: newId,
        client,
        date,
        amount,
        currency,
        dept,
        status: 'Dispatched'
      });

      renderInvoiceTables();
      syncInvoicesToDashboard();
      formCreateInvoice.reset();
      modalCreateInvoice.classList.remove('active');
      alert(`Invoice ${newId} generated and registered successfully!`);
    });
  }

  // Initial runs
  renderInvoiceTables();
  syncInvoicesToDashboard();


  // ==========================================================================
  // 25. PROJECT MANAGEMENT & COMMERCIAL MARGINS INTEGRATOR
  // ==========================================================================
  const btnTriggerCreateProject = document.getElementById('btn-trigger-create-project');
  const modalCreateProject = document.getElementById('modal-create-project');
  const btnCloseProjectModal = document.getElementById('btn-close-project-modal');
  const formCreateProject = document.getElementById('form-create-project');

  const modalUpdateProject = document.getElementById('modal-update-project');
  const btnCloseUpdateProjectModal = document.getElementById('btn-close-update-project-modal');
  const formUpdateProject = document.getElementById('form-update-project');

  const opsProjectsTbody = document.getElementById('ops-projects-tbody');
  const dashboardProjectsTbody = document.getElementById('dashboard-projects-tbody');
  const dashboardProjectCount = document.getElementById('dashboard-project-count');

  const btnApproveMarginProposal = document.getElementById('btn-approve-margin-proposal');

  let projects = [
    { code: 'PROJ-101', name: 'Database Audit', client: 'Vertex Global', billable: 150000, expense: 80000, status: 'Active' },
    { code: 'PROJ-102', name: 'CRM Integration', client: 'Apex Holdings', billable: 220000, expense: 120000, status: 'Active' },
    { code: 'PROJ-103', name: 'HRMS Onboarding Deck', client: 'Research Centric Ops', billable: 50000, expense: 15000, status: 'Completed' }
  ];

  function renderProjectsTable() {
    if (!opsProjectsTbody) return;
    opsProjectsTbody.innerHTML = '';

    projects.forEach((proj, idx) => {
      const marginVal = proj.billable - proj.expense;
      const marginPct = proj.billable > 0 ? Math.round((marginVal / proj.billable) * 100) : 0;
      
      const tr = document.createElement('tr');
      const badgeClass = proj.status === 'Completed' ? 'badge-green' : proj.status === 'Active' ? 'badge-blue' : 'badge-outline';
      
      tr.innerHTML = `
        <td style="padding: 10px; font-weight:600;">	ext-gradient ${proj.code}</td>
        <td style="padding: 10px; font-weight:500; color:var(--text-light);">${proj.name}</td>
        <td style="padding: 10px;">${proj.client}</td>
        <td style="padding: 10px; text-align:right;">$${proj.billable.toLocaleString()}</td>
        <td style="padding: 10px; text-align:right; color:var(--rose-error);">$${proj.expense.toLocaleString()}</td>
        <td style="padding: 10px; text-align:right; color:var(--turquoise-accent); font-weight:600;">${marginPct}% ($$${marginVal.toLocaleString()})</td>
        <td style="padding: 10px; text-align:center;"><span class="badge ${badgeClass}">${proj.status}</span></td>
        <td style="padding: 10px; text-align:center;">
          <button class="btn btn-outline btn-xs btn-update-proj" data-idx="${idx}">Edit</button>
        </td>
      `;

      tr.querySelector('.btn-update-proj').addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-idx'));
        const p = projects[index];
        
        document.getElementById('update-proj-idx').value = index;
        document.getElementById('update-proj-name').value = p.name;
        document.getElementById('update-proj-billable').value = p.billable;
        document.getElementById('update-proj-expense').value = p.expense;
        document.getElementById('update-proj-status').value = p.status;
        
        modalUpdateProject.classList.add('active');
      });

      opsProjectsTbody.appendChild(tr);
    });
  }

  function syncProjectsToDashboard() {
    if (!dashboardProjectsTbody) return;
    dashboardProjectsTbody.innerHTML = '';
    
    if (projects.length === 0) {
      dashboardProjectsTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:12px; color:var(--text-muted);">No active projects listed</td></tr>';
      if (dashboardProjectCount) dashboardProjectCount.textContent = '0 Projects';
      return;
    }

    if (dashboardProjectCount) dashboardProjectCount.textContent = `${projects.length} Projects`;

    projects.slice(0, 4).forEach(proj => {
      const marginVal = proj.billable - proj.expense;
      const marginPct = proj.billable > 0 ? Math.round((marginVal / proj.billable) * 100) : 0;
      const tr = document.createElement('tr');
      const badgeClass = proj.status === 'Completed' ? 'badge-green' : proj.status === 'Active' ? 'badge-blue' : 'badge-outline';
      
      tr.innerHTML = `
        <td style="padding: 8px; font-weight:600; font-size:12px;">${proj.code}</td>
        <td style="padding: 8px; font-size:12px; color:var(--text-light); font-weight:500;">${proj.name}</td>
        <td style="padding: 8px; text-align:right; font-size:12px; font-family:var(--font-family-mono);">$${proj.billable.toLocaleString()}</td>
        <td style="padding: 8px; text-align:right; font-size:12px; color:var(--rose-error); font-family:var(--font-family-mono);">$${proj.expense.toLocaleString()}</td>
        <td style="padding: 8px; text-align:center;"><span class="badge ${badgeClass}" style="font-size: 9px; padding: 1px 4px;">${proj.status}</span></td>
      `;
      dashboardProjectsTbody.appendChild(tr);
    });
  }

  if (btnTriggerCreateProject) {
    btnTriggerCreateProject.addEventListener('click', () => {
      modalCreateProject.classList.add('active');
    });
  }
  if (btnCloseProjectModal) {
    btnCloseProjectModal.addEventListener('click', () => {
      modalCreateProject.classList.remove('active');
    });
  }

  if (formCreateProject) {
    formCreateProject.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('proj-name').value;
      const code = document.getElementById('proj-code').value;
      const client = document.getElementById('proj-client').value;
      const billable = parseFloat(document.getElementById('proj-billable').value);
      const expense = parseFloat(document.getElementById('proj-expense').value);
      const status = document.getElementById('proj-status').value;

      projects.unshift({
        code,
        name,
        client,
        billable,
        expense,
        status
      });

      renderProjectsTable();
      syncProjectsToDashboard();
      formCreateProject.reset();
      modalCreateProject.classList.remove('active');
      alert(`Project ${code} launched successfully!`);
    });
  }

  if (btnCloseUpdateProjectModal) {
    btnCloseUpdateProjectModal.addEventListener('click', () => {
      modalUpdateProject.classList.remove('active');
    });
  }

  if (formUpdateProject) {
    formUpdateProject.addEventListener('submit', (e) => {
      e.preventDefault();
      const idx = parseInt(document.getElementById('update-proj-idx').value);
      const billable = parseFloat(document.getElementById('update-proj-billable').value);
      const expense = parseFloat(document.getElementById('update-proj-expense').value);
      const status = document.getElementById('update-proj-status').value;

      projects[idx].billable = billable;
      projects[idx].expense = expense;
      projects[idx].status = status;

      renderProjectsTable();
      syncProjectsToDashboard();
      modalUpdateProject.classList.remove('active');
      alert('Project details updated successfully!');
    });
  }

  if (btnApproveMarginProposal) {
    btnApproveMarginProposal.addEventListener('click', () => {
      const name = document.getElementById('comm-proj-name').value;
      const client = document.getElementById('comm-client-name').value;
      const revenue = parseFloat(commRevenueInput.value);
      const costs = parseFloat(commCostsInput.value);
      
      const code = `PROJ-${projects.length + 101}`;
      
      projects.unshift({
        code,
        name,
        client,
        billable: revenue,
        expense: costs,
        status: 'Active'
      });

      alert(`Margin Proposal Approved! Project ${name} has been pushed to active Project Management registry as code ${code} within the approved margins.`);
      
      renderProjectsTable();
      syncProjectsToDashboard();
      
      // Auto switch to projects tab to see it!
      switchSimulatorTab('tab-ops-projects');
    });
  }

  // Initial runs
  renderProjectsTable();
  syncProjectsToDashboard();


  // ==========================================================================
  // 26. EMPLOYEE ONBOARDING CHECKS CONTROLLER
  // ==========================================================================
  const onboardRosterList = document.getElementById('onboard-roster-list');
  const onboardDetailTitle = document.getElementById('onboard-detail-title');
  const onboardProgressBar = document.getElementById('onboard-progress-bar');
  
  const chkBgIdentity = document.getElementById('chk-bg-identity');
  const chkBgCriminal = document.getElementById('chk-bg-criminal');
  const chkBgAddress = document.getElementById('chk-bg-address');
  const chkBgMedical = document.getElementById('chk-bg-medical');
  
  const onboardAadhaarNum = document.getElementById('onboard-aadhaar-num');
  const onboardPanNum = document.getElementById('onboard-pan-num');
  const btnVerifyAadhaar = document.getElementById('btn-verify-aadhaar');
  const btnVerifyPan = document.getElementById('btn-verify-pan');
  
  const badgeAadhaarStatus = document.getElementById('badge-aadhaar-status');
  const badgePanStatus = document.getElementById('badge-pan-status');
  
  const onboardBadgeEdu = document.getElementById('onboard-badge-edu');
  const onboardBadgeExp = document.getElementById('onboard-badge-exp');
  const uploadDocBtns = document.querySelectorAll('.btn-upload-doc');

  const onboardingData = {
    CO: { name: 'Clara Oswald', role: 'HR Manager', progress: 100, checks: { identity: true, criminal: true, address: true, medical: true }, aadhaar: '3241-5829-1023', pan: 'COSW1924L', aadhaarStatus: 'Verified', panStatus: 'Verified', docEdu: 'Verified', docExp: 'Verified' },
    JC: { name: 'Jane Cooper', role: 'HR Assistant', progress: 75, checks: { identity: true, criminal: true, address: true, medical: false }, aadhaar: '4582-1023-9481', pan: 'JCOP8234D', aadhaarStatus: 'Verified', panStatus: 'Verified', docEdu: 'Verified', docExp: 'Pending' },
    ED: { name: 'Emily Davis', role: 'Software Engineer', progress: 40, checks: { identity: true, criminal: false, address: false, medical: false }, aadhaar: '1029-4819-2038', pan: 'EDAV9183K', aadhaarStatus: 'Verified', panStatus: 'Pending', docEdu: 'Pending', docExp: 'Pending' },
    RF: { name: 'Robert Fox', role: 'QA Engineer', progress: 20, checks: { identity: false, criminal: false, address: false, medical: false }, aadhaar: '', pan: '', aadhaarStatus: 'Pending', panStatus: 'Pending', docEdu: 'Pending', docExp: 'Pending' }
  };

  let selectedOnboardId = 'JC'; // default select

  function calculateOnboardProgress(profile) {
    let total = 0;
    
    // Checkbox items (40% max, 10% each)
    if (profile.checks.identity) total += 10;
    if (profile.checks.criminal) total += 10;
    if (profile.checks.address) total += 10;
    if (profile.checks.medical) total += 10;

    // ID verifications (30% max, 15% each)
    if (profile.aadhaarStatus === 'Verified') total += 15;
    if (profile.panStatus === 'Verified') total += 15;

    // Docs (30% max, 15% each)
    if (profile.docEdu === 'Verified') total += 15;
    if (profile.docExp === 'Verified') total += 15;

    profile.progress = total;
  }

  function renderOnboardingRoster() {
    if (!onboardRosterList) return;
    onboardRosterList.innerHTML = '';

    Object.keys(onboardingData).forEach(key => {
      const item = onboardingData[key];
      const div = document.createElement('div');
      div.className = `onboard-emp-item ${key === selectedOnboardId ? 'active' : ''}`;
      div.innerHTML = `
        <div class="emp-meta">
          <div class="avatar">${key}</div>
          <div>
            <span class="name">	ext-gradient ${item.name}</span>
            <span class="role">${item.role}</span>
          </div>
        </div>
        <span class="prog-badge">${item.progress}%</span>
      `;
      
      div.addEventListener('click', () => {
        selectedOnboardId = key;
        renderOnboardingRoster();
        loadOnboardDetails(key);
      });

      onboardRosterList.appendChild(div);
    });
  }

  function loadOnboardDetails(key) {
    const profile = onboardingData[key];
    if (!profile) return;

    if (onboardDetailTitle) onboardDetailTitle.textContent = `Onboarding Profile: ${profile.name}`;
    
    // Checkboxes
    chkBgIdentity.checked = profile.checks.identity;
    chkBgCriminal.checked = profile.checks.criminal;
    chkBgAddress.checked = profile.checks.address;
    chkBgMedical.checked = profile.checks.medical;

    // Government IDs
    onboardAadhaarNum.value = profile.aadhaar || '';
    onboardPanNum.value = profile.pan || '';
    
    // ID Badges
    badgeAadhaarStatus.textContent = profile.aadhaarStatus;
    badgeAadhaarStatus.className = `badge ${profile.aadhaarStatus === 'Verified' ? 'badge-green' : 'badge-outline'}`;
    
    badgePanStatus.textContent = profile.panStatus;
    badgePanStatus.className = `badge ${profile.panStatus === 'Verified' ? 'badge-green' : 'badge-outline'}`;

    // Doc Badges
    onboardBadgeEdu.textContent = profile.docEdu;
    onboardBadgeEdu.className = `badge ${profile.docEdu === 'Verified' ? 'badge-green' : profile.docEdu === 'Uploaded' ? 'badge-uploaded' : 'badge-pending'}`;

    onboardBadgeExp.textContent = profile.docExp;
    onboardBadgeExp.className = `badge ${profile.docExp === 'Verified' ? 'badge-green' : profile.docExp === 'Uploaded' ? 'badge-uploaded' : 'badge-pending'}`;

    // Progress Bar
    onboardProgressBar.style.width = `${profile.progress}%`;
    onboardProgressBar.textContent = `${profile.progress}%`;
  }

  // Checkbox Event Listeners
  const bindOnboardCheck = (el, prop) => {
    if (el) {
      el.addEventListener('change', () => {
        const profile = onboardingData[selectedOnboardId];
        if (!profile) return;
        profile.checks[prop] = el.checked;
        calculateOnboardProgress(profile);
        loadOnboardDetails(selectedOnboardId);
        renderOnboardingRoster();
      });
    }
  };

  bindOnboardCheck(chkBgIdentity, 'identity');
  bindOnboardCheck(chkBgCriminal, 'criminal');
  bindOnboardCheck(chkBgAddress, 'address');
  bindOnboardCheck(chkBgMedical, 'medical');

  // ID verify buttons
  if (btnVerifyAadhaar) {
    btnVerifyAadhaar.addEventListener('click', () => {
      const profile = onboardingData[selectedOnboardId];
      if (!profile) return;
      
      const num = onboardAadhaarNum.value.trim();
      if (!num) {
        alert('Please enter a valid Aadhaar Number first!');
        return;
      }
      
      profile.aadhaar = num;
      profile.aadhaarStatus = 'Verified';
      calculateOnboardProgress(profile);
      loadOnboardDetails(selectedOnboardId);
      renderOnboardingRoster();
      alert('Aadhaar ID status matched with UIDAI repository successfully!');
    });
  }

  if (btnVerifyPan) {
    btnVerifyPan.addEventListener('click', () => {
      const profile = onboardingData[selectedOnboardId];
      if (!profile) return;
      
      const num = onboardPanNum.value.trim();
      if (!num) {
        alert('Please enter a valid PAN Number first!');
        return;
      }
      
      profile.pan = num;
      profile.panStatus = 'Verified';
      calculateOnboardProgress(profile);
      loadOnboardDetails(selectedOnboardId);
      renderOnboardingRoster();
      alert('PAN Tax registration matched with NSDL records successfully!');
    });
  }

  // Doc uploads
  uploadDocBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const docType = e.currentTarget.getAttribute('data-doc');
      const profile = onboardingData[selectedOnboardId];
      if (!profile) return;

      if (docType === 'edu') {
        if (profile.docEdu === 'Pending') {
          profile.docEdu = 'Uploaded';
          alert('Degree Certificate uploaded! Click again to verify documents.');
        } else if (profile.docEdu === 'Uploaded') {
          profile.docEdu = 'Verified';
          alert('Degree Certificate compliance checks passed and locked!');
        }
      } else {
        if (profile.docExp === 'Pending') {
          profile.docExp = 'Uploaded';
          alert('Experience Letter uploaded! Click again to verify documents.');
        } else if (profile.docExp === 'Uploaded') {
          profile.docExp = 'Verified';
          alert('Previous Employment experience verified and cleared!');
        }
      }

      calculateOnboardProgress(profile);
      loadOnboardDetails(selectedOnboardId);
      renderOnboardingRoster();
    });
  });

  // Init onboarding view
  renderOnboardingRoster();
  loadOnboardDetails(selectedOnboardId);


  // ==========================================================================
  // 27. NOTICE BOARD PRE-POPULATION ON STARTUP
  // ==========================================================================
  function initializeNoticeBoardData() {
    const noticeList = document.getElementById('notices-list-container');
    if (!noticeList) return;
    
    // Clear and redraw to make sure it is populated
    noticeList.innerHTML = `
      <div class="notice-card glass-card">
        <div class="notice-header">
          <span class="notice-badge badge-green">Events</span>
          <span class="notice-date">10 June 2026</span>
        </div>
        <h3>Independence Day Holiday Notice</h3>
        <p class="notice-desc">Dear Team, please note that all offices will remain closed on Saturday, August 15, 2026, in observance of Independence Day. Regular operations will resume on August 17. Have a safe and happy holiday!</p>
        <div class="notice-author">
          <div class="avatar">AW</div>
          <span class="author-info">Posted by <strong>Alexander Wright</strong> &bull; Managing Director</span>
        </div>
      </div>

      <div class="notice-card glass-card">
        <div class="notice-header">
          <span class="notice-badge badge-blue">HR Operations</span>
          <span class="notice-date">08 June 2026</span>
        </div>
        <h3>Q2 Performance Cycle Kickoff</h3>
        <p class="notice-desc">The Q2 2026 employee feedback and performance review cycle is now officially open. Please submit your self-evaluations and set your OKR objectives in the Scorecard tab by Friday, June 20.</p>
        <div class="notice-author">
          <div class="avatar">CO</div>
          <span class="author-info">Posted by <strong>Clara Oswald</strong> &bull; HR Manager</span>
        </div>
      </div>

      <div class="notice-card glass-card">
        <div class="notice-header">
          <span class="notice-badge badge-yellow">IT Security</span>
          <span class="notice-date">05 June 2026</span>
        </div>
        <h3>Mandatory Security Awareness Update</h3>
        <p class="notice-desc">We have updated our internal data compliance protocol. Please run your company device updates and ensure that public networks are only accessed via the secure corporate VPN endpoint.</p>
        <div class="notice-author">
          <div class="avatar">DV</div>
          <span class="author-info">Posted by <strong>David K. Vance</strong> &bull; Lead Architect</span>
        </div>
      </div>
    `;

    // Sync latest notice to Dashboard
    const dashboardNoticeBoard = document.querySelector('.card-notice-board');
    if (dashboardNoticeBoard) {
      dashboardNoticeBoard.innerHTML = `
        <h3>Latest Notice</h3>
        <div class="notice-header-row" style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span class="badge badge-blue" style="font-size:10px;">HR Operations</span>
          <span style="font-size:11px; color:var(--text-muted);">08 June 2026</span>
        </div>
        <h4 style="font-size: 13.5px; color:#fff; font-weight:600; margin-bottom:4px;">Q2 Performance Cycle Kickoff</h4>
        <p style="font-size: 12.5px; color:var(--text-normal); line-height:1.4; margin:0;">The Q2 2026 employee feedback and performance review cycle is now open. Pl. submit self-evaluations in the Scorecard tab.</p>
      `;
    }
  }

  initializeNoticeBoardData();

  // ----------------------------------------------------
  // Workflow Automation Hub Tabs Switching
  // ----------------------------------------------------
  const automationTabs = document.querySelectorAll('.automation-tab');
  const automationPanels = document.querySelectorAll('.automation-panel');
 
  automationTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetFlowId = tab.getAttribute('data-flow');
      
      // Update active tab class
      automationTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
 
      // Update active panel class
      automationPanels.forEach(panel => {
        if (panel.id === targetFlowId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

});