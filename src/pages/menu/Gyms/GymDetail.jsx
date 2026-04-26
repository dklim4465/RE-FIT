import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGymFavorites } from "../../../hooks/gyms/useGymFavorites";

const GymDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoriteGymIds, toggleFavorite, rememberFavoriteGym } =
    useGymFavorites();

  const gym = location.state?.gym;
  const isFavorite = gym ? favoriteGymIds.includes(String(gym.id)) : false;

  useEffect(() => {
    if (gym && isFavorite) {
      rememberFavoriteGym(gym);
    }
  }, [gym, isFavorite, rememberFavoriteGym]);

  if (!gym) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h3>정보를 불러오는 중입니다...</h3>
      </div>
    );
  }

  // [수정] 상세페이지용 헬스장/덤벨 테마 고화질 이미지
  const detailGymFallback = `https://loremflickr.com/800/600/fitness,gym,dumbbell/all?lock=${gym.id}`;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          {" "}
          ←{" "}
        </button>
        <h2 style={styles.headerTitle}>상세 정보</h2>
      </div>

      <div style={styles.card}>
        <div style={styles.imageContainer}>
          <img
            src={gym.imageUrl}
            alt={gym.name}
            style={styles.mainImage}
            onError={(e) => {
              e.target.onerror = null;
              // 운동 관련 사진으로 강제 교체
              e.target.src = detailGymFallback;
            }}
          />
          {gym.isDiscount && <span style={styles.imageBadge}>EVENT</span>}
        </div>

        <h1 style={styles.title}>{gym.name}</h1>
        <p style={styles.address}>📍 {gym.address}</p>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>거리</span>
            <span style={styles.infoValue}>📏 {gym.distance}km</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>문의처</span>
            <span style={styles.infoValue}>
              📞 {gym.phone || "02-1234-5678"}
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

        <div style={styles.btnGroup}>
          <button
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
            <button
              onClick={() =>
                navigate("/gyms", { state: { showFavorites: true } })
              }
              style={styles.listBtn}
            >
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
  wrapper: { maxWidth: "480px", margin: "0 auto", padding: "20px" },
  header: { display: "flex", alignItems: "center", marginBottom: "20px" },
  headerTitle: { fontSize: "18px", fontWeight: "700", marginLeft: "10px" },
  backBtn: {
    border: "none",
    background: "none",
    fontSize: "22px",
    cursor: "pointer",
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
  mainImage: { width: "100%", height: "100%", objectFit: "cover" },
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
  title: { fontSize: "22px", fontWeight: "800", margin: "24px 20px 8px 20px" },
  address: { fontSize: "14px", color: "#888", margin: "0 20px 24px 20px" },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
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
  infoLabel: { fontSize: "11px", color: "#adb5bd", fontWeight: "600" },
  infoValue: { fontSize: "13px", color: "#495057", fontWeight: "700" },
  btnGroup: { display: "flex", gap: "10px", padding: "0 20px" },
  favBtn: {
    flex: 2,
    borderRadius: "14px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
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
