import React from "react";
import { useNavigate } from "react-router-dom";
import { useListPage } from "../hooks/useListPage";
import GymItem from "../GymItem";

const GymListPage = ({ gyms }) => {
  const navigate = useNavigate();

  // 훅에서 필터 관련 상태들을 가져옵니다.
  const {
    inputText,
    setInputText,
    filteredGyms,
    sortType,
    selectedRegion, // 지역 상태
    setSearchParams,
    setPage,
    hasMore,
  } = useListPage(gyms);

  // 필터나 정렬이 바뀔 때 URL을 업데이트하는 함수
  const updateParams = (newParams) => {
    setSearchParams({
      search: inputText,
      sort: sortType,
      region: selectedRegion,
      ...newParams,
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        📍 헬스장 찾기
      </h2>

      {/* 검색 바 */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* 필터 및 정렬 영역 (여기에서 지역을 선택합니다) */}
      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        {/* 지역 필터 추가 (용산구, 성동구 등) */}
        <select
          value={selectedRegion}
          onChange={(e) => updateParams({ region: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", flex: 1 }}
        >
          <option value="전체">전체 지역</option>
          <option value="용산구">용산구</option>
          <option value="성동구">성동구</option>
          <option value="강남구">강남구</option>
        </select>

        {/* 정렬 필터 */}
        <select
          value={sortType}
          onChange={(e) => updateParams({ sort: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", flex: 1 }}
        >
          <option value="ganada">가나다순</option>
          <option value="distance">거리순</option>
        </select>
      </div>

      {/* 리스트 출력 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {filteredGyms.length > 0 ? (
          filteredGyms.map((gym) => (
            <div
              key={gym.id}
              onClick={() => navigate(`/gym/${gym.id}`)}
              style={{ cursor: "pointer" }}
            >
              <GymItem gym={gym} />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#999", padding: "40px 0" }}>
            해당 지역에 검색 결과가 없습니다.
          </p>
        )}
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
            backgroundColor: "#f8f9fa",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          결과 더 보기
        </button>
      )}
    </div>
  );
};

export default GymListPage;
