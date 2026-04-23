import React, { useState } from "react";
import RoutineContent from "../../../components/routines/RoutineContent";
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

  // 1. 초기값을 모두 ""(빈 문자열)로 설정합니다.
  // 그래야 아래 <option value=""> 내용이 처음에 화면에 뜹니다.
  const [form, setForm] = useState({
    name: "",
    goal: "",
    level: "",
    days: "",
    duration: "",
    equipment: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = () => {
    // 필수 항목 체크 (빈 값이 있으면 생성 안 되게)
    if (
      !form.goal ||
      !form.level ||
      !form.days ||
      !form.duration ||
      !form.equipment
    ) {
      alert("모든 항목을 선택해주세요!");
      return;
    }
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
    <div className="page" style={styles.container}>
      <h2 style={styles.title}>AI 운동 루틴 생성</h2>

      <div className="form-grid" style={styles.formGrid}>
        {/* value="" 인 첫 번째 option이 사용자에게 처음으로 보입니다 */}
        <select
          name="goal"
          value={form.goal}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="" disabled hidden>
            🎯 운동 목표 선택
          </option>
          <option>체중 감량</option>
          <option>근력 향상</option>
          <option>근육 증가</option>
        </select>

        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="" disabled hidden>
            📊 난이도 선택
          </option>
          <option>초급</option>
          <option>중급</option>
          <option>고급</option>
        </select>

        <select
          name="days"
          value={form.days}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="" disabled hidden>
            📅 운동 빈도 선택
          </option>
          <option>주 1회</option>
          <option>주 2회</option>
          <option>주 3회</option>
          <option>주 4회</option>
          <option>주 5회</option>
          <option>주 6회</option>
          <option>주 7회</option>
        </select>

        <select
          name="duration"
          value={form.duration}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="" disabled hidden>
            ⏰ 운동 시간 선택
          </option>
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

        <select
          name="equipment"
          value={form.equipment}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="" disabled hidden>
            🛠️ 사용 장비 선택
          </option>
          <option>맨몸</option>
          <option>밴드</option>
          <option>헬스장 장비</option>
        </select>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="🏷️ 루틴 이름(선택)"
          style={styles.input}
        />

        <input
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="📝 추가 요청사항을 적어주세요"
          style={styles.inputFull}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        style={isLoading ? styles.btnDisabled : styles.generateBtn}
      >
        {isLoading ? "생성 중..." : "AI 루틴 생성하기"}
      </button>

      {isVisible && (
        <div className="ai-result" style={styles.resultContainer}>
          <RoutineContent content={content} isLoading={isLoading} />
          {!isLoading && content && (
            <div className="ai-result-actions" style={styles.actionArea}>
              <button onClick={handleSave} style={styles.saveBtn}>
                이 루틴 저장하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 가운데 정렬 스타일 (위 코드와 동일)
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  title: { marginBottom: "30px", fontWeight: "bold" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "30px",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    appearance: "none",
  },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #ddd" },
  inputFull: {
    gridColumn: "span 2",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  generateBtn: {
    width: "100%",
    maxWidth: "600px",
    padding: "15px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#7c5dfa",
    color: "#fff",
    cursor: "pointer",
  },
  btnDisabled: {
    width: "100%",
    maxWidth: "600px",
    padding: "15px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#ccc",
    color: "#fff",
  },
  resultContainer: {
    width: "100%",
    maxWidth: "800px",
    marginTop: "40px",
    padding: "20px",
    background: "#fff",
    borderRadius: "15px",
  },
  actionArea: { display: "flex", justifyContent: "center", marginTop: "20px" },
  saveBtn: {
    padding: "12px 30px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2ecc71",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
