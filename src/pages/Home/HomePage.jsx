import React, { useState } from "react";
import { Link } from "react-router-dom";
import HomeHeader from "../../components/common/HomeHeader";
import NaverMap from "../../components/main/NaverMap";
import Popup from "../../components/Popup";

// 메뉴 구성 데이터
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
  // 팝업 표시 여부 상태 (Popup 컴포넌트가 내부에서 24시간 체크를 수행함)
  const [showPopup, setShowPopup] = useState(true);

  // 팝업 닫기 및 차단 시 호출될 함수
  const closePopup = () => setShowPopup(false);

  return (
    <div className="home-page">
      {/* 팝업 렌더링: 
        쇼핑몰처럼 메인 페이지 진입 시 바로 띄워줍니다. 
        실제 노출 여부는 Popup 내부의 localStorage 로직이 결정합니다.
      */}
      {showPopup && <Popup onClose={closePopup} onBlock={closePopup} />}

      <HomeHeader />

      <main className="home-main-box">
        {/* 상단: 지도 이동 영역 */}
        <section className="home-map-area">
          <div className="home-map-embed">
            <NaverMap />
          </div>
        </section>

        {/* 하단: 주요 서비스 메뉴 그리드 */}
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
