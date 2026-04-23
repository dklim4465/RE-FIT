import React, { memo } from "react";
const GymItem = memo(({ gym, onSelect }) => {
  if (!gym) return null;
  const { id, name, address, category } = gym;

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
          gap: "8px",
          marginBottom: "8px",
          flexWrap: "wrap",
        }}
      >
        <strong>{name}</strong>
        {gym.isDiscount ? (
          <span
            style={{
              display: "inline-block",
              padding: "4px 8px",
              backgroundColor: "#ffe066",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",
              color: "#6b4f00",
            }}
          >
            오늘의 할인!
          </span>
        ) : null}
      </div>
      <p style={{ margin: "0 0 6px", color: "#555" }}>{address}</p>
      {category ? <p style={{ margin: 0, color: "#777" }}>{category}</p> : null}
    </div>
  );
});
export default GymItem;
