import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import BrandLogo from "./BrandLogo";

export default function ServiceHeader() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="service-header">
      {isLoggedIn ? (
        <button
          type="button"
          className="box service-login-box"
          onClick={logout}
        >
          임대한 회원님 | 로그아웃
        </button>
      ) : (
        <Link to="/login" className="box service-login-box">
          로그인
        </Link>
      )}

      <Link to="/" className="box service-logo-box">
        <BrandLogo />
      </Link>

      <button type="button" className="box service-paid-button">
        유료화버튼
      </button>
    </header>
  );
}
