import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/chat";

const QUICK_CHIPS = [
  "오늘 추천 운동 알려줘",
  "스쿼트 자세 알려줘",
  "초보자 루틴 추천해줘",
  "유산소 운동 종류는?",
];

const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M13 2C6.5 2 2 6.5 2 13s4.5 11 11 11 11-4.5 11-11S19.5 2 13 2zm0 5c1.9 0 3.5 1.6 3.5 3.5S14.9 14 13 14s-3.5-1.6-3.5-3.5S11.1 7 13 7zm0 15.2c-2.5 0-4.7-1.2-6.1-3 .1-2 4-3.1 6.1-3.1s6 1.1 6.1 3.1c-1.4 1.8-3.6 3-6.1 3z" />
  </svg>
);

export default function FitBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "안녕하세요! 운동 정보, 루틴 추천, 자세 교정 등 무엇이든 물어보세요 💪" },
  ]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      const reply = data.reply || "죄송해요, 잠시 후 다시 시도해주세요.";
      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: msg },
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", content: "서버 연결에 문제가 생겼어요." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed", bottom: "24px", right: "24px",
          width: "52px", height: "52px", borderRadius: "50%",
          background: "#1D9E75", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          {open
            ? <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            : <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          }
        </svg>
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: "88px", right: "24px",
          width: "320px", maxHeight: "480px",
          background: "#fff", border: "1px solid #e0e0e0",
          borderRadius: "16px", display: "flex", flexDirection: "column",
          zIndex: 999, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}>
          {/* 헤더 */}
          <div style={{ background: "#1D9E75", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BotIcon />
            </div>
            <div>
              <div style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>핏봇</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px" }}>운동 도우미</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: "18px" }}>✕</button>
          </div>

          {/* 메시지 */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                {m.role === "bot" && (
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <BotIcon />
                  </div>
                )}
                <div style={{
                  maxWidth: "220px", padding: "8px 12px", borderRadius: "14px", fontSize: "13px", lineHeight: 1.5,
                  background: m.role === "user" ? "#E1F5EE" : "#f5f5f5",
                  color: m.role === "user" ? "#085041" : "#333",
                  border: m.role === "user" ? "1px solid #9FE1CB" : "1px solid #e8e8e8",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BotIcon />
                </div>
                <div style={{ padding: "8px 12px", borderRadius: "14px", fontSize: "13px", background: "#f5f5f5", color: "#888", fontStyle: "italic", border: "1px solid #e8e8e8" }}>
                  생각 중...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 퀵 칩 */}
          <div style={{ padding: "8px 12px", display: "flex", gap: "6px", flexWrap: "wrap", borderTop: "1px solid #f0f0f0" }}>
            {QUICK_CHIPS.map((chip) => (
              <button key={chip} onClick={() => sendMessage(chip)} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "20px", border: "1px solid #d0d0d0", background: "white", color: "#555", cursor: "pointer" }}>
                {chip}
              </button>
            ))}
          </div>

          {/* 입력창 */}
          <div style={{ display: "flex", gap: "6px", padding: "10px 12px", borderTop: "1px solid #f0f0f0", alignItems: "center" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="메시지를 입력하세요..."
              style={{ flex: 1, border: "1px solid #ddd", borderRadius: "20px", padding: "7px 12px", fontSize: "13px", outline: "none" }}
            />
            <button onClick={() => sendMessage()} disabled={loading} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1D9E75", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2 21L23 12 2 3v7l15 2-15 2v7z" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}