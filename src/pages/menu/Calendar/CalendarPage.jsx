import { Outlet } from "react-router-dom";
import CalendarView from "../../../components/main/CalendarView";

export default function CalendarPage() {
  return (
    <section className="page-placeholder">
      <CalendarView />
      <Outlet />
    </section>
  );
}
