import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGymFavorites } from "../../../hooks/gyms/useGymFavorites";

const GymDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoriteGymIds, toggleFavorite } = useGymFavorites();

  const gym = location.state?.gym;
  const isFavorite = favoriteGymIds.includes(gym?.id);

  if (!gym)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        정보 로딩 중...
      </div>
    );

  const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(gym.name)}&background=7c5dfa&color=fff`;
  const mainImageSrc = gym.imageUrl || defaultImage;

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      {/* 상단 헤더 */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "none",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <h2 style={{ marginLeft: "10px", fontSize: "18px" }}>돌아가기</h2>
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
          backgroundColor: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "800",
            marginBottom: "10px",
            textAlign: "left",
          }}
        >
          {gym.name}
        </h1>
        <p
          style={{
            color: "#7a746d",
            fontSize: "15px",
            marginBottom: "25px",
            textAlign: "left",
          }}
        >
          📍 {gym.address}
        </p>

        {/* 찜하기 및 거리 */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
          <button
            onClick={() => toggleFavorite(gym.id)}
            style={{
              flex: 2,
              border: "none",
              borderRadius: "12px",
              padding: "12px",
              fontWeight: "700",
              cursor: "pointer",
              background: isFavorite ? "#ffe3e3" : "#f5f5f5",
              color: isFavorite ? "#e03131" : "#777",
            }}
          >
            {isFavorite ? "❤️ 찜!" : "🤍 찜하기"}
          </button>
          <div
            style={{
              flex: 1,
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              color: "#555",
              fontWeight: "600",
            }}
          >
            📏 {gym.distance}km
          </div>
        </div>

        <hr
          style={{
            border: "0",
            borderTop: "1px solid #f1f1f1",
            marginBottom: "25px",
          }}
        />

        {/* [수정] 상세 정보 (전화번호, 영업시간) 표시 */}
        <div
          style={{
            textAlign: "left",
            marginBottom: "25px",
            borderLeft: "4px solid #7c5dfa",
            paddingLeft: "15px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <span
              style={{ fontWeight: "700", color: "#333", fontSize: "14px" }}
            >
              📞 문의하기
            </span>
            <div style={{ color: "#666", fontSize: "16px", marginTop: "4px" }}>
              {gym.phone}
            </div>
          </div>
          <div>
            <span
              style={{ fontWeight: "700", color: "#333", fontSize: "14px" }}
            >
              ⏰ 이용시간
            </span>
            <div style={{ color: "#666", fontSize: "16px", marginTop: "4px" }}>
              {gym.openingHours}
            </div>
          </div>
        </div>

        {/* 시설 안내 */}
        <div style={{ textAlign: "left", marginBottom: "25px" }}>
          <h4
            style={{
              fontSize: "17px",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            시설 안내
          </h4>
          <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.7" }}>
            {gym.description}
          </p>
        </div>

        {/* 이미지 하단 배치 (덤벨/달리기/필라테스 중 하나) */}
        <div
          style={{
            width: "100%",
            height: "250px",
            borderRadius: "15px",
            overflow: "hidden",
            backgroundColor: "#f0f0f0",
          }}
        >
          <img
            src={mainImageSrc}
            alt="Gym Facility"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate("/gyms")}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          background: "#fff",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default GymDetail;
