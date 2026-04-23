import { Outlet } from "react-router-dom";
import HomeHeader from "../components/common/HomeHeader";

export default function MapsLayout() {
  return (
    <div className="home-page">
      <HomeHeader />
      <Outlet />
    </div>
  );
}
