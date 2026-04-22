import React from "react";
import { useNavigate } from "react-router-dom";
import { useListPage } from "../hooks/useListPage";
import GymItem from "../GymItem";

const GymListPage = ({ gyms }) => {
  const navigate = useNavigate();
  const {
    inputText,
    setInputText,
    filteredGyms,
    sortType,
    selectedRegion,
    setSearchParams,
    setPage,
    hasMore,
  } = useListPage(gyms);

  // 정렬이나 지역 변경 시 호출할 공통 함수
  const updateParams = (newParams) => {
    const currentParams = {
      search: inputText,
      sort: sortType,
      region: selectedRegion,
      ...newParams,
    };
    setSearchParams(currentParams);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>📍 헬스장 찾기</h2>

      {/* 검색 바 (데바운스 적용되어 있어 별도 handleSearch 없이도 작동) */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="헬스장 검색..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
      </div>

      {/* 필터 및 정렬 선택 */}
      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <select
          value={selectedRegion}
          onChange={(e) => updateParams({ region: e.target.value })}
        >
          <option value="전체">전체</option>
          <option value="성동구">성동구</option>
          <option value="용산구">용산구</option>
        </select>

        <select
          value={sortType}
          onChange={(e) => updateParams({ sort: e.target.value })}
        >
          <option value="ganada">가나다순</option>
          <option value="distance">거리순</option>
        </select>
      </div>

      {/* 리스트 출력 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {filteredGyms.map((gym) => (
          <div
            key={gym.id}
            onClick={() => navigate(`/gym/${gym.id}`)}
            style={{ cursor: "pointer" }}
          >
            <GymItem gym={gym} />
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      {hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          더 보기
        </button>
      )}
    </div>
  );
};

export default GymListPage;
