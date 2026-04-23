import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";

export const useListPage = (initialGyms) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  // 1. URL에서 상태값 가져오기
  const urlSearch = searchParams.get("search") || "";
  const sortType = searchParams.get("sort") || "distance";
  const selectedRegion = searchParams.get("region") || "전체";

  // 2. 검색창 실시간 입력을 위한 상태
  const [inputText, setInputText] = useState(urlSearch);
  const debouncedSearch = useDebounce(inputText, 300); // 0.3초 지연 검색

  // 3. 필터/검색 조건 변경 시 URL 업데이트 및 페이지 리셋
  useEffect(() => {
    setSearchParams({
      search: debouncedSearch,
      sort: sortType,
      region: selectedRegion,
    });
    setPage(1); // 조건이 바뀌면 다시 1페이지부터
  }, [debouncedSearch, sortType, selectedRegion, setSearchParams]);

  // 4. 필터링 및 정렬 로직
  const filteredGyms = useMemo(() => {
    if (!initialGyms) return [];
    let result = [...initialGyms];

    // 지역 필터
    if (selectedRegion !== "전체") {
      result = result.filter((gym) => gym.region === selectedRegion);
    }

    // 검색어 필터
    if (debouncedSearch) {
      result = result.filter((gym) =>
        gym.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // 정렬
    if (sortType === "distance") {
      result.sort((a, b) => a.distance - b.distance);
    } else {
      // 가나다순(지점 숫자순) 정렬
      const getNum = (name) => {
        const match = name.match(/(\d+)호점/);
        return match ? parseInt(match[1], 10) : 999;
      };
      result.sort((a, b) => getNum(a.name) - getNum(b.name));
    }

    return result;
  }, [initialGyms, debouncedSearch, sortType, selectedRegion]);

  return {
    inputText,
    setInputText,
    filteredGyms: filteredGyms.slice(0, page * itemsPerPage),
    sortType,
    selectedRegion,
    setPage,
    hasMore: page * itemsPerPage < filteredGyms.length,
    updateParams: (newParams) => {
      setSearchParams({
        search: inputText,
        sort: sortType,
        region: selectedRegion,
        ...newParams,
      });
    },
  };
};
