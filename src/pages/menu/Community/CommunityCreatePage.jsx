import React, { useEffect, useState } from "react";

export default function CommunityCreatePage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);
  const handleSubmit = () => {
    if (!title || !content) return;

    if (editId) {
      setPosts(
        posts.map((p) => (p.id === editId ? { ...p, title, content } : p))
      );
    } else {
      setPosts([{ ...posts, id: Date.now(), title, content }]);
    }
    setTitle("");
    setContent("");
    setEditId(null);
  };
  const handleDelete = (id) => {
    const filtered = posts.filter((p) => p.id !== id);
    setPosts(filtered);
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post.id);
  };
  return (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <h2>운동 커뮤니티 게시판</h2>

      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "5px" }}
      />

      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", height: "80px" }}
      />

      <button onClick={handleSubmit}>{editId ? "수정하기" : "작성하기"}</button>

      <hr />

      {posts.length === 0 && <p>게시글이 없습니다.</p>}

      {posts.map((posts) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => handleEdit(post)}>수정</button>
          <button onClick={() => handleDelete(post.id)}>삭제</button>
        </div>
      ))}
    </div>
  );
}
