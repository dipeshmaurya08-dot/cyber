/**
 * Password Security Analyzer & Strong Password Generator
 * Client-Side Only (No passwords ever leave the user's browser)
 */

function analyzePassword(pwd) {
  if (!pwd) {
    return {
      score: 0,
      label: 'Enter a password',
      color: '#64748b',
      crackTime: 'Instant',
      checks: { length: false, upper: false, lower: false, number: false, special: false },
      warnings: []
    };
  }

  let score = 0;
  const warnings = [];

  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  const length = pwd.length;

  // Length scoring
  if (length >= 8) score += 20;
  if (length >= 12) score += 25;
  if (length >= 16) score += 15;

  // Complexity scoring
  if (hasLower) score += 10;
  if (hasUpper) score += 10;
  if (hasNumber) score += 10;
  if (hasSpecial) score += 10;

  // Common pattern penalties
  const lowerPwd = pwd.toLowerCase();
  const commonWords = ['password', '123456', 'admin', 'qwerty', 'college', 'student', 'welcome', 'india', 'pass@123', 'root'];
  for (const w of commonWords) {
    if (lowerPwd.includes(w)) {
      score = Math.max(5, score - 35);
      warnings.push(`Contains easily guessable dictionary word: "${w}"`);
      break;
    }
  }

  if (/(.)\1{2,}/.test(pwd)) {
    score = Math.max(10, score - 15);
    warnings.push('Contains repeating characters (e.g. "aaa" or "111")');
  }

  if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,8}$/.test(pwd) && !hasSpecial) {
    warnings.push('Short alphanumeric passwords without symbols crack in seconds.');
  }

  // Calculate entropy
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 32;

  const entropy = length * (poolSize > 0 ? Math.log2(poolSize) : 0);

  // Time to crack estimate (at 10 billion guesses/sec GPU cluster)
  let crackTime = 'Instant';
  if (entropy < 28) crackTime = 'A few seconds';
  else if (entropy < 40) crackTime = 'A few minutes';
  else if (entropy < 50) crackTime = 'Several hours';
  else if (entropy < 60) crackTime = 'Several months';
  else if (entropy < 75) crackTime = 'A few centuries';
  else crackTime = 'Millions of years 🛡️';

  score = Math.min(100, Math.max(0, score));

  let label = 'Very Weak';
  let color = '#f43f5e';

  if (score >= 80) {
    label = 'Very Strong';
    color = '#10b981';
  } else if (score >= 60) {
    label = 'Strong';
    color = '#06b6d4';
  } else if (score >= 40) {
    label = 'Fair';
    color = '#f59e0b';
  } else if (score >= 20) {
    label = 'Weak';
    color = '#f97316';
  }

  return {
    score,
    label,
    color,
    crackTime,
    checks: {
      length: length >= 12,
      upper: hasUpper,
      lower: hasLower,
      number: hasNumber,
      special: hasSpecial
    },
    warnings
  };
}

function updatePasswordUI() {
  const input = document.getElementById('pwd-input');
  if (!input) return;

  const pwd = input.value;
  const res = analyzePassword(pwd);

  const fillBar = document.getElementById('pwd-strength-bar');
  const labelEl = document.getElementById('pwd-strength-label');
  const crackTimeEl = document.getElementById('pwd-crack-time');
  const warningsList = document.getElementById('pwd-warnings');

  if (fillBar) {
    fillBar.style.width = res.score + '%';
    fillBar.style.backgroundColor = res.color;
  }

  if (labelEl) {
    labelEl.innerText = res.label;
    labelEl.style.color = res.color;
  }

  if (crackTimeEl) {
    crackTimeEl.innerText = res.crackTime;
    crackTimeEl.style.color = res.color;
  }

  // Update requirement checkmarks
  updateCheckIcon('chk-length', res.checks.length);
  updateCheckIcon('chk-upper', res.checks.upper);
  updateCheckIcon('chk-lower', res.checks.lower);
  updateCheckIcon('chk-number', res.checks.number);
  updateCheckIcon('chk-special', res.checks.special);

  // Warnings
  if (warningsList) {
    if (res.warnings.length > 0) {
      warningsList.classList.remove('hidden');
      warningsList.innerHTML = res.warnings.map(w => `<li class="flex items-center gap-1.5 text-xs text-rose-400"><i class="fa-solid fa-triangle-exclamation"></i><span>${w}</span></li>`).join('');
    } else {
      warningsList.classList.add('hidden');
      warningsList.innerHTML = '';
    }
  }
}

function updateCheckIcon(id, isValid) {
  const el = document.getElementById(id);
  if (!el) return;
  if (isValid) {
    el.className = 'fa-solid fa-circle-check text-emerald-400';
  } else {
    el.className = 'fa-regular fa-circle text-slate-500';
  }
}

function generateSecurePassword() {
  const lengthInput = document.getElementById('gen-pwd-length');
  const len = lengthInput ? parseInt(lengthInput.value) || 16 : 16;

  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';

  // Ensure at least one of each character category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < len; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  const input = document.getElementById('pwd-input');
  if (input) {
    input.value = password;
    input.type = 'text'; // Show generated password
    const toggleIcon = document.getElementById('pwd-toggle-icon');
    if (toggleIcon) toggleIcon.className = 'fa-solid fa-eye-slash';
    updatePasswordUI();
    showToast('Secure password generated and analyzed! 🔐');
  }
}

function copyPasswordToClipboard() {
  const input = document.getElementById('pwd-input');
  if (!input || !input.value) {
    showToast('Please generate or enter a password first!', 'warning');
    return;
  }

  navigator.clipboard.writeText(input.value).then(() => {
    showToast('Password copied to clipboard! 📋');
  }).catch(() => {
    showToast('Failed to copy to clipboard', 'error');
  });
}

function togglePasswordVisibility() {
  const input = document.getElementById('pwd-input');
  const icon = document.getElementById('pwd-toggle-icon');
  if (!input || !icon) return;

  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}
