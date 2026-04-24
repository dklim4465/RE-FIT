import React, { useEffect, useState } from "react";

const STORAGE_KEY = "community-posts";
const POSTS_PER_PAGE = 10;

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
      }
    } catch (error) {
      console.error("게시글을 불러오는 중 오류가 발생했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
