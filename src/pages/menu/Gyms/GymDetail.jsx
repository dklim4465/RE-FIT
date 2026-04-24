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

  // ---------------------------------------------------------
  // ✅ [추가] 찜 목록 페이지(필터 활성화 상태)로 이동하는 함수
  // ---------------------------------------------------------
  const goToFavoriteList = () => {
    // 이동할 때 state를 넘겨주어 리스트 페이지에서 '찜만 보기'를 바로 켜게 할 수 있습니다.
    navigate("/gyms", { state: { showFavorites: true } });
  };
  // ---------------------------------------------------------

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

        {/* ✅ [수정] 찜하기 버튼 및 '목록보기' 버튼 레이아웃 추가 */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => toggleFavorite(gym.id)}
            style={{
              flex: 2, // 찜하기 버튼을 조금 더 넓게
              border: "none",
              background: isFavorite ? "#ffe3e3" : "#f5f5f5",
              color: isFavorite ? "#e03131" : "#777",
              borderRadius: "999px",
              padding: "12px 14px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {isFavorite ? "♥ 찜" : "♡ 찜"}
          </button>

          {/* ✅ [추가] 찜한 목록이 있을 때만 보여주는 '선호 목록' 바로가기 버튼 */}
          {isFavorite && (
            <button
              onClick={goToFavoriteList}
              style={{
                flex: 1,
                border: "1px solid #7c5dfa",
                background: "#fff",
                color: "#7c5dfa",
                borderRadius: "999px",
                padding: "10px 14px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              목록 확인
            </button>
          )}
        </div>

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
            <strong>시설, 전화번호, 이벤트</strong>는 <br />
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
