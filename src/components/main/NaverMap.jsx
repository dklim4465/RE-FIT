import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NearbyGymList from "./NearbyGymList";
import {
  DEFAULT_MAP_CENTER,
  readSelectedLocation,
  saveSelectedLocation,
} from "../../utils/locationStorage";
import { loadNaverMapSdk } from "../../utils/naverMap";
import { useNearbyGyms } from "../../hooks/gyms/useNearbyGyms";

function getManualLocationLabel(lat, lng) {
  return `선택 위치 (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
}

export default function NaverMap() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const nearbyMarkersRef = useRef([]);
  const nearbyInfoWindowsRef = useRef([]);

  const [error, setError] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() =>
    readSelectedLocation()
  );

  const { nearbyGyms, isLoadingGyms, isResolvingGyms } =
    useNearbyGyms(selectedLocation);

  // 사용자가 지도에서 고른 위치를 저장하고 기준 마커를 이동
  const moveToSelectedLocation = (location) => {
    if (!window.naver?.maps || !mapInstanceRef.current || !markerRef.current) {
      return;
    }

    const position = new window.naver.maps.LatLng(location.lat, location.lng);
    markerRef.current.setPosition(position);

    const nextLocation = {
      ...location,
      updatedAt: Date.now(),
    };

    saveSelectedLocation(nextLocation);
    setSelectedLocation(nextLocation);
  };

  function clearNearbyGymMarkers() {
    nearbyMarkersRef.current.forEach((marker) => marker.setMap(null));
    nearbyInfoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    nearbyMarkersRef.current = [];
    nearbyInfoWindowsRef.current = [];
  }

  useEffect(() => {
    let isMounted = true;
    let clickListener = null;

    async function initMap() {
      try {
        await loadNaverMapSdk();

        if (!isMounted || !mapRef.current || !window.naver?.maps) {
          return;
        }

        const savedLocation = readSelectedLocation();
        const lat = savedLocation?.lat ?? DEFAULT_MAP_CENTER.lat;
        const lng = savedLocation?.lng ?? DEFAULT_MAP_CENTER.lng;
        const center = new window.naver.maps.LatLng(lat, lng);

        const map = new window.naver.maps.Map(mapRef.current, {
          center,
          zoom: 14,
        });

        const marker = new window.naver.maps.Marker({
          position: center,
          map,
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;

        // 지도 클릭 위치를 새 기준점으로 저장하고 근처 5곳을 다시 계산
        clickListener = window.naver.maps.Event.addListener(
          map,
          "click",
          (event) => {
            const clickedPosition = event.coord;
            const clickedLat = clickedPosition.lat();
            const clickedLng = clickedPosition.lng();

            moveToSelectedLocation({
              lat: clickedLat,
              lng: clickedLng,
              source: "manual",
              address: getManualLocationLabel(clickedLat, clickedLng),
            });
          }
        );

        if (isMounted) {
          setIsMapReady(true);
          setError("");
        }
      } catch (sdkError) {
        console.error("네이버 지도 SDK를 준비하지 못했습니다.", sdkError);

        if (isMounted) {
          setIsMapReady(false);
          setError(
            sdkError instanceof Error
              ? sdkError.message
              : "네이버 지도를 불러오지 못했습니다."
          );
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;

      if (clickListener && window.naver?.maps?.Event) {
        window.naver.maps.Event.removeListener(clickListener);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMapReady || !window.naver?.maps || !mapInstanceRef.current) {
      return;
    }

    clearNearbyGymMarkers();

    nearbyGyms.forEach((gym, index) => {
      if (typeof gym.lat !== "number" || typeof gym.lng !== "number") {
        return;
      }

      const infoWindowLinkId = `nearby-gym-link-${index}-${String(gym.id).replace(/[^a-zA-Z0-9_-]/g, "")}`;
      const position = new window.naver.maps.LatLng(gym.lat, gym.lng);
      const marker = new window.naver.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: gym.name,
        zIndex: 110,
        icon: {
          content: `
            <div style="
              width: 30px;
              height: 30px;
              border-radius: 999px;
              background: #4f46e5;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: 700;
              border: 2px solid #ffffff;
              box-shadow: 0 8px 18px rgba(79, 70, 229, 0.35);
            ">${index + 1}</div>
          `,
          anchor: new window.naver.maps.Point(15, 15),
        },
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding: 10px 12px; min-width: 220px;">
            <a
              id="${infoWindowLinkId}"
              href="/gym/${gym.id}"
              style="display: block; margin-bottom: 6px; color: #111827; font-weight: 700; text-decoration: none; cursor: pointer;"
            >${gym.name}</a>
            <span style="color: #4b5563; line-height: 1.5;">${gym.address}</span>
          </div>
        `,
        borderWidth: 0,
        backgroundColor: "#ffffff",
        disableAnchor: false,
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        nearbyInfoWindowsRef.current.forEach((currentInfoWindow) => {
          currentInfoWindow.close();
        });
        infoWindow.open(mapInstanceRef.current, marker);

        requestAnimationFrame(() => {
          const linkElement = document.getElementById(infoWindowLinkId);

          if (!linkElement) {
            return;
          }

          linkElement.onclick = (event) => {
            event.preventDefault();
            navigate(`/gym/${gym.id}`, { state: { gym } });
          };
        });
      });

      nearbyMarkersRef.current.push(marker);
      nearbyInfoWindowsRef.current.push(infoWindow);
    });

    return () => {
      clearNearbyGymMarkers();
    };
  }, [isMapReady, nearbyGyms, navigate]);

  // 데이터 로딩 상태에 맞춰 근처 5곳 안내 문구만 간단히 표시
  const helperMessage = isLoadingGyms
    ? "gym_data를 불러오는 중입니다."
    : isResolvingGyms
      ? "헬스장 주소를 좌표로 변환하는 중입니다."
      : selectedLocation
        ? "선택한 위치 기준 가까운 헬스장 5곳입니다."
        : "지도에서 위치를 선택하면 가까운 헬스장 5곳이 표시됩니다.";

  return (
    <section className="naver-map-layout">
      {error && <p className="naver-map-error">{error}</p>}
      {!selectedLocation && (
        <p className="naver-map-select-message">위치를 선택해주세요</p>
      )}

      <div className="naver-map-board">
        {!isMapReady && (
          <div className="naver-map-placeholder">
            지도를 불러오고 있습니다...
          </div>
        )}
        <div
          ref={mapRef}
          className={`naver-map ${isMapReady ? "is-visible" : ""}`}
        />
      </div>

      <NearbyGymList nearbyGyms={nearbyGyms} helperMessage={helperMessage} />
    </section>
  );
}
