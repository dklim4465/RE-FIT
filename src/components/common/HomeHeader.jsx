import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import BrandLogo from "./BrandLogo";

export default function HomeHeader() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="home-header">
      <div className="home-header-left">
        <Link to="/" className="box home-site-name">
          <BrandLogo />
        </Link>
      </div>

      <div>
        {isLoggedIn ? (
          <button
            type="button"
            className="box home-login-button"
            onClick={logout}
          >
            {user.name}님 반갑습니다 | 로그아웃
          </button>
        ) : (
          <Link to="/login" className="box home-login-button">
            로그인을 해주세요
          </Link>
        )}
      </div>
    </header>
  );
}
