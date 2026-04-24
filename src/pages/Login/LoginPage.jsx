import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthLoading, isLoggedIn, login } = useAuth();

  const redirectPath = location.state?.from || "/";
  const [name, setName] = useState(location.state?.registeredName || "");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectPath, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectPath]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await login({
      name,
      password,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage("");
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="auth-inner-card">
      <section className="login-page">
        <h1>로그인</h1>
        <p>회원가입한 이름과 비밀번호로 로그인해주세요.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이름"
            autoComplete="username"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <button type="submit" disabled={isAuthLoading}>
            {isAuthLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <Link to="/signup" className="signup-link-button">
          회원가입하러 가기
        </Link>
      </section>
    </div>
  );
}
