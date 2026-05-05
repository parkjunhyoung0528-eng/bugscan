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
const resultText = document.getElementById('resultText');

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
    alert('이미지 파일(JPG, PNG, WEBP)만 업로드 가능합니다.');
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

// 정밀 분석 시뮬레이션
analyzeBtn.addEventListener('click', () => {
  analyzeBtn.disabled = true;
  resultSection.style.display = 'block';
  loader.style.display = 'block';
  analysisResult.style.display = 'none';
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    
    progressBar.style.width = progress + '%';
    
    if (progress < 30) statusMsg.textContent = '이미지 픽셀 데이터 로드 중...';
    else if (progress < 60) statusMsg.textContent = '패턴 분석 및 버그 대조 중...';
    else if (progress < 90) statusMsg.textContent = '최종 분석 리포트 생성 중...';
    else statusMsg.textContent = '완료되었습니다!';

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(showResult, 500);
    }
  }, 200);
});

function showResult() {
  loader.style.display = 'none';
  analysisResult.style.display = 'block';
  
  const results = [
    "✅ 분석 결과: 훌륭합니다! 이미지에서 눈에 띄는 디자인 결함이나 버그가 발견되지 않았습니다. 현재 가이드라인을 잘 따르고 있습니다.",
    "⚠️ 분석 결과: 일부 영역에서 색상 대비(Contrast)가 낮아 가독성이 떨어질 수 있습니다. 텍스트 색상을 조금 더 어둡게 조정하는 것을 추천합니다.",
    "🚀 분석 결과: 이미지가 웹 최적화 기준보다 큽니다. 로딩 속도를 위해 WebP 형식으로 변환하거나 용량을 압축할 필요가 있습니다.",
    "🔍 분석 결과: 레이아웃의 좌우 여백이 불균형합니다. 중앙 정렬을 재검토해보시기 바랍니다."
  ];
  resultText.textContent = results[Math.floor(Math.random() * results.length)];
}
