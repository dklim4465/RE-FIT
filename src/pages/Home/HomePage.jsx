import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HomeHeader from "../../components/common/HomeHeader";
import Popup from "../../components/Popup";

const homeMenuItems = [
  { label: "헬스장", path: "/gyms", icon: "🏋️‍♂️", desc: "주변 시설 확인" },
  {
    label: "AI 루틴",
    path: "/ai-routine",
    icon: "✨",
    desc: "맞춤 루틴 생성",
    isAi: true,
  },
  { label: "커뮤니티", path: "/community", icon: "👥", desc: "함께 운동하기" },
  { label: "식단", path: "/diet", icon: "🥗", desc: "오늘의 영양 관리" },
];

export default function HomePage() {
  // ★ 수정 1: 기본값을 true로 설정해서 처음부터 보이게 함
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    /* ★ 수정 2: 24시간 체크 로직을 잠시 주석 처리합니다.
    const blockedUntil = localStorage.getItem("popup_block_main");
    const now = Date.now();
    if (!blockedUntil || now > parseInt(blockedUntil)) {
      setShowPopup(true);
    }
    */

    // 개발 중에는 항상 팝업이 뜨도록 강제 설정
    setShowPopup(true);
  }, []);

  const closePopup = () => setShowPopup(false);

  // ★ 수정 3: 차단 버튼을 눌러도 저장하지 않고 그냥 닫기만 함 (테스트용)
  const blockPopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home-page">
      {/* 팝업 렌더링 */}
      {showPopup && <Popup onClose={closePopup} onBlock={blockPopup} />}

      <HomeHeader />

      <main className="home-main-box">
        <section className="home-map-area">
          <Link to="/maps" className="home-map-link-card">
            <div className="menu-content-container">
              <span className="big-icon">📍</span>
              <strong>헬스장 찾기</strong>
            </div>
          </Link>
        </section>

        <section className="home-menu-area">
          <div className="home-menu-grid">
            {homeMenuItems.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className={`home-menu-card ${menu.isAi ? "ai-highlight" : ""}`}
              >
                {menu.isAi && <div className="ai-badge">AI 추천</div>}
                <div className="menu-content-container">
                  <span className="small-icon">{menu.icon}</span>
                  <strong>{menu.label}</strong>
                  <p className="icon-desc">{menu.desc}</p>
                </div>
                {menu.isAi && (
                  <div className="ai-cta-button">지금 시작하기 →</div>
                )}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
