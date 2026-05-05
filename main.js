// CLEANEXPRESS (크렉스) 인터랙션 스크립트
document.addEventListener('DOMContentLoaded', () => {
  console.log('CLEANEXPRESS 사이트가 로드되었습니다.');

  // 헤더 스크롤 효과
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '10px 0';
      header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.padding = '15px 0';
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
  });

  // 전화 연결 확인용 로그 (실제 동작은 <a> 태그의 tel: 프로토콜이 담당)
  const callButtons = document.querySelectorAll('a[href^="tel:"]');
  callButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      console.log('대표번호 1577-7648 연결 시도 중...');
    });
  });
});
