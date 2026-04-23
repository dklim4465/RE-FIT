import React, { useEffect, useState } from "react";

export default function CommunityCreatePage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [loading, setLoading] = useState(true);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  useEffect(() => {
    try {
      const result = localStorage.getItem("community-posts");
      if (result) setPosts(JSON.parse(result));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = (newPosts) => {
    localStorage.setItem("community-posts", JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    const now = new Date().toLocaleDateString("ko-KR");
    let newPosts;
    if (editId) {
      newPosts = posts.map((p) =>
        p.id === editId ? { ...p, title, content } : p
      );
      setEditId(null);
    } else {
      newPosts = [{ id: Date.now(), title, content, date: now }, ...posts];
    }

    save(newPosts);
    setTitle("");
    setContent("");
    setCurrentPage(1);
  };
  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post.id);
  };

  const handleDelete = async (id) => {
    save(posts.filter((p) => p.id !== id));
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>불러오는 중...</div>
    );

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

      {currentPosts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>

          <button onClick={() => handleEdit(post)}>수정</button>
          <button onClick={() => handleDelete(post.id)}>삭제</button>
        </div>
      ))}
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
