import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import ServiceLayout from "../layouts/ServiceLayout";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Login/LoginPage";
import SignupPage from "../pages/Signup/SignupPage";
import GymListPage from "../pages/menu/Gyms/GymListPage";
import AiRoutinePage from "../pages/menu/AiRoutine/AiRoutinePage";
import CalendarPage from "../pages/menu/Calendar/CalendarPage";
import CommunityListPage from "../pages/menu/Community/CommunityListPage";
import MyPage from "../pages/menu/MyPage/MyPage";
import NotFoundPage from "../pages/menu/NotFound/NotFoundPage";
import DietListPage from "../pages/menu/Diet/DietListPage";
import GymListFound from "../pages/menu/Gyms/GymListFound";
import GymDetail from "../pages/menu/Gyms/GymDetail";
import NaverMap from "../components/main/NaverMap";
import RoutineDetail from "../pages/menu/AiRoutine/RoutineDetail";
import RoutineForm from "../pages/menu/AiRoutine/RoutineForm";
import RoutineList from "../pages/menu/AiRoutine/RoutineList";
import CalendarView from "../components/main/CalendarView";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* 메인 홈 */}
      <Route path="/" element={<HomePage />} />

      {/* 로그인 관련 */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      {/* 지도 탭 */}
      <Route path="/maps" element={<NaverMap />} />
      <Route
        element={
          <ProtectedRoute>
            <ServiceLayout />
          </ProtectedRoute>
        }
      >
        {/* 헬스탭 아마 지도랑 헬스탭은 합칠거같아요*/}
        <Route path="/gyms" element={<GymListPage />} />
        <Route path="/gyms/found" element={<GymListFound />} />
        <Route path="/gym/:id" element={<GymDetail />} />
        {/* 루틴 탭 */}
        <Route path="/ai-routine" element={<AiRoutinePage />}>
          <Route index element={<RoutineList />} />
          <Route path="create" element={<RoutineForm />} />
          <Route path=":routineId" element={<RoutineDetail />} />
        </Route>
        {/* 식단 탭 */}
        <Route path="/diet" element={<DietListPage />} />

        {/* 캘린더 탭 */}
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calender/Main" element={<CalendarView />} />
        {/* 커뮤니티 탭 */}
        <Route path="/community" element={<CommunityListPage />} />

        {/* 마이 페이지 */}
        <Route path="/mypage" element={<MyPage />} />
      </Route>

      {/* 에러 발생시 여기 주소로 */}
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}
