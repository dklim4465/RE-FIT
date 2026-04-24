import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import GymListFound from "./GymListFound";
import Papa from "papaparse";
import { useGymFavorites } from "../../../hooks/gyms/useGymFavorites";

const CSV_FILES = ["/gym_data.csv", "/gym_data2.csv"];
const normalizeText = (value = "") => value.trim().replace(/\s+/g, " ");
const SHUFFLED_IMAGE_LOCKS = [
  9143, 2381, 6728, 1057, 7492, 3816, 5269, 8604, 1925, 4377, 7031, 2986,
  9650, 1542, 6119, 8247, 3408, 7795, 4861, 2504, 5983, 1317, 8872, 4550,
  7196, 3064, 9401, 1688, 5335, 8012, 2749, 6506, 1124, 9777, 4218, 7563,
  3690, 5844, 2197, 8368, 4926, 1475, 6989, 3210, 9056, 5621, 7840, 2367,
  6302, 1889, 8475, 4093, 7214, 3558, 9906, 5167, 2641, 6750, 1236, 8924,
];

const getImageLock = (index, sourceName = "") => {
  const sourceShift = sourceName.includes("gym_data2") ? 23 : 0;
  const lockIndex =
    (index * 17 + sourceShift) % SHUFFLED_IMAGE_LOCKS.length;
  const cycleOffset =
    Math.floor((index * 17 + sourceShift) / SHUFFLED_IMAGE_LOCKS.length) *
    10000;

  return SHUFFLED_IMAGE_LOCKS[lockIndex] + cycleOffset;
};

const getDummyImageLock = (index) => {
  const lockIndex = (index * 19 + 7) % SHUFFLED_IMAGE_LOCKS.length;
  const cycleOffset = Math.floor((index * 19 + 7) / SHUFFLED_IMAGE_LOCKS.length) * 10000;

  return SHUFFLED_IMAGE_LOCKS[lockIndex] + 50000 + cycleOffset;
};

const getEventFlag = (seed) => {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }

  return hash % 5 < 2;
};

const decodeCsvBuffer = (buffer) => {
  const utf8Text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  if (!utf8Text.includes("\uFFFD")) return utf8Text;
  try {
    return new TextDecoder("euc-kr", { fatal: false }).decode(buffer);
  } catch {
    return utf8Text;
  }
};

const getRowValue = (row, keys) =>
  keys.map((key) => normalizeText(row[key] || "")).find(Boolean) || "";

const getRegionFromAddress = (address, sourceName) => {
  if (address.includes("성동구")) return "성동구";
  if (address.includes("용산구")) return "용산구";
  if (sourceName.includes("gym_data2")) return "용산구";
  if (sourceName.includes("gym_data.csv")) return "성동구";
  return "기타";
};

// --- 실제 데이터 매핑 함수 ---
const mapGymRow = (row, index, sourceName) => {
  const name = getRowValue(row, ["상호", "상호명", "업체명"]);
  const address = getRowValue(row, [
    "도로명주소",
    "소재지(도로명)",
    "지번주소",
    "소재지(지번)",
  ]);
  const category = getRowValue(row, ["업종"]) || "헬스장";
  const rawId = getRowValue(row, ["연번", "번호", "id"]);

  const eventSeed = `${sourceName}-${rawId}-${name}-${address}`;

  return {
    id: rawId || `${sourceName}-${index + 1}`,
    name: normalizeText(name),
    address: normalizeText(address),
    region: getRegionFromAddress(address, sourceName),
    category,

    // 상세 페이지용 가상 정보
    phone: "02-1234-5678",
    description:
      "쾌적한 시설과 최신 기구를 갖춘 지역 최고의 피트니스 센터입니다. 전문가의 PT 서비스를 경험해보세요.",
    openingHours: "평일 06:00 ~ 23:00 / 주말 09:00 ~ 18:00",
    link: "https://map.naver.com",

    imageUrl: `https://loremflickr.com/400/300/gym?lock=${getImageLock(
      index,
      sourceName
    )}`, // 덤벨/달리기/필라테스 제거

    distance: index + 1,
    isDiscount: getEventFlag(eventSeed),
    discountLabel: "EVENT !",
  };
};

export default function GymListPage() {
  const [gymData, setGymData] = useState([]);
  const { favoriteGymIds, favoriteGyms, toggleFavorite } = useGymFavorites();

  useEffect(() => {
    const loadGymData = async () => {
      try {
        const datasets = await Promise.all(
          CSV_FILES.map(async (filePath) => {
            const response = await fetch(filePath);
            const buffer = await response.arrayBuffer();
            const csvText = decodeCsvBuffer(buffer);
            const parsed = Papa.parse(csvText, {
              header: true,
              skipEmptyLines: true,
            });
            return parsed.data
              .map((row, index) => mapGymRow(row, index, filePath))
              .filter((gym) => gym.name && gym.address);
          })
        );

        const allRealData = datasets.flat();

        // 가상 데이터 500개 생성 로직
        const dummyData = Array.from({ length: 500 }, (_, i) => ({
          id: `dummy-${i}`,
          name: `[가상] 파워 피트니스 ${i + 1}호점`,
          address:
            i % 2 === 0 ? "서울시 성동구 행당동" : "서울시 용산구 한강로",
          region: i % 2 === 0 ? "성동구" : "용산구",
          category: "헬스장",
          phone: "010-0000-0000",
          description: "이 데이터는 테스트용 가상 데이터입니다.",
          openingHours: "24시간 운영",
          link: "https://www.naver.com",

          imageUrl: `https://loremflickr.com/400/300/fitness?lock=${getDummyImageLock(
            i
          )}`, // pilates/dumbbells/running 제거

          distance: 100 + i,
          isDiscount: getEventFlag(`dummy-${i}`),
        }));

        setGymData([...allRealData, ...dummyData]);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      }
    };
    loadGymData();
  }, []);

  return (
    <section className="page-placeholder">
      <GymListFound
        gyms={gymData}
        favoriteGymIds={favoriteGymIds}
        favoriteGyms={favoriteGyms}
        onToggleFavorite={toggleFavorite}
      />
      <Outlet />
    </section>
  );
}
