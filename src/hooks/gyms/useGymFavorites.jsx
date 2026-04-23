import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "favoriteGymIds";

export const useGymFavorites = () => {
  // 1. 초기 상태를 Lazy Initializer로 설정/ 불필요한 localStorage 접근 방지
  const [favoriteGymIds, setFavoriteGymIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("로컬 스토리지 파싱 에러:", error);
      return [];
    }
  });

  // 2. 상태가 변경될 때마다 동기화 [favoriteGymIds]
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteGymIds));
  }, [favoriteGymIds]);

  // 3. useCallback을 사용하여 함수 재생성 방지 (성능 최적화)
  // 리스트 아이템 내부에서 사용될 때 불필요한 리렌더링을 막아줍니다./의존성을 비워둬서
  const toggleFavorite = useCallback((gymId) => {
    setFavoriteGymIds((prev) => {
      const isFavorite = prev.includes(gymId);
      return isFavorite ? prev.filter((id) => id !== gymId) : [...prev, gymId];
    });
  }, []); //의존성을 비워두고 고정

  return {
    favoriteGymIds,
    toggleFavorite,
  };
};
