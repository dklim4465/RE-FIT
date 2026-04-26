import React, { memo } from "react";

const GymItem = memo(({ gym, isFavorite, onToggleFavorite }) => {
  if (!gym) return null;
  const { id, name, address, imageUrl, isDiscount } = gym;

  // 1. 실제 사진 데이터가 없을 때 보여줄 기본 헬스장 이미지 (글씨 로고 대체)
  const defaultImage =
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop";
  const thumbnailSrc = imageUrl || defaultImage;

  return (
    <div
      style={{
        padding: "20px",
        borderBottom: "1px solid #f1f1f1",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* 왼쪽: 텍스트 정보 */}
      <div style={{ flex: 1, textAlign: "left" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <strong
            style={{ fontSize: "18px", fontWeight: "700", color: "#2f2a26" }}
          >
            {name}
          </strong>
          {/* 리스트 내 찜 버튼 (클릭 시 상세페이지 이동 방지 처리) */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(gym);
            }}
            style={{ cursor: "pointer", fontSize: "18px" }}
          >
            {isFavorite ? "❤️" : "🤍"}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            color: "#7a746d",
            fontSize: "13px",
            lineHeight: "1.4",
          }}
        >
          📍 {address}
        </p>
        <div
          style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#7c5dfa",
            fontWeight: "600",
          }}
        >
          ⭐ {gym.rating || "4.5"} · 📏 {gym.distance}km
        </div>
      </div>

      {/* 오른쪽: 이미지 및 할인 배지 */}
      <div
        style={{
          width: "100px",
          height: "90px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <img
          src={thumbnailSrc}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            objectFit: "cover",
            backgroundColor: "#f5f5f5",
            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
          }}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        {isDiscount && <div style={badgeStyle}>EVENT !</div>}
      </div>
    </div>
  );
});

const badgeStyle = {
  position: "absolute",
  top: "-5px",
  right: "-5px",
  background: "linear-gradient(135deg, #ff4d4d 0%, #d32f2f 100%)",
  color: "#fff",
  padding: "4px 7px",
  borderRadius: "8px",
  fontSize: "10px",
  fontWeight: "900",
  boxShadow: "0 4px 8px rgba(211, 47, 47, 0.4)",
  zIndex: 1,
  border: "2px solid #fff",
};

export default GymItem;
