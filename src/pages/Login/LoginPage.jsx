import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectPath = location.state?.from || "/";

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
    <div className="auth-content">
      <div className="login-page">
        <h1>로그인</h1>
        <p>이름과 비밀번호를 입력해주세요.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {errorMessage && <p>{errorMessage}</p>}

          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}
