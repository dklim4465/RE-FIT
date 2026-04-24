import { useCallback, useEffect, useState } from "react";

const FAVORITE_IDS_STORAGE_KEY = "favoriteGymIds";
const FAVORITE_GYMS_STORAGE_KEY = "favoriteGyms";

const readJsonStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Failed to parse ${key}:`, error);
    return fallback;
  }
};

export const useGymFavorites = () => {
  const [favoriteGymIds, setFavoriteGymIds] = useState(() =>
    readJsonStorage(FAVORITE_IDS_STORAGE_KEY, []).map((id) => String(id))
  );
  const [favoriteGyms, setFavoriteGyms] = useState(() =>
    readJsonStorage(FAVORITE_GYMS_STORAGE_KEY, [])
  );

  useEffect(() => {
    localStorage.setItem(
      FAVORITE_IDS_STORAGE_KEY,
      JSON.stringify(favoriteGymIds)
    );
  }, [favoriteGymIds]);

  useEffect(() => {
    localStorage.setItem(FAVORITE_GYMS_STORAGE_KEY, JSON.stringify(favoriteGyms));
  }, [favoriteGyms]);

  const toggleFavorite = useCallback((gymOrId) => {
    const gymId = typeof gymOrId === "object" ? gymOrId?.id : gymOrId;
    if (!gymId) return;

    const targetId = String(gymId);

    setFavoriteGymIds((prevIds) => {
      const isFavorite = prevIds.includes(targetId);

      setFavoriteGyms((prevGyms) => {
        if (isFavorite) {
          return prevGyms.filter((gym) => String(gym.id) !== targetId);
        }

        if (typeof gymOrId !== "object" || !gymOrId?.id) {
          return prevGyms;
        }

        return [
          { ...gymOrId, id: targetId },
          ...prevGyms.filter((gym) => String(gym.id) !== targetId),
        ];
      });

      return isFavorite
        ? prevIds.filter((id) => id !== targetId)
        : [...prevIds, targetId];
    });
  }, []);

  const rememberFavoriteGym = useCallback((gym) => {
    if (!gym?.id) return;

    const targetId = String(gym.id);
    setFavoriteGyms((prevGyms) => {
      if (prevGyms.some((storedGym) => String(storedGym.id) === targetId)) {
        return prevGyms;
      }

      return [{ ...gym, id: targetId }, ...prevGyms];
    });
  }, []);

  return { favoriteGymIds, favoriteGyms, toggleFavorite, rememberFavoriteGym };
};
