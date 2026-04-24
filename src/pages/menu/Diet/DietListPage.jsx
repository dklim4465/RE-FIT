import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const STORAGE_KEY = "ai-diet-plans";
const KOREAN_ONLY_NOTICE =
  "응답은 반드시 자연스러운 한국어로만 작성하세요. 영어, 로마자, 외래어 표기를 최대한 사용하지 말고, 필요한 경우 한국어 표현으로 바꿔 쓰세요.";

export default function DietListPage() {
  const [goal, setGoal] = useState("체중 감량");
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlans, setDietPlans] = useState([]);
  const [isGoalOpen, setIsGoalOpen] = useState(false);

  // 이미지와 어울리는 보라색 포인트 컬러
  const POINT_COLOR = "#8B5CF6";

  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem(STORAGE_KEY);
      if (savedPlans) {
        setDietPlans(JSON.parse(savedPlans));
      }
    } catch (e) {
      console.error("데이터 로드 실패");
    }
  }, []);

  const renderGoalOptions = () => {
    if (isGoalOpen === false) return null;

    return (
      <div
        style={{
          marginTop: "10px",
          borderTop: "1px solid #eee",
          paddingTop: "10px",
        }}
      >
        <select
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            setIsGoalOpen(false);
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <option value="체중 감량">🔥 체중 감량</option>
          <option value="체중 증가">🍱 체중 증가</option>
          <option value="근육 향상">💪 근육 향상</option>
          <option value="체력 향상">🏃 체력 향상</option>
        </select>
      </div>
    );
  };

  const handleGenerateDiet = async () => {
    setIsLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          system: KOREAN_ONLY_NOTICE,
          prompt: `목표: ${goal}, 재료: ${ingredients || "제한 없음"}. 하루 식단을 한국어로 짜줘.`,
          stream: false,
        }),
      });
      const data = await res.json();
      setResult(data?.response?.trim());
    } catch (err) {
      setError("연결 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDiet = () => {
    if (result === "") {
      alert("내용이 없습니다!");
      return;
    }
    const newPlan = {
      id: Date.now().toString(),
      goal,
      ingredients,
      result,
      updatedAt: new Date().toLocaleString("ko-KR"),
    };
    const nextPlans = [newPlan, ...dietPlans];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPlans));
    setDietPlans(nextPlans);
    setResult("");
    setIngredients("");
    alert("저장되었습니다!");
  };

  const handleDeleteDiet = (id) => {
    if (window.confirm("삭제할까요?")) {
      const filtered = dietPlans.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setDietPlans(filtered);
    }
  };

  return (
    <section
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 20px",
        color: "#333",
        backgroundColor: "#fcfcfc",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "1.8rem",
          marginBottom: "40px",
        }}
      >
        🥗 AI 식단 추천
      </h1>

      <div
        style={{
          display: "grid",
          gap: "20px",
          padding: "24px",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* 목표 설정 */}
        <div
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#fafafa",
          }}
        >
          <div
            onClick={() => setIsGoalOpen(!isGoalOpen)}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            🎯 운동 목표: {goal}
            <span style={{ fontSize: "0.8rem", color: POINT_COLOR }}>
              {isGoalOpen ? " ▲" : " ▼"}
            </span>
          </div>
          {renderGoalOptions()}
        </div>

        {/* 재료 입력 */}
        <label style={{ fontWeight: "bold" }}>
          🛒 냉장고에 어떤 재료가 있나요?
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="예: 닭가슴살, 계란, 고구마..."
            style={{
              width: "100%",
              minHeight: "120px",
              marginTop: "12px",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #eee",
              boxSizing: "border-box",
              resize: "none",
            }}
          />
        </label>

        {/* 버튼들 */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleGenerateDiet}
            disabled={isLoading}
            style={{
              flex: 2,
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: POINT_COLOR,
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "생성 중..." : "맞춤 식단 만들기"}
          </button>
          <button
            onClick={handleSaveDiet}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "12px",
              border: `1px solid ${POINT_COLOR}`,
              backgroundColor: "white",
              color: POINT_COLOR,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            저장
          </button>
        </div>
      </div>

      {/* 결과창: if문 대신 {result && (...)} 방식을 사용해야 화면에 코드가 안 뜹니다 */}
      {result !== "" && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #f0f0f0",
          }}
        >
          <h3 style={{ marginTop: 0, color: POINT_COLOR }}>✨ AI 추천 결과</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
              fontSize: "0.95rem",
            }}
          >
            {result}
          </pre>
        </div>
      )}

      {/* 저장된 목록 */}
      <div style={{ marginTop: "50px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          나의 식단 기록({dietPlans.length})
        </h2>
        {dietPlans.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>
            아직 저장된 기록이 없습니다.
          </p>
        ) : (
          dietPlans.map((plan) => (
            <div
              key={plan.id}
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "16px",
                marginBottom: "15px",
                border: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#F3E8FF",
                    color: POINT_COLOR,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {plan.goal}
                </span>
                <button
                  onClick={() => handleDeleteDiet(plan.id)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#ff4d4f",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  삭제
                </button>
              </div>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                {plan.result}
              </pre>
              <div
                style={{ fontSize: "0.7rem", color: "#bbb", marginTop: "10px" }}
              >
                {plan.updatedAt}
              </div>
            </div>
          ))
        )}
      </div>

      <Outlet />
    </section>
  );
}
