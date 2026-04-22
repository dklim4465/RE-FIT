import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_MAP_CENTER,
  readSelectedLocation,
  saveSelectedLocation,
} from "../../utils/locationStorage";

const NAVER_MAP_SCRIPT_ID = "naver-map-sdk";
const NAVER_MAP_KEY_ID =
  import.meta.env.VITE_NAVER_MAP_KEY_ID ||
  import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

function hasNaverMapSdk() {
  return Boolean(window.naver?.maps);
}

function hasNaverGeocoder() {
  return Boolean(window.naver?.maps?.Service);
}

function loadNaverMapSdk() {
  if (hasNaverMapSdk()) {
    return Promise.resolve(window.naver.maps);
  }

  if (!NAVER_MAP_KEY_ID) {
    return Promise.reject(
      new Error("네이버 지도 키가 설정되지 않았습니다.")
    );
  }

  const existingScript = document.getElementById(NAVER_MAP_SCRIPT_ID);

  if (existingScript) {
    if (hasNaverMapSdk()) {
      return Promise.resolve(window.naver.maps);
    }

    existingScript.remove();
  }

  return new Promise((resolve, reject) => {
    window.navermap_authFailure = () => {
      reject(
        new Error(
          "네이버 지도 API 인증에 실패했습니다. 콘솔의 Web 서비스 URL과 키를 확인해 주세요."
        )
      );
    };

    const script = document.createElement("script");
    script.id = NAVER_MAP_SCRIPT_ID;
    script.async = true;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_KEY_ID}&submodules=geocoder`;

    script.onload = () => {
      if (hasNaverMapSdk()) {
        resolve(window.naver.maps);
        return;
      }

      reject(new Error("네이버 지도 SDK는 로드되었지만 maps 객체를 찾지 못했습니다."));
    };

    script.onerror = () => {
      reject(new Error("네이버 지도 SDK 스크립트 로드에 실패했습니다."));
    };

    document.head.appendChild(script);
  });
}

function geocodeAddress(query) {
  return new Promise((resolve, reject) => {
    if (!hasNaverGeocoder()) {
      reject(new Error("주소 검색 모듈이 준비되지 않았습니다."));
      return;
    }

    window.naver.maps.Service.geocode({ query }, (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK) {
        reject(new Error("주소 검색에 실패했습니다."));
        return;
      }

      const items = response?.v2?.addresses || [];

      if (items.length === 0) {
        reject(new Error("검색한 주소를 찾을 수 없습니다."));
        return;
      }

      resolve(items[0]);
    });
  });
}

export default function NaverMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [error, setError] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isGeocoderReady, setIsGeocoderReady] = useState(false);

  const statusMessage = isMapReady
    ? error || "지도를 표시했습니다."
    : error || "지도를 불러오고 있습니다...";

  const moveToSelectedLocation = (location, message) => {
    if (!window.naver?.maps || !mapInstanceRef.current || !markerRef.current) {
      return;
    }

    const position = new window.naver.maps.LatLng(location.lat, location.lng);
    mapInstanceRef.current.setCenter(position);
    markerRef.current.setPosition(position);
    saveSelectedLocation({
      ...location,
      updatedAt: Date.now(),
    });
    setError(message);
  };

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        await loadNaverMapSdk();

        if (!isMounted || !mapRef.current || !window.naver?.maps) {
          return;
        }

        setIsGeocoderReady(hasNaverGeocoder());

        let lat = DEFAULT_MAP_CENTER.lat;
        let lng = DEFAULT_MAP_CENTER.lng;
        let message =
          "지도를 불러왔습니다. 주소 검색이나 지도 클릭으로 기준 위치를 선택할 수 있습니다.";
        const savedLocation = readSelectedLocation();

        if (savedLocation) {
          lat = savedLocation.lat;
          lng = savedLocation.lng;
          if (savedLocation.address) {
            setSearchQuery(savedLocation.address);
          }
          message = "선택한 위치를 기준으로 지도를 표시합니다.";
        }

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

        window.naver.maps.Event.addListener(map, "click", (event) => {
          const clickedPosition = event.coord;
          const clickedLat = clickedPosition.lat();
          const clickedLng = clickedPosition.lng();
          const confirmed = window.confirm(
            "이 위치를 현재 위치로 설정하시겠습니까?"
          );

          if (!confirmed) {
            return;
          }

          moveToSelectedLocation(
            {
              lat: clickedLat,
              lng: clickedLng,
              source: "manual",
            },
            "선택한 위치를 현재 위치로 설정했습니다."
          );
        });

        if (isMounted) {
          setIsMapReady(true);
          setError(message);
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

  const handleAddressSearch = async (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      setError("검색할 주소를 입력해 주세요.");
      return;
    }

    if (!isMapReady) {
      setError("지도가 준비된 뒤에 주소 검색을 사용할 수 있습니다.");
      return;
    }

    if (!isGeocoderReady) {
      setError("현재 지도 설정에서는 주소 검색 모듈을 사용할 수 없습니다.");
      return;
    }

    setIsSearchingAddress(true);

    try {
      const address = await geocodeAddress(query);
      const lat = Number(address.y);
      const lng = Number(address.x);
      const label = address.roadAddress || address.jibunAddress || query;

      moveToSelectedLocation(
        {
          lat,
          lng,
          source: "address-search",
          address: label,
        },
        `검색한 주소를 현재 위치로 설정했습니다: ${label}`
      );
      setSearchQuery(label);
    } catch (searchError) {
      console.error("주소 검색에 실패했습니다.", searchError);
      setError(
        searchError instanceof Error
          ? searchError.message
          : "주소 검색에 실패했습니다."
      );
    } finally {
      setIsSearchingAddress(false);
    }
  };

  return (
    <section className="naver-map-layout">
      <div className="naver-map-text-box">{statusMessage}</div>
      <form className="naver-map-search" onSubmit={handleAddressSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="주소를 입력하면 해당 위치를 기준 위치로 설정합니다"
        />
        <button
          type="submit"
          disabled={!isMapReady || isSearchingAddress || !isGeocoderReady}
        >
          {isSearchingAddress ? "검색 중..." : "주소로 위치 찾기"}
        </button>
      </form>
      <div className="naver-map-board">
        {!isMapReady && (
          <div className="naver-map-placeholder">지도를 불러오고 있습니다...</div>
        )}
        <div
          ref={mapRef}
          className={`naver-map ${isMapReady ? "is-visible" : ""}`}
        />
      </div>
    </section>
  );
}
