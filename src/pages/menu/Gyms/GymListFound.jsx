import React from "react";
import { useNavigate } from "react-router-dom";
import { useListPage } from "../../../hooks/gyms/useListPage";
import GymItem from "./GymItem";

const GymListFound = ({ gyms, favoriteGymIds = [], onToggleFavorite }) => {
  const navigate = useNavigate();

  const {
    inputText,
    setInputText,
    filteredGyms,
    sortType,
    selectedRegion,
    setPage,
    hasMore,
    handleSearch,
    updateParams,
  } = useListPage(gyms);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        <span style={{ fontSize: "1.4rem" }}>📍</span> 헬스장 찾기
      </h2>

      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="어떤 헬스장을 찾으시나요?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={styles.searchInput}
        />
        <button
          type="button"
          onClick={handleSearch}
          style={styles.searchButton}
        >
          검색
        </button>
      </div>

      <div style={styles.filterSection}>
        <select
          value={selectedRegion}
          onChange={(e) => updateParams({ region: e.target.value })}
          style={styles.selectBox}
        >
          <option value="전체">전체 지역</option>
          <option value="용산구">용산구</option>
          <option value="성동구">성동구</option>
        </select>

        <select
          value={sortType}
          onChange={(e) => updateParams({ sort: e.target.value })}
          style={styles.selectBox}
        >
          <option value="distance">거리순</option>
          <option value="ganada">가나다순</option>
        </select>
      </div>

      <div style={styles.listContainer}>
        {filteredGyms.length > 0 ? (
          filteredGyms.map((gym) => (
            <div
              key={gym.id}
              onClick={() => navigate(`/gym/${gym.id}`, { state: { gym } })}
              style={styles.itemWrapper}
            >
              <GymItem
                gym={gym}
                isFavorite={favoriteGymIds.includes(gym.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))
        ) : (
          <p style={styles.noResult}>검색 결과가 없습니다.</p>
        )}
      </div>

      {hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          style={styles.moreButton}
        >
          결과 더 보기
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 24px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "24px", // 컨테이너도 둥글게 처리
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "32px",
    fontSize: "1.6rem",
    fontWeight: "800",
    color: "#222",
    letterSpacing: "-0.5px",
  },
  searchSection: {
    marginBottom: "16px",
    display: "flex",
    gap: "10px",
  },
  searchInput: {
    flex: 1,
    padding: "14px 20px",
    borderRadius: "14px",
    border: "1px solid #f1f1f5",
    backgroundColor: "#f8f8fa", // 약간의 보라색 기가 도는 연회색
    fontSize: "15px",
    outline: "none",
    color: "#333",
    transition: "all 0.2s ease",
  },
  searchButton: {
    padding: "0 24px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#7c5dfa", // 상단 바와 어울리는 포인트 보라색
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(124, 93, 250, 0.2)", // 버튼 입체감
  },
  filterSection: {
    marginBottom: "30px",
    display: "flex",
    gap: "10px",
  },
  selectBox: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #f1f1f5",
    flex: 1,
    fontSize: "14px",
    color: "#666",
    backgroundColor: "#fff",
    cursor: "pointer",
    outline: "none",
    appearance: "none", // 기본 화살표 스타일 초기화 //cursor: "pointer"랑 같은 말
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  itemWrapper: {
    cursor: "pointer",
    padding: "4px",
    borderRadius: "18px",
    transition: "all 0.2s ease",
    backgroundColor: "#fff",
    border: "1px solid #f8f8f8",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)", // 카드 그림자
  },
  noResult: {
    textAlign: "center",
    color: "#adb5bd",
    padding: "80px 0",
    fontSize: "15px",
  },
  moreButton: {
    width: "100%",
    marginTop: "30px",
    padding: "16px",
    cursor: "pointer",
    backgroundColor: "#fff",
    border: "1px solid #f1f1f5",
    borderRadius: "14px",
    fontSize: "14px",
    color: "#888",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
};
export default GymListFound;
