import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGymFavorites } from "../../../hooks/gyms/useGymFavorites";

const GymDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoriteGymIds, toggleFavorite } = useGymFavorites();
  const gymFromState = location.state?.gym;
  const gym =
    gymFromState && String(gymFromState.id) === String(id)
      ? gymFromState
      : null;
  const isFavorite = favoriteGymIds.includes(gym?.id);

  if (!gym) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h3>정보를 찾을 수 없습니다.</h3>
        <p style={{ color: "#666" }}>
          목록에서 다시 선택하면 상세 정보를 열 수 있습니다.
        </p>
        <button onClick={() => navigate("/gyms")}>목록으로 돌아가기</button>
      </div>
    );
  }

  // 주소에서 구 정보만 뽑아서 "00구 + 상호명" 형태로 검색합니다.
  const getNaverSearchUrl = (name, addr) => {
    const addressTokens = (addr || "").trim().split(/\s+/);
    const district = addressTokens.find((token) => token.endsWith("구")) || "";
    const query = [district, name].filter(Boolean).join(" ");

    return `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
  };

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
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <h2 style={{ marginLeft: "10px", marginY: 0 }}>헬스장 상세정보</h2>
      </div>

      {/* 정보 카드 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "15px",
          padding: "25px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>{gym.name}</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>📍 {gym.address}</p>
        <button
          type="button"
          onClick={() => toggleFavorite(gym.id)}
          style={{
            border: "none",
            background: isFavorite ? "#ffe3e3" : "#f5f5f5",
            color: isFavorite ? "#e03131" : "#777",
            borderRadius: "999px",
            padding: "10px 14px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          {isFavorite ? "♥ 찜한 헬스장" : "♡ 찜하기"}
        </button>

        <div
          style={{
            display: "flex",
            gap: "15px",
            fontSize: "14px",
            color: "#444",
            marginBottom: "30px",
          }}
        >
          <span>📏 {gym.distance}km</span>
          <span>⭐️ {gym.rating || "4.5"}</span>
        </div>

        {/* 안내 문구 및 네이버 버튼 */}
        <div
          style={{
            backgroundColor: "#f1f3f5",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "15px",
              lineHeight: "1.5",
            }}
          >
            현재 업체에서 제공하는 <br />
            <strong>시설, 전화번호, 이벤트</strong>는
            <br />
            네이버에서 정확하게 확인 가능합니다.
          </p>

          <a
            href={getNaverSearchUrl(gym.name, gym.address)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              backgroundColor: "#03C75A",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            N 네이버 정보 보기
          </a>
        </div>
      </div>

      <button
        onClick={() => navigate("/gyms")}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "white",
          cursor: "pointer",
        }}
      >
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default GymDetail;
