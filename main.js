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
const analysisResult = document.getElementById('analysisResult');
const resultText = document.getElementById('resultText');

// --- 테마 관리 ---
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

// --- 파일 업로드 관리 ---
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

['dragleave', 'drop'].forEach(event => {
  dropZone.addEventListener(event, () => dropZone.classList.remove('drag-over'));
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (files.length) handleFiles(files[0]);
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

// --- 분석 시뮬레이션 ---
analyzeBtn.addEventListener('click', () => {
  analyzeBtn.disabled = true;
  resultSection.style.display = 'block';
  loader.style.display = 'block';
  analysisResult.style.display = 'none';

  // 실제 분석 대신 시뮬레이션 (2초 대기)
  setTimeout(() => {
    loader.style.display = 'none';
    analysisResult.style.display = 'block';
    
    const responses = [
      "이미지에서 3개의 잠재적인 UI 버그가 발견되었습니다. 버튼 대조비가 낮습니다.",
      "코드 구조적 결함은 발견되지 않았습니다. 디자인 가이드라인을 잘 준수하고 있습니다.",
      "로딩 속도에 영향을 줄 수 있는 고용량 이미지가 감지되었습니다. 압축을 권장합니다.",
      "모바일 화면에서 텍스트 겹침 현상이 발생할 가능성이 있습니다."
    ];
    resultText.textContent = responses[Math.floor(Math.random() * responses.length)];
    analyzeBtn.disabled = false;
  }, 2000);
});
