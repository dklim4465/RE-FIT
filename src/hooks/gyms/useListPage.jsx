import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useListPage = (initialGyms) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  // 1. URL에서 상태값 가져오기
  const urlSearch = searchParams.get("search") || "";
  const sortType = searchParams.get("sort") || "distance";
  const selectedRegion = searchParams.get("region") || "전체";

  // 2. 검색창 입력 상태
  const [inputText, setInputText] = useState(urlSearch);

  useEffect(() => {
    setInputText(urlSearch);
  }, [urlSearch]);

  // 3. 필터링 및 정렬 로직
  const filteredGyms = useMemo(() => {
    if (!initialGyms) return [];
    let result = [...initialGyms];

    // 지역 필터
    if (selectedRegion !== "전체") {
      result = result.filter((gym) => gym.region === selectedRegion);
    }

    // 검색어 필터
    if (urlSearch) {
      result = result.filter((gym) =>
        gym.name.toLowerCase().includes(urlSearch.toLowerCase())
      );
    }

    // 정렬
    if (sortType === "distance") {
      result.sort((a, b) => a.distance - b.distance);
    } else {
      // 한글 이름 기준 가나다순 정렬
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "ko-KR", {
          sensitivity: "base",
          numeric: true,
        })
      );
    }

    return result;
  }, [initialGyms, urlSearch, sortType, selectedRegion]);

  const updateSearchParams = (nextParams) => {
    setSearchParams({
      search: nextParams.search ?? urlSearch,
      sort: nextParams.sort ?? sortType,
      region: nextParams.region ?? selectedRegion,
    });
    setPage(1);
  };

  return {
    inputText,
    setInputText,
    filteredGyms: filteredGyms.slice(0, page * itemsPerPage),
    sortType,
    selectedRegion,
    setPage,
    hasMore: page * itemsPerPage < filteredGyms.length,
    handleSearch: () => updateSearchParams({ search: inputText }),
    updateParams: updateSearchParams,
  };
};
