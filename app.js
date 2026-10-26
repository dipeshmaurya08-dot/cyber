/**
 * CyberShield Main Application Controller
 * Handles Navigation, Survey Flow, Results, Certificate Generation & Theme
 */

let currentSurveyIndex = 0;
let userSurveyAnswers = {};
let currentStudentResult = null;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initSurvey();
  initPasswordEvents();
  initPhishingGameEvents();
  initTabs();

  // Load analytics dashboard
  if (typeof updateAnalyticsDashboard === 'function') {
    updateAnalyticsDashboard();
  }
});

// ==========================================
// Theme Management (Dark / Light)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('cybershield_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cybershield_theme', next);
      updateThemeIcon(next);
      if (typeof updateAnalyticsDashboard === 'function') {
        updateAnalyticsDashboard();
      }
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fa-solid fa-moon text-slate-700';
  } else {
    icon.className = 'fa-solid fa-sun text-amber-400';
  }
}

// ==========================================
// Mobile Menu Navigation
// ==========================================
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  const links = menu.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', () => menu.classList.add('hidden'));
  });
}

// ==========================================
// Survey Execution Engine
// ==========================================
function initSurvey() {
  renderQuestion(0);

  const btnPrev = document.getElementById('survey-btn-prev');
  const btnNext = document.getElementById('survey-btn-next');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentSurveyIndex > 0) {
        currentSurveyIndex--;
        renderQuestion(currentSurveyIndex);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (userSurveyAnswers[SURVEY_QUESTIONS[currentSurveyIndex].id] === undefined) {
        showToast('Please select an option before moving to the next question.', 'warning');
        return;
      }

      if (currentSurveyIndex < SURVEY_QUESTIONS.length - 1) {
        currentSurveyIndex++;
        renderQuestion(currentSurveyIndex);
      } else {
        submitSurvey();
      }
    });
  }
}

function renderQuestion(index) {
  const q = SURVEY_QUESTIONS[index];
  if (!q) return;

  // Update question index & category badge
  const catBadge = document.getElementById('survey-category-badge');
  const qNum = document.getElementById('survey-question-num');
  const qText = document.getElementById('survey-question-text');
  const qContext = document.getElementById('survey-question-context');
  const optionsContainer = document.getElementById('survey-options-container');

  if (catBadge) catBadge.innerHTML = `<i class="fa-solid ${q.icon}"></i> ${q.categoryName}`;
  if (qNum) qNum.innerText = `Question ${index + 1} of ${SURVEY_QUESTIONS.length}`;
  if (qText) qText.innerText = q.question;
  if (qContext) qContext.innerText = q.context;

  // Update progress bar
  const pct = Math.round(((index + 1) / SURVEY_QUESTIONS.length) * 100);
  const fill = document.getElementById('survey-progress-fill');
  const pctText = document.getElementById('survey-progress-pct');
  if (fill) fill.style.width = pct + '%';
  if (pctText) pctText.innerText = pct + '%';

  // Render options
  if (optionsContainer) {
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, optIdx) => {
      const isSelected = (userSurveyAnswers[q.id] === optIdx);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `survey-option-btn ${isSelected ? 'selected' : ''}`;
      btn.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="option-radio"></div>
          <span class="text-sm md:text-base leading-snug">${opt.text}</span>
        </div>
      `;

      btn.addEventListener('click', () => {
        userSurveyAnswers[q.id] = optIdx;
        const allBtns = optionsContainer.querySelectorAll('.survey-option-btn');
        allBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        // Optional quick advancement or update next button
        document.getElementById('survey-btn-next').disabled = false;
      });

      optionsContainer.appendChild(btn);
    });
  }

  // Prev button state
  const btnPrev = document.getElementById('survey-btn-prev');
  if (btnPrev) {
    btnPrev.disabled = (index === 0);
    btnPrev.style.opacity = (index === 0) ? '0.4' : '1';
  }

  // Next button label
  const btnNext = document.getElementById('survey-btn-next');
  if (btnNext) {
    if (index === SURVEY_QUESTIONS.length - 1) {
      btnNext.innerHTML = 'Complete & Get Cyber Report <i class="fa-solid fa-arrow-right"></i>';
    } else {
      btnNext.innerHTML = 'Next Question <i class="fa-solid fa-arrow-right"></i>';
    }
  }
}

function submitSurvey() {
  const result = calculateSurveyHygiene(userSurveyAnswers);
  currentStudentResult = result;

  // Capture demographic inputs
  const studentName = document.getElementById('input-student-name')?.value.trim() || 'Student Scholar';
  const studentYear = document.getElementById('input-student-year')?.value || '2nd Year';
  const studentBranch = document.getElementById('input-student-branch')?.value.trim() || 'Engineering';

  // Add response to the research cohort & save
  if (typeof addSurveyResponse === 'function') {
    addSurveyResponse(result, { year: studentYear, branch: studentBranch });
  }

  // Display results section
  displaySurveyResults(result, studentName, studentYear, studentBranch);

  // Trigger celebration confetti if score is high
  if (result.score >= 70 && typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Scroll to results
  document.getElementById('survey-results-section').classList.remove('hidden');
  document.getElementById('survey-results-section').scrollIntoView({ behavior: 'smooth' });
  showToast('Assessment Completed! Your Cyber Hygiene Report is ready.', 'success');
}

function displaySurveyResults(result, name, year, branch) {
  // Score text & circle animation
  const scoreVal = document.getElementById('res-score-value');
  const badgeEl = document.getElementById('res-tier-badge');
  const summaryEl = document.getElementById('res-summary-text');
  const circleProgress = document.getElementById('score-circle-svg-bar');

  if (scoreVal) scoreVal.innerText = result.score;
  if (badgeEl) {
    badgeEl.className = `cyber-badge ${result.tierBadge} text-sm px-4 py-1.5`;
    badgeEl.innerText = result.tierTitle;
  }
  if (summaryEl) summaryEl.innerText = result.summary;

  // Animate circular SVG gauge (stroke-dashoffset from 471 to target)
  if (circleProgress) {
    const circumference = 471;
    const offset = circumference - (circumference * result.score) / 100;
    setTimeout(() => {
      circleProgress.style.strokeDashoffset = offset;
      circleProgress.style.stroke = result.tierColor;
    }, 200);
  }

  // Render category breakdown progress bars
  const catContainer = document.getElementById('res-category-breakdown');
  if (catContainer) {
    const categoriesMeta = [
      { key: 'passwords', label: 'Password Security & 2FA', icon: 'fa-key' },
      { key: 'phishing', label: 'Phishing & Scam Resistance', icon: 'fa-fish-fins' },
      { key: 'wifi', label: 'Public Wi-Fi & Network', icon: 'fa-wifi' },
      { key: 'devices', label: 'Device & Patch Hygiene', icon: 'fa-laptop-code' },
      { key: 'privacy', label: 'Social Media & Privacy', icon: 'fa-user-secret' },
      { key: 'incident', label: 'Backup & Incident Prep', icon: 'fa-hard-drive' }
    ];

    catContainer.innerHTML = categoriesMeta.map(c => {
      const score = result.categoryScores[c.key] || 0;
      let colorClass = 'from-rose-500 to-amber-500';
      if (score >= 75) colorClass = 'from-emerald-500 to-cyan-500';
      else if (score >= 50) colorClass = 'from-amber-500 to-yellow-500';

      return `
        <div class="mb-3">
          <div class="flex justify-between text-xs font-semibold mb-1 text-slate-300">
            <span><i class="fa-solid ${c.icon} text-cyan-400 mr-1.5"></i> ${c.label}</span>
            <span class="font-mono">${score}%</span>
          </div>
          <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div class="h-full bg-gradient-to-r ${colorClass} rounded-full" style="width: ${score}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render tailored action tips list
  const tipsContainer = document.getElementById('res-action-tips');
  if (tipsContainer) {
    tipsContainer.innerHTML = result.feedback.map(item => {
      const isGood = item.risk === 'safe';
      const isWarn = item.risk === 'moderate';
      const border = isGood ? 'border-emerald-500/30 bg-emerald-500/5' : (isWarn ? 'border-amber-500/30 bg-amber-500/5' : 'border-rose-500/30 bg-rose-500/5');
      const icon = isGood ? 'fa-check text-emerald-400' : (isWarn ? 'fa-triangle-exclamation text-amber-400' : 'fa-xmark text-rose-400');

      return `
        <div class="p-3.5 rounded-xl border ${border} text-xs">
          <div class="flex items-center gap-2 font-semibold text-slate-200 mb-1">
            <i class="fa-solid ${icon}"></i>
            <span>${item.category}</span>
          </div>
          <p class="text-slate-400 mb-1.5"><strong>Your Answer:</strong> ${item.chosen}</p>
          <p class="text-slate-300"><i class="fa-solid fa-lightbulb text-cyan-400 mr-1"></i> ${item.tip}</p>
        </div>
      `;
    }).join('');
  }

  // Populate Certificate Data
  updateCertificate(name, year, branch, result);
}

function updateCertificate(name, year, branch, result) {
  const certName = document.getElementById('cert-student-name');
  const certDetails = document.getElementById('cert-student-details');
  const certScore = document.getElementById('cert-score');
  const certRating = document.getElementById('cert-rating');
  const certDate = document.getElementById('cert-date');

  if (certName) certName.innerText = name;
  if (certDetails) certDetails.innerText = `${branch} • ${year}`;
  if (certScore) certScore.innerText = `${result.score} / 100`;
  if (certRating) certRating.innerText = result.tierTitle;
  if (certDate) certDate.innerText = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function retakeSurvey() {
  currentSurveyIndex = 0;
  userSurveyAnswers = {};
  renderQuestion(0);
  document.getElementById('survey-results-section').classList.add('hidden');
  document.getElementById('survey-section').scrollIntoView({ behavior: 'smooth' });
}

function openCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  if (modal) modal.classList.add('active');
}

function closeCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  if (modal) modal.classList.remove('active');
}

function printCertificate() {
  window.print();
}

// ==========================================
// Password Tool UI Listeners
// ==========================================
function initPasswordEvents() {
  const input = document.getElementById('pwd-input');
  if (input && typeof updatePasswordUI === 'function') {
    input.addEventListener('input', updatePasswordUI);
  }

  const btnGen = document.getElementById('btn-generate-pwd');
  if (btnGen && typeof generateSecurePassword === 'function') {
    btnGen.addEventListener('click', generateSecurePassword);
  }

  const btnCopy = document.getElementById('btn-copy-pwd');
  if (btnCopy && typeof copyPasswordToClipboard === 'function') {
    btnCopy.addEventListener('click', copyPasswordToClipboard);
  }

  const btnToggle = document.getElementById('btn-toggle-pwd');
  if (btnToggle && typeof togglePasswordVisibility === 'function') {
    btnToggle.addEventListener('click', togglePasswordVisibility);
  }
}

// ==========================================
// Phishing Game UI Listeners
// ==========================================
function initPhishingGameEvents() {
  if (typeof loadPhishingScenario === 'function') {
    loadPhishingScenario(0);
  }

  const btnLegit = document.getElementById('btn-choice-legit');
  const btnPhish = document.getElementById('btn-choice-phish');
  const btnNext = document.getElementById('btn-phishing-next');

  if (btnLegit) {
    btnLegit.addEventListener('click', () => handlePhishingGuess(false));
  }
  if (btnPhish) {
    btnPhish.addEventListener('click', () => handlePhishingGuess(true));
  }
  if (btnNext) {
    btnNext.addEventListener('click', handleNextPhishingScenario);
  }
}

// ==========================================
// Knowledge Hub Filter Tabs
// ==========================================
function initTabs() {
  const tabBtns = document.querySelectorAll('.guide-tab-btn');
  const cards = document.querySelectorAll('.guide-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ==========================================
// Global Toast Notifications
// ==========================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = 'fa-info-circle text-cyan-400';
  if (type === 'success') icon = 'fa-circle-check text-emerald-400';
  if (type === 'warning') icon = 'fa-triangle-exclamation text-amber-400';
  if (type === 'error') icon = 'fa-circle-xmark text-rose-400';

  toast.innerHTML = `
    <i class="fa-solid ${icon} text-lg"></i>
    <span class="text-sm font-medium">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
