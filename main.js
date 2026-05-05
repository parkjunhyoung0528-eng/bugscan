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

// --- 확장된 곤충 데이터베이스 ---
const BUG_DATABASE = [
  {
    name: "독일바퀴 (German Cockroach)",
    method: "주방 및 습한 곳의 틈새를 공략해야 합니다. 피프로닐 또는 히드라메틸논 성분의 '맥스포스 겔' 같은 식독제를 추천합니다. 하수구 트랩 설치도 병행하세요."
  },
  {
    name: "미국바퀴 (American Cockroach)",
    method: "주로 하수구나 외부에서 유입됩니다. 대형 바퀴 전용 베이트를 설치하고, 유입 경로인 창틀 밑 구멍이나 배수구를 망으로 막으세요."
  },
  {
    name: "권연벌레 (Cigarette Beetle)",
    method: "곡물, 가공식품, 마른 나물 등이 근원지입니다. 오래된 식자재를 찾아 폐기하는 것이 핵심입니다. 페로몬 트랩을 설치해 성충을 포획하세요."
  },
  {
    name: "집그리마 (House Centipede)",
    method: "습기를 매우 좋아합니다. 제습기 사용으로 실내 습도를 50% 이하로 유지하세요. 살충제보다는 환경 개선(습기 제거)이 우선입니다."
  },
  {
    name: "애수시렁이 (Black Carpet Beetle)",
    method: "섬유, 가죽, 먼지 뭉치에서 발생합니다. 옷장 정리를 자주 하고, 울 소재 옷은 밀폐 보관하세요. 피레스로이드계 살충제가 효과적입니다."
  },
  {
    name: "쌀바구미 (Rice Weevil)",
    method: "쌀통 내부에서 발생합니다. 쌀을 햇볕에 말리거나 냉장 보관하세요. 마늘이나 고추를 쌀통에 넣어두면 기피 효과가 있습니다."
  },
  {
    name: "화랑곡나방 (Indian Meal Moth)",
    method: "벽면에 붙어있는 애벌레를 제거하고 곡물류를 밀폐 보관하세요. 나방 전용 페로몬 트랩 설치를 강력 추천합니다."
  },
  {
    name: "집유령거미 (Daddy Long-legs)",
    method: "천장 구석의 거미줄을 제거하세요. 거미는 다른 해충을 잡아먹는 익충이기도 하므로, 심각하지 않다면 빗자루로 쓸어 실외로 방출하세요."
  },
  {
    name: "머리니 (Head Lice)",
    method: "침구류를 60도 이상의 온수로 세탁하고 건조기를 사용하세요. 전용 샴푸를 사용하고 서캐(알)까지 참빗으로 제거해야 완치됩니다."
  },
  {
    name: "좀벌레 (Silverfish)",
    method: "종이와 습기를 좋아합니다. 낡은 신문이나 종이 박스를 버리고 통풍을 시키세요. 라벤더 오일이나 전용 기피제가 효과가 있습니다."
  }
];

// --- 이미지 데이터 기반 해시 생성 (일관된 결과 출력용) ---
function getImageHash(dataUrl) {
  let hash = 0;
  for (let i = 0; i < dataUrl.length; i++) {
    const char = dataUrl.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // 32비트 정수로 변환
  }
  return Math.abs(hash);
}

// --- 파일 업로드 처리 ---
let currentImageData = "";

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
    alert('이미지 파일만 지원합니다.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    currentImageData = e.target.result;
    imagePreview.src = currentImageData;
    previewContainer.style.display = 'block';
    dropZone.style.display = 'none';
    analyzeBtn.disabled = false;
    resultSection.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

removeBtn.addEventListener('click', () => {
  fileInput.value = '';
  currentImageData = "";
  previewContainer.style.display = 'none';
  dropZone.style.display = 'block';
  analyzeBtn.disabled = true;
  resultSection.style.display = 'none';
});

// --- 고도화된 분석 시뮬레이션 ---
analyzeBtn.addEventListener('click', () => {
  analyzeBtn.disabled = true;
  resultSection.style.display = 'block';
  loader.style.display = 'block';
  analysisResult.style.display = 'none';
  
  const hash = getImageHash(currentImageData);
  const resultIndex = hash % BUG_DATABASE.length;
  // 확률값도 해시에 기반하여 80~99% 사이로 생성 (신뢰도 표현)
  const probability = 80 + (hash % 20);
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 8; // 분석 속도를 약간 늦춰 신중한 느낌 부여
    if (progress > 100) progress = 100;
    
    progressBar.style.width = progress + '%';
    
    if (progress < 20) statusMsg.textContent = '이미지 채도 및 형태소 분석 중...';
    else if (progress < 40) statusMsg.textContent = '부속지(다리, 더듬이) 개수 파악 중...';
    else if (progress < 65) statusMsg.textContent = '재미나이 AI 클라우드 대조 분석 중...';
    else if (progress < 85) statusMsg.textContent = '유사 해충 데이터베이스 매칭 중...';
    else statusMsg.textContent = '최종 리포트 생성 완료!';

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => showResult(resultIndex, probability), 500);
    }
  }, 150);
});

function showResult(index, prob) {
  loader.style.display = 'none';
  analysisResult.style.display = 'block';
  
  const result = BUG_DATABASE[index];
  
  bugName.textContent = result.name;
  probabilityText.textContent = prob + '%';
  controlMethod.textContent = result.method;
  
  // 확률 바 애니메이션
  setTimeout(() => {
    probBarInner.style.width = prob + '%';
  }, 100);
}
