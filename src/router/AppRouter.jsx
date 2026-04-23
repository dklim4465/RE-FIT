import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "../components/common/Loading";
import { useAuth } from "../store/AuthContext";

const ServiceLayout = lazy(() => import("../layouts/ServiceLayout"));
const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
const MapsLayout = lazy(() => import("../layouts/MapsLayout"));
const HomePage = lazy(() => import("../pages/Home/HomePage"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const SignupPage = lazy(() => import("../pages/Signup/SignupPage"));
const GymListPage = lazy(() => import("../pages/menu/Gyms/GymListPage"));
const AiRoutinePage = lazy(
  () => import("../pages/menu/AiRoutine/AiRoutinePage")
);
const CalendarPage = lazy(() => import("../pages/menu/Calendar/CalendarPage"));
const CommunityListPage = lazy(
  () => import("../pages/menu/Community/CommunityListPage")
);
const MyPage = lazy(() => import("../pages/menu/MyPage/MyPage"));
const NotFoundPage = lazy(() => import("../pages/menu/NotFound/NotFoundPage"));
const DietListPage = lazy(() => import("../pages/menu/Diet/DietListPage"));
const GymListFound = lazy(() => import("../pages/menu/Gyms/GymListFound"));
const NaverMap = lazy(() => import("../components/main/NaverMap"));
const RoutineDetail = lazy(
  () => import("../pages/menu/AiRoutine/RoutineDetail")
);
const RoutineForm = lazy(() => import("../pages/menu/AiRoutine/RoutineForm"));
const RoutineList = lazy(() => import("../pages/menu/AiRoutine/RoutineList"));
const CalendarView = lazy(() => import("../components/main/CalendarView"));

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
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 메인 홈 */}
        <Route path="/" element={<HomePage />} />

        {/* 로그인 관련 */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* 지도 탭 */}
        <Route element={<MapsLayout />}>
          <Route path="/maps" element={<NaverMap />} />
        </Route>

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
    </Suspense>
  );
}
