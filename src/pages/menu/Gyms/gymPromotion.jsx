export const DEFAULT_PROMOTION_ITEMS = [
  "지금 등록하면 PT 1회 무료",
  "첫 달 20% 할인",
  "상담 예약 시 운동복 증정",
];

export function normalizePhone(phoneNumber) {
  return phoneNumber.replace(/[^\d]/g, "");
}

export function formatPhoneNumber(phoneNumber) {
  const digits = normalizePhone(phoneNumber).slice(0, 11);

  if (digits.length < 4) {
    return digits;
  }

  if (digits.length < 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.length < 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function buildPromotionText(gym) {
  return {
    gymName: gym.name,
    badge: gym.discountLabel || "EVENT",
    title: `지금만 받을 수 있는 ${gym.name} 혜택!`,
    items: gym.promotionItems || DEFAULT_PROMOTION_ITEMS,
  };
}
