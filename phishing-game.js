/**
 * Interactive "Spot the Phish" Simulator Engine
 * Teaches students how to spot deceptive cues in emails, SMS, and WhatsApp messages
 */

const PHISHING_SCENARIOS = [
  {
    id: 1,
    title: 'Urgent Examination Department Notice',
    senderName: 'Controller of Examinations <admin@university-results-portal.xyz>',
    targetAudience: 'University Students',
    date: 'Today, 09:15 AM',
    subject: 'URGENT: Semester Exam Admit Card Suspended due to Incomplete Profile Verification',
    body: `
      <p>Dear Student,</p>
      <p>Your Semester End Examination registration has been flagged due to pending ABC (Academic Bank of Credits) ID verification. <strong>Your Admit Card is temporarily withheld.</strong></p>
      <p>To avoid debarment from the upcoming exams starting Monday, you must verify your student portal password and credentials immediately via the link below:</p>
      <p style="margin: 1rem 0;"><a href="#" class="threat-link" style="color: #38bdf8; text-decoration: underline; font-weight: 600;">https://university-results-portal.xyz/verify-login?id=89234</a></p>
      <p>Failure to respond within <strong>2 hours</strong> will result in exam cancellation.</p>
      <p>Regards,<br>Exam Disciplinary Committee</p>
    `,
    isPhishing: true,
    difficulty: 'Easy',
    redFlags: [
      'Deceptive domain: "@university-results-portal.xyz" instead of the official college domain (e.g. .edu.in or .ac.in).',
      'Artificial urgency: "Within 2 hours" to panic students into acting without thinking.',
      'Demanding password verification via a raw unverified link.',
      'Generic greeting: "Dear Student" rather than your specific name and college enrollment number.'
    ]
  },
  {
    id: 2,
    title: 'Google Account Security Alert',
    senderName: 'Google <no-reply@accounts.google.com>',
    targetAudience: 'Any Gmail user',
    date: 'Yesterday, 04:30 PM',
    subject: 'Security alert: New sign-in from Chrome on Windows',
    body: `
      <p>Hi Dipesh,</p>
      <p>Your Google Account was just signed in to from a new Windows device in New Delhi, India.</p>
      <p><strong>Device:</strong> Chrome on Windows 11<br>
      <strong>Time:</strong> 26 Oct 2026, 04:28 PM IST<br>
      <strong>IP:</strong> 103.212.xx.xx</p>
      <p>If this was you, you don't need to do anything. If you don't recognize this activity, review your devices immediately at your Google Account page.</p>
      <p style="margin: 1rem 0;"><a href="#" style="background: #1e293b; border: 1px solid #475569; color: #fff; padding: 6px 14px; border-radius: 4px; text-decoration: none; display: inline-block;">Check activity</a></p>
    `,
    isPhishing: false,
    difficulty: 'Medium',
    redFlags: [
      'Legitimate sender domain: "no-reply@accounts.google.com".',
      'Personalized greeting addressing the student directly.',
      'Does not ask for passwords or OTPs.',
      'Does not threaten immediate account deletion; calmly advises checking official account settings.'
    ]
  },
  {
    id: 3,
    title: 'High-Paying Remote Student Internship Scam',
    senderName: 'HR Global Tech Internships <recruitment@fast-careers-hiring.online>',
    targetAudience: 'College Students looking for internships',
    date: 'Today, 11:42 AM',
    subject: 'Offer Letter: Part-Time AI Data Annotator (Stipend: ₹45,000/month)',
    body: `
      <p>Congratulations Candidate!</p>
      <p>We shortlisted your profile from LinkedIn / Internshala for the position of <strong>Junior Student Research Associate</strong>.</p>
      <p><strong>Perks:</strong> 2 hrs/day work from hostel, ₹45,000 monthly stipend, Certificate of Completion & free MacBook Air.</p>
      <p>To finalize your slot and receive the laptop dispatch tracking ID, transfer the refundable security badge fee of <strong>₹499</strong> to the official HR UPI ID: <code>career-desk@okicici</code>.</p>
      <p>Send screenshot of payment within 30 minutes to reserve your seat.</p>
    `,
    isPhishing: true,
    difficulty: 'Easy',
    redFlags: [
      'Advance-fee fraud: Legitimate employers NEVER charge money, registration fees, or "laptop courier security deposits".',
      'Unrealistic compensation: ₹45,000/month for 2 hrs/day unskilled work is an obvious bait.',
      'Generic greeting: "Congratulations Candidate!".',
      'Urgency and asking for direct UPI transfer without interview or official portal onboarding.'
    ]
  },
  {
    id: 4,
    title: 'Bank KYC Expiry SMS Alert',
    senderName: 'VK-SBISMS / State Bank Alert',
    targetAudience: 'Mobile Banking Students',
    date: 'Today, 01:10 PM',
    subject: 'SMS Message: Dear Customer, your SBI YONO account will be blocked today...',
    body: `
      <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-left: 3px solid #f43f5e; border-radius: 4px; font-family: monospace;">
        "Dear SBI Customer, your YONO Netbanking service will be deactivated within 12 hours due to pending PAN card verification. Kindly update your PAN immediately by downloading SBI_KYC_Update.apk from: http://bit.ly/sbi-pan-update"
      </div>
    `,
    isPhishing: true,
    difficulty: 'Easy',
    redFlags: [
      'Malicious APK link: Banks never send shortened bit.ly links asking you to install sideloaded APK files.',
      'Shortened URL hides the actual hacker domain.',
      'Installing this APK deploys an SMS-forwarder trojan that steals your banking OTPs in the background.',
      'Banks strictly require in-branch KYC or official app authentication.'
    ]
  }
];

let currentScenarioIndex = 0;
let phishingScore = 0;
let userAnswersLog = [];

function loadPhishingScenario(index) {
  const container = document.getElementById('phishing-card-container');
  if (!container || !PHISHING_SCENARIOS[index]) return;

  const scenario = PHISHING_SCENARIOS[index];
  currentScenarioIndex = index;

  document.getElementById('phishing-progress-text').innerText = `Scenario ${index + 1} of ${PHISHING_SCENARIOS.length}`;
  document.getElementById('phishing-scenario-title').innerText = scenario.title;
  document.getElementById('phishing-scenario-sender').innerText = scenario.senderName;
  document.getElementById('phishing-scenario-date').innerText = scenario.date;
  document.getElementById('phishing-scenario-subject').innerText = scenario.subject;
  document.getElementById('phishing-scenario-body').innerHTML = scenario.body;

  // Reset feedback box
  const feedbackBox = document.getElementById('phishing-feedback-box');
  feedbackBox.classList.add('hidden');
  feedbackBox.innerHTML = '';

  // Reset button states
  document.getElementById('btn-choice-legit').disabled = false;
  document.getElementById('btn-choice-phish').disabled = false;
  document.getElementById('btn-phishing-next').classList.add('hidden');
}

function handlePhishingGuess(userGuessedPhish) {
  const scenario = PHISHING_SCENARIOS[currentScenarioIndex];
  const isCorrect = (userGuessedPhish === scenario.isPhishing);

  if (isCorrect) phishingScore++;

  userAnswersLog.push({
    scenario: scenario.title,
    isCorrect,
    userGuessedPhish,
    isPhishing: scenario.isPhishing
  });

  // Disable buttons
  document.getElementById('btn-choice-legit').disabled = true;
  document.getElementById('btn-choice-phish').disabled = true;

  // Reveal feedback box
  const feedbackBox = document.getElementById('phishing-feedback-box');
  feedbackBox.classList.remove('hidden');

  const statusClass = isCorrect ? 'text-emerald-400' : 'text-rose-400';
  const statusIcon = isCorrect ? 'fa-circle-check' : 'fa-triangle-exclamation';
  const statusTitle = isCorrect ? 'Spot On! You identified correctly.' : 'Be Careful! You missed critical warning signs.';

  const redFlagsList = scenario.redFlags.map(rf => `<li class="flex items-start gap-2 mb-1.5"><i class="fa-solid fa-angle-right text-cyan-400 mt-1"></i><span>${rf}</span></li>`).join('');

  feedbackBox.innerHTML = `
    <div class="p-4 rounded-xl border ${isCorrect ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-rose-500/40 bg-rose-500/10'}">
      <div class="flex items-center gap-2 font-bold ${statusClass} text-base mb-2">
        <i class="fa-solid ${statusIcon}"></i>
        <span>${statusTitle}</span>
      </div>
      <p class="text-xs text-slate-300 mb-3">
        <strong>Verdict:</strong> This message was indeed <span class="uppercase font-bold ${scenario.isPhishing ? 'text-rose-400' : 'text-emerald-400'}">${scenario.isPhishing ? 'Phishing / Fraud' : 'Legitimate'}</span>.
      </p>
      <div class="text-xs text-slate-300">
        <p class="font-semibold text-slate-200 mb-1">Key Clues & Analysis:</p>
        <ul class="pl-1">${redFlagsList}</ul>
      </div>
    </div>
  `;

  const nextBtn = document.getElementById('btn-phishing-next');
  if (currentScenarioIndex < PHISHING_SCENARIOS.length - 1) {
    nextBtn.innerText = 'Next Scenario →';
    nextBtn.classList.remove('hidden');
  } else {
    nextBtn.innerText = 'View Simulator Results 🏆';
    nextBtn.classList.remove('hidden');
  }
}

function handleNextPhishingScenario() {
  if (currentScenarioIndex < PHISHING_SCENARIOS.length - 1) {
    loadPhishingScenario(currentScenarioIndex + 1);
  } else {
    // Show summary modal
    showPhishingCompletion();
  }
}

function showPhishingCompletion() {
  const modal = document.getElementById('phishing-result-modal');
  if (!modal) return;

  const scorePct = Math.round((phishingScore / PHISHING_SCENARIOS.length) * 100);
  document.getElementById('phishing-final-score').innerText = `${phishingScore} / ${PHISHING_SCENARIOS.length} (${scorePct}%)`;

  let badge = 'Phishing Detective 🕵️';
  let desc = 'Brilliant vigilance! You successfully spotted tricky spoofed domains and urgent manipulation tactics.';

  if (scorePct < 70) {
    badge = 'Vulnerable to Social Engineering ⚠️';
    desc = 'Attackers could trick you with urgent emails or enticing internship offers. Review the red flags above carefully!';
  }

  document.getElementById('phishing-final-badge').innerText = badge;
  document.getElementById('phishing-final-desc').innerText = desc;

  modal.classList.add('active');

  if (typeof confetti === 'function' && scorePct >= 70) {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  }
}

function resetPhishingGame() {
  phishingScore = 0;
  userAnswersLog = [];
  loadPhishingScenario(0);
  const modal = document.getElementById('phishing-result-modal');
  if (modal) modal.classList.remove('active');
}
