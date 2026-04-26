import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useListPage } from "../../../hooks/gyms/useListPage";
import GymItem from "./GymItem";

const GymListFound = ({
  gyms,
  favoriteGymIds = [],
  favoriteGyms = [],
  onToggleFavorite,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 초기 상태 설정
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

  // 찜 아이디 Set 생성
  const favoriteGymIdSet = useMemo(
    () => new Set(favoriteGymIds.map((id) => String(id))),
    [favoriteGymIds]
  );

  const storedFavoriteGyms = useMemo(
    () => favoriteGyms.filter((gym) => gym?.id),
    [favoriteGyms]
  );

  // 상세페이지에서 넘어올 때 처리
  useEffect(() => {
    if (location.state?.showFavorites) {
      setShowOnlyFavorites(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 화면에 보여줄 헬스장 리스트 연산
  const displayGyms = useMemo(() => {
    if (!showOnlyFavorites) return filteredGyms;
    const matchedGyms = allFilteredGyms.filter((gym) =>
      favoriteGymIdSet.has(String(gym.id))
    );
    const matchedGymIds = new Set(matchedGyms.map((gym) => String(gym.id)));
    const storedOnlyGyms = storedFavoriteGyms.filter(
      (gym) =>
        favoriteGymIdSet.has(String(gym.id)) &&
        !matchedGymIds.has(String(gym.id))
    );
    return [...matchedGyms, ...storedOnlyGyms];
  }, [
    showOnlyFavorites,
    allFilteredGyms,
    filteredGyms,
    favoriteGymIdSet,
    storedFavoriteGyms,
  ]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📍 헬스장 찾기</h2>

      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="어떤 헬스장을 찾으시나요?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          검색
        </button>
      </div>

      <div style={styles.filterSection}>
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          style={{
            ...styles.selectBox,
            backgroundColor: showOnlyFavorites ? "#7c5dfa" : "#fff",
            color: showOnlyFavorites ? "#fff" : "#7c5dfa",
          }}
        >
          {showOnlyFavorites ? "❤️ 찜 목록 " : "🤍 찜 보기"}
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
      </div>

      <div style={styles.listContainer}>
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
          <p style={styles.noResult}>결과가 없습니다.</p>
        )}
      </div>

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
  },
  searchSection: { marginBottom: "16px", display: "flex", gap: "10px" },
  searchInput: {
    flex: 1,
    padding: "14px 20px",
    borderRadius: "14px",
    border: "1px solid #f1f1f5",
    backgroundColor: "#f8f8fa",
    fontSize: "15px",
    outline: "none",
  },
  searchButton: {
    padding: "0 24px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#7c5dfa",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  filterSection: { marginBottom: "30px", display: "flex", gap: "10px" },
  selectBox: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #f1f1f5",
    flex: 1,
    fontSize: "14px",
    color: "#666",
    cursor: "pointer",
    outline: "none",
    textAlign: "center",
  },
  listContainer: { display: "flex", flexDirection: "column", gap: "16px" },
  itemWrapper: {
    cursor: "pointer",
    borderRadius: "18px",
    backgroundColor: "#fff",
    border: "1px solid #f8f8f8",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    overflow: "hidden",
  },
  noResult: { textAlign: "center", color: "#adb5bd", padding: "80px 0" },
  moreButton: {
    width: "100%",
    marginTop: "30px",
    padding: "16px",
    cursor: "pointer",
    backgroundColor: "#fff",
    border: "1px solid #f1f1f5",
    borderRadius: "14px",
    color: "#888",
  },
};

export default GymListFound;
