import React from "react";
import { useAiRoutine } from "../../../hooks/routines/useAiRoutine";

export default function RoutineList() {
  const { routines, viewRoutine, removeRoutine, navigate } = useAiRoutine();

  return (
    <div className="page" style={styles.container}>
      {/* 헤더를 더 아래로 내리고 목록과 가깝게 배치 */}
      <div className="list-header" style={styles.header}>
        <h2 style={styles.headerTitle}>나의 운동 기록({routines.length})</h2>

        {/* <button style={styles.createBtn} onClick={() => navigate("create")}> */}
        {/* + 새 루틴 만들기</button> 중복이라서 주석처리해두었습니다.*/}
      </div>

      {routines.length === 0 ? (
        <div style={styles.emptyState}>
          <p>아직 저장된 기록이 없습니다.</p>
          <button style={styles.emptyBtn} onClick={() => navigate("create")}>
            루틴 생성하러 가기
          </button>
        </div>
      ) : (
        <div className="routine-grid" style={styles.grid}>
          {routines.map((routine) => (
            <div key={routine.id} className="routine-card" style={styles.card}>
              <h3 style={styles.cardTitle}>{routine.name}</h3>
              <p style={styles.cardInfo}>
                {routine.days} / {routine.duration}
              </p>
              <div className="card-actions" style={styles.actions}>
                <button
                  style={styles.detailBtn}
                  onClick={() => viewRoutine(routine.id)}
                >
                  상세보기
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => removeRoutine(routine.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    // 상단 여백을 주어 전체적으로 화면을 아래로 내림
    paddingTop: "100px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    maxWidth: "800px",
    // 아래 요소(목록 또는 빈 화면 안내)와의 간격을 좁힘
    marginBottom: "20px",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  createBtn: {
    padding: "10px 20px",
    backgroundColor: "#7c5dfa",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "800px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    textAlign: "center",
    border: "1px solid #eee",
  },
  cardTitle: { fontSize: "18px", marginBottom: "10px", color: "#222" },
  cardInfo: { fontSize: "14px", color: "#666", marginBottom: "20px" },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  detailBtn: {
    padding: "8px 16px",
    backgroundColor: "#f0f0f6",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  deleteBtn: {
    padding: "8px 16px",
    backgroundColor: "#fff",
    color: "#ff4d4f",
    border: "1px solid #ff4d4f",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  emptyState: {
    textAlign: "center",
    // 안내 문구가 헤더와 너무 멀어지지 않도록 패딩 조절
    padding: "40px 0",
    color: "#888",
  },
  emptyBtn: {
    marginTop: "15px",
    padding: "12px 24px",
    backgroundColor: "#7c5dfa",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
