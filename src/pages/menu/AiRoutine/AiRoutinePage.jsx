import { Outlet } from "react-router-dom";

export default function AiRoutinePage() {
  return (
    <section
      className="page-placeholder"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // 가로 가운데 정렬
        justifyContent: "flex-start",
        minHeight: "100vh", // 화면 전체 높이 확보
        padding: "40px 20px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: "bold",
          marginTop: "80px",
          marginBottom: "30px",
          color: "#333",
          display: "flex", // 아이콘과 글자를 나란히 배치
          alignItems: "center", // 수직 중앙 맞춤
          gap: "12px", // 아이콘과 글자 사이 간격
        }}
      >
        <span>🤖</span>
        AI 운동 루틴
        <span>🏋️</span>
      </h1>

      {/* 내부 콘텐츠(Outlet)가 너무 퍼지지 않게 폭을 잡아줍니다 */}
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <Outlet />
      </div>
    </section>
  );
}
//import { Outlet } from "react-router-dom";

//export default function AiRoutinePage() {
//return (
//<section className="page-placeholder">
//<h1>AI 운동 루틴 </h1>
//<Outlet />
//</section>
//);
//}승진님 코드 혹시 몰라서 남겨둡니다.
