import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <header className="auth-header">
        <Link to="/" className="box auth-logo-box">
          사이트 이름
        </Link>
      </header>

      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
}
