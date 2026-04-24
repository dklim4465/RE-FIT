import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import GymListFound from "./GymListFound";
import Papa from "papaparse";
import { useGymFavorites } from "../../../hooks/gyms/useGymFavorites";

const CSV_FILES = ["/gym_data.csv", "/gym_data2.csv"];
const normalizeText = (value = "") => value.trim().replace(/\s+/g, " ");

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

// --- 수정된 부분: 실제 데이터 + 가상 상세 정보 결합 ---
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

  return {
    // 1. 실제 데이터 (목록에 표시됨)
    id: rawId || `${sourceName}-${index + 1}`,
    name: normalizeText(name),
    address: normalizeText(address),
    region: getRegionFromAddress(address, sourceName),
    category,

    // 2. 가상 상세 데이터 (상세 페이지에서 용산구처럼 보이게 함)
    // 상세 페이지 컴포넌트에서 사용하는 변수명과 일치시켜주세요.
    phone: "02-1234-5678",
    description:
      "쾌적한 시설과 최신 기구를 갖춘 지역 최고의 피트니스 센터입니다. 전문가의 PT 서비스를 경험해보세요.",
    openingHours: "평일 06:00 ~ 23:00 / 주말 09:00 ~ 18:00",
    link: "https://map.naver.com", // 외부링크 연결용
    imageUrl: `https://loremflickr.com/400/300/gym?lock=${index}`, // 업체별 랜덤 이미지

    // 추가 레이아웃용 데이터
    distance: index + 1,
    isDiscount: (index + 1) % 2 === 0,
    discountLabel: "오늘의 할인!",
    discountText: "회원권 10% 할인",
  };
};

export default function GymListPage() {
  const [gymData, setGymData] = useState([]);
  const { favoriteGymIds, toggleFavorite } = useGymFavorites();

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

        // 가상 데이터 500개 생성 (기본 구조를 실제 데이터와 동일하게)
        const dummyData = Array.from({ length: 500 }, (_, i) => ({
          id: `dummy-${i}`,
          name: `[가상] 파워 헬스장 ${i + 1}호점`,
          address:
            i % 2 === 0 ? "서울시 성동구 행당동" : "서울시 용산구 한강로",
          region: i % 2 === 0 ? "성동구" : "용산구",
          category: "헬스장",
          phone: "010-0000-0000",
          description: "이 데이터는 테스트용 가상 데이터입니다.",
          openingHours: "24시간 운영",
          link: "https://www.naver.com",
          imageUrl: `https://loremflickr.com/400/300/fitness?lock=${i}`,
          distance: 100 + i,
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
        onToggleFavorite={toggleFavorite}
      />
      <Outlet />
    </section>
  );
}
