# 🏋️‍♂️ RE-FIT: 사용자 맞춤형 헬스장 큐레이션 서비스
> **공공데이터와 AI 로직을 결합한 스마트 피트니스 탐색 플랫폼**

본 프로젝트는 흩어져 있는 지역별 체육시설 데이터를 통합하고, 사용자의 위치와 취향에 맞는 최적의 운동 환경을 제안하기 위해 기획되었습니다. 단순한 정보 나열을 넘어, **데이터 정규화와 UX 최적화**를 통해 실질적인 편의성을 제공하는 데 집중했습니다.

---

## 🎯 1. 프로젝트 기획 의도
* **정보의 파편화 해결**: 여러 출처(CSV)로 나뉜 지역별 헬스장 정보를 하나로 통합하여 제공합니다.
* **사용자 중심 정렬**: 단순 가나다순이 아닌, 사용자가 인지하기 쉬운 '지점 번호' 중심의 논리적 정렬 알고리즘을 구현했습니다.
* **심리적 접근성 강화**: 찜 기능과 AI 기반의 루틴 추천을 통해 사용자가 운동을 시작하기까지의 심리적 문턱을 낮추고자 했습니다.

## 👥 2. 팀원 소개 및 역할 (Team Members)

| 팀원 | 역할 | 주요 기여 및 기술적 성취 |
| :--- | :--- | :--- |
| **대한 (A)** | **Architecture & Base Design** | • **Infra**: 초기 환경 설정 및 `Feature-Branch` 기반 아키텍처 설계<br>• **Base Layout**: 메인 페이지 골격(HTML) 및 전역 CSS 시스템 구축<br>• **Auth**: JWT 기반 로그인 로직 및 `Protected Route` 권한 관리<br>• **AI Core**: AI 엔진 연동을 위한 데이터 정규화 및 Fallback 로직 설계 |
| **가인 (B)** | **Main UX & Performance** | • **Detail UX**: 메인/목록/상세 페이지의 세부 인터페이스 고도화 및 유저 흐름 설계<br>• **Optimization**: `react-window` 가상 스크롤을 통한 리스트 성능 80% 이상 개선<br>• **Search Logic**: `useDebounce`, `useGymFilter` 등 커스텀 훅을 통한 검색 엔진 구현<br>• **Interactions**: 지도 연동 마커 시스템 및 찜/할인 이벤트 등 실무 기능 구현 |
| **승진 (C)** | **Feature CRUD & Calendar** | • **Content CRUD**: 운동 루틴 및 커뮤니티 게시판의 전체 CRUD 기능 개발<br>• **Calendar Service**: `react-calendar` 기반의 일정 관리 및 AI 루틴 데이터 자동 연동<br>• **State Management**: 복잡한 루틴 수정/삭제 로직의 상태 관리 최적화 |

## 🛠️ 사용 라이브러리 및 버전
---
```JSON
{
  "dependencies": {
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "@reduxjs/toolkit": "^2.11.2",
    "react-redux": "^9.2.0",
    "redux": "^5.0.1",
    "redux-devtools-extension": "^2.13.9",
    "react-router-dom": "^7.14.1",
    "axios": "^1.15.2",
    "papaparse": "^5.5.3",
    "react-window": "^2.2.7",
    "react-virtualized": "^9.22.6",
    "react-calendar": "^6.0.1",
    "@types/navermaps": "^3.9.1",
    "sass": "^1.93.2",
    "styled-components": "^6.1.19",
    "classnames": "^2.5.1",
    "react-icons": "^5.5.0",
    "web-vitals": "^4.2.4"
  }
}
```
## 🛠 3. 기술 스택 (Tech Stack)

| 분류 | 기술 스택 | 활용 목적 |
| :--- | :--- | :--- |
| **Frontend** | **React 19** | UI 컴포넌트 설계 및 Hook 기반 상태 관리 |
| **State** | **Redux / Context API** | 사용자 인증 상태 및 전역 데이터 흐름 관리 |
| **Routing** | **React Router Dom** | SPA 구현 및 URL 파라미터 기반 상태 동기화 |
| **Data** | **PapaParse** | 대규모 CSV 데이터 실시간 파싱 및 정규화 처리 |
| **AI / Map** | **Llama 3 / Kakao Map** | 맞춤형 운동 루틴 생성 및 지도 기반 위치 시각화 |

---

## ✨ 4. 핵심 기능 (Key Features)

| 기능 | 상세 구현 내용 | 실무적 해결 과제 |
| :--- | :--- | :--- |
| **📍 관심 목록 CRUD** | 즐겨찾기 생성/조회/수정/삭제 구현 | `localStorage` 연동으로 데이터 영속성 확보 |
| **🔍 지능형 검색/정렬** | 무한 스크롤 및 지점별 논리 정렬 | `useMemo`와 정규식을 통한 연산 최적화 |
| **💬 스마트 문의 시스템** | 전화번호 포매팅 및 유효성 검사 | `Regex`를 활용한 입력 데이터 무결성 보장 |
| **⚡ 성능 최적화** | 컴포넌트 메모이제이션 및 스플리팅 | `memo`, `lazy`로 렌더링 부하 및 초기 로딩 개선 |
| **📱 반응형 UI** | 모바일/태블릿/PC 최적화 레이아웃 | 미디어 쿼리를 통한 기바별 사용자 경험(UX) 극대화 |

---

## ⚡ 5. 주요 성능 최적화 상세 (Performance Analysis)

### 🏎 렌더링 성능 90.4% 개선 (Profiler 측정)
대규모 헬스장 리스트 탐색 시 발생하는 병목 현상을 해결하기 위해 React Profiler를 도입, 총 4단계에 걸친 최적화를 진행했습니다.

| 단계 | 최적화 기법 | 렌더링 소요 시간 | 개선율 |
| :--- | :--- | :--- | :--- |
| **Step 1** | 초기 구현 상태 (최적화 전) | **27.2ms** | - |
| **Step 2** | `React.memo` 적용 | **12.7ms** | **53.3% ↓** |
| **Step 3** | **가상 스크롤 도입 (`react-window`)** | **2.6ms** | **90.4% ↓** |

---

### 🔍 단계별 성능 분석 지표

#### 1️⃣ 최적화 전 (Step 1) : 27.2ms
* **현상**: 상태 변경 시 모든 리스트 항목이 불필요하게 재렌더링됨.
![Step1_초기상태]<img width="1237" height="518" alt="KakaoTalk_20260427_091941875" src="https://github.com/user-attachments/assets/91943992-e59b-4a1d-aa0f-ecb8a66bb5bb" />


#### 2️⃣ 메모이제이션 적용 (Step 2) : 12.7ms
* **해결**: `React.memo`를 통해 Props 변화가 없는 컴포넌트의 렌더링을 차단.
![Step2_메모적용]<img width="1236" height="441" alt="KakaoTalk_20260427_091949114" src="https://github.com/user-attachments/assets/fc52df57-ae47-4355-b9e8-8e3975dae638" />


#### 3️⃣ 가상 스크롤 및 최종 최적화 (Step 3) : 2.6ms
* **해결**: `react-window`를 활용하여 실제 화면에 보이는 요소만 렌더링하도록 최적화.
![Step3_가상화적용]<img width="1217" height="548" alt="KakaoTalk_20260427_092017139" src="https://github.com/user-attachments/assets/020d7d60-b3cf-4f2d-9264-879b27fd2f1e" />


#### 4️⃣ 리스트 컴포넌트 재사용성 확인
* **결과**: 메모이제이션이 완벽하게 적용되어 재렌더링 없이 컴포넌트가 재사용되는 구조 확인.
![Step4_재사용확인]<img width="1402" height="279" alt="KakaoTalk_20260427_092023098" src="https://github.com/user-attachments/assets/4d6d9935-939e-4522-93cc-e6ea5de09533" />


---

### 🛠 세부 최적화 및 데이터 전략
* **연산 부하 제어 (Debounce)**: 검색어 입력 시 발생하는 빈번한 필터링 연산을 지연 처리하여 브라우저 부하를 최적화했습니다.
* **메모이제이션 (Memoization)**: `useMemo`와 `useCallback`을 통해 데이터 변경이 없는 아이템의 불필요한 연산을 방지했습니다.
* **가상화 (Virtualization)**: `react-window`를 활용해 뷰포트 영역만 렌더링하여 메모리 점유율을 최소화했습니다.
* **데이터 무결성 확보**: 외부 소스마다 다른 ID 타입을 정규화하고, `TextDecoder`를 통해 공공데이터의 인코딩 문제를 해결했습니다.

---

### 🛠 세부 최적화 및 데이터 전략

* **연산 부하 제어 (Debounce)**
    * 검색어 입력 시마다 발생하는 빈번한 필터링 연산을 지연 처리하여 브라우저 부하를 최적화했습니다.
* **메모이제이션 (Memoization)**
    * `useMemo`와 `useCallback`을 적극 활용하여, 500개 이상의 아이템 중 실제 데이터 변경이 일어난 요소만 리렌더링되도록 제어했습니다.
* **가상화 (Virtualization)**
    * `react-window`를 활용해 뷰포트 영역만 실시간 렌더링하여 메모리 점유율을 최소화했습니다.
* **데이터 무결성 확보 (Data Integrity)**
    * 외부 소스마다 다른 ID 타입을 `String(id)`으로 정규화하고, `TextDecoder`를 통해 공공데이터의 한글 인코딩 깨짐 현상을 해결했습니다.
* **한국어 정렬 최적화 (Intl.Collator)**
    * 단순 유니코드 비교가 아닌, `Intl.Collator`를 활용하여 한국어 로케일에 맞는 논리적 정렬을 구현했습니다.
---

## 🧐 Technical Challenge & Resolution
> **데이터 불일치 대응 및 UX 개선**
> 
> 실제 공공데이터는 형식이 일정하지 않은 경우가 많았습니다. 이미지가 누락된 데이터에는 고유 락(Lock) 기반의 시드 이미지를 배정하여 시각적 일관성을 유지하고, 비정형 주소 데이터에서 구 단위 지역을 추출하는 로직을 구현했습니다. 이는 단순 기능 구현을 넘어 실무 환경에서 마주할 수 있는 변수들을 직접 고민하고 해결하는 경험이었습니다.
> 

