import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import GymListFound from "./GymListFound";
import Papa from "papaparse";

const CSV_FILES = ["/gym_data.csv", "/gym_data2.csv"];

const decodeCsvBuffer = (buffer) => {
  const utf8Text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);

  if (!utf8Text.includes("\uFFFD")) {
    return utf8Text;
  }

  try {
    return new TextDecoder("euc-kr", { fatal: false }).decode(buffer);
  } catch {
    return utf8Text;
  }
};

const getRowValue = (row, keys) =>
  keys.map((key) => row[key]?.trim()).find(Boolean) || "";

const getRegionFromAddress = (address) => {
  if (address.includes("성동구")) return "성동구";
  if (address.includes("용산구")) return "용산구";
  return "기타";
};

const mapGymRow = (row, index, sourceName) => {
  const name = getRowValue(row, ["상호", "상호명", "업체명"]);
  const address = getRowValue(row, [
    "도로명주소",
    "소재지(도로명)",
    "지번주소",
    "소재지(지번)",
  ]);
  const category = getRowValue(row, ["업종", "업태"]);
  const rawId = getRowValue(row, ["연번", "번호", "id"]);

  return {
    id: rawId || `${sourceName}-${index + 1}`,
    name,
    address,
    category,
    region: getRegionFromAddress(address),
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

  useEffect(() => {
    const loadGymData = async () => {
      try {
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
              console.error(`${filePath} CSV 파싱 에러:`, parsed.errors);
            }

            return parsed.data
              .map((row, index) => mapGymRow(row, index, filePath))
              .filter((gym) => gym.name && gym.address);
          })
        );

        setGymData(datasets.flat());
      } catch (err) {
        console.error("헬스장 데이터 로딩 에러:", err);
      }
    };

    loadGymData();
  }, []);

  return (
    <section className="page-placeholder">
      <h3>
        <GymListFound gyms={gymData} />
      </h3>
      <Outlet />
    </section>
  );
}
