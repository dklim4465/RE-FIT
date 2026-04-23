import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import BrandLogo from "./BrandLogo";

export default function ServiceHeader() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const nextIsAtTop = currentScrollY <= 8;
      const isScrollingUp = currentScrollY < lastScrollY;

      setIsAtTop(nextIsAtTop);
      setIsBackgroundVisible(nextIsAtTop || isScrollingUp);
      lastScrollY = currentScrollY;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`service-header ${isBackgroundVisible ? "is-background-visible" : "is-background-hidden"} ${isAtTop ? "is-at-top" : "is-floating"}`}
    >
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
