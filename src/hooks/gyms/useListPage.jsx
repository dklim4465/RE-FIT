import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import GymListFound from "./GymListFound";
import Papa from "papaparse";
import { useGymFavorites } from "../hooks/useGymFavorites"; // 훅 경로 확인 필요

const CSV_FILES = ["/gym_data.csv", "/gym_data2.csv"];

// 텍스트 정규화 (공백 제거 등)
const normalizeText = (value = "") => value.trim().replace(/\s+/g, " ");

// [수정] 더 강력한 디코딩 로직 (인코딩 깨짐 방어)
const decodeCsvBuffer = (buffer) => {
  try {
    // 1. 먼저 UTF-8로 시도 (fatal: true로 설정하여 에러 감지)
    const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
    return utf8Decoder.decode(buffer);
  } catch (e) {
    // 2. 실패 시 한국어 전용 인코딩(EUC-KR)으로 재시도
    console.warn("UTF-8 디코딩 실패, EUC-KR로 읽어옵니다.");
    return new TextDecoder("euc-kr").decode(buffer);
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

// [수정] ID 고정 로직: 데이터 내용을 기반으로 생성하여 영속성 유지
const mapGymRow = (row, index, sourceName) => {
  const name = getRowValue(row, ["상호", "상호명", "업체명"]);
  const address = getRowValue(row, [
    "도로명주소",
    "소재지(도로명)",
    "지번주소",
    "소재지(지번)",
  ]);
  const category = getRowValue(row, ["업종"]);
  const rawId = getRowValue(row, ["연번", "번호", "id"]);

  // 데이터 내용(이름+주소)을 조합해 고유 ID 생성 (문자열 강제 변환)
  // 파일이 깨져서 이름이 바뀌더라도, 최소한 이 로직이 있어야 나중에 복구 시 찜 목록이 다시 매칭됩니다.
  const uniqueId = rawId
    ? String(rawId)
    : `${name}-${address}`.replace(/\s+/g, "");

  return {
    id: uniqueId,
    name: normalizeText(name),
    address: normalizeText(address),
    category,
    region: getRegionFromAddress(address, sourceName),
    distance: index + 1,
    price: "",
    rating: "",
    isDiscount: (index + 1) % 2 === 0,
    discountLabel: "오늘의 할인!",
    discountText: "회원권 10% 할인",
  };
};

export default function GymListPage() {
  const [gymData, setGymData] = useState([]);

  // [추가] 찜 상태와 토글 함수를 가져옵니다.
  const { favoriteGymIds, toggleFavorite } = useGymFavorites();

  useEffect(() => {
    const loadGymData = async () => {
      try {
        const datasets = await Promise.all(
          CSV_FILES.map(async (filePath) => {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`${filePath} 로드 실패`);

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

        // 성능 테스트용 더미 데이터 (id를 고정하여 생성)
        const dummyData = Array.from({ length: 5000 }, (_, i) => ({
          id: `dummy-${i}`,
          name: `[테스트] 파워 헬스장 ${i + 1}호점`,
          address:
            i % 2 === 0 ? "서울시 성동구 행당동" : "서울시 용산구 한강로",
          category: "체력단련장업",
          region: i % 2 === 0 ? "성동구" : "용산구",
          distance: 100 + i,
          price: "",
          rating: "",
          isDiscount: i % 5 === 0,
          discountLabel: "성능테스트!",
          discountText: "가상화 리스트 테스트 중",
        }));

        setGymData([...allRealData, ...dummyData]);
      } catch (err) {
        console.error("헬스장 데이터 로딩 실패:", err);
      }
    };

    loadGymData();
  }, []);

  return (
    <section className="page-placeholder">
      <h3>
        {/* [수정] 자식 컴포넌트에 찜 관련 props를 확실히 넘겨줍니다. */}
        <GymListFound
          gyms={gymData}
          favoriteGymIds={favoriteGymIds}
          toggleFavorite={toggleFavorite}
        />
      </h3>
      <Outlet />
    </section>
  );
}
