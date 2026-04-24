import { useEffect, useState } from "react";
import { calculateDistanceKm } from "../../utils/locationStorage";
import { enrichGymsWithCoordinates, loadGymData } from "../../utils/gymData";

const NEARBY_GYM_LIMIT = 3;

function getNearbyGyms(gyms, selectedLocation) {
  if (!selectedLocation) {
    return [];
  }

  return gyms
    .filter((gym) => typeof gym.lat === "number" && typeof gym.lng === "number")
    .map((gym) => ({
      ...gym,
      distance: Number(
        calculateDistanceKm(selectedLocation, {
          lat: gym.lat,
          lng: gym.lng,
        }).toFixed(2)
      ),
    }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, NEARBY_GYM_LIMIT);
}

export function useNearbyGyms(selectedLocation) {
  const [gymData, setGymData] = useState([]);
  const [nearbyGyms, setNearbyGyms] = useState([]);
  const [isLoadingGyms, setIsLoadingGyms] = useState(false);
  const [isResolvingGyms, setIsResolvingGyms] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadNearbyGymData() {
      setIsLoadingGyms(true);
      setIsResolvingGyms(true);

      try {
        const gyms = await loadGymData();
        const gymsWithCoordinates = await enrichGymsWithCoordinates(gyms);

        if (!isMounted) {
          return;
        }

        setGymData(gymsWithCoordinates);
      } catch (gymError) {
        console.error("헬스장 데이터 로딩 실패:", gymError);

        if (isMounted) {
          setGymData([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingGyms(false);
          setIsResolvingGyms(false);
        }
      }
    }

    loadNearbyGymData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedLocation || gymData.length === 0) {
      setNearbyGyms([]);
      return;
    }

    setNearbyGyms(getNearbyGyms(gymData, selectedLocation));
  }, [gymData, selectedLocation]);

  return {
    nearbyGyms,
    isLoadingGyms,
    isResolvingGyms,
  };
}
