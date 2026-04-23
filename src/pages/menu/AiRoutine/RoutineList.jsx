import React from "react";
import { useAiRoutine } from "../../../hooks/routines/useAiRoutine";

export default function RoutineList() {
  const { routines, viewRoutine, removeRoutine, navigate } = useAiRoutine();

  return (
    <div className="page">
      <div className="list-header">
        <h2>내 루틴 ({routines.length})</h2>
        <button onClick={() => navigate("create")}>+ 새 루틴</button>
      </div>

      {routines.length === 0 ? (
        <p>아직 저장된 루틴이 없습니다.</p>
      ) : (
        <div className="routine-grid">
          {routines.map((routine) => (
            <div key={routine.id} className="routine-card">
              <h3>{routine.name}</h3>
              <p>
                {routine.days} / {routine.duration}
              </p>
              <div className="card-actions">
                <button onClick={() => viewRoutine(routine.id)}>상세보기</button>
                <button onClick={() => removeRoutine(routine.id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
