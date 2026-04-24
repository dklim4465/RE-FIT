import React, { useEffect, useState } from "react";

const STORAGE_KEY = "community-posts";

// ✅ 더미 데이터 3개
const DUMMY_POSTS = [
  {
    id: 1,
    title: "헬스장 처음 가는데 뭐부터 해야함?",
    content: "완전 초보인데 기구부터 해야됨?",
    date: "2026.04.01",
    likes: 3,
  },
  {
    id: 2,
    title: "단백질 보충제 추천좀",
    content: "가성비 좋은 거 뭐 있음?",
    date: "2026.04.02",
    likes: 8,
  },
  {
    id: 3,
    title: "하체하고 다음날 걷기 불가능ㅋㅋ",
    content: "이거 정상인가요?",
    date: "2026.04.03",
    likes: 5,
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 최초 로딩 (핵심 수정 완료)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        // 👉 더미 데이터 넣기
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_POSTS));
        setPosts(DUMMY_POSTS);
      }
    } catch (e) {
      console.error("데이터 로딩 오류", e);
      setPosts(DUMMY_POSTS);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ 저장 함수
  const savePosts = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setPosts(data);
  };

  // ✅ 작성 / 수정
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    const now = new Date().toLocaleDateString("ko-KR");

    let next;

    if (editId) {
      next = posts.map((p) =>
        p.id === editId
          ? { ...p, title: title.trim(), content: content.trim() }
          : p
      );
    } else {
      next = [
        {
          id: Date.now(),
          title: title.trim(),
          content: content.trim(),
          date: now,
          likes: 0,
        },
        ...posts,
      ];
    }

    savePosts(next);
    setTitle("");
    setContent("");
    setEditId(null);
  };

  // ✅ 수정 버튼
  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post.id);
  };

  // ✅ 삭제
  const handleDelete = (id) => {
    const next = posts.filter((p) => p.id !== id);
    savePosts(next);
  };

  // ✅ 좋아요
  const handleLike = (id) => {
    const next = posts.map((p) =>
      p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p
    );
    savePosts(next);
  };

  if (loading) return <div>불러오는 중...</div>;

  // ✅ 스타일 (JSX 내부)
  const btn = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div style={{ width: "600px", margin: "0 auto", padding: 20 }}>
      <h2>운동 커뮤니티 게시판</h2>

      {/* 작성 영역 */}
      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />

      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", height: 100, padding: 8 }}
      />

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={handleSubmit}
          style={{ ...btn, background: "#6c63ff", color: "#fff" }}
        >
          {editId ? "수정하기" : "작성하기"}
        </button>

        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setTitle("");
              setContent("");
            }}
            style={{ ...btn, marginLeft: 8 }}
          >
            취소
          </button>
        )}
      </div>

      <hr />

      {/* 게시글 목록 */}
      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 10,
              marginBottom: 10,
              background: "#fff",
            }}
          >
            <h3>{post.title}</h3>
            <p style={{ color: "#888" }}>{post.date}</p>
            <p>{post.content}</p>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => handleLike(post.id)}
                style={{ ...btn, background: "#eee" }}
              >
                👍 {post.likes}
              </button>

              <button
                onClick={() => handleEdit(post)}
                style={{ ...btn, background: "#6c63ff", color: "#fff" }}
              >
                수정
              </button>

              <button
                onClick={() => handleDelete(post.id)}
                style={{ ...btn, background: "red", color: "#fff" }}
              >
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
