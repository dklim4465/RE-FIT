import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import GymItem from "../GymItem";

const GymListPage = () => {
  const [gyms, setGyms] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. URL 파라미터에서 상태 읽기
  const searchTerm = searchParams.get("search") || "";
  const sortType = searchParams.get("sort") || "ganada"; // 기본: 가나다순
  const selectedRegion = searchParams.get("region") || "전체"; // 기본: 전체

  const [inputText, setInputText] = useState(searchTerm);
  const [page, setPage] = useState(1);

  // 2. CSV 데이터 로드 (EUC-KR 대응)
  useEffect(() => {
    fetch("/gym_data.csv")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const decoder = new TextDecoder("euc-kr");
        const decodedText = decoder.decode(buffer);
        Papa.parse(decodedText, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const realData = results.data.slice(1);
            const formattedData = realData
              .map((row, index) => ({
                id: index + 1,
                name: row[1] ? String(row[1]).trim() : "이름 없음",
                address: row[2] ? String(row[2]).trim() : "주소 없음",
                // 거리 데이터가 없으면 랜덤 생성 (정렬 확인용)
                distance: parseFloat((Math.random() * 2 + 0.1).toFixed(1)),
              }))
              .filter(
                (gym) => gym.name !== "이름 없음" && gym.name !== "상호명"
              );
            setGyms(formattedData);
          },
        });
      });
  }, []);

  // 3. 검색 및 필터 변경 시 URL 업데이트
  const updateParams = (newParams) => {
    setPage(1); // 필터 변경 시 페이지 초기화
    setSearchParams({
      search: inputText,
      sort: sortType,
      region: selectedRegion,
      ...newParams,
    });
  };

  // 4. 핵심 로직: 지역 필터 + 검색 + 가나다순 정렬 (useMemo)
  const processedGyms = useMemo(() => {
    if (!gyms.length) return [];

    let result = [...gyms];

    // [필터] 지역 선택 (용산구, 성동구 등)
    if (selectedRegion !== "전체") {
      result = result.filter((gym) => gym.address.includes(selectedRegion));
    }

    // [필터] 검색어
    if (searchTerm.trim() !== "") {
      result = result.filter(
        (gym) =>
          gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gym.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // [정렬] 가나다순 vs 거리순
    if (sortType === "ganada" || sortType === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (sortType === "distance") {
      result.sort((a, b) => a.distance - b.distance);
    }

    return result;
  }, [gyms, searchTerm, sortType, selectedRegion]);

  // 5. 페이지네이션
  const visibleGyms = processedGyms.slice(0, page * 15);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>📍 헬스장 찾기</h2>

      {/* 검색 바 */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && updateParams({ search: inputText })
          }
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={() => updateParams({ search: inputText })}
          style={{ padding: "10px", cursor: "pointer" }}
        >
          검색
        </button>
      </div>

      {/* 지역 및 정렬 필터 */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <select
          value={selectedRegion}
          onChange={(e) => updateParams({ region: e.target.value })}
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="전체">전체 지역</option>
          <option value="용산구">용산구</option>
          <option value="성동구">성동구</option>
        </select>

        <select
          value={sortType}
          onChange={(e) => updateParams({ sort: e.target.value })}
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="ganada">가나다순</option>
          <option value="distance">거리순</option>
        </select>
      </div>

      {/* 리스트 출력 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {visibleGyms.map((gym) => (
          <div
            key={gym.id}
            onClick={() => navigate(`/gym/${gym.id}`)}
            style={{ cursor: "pointer" }}
          >
            <GymItem gym={gym} />
          </div>
        ))}
        {visibleGyms.length === 0 && (
          <p style={{ textAlign: "center", color: "#999" }}>
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      {/* 더 보기 */}
      {processedGyms.length > visibleGyms.length && (
        <button
          onClick={() => setPage((p) => p + 1)}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          결과 더 보기 ({visibleGyms.length} / {processedGyms.length})
        </button>
      )}
    </div>
  );
};

export default GymListPage;
