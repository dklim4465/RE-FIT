import React from "react";

// 1. 유튜브 검색 연동 함수 (검색 정확도 개선 버전)
const openYoutube = (keyword) => {
  if (!keyword || keyword === "-") return;

  // 불필요한 숫자(예: 1. 스쿼트) 제거 및 검색어 최적화
  const cleanKeyword = keyword.replace(/^\d+\.\s*/, "").trim();
  const query = encodeURIComponent(cleanKeyword + " 자세 가이드 정석 운동법");

  window.open(
    `https://www.youtube.com/results?search_query=${query}`,
    "_blank"
  );
};

function parseTable(lines) {
  const tableLines = lines.filter((line) => line.trim().startsWith("|"));
  if (tableLines.length < 2) return null;

  const toCells = (line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  const rows = tableLines.map(toCells).filter((row) => row.some(Boolean));
  if (rows.length < 2) return null;

  const [header, ...rest] = rows;
  const body = rest.filter(
    (row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, "")))
  );
  if (body.length === 0) return null;
  return { header, body };
}

function parseSections(content) {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const lines = normalized.split("\n");
  const sections = [];
  let currentSection = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const sectionMatch = line.match(/^\s*(\d+)\.\s*(.+)$/);

    if (sectionMatch) {
      currentSection = {
        id: sectionMatch[1],
        title: sectionMatch[2].trim(),
        lines: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) continue;
    if (!line.trim()) {
      currentSection.lines.push("");
      continue;
    }
    currentSection.lines.push(line);
  }
  return sections;
}

function renderList(lines) {
  const items = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  if (items.length > 0) {
    return (
      <ul className="routine-bullet-list">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            {item}
            <button onClick={() => openYoutube(item)} style={styles.miniBtn}>
              📺 운동영상
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="routine-paragraphs">
      {lines
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => (
          <p
            key={`${line}-${index}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {line}
            <button onClick={() => openYoutube(line)} style={styles.miniBtn}>
              📺 영상
            </button>
          </p>
        ))}
    </div>
  );
}

export default function RoutineContent({ content, isLoading = false }) {
  if (isLoading && !content) {
    return (
      <div className="routine-content-shell">
        <div className="routine-empty-state">루틴을 생성하는 중입니다...</div>
      </div>
    );
  }

  if (!content?.trim()) return null;

  const sections = parseSections(content);
  if (sections.length === 0) {
    return (
      <div className="routine-content-shell">
        <pre className="routine-raw-content">{content}</pre>
      </div>
    );
  }

  return (
    <div className="routine-content-shell">
      {sections.map((section) => {
        const table = section.id === "1" ? parseTable(section.lines) : null;

        return (
          <section key={section.id} className="routine-section-card">
            <div className="routine-section-heading">
              <span className="routine-section-index">{section.id}</span>
              <h3>{section.title}</h3>
            </div>

            {table ? (
              <div className="routine-table-scroll">
                <table className="routine-table">
                  <thead>
                    <tr>
                      {table.header.map((cell, index) => (
                        <th key={`${cell}-${index}`}>{cell}</th>
                      ))}
                      <th style={{ width: "60px" }}>영상</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.body.map((row, rowIndex) => (
                      <tr key={`row-${rowIndex}`}>
                        {table.header.map((_, cellIndex) => (
                          <td key={`cell-${rowIndex}-${cellIndex}`}>
                            {row[cellIndex] || "-"}
                          </td>
                        ))}
                        <td style={{ textAlign: "center" }}>
                          <span
                            style={{ cursor: "pointer", fontSize: "18px" }}
                            onClick={() => openYoutube(row[0])}
                          >
                            📺
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              renderList(section.lines)
            )}
          </section>
        );
      })}
    </div>
  );
}

const styles = {
  miniBtn: {
    padding: "4px 8px",
    fontSize: "12px",
    marginLeft: "15px",
    backgroundColor: "#fff",
    border: "1px solid #ff4d4f",
    color: "#ff4d4f",
    borderRadius: "6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontWeight: "600",
  },
};
