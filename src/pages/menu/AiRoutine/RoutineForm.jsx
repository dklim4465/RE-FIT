import React, { useState } from "react";
import { useAiRoutine } from "../../../hooks/routines/useAiRoutine";

export default function RoutineForm() {
  const {
    saveRoutine,
    navigate,
    content,
    isLoading,
    isVisible,
    generate,
    reset,
  } = useAiRoutine();

  const [form, setForm] = useState({
    name: "",
    goal: "체중 감량",
    level: "초급",
    days: "주 3회",
    duration: "60분",
    equipment: "맨몸",
    notes: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = () => {
    generate(form);
  };

  const handleSave = () => {
    saveRoutine({
      name: form.name || `${form.goal} 루틴 (${form.level})`,
      content,
      goal: form.goal,
      level: form.level,
      days: form.days,
      duration: form.duration,
      equipment: form.equipment,
      notes: form.notes,
    });
    reset();
    navigate("list");
  };

  return (
    <div className="page">
      <h2>AI 운동 루틴 생성</h2>
      <div className="form-grid">
        <select name="goal" value={form.goal} onChange={handleChange}>
          <option>체중 감량</option>
          <option>근력 향상</option>
          <option>근육 증가</option>
        </select>
        <select name="level" value={form.level} onChange={handleChange}>
          <option>초급</option>
          <option>중급</option>
          <option>고급</option>
        </select>
        <select name="days" value={form.days} onChange={handleChange}>
          <option>주 1회</option>
          <option>주 2회</option>
          <option>주 3회</option>
          <option>주 4회</option>
          <option>주 5회</option>
          <option>주 6회</option>
          <option>주 7회</option>
        </select>
        <select name="duration" value={form.duration} onChange={handleChange}>
          <option>10분</option>
          <option>20분</option>
          <option>30분</option>
          <option>40분</option>
          <option>50분</option>
          <option>60분</option>
          <option>70분</option>
          <option>80분</option>
          <option>90분</option>
        </select>
        <select name="equipment" value={form.equipment} onChange={handleChange}>
          <option>맨몸</option>
          <option>밴드</option>
          <option>헬스장 장비</option>
        </select>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="루틴 이름(선택)"
        />
        <input
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="추가 요청사항"
        />
      </div>

      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? "생성 중..." : "루틴 생성"}
      </button>

      {isVisible && (
        <div className="ai-result">
          <pre>{content}</pre>
          {!isLoading && <button onClick={handleSave}>루틴 저장</button>}
        </div>
      )}
    </div>
  );
}
