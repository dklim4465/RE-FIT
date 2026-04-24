import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Popup = ({ onClose, onBlock }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  // ---------------------------------------------------------
  //  스스로 24시간 경과 여부를 체크하는 로직
  // ---------------------------------------------------------
  const expiryTime = localStorage.getItem("hidePopupUntil");
  const currentTime = new Date().getTime();

  // 만료 시간 기록, 아직 그 시간이 지나지 않았다면 안나옴
  if (expiryTime && currentTime < parseInt(expiryTime)) {
    return null;
  }
  // ---------------------------------------------------------

  const handleCloseWithAnim = (callback) => {
    setIsClosing(true);
    setTimeout(() => {
      if (callback) callback();
      onClose();
    }, 300);
  };

  const handleGoToGyms = () => {
    handleCloseWithAnim(() => navigate("/gyms"));
  };

  // ---------------------------------------------------------
  // 주석 해제 및 로직 완성: 24시간 차단 실행 함수
  // ---------------------------------------------------------
  const handleOnBlock = () => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 현재시간 + 24시간
    localStorage.setItem("hidePopupUntil", expiry.toString()); // 로컬스토리지 저장
    handleCloseWithAnim(onBlock); // 애니메이션 후 닫기
  };
  // ---------------------------------------------------------

  return (
    <div
      style={{
        ...popupStyles.overlay,
        opacity: isClosing ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
          }
          .popup-content {
            animation: ${isClosing ? "fadeOut" : "fadeIn"} 0.2s ease-out forwards;
          }
        `}
      </style>

      <div className="popup-content" style={popupStyles.content}>
        <span
          style={{ color: "#7c5dfa", fontWeight: "bold", fontSize: "14px" }}
        >
          📢 LIMITED OFFER
        </span>

        <h2 style={{ marginTop: "15px", fontSize: "24px", color: "#333" }}>
          신규 회원 할인 🎁
        </h2>

        <p
          style={{
            color: "#666",
            lineHeight: "1.7",
            marginBottom: "30px",
            fontSize: "16px",
          }}
        >
          RE-FIT이 추천하는 헬스장에서 사용 가능합니다
          <br />
          <strong>헬스장에서</strong> 확인해보세요!
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button onClick={handleGoToGyms} style={popupStyles.mainButton}>
            🔍 혜택받고 찾아보기
          </button>

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            {/* ✅ [확인] onClick에 handleOnBlock이 잘 연결되어 있습니다 */}
            <button onClick={handleOnBlock} style={popupStyles.subButton}>
              24시간 보지 않기
            </button>
            <button
              onClick={() => handleCloseWithAnim()}
              style={popupStyles.subButton}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const popupStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
  },
  content: {
    backgroundColor: "#fff",
    padding: "45px 50px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    width: "90%",
    maxWidth: "480px",
  },
  mainButton: {
    padding: "16px",
    cursor: "pointer",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#7c5dfa",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "17px",
    transition: "all 0.2s ease",
  },
  subButton: {
    padding: "12px",
    cursor: "pointer",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#f1f3f5",
    color: "#3d4349",
    fontSize: "14px",
    flex: 1,
  },
};

export default Popup;
