import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAiRoutine } from "../../../hooks/routines/useAiRoutine";

export default function RoutineDetail() {
  const { routineId } = useParams();
  const { navigate, removeRoutine } = useAiRoutine();
  const routine = useSelector((state) =>
    state.routines.list.find((item) => item.id === routineId)
  );

  if (!routine) {
    return (
      <section className="page">
        <h2>루틴을 찾을 수 없습니다.</h2>
        <button onClick={() => navigate("list")}>목록으로 돌아가기</button>
      </section>
    );
  }

  const handleDelete = () => {
    removeRoutine(routine.id);
    navigate("list");
  };

  return (
    <section className="page">
      <div className="list-header">
        <h2>{routine.name}</h2>
        <button onClick={() => navigate("list")}>목록으로</button>
      </div>

      <div className="routine-card">
        <p>목표: {routine.goal}</p>
        <p>난이도: {routine.level}</p>
        <p>운동 빈도: {routine.days}</p>
        <p>운동 시간: {routine.duration}</p>
        <p>장비: {routine.equipment}</p>
        {routine.createdAt && <p>생성일: {routine.createdAt}</p>}
        {routine.notes && <p>추가 요청사항: {routine.notes}</p>}

        <div className="ai-result">
          <pre>{routine.content}</pre>
        </div>

        <div className="card-actions">
          <button onClick={() => navigate("create")}>새 루틴 만들기</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      </div>
    </section>
  );
}
