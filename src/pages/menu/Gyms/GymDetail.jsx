import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGymFavorites } from "../../../hooks/gyms/useGymFavorites";
import { useAuth } from "../../../store/AuthContext";
import GymInquiryModal from "./GymInquiryModal";
import GymPromotionCard from "./GymPromotionCard";
import {
  buildPromotionText,
  formatPhoneNumber,
  normalizePhone,
} from "./gymPromotion";

const GymDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoriteGymIds, toggleFavorite, rememberFavoriteGym } =
    useGymFavorites();
  const { user } = useAuth();

  const gym = location.state?.gym;
  const gymId = gym?.id ?? id;
  const isFavorite = gym ? favoriteGymIds.includes(String(gym.id)) : false;
  const hasEventPromotion = Boolean(gym?.isDiscount);
  const promotion = useMemo(
    () => (hasEventPromotion && gym ? buildPromotionText(gym) : null),
    [gym, hasEventPromotion]
  );

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const detailGymFallback = `https://loremflickr.com/800/600/fitness,gym,dumbbell/all?lock=${gymId}`;
  const userName = user?.name || "회원";

  const openInquiryModal = () => {
    setPhoneError("");
    setIsSubmitted(false);
    setIsInquiryOpen(true);
  };

  const closeInquiryModal = () => {
    setIsInquiryOpen(false);
    setPhoneError("");
    setIsSubmitted(false);
  };

  const handlePhoneChange = (event) => {
    setPhoneError("");
    setPhoneNumber(formatPhoneNumber(event.target.value));
  };

  const handleInquirySubmit = (event) => {
    event.preventDefault();

    const digits = normalizePhone(phoneNumber);

    if (digits.length < 10 || digits.length > 11) {
      setPhoneError("전화번호를 정확히 입력해주세요.");
      return;
    }

    setPhoneError("");
    setIsSubmitted(true);
  };

  const handleInquiryReset = () => {
    setPhoneError("");
    setIsSubmitted(false);
  };

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <button
            onClick={() => navigate(-1)}
            style={styles.backBtn}
            aria-label="뒤로 가기"
          >
            {" "}
            ←{" "}
          </button>
          <h2 style={styles.headerTitle}>상세 정보</h2>
        </div>

        <div style={styles.card}>
          <div style={styles.imageContainer}>
            <img
              src={gym.imageUrl || detailGymFallback}
              alt={gym.name}
              style={styles.mainImage}
              onError={(e) => {
                e.target.onerror = null;
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
              <span style={styles.infoValue}>
                ⏰ {gym.openingHours || "06:00 ~ 24:00"}
              </span>
            </div>
          </div>

          {promotion && (
            <div style={styles.promotionWrap}>
              <GymPromotionCard
                promotion={promotion}
                onInquiryClick={openInquiryModal}
              />
            </div>
          )}

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

      {isInquiryOpen && promotion && (
        <GymInquiryModal
          gymName={gym.name}
          promotion={promotion}
          userName={userName}
          phoneNumber={phoneNumber}
          phoneError={phoneError}
          isSubmitted={isSubmitted}
          onClose={closeInquiryModal}
          onReset={handleInquiryReset}
          onPhoneChange={handlePhoneChange}
          onSubmit={handleInquirySubmit}
        />
      )}
    </>
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
  promotionWrap: { padding: "0 20px 24px 20px" },
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
