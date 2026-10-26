/**
 * Survey Analytics & Research Visualization Engine
 * Powered by Chart.js
 */

let radarChartInstance = null;
let riskDoughnutInstance = null;
let habitsBarChartInstance = null;

// Local storage key for persistent student submissions
const STORAGE_KEY_RESPONSES = 'cybershield_student_responses';

function getStoredResponses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESPONSES);
    if (!raw) return [...BENCHMARK_SURVEY_COHORT];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...BENCHMARK_SURVEY_COHORT];
  } catch (e) {
    console.error('Failed to parse stored survey responses:', e);
    return [...BENCHMARK_SURVEY_COHORT];
  }
}

function saveResponses(list) {
  try {
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(list));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

function addSurveyResponse(studentResult, demographic = {}) {
  const current = getStoredResponses();
  const newEntry = {
    id: 'S' + (current.length + 1),
    year: demographic.year || '2nd Year',
    branch: demographic.branch || 'Engineering / Sciences',
    score: studentResult.score,
    tier: studentResult.tier,
    p: studentResult.categoryScores.passwords,
    ph: studentResult.categoryScores.phishing,
    w: studentResult.categoryScores.wifi,
    d: studentResult.categoryScores.devices,
    pr: studentResult.categoryScores.privacy,
    inc: studentResult.categoryScores.incident,
    timestamp: new Date().toISOString()
  };

  current.push(newEntry);
  saveResponses(current);
  updateAnalyticsDashboard();
}

function resetToDefaultCohort() {
  saveResponses([...BENCHMARK_SURVEY_COHORT]);
  updateAnalyticsDashboard();
}

function addDemoBatch() {
  const current = getStoredResponses();
  const branches = ['Computer Science', 'Information Tech', 'Electronics', 'Mechanical', 'Civil', 'Commerce', 'Management'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  for (let i = 0; i < 20; i++) {
    const p = Math.floor(Math.random() * 60) + 40;
    const ph = Math.floor(Math.random() * 65) + 35;
    const w = Math.floor(Math.random() * 55) + 35;
    const d = Math.floor(Math.random() * 60) + 30;
    const pr = Math.floor(Math.random() * 65) + 35;
    const inc = Math.floor(Math.random() * 60) + 30;
    const avg = Math.round((p + ph + w + d + pr + inc) / 6);
    let tier = 'High Risk';
    if (avg >= 75) tier = 'Guardian';
    else if (avg >= 50) tier = 'Cautious';

    current.push({
      id: 'S' + (current.length + 1),
      year: years[Math.floor(Math.random() * years.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      score: avg,
      tier,
      p, ph, w, d, pr, inc,
      timestamp: new Date().toISOString()
    });
  }

  saveResponses(current);
  updateAnalyticsDashboard();
}

function updateAnalyticsDashboard() {
  const data = getStoredResponses();

  // Metrics computation
  const totalCount = data.length;
  const avgScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / totalCount);

  let guardianCount = 0;
  let cautiousCount = 0;
  let highRiskCount = 0;

  let totalP = 0, totalPh = 0, totalW = 0, totalD = 0, totalPr = 0, totalInc = 0;

  data.forEach(item => {
    if (item.tier === 'Guardian') guardianCount++;
    else if (item.tier === 'Cautious') cautiousCount++;
    else highRiskCount++;

    totalP += item.p;
    totalPh += item.ph;
    totalW += item.w;
    totalD += item.d;
    totalPr += item.pr;
    totalInc += item.inc;
  });

  const avgP = Math.round(totalP / totalCount);
  const avgPh = Math.round(totalPh / totalCount);
  const avgW = Math.round(totalW / totalCount);
  const avgD = Math.round(totalD / totalCount);
  const avgPr = Math.round(totalPr / totalCount);
  const avgInc = Math.round(totalInc / totalCount);

  // Update DOM metric cards
  const elTotal = document.getElementById('stat-total-surveys');
  const elAvg = document.getElementById('stat-avg-score');
  const elVulnerable = document.getElementById('stat-top-vulnerability');
  const elGuardianPct = document.getElementById('stat-guardian-pct');

  if (elTotal) elTotal.innerText = totalCount;
  if (elAvg) elAvg.innerText = avgScore + '%';
  if (elGuardianPct) elGuardianPct.innerText = Math.round((guardianCount / totalCount) * 100) + '%';

  // Find lowest domain
  const domains = [
    { name: 'Public Wi-Fi Hygiene', val: avgW },
    { name: 'Software Piracy / Downloads', val: avgD },
    { name: 'Phishing Awareness', val: avgPh },
    { name: 'Password Security', val: avgP },
    { name: 'Social Media Privacy', val: avgPr },
    { name: 'Incident Readiness', val: avgInc }
  ];
  domains.sort((a, b) => a.val - b.val);
  if (elVulnerable) {
    elVulnerable.innerText = `${domains[0].name} (${domains[0].val}%)`;
  }

  // Render Charts
  renderRadarChart([avgP, avgPh, avgW, avgD, avgPr, avgInc]);
  renderRiskDoughnut(guardianCount, cautiousCount, highRiskCount);
  renderHabitsBarChart(data);
}

function renderRadarChart(averages) {
  const canvas = document.getElementById('chart-radar-domains');
  if (!canvas || typeof Chart === 'undefined') return;

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

  radarChartInstance = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['Password & 2FA', 'Phishing Awareness', 'Public Wi-Fi Safety', 'Device & OS Patching', 'Social Media Privacy', 'Incident & Backup'],
      datasets: [{
        label: 'Average Campus Awareness Score (%)',
        data: averages,
        backgroundColor: 'rgba(6, 182, 212, 0.25)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#06b6d4'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: {
            color: textColor,
            font: { size: 11, family: "'Inter', sans-serif", weight: '500' }
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            backdropColor: 'transparent',
            color: textColor,
            stepSize: 20
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderRiskDoughnut(guardians, cautious, highRisk) {
  const canvas = document.getElementById('chart-risk-doughnut');
  if (!canvas || typeof Chart === 'undefined') return;

  if (riskDoughnutInstance) {
    riskDoughnutInstance.destroy();
  }

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#0f172a' : '#f8fafc';

  riskDoughnutInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Cyber Guardian (Low Risk)', 'Cautious Surfer (Medium)', 'Vulnerable Student (High)'],
      datasets: [{
        data: [guardians, cautious, highRisk],
        backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
        borderWidth: 2,
        borderColor: isLight ? '#ffffff' : '#0f172a'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 12 },
            padding: 16,
            usePointStyle: true
          }
        }
      },
      cutout: '68%'
    }
  });
}

function renderHabitsBarChart(cohort) {
  const canvas = document.getElementById('chart-habits-bar');
  if (!canvas || typeof Chart === 'undefined') return;

  if (habitsBarChartInstance) {
    habitsBarChartInstance.destroy();
  }

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';

  // Calculate year breakdown
  const yearStats = {
    '1st Year': { total: 0, scoreSum: 0 },
    '2nd Year': { total: 0, scoreSum: 0 },
    '3rd Year': { total: 0, scoreSum: 0 },
    '4th Year': { total: 0, scoreSum: 0 }
  };

  cohort.forEach(item => {
    if (yearStats[item.year]) {
      yearStats[item.year].total++;
      yearStats[item.year].scoreSum += item.score;
    }
  });

  const labels = Object.keys(yearStats);
  const dataAverages = labels.map(k => yearStats[k].total > 0 ? Math.round(yearStats[k].scoreSum / yearStats[k].total) : 60);

  habitsBarChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Average Cyber Hygiene Score (%)',
        data: dataAverages,
        backgroundColor: [
          'rgba(244, 63, 94, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(6, 182, 212, 0.75)',
          'rgba(16, 185, 129, 0.75)'
        ],
        borderColor: ['#f43f5e', '#f59e0b', '#06b6d4', '#10b981'],
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif" } }
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: gridColor },
          ticks: { color: textColor, stepSize: 20 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Export dataset to CSV for research project documentation
function exportSurveyDataCSV() {
  const data = getStoredResponses();
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = ['Respondent ID', 'Academic Year', 'Branch/Major', 'Overall Score', 'Risk Tier', 'Password Score', 'Phishing Score', 'WiFi Score', 'Device Score', 'Privacy Score', 'Incident Score', 'Timestamp'];
  const rows = data.map(d => [
    d.id,
    `"${d.year}"`,
    `"${d.branch}"`,
    d.score,
    `"${d.tier}"`,
    d.p,
    d.ph,
    d.w,
    d.d,
    d.pr,
    d.inc,
    `"${d.timestamp || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `cybersecurity_student_survey_dataset_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
