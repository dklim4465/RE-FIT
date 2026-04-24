import { useMemo, useState } from "react";

export const useGymFilter = (initialGyms) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("distance");
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const filteredGyms = useMemo(() => {
    if (!initialGyms) return [];
    let result = [...initialGyms];

    // 1. 검색 필터링
    if (search) {
      result = result.filter((gym) => gym.name.includes(search));
    }

    // 2. 지점순 정렬-> 기존 지점순 + 가나다순/거리순 확장
    result.sort((a, b) => {
      const getNum = (name) => {
        const match = name.match(/(\d+)호점/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getNum(a.name) - getNum(b.name);
    });

    // 3. 무한 스크롤 자르기
    return result.slice(0, page * itemsPerPage);
  }, [initialGyms, search, page]); // sort가 바뀌어도 정렬 유지를 위해 의존성 관리

  return {
    search,
    setSearch,
    filteredGyms,
    setPage,
    hasMore: filteredGyms.length < initialGyms.length,
  };
};
