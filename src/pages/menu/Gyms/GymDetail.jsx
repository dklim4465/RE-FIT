import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGymFavorites } from "../../../hooks/gyms/useGymFavorites";

const GymDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoriteGymIds, toggleFavorite } = useGymFavorites();

  // ---------------------------------------------------------
  // 수정 성동구 데이터 매칭 로직 개선
  // state에 gym 데이터가 있으면 최우선으로 사용합니다.
  // ---------------------------------------------------------
  const gym = location.state?.gym;

  const isFavorite = gym ? favoriteGymIds.includes(String(gym.id)) : false;

  const goToFavoriteList = () => {
    navigate("/gyms", { state: { showFavorites: true } });
  };

  // gym 데이터가 아예 없을 때만 예외 처리
  if (!gym) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h3>정보를 불러오는 중입니다...</h3>
        <p style={{ color: "#666" }}>
          잠시만 기다려주시거나 목록에서 다시 선택해주세요.
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
      -
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          {" "}
          ←{" "}
        </button>
        <h2 style={{ marginLeft: "10px" }}>헬스장 상세정보</h2>
      </div>
      <div style={styles.card}>
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>{gym.name}</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>📍 {gym.address}</p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => toggleFavorite(gym.id)}
            style={{
              ...styles.favBtn,
              background: isFavorite ? "#ffe3e3" : "#f5f5f5",
              color: isFavorite ? "#e03131" : "#777",
            }}
          >
            {isFavorite ? "♥ 찜" : "♡ 찜"}
          </button>

          {isFavorite && (
            <button onClick={goToFavoriteList} style={styles.listBtn}>
              {" "}
              목록 확인{" "}
            </button>
          )}
        </div>

        <div style={styles.infoRow}>
          <span>📏 {gym.distance}km</span>
          <span>⭐️ {gym.rating || "4.5"}</span>
        </div>

        <div style={styles.naverBox}>
          <p style={styles.naverText}>
            현재 업체에서 제공하는 <br />
            <strong>시설, 전화번호, 이벤트</strong>는 <br />
            네이버에서 정확하게 확인 가능합니다.
          </p>
          <a
            href={getNaverSearchUrl(gym.name, gym.address)}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.naverLink}
          >
            N 네이버 정보 보기
          </a>
        </div>
      </div>
      <button onClick={() => navigate("/gyms")} style={styles.bottomBackBtn}>
        목록으로 돌아가기
      </button>
    </div>
  );
};

const styles = {
  backBtn: {
    border: "none",
    background: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  favBtn: {
    flex: 2,
    border: "none",
    borderRadius: "999px",
    padding: "12px 14px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  listBtn: {
    flex: 1,
    border: "1px solid #7c5dfa",
    background: "#fff",
    color: "#7c5dfa",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  infoRow: {
    display: "flex",
    gap: "15px",
    fontSize: "14px",
    color: "#444",
    marginBottom: "30px",
  },
  naverBox: {
    backgroundColor: "#f1f3f5",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  naverText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
    lineHeight: "1.5",
  },
  naverLink: {
    display: "block",
    backgroundColor: "#03C75A",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "15px",
  },
  bottomBackBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
  },
};

export default GymDetail;
