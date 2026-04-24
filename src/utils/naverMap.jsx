const NAVER_MAP_SCRIPT_ID = "naver-map-sdk";
const NAVER_MAP_KEY_ID =
  import.meta.env.VITE_NAVER_MAP_KEY_ID ||
  import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

let naverMapSdkPromise = null;

// 스크립트가 로드되어 window.naver.maps 객체를 사용할 수 있는지 확인
function hasNaverMapSdk() {
  return Boolean(window.naver?.maps);
}

// geocoder 서브모듈까지 준비되었는지 확인
function hasNaverGeocoder() {
  return Boolean(window.naver?.maps?.Service);
}

function waitForNaverGeocoder(timeoutMs = 5000, intervalMs = 50) {
  return new Promise((resolve, reject) => {
    if (hasNaverGeocoder()) {
      resolve(window.naver.maps);
      return;
    }

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (hasNaverGeocoder()) {
        window.clearInterval(timer);
        resolve(window.naver.maps);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(timer);
        reject(new Error("주소 검색 모듈이 준비되지 않았습니다."));
      }
    }, intervalMs);
  });
}

// 지도 SDK와 geocoder 모듈이 모두 준비될 때까지 기다림
export function loadNaverMapSdk() {
  if (hasNaverMapSdk() && hasNaverGeocoder()) {
    return Promise.resolve(window.naver.maps);
  }

  if (hasNaverMapSdk()) {
    return waitForNaverGeocoder();
  }

  if (naverMapSdkPromise) {
    return naverMapSdkPromise;
  }

  if (!NAVER_MAP_KEY_ID) {
    return Promise.reject(
      new Error("네이버 지도 키가 설정되지 않았습니다.")
    );
  }

  naverMapSdkPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(NAVER_MAP_SCRIPT_ID);

    if (existingScript) {
      existingScript.remove();
    }

    window.navermap_authFailure = () => {
      naverMapSdkPromise = null;
      reject(
        new Error(
          "네이버 지도 API 인증에 실패했습니다. 콘솔의 Web 서비스 URL과 키 설정을 확인해 주세요."
        )
      );
    };

    const script = document.createElement("script");
    script.id = NAVER_MAP_SCRIPT_ID;
    script.async = true;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_KEY_ID}&submodules=geocoder`;

    script.onload = async () => {
      if (!hasNaverMapSdk()) {
        naverMapSdkPromise = null;
        reject(
          new Error(
            "네이버 지도 SDK는 로드됐지만 maps 객체를 찾지 못했습니다."
          )
        );
        return;
      }

      try {
        await waitForNaverGeocoder();
        resolve(window.naver.maps);
      } catch (error) {
        naverMapSdkPromise = null;
        reject(error);
      }
    };

    script.onerror = () => {
      naverMapSdkPromise = null;
      reject(new Error("네이버 지도 SDK 스크립트 로드에 실패했습니다."));
    };

    document.head.appendChild(script);
  });

  return naverMapSdkPromise;
}

// 주소 문자열을 좌표 정보로 변환
export async function geocodeAddress(query) {
  await loadNaverMapSdk();

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

// 좌표를 사람이 읽을 수 있는 주소 문자열로 변환
export async function reverseGeocodeToAddress(lat, lng) {
  await loadNaverMapSdk();

  return new Promise((resolve, reject) => {
    if (!hasNaverGeocoder()) {
      reject(new Error("좌표를 주소로 바꿀 준비가 되지 않았습니다."));
      return;
    }

    window.naver.maps.Service.reverseGeocode(
      {
        coords: new window.naver.maps.LatLng(lat, lng),
      },
      (status, response) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          reject(new Error("좌표를 주소로 변환하지 못했습니다."));
          return;
        }

        const addressLabel =
          response?.v2?.address?.roadAddress ||
          response?.v2?.address?.jibunAddress ||
          response?.result?.items?.find((item) => item.isRoadAddress)?.address ||
          response?.result?.items?.[0]?.address ||
          "";

        if (!addressLabel) {
          reject(new Error("해당 좌표의 주소를 찾을 수 없습니다."));
          return;
        }

        resolve(addressLabel);
      }
    );
  });
}
