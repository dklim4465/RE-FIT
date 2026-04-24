import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import BrandLogo from "./BrandLogo";

export default function HomeHeader() {
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
      className={`home-header ${isBackgroundVisible ? "is-background-visible" : "is-background-hidden"} ${isAtTop ? "is-at-top" : "is-floating"}`}
    >
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
            {user?.name ? `${user.name} 님 | 로그아웃` : "로그아웃"}
          </button>
        ) : (
          <Link to="/login" className="box home-login-button">
            로그인을해주세요
          </Link>
        )}
      </div>
    </header>
  );
}
