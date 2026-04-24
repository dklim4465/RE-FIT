import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { isAuthLoading, isLoggedIn, signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    //로그인 되있으면
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await signup(form);

    //회원가입 결과에 따른 메시지 출력
    if (!result.success) {
      setSuccessMessage("");
      setErrorMessage(result.message);
      return;
    }
    //기본은 없지만 회원가입시 아래 메시지 출력후
    setErrorMessage("");
    setSuccessMessage("회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.");
    //시간 지연 후 로그인 화면으로이동
    window.setTimeout(() => {
      navigate("/login", {
        replace: true,
        state: { registeredName: form.name.trim() },
      });
    }, 600);
  };

  return (
    <div className="auth-inner-card">
      <section className="signup-page">
        <h1>회원가입</h1>
        <p>가입한 이름과 비밀번호로 이후 로그인할 수 있습니다.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="이름"
            autoComplete="username"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {errorMessage && <p className="login-error">{errorMessage}</p>}
          {successMessage && <p>{successMessage}</p>}

          <button type="submit" disabled={isAuthLoading}>
            {isAuthLoading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>

        <Link to="/login" className="signup-link-button">
          로그인으로 이동
        </Link>
      </section>
    </div>
  );
}
