import { useState, useEffect } from "react";
import Papa from "papaparse";

export const useGymData = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const files = ["/gym_data.csv", "/gym_data2.csv"];

    const fetchPromises = files.map((file) =>
      fetch(file)
        .then((res) => {
          if (!res.ok) throw new Error(`${file} 로딩 실패`);
          return res.arrayBuffer();
        })
        .then((buffer) => {
          const decodedText = new TextDecoder("euc-kr").decode(buffer);
          return new Promise((resolve) => {
            Papa.parse(decodedText, {
              header: false,
              skipEmptyLines: true,
              complete: (results) => resolve(results.data.slice(1)),
            });
          });
        })
    );

    Promise.all(fetchPromises)
      .then((allDataGroups) => {
        const combinedData = allDataGroups
          .flat()
          .map((row, index) => ({
            id: String(index + 1),
            name: row[1] ? String(row[1]).trim() : "이름 없음",
            address: row[2] ? String(row[2]).trim() : "주소 없음",
            distance: parseFloat((Math.random() * 2 + 0.1).toFixed(1)),
          }))
          .filter((gym) => gym.name !== "이름 없음" && gym.name !== "상호명");

        console.log("최종 데이터 개수:", combinedData.length);
        setGyms(combinedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("데이터 병합 중 에러:", err);
        setLoading(false);
      });
  }, []);

  return { gyms, loading };
};
