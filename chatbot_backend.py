from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import os

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """당신은 피트니스 웹사이트의 친절한 운동 도우미 챗봇입니다. 이름은 '핏봇'입니다.
운동 정보, 루틴 추천, 운동 자세, 식단 등 건강과 운동에 관한 질문에 답변합니다.
답변은 간결하고 친근하게 한국어로 작성하고 3~5문장 내외로 짧게 유지하세요."""

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "메시지가 없습니다"}), 400

    messages = history + [{"role": "user", "content": user_message}]

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=messages,
    )

    return jsonify({"reply": response.content[0].text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)