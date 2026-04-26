import React, { useEffect, useState } from "react";

const STORAGE_KEY = "community-posts";
const POSTS_PER_PAGE = 10;

export const generateDummyPosts = (count = 30) => {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    title: randomItem(TITLES),
    content: randomItem(CONTENTS),
    date: randomDate(),
    likes: Math.floor(Math.random() * 20),
    author: randomItem(NICKNAMES),
  }));
};

const TITLES = [
  "헬스장 처음 가는데 뭐부터 해야함?",
  "단백질 보충제 추천좀",
  "하체하고 다음날 걷기 불가능ㅋㅋ",
  "운동 루틴 평가좀 해주세요",
  "다이어트 식단 이거 괜찮나요?",
  "헬린이 질문좀요",
  "체지방 줄이려면 유산소 얼마나 해야함?",
  "운동 시간 언제가 제일 좋음?",
  "벌크업 식단 팁 좀",
  "운동 쉬는날 뭐함?",
];

const CONTENTS = [
  "완전 초보인데 어떻게 시작해야 할지 모르겠어요",
  "요즘 이거 먹고 있는데 괜찮은지 궁금함",
  "이거 정상인가요? 다들 이런가요?",
  "효과 본 방법 있으면 공유좀",
  "시간이 없어서 짧게 하고 싶은데 방법 있을까요",
  "헬스 3일차인데 너무 힘듦",
  "꾸준히 하는게 제일 어렵네요",
  "식단 관리 너무 빡셈",
  "운동 재미 붙이는 방법 없나요",
  "이 루틴 괜찮은지 피드백 부탁",
];

const NICKNAMES = [
  "헬린이123",
  "근육돼지",
  "다이어터",
  "운동하는직장인",
  "벌크업중",
  "헬스왕초보",
  "프로틴중독",
  "하체파괴자",
  "유산소싫어",
  "득근가즈아",
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDate = () => {
  const start = new Date(2026, 3, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end - start));
  return date.toLocaleDateString("ko-KR");
};

const DUMMY_POSTS = generateDummyPosts(30);

export default function CommunityListPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEY);
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_POSTS));
        setPosts(DUMMY_POSTS);
      }
    } catch (error) {
      console.error("게시글을 불러오는 중 오류가 발생했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  localStorage.removeItem("community-posts");

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const savePosts = (nextPosts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosts));
    setPosts(nextPosts);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditId(null);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    const now = new Date().toLocaleDateString("ko-KR");
    let nextPosts;

    if (editId) {
      nextPosts = posts.map((post) =>
        post.id === editId
          ? {
              ...post,
              title: title.trim(),
              content: content.trim(),
            }
          : post
      );
    } else {
      nextPosts = [
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

    savePosts(nextPosts);
    resetForm();
    setCurrentPage(1);
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post.id);
  };

  const handleDelete = (id) => {
    savePosts(posts.filter((post) => post.id !== id));
  };

  const handleLike = (id) => {
    const nextPosts = posts.map((post) =>
      post.id === id ? { ...post, likes: (post.likes || 0) + 1 } : post
    );

    savePosts(nextPosts);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>불러오는 중...</div>
    );
  }

  return (
    <div style={{ width: "600px", margin: "0 auto", padding: "24px 0" }}>
      <h2>운동 커뮤니티 게시판</h2>

      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "8px", padding: "10px" }}
      />

      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          height: "120px",
          marginBottom: "8px",
          padding: "10px",
        }}
      />

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button onClick={handleSubmit}>
          {editId ? "수정하기" : "작성하기"}
        </button>
        {editId && <button onClick={resetForm}>취소</button>}
      </div>

      <hr />

      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        currentPosts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>{post.title}</h3>

            {post.date && (
              <p style={{ marginBottom: "8px", color: "#666" }}>{post.date}</p>
            )}
            <p style={{ color: "#888", fontSize: "14px", marginBottom: "4px" }}>
              작성자:{post.author}
            </p>
            <p style={{ whiteSpace: "pre-wrap", marginBottom: "12px" }}>
              {post.content}
            </p>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={() => handleLike(post.id)}>
                좋아요 {post.likes || 0}
              </button>
              <button onClick={() => handleEdit(post)}>수정</button>
              <button onClick={() => handleDelete(post.id)}>삭제</button>
            </div>
          </div>
        ))
      )}

      {posts.length > 0 && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              style={{
                fontWeight: currentPage === index + 1 ? "bold" : "normal",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}