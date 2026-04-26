import React, { memo } from "react";

const GymItem = memo(({ gym, isFavorite, onToggleFavorite }) => {
  if (!gym) return null;
  const { id, name, address, imageUrl, isDiscount } = gym;

  // [수정] 헬스장, 덤벨 키워드에 최적화된 고정 랜덤 이미지
  // picsum 대신 더 정확한 운동 관련 소스를 사용합니다.
  const gymFallback = `https://loremflickr.com/300/300/gym,dumbbell,workout/all?lock=${id}`;

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

      <div
        style={{
          width: "100px",
          height: "90px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            objectFit: "cover",
            backgroundColor: "#f5f5f5",
          }}
          onError={(e) => {
            e.target.onerror = null;
            // 덤벨, 헬스장 전용 이미지로 강제 교체
            e.target.src = gymFallback;
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
