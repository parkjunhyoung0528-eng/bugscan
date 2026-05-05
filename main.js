const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const html = document.documentElement;

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeBtn = document.getElementById('removeBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');
const progressBar = document.getElementById('progressBar');
const statusMsg = document.getElementById('statusMsg');
const analysisResult = document.getElementById('analysisResult');

const bugName = document.getElementById('bugName');
const probabilityText = document.getElementById('probabilityText');
const probBarInner = document.getElementById('probBarInner');
const controlMethod = document.getElementById('controlMethod');

// 테마 관리
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeText.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
}

// 파일 업로드
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = 'var(--primary-color)';
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = 'var(--border-color)';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = 'var(--border-color)';
  if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) handleFiles(e.target.files[0]);
});

function handleFiles(file) {
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    previewContainer.style.display = 'block';
    dropZone.style.display = 'none';
    analyzeBtn.disabled = false;
    resultSection.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

removeBtn.addEventListener('click', () => {
  fileInput.value = '';
  previewContainer.style.display = 'none';
  dropZone.style.display = 'block';
  analyzeBtn.disabled = true;
  resultSection.style.display = 'none';
});

// AI 벌레 분석 시뮬레이션
analyzeBtn.addEventListener('click', () => {
  analyzeBtn.disabled = true;
  resultSection.style.display = 'block';
  loader.style.display = 'block';
  analysisResult.style.display = 'none';
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12;
    if (progress > 100) progress = 100;
    
    progressBar.style.width = progress + '%';
    
    if (progress < 25) statusMsg.textContent = '이미지 특징점을 추출하고 있습니다...';
    else if (progress < 50) statusMsg.textContent = '재미나이 AI가 곤충 데이터베이스와 대조 중...';
    else if (progress < 75) statusMsg.textContent = '방제 가이드 및 추천 약제를 검색 중...';
    else statusMsg.textContent = '분석이 완료되었습니다!';

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(showResult, 600);
    }
  }, 250);
});

function showResult() {
  loader.style.display = 'none';
  analysisResult.style.display = 'block';
  
  // 가상의 데이터베이스 (Gemini 분석 결과 시뮬레이션)
  const bugs = [
    {
      name: "독일바퀴 (German Cockroach)",
      prob: 94,
      method: "주방이나 습한 곳에 주로 서식합니다. 식독제(베이트 건)를 설치하고 갈라진 틈새를 실리콘으로 메우세요. 피프로닐 성분의 약제를 추천합니다."
    },
    {
      name: "집그리마 (House Centipede)",
      prob: 88,
      method: "해충을 잡아먹는 익충이지만 혐오감을 줄 수 있습니다. 습기 제거가 가장 중요하며, 창틀이나 배수구에 잔류 분무용 살충제를 뿌려두세요."
    },
    {
      name: "권연벌레 (Cigarette Beetle)",
      prob: 91,
      method: "오래된 곡물이나 말린 나물에서 발생합니다. 발생 근원지를 찾아 폐기하는 것이 우선이며, 페로몬 트랩을 설치하여 성충을 포획하세요."
    },
    {
      name: "애수시렁이 (Black Carpet Beetle)",
      prob: 82,
      method: "옷장이나 섬유류에 피해를 줍니다. 옷장을 정리하고 나프탈렌 등 방충제를 비치하세요. 심할 경우 델타메트린 성분의 살충제를 사용하세요."
    }
  ];
  
  const result = bugs[Math.floor(Math.random() * bugs.length)];
  
  bugName.textContent = result.name;
  probabilityText.textContent = result.prob + '%';
  controlMethod.textContent = result.method;
  
  // 확률 바 애니메이션
  setTimeout(() => {
    probBarInner.style.width = result.prob + '%';
  }, 100);
}
