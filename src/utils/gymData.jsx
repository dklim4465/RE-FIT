import Papa from "papaparse";
import { getCachedGymLocation, saveCachedGymLocation } from "./gymLocationCache";
import { geocodeAddress, loadNaverMapSdk } from "./naverMap";

const CSV_FILES = ["/gym_data.csv", "/gym_data2.csv"];
const GEOCODE_BATCH_SIZE = 4;

const normalizeText = (value = "") => value.trim().replace(/\s+/g, " ");

function decodeCsvBuffer(buffer) {
  const utf8Text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);

  if (!utf8Text.includes("\uFFFD")) {
    return utf8Text;
  }

  try {
    return new TextDecoder("euc-kr", { fatal: false }).decode(buffer);
  } catch {
    return utf8Text;
  }
}

function getRowValue(row, keys) {
  return keys.map((key) => normalizeText(row[key] || "")).find(Boolean) || "";
}

function mapGymRow(row, index, sourceName) {
  const name = getRowValue(row, ["상호", "상호명", "업체명"]);
  const address = getRowValue(row, [
    "지번주소",
    "소재지(지번)",
    "소재지(지번주소)",
    "소재지(지번주소)",
  ]);
  const rawId = getRowValue(row, ["연번", "번호", "id"]);

  return {
    id: rawId || `${sourceName}-${index + 1}`,
    name,
    address,
  };
}

export async function loadGymData() {
  const datasets = await Promise.all(
    CSV_FILES.map(async (filePath) => {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`${filePath} 파일을 불러오지 못했습니다.`);
      }

      const buffer = await response.arrayBuffer();
      const csvText = decodeCsvBuffer(buffer);
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        console.error(`${filePath} CSV 파싱 오류:`, parsed.errors);
      }

      return parsed.data
        .map((row, index) => mapGymRow(row, index, filePath))
        .filter((gym) => gym.name && gym.address);
    })
  );

  return datasets.flat();
}

export async function enrichGymsWithCoordinates(gyms) {
  await loadNaverMapSdk();

  const gymsWithCoordinates = [];
  const unresolvedGyms = [];

  gyms.forEach((gym) => {
    const cachedLocation = getCachedGymLocation(gym.address);

    if (cachedLocation) {
      gymsWithCoordinates.push({
        ...gym,
        lat: cachedLocation.lat,
        lng: cachedLocation.lng,
      });
      return;
    }

    unresolvedGyms.push(gym);
  });

  for (let index = 0; index < unresolvedGyms.length; index += GEOCODE_BATCH_SIZE) {
    const batch = unresolvedGyms.slice(index, index + GEOCODE_BATCH_SIZE);
    const resolvedBatch = await Promise.all(
      batch.map(async (gym) => {
        try {
          const address = await geocodeAddress(gym.address);
          const location = {
            lat: Number(address.y || address.point?.y),
            lng: Number(address.x || address.point?.x),
            label:
              address.roadAddress ||
              address.jibunAddress ||
              address.address ||
              gym.address,
          };

          saveCachedGymLocation(gym.address, location);

          return {
            ...gym,
            lat: location.lat,
            lng: location.lng,
          };
        } catch (error) {
          console.warn(`헬스장 주소 좌표 변환 건너뜀: ${gym.address}`, error);
          return gym;
        }
      })
    );

    gymsWithCoordinates.push(...resolvedBatch);
  }

  return gymsWithCoordinates;
}
