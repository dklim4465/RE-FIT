import React from "react";
import { useNavigate } from "react-router-dom";
import { useListPage } from "../../../hooks/gyms/useListPage";
import GymItem from "./GymItem";

const GymListFound = ({ gyms }) => {
  const navigate = useNavigate();

  const {
    inputText,
    setInputText,
    filteredGyms,
    sortType,
    selectedRegion,
    setPage,
    hasMore,
    updateParams,
  } = useListPage(gyms);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        📍 헬스장 찾기
      </h2>

      {/* 검색창 */}
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

      {/* 필터 선택 */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <select
          value={selectedRegion}
          onChange={(e) => updateParams({ region: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", flex: 1 }}
        >
          <option value="전체">전체 지역</option>
          <option value="용산구">용산구</option>
          <option value="성동구">성동구</option>
        </select>

        <select
          value={sortType}
          onChange={(e) => updateParams({ sort: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", flex: 1 }}
        >
          <option value="distance">거리순</option>
          <option value="ganada">가나다순</option>
        </select>
      </div>

      {/* 리스트 출력 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {filteredGyms.length > 0 ? (
          filteredGyms.map((gym) => (
            <div
              
              onClick={() => navigate(`/gym/${gym.id}`)}
              style={{ cursor: "pointer" }}
            >
              <GymItem gym={gym} />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#999", padding: "40px 0" }}>
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      {/* 더보기 버튼 */}
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

export default GymListFound;
