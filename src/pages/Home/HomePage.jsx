import { Link } from "react-router-dom";
import HomeHeader from "../../components/common/HomeHeader";

const homeMenuItems = [
  { label: "헬스장", path: "/gyms" },
  { label: "AI 루틴", path: "/ai-routine" },
  { label: "커뮤니티", path: "/community" },
  { label: "식단", path: "/diet" },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <HomeHeader />

      <main className="home-main-box">
        <section className="home-map-area">
          <Link to="/maps" className="home-map-link-card">
            헬스장 찾기
          </Link>
        </section>

        <section className="home-menu-area">
          <div className="home-menu-grid">
            {homeMenuItems.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className="box home-menu-card"
              >
                {menu.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
