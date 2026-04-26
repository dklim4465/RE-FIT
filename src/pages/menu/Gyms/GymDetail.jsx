import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGymFavorites } from "../../../hooks/gyms/useGymFavorites";

const GymDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoriteGymIds, toggleFavorite, rememberFavoriteGym } =
    useGymFavorites();

  // state에 gym 데이터가 있으면 최우선으로 사용
  const gym = location.state?.gym;
  const isFavorite = gym ? favoriteGymIds.includes(String(gym.id)) : false;

  useEffect(() => {
    if (gym && isFavorite) {
      rememberFavoriteGym(gym);
    }
  }, [gym, isFavorite, rememberFavoriteGym]);

  const goToFavoriteList = () => {
    navigate("/gyms", { state: { showFavorites: true } });
  };

  if (!gym) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h3>정보를 불러오는 중입니다...</h3>
        <button onClick={() => navigate("/gyms")} style={styles.bottomBackBtn}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 이미지가 없을 때 사용할 기본 이미지
  const defaultGymImg =
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop";
  const displayImage = gym.imageUrl || defaultGymImg;

  return (
    <div style={styles.wrapper}>
      {/* 헤더 영역 */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          {" "}
          ←{" "}
        </button>
        <h2 style={styles.headerTitle}>상세 정보</h2>
      </div>

      <div style={styles.card}>
        {/* 1. 이미지 영역 (네이버 링크 대신 추가) */}
        <div style={styles.imageContainer}>
          <img src={displayImage} alt={gym.name} style={styles.mainImage} />
          {gym.isDiscount && <span style={styles.imageBadge}>EVENT</span>}
        </div>

        {/* 2. 제목 및 주소 */}
        <h1 style={styles.title}>{gym.name}</h1>
        <p style={styles.address}>📍 {gym.address}</p>

        {/* 3. 정보 그리드 (거리 & 전화번호 2열 배치) */}
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>거리</span>
            <span style={styles.infoValue}>📏 {gym.distance}km</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>문의처</span>
            <span style={styles.infoValue}>
              📞 {gym.phone || "02-123-4567"}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>별점</span>
            <span style={styles.infoValue}>⭐️ {gym.rating || "4.5"}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>운영시간</span>
            <span style={styles.infoValue}>⏰ 06:00 ~ 24:00</span>
          </div>
        </div>

        {/* 4. 버튼 영역 */}
        <div style={styles.btnGroup}>
          <button
            type="button"
            onClick={() => toggleFavorite(gym)}
            style={{
              ...styles.favBtn,
              background: isFavorite ? "#ffe3e3" : "#f8f9fa",
              color: isFavorite ? "#e03131" : "#adb5bd",
              border: isFavorite ? "1px solid #ffc9c9" : "1px solid #e9ecef",
            }}
          >
            {isFavorite ? "❤️ 찜한 헬스장" : "🤍 찜하기"}
          </button>

          {isFavorite && (
            <button onClick={goToFavoriteList} style={styles.listBtn}>
              목록 확인
            </button>
          )}
        </div>
      </div>

      <button onClick={() => navigate("/gyms")} style={styles.bottomBackBtn}>
        전체 목록으로 돌아가기
      </button>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginLeft: "10px",
  },
  backBtn: {
    border: "none",
    background: "none",
    fontSize: "22px",
    cursor: "pointer",
    padding: "0",
  },
  card: {
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid #f1f1f5",
    paddingBottom: "24px",
  },
  imageContainer: {
    width: "100%",
    height: "250px",
    position: "relative",
    backgroundColor: "#f8f9fa",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageBadge: {
    position: "absolute",
    top: "16px",
    left: "16px",
    backgroundColor: "#7c5dfa",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "800",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    margin: "24px 20px 8px 20px",
    color: "#1a1a1a",
  },
  address: {
    fontSize: "14px",
    color: "#888",
    margin: "0 20px 24px 20px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // 2열 배치
    gap: "12px",
    padding: "0 20px",
    marginBottom: "30px",
  },
  infoItem: {
    backgroundColor: "#f8f9fa",
    padding: "12px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontSize: "11px",
    color: "#adb5bd",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: "13px",
    color: "#495057",
    fontWeight: "700",
  },
  btnGroup: {
    display: "flex",
    gap: "10px",
    padding: "0 20px",
  },
  favBtn: {
    flex: 2,
    borderRadius: "14px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  listBtn: {
    flex: 1,
    border: "1px solid #7c5dfa",
    background: "#fff",
    color: "#7c5dfa",
    borderRadius: "14px",
    padding: "14px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  bottomBackBtn: {
    width: "100%",
    marginTop: "24px",
    padding: "16px",
    border: "1px solid #e9ecef",
    borderRadius: "14px",
    background: "white",
    color: "#868e96",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default GymDetail;
