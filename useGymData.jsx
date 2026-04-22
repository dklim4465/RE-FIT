import { useState, useEffect } from "react";
import Papa from "papaparse";

export const useGymData = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/gym_data.csv")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const decodedText = new TextDecoder("euc-kr").decode(buffer);
        Papa.parse(decodedText, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const formattedData = results.data
              .slice(1)
              .map((row, index) => ({
                id: String(index + 1),
                name: row[1] ? String(row[1]).trim() : "이름 없음",
                address: row[2] ? String(row[2]).trim() : "주소 없음",
                distance: parseFloat((Math.random() * 2 + 0.1).toFixed(1)),
              }))
              .filter((gym) => gym.name !== "이름 없음");
            setGyms(formattedData);
            setLoading(false);
          },
        });
      });
  }, []);

  return { gyms, loading };
};
