import React, { memo } from "react";
const GymItem = memo(({ gym, onSelect }) => {
  if (!gym) return null;
  const { id, name, address } = gym;

  return (
    <div
      onClick={() => onSelect?.(id)}
      style={{
        padding: "20px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "10px",
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        <strong
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#2f2a26",
          }}
        >
          {name}
        </strong>
        {gym.isDiscount ? (
          <span
            style={{
              display: "inline-block",
              padding: "9px 15px",
              /* 레드 그라데이션 적용 */
              background: "linear-gradient(180deg, #ff4d4d 0%, #d32f2f 100%)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "800", // 폰트 두께를  높여 눈에 확 띄게 함
              borderRadius: "999px",
              /* 2. 그림자 색상을 레드 계열로 변경하여 발광 효과(Glow) 부여 */
              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.4)",
              /* 3. 텍스트가 더 선명해 보이도록 약간의 그림자 추가 */
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            <span style={{ color: "#ffd700", marginRight: "4px" }}>⚡</span>{" "}
            오늘의 할인 ⚡
          </span>
        ) : null}
      </div>
      <p
        style={{
          margin: "0 0 5px",
          color: "#7a746d",
          fontSize: "15px",
          lineHeight: "1.5",
          textAlign: "center",
        }}
      >
        📍 {address}
      </p>
    </div>
  );
});
export default GymItem;
