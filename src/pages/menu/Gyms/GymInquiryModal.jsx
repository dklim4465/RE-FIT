import React from "react";

export default function GymInquiryModal({
  gymName,
  promotion,
  userName,
  phoneNumber,
  phoneError,
  isSubmitted,
  onClose,
  onReset,
  onPhoneChange,
  onSubmit,
}) {
  const handlePanelKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (isSubmitted && event.key === "Enter") {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="gym-inquiry-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gym-inquiry-title"
    >
      <div className="gym-inquiry-modal__backdrop" onClick={onClose} />

      <div
        className="gym-inquiry-modal__panel"
        onKeyDown={handlePanelKeyDown}
      >
        <button
          type="button"
          className="gym-inquiry-modal__close"
          onClick={onClose}
          aria-label="문의 창 닫기"
        >
          닫기
        </button>

        {isSubmitted ? (
          <div className="gym-inquiry-modal__success">
            <p className="gym-inquiry-modal__eyebrow">Inquiry Complete</p>
            <h3 id="gym-inquiry-title" className="gym-inquiry-modal__title">
              혜택 문의가 접수되었어요
            </h3>
            <p className="gym-inquiry-modal__copy">
              {userName}님 번호로 {gymName} 상담이 이어질 수 있도록 전달
              준비를 마쳤습니다.
            </p>
            <div className="gym-inquiry-modal__summary">
              <span>이름 {userName}</span>
              <span>전화번호 {phoneNumber}</span>
            </div>
            <div className="gym-inquiry-modal__actions">
              <button
                type="button"
                className="gym-inquiry-modal__secondary"
                onClick={onReset}
              >
                전화번호 다시 입력
              </button>
              <button
                type="button"
                className="gym-inquiry-modal__submit"
                onClick={onClose}
                autoFocus
              >
                확인
              </button>
            </div>
          </div>
        ) : (
          <form className="gym-inquiry-modal__form" onSubmit={onSubmit}>
            <p className="gym-inquiry-modal__eyebrow">Event Inquiry</p>
            <h3 id="gym-inquiry-title" className="gym-inquiry-modal__title">
              {promotion.title}
            </h3>
            <p className="gym-inquiry-modal__copy">
              저장된 이름은 자동으로 입력되고, 연락받을 전화번호만 남겨주시면
              됩니다.
            </p>

            <div className="gym-inquiry-modal__benefits">
              {promotion.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="gym-inquiry-modal__field">
              <label htmlFor="gym-inquiry-name">이름</label>
              <input id="gym-inquiry-name" type="text" value={userName} readOnly />
            </div>

            <div className="gym-inquiry-modal__field">
              <label htmlFor="gym-inquiry-phone">전화번호</label>
              <input
                id="gym-inquiry-phone"
                type="tel"
                inputMode="numeric"
                placeholder="전화번호를 입력해주세요"
                value={phoneNumber}
                onChange={onPhoneChange}
                autoFocus
              />
            </div>

            {phoneError && <p className="gym-inquiry-modal__error">{phoneError}</p>}

            <p className="gym-inquiry-modal__hint">
              입력한 번호는 혜택 상담 연락용으로만 사용됩니다.
            </p>

            <button type="submit" className="gym-inquiry-modal__submit">
              문의 접수하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
