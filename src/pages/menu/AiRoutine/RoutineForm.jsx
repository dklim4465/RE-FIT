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
    <div
      className="page"
      // style 부분에 paddingTop을 추가하여 전체적으로 내용을 내렸습니다.
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "30px", //
      }}
    >
      <div className="form-grid" style={styles.formGrid}>
        <select
          name="goal"
          value={form.goal}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="" disabled hidden>
            🎯 운동 목표
          </option>
          <option>체중 감량</option>
          <option>체중 증가</option>
          <option>근력 향상</option>
          <option>체력 향상</option>
        </select>

        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="" disabled hidden>
            📊 난이도
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
            📅 운동 빈도
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
            ⏰ 운동 시간
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
            🛠️ 운동 장비
          </option>
          <option>맨몸</option>
          <option>소도구</option>
          <option>헬스장 기구</option>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />
      </div>

      <button
        onClick={handleGenerate}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleGenerate();
          }
        }}
        disabled={isLoading}
        style={isLoading ? styles.btnDisabled : styles.generateBtn}
      >
        {isLoading ? "생성 중..." : "AI 루틴 생성하기"}
      </button>

      {isVisible && (
        <div className="ai-result" style={styles.resultContainer}>
          <RoutineContent content={content} isLoading={isLoading} />
          {!isLoading && content && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button onClick={handleSave} style={styles.saveBtn}>
                루틴 저장
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    width: "100%",
    maxWidth: "500px",
    marginBottom: "40px",
  },
  select: { padding: "12px", borderRadius: "8px", border: "1px solid #ddd" },
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
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#7c5dfa",
    color: "#fff",
    cursor: "pointer",
  },
  btnDisabled: {
    width: "100%",
    maxWidth: "600px",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#ccc",
    color: "#fff",
  },
  resultContainer: {
    width: "100%",
    maxWidth: "800px",
    marginTop: "30px",
    padding: "20px",
    background: "#fff",
    borderRadius: "15px",
  },
  saveBtn: {
    padding: "12px 40px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2ecc71",
    color: "#fff",
    fontWeight: "bold",
  },
};
