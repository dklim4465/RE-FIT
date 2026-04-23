import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "../components/common/Loading";
import { useAuth } from "../store/AuthContext";

const ServiceLayout = lazy(() => import("../layouts/ServiceLayout"));
const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
const HomePage = lazy(() => import("../pages/Home/HomePage"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const SignupPage = lazy(() => import("../pages/Signup/SignupPage"));
const GymListPage = lazy(() => import("../pages/menu/Gyms/GymListPage"));
const AiRoutinePage = lazy(() => import("../pages/menu/AiRoutine/AiRoutinePage"));
const CalendarPage = lazy(() => import("../pages/menu/Calendar/CalendarPage"));
const CommunityListPage = lazy(() =>
  import("../pages/menu/Community/CommunityListPage")
);
const MyPage = lazy(() => import("../pages/menu/MyPage/MyPage"));
const NotFoundPage = lazy(() => import("../pages/menu/NotFound/NotFoundPage"));
const DietListPage = lazy(() => import("../pages/menu/Diet/DietListPage"));
const GymListFound = lazy(() => import("../pages/menu/Gyms/GymListFound"));
const NaverMap = lazy(() => import("../components/main/NaverMap"));
const RoutineDetail = lazy(() =>
  import("../pages/menu/AiRoutine/RoutineDetail")
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
        <Route path="/" element={<HomePage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route path="/maps" element={<NaverMap />} />

        <Route
          element={
            <ProtectedRoute>
              <ServiceLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/gyms" element={<GymListPage />} />
          <Route path="/gyms/found" element={<GymListFound />} />
          <Route path="/ai-routine" element={<AiRoutinePage />}>
            <Route index element={<RoutineList />} />
            <Route path="create" element={<RoutineForm />} />
            <Route path=":routineId" element={<RoutineDetail />} />
          </Route>
          <Route path="/diet" element={<DietListPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/calender/Main" element={<CalendarView />} />
          <Route path="/community" element={<CommunityListPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>

        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
}
