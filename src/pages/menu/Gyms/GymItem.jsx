import React, { memo } from "react";

const GymItem = memo(({ gym, onSelect }) => {
  if (!gym) return null;
  const { id, name, address } = gym;

  // 이미지가 없을 때 보여줄 기본 로고 이미지
  const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.charAt(0))}&background=7c5dfa&color=fff&size=128&bold=true`;
  const thumbnailSrc = gym.imageUrl || defaultImage;

  return (
    <div
      onClick={() => onSelect?.(id)}
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
      {/* 1. 왼쪽: 텍스트 정보 (제목 & 주소) */}
      <div style={{ flex: 1, textAlign: "left" }}>
        <strong
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#2f2a26",
            display: "block",
            marginBottom: "10px",
          }}
        >
          {name}
        </strong>
        <p
          style={{
            margin: 0,
            color: "#7a746d",
            fontSize: "14px",
            lineHeight: "1.4",
          }}
        >
          📍 {address}
        </p>
      </div>

      {/* 2. 오른쪽: 이미지 영역 (할인 스티커 포함) */}
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

        {/* 할인 스티커: 이미지 우측 상단에 겹치기 */}
        {gym.isDiscount && (
          <div
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "linear-gradient(135deg, #ff4d4d 0%, #d32f2f 100%)",
              color: "#fff",
              padding: "5px 8px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: "900",
              boxShadow: "0 4px 8px rgba(211, 47, 47, 0.4)",
              zIndex: 1,
              border: "2px solid #fff",
            }}
          >
            EVENT !
          </div>
        )}
      </div>
    </div>
  );
});

export default GymItem;
