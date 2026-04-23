import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "favoriteGymIds";

export const useGymFavorites = () => {
  const [favoriteGymIds, setFavoriteGymIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // [방어] 저장된 ID들을 문자열 배열로 강제 변환
      return stored ? JSON.parse(stored).map((id) => String(id)) : [];
    } catch (error) {
      console.error("로컬 스토리지 파싱 에러:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteGymIds));
  }, [favoriteGymIds]);

  const toggleFavorite = useCallback((gymId) => {
    if (!gymId) return;

    // [방어] 들어오는 ID도 무조건 문자열로 변환하여 비교
    const targetId = String(gymId);

    setFavoriteGymIds((prev) => {
      const isFavorite = prev.includes(targetId);
      return isFavorite
        ? prev.filter((id) => id !== targetId)
        : [...prev, targetId];
    });
  }, []);

  return { favoriteGymIds, toggleFavorite };
};
