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

    // Adjust for country scarcity / niche markets (AU, CN, Middle East)
    if (country === 'au' || country === 'cn' || country === 'ae' || country === 'sa') {
      feasibilityScore -= 45;
    } else if (countryMultiplier > 1.05) {
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

    // Save lead to LocalStorage Database
    try {
      const lead = {
        id: 'lead_' + Date.now(),
        timestamp: Date.now(),
        date: new Date().toLocaleString(),
        name: name,
        email: email,
        company: company,
        phone: phone,
        cpi: formCpi ? formCpi.value : 'N/A',
        budget: formBudget ? formBudget.value : 'N/A',
        message: message,
        source: 'Website Form'
      };
      if (rcDbMode === "firebase" && rcDb) {
        rcDb.collection("leads").doc(lead.id).set(lead)
          .then(() => console.log("Form lead saved to Firestore:", lead.id))
          .catch(err => console.error("Firestore error saving form lead:", err));
      } else {
        const leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
        leads.unshift(lead);
        localStorage.setItem('rc_leads', JSON.stringify(leads));
      }
      console.log("Lead logged successfully:", lead);
    } catch (err) {
      console.error("Error saving lead:", err);
    }

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
  // 9. Support Genie Chatbot Core Logic (Multi-turn State Machine)
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
  
  let chatOnboarded = false;

  function triggerChatOnboarding() {
    if (chatOnboarded) return;
    chatOnboarded = true;

    // Clear the container
    chatMessagesLog.innerHTML = '';

    // Show typing
    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();
      appendChatMessage("Hello! I am <strong>Support Genie</strong>, your virtual assistant. How can I help you today?");
      
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        appendChatMessage("Select a quick topic below or type your question:");
        renderQuickChips([
          { label: "CPI Estimate & Calculator", icon: "cpi", action: "cpi-start" },
          { label: "Workflow Automation Hub", icon: "workflow", action: "wf-start" },
          { label: "ERP Systems Sync Audit", icon: "erp", action: "int-start" },
          { label: "Get Custom Quote & Demo", icon: "quote", action: "go-quote" }
        ]);
      }, 1200);
    }, 1000);
  }

  // Proactive Welcome Bubble
  const welcomeBubble = document.getElementById('genie-welcome-bubble');
  const welcomeClose = document.getElementById('welcome-bubble-close');

  if (welcomeBubble && welcomeClose) {
    // Show welcome bubble after 4 seconds
    setTimeout(() => {
      const hasClosed = sessionStorage.getItem('genie_welcome_closed') === 'true';
      const isChatActive = chatBox.classList.contains('active');
      if (!hasClosed && !isChatActive) {
        welcomeBubble.classList.add('active');
      }
    }, 4000);

    welcomeClose.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent opening chat
      welcomeBubble.classList.remove('active');
      sessionStorage.setItem('genie_welcome_closed', 'true');
    });

    // Clicking welcome bubble opens the chat
    welcomeBubble.addEventListener('click', (e) => {
      welcomeBubble.classList.remove('active');
      sessionStorage.setItem('genie_welcome_closed', 'true');
      chatBox.classList.add('active');
      if (chatTrigger) chatTrigger.classList.add('active');
      triggerChatOnboarding();
      scrollChatToBottom();
    });
  }

  if (chatTrigger && chatBox) {
    chatTrigger.addEventListener('click', () => {
      if (welcomeBubble) welcomeBubble.classList.remove('active');
      sessionStorage.setItem('genie_welcome_closed', 'true');
      
      const isOpening = !chatBox.classList.contains('active');
      chatBox.classList.toggle('active');
      chatTrigger.classList.toggle('active');
      scrollChatToBottom();

      if (isOpening) {
        triggerChatOnboarding();
      }
    });
  }
 
  if (chatClose && chatBox) {
    chatClose.addEventListener('click', () => {
      chatBox.classList.remove('active');
      if (chatTrigger) chatTrigger.classList.remove('active');
    });
  }
 
  function scrollChatToBottom() {
    if (chatMessagesLog) {
      chatMessagesLog.scrollTop = chatMessagesLog.scrollHeight;
    }
  }
 
  const chatbotIcons = {
    cpi: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
    workflow: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    erp: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    quote: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    back: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>`,
    b2b: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M12 6h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"></path></svg>`,
    healthcare: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path><path d="M9 22V12h6v10"></path><path d="M12 5V2m-2 0h4"></path><path d="M12 11v6m-3-3h6"></path></svg>`,
    consumer: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    csuite: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path></svg>`,
    globe: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    refresh: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    finance: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
    coach: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2l-7 20-4-9-9-4 20-7z"></path><line x1="22" y1="2" x2="11" y2="13"></line></svg>`,
    api: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 15v5a2 2 0 0 0 4 0v-5a3 3 0 0 1 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2V10z"></path><line x1="12" y1="2" x2="12" y2="4"></line></svg>`,
    db: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
    skip: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>`
  };

  const genieAvatarHtml = '<img src="support_genie_avatar.png" alt="Support Genie" class="genie-avatar-img">';

  function appendChatMessage(text, sender = 'bot') {
    if (!chatMessagesLog) return;
    
    const msgWrapper = document.createElement('div');
    msgWrapper.className = `chat-message-wrapper ${sender === 'user' ? 'user-wrapper' : 'bot-wrapper'}`;

    if (sender === 'bot') {
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'chat-message-avatar';
      avatarDiv.innerHTML = genieAvatarHtml;
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
    avatarDiv.innerHTML = genieAvatarHtml;
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
      
      const svgIcon = chatbotIcons[chip.icon] || '';
      btn.innerHTML = `${svgIcon}<span>${chip.label}</span>`;
      
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
            { label: "CPI Estimate & Calculator", icon: "cpi", action: "cpi-start" },
            { label: "Workflow Automation Hub", icon: "workflow", action: "wf-start" },
            { label: "ERP Systems Sync Audit", icon: "erp", action: "int-start" },
            { label: "Get Custom Quote & Demo", icon: "quote", action: "go-quote" }
          ]);
          break;
 
        // --- CPI CALCULATOR TREE ---
        case 'cpi-start':
          chatState.step = 'cpi-panel';
          appendChatMessage("Our **Feasibility Engine** calculates sampling parameters. First, which panel audience are you looking to study?");
          renderQuickChips([
            { label: "B2B Professionals", icon: "b2b", action: "cpi-p-b2b" },
            { label: "Healthcare & HCPs", icon: "healthcare", action: "cpi-p-healthcare" },
            { label: "Consumers", icon: "consumer", action: "cpi-p-consumer" },
            { label: "C-Suite / Executives", icon: "csuite", action: "cpi-p-csuite" },
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
            { label: "North America", icon: "globe", action: "cpi-r-na" },
            { label: "Europe", icon: "globe", action: "cpi-r-eu" },
            { label: "APAC", icon: "globe", action: "cpi-r-apac" },
            { label: "LATAM & MEA", icon: "globe", action: "cpi-r-latam" },
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
            { label: "Submit Estimate Request", icon: "quote", action: "trigger-submit-flow" },
            { label: "Recalculate", icon: "refresh", action: "cpi-start" },
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
          ]);
          break;
 
        // --- WORKFLOW AUTOMATION TREE ---
        case 'wf-start':
          chatState.step = 'wf-solution';
          appendChatMessage("We design custom automated pipelines that link time-tracking, billing, CRM hubs, and ERPs. Which solution suite would you like to explore?");
          renderQuickChips([
            { label: "HR & Onboarding (HRMS/Payroll)", icon: "workflow", action: "wf-s-hr" },
            { label: "Financial Operations", icon: "finance", action: "wf-s-finance" },
            { label: "Executive Analytics", icon: "cpi", action: "wf-s-analytics" },
            { label: "Smart Coach Optimizer", icon: "coach", action: "wf-s-coach" },
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
            { label: "Standalone / Custom REST API", icon: "api", action: "wf-i-api" },
            { label: "Enterprise ERP Sync (Parallel Sync)", icon: "db", action: "wf-i-erp" },
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
            { label: "Submit Demo Request", icon: "quote", action: "trigger-submit-flow" },
            { label: "Start Over", icon: "refresh", action: "wf-start" },
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
            { label: "Request ERP Sync Audit", icon: "quote", action: "trigger-submit-flow" },
            { label: "Start Over", icon: "refresh", action: "int-start" },
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
          ]);
          break;
 
        // --- GET QUOTE/DEMO DIRECT ---
        case 'go-quote':
          chatState.step = 'quote-confirm';
          appendChatMessage("We would love to build a custom solution blueprint and sandbox demo for you! Would you like me to raise a general proposal request to **Info-team@researchcops.com**?");
          renderQuickChips([
            { label: "Request Proposal", icon: "quote", action: "trigger-submit-flow" },
            { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
        { label: "Skip Phone Number", icon: "skip", action: "skip-phone" }
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
        formMessage.value = `Submitted via chatbot Support Genie:\n${summaryText.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')}`;
      }

      // Save chatbot lead to LocalStorage Database
      try {
        let inquiryDetailsText = "";
        let leadCpi = 'N/A';
        let leadBudget = 'N/A';
        if (chatState.panelType) {
          const est = calculateChatbotEstimate(chatState.panelType, chatState.region, chatState.sampleSize, chatState.loi);
          leadCpi = est.cpi;
          leadBudget = est.budget;
          inquiryDetailsText = `Panel: ${chatState.panelType.toUpperCase()}, Region: ${chatState.region.toUpperCase()}, N: ${chatState.sampleSize}, LOI: ${chatState.loi} mins`;
        } else if (chatState.wfSolution) {
          inquiryDetailsText = `Workflow Solution: ${chatState.wfSolution}, Scale: ${chatState.wfScale}, Integration: ${chatState.wfIntegration}`;
        } else if (chatState.intScale) {
          inquiryDetailsText = `ERP Database Sync Feasibility Audit, Scale: ${chatState.intScale}`;
        }

        const lead = {
          id: 'lead_' + Date.now(),
          timestamp: Date.now(),
          date: new Date().toLocaleString(),
          name: chatState.userName,
          email: chatState.userEmail,
          company: 'Chatbot User',
          phone: chatState.userPhone,
          cpi: leadCpi,
          budget: leadBudget,
          message: inquiryDetailsText,
          source: 'Support Genie Chatbot'
        };
        if (rcDbMode === "firebase" && rcDb) {
          rcDb.collection("leads").doc(lead.id).set(lead)
            .then(() => console.log("Chat lead saved to Firestore:", lead.id))
            .catch(err => console.error("Firestore error saving chat lead:", err));
        } else {
          const leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
          leads.unshift(lead);
          localStorage.setItem('rc_leads', JSON.stringify(leads));
        }
        console.log("Chat lead logged successfully:", lead);
      } catch (err) {
        console.error("Error saving chat lead:", err);
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
        { label: "Start New Session", icon: "refresh", action: "go-main" },
        { label: "Back to Main Menu", icon: "back", action: "go-main" }
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
          { label: "CPI Estimate & Calculator", icon: "cpi", action: "cpi-start" },
          { label: "Workflow Automation Hub", icon: "workflow", action: "wf-start" },
          { label: "ERP Systems Sync Audit", icon: "erp", action: "int-start" },
          { label: "Get Custom Quote & Demo", icon: "quote", action: "go-quote" }
        ]);
      }
    }, 1000);
  }
 
  const chips = document.querySelectorAll('.chat-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const chipKey = chip.getAttribute('data-chip');
      const spanEl = chip.querySelector('span');
      const chipText = spanEl ? spanEl.textContent.trim() : chip.textContent.trim();
      
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

  // ----------------------------------------------------
  // 12. Dynamic Content & Interactive Poll Integration
  // ----------------------------------------------------
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

  // Initial mock database arrays for seeding
  const RC_DEFAULT_BLOGS = [
    {
      id: "blog-1",
      title: "Agentic AI Orchestration: The Central Control Plane of 2026 Enterprise Workflows",
      category: "Tech",
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
      category: "Tech",
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
      category: "Business",
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
      category: "Tech",
      readtime: "6 min read",
      excerpt: "How self-optimizing pipelines audit database queries, detect database latency spikes, and optimize queries automatically.",
      content: "Manual database query indexing is slow and fails to scale with dynamic SaaS environments. Modern enterprise middleware incorporates self-optimizing pipelines that monitor queries in real-time. By applying AI-assisted index tuning, the system automatically detects slow query execution times across custom ERP syncs, modifying indexing strategies and improving database retrieval rates by up to 3.5x without human developer intervention.",
      date: "June 2026",
      featured: true,
      timestamp: Date.now(),
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600"
    }
  ];

  const RC_DEFAULT_NEWS = [
    {
      id: "news-1",
      title: "Automated Ledger Reconciliation Engine v2.1 Released",
      category: "Finance",
      details: "Deployment of cross-register ledger matching engine reduces reconciliation cycles from days to under 15 minutes.",
      date: "June 2026",
      timestamp: Date.now(),
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600"
    },
    {
      id: "news-2",
      title: "Custom ERP Sync Connector Upgraded to REST OAuth 2.0",
      category: "Tech",
      details: "Integration of automated token refresh sequences and role-based data views for secure database mapping.",
      date: "May 2026",
      timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600"
    },
    {
      id: "news-3",
      title: "HRMS Onboarding Workflows Speed Up",
      category: "Business",
      details: "Optimized automated script mappings reduce new hire document routing times by 80% globally.",
      date: "April 2026",
      timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600"
    },
    {
      id: "news-4",
      title: "Distributed Ledger Reconciliation Hub Implemented",
      category: "Finance",
      details: "A new distributed validation protocol achieves high-performance ledger sync with sub-millisecond latencies across global clusters.",
      date: "June 2026",
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=600"
    },
    {
      id: "news-5",
      title: "AI-Assisted Database Query Index Tuning System Live",
      category: "Tech",
      details: "AI-assisted index optimization automatically detects slow queries in ERP database middlewares, improving retrieval rates by 3.5x.",
      date: "May 2026",
      timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600"
    },
    {
      id: "news-6",
      title: "Zero-Knowledge Encryption Enforced for HRMS Personnel Records",
      category: "Global",
      details: "Upgrade enforces zero-knowledge architecture and TLS 1.3 data transfer protocols for all integrated employee profiles.",
      date: "April 2026",
      timestamp: Date.now() - 50 * 24 * 60 * 60 * 1000,
      image: "https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=600"
    }
  ];

  const RC_DEFAULT_POLLS = [
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

  // Helper function to escape HTML output
  function rcEscapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Connect database
  const rcIsFirebaseConfigured = () => {
    return rcFirebaseConfig && 
           rcFirebaseConfig.apiKey && 
           !rcFirebaseConfig.apiKey.startsWith("YOUR_") && 
           rcFirebaseConfig.apiKey !== "";
  };

  if (rcIsFirebaseConfigured() && typeof firebase !== "undefined") {
    try {
      firebase.initializeApp(rcFirebaseConfig);
      rcDb = firebase.firestore();
      rcDbMode = "firebase";
      console.log("App: Dynamic database mode -> LIVE Firebase");
    } catch (e) {
      console.error("App: Firebase failed, falling back to LocalStorage:", e);
      setupAppLocalFallback();
    }
  } else {
    setupAppLocalFallback();
  }

  function setupAppLocalFallback() {
    rcDbMode = "local";
    console.log("App: Dynamic database mode -> LocalStorage Fallback");
    
    // Migration check: Clear old market research content or legacy poll formats to allow fresh seeding
    const legacyCheck = localStorage.getItem("rc_blogs");
    const hasOldPollVal = localStorage.getItem("rc_poll");
    if (hasOldPollVal || (legacyCheck && (
      !legacyCheck.includes("image") ||
      legacyCheck.includes("concept-testing") || 
      legacyCheck.includes("bot-intrusion") || 
      legacyCheck.includes("panelist") || 
      legacyCheck.includes("OpinionGenie") ||
      legacyCheck.includes("Panel") || 
      legacyCheck.includes("Survey") ||
      legacyCheck.includes("Opinion Genie")
    ))) {
      console.log("Legacy data or single-poll detected. Clearing database keys to transition to multi-poll system.");
      localStorage.removeItem("rc_blogs");
      localStorage.removeItem("rc_news");
      localStorage.removeItem("rc_poll");
      localStorage.removeItem("rc_polls");
      localStorage.removeItem("rc_user_voted");
    }

    if (!localStorage.getItem("rc_blogs")) {
      localStorage.setItem("rc_blogs", JSON.stringify(RC_DEFAULT_BLOGS));
    }
    if (!localStorage.getItem("rc_news")) {
      localStorage.setItem("rc_news", JSON.stringify(RC_DEFAULT_NEWS));
    }
    if (!localStorage.getItem("rc_polls")) {
      localStorage.setItem("rc_polls", JSON.stringify(RC_DEFAULT_POLLS));
    }
  }

  // Load and Render Dynamic Contents
  function loadAndRenderDynamicContent() {
    renderFeaturedBlog();
    renderNewsAlerts();
    renderBlogsGridList();
    renderActivePollWidget();
    loadFooterSettings();
  }

  function loadFooterSettings() {
    const footerDesc = document.getElementById("footer-desc");
    const footerPhone = document.getElementById("footer-phone");
    const footerEmails = document.getElementById("footer-emails");
    const footerAddress = document.getElementById("footer-address");

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
        if (data.emailInfo) emailsHtml += `<a href="mailto:${rcEscapeHtml(data.emailInfo)}">${rcEscapeHtml(data.emailInfo)}</a><br>`;
        if (data.emailBidding) emailsHtml += `<a href="mailto:${rcEscapeHtml(data.emailBidding)}">${rcEscapeHtml(data.emailBidding)}</a>`;
        footerEmails.innerHTML = emailsHtml;
      }
      if (footerAddress && data.address) {
        footerAddress.innerHTML = rcEscapeHtml(data.address).replace(/\n/g, "<br>");
      }
    }
  }

  // 12a. Render Featured Blog Post
  function renderFeaturedBlog() {
    const featuredContainer = document.getElementById("dynamic-featured-article");
    if (!featuredContainer) return;

    if (rcDbMode === "firebase") {
      rcDb.collection("blogs").where("featured", "==", true).limit(1).get()
        .then(snapshot => {
          if (!snapshot.empty) {
            const blog = snapshot.docs[0].data();
            injectFeaturedHtml(featuredContainer, blog);
          } else {
            // Get latest overall as fallback
            rcDb.collection("blogs").orderBy("timestamp", "desc").limit(1).get()
              .then(snap => {
                if (!snap.empty) {
                  injectFeaturedHtml(featuredContainer, snap.docs[0].data());
                } else {
                  injectFeaturedHtml(featuredContainer, RC_DEFAULT_BLOGS[3]); // Fallback
                }
              });
          }
        })
        .catch(err => {
          console.error("Error reading featured blog:", err);
          injectFeaturedHtml(featuredContainer, RC_DEFAULT_BLOGS[3]);
        });
    } else {
      const blogs = JSON.parse(localStorage.getItem("rc_blogs") || "[]");
      const featured = blogs.find(b => b.featured) || blogs[0] || RC_DEFAULT_BLOGS[3];
      injectFeaturedHtml(featuredContainer, featured);
    }
  }

  function injectFeaturedHtml(container, article) {
    container.innerHTML = `
      <div class="featured-image-placeholder">
        <svg viewBox="0 0 100 50" class="featured-svg">
          <defs>
            <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#04cbc2" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#04524e" stop-opacity="0.05" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#glow-grad)" rx="4"/>
          <circle cx="50" cy="25" r="15" fill="none" stroke="#04cbc2" stroke-width="0.5" stroke-dasharray="1 1"/>
          <circle cx="50" cy="25" r="10" fill="none" stroke="#04cbc2" stroke-width="0.3"/>
          <path d="M20 25 L80 25" stroke="rgba(4, 203, 194, 0.15)" stroke-width="0.2"/>
          <path d="M50 5 L50 45" stroke="rgba(4, 203, 194, 0.15)" stroke-width="0.2"/>
        </svg>
        <div class="feat-badge">${rcEscapeHtml(article.category)}</div>
      </div>
      <div class="featured-content">
        <h3>${rcEscapeHtml(article.title)}</h3>
        <p>${rcEscapeHtml(article.excerpt)}</p>
        <div class="feat-meta">
          <span class="feat-date">${rcEscapeHtml(article.date)}</span>
          <span class="feat-read">${rcEscapeHtml(article.readtime)}</span>
          <a href="insights.html?type=blog&id=${article.id || 'blog-featured'}" class="feat-link">Read Full Report <span class="arrow-right">&rarr;</span></a>
        </div>
      </div>
    `;
  }

  // 12b. Render Tech & Security News Alerts
  function renderNewsAlerts() {
    const newsContainer = document.getElementById("dynamic-news-list");
    if (!newsContainer) return;

    if (rcDbMode === "firebase") {
      rcDb.collection("news").orderBy("timestamp", "desc").limit(3).get()
        .then(snapshot => {
          newsContainer.innerHTML = "";
          if (!snapshot.empty) {
            snapshot.forEach(doc => {
              appendNewsItem(newsContainer, doc.data());
            });
          } else {
            RC_DEFAULT_NEWS.forEach(item => appendNewsItem(newsContainer, item));
          }
        })
        .catch(err => {
          console.error("Error loading news alerts:", err);
          newsContainer.innerHTML = "";
          RC_DEFAULT_NEWS.forEach(item => appendNewsItem(newsContainer, item));
        });
    } else {
      const news = JSON.parse(localStorage.getItem("rc_news") || "[]");
      news.sort((a, b) => b.timestamp - a.timestamp);
      newsContainer.innerHTML = "";
      const limitNews = news.slice(0, 3);
      if (limitNews.length > 0) {
        limitNews.forEach(item => appendNewsItem(newsContainer, item));
      } else {
        RC_DEFAULT_NEWS.forEach(item => appendNewsItem(newsContainer, item));
      }
    }
  }

  function appendNewsItem(container, item) {
    const div = document.createElement("div");
    div.className = "update-item";
    div.innerHTML = `
      <div class="update-meta">
        <span class="update-badge badge-teal">${rcEscapeHtml(item.category)}</span>
        <span class="update-date">${rcEscapeHtml(item.date)}</span>
      </div>
      <h4><a href="insights.html?type=news&id=${item.id || 'news-1'}" style="color: inherit; text-decoration: none;">${rcEscapeHtml(item.title)}</a></h4>
      <p>${rcEscapeHtml(item.details)}</p>
    `;
    container.appendChild(div);
  }

  // 12c. Render Recent Blogs Grid
  function renderBlogsGridList() {
    const blogsGrid = document.getElementById("dynamic-blogs-grid");
    if (!blogsGrid) return;

    if (rcDbMode === "firebase") {
      rcDb.collection("blogs").orderBy("timestamp", "desc").get()
        .then(snapshot => {
          blogsGrid.innerHTML = "";
          let count = 0;
          snapshot.forEach(doc => {
            const blog = doc.data();
            // Skip featured blog from grid to avoid duplicate listing
            if (!blog.featured) {
              appendBlogCard(blogsGrid, blog);
              count++;
            }
          });
          if (count === 0) {
            // Render something if all are featured or no blogs
            RC_DEFAULT_BLOGS.forEach(b => {
              if (!b.featured) appendBlogCard(blogsGrid, b);
            });
          }
        })
        .catch(err => {
          console.error("Error loading blogs grid:", err);
          blogsGrid.innerHTML = "";
          RC_DEFAULT_BLOGS.forEach(b => {
            if (!b.featured) appendBlogCard(blogsGrid, b);
          });
        });
    } else {
      const blogs = JSON.parse(localStorage.getItem("rc_blogs") || "[]");
      blogs.sort((a, b) => b.timestamp - a.timestamp);
      blogsGrid.innerHTML = "";
      const nonFeatured = blogs.filter(b => !b.featured);
      if (nonFeatured.length > 0) {
        nonFeatured.forEach(blog => appendBlogCard(blogsGrid, blog));
      } else {
        RC_DEFAULT_BLOGS.forEach(b => {
          if (!b.featured) appendBlogCard(blogsGrid, b);
        });
      }
    }
  }

  function appendBlogCard(container, blog) {
    const div = document.createElement("div");
    div.className = "blog-card glass-card";
    div.innerHTML = `
      <div class="blog-cat">${rcEscapeHtml(blog.category)}</div>
      <h4>${rcEscapeHtml(blog.title)}</h4>
      <p>${rcEscapeHtml(blog.excerpt)}</p>
      <div class="blog-meta">
        <span>${rcEscapeHtml(blog.date)}</span>
        <a href="insights.html?type=blog&id=${blog.id}" class="blog-link">Read Article</a>
      </div>
    `;
    container.appendChild(div);
  }

  // 12d. Interactive Poll Widget Handler
  function populatePollSelector(polls, activeSelectEl) {
    if (!activeSelectEl) return;
    const currentVal = activeSelectEl.value;
    activeSelectEl.innerHTML = "";
    polls.forEach(poll => {
      const opt = document.createElement("option");
      opt.value = poll.id;
      opt.textContent = poll.question.length > 50 ? poll.question.slice(0, 47) + "..." : poll.question;
      activeSelectEl.appendChild(opt);
    });
    if (currentVal && polls.some(p => p.id === currentVal)) {
      activeSelectEl.value = currentVal;
    } else if (polls.length > 0) {
      activeSelectEl.value = polls[0].id;
    }
  }

  function renderActivePollWidget() {
    const pollCard = document.querySelector(".poll-card");
    const pollForm = document.getElementById("poll-widget-form");
    const votedMsg = document.getElementById("poll-widget-voted-msg");
    const pollQuestionEl = document.getElementById("poll-widget-question");
    const activeSelect = document.getElementById("poll-active-select");

    if (!pollCard || !pollForm) return;

    if (rcDbMode === "firebase") {
      rcDb.collection("polls").get()
        .then(snapshot => {
          let polls = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            polls.push(data);
          });
          if (polls.length === 0) {
            polls = RC_DEFAULT_POLLS;
          }
          if (activeSelect && activeSelect.children.length !== polls.length) {
            populatePollSelector(polls, activeSelect);
            activeSelect.onchange = () => {
              renderActivePollWidget();
            };
          }
          const selectedId = activeSelect ? activeSelect.value : (polls[0] ? polls[0].id : "poll-1");
          const selectedPoll = polls.find(p => p.id === selectedId) || polls[0] || RC_DEFAULT_POLLS[0];
          setupPollUI(selectedPoll, pollCard, pollForm, votedMsg, pollQuestionEl);
        })
        .catch(err => {
          console.error("Error loading active polls:", err);
          fallbackLocalPolls(activeSelect, pollCard, pollForm, votedMsg, pollQuestionEl);
        });
    } else {
      fallbackLocalPolls(activeSelect, pollCard, pollForm, votedMsg, pollQuestionEl);
    }
  }

  function fallbackLocalPolls(activeSelect, pollCard, pollForm, votedMsg, pollQuestionEl) {
    const polls = JSON.parse(localStorage.getItem("rc_polls")) || RC_DEFAULT_POLLS;
    if (activeSelect && activeSelect.children.length !== polls.length) {
      populatePollSelector(polls, activeSelect);
      activeSelect.onchange = () => {
        renderActivePollWidget();
      };
    }
    const selectedId = activeSelect ? activeSelect.value : (polls[0] ? polls[0].id : "poll-1");
    const selectedPoll = polls.find(p => p.id === selectedId) || polls[0] || RC_DEFAULT_POLLS[0];
    setupPollUI(selectedPoll, pollCard, pollForm, votedMsg, pollQuestionEl);
  }

  function setupPollUI(poll, pollCard, pollForm, votedMsg, pollQuestionEl) {
    if (pollQuestionEl) pollQuestionEl.textContent = poll.question;

    document.getElementById("poll-widget-lbl-a").textContent = poll.options.a.text;
    document.getElementById("poll-widget-lbl-b").textContent = poll.options.b.text;
    document.getElementById("poll-widget-lbl-c").textContent = poll.options.c.text;
    document.getElementById("poll-widget-lbl-d").textContent = poll.options.d.text;

    const userVoted = localStorage.getItem("rc_voted_" + poll.id) === "true";

    const aVotes = poll.options.a.votes || 0;
    const bVotes = poll.options.b.votes || 0;
    const cVotes = poll.options.c.votes || 0;
    const dVotes = poll.options.d.votes || 0;
    const total = aVotes + bVotes + cVotes + dVotes;

    const pct = (votes) => total > 0 ? Math.round((votes / total) * 100) : 0;

    document.getElementById("poll-widget-total-votes").textContent = `Total Votes: ${total}`;

    const submitBtn = document.getElementById("poll-widget-submit");

    pollForm.querySelectorAll('input[name="poll-vote"]').forEach(input => {
      input.checked = false;
    });

    if (userVoted) {
      pollCard.classList.add("voted");
      if (submitBtn) submitBtn.style.display = "none";
      pollForm.querySelectorAll('input[name="poll-vote"]').forEach(input => input.disabled = true);
      votedMsg.style.display = "block";
      showOptionPercentages(pct(aVotes), pct(bVotes), pct(cVotes), pct(dVotes));
    } else {
      pollCard.classList.remove("voted");
      if (submitBtn) submitBtn.style.display = "block";
      pollForm.querySelectorAll('input[name="poll-vote"]').forEach(input => input.disabled = false);
      votedMsg.style.display = "none";
      resetOptionPercentages();

      pollForm.onsubmit = (e) => {
        e.preventDefault();
        const selectedOpt = pollForm.querySelector('input[name="poll-vote"]:checked');
        if (!selectedOpt) return;

        const val = selectedOpt.value;

        if (rcDbMode === "firebase") {
          rcDb.collection("polls").doc(poll.id).update({
            [`options.${val}.votes`]: firebase.firestore.FieldValue.increment(1)
          })
          .then(() => {
            localStorage.setItem("rc_voted_" + poll.id, "true");
            renderActivePollWidget();
          })
          .catch(err => {
            alert("Voting error: " + err.message);
          });
        } else {
          const localPolls = JSON.parse(localStorage.getItem("rc_polls")) || RC_DEFAULT_POLLS;
          const pollIndex = localPolls.findIndex(p => p.id === poll.id);
          if (pollIndex !== -1) {
            localPolls[pollIndex].options[val].votes = (localPolls[pollIndex].options[val].votes || 0) + 1;
            localStorage.setItem("rc_polls", JSON.stringify(localPolls));
          }
          localStorage.setItem("rc_voted_" + poll.id, "true");
          renderActivePollWidget();
        }
      };
    }
  }

  function resetOptionPercentages() {
    const keys = ["a", "b", "c", "d"];
    keys.forEach(key => {
      const pctEl = document.getElementById(`poll-widget-pct-${key}`);
      const barEl = document.getElementById(`poll-widget-bar-${key}`);
      const labelEl = pctEl ? pctEl.closest(".poll-option-label") : null;
      if (pctEl) pctEl.textContent = "";
      if (barEl) barEl.style.width = "0%";
      if (labelEl) {
        labelEl.style.cursor = "pointer";
        labelEl.style.background = "";
      }
    });
  }

  function showOptionPercentages(aPct, bPct, cPct, dPct) {
    const pcts = [aPct, bPct, cPct, dPct];
    const keys = ["a", "b", "c", "d"];
    keys.forEach((key, idx) => {
      const pctEl = document.getElementById(`poll-widget-pct-${key}`);
      const barEl = document.getElementById(`poll-widget-bar-${key}`);
      const labelEl = pctEl.closest(".poll-option-label");
      if (pctEl) pctEl.textContent = `${pcts[idx]}%`;
      setTimeout(() => {
        if (barEl) barEl.style.width = `${pcts[idx]}%`;
      }, 100);
      if (labelEl) {
        labelEl.style.cursor = "default";
        labelEl.style.background = "rgba(255, 255, 255, 0.015)";
      }
    });
  }

  // Run dynamic loads
  loadAndRenderDynamicContent();

  // ----------------------------------------------------
  // Demographic Country Profiler Sync
  // ----------------------------------------------------
  const demoCountrySelect = document.getElementById('demographic-country-select');
  if (demoCountrySelect) {
    const countryData = {
      us: { feasibility: 95, label: "95% (High)", verticals: "B2B Tech, Healthcare HCPs, Finance, Shoppers", age: "52%", gender: "51% / 48%" },
      uk: { feasibility: 92, label: "92% (High)", verticals: "Financial Services, Tech, Retail, Beverage Drinkers", age: "48%", gender: "52% / 47%" },
      de: { feasibility: 88, label: "88% (High)", verticals: "Automotive, Engineering, IT Decisions, Tobacco Consumers", age: "45%", gender: "50% / 49%" },
      fr: { feasibility: 86, label: "86% (High)", verticals: "Luxury Goods, Automotive, Media, Wine Drinkers", age: "46%", gender: "53% / 46%" },
      ca: { feasibility: 93, label: "93% (High)", verticals: "Natural Resources, Tech, Banking, Shoppers", age: "50%", gender: "51% / 48%" },
      au: { feasibility: 32, label: "32% (Low)", verticals: "Services, Healthcare, Tech, Retail Shoppers", age: "49%", gender: "52% / 47%" },
      in: { feasibility: 94, label: "94% (High)", verticals: "Software Development, IT Decisions, Mobile Profiles, Tech Adopters", age: "68%", gender: "45% / 54%" },
      sg: { feasibility: 82, label: "82% (Medium-High)", verticals: "Wealth Management, Tech, Shipping, B2B Influencers", age: "55%", gender: "49% / 50%" },
      jp: { feasibility: 87, label: "87% (High)", verticals: "Electronics, Manufacturing, Automotive, Gamers", age: "38%", gender: "48% / 51%" },
      br: { feasibility: 90, label: "90% (High)", verticals: "Agriculture, Finance, Mobile Gamers, Shoppers", age: "60%", gender: "53% / 46%" },
      cn: { feasibility: 25, label: "25% (Low)", verticals: "Manufacturing, Tech, Retail, Mobile Consumers", age: "48%", gender: "49% / 51%" },
      es: { feasibility: 84, label: "84% (Medium-High)", verticals: "Tourism, Retail, Renewable Energy, Lifestyle", age: "44%", gender: "51% / 48%" },
      it: { feasibility: 83, label: "83% (Medium-High)", verticals: "Manufacturing, Luxury, Retail, Wine Collectors", age: "42%", gender: "50% / 49%" },
      ae: { feasibility: 34, label: "34% (Low)", verticals: "Real Estate, Finance, Tech, B2B Decision Makers", age: "58%", gender: "40% / 59%" },
      sa: { feasibility: 28, label: "28% (Low)", verticals: "Energy, Construction, Public Sector, Mobile Consumers", age: "62%", gender: "42% / 57%" },
      za: { feasibility: 80, label: "80% (Medium-High)", verticals: "Mining, Banking, Telecommunications, Retail Shoppers", age: "57%", gender: "52% / 47%" },
      mx: { feasibility: 86, label: "86% (High)", verticals: "Manufacturing, Auto, Tech, Shoppers", age: "61%", gender: "52% / 47%" },
      kr: { feasibility: 85, label: "85% (High)", verticals: "Consumer Tech, Semiconductor, Auto, Gamers", age: "47%", gender: "49% / 50%" }
    };

    const dFeasPct = document.getElementById('demo-country-feasibility-pct');
    const dFeasBar = document.getElementById('demo-country-feasibility-bar');
    const dVerts = document.getElementById('demo-country-verticals');
    const dAge = document.getElementById('demo-country-age');
    const dGender = document.getElementById('demo-country-gender');

    const updateDemoCountry = () => {
      const val = demoCountrySelect.value;
      const d = countryData[val];
      if (!d) return;

      dFeasPct.textContent = d.label;
      dFeasBar.style.width = `${d.feasibility}%`;
      dVerts.textContent = d.verticals;
      dAge.textContent = d.age;
      dGender.textContent = d.gender;

      dFeasPct.className = '';
      dFeasBar.className = 'bar-fill';
      if (d.feasibility >= 85) {
        dFeasPct.classList.add('text-emerald');
        dFeasBar.classList.add('bg-emerald');
      } else if (d.feasibility >= 45) {
        dFeasPct.classList.add('text-yellow');
        dFeasBar.classList.add('bg-yellow');
      } else {
        dFeasPct.classList.add('text-red');
        dFeasBar.classList.add('bg-red');
      }
    };

    demoCountrySelect.addEventListener('change', updateDemoCountry);
  }

  // ----------------------------------------------------
  // Demographics Profiling Toggle (B2B/B2C)
  // ----------------------------------------------------
  const btnB2b = document.getElementById('prof-btn-b2b');
  const btnB2c = document.getElementById('prof-btn-b2c');
  const gridB2b = document.getElementById('verticals-b2b');
  const gridB2c = document.getElementById('verticals-b2c');

  if (btnB2b && btnB2c && gridB2b && gridB2c) {
    btnB2b.addEventListener('click', () => {
      btnB2b.style.background = 'rgba(4,203,194,0.1)';
      btnB2b.style.borderColor = 'var(--turquoise-accent)';
      btnB2b.style.color = '#ffffff';

      btnB2c.style.background = 'rgba(255,255,255,0.02)';
      btnB2c.style.borderColor = 'rgba(255,255,255,0.08)';
      btnB2c.style.color = 'var(--text-muted)';

      gridB2b.style.display = 'grid';
      gridB2c.style.display = 'none';
    });

    btnB2c.addEventListener('click', () => {
      btnB2c.style.background = 'rgba(4,203,194,0.1)';
      btnB2c.style.borderColor = 'var(--turquoise-accent)';
      btnB2c.style.color = '#ffffff';

      btnB2b.style.color = 'var(--text-muted)';

      gridB2c.style.display = 'grid';
      gridB2b.style.display = 'none';
    });
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

  // ----------------------------------------------------
  // Hero 3D Parallax Tilt Effect
  // ----------------------------------------------------
  const heroSection = document.getElementById('hero');
  const heroVisual = document.querySelector('.visual-card-wrapper');
  if (heroSection && heroVisual) {
    heroSection.addEventListener('mousemove', e => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      
      const rotateX = -(y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      
      heroVisual.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      heroVisual.style.transition = 'transform 0.1s ease-out';
    });
    
    heroSection.addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      heroVisual.style.transition = 'transform 0.6s ease';
    });
  }

});
