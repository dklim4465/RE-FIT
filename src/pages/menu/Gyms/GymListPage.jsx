import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import GymListFound from "./GymListFound";
import Papa from "papaparse";

export default function GymListPage() {

  const [gymData, setGymData] = useState([]);

  useEffect(() => {
    // public 폴더에 있으면 주소로 바로 접근 가능합니다.
    Papa.parse("./gym_data.csv", {
      download: true,
      header: true,
      skipEmptyLines: true, // 빈 줄 방지
      complete: (results) => {
        console.log("파싱 결과:", results.data);
        setGymData(results.data);
      },
      error: (err) => {
        console.error("CSV 파싱 에러:", err);
      }
    });
  }, []);

  return (
    <section className="page-placeholder">
      <h1>헬스장</h1>
      <h3>
        <GymListFound gyms={gymData}/>
      </h3>
      <Outlet />
    </section>
  );
}
