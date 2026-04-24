export const mockAds = [
  {
    id: "protein-snack",
    variant: "banner",
    sponsor: "FitFuel",
    title: "운동 후 단백질 스낵 2주 체험",
    description:
      "헬스장 방문 고객 전용 샘플팩을 가정한 더미 광고입니다. 배너 높이와 CTA 위치를 확인해 보세요.",
    ctaLabel: "샘플 보기",
  },
  {
    id: "pt-trial",
    variant: "banner",
    sponsor: "Body Note Studio",
    title: "1:1 PT 첫 상담 무료",
    description:
      "상세 설명이 두 줄 이상일 때 광고 카드가 어떻게 늘어나는지 테스트하기 좋은 문구 길이입니다.",
    ctaLabel: "상담 예약",
  },
  {
    id: "meal-plan",
    variant: "inline",
    sponsor: "Green Bowl",
    title: "식단 도시락 첫 주문 할인",
    description: "인라인 광고 슬롯에 넣기 쉬운 짧은 더미 데이터입니다.",
    ctaLabel: "할인 받기",
  },
  {
    id: "home-gym",
    variant: "square",
    sponsor: "HomeGym Market",
    title: "덤벨 세트 봄맞이 특가",
    description:
      "정사각형 또는 사이드 광고 영역에서 정보량과 간격을 확인하기 위한 목업 카드입니다.",
    ctaLabel: "상품 보기",
  },
  {
    id: "recovery-app",
    variant: "banner",
    sponsor: "Recovery+",
    title: "스트레칭 루틴 앱 7일 무료",
    description:
      "서비스 하단 공통 광고 슬롯에 연결해 보기 좋은 기본형 더미 광고입니다.",
    ctaLabel: "무료 체험",
  },
];

export function getRandomMockAd(previousAdId = null) {
  if (mockAds.length === 0) {
    return null;
  }

  if (mockAds.length === 1) {
    return mockAds[0];
  }

  const candidates = previousAdId
    ? mockAds.filter((ad) => ad.id !== previousAdId)
    : mockAds;
  const randomIndex = Math.floor(Math.random() * candidates.length);

  return candidates[randomIndex];
}
