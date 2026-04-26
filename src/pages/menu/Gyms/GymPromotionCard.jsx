import React from "react";

// div 태그가 나오는 이곳은 광고용 컴포넌트
export default function GymPromotionCard({ promotion, onInquiryClick }) {
  return (
    <aside
      className="gym-detail-promo"
      aria-label={`${promotion.gymName} 이벤트 광고`}
    >
      <div className="gym-detail-promo__eyebrow">
        <span className="gym-detail-promo__partner">광고</span>
      </div>

      <h3 className="gym-detail-promo__title">{promotion.title}</h3>

      <ul className="gym-detail-promo__list">
        {promotion.items.map((item) => (
          <li key={item} className="gym-detail-promo__item">
            {item}
          </li>
        ))}
      </ul>

      <div className="gym-detail-promo__actions">
        <button
          type="button"
          className="gym-detail-promo__cta"
          onClick={onInquiryClick}
        >
          혜택 문의하기
        </button>
        <span className="gym-detail-promo__meta">
          혜택은 내부 운영 정책에 따라 달라질 수 있습니다.
        </span>
      </div>
    </aside>
  );
}
