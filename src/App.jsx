import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRouter from "./router/AppRouter";

//import GymListPage from "./pages/menu/Gyms/GymListPage"; // 상세페이지 파일
// 1단계에서 만든 gymData.js 파일 (데이터 모음)
//import { gymData } from "./gymData";

function App() {
  return (
    <Router>
      <Routes>
        {/* 리스트 페이지: gyms={gymData} 로 실제 데이터를 넘겨줍니다 */}
        <Route path="/"  />
      </Routes>
    </Router>
  );
}

export default App;
