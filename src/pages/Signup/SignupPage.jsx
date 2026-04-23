import { Link } from 'react-router-dom';

export default function SignupPage() {
  return (
    <section className="login-page">
      <h1>회원가입</h1>
      <p>회원가입 화면은 나중에 구현합니다.</p>
      <Link to="/login">로그인으로 이동</Link>
    </section>
  );
}
