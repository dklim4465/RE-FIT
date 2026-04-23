import React, { memo } from "react";
const GymItem = memo(({ gym, onSelect }) => {
  if (!gym) return null;
  const { id, name, distance, price, rating } = gym;
  return (
    <div
      onClick={() => onSelect(id)}
      style={{
        padding: "20px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
      }}
    >
      <strong>{name}</strong>
      <p>
        
      </p>
    </div>
  );
});
export default GymItem;
