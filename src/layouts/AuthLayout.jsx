import { Link, Outlet } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <Link to="/" className="box auth-logo-box">
        <BrandLogo />
      </Link>

      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
}
