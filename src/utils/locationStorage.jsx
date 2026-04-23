export const DEFAULT_MAP_CENTER = {
  lat: 37.5665,
  lng: 126.978,
};

const SELECTED_LOCATION_KEY = "refit_selected_location";

export function saveSelectedLocation(location) {
  if (!location) {
    return;
  }

  localStorage.setItem(SELECTED_LOCATION_KEY, JSON.stringify(location));
}

export function readSelectedLocation() {
  const saved = localStorage.getItem(SELECTED_LOCATION_KEY);

  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved);

    if (
      typeof parsed?.lat !== "number" ||
      typeof parsed?.lng !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getReferenceLocation() {
  return readSelectedLocation() || DEFAULT_MAP_CENTER;
}

export function calculateDistanceKm(from, to) {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDiff = toRadians(to.lat - from.lat);
  const lngDiff = toRadians(to.lng - from.lng);
  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(lngDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}
