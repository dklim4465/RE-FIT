import { useEffect, useRef, useState } from "react";

const NAVER_MAP_SCRIPT_ID = "naver-map-sdk";
const NAVER_MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

function loadNaverMapSdk() {
  if (window.naver?.maps) {
    return Promise.resolve(window.naver.maps);
  }

  if (!NAVER_MAP_CLIENT_ID) {
    return Promise.reject(
      new Error("VITE_NAVER_MAP_CLIENT_ID 환경 변수가 설정되지 않았습니다.")
    );
  }

  const existingScript = document.getElementById(NAVER_MAP_SCRIPT_ID);

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener(
        "load",
        () => {
          if (window.naver?.maps) {
            resolve(window.naver.maps);
            return;
          }

          reject(
            new Error("네이버 지도 SDK는 로드되었지만 maps 객체를 찾지 못했습니다.")
          );
        },
        { once: true }
      );
      existingScript.addEventListener(
        "error",
        () => reject(new Error("네이버 지도 SDK를 불러오지 못했습니다.")),
        { once: true }
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = NAVER_MAP_SCRIPT_ID;
    script.async = true;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_CLIENT_ID}`;

    script.onload = () => {
      if (window.naver?.maps) {
        resolve(window.naver.maps);
        return;
      }

      reject(
        new Error("네이버 지도 SDK는 로드되었지만 maps 객체를 찾지 못했습니다.")
      );
    };

    script.onerror = () => {
      reject(new Error("네이버 지도 SDK 스크립트 로딩에 실패했습니다."));
    };

    document.head.appendChild(script);
  });
}

export default function NaverMap() {
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        await loadNaverMapSdk();

        if (!isMounted || !mapRef.current || !window.naver?.maps) {
          return;
        }

        const center = new window.naver.maps.LatLng(37.5665, 126.978);
        const map = new window.naver.maps.Map(mapRef.current, {
          center,
          zoom: 14,
        });

        new window.naver.maps.Marker({
          position: center,
          map,
        });

        if (isMounted) {
          setIsMapReady(true);
          setError("");
        }
      } catch (sdkError) {
        console.error("네이버 지도 SDK가 준비되지 않았습니다.", sdkError);

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
    };
  }, []);

  return (
    <section className="naver-map-layout">
      <div className="naver-map-text-box">
        {error ? error : "텍스트 들어갈 공간"}
      </div>
      <div className="naver-map-board">
        {!isMapReady && <div className="naver-map-placeholder">지도 위치</div>}
        <div
          ref={mapRef}
          className={`naver-map ${isMapReady ? "is-visible" : ""}`}
        />
      </div>
    </section>
  );
}
