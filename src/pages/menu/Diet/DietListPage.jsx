import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const STORAGE_KEY = "ai-diet-plans";

export default function DietListPage() {
  const [goal, setGoal] = useState("체중 감량");
  const [ingredients, setIngredients] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlans, setDietPlans] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem(STORAGE_KEY);
      if (savedPlans) {
        setDietPlans(JSON.parse(savedPlans));
      }
    } catch (storageError) {
      console.error("식단 목록을 불러오지 못했습니다.", storageError);
    }
  }, []);

  const saveDietPlans = (nextPlans) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPlans));
    setDietPlans(nextPlans);
  };

  const buildPrompt = () => {
    const ingredientText = ingredients.trim() || "특별히 제한 없음";

    return `
사용자 목표에 맞는 하루 식단을 만들어줘.

- 목표: ${goal}
- 선호 또는 보유 재료: ${ingredientText}

아래 형식으로 한국어로 작성해줘.
1. 아침
2. 점심
3. 저녁
4. 간식
5. 식단 추천 이유
`.trim();
  };

  const handleGenerateDiet = async () => {
    const nextPrompt = buildPrompt();

    setPrompt(nextPrompt);
    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const ollamaRes = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: nextPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 800,
          },
        }),
      });

      if (!ollamaRes.ok) {
        throw new Error(`요청 실패: ${ollamaRes.status}`);
      }

      const data = await ollamaRes.json();
      const content = data?.response?.trim();

      if (!content) {
        throw new Error("응답 내용이 비어 있습니다.");
      }

      setResult(content);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "식단 생성 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGoal("체중 감량");
    setIngredients("");
    setPrompt("");
    setResult("");
    setError("");
    setEditId(null);
  };

  const handleSaveDiet = () => {
    if (!result.trim()) {
      setError("저장할 식단 결과가 없습니다.");
      return;
    }

    const dietData = {
      id: editId || Date.now().toString(),
      goal,
      ingredients: ingredients.trim(),
      prompt,
      result,
      updatedAt: new Date().toLocaleString("ko-KR"),
    };

    <pre style={{ whiteSpace: "pre-wrap" }}>{prompt}</pre>;
    const nextPlans = editId
      ? dietPlans.map((plan) => (plan.id === editId ? dietData : plan))
      : [dietData, ...dietPlans];

    saveDietPlans(nextPlans);
    resetForm();
  };

  const handleEditDiet = (plan) => {
    setEditId(plan.id);
    setGoal(plan.goal);
    setIngredients(plan.ingredients || "");
    setPrompt(plan.prompt || "");
    setResult(plan.result || "");
    setError("");
  };

  const handleDeleteDiet = (id) => {
    const nextPlans = dietPlans.filter((plan) => plan.id !== id);
    saveDietPlans(nextPlans);

    if (editId === id) {
      resetForm();
    }
  };

  return (
    <section
      className="page-placeholder"
      style={{ maxWidth: "720px", margin: "0 auto", padding: "24px" }}
    >
      <h1>AI 식단 추천</h1>

      <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
        <label>
          목표
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "6px" }}
          >
            <option value="체중 감량">체중 감량</option>
            <option value="근육 증가">근육 증가</option>
            <option value="건강 유지">건강 유지</option>
          </select>
        </label>

        <label>
          선호 또는 보유 재료
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="예: 닭가슴살, 계란, 고구마, 두부"
            style={{ width: "100%", minHeight: "120px", marginTop: "6px" }}
          />
        </label>

        <button onClick={handleGenerateDiet} disabled={isLoading}>
          {isLoading ? "식단생성중..." : "식단 생성"}
        </button>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={handleGenerateDiet} disabled={isLoading}>
            {isLoading ? "식단 생성 중..." : "식단 생성"}
          </button>
          <button onClick={handleSaveDiet} disabled={!result.trim()}>
            {editId ? "수정 저장" : "식단 저장"}
          </button>
          {editId && <button onClick={resetForm}>수정 취소</button>}
        </div>
      </div>

      {error && (
        <p style={{ color: "crimson", marginTop: "16px" }}>오류: {error}</p>
      )}

      {prompt && (
        <div style={{ marginTop: "24px" }}>
          <h3>전송한 프롬프트</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f6f6f6",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            {prompt}
          </pre>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "24px" }}>
          <h3>{editId ? "수정 중인 식단" : "추천 식단"}</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f6f6f6",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            {result}
          </pre>
        </div>
      )}

      <div style={{ marginTop: "32px" }}>
        <h2>저장된 식단</h2>
        {dietPlans.length === 0 ? (
          <p>저장된 식단이 없습니다.</p>
        ) : (
          dietPlans.map((plan) => (
            <div
              key={plan.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
                marginTop: "12px",
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>{plan.goal}</h3>
              <p style={{ marginBottom: "8px", color: "#666" }}>
                재료: {plan.ingredients || "특별히 제한 없음"}
              </p>
              <p style={{ marginBottom: "8px", color: "#666" }}>
                저장일시: {plan.updatedAt}
              </p>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  background: "#fafafa",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "12px",
                }}
              >
                {plan.result}
              </pre>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleEditDiet(plan)}>수정</button>
                <button onClick={() => handleDeleteDiet(plan.id)}>삭제</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Outlet />
    </section>
  );
}
