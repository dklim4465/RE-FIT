import React, { useEffect, useMemo, useRef, useState } from "react";
import GymItem from "./GymItem";
import {
  calculateDistanceKm,
  getReferenceLocation,
} from "../../../utils/locationStorage";

function createGymSeedData() {
  const base = getReferenceLocation();

  return Array.from({ length: 500 }, (_, index) => {
    const ring = Math.floor(index / 25) + 1;
    const angle = ((index * 37) % 360) * (Math.PI / 180);
    const latOffset = Math.cos(angle) * 0.0032 * ring;
    const lngOffset = Math.sin(angle) * 0.0041 * ring;
    const lat = base.lat + latOffset;
    const lng = base.lng + lngOffset;
    const distance = calculateDistanceKm(base, { lat, lng });

    return {
      id: index + 1,
      name: `RE:FIT 헬스장 ${index + 1}호점`,
      lat,
      lng,
      distance: Number(distance.toFixed(1)),
      price: Math.floor(Math.random() * 51 + 20) * 1000,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
    };
  }).sort((a, b) => a.distance - b.distance);
}

const GymListFound = () => {
  const [rawData, setRawData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const observerTarget = useRef(null);
  const referenceLocation = useMemo(() => getReferenceLocation(), []);

  useEffect(() => {
    setRawData(createGymSeedData());
  }, []);

  const displayedGyms = rawData.slice(0, page * 10);
  const hasMore = displayedGyms.length < rawData.length;

  useEffect(() => {
    if (!observerTarget.current || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [hasMore]);

  if (selectedId) {
    const selectedGym = rawData.find((gym) => gym.id === selectedId);

    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "30px",
            borderRadius: "15px",
          }}
        >
          <h2>{selectedGym?.name}</h2>
          <p>
            📍 거리: {selectedGym?.distance}km | 💰 가격:{" "}
            {selectedGym?.price.toLocaleString()}원
          </p>
          <p>선택한 기준 위치에서 가까운 순으로 계산된 상세 정보입니다.</p>
          <button
            onClick={() => setSelectedId(null)}
            style={{ marginBottom: "20px" }}
          >
            ← 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>RE:FIT 헬스장 검색</h2>
      <p style={{ textAlign: "center", color: "#4b5563" }}>
        기준 위치: 위도 {referenceLocation.lat.toFixed(4)} / 경도{" "}
        {referenceLocation.lng.toFixed(4)}
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {displayedGyms.map((gym) => (
          <GymItem key={gym.id} gym={gym} onSelect={setSelectedId} />
        ))}
      </div>

      <div
        ref={observerTarget}
        style={{
          height: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9f9f9",
          marginTop: "10px",
          borderRadius: "10px",
          fontWeight: "bold",
        }}
      >
        {hasMore
          ? "더 많은 헬스장 로딩 중..."
          : "모든 헬스장을 확인했습니다."}
      </div>
    </div>
  );
};

export default GymListFound;
