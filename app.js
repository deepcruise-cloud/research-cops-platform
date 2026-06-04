document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------
  // 1. Header Scroll Dynamics
  // ----------------------------------------------------
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header-floating');
    } else {
      header.classList.remove('header-floating');
    }
  });

  // ----------------------------------------------------
  // 1b. Mobile Navigation and Dropdown Interactions
  // ----------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const navDropdown = document.querySelector('.nav-dropdown');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        navDropdown.classList.toggle('active');
      }
    });
  }

  // ----------------------------------------------------
  // 1c. Hero Telemetry Dashboard & GDPR-Compliant Simulation
  // ----------------------------------------------------
  const logsContainer = document.getElementById('telemetry-logs-container');

  function generateRandomLog() {
    const genders = ['Female', 'Male', 'Non-binary'];
    const gender = genders[Math.random() < 0.02 ? 2 : (Math.random() < 0.52 ? 0 : 1)];
    const age = Math.floor(Math.random() * (75 - 18 + 1)) + 18;
    const countries = [
      'United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia', 'India', 'Singapore', 'Japan', 'Brazil',
      'Spain', 'Italy', 'Netherlands', 'Sweden', 'Switzerland', 'South Africa', 'Mexico', 'Argentina', 'Colombia', 'United Arab Emirates',
      'Saudi Arabia', 'Poland', 'Turkey', 'South Korea', 'China', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines',
      'New Zealand', 'Egypt', 'Nigeria', 'Kenya', 'Ireland', 'Belgium', 'Austria', 'Norway', 'Denmark', 'Finland'
    ];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const surveyType = Math.random() < 0.45 ? 'B2B survey' : 'B2C survey';
    
    const templates = [
      {
        text: `[PASS] ${gender} (${age}, ${country}) completed ${surveyType}. Quality checks passed.`,
        class: 'text-emerald'
      },
      {
        text: `[PASS] ${gender} (${age}, ${country}) verified for ${surveyType}. Response data integrity verified.`,
        class: 'text-emerald'
      },
      {
        text: `[BLOCK] Proxy/VPN detected: ${gender} (${age}, ${country}) rejected. Blocked from ${surveyType}.`,
        class: 'text-red'
      },
      {
        text: `[BLOCK] Speeder alert: ${gender} (${age}, ${country}) terminated. Failed LOI threshold for ${surveyType}.`,
        class: 'text-red'
      },
      {
        text: `[BLOCK] Attention check failed: ${gender} (${age}, ${country}) flagged on straight-lining. Response discarded.`,
        class: 'text-red'
      },
      {
        text: `[SYNC] API callback: ${gender} (${age}, ${country}) synced to ${surveyType} panel cohort.`,
        class: 'text-cyan'
      },
      {
        text: `[VERIFY] Digital fingerprint validated for ${gender} (${age}, ${country}) on ${surveyType}.`,
        class: 'text-cyan'
      },
      {
        text: `[INIT] Demographic profile validation active for ${gender} (${age}, ${country}) session.`,
        class: ''
      }
    ];

    const index = Math.floor(Math.random() * templates.length);
    return templates[index];
  }

  if (logsContainer) {
    setInterval(() => {
      // Create new random log line
      const log = generateRandomLog();
      const logLineDiv = document.createElement('div');
      logLineDiv.className = `log-line ${log.class}`;
      
      // Update timestamp dynamically to simulate real local time
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const formattedText = `[${timeStr}] ${log.text}`;
      
      logLineDiv.textContent = formattedText;
      logsContainer.appendChild(logLineDiv);
      
      // Keep console to 10 lines max for visual balance
      if (logsContainer.children.length > 10) {
        logsContainer.removeChild(logsContainer.children[0]);
      }
      
      // Scroll to bottom
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }, 3000);
  }

  // ----------------------------------------------------
  // ----------------------------------------------------
  // 2. Custom Multi-Select Dropdowns Interaction
  // ----------------------------------------------------
  const multiselects = document.querySelectorAll('.custom-multiselect');
  
  multiselects.forEach(ms => {
    const selectBox = ms.querySelector('.ms-select-box');
    
    selectBox.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = ms.classList.contains('active');
      
      // Close all other dropdowns
      multiselects.forEach(other => other.classList.remove('active'));
      
      if (!isActive) {
        ms.classList.add('active');
      }
    });

    const container = ms.querySelector('.ms-dropdown-container');
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Close all dropdowns when clicking outside
  document.addEventListener('click', () => {
    multiselects.forEach(ms => ms.classList.remove('active'));
  });

  function updateMultiselectText(elementId, defaultText) {
    const msElement = document.getElementById(elementId);
    if (!msElement) return;
    const checkboxes = msElement.querySelectorAll('input[type="checkbox"]');
    const checked = Array.from(checkboxes).filter(cb => cb.checked);
    const labelEl = msElement.querySelector('.ms-selected-text');
    if (labelEl) {
      if (checked.length === 0) {
        labelEl.textContent = defaultText;
      } else if (checked.length === 1) {
        labelEl.textContent = checked[0].parentElement.textContent.trim();
      } else if (checked.length === checkboxes.length) {
        labelEl.textContent = "All Selected";
      } else {
        labelEl.textContent = `${checked.length} Selected`;
      }
    }
  }

  // Update selected displays initially
  updateMultiselectText('ms-industry', 'All Industries');
  updateMultiselectText('ms-department', 'All Departments');
  updateMultiselectText('ms-role', 'All Roles / Staff');

  // ----------------------------------------------------
  // 2b. Interactive B2B CPI & Feasibility Calculator
  // ----------------------------------------------------
  const audienceSelect = document.getElementById('calc-audience');
  const countrySelect = document.getElementById('calc-country');
  const employeeSizeSelect = document.getElementById('calc-employee-size');
  const sampleSizeSlider = document.getElementById('calc-sample-size');
  const sampleSizeVal = document.getElementById('sample-size-value');
  const loiSlider = document.getElementById('calc-loi');
  const loiVal = document.getElementById('loi-value');

  // Outputs
  const outCpi = document.getElementById('out-cpi');
  const outBudget = document.getElementById('out-budget');
  const outFeasibilityLabel = document.getElementById('out-feasibility-label');
  const feasibilityMeter = document.getElementById('feasibility-meter');
  const outFieldTime = document.getElementById('out-fieldtime');
  const lockEstimateBtn = document.getElementById('lock-estimate-btn');

  // Fields to Sync to B2B Form
  const formCpi = document.getElementById('form-cpi');
  const formBudget = document.getElementById('form-budget');

  function getCategoryAddon(checkedItems) {
    if (checkedItems.length === 0) return 0;
    const addons = checkedItems.map(item => parseFloat(item.getAttribute('data-add')) || 0);
    const maxAddon = Math.max(...addons);
    const count = checkedItems.length;
    return maxAddon + (count - 1) * 0.50;
  }

  function calculateEstimate() {
    const audience = audienceSelect.value;
    const country = countrySelect.value;
    const sampleSize = parseInt(sampleSizeSlider.value);
    const loi = parseInt(loiSlider.value);

    // Update Slider Labels
    sampleSizeVal.textContent = sampleSize.toLocaleString();
    loiVal.textContent = `${loi} mins`;

    // Calculate Base CPI and Multipliers from attributes
    const selectedAudienceOpt = audienceSelect.options[audienceSelect.selectedIndex];
    const selectedCountryOpt = countrySelect.options[countrySelect.selectedIndex];
    const selectedSizeOpt = employeeSizeSelect.options[employeeSizeSelect.selectedIndex];
    
    const baseCpi = parseFloat(selectedAudienceOpt.getAttribute('data-cpi')) || 3.50;
    const countryMultiplier = parseFloat(selectedCountryOpt.getAttribute('data-multiplier')) || 1.0;
    const sizeAddon = parseFloat(selectedSizeOpt.getAttribute('data-add')) || 0.0;

    // Get checked checkboxes for custom multiselects
    const selectedIndustries = Array.from(document.querySelectorAll('#ms-industry input[type="checkbox"]:checked'));
    const selectedDepartments = Array.from(document.querySelectorAll('#ms-department input[type="checkbox"]:checked'));
    const selectedRoles = Array.from(document.querySelectorAll('#ms-role input[type="checkbox"]:checked'));

    // Update multiselect text headers
    updateMultiselectText('ms-industry', 'All Industries');
    updateMultiselectText('ms-department', 'All Departments');
    updateMultiselectText('ms-role', 'All Roles / Staff');

    // Calculate Category Addons
    const industryAddon = getCategoryAddon(selectedIndustries);
    const departmentAddon = getCategoryAddon(selectedDepartments);
    const roleAddon = getCategoryAddon(selectedRoles);

    // LOI multiplier: if LOI > 15 min, add 3% per additional minute; if LOI < 15, subtract 2% per minute below
    let loiMultiplier = 1.0;
    if (loi > 15) {
      loiMultiplier = 1.0 + (loi - 15) * 0.03;
    } else if (loi < 15) {
      loiMultiplier = 1.0 - (15 - loi) * 0.02;
    }

    // Volume Discount factor
    let volumeDiscount = 1.0;
    if (sampleSize < 250) {
      volumeDiscount = 1.15;
    } else if (sampleSize >= 1000 && sampleSize < 2500) {
      volumeDiscount = 0.90;
    } else if (sampleSize >= 2500) {
      volumeDiscount = 0.80;
    }

    // Formula: CPI = (baseCPI + industryAddon + departmentAddon + roleAddon + sizeAddon) * countryMultiplier * loiMultiplier * volumeDiscount
    const finalCpi = (baseCpi + industryAddon + departmentAddon + roleAddon + sizeAddon) * countryMultiplier * loiMultiplier * volumeDiscount;
    const finalBudget = finalCpi * sampleSize;

    outCpi.textContent = `$${finalCpi.toFixed(2)}`;
    outBudget.textContent = `$${finalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Feasibility strength metric calculation
    let feasibilityScore = 100;

    // Audience base feasibility
    if (audience === 'consumer') {
      feasibilityScore = 95;
    } else if (audience === 'business') {
      feasibilityScore = 85;
    } else if (audience === 'healthcare') {
      feasibilityScore = 55;
    } else if (audience === 'csuite') {
      feasibilityScore = 40;
    }

    // Adjust for country scarcity
    if (countryMultiplier > 1.05) {
      feasibilityScore -= 10;
    } else if (countryMultiplier < 0.8) {
      feasibilityScore += 5;
    }

    // Adjust for employee size restriction
    if (employeeSizeSelect.value !== 'all') {
      feasibilityScore -= 10;
    }

    // Adjust for industry checkboxes complexity
    if (selectedIndustries.length > 0) {
      feasibilityScore -= 10;
      feasibilityScore -= (selectedIndustries.length - 1) * 5;
    }

    // Adjust for department checkboxes complexity
    if (selectedDepartments.length > 0) {
      feasibilityScore -= 10;
      feasibilityScore -= (selectedDepartments.length - 1) * 5;
    }

    // Adjust for job role checkboxes complexity
    if (selectedRoles.length > 0) {
      const hasDoctorOrCsuite = selectedRoles.some(cb => cb.value === 'doctor' || cb.value === 'csuite');
      if (hasDoctorOrCsuite) {
        feasibilityScore -= 25;
      } else {
        feasibilityScore -= 15;
      }
      feasibilityScore -= (selectedRoles.length - 1) * 8;
    }

    // Adjust for sample size
    if (sampleSize > 1500 && sampleSize <= 3000) {
      feasibilityScore -= 10;
    } else if (sampleSize > 3000) {
      feasibilityScore -= 25;
    }

    // Clamp feasibilityScore between 5% and 100%
    feasibilityScore = Math.max(5, Math.min(100, feasibilityScore));
    
    feasibilityMeter.style.width = `${feasibilityScore}%`;
    
    // Reset feasibility labels and bar colors
    feasibilityMeter.className = 'meter-bar';
    outFeasibilityLabel.className = 'val';

    if (feasibilityScore >= 75) {
      feasibilityMeter.classList.add('bg-emerald');
      outFeasibilityLabel.textContent = 'High Feasibility';
      outFeasibilityLabel.classList.add('text-emerald');
    } else if (feasibilityScore >= 45 && feasibilityScore < 75) {
      feasibilityMeter.classList.add('bg-yellow');
      outFeasibilityLabel.textContent = 'Moderate Feasibility';
      outFeasibilityLabel.classList.add('text-yellow');
    } else {
      feasibilityMeter.classList.add('bg-red');
      outFeasibilityLabel.textContent = 'Custom Feasibility (Contact Us)';
      outFeasibilityLabel.classList.add('text-red');
    }

    // Estimated Field Delivery Turnaround
    let baseDays = 2; // base B2B days
    if (audience === 'consumer') {
      baseDays = 1;
    } else if (audience === 'healthcare') {
      baseDays = 5;
    } else if (audience === 'csuite') {
      baseDays = 7;
    }

    // Adjust for sample size volume
    if (sampleSize > 1000 && sampleSize <= 2500) {
      baseDays += 2;
    } else if (sampleSize > 2500) {
      baseDays += 4;
    }

    // Adjust for targeting complexity
    if (selectedIndustries.length > 0) {
      baseDays += 1;
      if (selectedIndustries.length > 2) baseDays += 1;
    }
    if (selectedDepartments.length > 0) {
      baseDays += 1;
      if (selectedDepartments.length > 2) baseDays += 1;
    }
    if (selectedRoles.length > 0) {
      baseDays += 1;
      const hasDoctorOrCsuite = selectedRoles.some(cb => cb.value === 'doctor' || cb.value === 'csuite');
      if (hasDoctorOrCsuite) baseDays += 2;
      if (selectedRoles.length > 2) baseDays += 1;
    }

    // Adjust for low feasibility timelines
    if (feasibilityScore < 45) {
      baseDays += 3;
    }
    if (feasibilityScore < 25) {
      baseDays += 5;
    }

    let deliveryTime = `${baseDays}-${baseDays+2} Business Days`;
    if (baseDays <= 2 && sampleSize < 1000) {
      deliveryTime = "24-48 Hours";
    }
    outFieldTime.textContent = deliveryTime;
  }

  // Event handlers
  audienceSelect.addEventListener('change', calculateEstimate);
  countrySelect.addEventListener('change', calculateEstimate);
  employeeSizeSelect.addEventListener('change', calculateEstimate);
  sampleSizeSlider.addEventListener('input', calculateEstimate);
  loiSlider.addEventListener('input', calculateEstimate);

  // Checkbox event listeners for custom dropdowns
  document.querySelectorAll('.custom-multiselect input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', calculateEstimate);
  });

  // Trigger initial calculation
  calculateEstimate();

  // ----------------------------------------------------
  // 3. Tab State Controller (Demographics & API Terminal)
  // ----------------------------------------------------
  function setupTabControls(containerClass, btnClass, contentClass) {
    const tabContainers = document.querySelectorAll(containerClass);
    
    tabContainers.forEach(container => {
      const buttons = container.querySelectorAll(btnClass);
      const contents = container.querySelectorAll(contentClass);

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-tab') || btn.getAttribute('data-terminal');
          
          buttons.forEach(b => b.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));

          btn.classList.add('active');
          const matchedPanel = container.querySelector(`#${targetId}`);
          if (matchedPanel) {
            matchedPanel.classList.add('active');
          }
        });
      });
    });
  }

  // Initialize
  setupTabControls('.tabs-container', '.tab-btn', '.tab-content');
  setupTabControls('.terminal-card', '.term-tab', '.code-block');

  // ----------------------------------------------------
  // 4. Lock Estimate values to form fields
  // ----------------------------------------------------
  lockEstimateBtn.addEventListener('click', () => {
    formCpi.value = outCpi.textContent;
    formBudget.value = outBudget.textContent;
    
    adjustFormContext('calc');

    // Scroll to contact form
    const contactForm = document.getElementById('contact');
    contactForm.scrollIntoView({ behavior: 'smooth' });
  });

  // ----------------------------------------------------
  // 5. Quote/Contact Form Validations (Original PHP rules)
  // ----------------------------------------------------
  const quoteForm = document.getElementById('contact_form');
  const btnSubmit = document.getElementById('save_btn');
  const errorMsgContainer = document.getElementById('error_messages');

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const company = document.getElementById('company').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // Regex validators
    const lettersPattern = /^[a-zA-Z\s.-]{2,}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Clear previous errors
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

    // Name validations
    if (name === "") {
      showFieldError('error_name', 'Please Enter your Name');
      return false;
    }
    if (!name.match(lettersPattern)) {
      showFieldError('error_name', 'Only letters and spaces are allowed (min 2 chars)');
      return false;
    }

    // Email validation
    if (!email.match(emailPattern)) {
      showFieldError('error_email', 'You have entered an invalid email address!');
      return false;
    }

    // Company validation
    if (company === "") {
      showFieldError('error_company', 'Please Enter your company Name');
      return false;
    }

    // Phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (phone === "") {
      showFieldError('error_phone', 'Please Enter your Phone number');
      return false;
    }
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      showFieldError('error_phone', 'Phone number must contain between 10 and 15 digits');
      return false;
    }

    // Message validation
    if (message === "") {
      showFieldError('error_message', 'Please Enter your Messages');
      return false;
    }

    // Submit Simulation
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Submitting Quote Request...';

    setTimeout(() => {
      errorMsgContainer.textContent = '✔ Thank you! Quote request received successfully. Our team will contact you within 2 hours.';
      quoteForm.reset();
      
      // Reset form variables
      formCpi.value = 'Not calculated';
      formBudget.value = 'Not calculated';
      
      const formSolution = document.getElementById('form-selected-solution');
      const formScale = document.getElementById('form-estimated-scale');
      if (formSolution) formSolution.value = 'None';
      if (formScale) formScale.value = 'Not specified';

      const calcRow = document.getElementById('contact-calc-row');
      const automationRow = document.getElementById('contact-automation-row');
      if (calcRow) {
        calcRow.style.display = 'flex';
        calcRow.style.backgroundColor = '';
        calcRow.style.borderColor = '';
      }
      if (automationRow) {
        automationRow.style.display = 'none';
        automationRow.style.backgroundColor = '';
        automationRow.style.borderColor = '';
      }

      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Submit Now!';

      // Clear success notification banner
      setTimeout(() => {
        errorMsgContainer.textContent = '';
      }, 5000);

    }, 1500);
  });

  function showFieldError(elementId, errorText) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = errorText;
      setTimeout(() => {
        errorEl.textContent = '';
      }, 5000);
    }
  }

  // ----------------------------------------------------
  // 6. Hero Segment Tab Switching (Feasibility Engine)
  // ----------------------------------------------------
  const segTabs = document.querySelectorAll('.seg-tab');
  const reachCount = document.getElementById('reach-count');
  const reachCpi = document.getElementById('reach-cpi');
  const reachFeasibility = document.getElementById('reach-feasibility');
  const reachBar = document.getElementById('reach-bar');
  const reachTagsContainer = document.getElementById('reach-tags');

  const segmentData = {
    b2b: {
      count: '850,000+',
      cpi: '$7.00',
      feasibility: '94% (High)',
      barWidth: '94%',
      barClass: 'bg-emerald',
      tags: ['IT Decision Makers', 'C-Suite Executives', 'HR Managers', 'Software Developers']
    },
    healthcare: {
      count: '350,000+',
      cpi: '$15.00',
      feasibility: '82% (Medium-High)',
      barWidth: '82%',
      barClass: 'bg-cyan',
      tags: ['Primary Care Physicians', 'Registered Nurses', 'Pharmacists', 'Specialist MDs']
    },
    consumer: {
      count: '1,200,000+',
      cpi: '$3.50',
      feasibility: '98% (Very High)',
      barWidth: '98%',
      barClass: 'bg-emerald',
      tags: ['Gamers & Tech Adopters', 'Parents & Homeowners', 'Auto Owners', 'Frequent Travelers']
    }
  };

  segTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const seg = tab.getAttribute('data-segment');
      segTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const data = segmentData[seg];
      if (data && reachCpi && reachFeasibility && reachBar && reachTagsContainer) {
        if (reachCount) reachCount.textContent = data.count;
        reachCpi.textContent = data.cpi;
        reachFeasibility.textContent = data.feasibility;
        
        reachBar.style.width = data.barWidth;
        reachBar.className = `q-bar-fill ${data.barClass}`;

        reachTagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'tag-pill';
          span.textContent = tag;
          reachTagsContainer.appendChild(span);
        });
      }
    });
  });
 
  // ----------------------------------------------------
  // 7. Workflow Automation Hub Tabs Switching
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
 
  // ----------------------------------------------------
  // 8. Contact for Cost and Demo CTA handlers
  // ----------------------------------------------------
  const demoButtons = document.querySelectorAll('.btn-demo-action');
  const contactMessage = document.getElementById('message');
 
  // Helper to adjust form fields dynamically based on context
  function adjustFormContext(mode, solutionName = 'None', scaleText = 'Not specified') {
    const calcRow = document.getElementById('contact-calc-row');
    const automationRow = document.getElementById('contact-automation-row');
    const formSolution = document.getElementById('form-selected-solution');
    const formScale = document.getElementById('form-estimated-scale');
    const inquiryType = document.getElementById('contact-inquiry-type');

    if (mode === 'calc') {
      if (inquiryType) inquiryType.value = 'data-collection';
      if (calcRow) {
        calcRow.style.display = 'flex';
        calcRow.style.backgroundColor = 'rgba(4, 203, 194, 0.05)';
        calcRow.style.borderColor = 'rgba(4, 203, 194, 0.3)';
      }
      if (automationRow) {
        automationRow.style.display = 'none';
      }
    } else {
      if (inquiryType) inquiryType.value = 'workflow-automation';
      if (calcRow) {
        calcRow.style.display = 'none';
      }
      if (automationRow) {
        automationRow.style.display = 'flex';
        automationRow.style.backgroundColor = 'rgba(4, 203, 194, 0.05)';
        automationRow.style.borderColor = 'rgba(4, 203, 194, 0.3)';
      }
      if (formSolution) {
        let matchedVal = 'None';
        const opts = Array.from(formSolution.options).map(o => o.value);
        if (opts.includes(solutionName)) {
          matchedVal = solutionName;
        } else {
          const matchedOpt = Array.from(formSolution.options).find(o => o.value.toLowerCase().includes(solutionName.toLowerCase()) || solutionName.toLowerCase().includes(o.value.toLowerCase()));
          if (matchedOpt) matchedVal = matchedOpt.value;
        }
        formSolution.value = matchedVal;
      }
      if (formScale) {
        let matchedVal = 'Not specified';
        const opts = Array.from(formScale.options).map(o => o.value);
        if (opts.includes(scaleText)) {
          matchedVal = scaleText;
        } else {
          const matchedOpt = Array.from(formScale.options).find(o => o.value.toLowerCase().includes(scaleText.toLowerCase()) || scaleText.toLowerCase().includes(o.value.toLowerCase()));
          if (matchedOpt) matchedVal = matchedOpt.value;
        }
        formScale.value = matchedVal;
      }
    }
  }

  // Inquiry Type manual toggle listener
  const inquiryTypeSelect = document.getElementById('contact-inquiry-type');
  if (inquiryTypeSelect) {
    inquiryTypeSelect.addEventListener('change', (e) => {
      if (e.target.value === 'data-collection') {
        adjustFormContext('calc');
      } else {
        adjustFormContext('automation');
      }
    });
  }

  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.getAttribute('data-demo-subject') || 'Enterprise Workflow Automation Suite';
      
      // Auto-populate message textarea
      if (contactMessage) {
        contactMessage.value = `Hello, I would like to request custom pricing and a live demo for: "${subject}". Please contact me to align on our requirements.`;
      }
 
      // Switch form layout dynamically
      adjustFormContext('automation', subject, 'Bespoke Scale / Pricing Review');

      // Smooth scroll to contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  // ----------------------------------------------------
  // 9. SupportGenie Chatbot Core Logic (Multi-turn State Machine)
  // ----------------------------------------------------
  const chatTrigger = document.getElementById('support-genie-trigger');
  const chatBox = document.getElementById('support-genie-box');
  const chatClose = document.getElementById('chatbox-close');
  const chatMessagesLog = document.getElementById('chatbox-messages');
  const chatForm = document.getElementById('chatbox-input-form');
  const chatInput = document.getElementById('chatbox-input');

  const chatState = {
    step: 'main',
    panelType: null,
    region: null,
    sampleSize: null,
    loi: null,
    wfSolution: null,
    wfScale: null,
    wfIntegration: null,
    intScale: null
  };
  
  if (chatTrigger && chatBox) {
    chatTrigger.addEventListener('click', () => {
      chatBox.classList.toggle('active');
      scrollChatToBottom();
    });
  }
 
  if (chatClose && chatBox) {
    chatClose.addEventListener('click', () => {
      chatBox.classList.remove('active');
    });
  }
 
  function scrollChatToBottom() {
    if (chatMessagesLog) {
      chatMessagesLog.scrollTop = chatMessagesLog.scrollHeight;
    }
  }
 
  function appendChatMessage(text, sender = 'bot') {
    if (!chatMessagesLog) return;
    
    const msgWrapper = document.createElement('div');
    msgWrapper.className = `chat-message-wrapper ${sender === 'user' ? 'user-wrapper' : 'bot-wrapper'}`;

    if (sender === 'bot') {
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'chat-message-avatar';
      avatarDiv.innerHTML = '<img src="support_genie_avatar.png" alt="SupportGenie" class="genie-avatar-img">';
      msgWrapper.appendChild(avatarDiv);
    }
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;
    
    const p = document.createElement('p');
    p.innerHTML = text;
    msgDiv.appendChild(p);
 
    msgWrapper.appendChild(msgDiv);
    chatMessagesLog.appendChild(msgWrapper);
    scrollChatToBottom();
  }

  function appendChatSummaryCard(title, rows) {
    if (!chatMessagesLog) return;

    const msgWrapper = document.createElement('div');
    msgWrapper.className = 'chat-message-wrapper bot-wrapper';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat-message-avatar';
    avatarDiv.innerHTML = '<img src="support_genie_avatar.png" alt="SupportGenie" class="genie-avatar-img">';
    msgWrapper.appendChild(avatarDiv);

    const cardDiv = document.createElement('div');
    cardDiv.className = 'chat-summary-card';
    
    let html = `<h5>${title}</h5>`;
    rows.forEach(row => {
      html += `
        <div class="summary-metric-row">
          <span class="lbl">${row.label}</span>
          <span class="val ${row.highlight ? 'highlight' : ''}">${row.value}</span>
        </div>
      `;
    });
    cardDiv.innerHTML = html;

    msgWrapper.appendChild(cardDiv);
    chatMessagesLog.appendChild(msgWrapper);
    scrollChatToBottom();
  }
 
  let typingIndicatorElement = null;
  function showTypingIndicator() {
    if (typingIndicatorElement || !chatMessagesLog) return;
    
    typingIndicatorElement = document.createElement('div');
    typingIndicatorElement.className = 'typing-indicator';
    typingIndicatorElement.innerHTML = '<span></span><span></span><span></span>';
    
    chatMessagesLog.appendChild(typingIndicatorElement);
    scrollChatToBottom();
  }
 
  function hideTypingIndicator() {
    if (typingIndicatorElement && chatMessagesLog) {
      chatMessagesLog.removeChild(typingIndicatorElement);
      typingIndicatorElement = null;
    }
  }

  function renderQuickChips(chipsList) {
    const existingChips = chatMessagesLog.querySelectorAll('.chat-chips-container');
    existingChips.forEach(c => c.remove());
 
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'chat-chips-container';
 
    chipsList.forEach(chip => {
      const btn = document.createElement('button');
      btn.className = 'chat-chip';
      btn.textContent = chip.label;
      btn.addEventListener('click', () => {
        appendChatMessage(chip.label, 'user');
        handleStateTransition(chip.action);
      });
      chipsContainer.appendChild(btn);
    });
 
    chatMessagesLog.appendChild(chipsContainer);
    scrollChatToBottom();
  }

  function calculateChatbotEstimate(panel, region, sampleSize, loi) {
    let baseCpi = 3.50;
    if (panel === 'b2b') baseCpi = 7.00;
    if (panel === 'healthcare') baseCpi = 15.00;
    if (panel === 'csuite') baseCpi = 25.00;

    let regionMultiplier = 1.0;
    if (region === 'na') regionMultiplier = 1.0;
    if (region === 'eu') regionMultiplier = 1.15;
    if (region === 'apac') regionMultiplier = 0.85;
    if (region === 'latam') regionMultiplier = 0.75;

    let loiMultiplier = 1.0;
    if (loi > 15) {
      loiMultiplier = 1.0 + (loi - 15) * 0.03;
    } else if (loi < 15) {
      loiMultiplier = 1.0 - (15 - loi) * 0.02;
    }

    let volumeDiscount = 1.0;
    if (sampleSize < 250) {
      volumeDiscount = 1.15;
    } else if (sampleSize >= 1000 && sampleSize < 2500) {
      volumeDiscount = 0.90;
    } else if (sampleSize >= 2500) {
      volumeDiscount = 0.80;
    }

    const cpi = baseCpi * regionMultiplier * loiMultiplier * volumeDiscount;
    const budget = cpi * sampleSize;

    let feasibilityScore = 100;
    if (panel === 'consumer') feasibilityScore = 95;
    else if (panel === 'b2b') feasibilityScore = 85;
    else if (panel === 'healthcare') feasibilityScore = 55;
    else if (panel === 'csuite') feasibilityScore = 40;

    if (regionMultiplier > 1.05) feasibilityScore -= 10;
    if (sampleSize > 1500) feasibilityScore -= 15;

    let feasibilityText = "High Feasibility";
    if (feasibilityScore < 45) feasibilityText = "Custom Feasibility";
    else if (feasibilityScore < 75) feasibilityText = "Moderate Feasibility";

    return {
      cpi: `$${cpi.toFixed(2)}`,
      budget: `$${budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      feasibility: feasibilityText,
      time: sampleSize > 1000 ? "4-6 Business Days" : "24-48 Hours"
    };
  }
 
  // Multi-turn State Transition Machine
  function handleStateTransition(actionKey) {
    showTypingIndicator();
    
    setTimeout(() => {
      hideTypingIndicator();
 
      switch (actionKey) {
        // --- BACK TO MAIN ---
        case 'go-main':
          chatState.step = 'main';
          chatState.panelType = null;
          chatState.region = null;
          chatState.sampleSize = null;
          chatState.loi = null;
          chatState.wfSolution = null;
          chatState.wfScale = null;
          chatState.wfIntegration = null;
          chatState.intScale = null;
          
          appendChatMessage("Sure, let's head back. What general area would you like to inquire about?");
          renderQuickChips([
            { label: "📊 CPI Estimate & Calculator", action: "cpi-start" },
            { label: "👥 Workflow Automation Hub", action: "wf-start" },
            { label: "🔒 ERP Systems Sync Audit", action: "int-start" },
            { label: "✉ Get Custom Quote & Demo", action: "go-quote" }
          ]);
          break;
 
        // --- CPI CALCULATOR TREE ---
        case 'cpi-start':
          chatState.step = 'cpi-panel';
          appendChatMessage("Our **Feasibility Engine** calculates sampling parameters. First, which panel audience are you looking to study?");
          renderQuickChips([
            { label: "🏢 B2B Professionals", action: "cpi-p-b2b" },
            { label: "🏥 Healthcare & HCPs", action: "cpi-p-healthcare" },
            { label: "🛍 Consumers", action: "cpi-p-consumer" },
            { label: "👑 C-Suite / Executives", action: "cpi-p-csuite" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        case 'cpi-p-b2b':
        case 'cpi-p-healthcare':
        case 'cpi-p-consumer':
        case 'cpi-p-csuite':
          chatState.panelType = actionKey.split('-p-')[1];
          chatState.step = 'cpi-region';
          appendChatMessage("Got it. Next, what is your target geographic region for the panel recruitment?");
          renderQuickChips([
            { label: "🇺🇸 North America", action: "cpi-r-na" },
            { label: "🇪🇺 Europe", action: "cpi-r-eu" },
            { label: "🌏 APAC", action: "cpi-r-apac" },
            { label: "🌍 LATAM & MEA", action: "cpi-r-latam" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        case 'cpi-r-na':
        case 'cpi-r-eu':
        case 'cpi-r-apac':
        case 'cpi-r-latam':
          chatState.region = actionKey.split('-r-')[1];
          chatState.step = 'cpi-sample';
          appendChatMessage("Understood. What is the target sample size (N) of completes you need?");
          renderQuickChips([
            { label: "100 Completes", action: "cpi-s-100" },
            { label: "300 Completes", action: "cpi-s-300" },
            { label: "500 Completes", action: "cpi-s-500" },
            { label: "1,000 Completes", action: "cpi-s-1000" },
            { label: "2,500 Completes", action: "cpi-s-2500" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        case 'cpi-s-100':
        case 'cpi-s-300':
        case 'cpi-s-500':
        case 'cpi-s-1000':
        case 'cpi-s-2500':
          chatState.sampleSize = parseInt(actionKey.split('-s-')[1]);
          chatState.step = 'cpi-loi';
          appendChatMessage("Final step: What is the Length of Interview (LOI) in minutes?");
          renderQuickChips([
            { label: "5 Minutes", action: "cpi-l-5" },
            { label: "10 Minutes", action: "cpi-l-10" },
            { label: "15 Minutes", action: "cpi-l-15" },
            { label: "20 Minutes", action: "cpi-l-20" },
            { label: "30 Minutes", action: "cpi-l-30" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        case 'cpi-l-5':
        case 'cpi-l-10':
        case 'cpi-l-15':
        case 'cpi-l-20':
        case 'cpi-l-30':
          chatState.loi = parseInt(actionKey.split('-l-')[1]);
          chatState.step = 'cpi-result';
          
          const est = calculateChatbotEstimate(chatState.panelType, chatState.region, chatState.sampleSize, chatState.loi);
          
          appendChatMessage("Calculating parameters... Here is your estimated feasibility report:");
          appendChatSummaryCard("📋 Calculated Study Proposal", [
            { label: "Target Panel", value: chatState.panelType.toUpperCase() },
            { label: "Region", value: chatState.region.toUpperCase() },
            { label: "Sample Size (N)", value: chatState.sampleSize.toLocaleString() },
            { label: "Interview LOI", value: `${chatState.loi} mins` },
            { label: "Estimated CPI", value: est.cpi, highlight: true },
            { label: "Est. Project Budget", value: est.budget, highlight: true },
            { label: "Feasibility Strength", value: est.feasibility },
            { label: "Est. Field Time", value: est.time }
          ]);
          
          appendChatMessage("Would you like to submit this estimate as an official quote request directly to **Info-team@researchcops.com**?");
          renderQuickChips([
            { label: "✉ Submit Estimate Request", action: "trigger-submit-flow" },
            { label: "🔄 Recalculate", action: "cpi-start" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        // --- WORKFLOW AUTOMATION TREE ---
        case 'wf-start':
          chatState.step = 'wf-solution';
          appendChatMessage("We design custom automated pipelines that link time-tracking, billing, CRM hubs, and ERPs. Which solution suite would you like to explore?");
          renderQuickChips([
            { label: "👥 HR & Onboarding (HRMS/Payroll)", action: "wf-s-hr" },
            { label: "💳 Financial Operations", action: "wf-s-finance" },
            { label: "📊 Executive Analytics", action: "wf-s-analytics" },
            { label: "🚀 Smart Coach Optimizer", action: "wf-s-coach" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        case 'wf-s-hr':
        case 'wf-s-finance':
        case 'wf-s-analytics':
        case 'wf-s-coach':
          let solName = "";
          if (actionKey === 'wf-s-hr') solName = "HRMS & Onboarding Automation Suite";
          if (actionKey === 'wf-s-finance') solName = "Financial Operations & Billing Reconciliations";
          if (actionKey === 'wf-s-analytics') solName = "Executive Analytics & Supply Chain Dashboards";
          if (actionKey === 'wf-s-coach') solName = "Smart Coach Employee Performance Optimizer";
          
          chatState.wfSolution = solName;
          chatState.step = 'wf-scale';
          appendChatMessage(`Understood. What is the scale of your target operation for the **${solName}**?`);
          renderQuickChips([
            { label: "Small Team (<100 employees)", action: "wf-sc-small" },
            { label: "Mid-Market (100-1000 employees)", action: "wf-sc-mid" },
            { label: "Large Enterprise (1000-4000 employees)", action: "wf-sc-large" },
            { label: "Global/BPO Scale (4000+ employees)", action: "wf-sc-bpo" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        case 'wf-sc-small':
        case 'wf-sc-mid':
        case 'wf-sc-large':
        case 'wf-sc-bpo':
          let scaleVal = "";
          if (actionKey === 'wf-sc-small') scaleVal = "Small Team (<100 employees)";
          if (actionKey === 'wf-sc-mid') scaleVal = "Mid-Market (100 - 1000 employees)";
          if (actionKey === 'wf-sc-large') scaleVal = "Large Enterprise (1,000+ employees)";
          if (actionKey === 'wf-sc-bpo') scaleVal = "BPO/CX Scale (4,000+ employees)";
 
          chatState.wfScale = scaleVal;
          chatState.step = 'wf-integration';
          appendChatMessage("Final question: Do you need to sync this workflow with a central enterprise ERP system database?");
          renderQuickChips([
            { label: "🔌 Standalone / Custom REST API", action: "wf-i-api" },
            { label: "💾 Enterprise ERP Sync (Parallel Sync)", action: "wf-i-erp" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        case 'wf-i-api':
        case 'wf-i-erp':
          const isErp = actionKey === 'wf-i-erp';
          chatState.wfIntegration = isErp ? "Enterprise ERP Database Sync" : "RESTful API Integration Sync";
          chatState.step = 'wf-result';
 
          let recText = "Direct secure webhook handlers, OAuth 2.0 validation, automated token refreshes.";
          if (isErp) {
            recText = "Parallel database syncing with zero operational downtime, custom field mappings, automated auditing.";
          }
 
          appendChatMessage("Analyzing parameters... Here is your custom automation structural proposal:");
          appendChatSummaryCard("📋 Custom Automation Proposal", [
            { label: "Solution Suite", value: chatState.wfSolution },
            { label: "Enterprise Scale", value: chatState.wfScale },
            { label: "ERP Integration", value: chatState.wfIntegration },
            { label: "Recommended Setup", value: recText },
            { label: "Feasibility Index", value: "100% Feasible (Managed deployment)" }
          ]);
 
          appendChatMessage("Would you like to submit this proposal as a demo request directly to **Info-team@researchcops.com**?");
          renderQuickChips([
            { label: "✉ Submit Demo Request", action: "trigger-submit-flow" },
            { label: "🔄 Start Over", action: "wf-start" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        // --- INTEGRATIONS / ERP AUDIT TREE ---
        case 'int-start':
          chatState.step = 'int-scale';
          appendChatMessage("We connect custom workflows directly with central ERP/HRMS databases. What is the scale of your target operation?");
          renderQuickChips([
            { label: "Small Team (<100 employees)", action: "int-sc-small" },
            { label: "Mid-Market (100-1000 employees)", action: "int-sc-mid" },
            { label: "Large Enterprise (1000-4000 employees)", action: "int-sc-large" },
            { label: "Global/BPO Scale (4000+ employees)", action: "int-sc-bpo" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        case 'int-sc-small':
        case 'int-sc-mid':
        case 'int-sc-large':
        case 'int-sc-bpo':
          let intScaleText = "";
          if (actionKey === 'int-sc-small') intScaleText = "Small Team (<100 employees)";
          if (actionKey === 'int-sc-mid') intScaleText = "Mid-Market (100 - 1000 employees)";
          if (actionKey === 'int-sc-large') intScaleText = "Large Enterprise (1,000+ employees)";
          if (actionKey === 'int-sc-bpo') intScaleText = "BPO/CX Scale (4,000+ employees)";
 
          chatState.intScale = intScaleText;
          chatState.step = 'int-result';
 
          appendChatMessage("Analyzing parameters... Here is your ERP integration feasibility report:");
          appendChatSummaryCard("📋 Enterprise ERP Sync Audit", [
            { label: "Target Sync Solution", value: "Enterprise ERP & Integrations Feasibility Audit" },
            { label: "Enterprise Scale", value: chatState.intScale },
            { label: "Implementation Strategy", value: "Parallel sync testing (zero downtime)" },
            { label: "Deployment Timeline", value: "Within 7 business days" }
          ]);
 
          appendChatMessage("Would you like to request an integration feasibility audit with our developers at **Info-team@researchcops.com**?");
          renderQuickChips([
            { label: "✉ Request ERP Sync Audit", action: "trigger-submit-flow" },
            { label: "🔄 Start Over", action: "int-start" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;
 
        // --- GET QUOTE/DEMO DIRECT ---
        case 'go-quote':
          chatState.step = 'quote-confirm';
          appendChatMessage("We would love to build a custom solution blueprint and sandbox demo for you! Would you like me to raise a general proposal request to **Info-team@researchcops.com**?");
          renderQuickChips([
            { label: "✉ Request Proposal", action: "trigger-submit-flow" },
            { label: "↩ Back to Main Menu", action: "go-main" }
          ]);
          break;

        case 'trigger-submit-flow':
          chatState.step = 'gather-name';
          appendChatMessage("Let's raise this request directly for you. First, could you please type your **Full Name**?");
          renderQuickChips([]);
          break;

        case 'skip-phone':
          chatState.userPhone = 'Not provided';
          submitChatInquiry();
          break;
      }
    }, 1000);
  }
 
  // Handle gathered user input details
  function handleNameInput(text) {
    chatState.userName = text;
    chatState.step = 'gather-email';
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      appendChatMessage(`Thank you, **${text}**. What is your **Work Email Address**?`);
    }, 800);
  }

  function handleEmailInput(text) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!text.match(emailPattern)) {
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        appendChatMessage("That email address looks invalid. Please enter a valid work email (e.g., name@company.com):");
      }, 800);
      return;
    }
    chatState.userEmail = text;
    chatState.step = 'gather-phone';
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      appendChatMessage("Got it. Lastly, what is your **Phone Number**? (Or type 'skip' if you prefer not to share)");
      renderQuickChips([
        { label: "⏭ Skip Phone Number", action: "skip-phone" }
      ]);
    }, 800);
  }

  function handlePhoneInput(text) {
    if (text.toLowerCase() === 'skip') {
      chatState.userPhone = 'Not provided';
    } else {
      chatState.userPhone = text;
    }
    submitChatInquiry();
  }

  function submitChatInquiry() {
    chatState.step = 'submitting';
    showTypingIndicator();
    
    setTimeout(() => {
      hideTypingIndicator();
      
      let summaryText = "";
      if (chatState.panelType) {
        const est = calculateChatbotEstimate(chatState.panelType, chatState.region, chatState.sampleSize, chatState.loi);
        summaryText = `
          <strong>Inquiry Details:</strong><br>
          - Type: Online Data Collection panels<br>
          - Panel: ${chatState.panelType.toUpperCase()}<br>
          - Region: ${chatState.region.toUpperCase()}<br>
          - N: ${chatState.sampleSize}<br>
          - LOI: ${chatState.loi} mins<br>
          - CPI: ${est.cpi}<br>
          - Budget: ${est.budget}
        `;
      } else if (chatState.wfSolution) {
        summaryText = `
          <strong>Inquiry Details:</strong><br>
          - Type: Workflow Automation Solution<br>
          - Solution: ${chatState.wfSolution}<br>
          - Scale: ${chatState.wfScale}<br>
          - Integration: ${chatState.wfIntegration}
        `;
      } else if (chatState.intScale) {
        summaryText = `
          <strong>Inquiry Details:</strong><br>
          - Type: ERP Database Sync Feasibility Audit<br>
          - Solution: Enterprise ERP & Integrations Feasibility Audit<br>
          - Scale: ${chatState.intScale}
        `;
      }
      
      appendChatMessage(`✔ **Inquiry Sent Successfully!**<br><br>
        Your inquiry details have been compiled and sent to our team at <a href="mailto:Info-team@researchcops.com">Info-team@researchcops.com</a>.<br><br>
        ${summaryText}<br><br>
        <strong>Contact Info:</strong><br>
        - Name: ${chatState.userName}<br>
        - Email: ${chatState.userEmail}<br>
        - Phone: ${chatState.userPhone}<br><br>
        Our team will contact you at **${chatState.userEmail}** within 2 hours.`);
      
      // Update form values on the page as well in case they scroll down to see it
      const formName = document.getElementById('name');
      const formEmail = document.getElementById('email');
      const formPhone = document.getElementById('phone');
      const formMessage = document.getElementById('message');
      
      if (formName) formName.value = chatState.userName;
      if (formEmail) formEmail.value = chatState.userEmail;
      if (formPhone && chatState.userPhone !== 'Not provided') formPhone.value = chatState.userPhone;
      
      if (chatState.panelType) {
        const est = calculateChatbotEstimate(chatState.panelType, chatState.region, chatState.sampleSize, chatState.loi);
        formCpi.value = est.cpi;
        formBudget.value = est.budget;
        adjustFormContext('calc');
      } else if (chatState.wfSolution) {
        adjustFormContext('automation', chatState.wfSolution, chatState.wfScale);
      }
      
      if (formMessage) {
        formMessage.value = `Submitted via chatbot SupportGenie:\n${summaryText.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')}`;
      }

      // Reset state variables
      chatState.panelType = null;
      chatState.region = null;
      chatState.sampleSize = null;
      chatState.loi = null;
      chatState.wfSolution = null;
      chatState.wfScale = null;
      chatState.wfIntegration = null;
      chatState.intScale = null;

      // Offer new session options
      renderQuickChips([
        { label: "🔄 Start New Session", action: "go-main" },
        { label: "↩ Back to Main Menu", action: "go-main" }
      ]);
      
    }, 1500);
  }
 
  // Bot response simulator for custom free text inputs (Sanitized)
  function triggerBotResponse(userQuery) {
    showTypingIndicator();
 
    setTimeout(() => {
      hideTypingIndicator();
      
      const queryCleaned = userQuery.toLowerCase().trim();
      let matchedAction = null;
 
      if (queryCleaned.includes('cpi') || queryCleaned.includes('price') || queryCleaned.includes('cost') || queryCleaned.includes('budget') || queryCleaned.includes('pricing') || queryCleaned.includes('calculator') || queryCleaned.includes('sample')) {
        matchedAction = 'cpi-start';
      } else if (queryCleaned.includes('automation') || queryCleaned.includes('workflow') || queryCleaned.includes('hrms') || queryCleaned.includes('payroll') || queryCleaned.includes('onboarding') || queryCleaned.includes('coach') || queryCleaned.includes('recruitment') || queryCleaned.includes('hiring')) {
        matchedAction = 'wf-start';
      } else if (queryCleaned.includes('integration') || queryCleaned.includes('api') || queryCleaned.includes('erp') || queryCleaned.includes('middleware') || queryCleaned.includes('database') || queryCleaned.includes('sync')) {
        matchedAction = 'int-start';
      } else if (queryCleaned.includes('quote') || queryCleaned.includes('demo') || queryCleaned.includes('contact') || queryCleaned.includes('proposal') || queryCleaned.includes('consulting')) {
        matchedAction = 'go-quote';
      }
 
      if (matchedAction) {
        handleStateTransition(matchedAction);
      } else {
        appendChatMessage("I want to make sure you get the exact answer! You can select one of the core categories below or type a query about **pricing**, **workflow automation (HRMS)**, or **database ERP integrations**.");
        renderQuickChips([
          { label: "📊 CPI Estimate & Calculator", action: "cpi-start" },
          { label: "👥 Workflow Automation Hub", action: "wf-start" },
          { label: "🔒 ERP Systems Sync Audit", action: "int-start" },
          { label: "✉ Get Custom Quote & Demo", action: "go-quote" }
        ]);
      }
    }, 1000);
  }
 
  const chips = document.querySelectorAll('.chat-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const chipKey = chip.getAttribute('data-chip');
      const chipText = chip.textContent;
      
      appendChatMessage(chipText, 'user');
      
      let targetAction = 'go-main';
      if (chipKey === 'pricing') targetAction = 'cpi-start';
      if (chipKey === 'workflow') targetAction = 'wf-start';
      if (chipKey === 'integrations') targetAction = 'int-start';
      if (chipKey === 'quote') targetAction = 'go-quote';
 
      handleStateTransition(targetAction);
    });
  });
 
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
 
      appendChatMessage(text, 'user');
      chatInput.value = '';
 
      // Route based on active data-gathering steps
      if (chatState.step === 'gather-name') {
        handleNameInput(text);
      } else if (chatState.step === 'gather-email') {
        handleEmailInput(text);
      } else if (chatState.step === 'gather-phone') {
        handlePhoneInput(text);
      } else {
        triggerBotResponse(text);
      }
    });
  }
 
});
