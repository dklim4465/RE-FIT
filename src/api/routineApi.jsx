import { ollamaClient } from "./httpClient";

const DEFAULT_OLLAMA_MODEL = "gemma3";

function buildRoutinePrompt({ goal, level, days, duration, equipment, notes }) {
  return `
너는 전문 퍼스널 트레이너다.
사용자 조건에 맞는 운동 루틴을 반드시 한국어로만 작성해라.

[사용자 조건]
- 목표: ${goal}
- 운동 수준: ${level}
- 주간 운동 빈도: ${days}
- 1회 운동 시간: ${duration}
- 사용 장비: ${equipment}
- 추가 요청사항: ${notes || "없음"}

[절대 규칙]
- 설명, 인사말, 서론, 마무리, 주의 문구, 부연설명, 감탄문을 쓰지 않는다.
- "좋아요", "물론입니다", "다음과 같습니다", "아래와 같습니다" 같은 문장을 쓰지 않는다.
- 출력은 반드시 "1. 운동 구성 표"로 바로 시작한다.
- 아래 3개 항목만 작성한다.
- 항목 번호는 반드시 1, 2, 3 순서만 사용한다.
- 1번은 표 형식으로만 작성한다.
- 1번 표는 반드시 마크다운 표 형식으로 작성하고, 헤더 다음 줄에 "| --- | --- | --- | --- |" 구분선을 넣는다.
- 2번과 3번은 각각 최대 3줄만 작성한다.
- 2번과 3번의 각 줄은 반드시 "-"로 시작하는 불릿 한 줄씩 작성한다.
- 불필요한 빈 줄을 많이 넣지 않는다.

[출력 형식]
1. 운동 구성 표
| 요일 | 운동 이름 | 갯수 | 세트수 |
| --- | --- | --- | --- |
| 월요일 | 스쿼트 | 12회 | 3세트 |

2. 이 운동을 하는 이유
- 하체 근력과 코어 안정성을 함께 키울 수 있다.

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
  const model = import.meta.env.VITE_OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL;

  let response;

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

  const content = normalizeRoutineResponse(response.data?.response?.trim() || "");

  if (!content) {
    throw new Error("Ollama 응답에서 루틴 내용을 찾지 못했습니다.");
  }

  return content;
}
