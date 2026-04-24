import React, { useState, useEffect, useMemo } from "react"; // 수정 useMemo 추가
import { useNavigate, useLocation } from "react-router-dom";
import { useListPage } from "../../../hooks/gyms/useListPage";
import GymItem from "./GymItem";

const GymListFound = ({ gyms, favoriteGymIds = [], onToggleFavorite }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 추가상세 페이지에서 전달한 state를 받기 위함

  // 수정 초기 상태를 상세 페이지에서 넘어온 'showFavorites' 값에 따라 설정
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(
    location.state?.showFavorites || false
  );

  const {
    inputText,
    setInputText,
    allFilteredGyms,
    filteredGyms,
    sortType,
    selectedRegion,
    setPage,
    hasMore,
    handleSearch,
    updateParams,
  } = useListPage(gyms);

  const favoriteGymIdSet = useMemo(
    () => new Set(favoriteGymIds.map((id) => String(id))),
    [favoriteGymIds]
  );

  // 추가 상세 페이지에서 '목록 확인'을 눌러 이동했을 때 필터를 자동으로 켜주는 로직
  useEffect(() => {
    if (location.state?.showFavorites) {
      setShowOnlyFavorites(true);

      // 주소창의 state를 비워주어 새로고침 시 상태가 유지되지 않도록 관리 (선택 사항)
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  // ---------------------------------------------------------
  // [최적화] useMemo를 사용하여 리스트 필터링 연산을 메모이제이션합니다.
  // 데이터가 500개 이상일 때, 검색어나 찜 상태가 변하지 않으면 재연산하지 않습니다.
  // ---------------------------------------------------------
  const displayGyms = useMemo(() => {
    return showOnlyFavorites
      ? allFilteredGyms.filter((gym) => favoriteGymIdSet.has(String(gym.id)))
      : filteredGyms;
  }, [showOnlyFavorites, allFilteredGyms, filteredGyms, favoriteGymIdSet]);
  // ---------------------------------------------------------

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
        {/* 추가 찜 목록 토글 버튼*/}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          style={{
            ...styles.selectBox,
            backgroundColor: showOnlyFavorites ? "#7c5dfa" : "#fff",
            color: showOnlyFavorites ? "#fff" : "#7c5dfa",
            fontWeight: "bold",
            border: `1px solid ${showOnlyFavorites ? "#7c5dfa" : "#f1f1f5"}`,
            transition: "all 0.2s ease",
          }}
        >
          {showOnlyFavorites ? "❤️ 전체 보기 " : "🤍 찜"}
        </button>

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
        {/* 수정 filteredGyms 대신 필터가 완료된 displayGyms를 맵핑합니다. */}
        {displayGyms.length > 0 ? (
          displayGyms.map((gym) => (
            <div
              key={gym.id}
              onClick={() => navigate(`/gym/${gym.id}`, { state: { gym } })}
              style={styles.itemWrapper}
            >
              <GymItem
                gym={gym}
                isFavorite={favoriteGymIdSet.has(String(gym.id))}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))
        ) : (
          <p style={styles.noResult}>
            {/* 찜 목록이 비었을 때와 일반 검색 결과가 없을 때를 구분 */}
            {showOnlyFavorites
              ? "찜한 헬스장이 없습니다. 상세 정보에서 ❤️를 눌러보세요!"
              : "검색 결과가 없습니다."}
          </p>
        )}
      </div>

      {/* 찜 목록 보기 중에는 더보기 숨깁니다. */}
      {hasMore && !showOnlyFavorites && (
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
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "24px",
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
    backgroundColor: "#f8f8fa",
    fontSize: "15px",
    outline: "none",
    color: "#333",
    transition: "all 0.2s ease",
  },
  searchButton: {
    padding: "0 24px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#7c5dfa",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(124, 93, 250, 0.2)",
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
    appearance: "none",
    textAlign: "center",
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
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
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
