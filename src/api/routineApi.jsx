import { ollamaClient } from "./httpClient";

const DEFAULT_OLLAMA_MODEL = "llama3.2";

// ai가  값을 받는 장소
function buildRoutinePrompt({ goal, level, days, duration, equipment, notes }) {
  return `
너는 전문 퍼스널 트레이너야.
사용자 조건에 맞는 운동 루틴을 한국어로만 작성해.

[사용자 조건]
- 목표: ${goal}
- 운동 수준: ${level}
- 주간 운동 빈도: ${days}
- 1회 운동 시간: ${duration}
- 사용 장비: ${equipment}
- 추가 요청사항: ${notes || "없음"}

[작성 규칙]
- 설명, 인사말, 서론, 마무리 문구는 넣지 마.
- 아래 출력 형식을 바로 시작해.
- 출력은 반드시 1, 2, 3 세 개의 항목만 작성해.
- 1번은 마크다운 표 형식으로 작성해.
- 2번과 3번은 각 항목당 최대 3줄만 작성해.
- 2번과 3번의 각 줄은 "-"로 시작하는 불릿 형식으로 작성해.
- 불필요한 빈 줄은 넣지 마.

[출력 형식]
1. 운동 구성표
| 요일 | 운동 이름 | 횟수 | 세트 |
| --- | --- | --- | --- |
| 월요일 | 스쿼트 | 12회 | 3세트 |

2. 이 운동을 추천하는 이유
- 전신 근력과 코어 안정성을 함께 강화할 수 있다.

3. 대체 가능한 운동
- 런지
`.trim();
}

function normalizeRoutineResponse(content) {
  const withoutCodeFence = content.replace(/```[\s\S]*?```/g, (block) =>
    block.replace(/```/g, "")
  );
  const firstSectionIndex = withoutCodeFence.search(/(^|\n)\s*1\./m);
  const trimmed =
    firstSectionIndex >= 0
      ? withoutCodeFence.slice(firstSectionIndex).trim()
      : withoutCodeFence.trim();

  return trimmed;
}

export async function requestRoutinePlan(params) {
  // 모델은 둘중에 있는걸로 실행되게
  const model = import.meta.env.VITE_OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL;

  let response;
  //루틴 생성이 실패했을 때 에러를 표시하게 해주는 코드
  try {
    response = await ollamaClient.post("/api/generate", {
      model,
      prompt: buildRoutinePrompt(params),
      stream: false,
    });
  } catch (error) {
    if (error?.response?.data?.error || error?.response?.data?.message) {
      throw new Error(
        error.response.data.error ||
          error.response.data.message ||
          "Ollama 루틴 생성 요청에 실패했습니다."
      );
    }

    throw new Error(
      "Ollama 서버에 연결하지 못했습니다. Ollama가 실행 중인지 확인해 주세요."
    );
  }

  const content = normalizeRoutineResponse(
    response.data?.response?.trim() || ""
  );

  if (!content) {
    throw new Error("Ollama 응답에서 루틴 내용을 찾지 못했습니다.");
  }

  return content;
}
