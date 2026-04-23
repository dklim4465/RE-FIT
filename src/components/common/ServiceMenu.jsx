import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "헬스장", path: "/gyms" },
  { label: "AI 루틴", path: "/ai-routine" },
  { label: "캘린더", path: "/calendar" },
  { label: "커뮤니티", path: "/community" },
  { label: "식단", path: "/diet" },
];

export default function ServiceMenu() {
  return (
    <nav className="service-menu-bar">
      {menuItems.map((menu) => (
        <NavLink
          key={menu.path}
          to={menu.path}
          className={({ isActive }) =>
            isActive ? "service-menu-link active" : "service-menu-link"
          }
        >
          {menu.label}
        </NavLink>
      ))}
    </nav>
  );
}
