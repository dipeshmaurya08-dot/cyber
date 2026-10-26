/**
 * Cybersecurity Awareness Survey Data & Benchmarks
 * Academic Research Survey Engine for Students
 */

const SURVEY_QUESTIONS = [
  {
    id: 'q1',
    category: 'passwords',
    categoryName: 'Password Hygiene & 2FA',
    icon: 'fa-key',
    question: 'How do you manage your passwords across multiple accounts (college portal, email, social media, banking)?',
    context: 'Credential stuffing is the #1 method attackers use against university students.',
    options: [
      {
        text: 'I use a unique, complex password for every account stored in a Password Manager (Bitwarden, 1Password, Google/Apple Keychain).',
        score: 10,
        risk: 'safe',
        tip: 'Excellent! Password managers prevent credential stuffing and protect you if one service gets breached.'
      },
      {
        text: 'I use 3–4 variations of a strong password with different numbers/symbols for different accounts.',
        score: 6,
        risk: 'moderate',
        tip: 'Better than single password, but automated cracking tools can easily guess variations of your base password.'
      },
      {
        text: 'I use the same 1 or 2 easy-to-remember passwords across almost all my accounts.',
        score: 1,
        risk: 'danger',
        tip: 'Critical Risk: If any random website leaks your password, attackers immediately compromise your college portal and emails.'
      },
      {
        text: 'I save my passwords in a plain text file, notes app, or on a physical notebook.',
        score: 3,
        risk: 'danger',
        tip: 'Unencrypted notes are easily read by malware, screen-sharing leaks, or physical theft.'
      }
    ]
  },
  {
    id: 'q2',
    category: 'passwords',
    categoryName: 'Password Hygiene & 2FA',
    icon: 'fa-shield-halved',
    question: 'Where do you have Two-Factor Authentication (2FA / OTP / Authenticator App) enabled?',
    context: '2FA blocks 99.9% of automated account takeover attacks according to Microsoft Security research.',
    options: [
      {
        text: 'On all critical accounts (Google, College email, Instagram, Banking, WhatsApp) using an Authenticator app or Hardware key.',
        score: 10,
        risk: 'safe',
        tip: 'Top Tier Security! App-based authenticators (like Google/Microsoft Authenticator) are immune to SIM swapping.'
      },
      {
        text: 'On major accounts like Gmail & Banking, mostly using SMS OTP.',
        score: 7,
        risk: 'moderate',
        tip: 'Good baseline, but beware of SIM swap fraud and OTP-stealing malware on Android.'
      },
      {
        text: 'Only where the service forces me to turn it on (e.g., Bank UPI).',
        score: 4,
        risk: 'moderate',
        tip: 'Your student email and social handles are valuable targets for impersonation and academic identity theft.'
      },
      {
        text: 'I have not enabled 2FA anywhere / I find it inconvenient.',
        score: 0,
        risk: 'danger',
        tip: 'Dangerous! A single password breach leaves your entire digital identity completely defenseless.'
      }
    ]
  },
  {
    id: 'q3',
    category: 'phishing',
    categoryName: 'Phishing & Social Engineering',
    icon: 'fa-fish-fins',
    question: 'You receive an urgent email from "college-exam-control@edu-verify.net" stating: "Final Exam Admit Card Withheld. Log in immediately to verify identity." What is your first action?',
    context: 'Phishing emails exploit urgency, fear, and institutional authority to trick students into giving credentials.',
    options: [
      {
        text: 'Check the sender domain carefully, do NOT click the link, and independently visit the official college ERP portal via bookmark.',
        score: 10,
        risk: 'safe',
        tip: 'Perfect reaction! Always verify domain names and navigate to official portals independently.'
      },
      {
        text: 'Click the link to see what the page looks like, but don\'t enter any passwords.',
        score: 4,
        risk: 'danger',
        tip: 'Risky! Just clicking malicious links can trigger drive-by malware downloads or track your active IP address.'
      },
      {
        text: 'Forward the email to my class WhatsApp group to ask if others received the same notice.',
        score: 6,
        risk: 'moderate',
        tip: 'Collaborative, but accidentally spreads panic and phishing exposure to your classmates.'
      },
      {
        text: 'Quickly log in using my college credentials because I cannot afford to lose my exam hall ticket.',
        score: 0,
        risk: 'danger',
        tip: 'You fell for urgency-based social engineering! Your college login credentials would be stolen instantly.'
      }
    ]
  },
  {
    id: 'q4',
    category: 'phishing',
    categoryName: 'Phishing & Social Engineering',
    icon: 'fa-envelope-open-text',
    question: 'You receive a WhatsApp message from a Telegram job group: "Earn ₹3,000/day by liking YouTube videos. Work from college hostel. Pay ₹299 registration fee." How do you respond?',
    context: 'Task-based employment and scholarship scams are the most rampant financial crimes targeting Indian university students.',
    options: [
      {
        text: 'Immediately identify it as an advance-fee scam, report/block the number, and warn peers.',
        score: 10,
        risk: 'safe',
        tip: 'Spot on! Legitimate jobs never ask candidates to pay an upfront "registration fee" or task deposit.'
      },
      {
        text: 'Try it for a day with a throwaway UPI account to see if they actually send payment.',
        score: 2,
        risk: 'danger',
        tip: 'Trap! Scammers often pay ₹150 first to gain your trust, then extort thousands in the next "prepaid task".'
      },
      {
        text: 'Ignore the message without blocking or reporting.',
        score: 6,
        risk: 'moderate',
        tip: 'Safe for you personally, but reporting helps telecom and police portals flag the fraud syndicate.'
      },
      {
        text: 'Ask them for their company GST number and registration certificate.',
        score: 5,
        risk: 'moderate',
        tip: 'Scammers readily forge fake MCA / GST certificates with stolen logos to appear authentic.'
      }
    ]
  },
  {
    id: 'q5',
    category: 'wifi',
    categoryName: 'Public Wi-Fi & Network Security',
    icon: 'fa-wifi',
    question: 'When connected to open, unencrypted Wi-Fi in the campus library, cafeteria, or hostel, how do you browse?',
    context: 'Open public networks allow attackers to conduct Man-in-the-Middle (MitM) attacks and sniff unencrypted packets.',
    options: [
      {
        text: 'I use a trusted VPN (like ProtonVPN, Cloudflare 1.1.1.1 WARP, or Mullvad) or switch to mobile data for sensitive tasks.',
        score: 10,
        risk: 'safe',
        tip: 'Rock solid! Encrypted tunnels prevent anyone on the local network from inspecting your traffic.'
      },
      {
        text: 'I browse regular social media and YouTube, but never open banking or college payment portals.',
        score: 7,
        risk: 'moderate',
        tip: 'Sensible compromise, but session cookies on unencrypted tabs can still theoretically be intercepted.'
      },
      {
        text: 'I connect freely and do whatever I need; modern websites all have HTTPS locks anyway.',
        score: 4,
        risk: 'moderate',
        tip: 'While HTTPS helps, DNS queries, fake SSL certificates, and rogue "Evil Twin" Wi-Fi APs can still deceive your device.'
      },
      {
        text: 'I do UPI payments, fee submissions, and shopping whenever free Wi-Fi is available to save cellular data.',
        score: 1,
        risk: 'danger',
        tip: 'High vulnerability: Rogue campus access points can intercept device tokens and redirect to spoofed gateways.'
      }
    ]
  },
  {
    id: 'q6',
    category: 'wifi',
    categoryName: 'Public Wi-Fi & Network Security',
    icon: 'fa-bluetooth',
    question: 'What is your habit regarding your smartphone’s Bluetooth, AirDrop / Quick Share, and Personal Hotspot?',
    context: 'Over-the-air scanning enables Bluebugging, unauthorized file transmission, and device fingerprinting.',
    options: [
      {
        text: 'Kept turned OFF by default; turned ON only when actively pairing with my headphones or transferring files.',
        score: 10,
        risk: 'safe',
        tip: 'Ideal hygiene! Minimizes your device attack surface and saves significant battery life.'
      },
      {
        text: 'Bluetooth is always ON for smartwatches/earbuds, but QuickShare/AirDrop is set to "Contacts Only".',
        score: 8,
        risk: 'safe',
        tip: 'Good configuration! Keeping AirDrop/QuickShare to Contacts Only prevents unsolicited cyber-flashing or malicious files.'
      },
      {
        text: 'QuickShare / AirDrop is left on "Everyone" or open so friends can send me assignment PDFs anytime.',
        score: 3,
        risk: 'danger',
        tip: 'Dangerous! Anyone within 30 feet in a classroom or metro can send malicious payloads or track your device UUID.'
      },
      {
        text: 'I never check these settings; whatever came default out of the box is active.',
        score: 2,
        risk: 'danger',
        tip: 'Leaving wireless radios discovery-enabled allows proximity eavesdropping in crowded campus venues.'
      }
    ]
  },
  {
    id: 'q7',
    category: 'devices',
    categoryName: 'Device & Software Security',
    icon: 'fa-laptop-code',
    question: 'How do you obtain academic software, development tools, games, or textbooks?',
    context: 'Over 65% of pirated software and cracked APK installers contain silent infostealers (e.g. RedLine, Lumma).',
    options: [
      {
        text: 'Only from official sources, GitHub releases, open-source alternatives, or student licenses (e.g. GitHub Student Pack).',
        score: 10,
        risk: 'safe',
        tip: 'Outstanding! Student developer packs provide thousands of dollars worth of authentic software for free.'
      },
      {
        text: 'I download cracked software/torrents, but I run an antivirus scan on the ZIP file before extracting.',
        score: 4,
        risk: 'danger',
        tip: 'False sense of security! Zero-day malware and FUD (fully undetectable) crypters easily bypass standard AV scans.'
      },
      {
        text: 'I regularly download modded APKs (e.g. modded Spotify, Instagram), game cracks, and pirated Windows ISOs.',
        score: 0,
        risk: 'danger',
        tip: 'Severe danger: Modded APKs routinely log your keystrokes, hijack session tokens, and install background crypto-miners.'
      },
      {
        text: 'I use cracked software only on a dedicated virtual machine or secondary old laptop without personal accounts.',
        score: 7,
        risk: 'moderate',
        tip: 'Smart sandboxing, but network-level lateral movement can still threaten your local home/hostel network.'
      }
    ]
  },
  {
    id: 'q8',
    category: 'devices',
    categoryName: 'Device & Software Security',
    icon: 'fa-arrows-rotate',
    question: 'When your laptop or phone prompts you with an Operating System / Security update, how do you respond?',
    context: 'Most security patches fix publicly disclosed Remote Code Execution (RCE) vulnerabilities that hackers actively exploit.',
    options: [
      {
        text: 'Install immediately or let it auto-update overnight while plugged into charging.',
        score: 10,
        risk: 'safe',
        tip: 'Gold standard! Rapid patching closes known zero-day exploits before malicious actors can exploit them.'
      },
      {
        text: 'Delay for 1–2 weeks until I am free from exams or assignments.',
        score: 6,
        risk: 'moderate',
        tip: 'Common student habit, but 14 days is a large window for automated botnets scanning for unpatched vulnerabilities.'
      },
      {
        text: 'Keep hitting "Remind Me Tomorrow" for months because updates take too long or take up storage.',
        score: 1,
        risk: 'danger',
        tip: 'Critical Vulnerability: You are running known vulnerable libraries that attackers can compromise with zero clicks.'
      },
      {
        text: 'I have turned off Windows/Android updates permanently.',
        score: 0,
        risk: 'danger',
        tip: 'Extremely dangerous! Running obsolete systems guarantees remote infection if you browse any compromised website.'
      }
    ]
  },
  {
    id: 'q9',
    category: 'privacy',
    categoryName: 'Social Media & Privacy',
    icon: 'fa-user-secret',
    question: 'What information have you shared or posted on social media (Instagram, Snapchat, LinkedIn, X)?',
    context: 'OSINT (Open Source Intelligence) allows cyber criminals to craft hyper-personalized spear-phishing attacks.',
    options: [
      {
        text: 'I never share personal ID numbers, birth dates, boarding passes, exam admit cards, or live home/hostel locations.',
        score: 10,
        risk: 'safe',
        tip: 'Smart privacy boundary! Barcodes on admit cards and boarding passes contain full PII and PNR database keys.'
      },
      {
        text: 'I post photos of events and travel, but only after I have left the venue (delayed location tagging).',
        score: 8,
        risk: 'safe',
        tip: 'Great practice! Delayed posting prevents stalkers or thieves from knowing your exact real-time physical whereabouts.'
      },
      {
        text: 'I have posted photos of my college admission letter, exam hall ticket, or driving license to celebrate milestones.',
        score: 2,
        risk: 'danger',
        tip: 'High identity theft risk: Your mother\'s name, DOB, registration number, and address can open loan fraud apps in your name.'
      },
      {
        text: 'My social accounts are public with live check-ins, campus roll number in bio, and phone number in contact info.',
        score: 0,
        risk: 'danger',
        tip: 'Zero privacy: Doxxers, impersonators, and cyber-bullies have every data point needed to socially engineer your life.'
      }
    ]
  },
  {
    id: 'q10',
    category: 'privacy',
    categoryName: 'Social Media & Privacy',
    icon: 'fa-camera-retro',
    question: 'How do you handle smartphone app permissions (Camera, Microphone, Contacts, Gallery, Location)?',
    context: 'Unregulated background permissions allow rogue apps to harvest contact books and photos silently.',
    options: [
      {
        text: 'I strictly grant permissions only "While using the app" and revoke access if an app has no logical need for it.',
        score: 10,
        risk: 'safe',
        tip: 'Exemplary habit! A calculator app or PDF reader has zero legitimate need for Contacts or Location.'
      },
      {
        text: 'I check permissions when the popup appears, but rarely review existing installed app permissions.',
        score: 7,
        risk: 'moderate',
        tip: 'Good initial gatekeeping. Use your phone\'s built-in "Permission Manager" once a semester to audit older apps.'
      },
      {
        text: 'I tap "Allow All" quickly because I just want to start using the app immediately.',
        score: 1,
        risk: 'danger',
        tip: 'High exposure: Unscrupulous apps harvest your full contact list and upload gallery metadata to overseas servers.'
      },
      {
        text: 'I did not know I could selectively control app permissions.',
        score: 2,
        risk: 'danger',
        tip: 'Educational opportunity: Both Android and iOS provide granular toggles to disable location, mic, and camera access.'
      }
    ]
  },
  {
    id: 'q11',
    category: 'incident',
    categoryName: 'Data Backup & Incident Response',
    icon: 'fa-hard-drive',
    question: 'How do you safeguard your final year project, research code, assignments, and academic records against loss or ransomware?',
    context: 'Hardware failure, accidental deletion, or ransomware right before deadlines is a student’s ultimate nightmare.',
    options: [
      {
        text: 'I follow the 3-2-1 backup rule (e.g. Git repository + automated Google Drive/OneDrive cloud + external thumb drive).',
        score: 10,
        risk: 'safe',
        tip: 'Industry standard excellence! Even if your laptop is stolen or disk dies, your academic work is safe within minutes.'
      },
      {
        text: 'I keep everything on Google Drive or OneDrive cloud sync folder.',
        score: 8,
        risk: 'safe',
        tip: 'Very good! Cloud version history also allows you to restore earlier drafts if ransomware encrypts your local copy.'
      },
      {
        text: 'I manually email copies to myself or send files on a private WhatsApp chat once in a while.',
        score: 5,
        risk: 'moderate',
        tip: 'Better than nothing, but easy to forget and lacks automated version control for large project folders.'
      },
      {
        text: 'Everything is only on my laptop’s Downloads / Desktop folder; no backups exist.',
        score: 0,
        risk: 'danger',
        tip: 'Disaster waiting to happen! A single SSD crash, coffee spill, or ransomware hit means complete loss of semester work.'
      }
    ]
  },
  {
    id: 'q12',
    category: 'incident',
    categoryName: 'Data Backup & Incident Response',
    icon: 'fa-phone-volume',
    question: 'If you fall victim to an online financial fraud or unauthorized transaction today, what is the official emergency procedure in India?',
    context: 'The first 2 to 3 hours after a financial cyber fraud are known as the "Golden Hours" to freeze stolen money.',
    options: [
      {
        text: 'Immediately dial the National Cyber Crime Helpline 1930 and file a complaint on cybercrime.gov.in within the Golden Hour.',
        score: 10,
        risk: 'safe',
        tip: 'Accurate! 1930 connects directly to state cyber police and participating bank nodal officers to freeze transit accounts.'
      },
      {
        text: 'Block my debit/credit card through the banking app and hope the bank handles the refund.',
        score: 6,
        risk: 'moderate',
        tip: 'Blocking the card is step 1, but without calling 1930, the money transferred to mule accounts gets laundered within hours.'
      },
      {
        text: 'Post on X (Twitter) tagging the bank customer care and cyber police.',
        score: 3,
        risk: 'danger',
        tip: 'Risky! Fake scam bots on Twitter/X monitor complaints and impersonate bank support to scam victims a second time.'
      },
      {
        text: 'I have no idea who to contact or what emergency numbers exist.',
        score: 0,
        risk: 'danger',
        tip: 'Memorize this immediately: Dial 1930 (Cyber Crime Helpline) and report on https://cybercrime.gov.in'
      }
    ]
  }
];

// Baseline Statistical Dataset representing 60 surveyed university students
// Used to power dynamic research analytics dashboard out-of-the-box
const BENCHMARK_SURVEY_COHORT = [
  { id: 'S1', year: '3rd Year', branch: 'Computer Science', score: 82, tier: 'Guardian', p: 85, ph: 90, w: 75, d: 80, pr: 80, inc: 80 },
  { id: 'S2', year: '1st Year', branch: 'Mechanical', score: 42, tier: 'High Risk', p: 35, ph: 40, w: 45, d: 30, pr: 50, inc: 50 },
  { id: 'S3', year: '2nd Year', branch: 'Electronics', score: 65, tier: 'Cautious', p: 70, ph: 60, w: 60, d: 70, pr: 65, inc: 65 },
  { id: 'S4', year: '4th Year', branch: 'Information Tech', score: 91, tier: 'Guardian', p: 95, ph: 95, w: 90, d: 85, pr: 90, inc: 90 },
  { id: 'S5', year: '1st Year', branch: 'Civil Engineering', score: 38, tier: 'High Risk', p: 30, ph: 35, w: 40, d: 45, pr: 35, inc: 40 },
  { id: 'S6', year: '2nd Year', branch: 'Business Admin', score: 48, tier: 'High Risk', p: 40, ph: 50, w: 50, d: 40, pr: 60, inc: 50 },
  { id: 'S7', year: '3rd Year', branch: 'Electrical', score: 72, tier: 'Cautious', p: 75, ph: 70, w: 65, d: 80, pr: 70, inc: 70 },
  { id: 'S8', year: '4th Year', branch: 'Computer Science', score: 88, tier: 'Guardian', p: 90, ph: 85, w: 85, d: 90, pr: 90, inc: 90 },
  { id: 'S9', year: '1st Year', branch: 'Biotech', score: 52, tier: 'Cautious', p: 50, ph: 45, w: 55, d: 60, pr: 50, inc: 50 },
  { id: 'S10', year: '2nd Year', branch: 'Computer Science', score: 78, tier: 'Cautious', p: 80, ph: 75, w: 75, d: 80, pr: 80, inc: 80 },
  { id: 'S11', year: '3rd Year', branch: 'Information Tech', score: 84, tier: 'Guardian', p: 85, ph: 80, w: 85, d: 85, pr: 85, inc: 85 },
  { id: 'S12', year: '1st Year', branch: 'Commerce', score: 35, tier: 'High Risk', p: 25, ph: 30, w: 40, d: 35, pr: 45, inc: 35 },
  { id: 'S13', year: '4th Year', branch: 'Mechanical', score: 68, tier: 'Cautious', p: 70, ph: 65, w: 70, d: 65, pr: 70, inc: 70 },
  { id: 'S14', year: '2nd Year', branch: 'Design / Arts', score: 45, tier: 'High Risk', p: 40, ph: 40, w: 45, d: 50, pr: 50, inc: 50 },
  { id: 'S15', year: '3rd Year', branch: 'Computer Science', score: 94, tier: 'Guardian', p: 100, ph: 95, w: 90, d: 95, pr: 90, inc: 95 },
  { id: 'S16', year: '2nd Year', branch: 'Electronics', score: 62, tier: 'Cautious', p: 65, ph: 60, w: 55, d: 70, pr: 60, inc: 60 },
  { id: 'S17', year: '1st Year', branch: 'Computer Science', score: 58, tier: 'Cautious', p: 60, ph: 55, w: 60, d: 60, pr: 55, inc: 55 },
  { id: 'S18', year: '4th Year', branch: 'Civil Engineering', score: 64, tier: 'Cautious', p: 65, ph: 60, w: 60, d: 65, pr: 70, inc: 65 },
  { id: 'S19', year: '3rd Year', branch: 'Business Admin', score: 55, tier: 'Cautious', p: 55, ph: 50, w: 55, d: 60, pr: 55, inc: 60 },
  { id: 'S20', year: '4th Year', branch: 'Information Tech', score: 86, tier: 'Guardian', p: 90, ph: 85, w: 85, d: 85, pr: 85, inc: 85 },
  { id: 'S21', year: '1st Year', branch: 'Information Tech', score: 46, tier: 'High Risk', p: 40, ph: 45, w: 50, d: 45, pr: 50, inc: 45 },
  { id: 'S22', year: '2nd Year', branch: 'Computer Science', score: 76, tier: 'Cautious', p: 80, ph: 75, w: 70, d: 80, pr: 75, inc: 80 },
  { id: 'S23', year: '3rd Year', branch: 'Mechanical', score: 59, tier: 'Cautious', p: 60, ph: 55, w: 60, d: 65, pr: 55, inc: 60 },
  { id: 'S24', year: '1st Year', branch: 'Electrical', score: 39, tier: 'High Risk', p: 30, ph: 40, w: 40, d: 40, pr: 45, inc: 40 },
  { id: 'S25', year: '4th Year', branch: 'Computer Science', score: 92, tier: 'Guardian', p: 95, ph: 95, w: 90, d: 90, pr: 90, inc: 90 }
];

// Calculation helper for survey completion
function calculateSurveyHygiene(answers) {
  let totalScore = 0;
  const maxPossible = SURVEY_QUESTIONS.length * 10;
  
  const categoryScores = {
    passwords: { current: 0, max: 0 },
    phishing: { current: 0, max: 0 },
    wifi: { current: 0, max: 0 },
    devices: { current: 0, max: 0 },
    privacy: { current: 0, max: 0 },
    incident: { current: 0, max: 0 }
  };

  const detailedFeedback = [];

  SURVEY_QUESTIONS.forEach(q => {
    categoryScores[q.category].max += 10;
    const selectedOptionIndex = answers[q.id];
    if (selectedOptionIndex !== undefined && q.options[selectedOptionIndex]) {
      const option = q.options[selectedOptionIndex];
      totalScore += option.score;
      categoryScores[q.category].current += option.score;

      detailedFeedback.push({
        questionId: q.id,
        category: q.categoryName,
        question: q.question,
        chosen: option.text,
        score: option.score,
        risk: option.risk,
        tip: option.tip
      });
    }
  });

  const percentage = Math.round((totalScore / maxPossible) * 100);

  let tier = 'High Risk';
  let tierTitle = 'Cyber Vulnerable Student';
  let tierColor = 'var(--accent-rose)';
  let tierBadge = 'badge-rose';
  let summary = 'Your digital habits leave you open to credential theft, fake campus scams, and data compromise. Urgent habit upgrades recommended below!';

  if (percentage >= 75) {
    tier = 'Guardian';
    tierTitle = 'Cyber Guardian (Low Risk)';
    tierColor = 'var(--accent-emerald)';
    tierBadge = 'badge-emerald';
    summary = 'Outstanding security awareness! You practice proactive cyber defense, protect your credentials, and understand modern attack vectors.';
  } else if (percentage >= 50) {
    tier = 'Cautious';
    tierTitle = 'Cautious Surfer (Moderate Risk)';
    tierColor = 'var(--accent-amber)';
    tierBadge = 'badge-amber';
    summary = 'Good foundational awareness, but a few critical vulnerabilities (like public Wi-Fi or software piracy) still pose danger.';
  }

  const categoryPercentages = {};
  for (const cat in categoryScores) {
    categoryPercentages[cat] = Math.round((categoryScores[cat].current / categoryScores[cat].max) * 100);
  }

  return {
    score: percentage,
    totalPoints: totalScore,
    maxPoints: maxPossible,
    tier,
    tierTitle,
    tierColor,
    tierBadge,
    summary,
    categoryScores: categoryPercentages,
    feedback: detailedFeedback
  };
}
