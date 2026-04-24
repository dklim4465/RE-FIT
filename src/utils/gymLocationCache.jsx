const GYM_LOCATION_CACHE_KEY = "refit_gym_location_cache_v1";

export function readGymLocationCache() {
  try {
    const raw = localStorage.getItem(GYM_LOCATION_CACHE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeGymLocationCache(cache) {
  localStorage.setItem(GYM_LOCATION_CACHE_KEY, JSON.stringify(cache));
}

export function getCachedGymLocation(address) {
  const cache = readGymLocationCache();
  const cached = cache[address];
  //좌표 값이 숫자 타입이 아니면 null로
  if (typeof cached?.lat !== "number" || typeof cached?.lng !== "number") {
    return null;
  }

  return cached;
}

// 좌표를 주소 값으로 변환
export function saveCachedGymLocation(address, location) {
  if (!address) {
    return;
  }

  const cache = readGymLocationCache();
  cache[address] = {
    lat: location.lat,
    lng: location.lng,
    label: location.label || address,
    updatedAt: Date.now(),
  };
  writeGymLocationCache(cache);
}
