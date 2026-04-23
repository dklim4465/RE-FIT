import { Link } from "react-router-dom";
import HomeHeader from "../../components/common/HomeHeader";

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
  return (
    <div className="home-page">
      <HomeHeader />

      <main className="home-main-box">
        {/* 왼쪽: 헬스장 찾기 (큰 카드) */}
        <section className="home-map-area">
          <Link to="/maps" className="home-map-link-card">
            <div className="menu-content-container">
              <span className="big-icon">📍</span>
              <strong>헬스장 찾기</strong>
            </div>
          </Link>
        </section>

        {/* 오른쪽: 메뉴 그리드 (4개 카드) */}
        <section className="home-menu-area">
          <div className="home-menu-grid">
            {homeMenuItems.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className={`home-menu-card ${menu.isAi ? "ai-highlight" : ""}`}
              >
                {/* AI 전용 상단 뱃지 */}
                {menu.isAi && <div className="ai-badge">AI 추천</div>}

                {/* [공통] 중앙 내용물 컨테이너 - 모든 카드가 이 안에서 중앙 정렬됩니다 */}
                <div className="menu-content-container">
                  <span className="small-icon">{menu.icon}</span>
                  <strong>{menu.label}</strong>
                  <p className="icon-desc">{menu.desc}</p>
                </div>

                {/* AI 전용 하단 버튼 */}
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
