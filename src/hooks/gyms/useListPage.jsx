import { useMemo, useState } from "react";

const DEFAULT_ITEMS_PER_PAGE = 10;
const DEFAULT_REGION = "전체";
const DEFAULT_SORT = "distance";

export function useListPage(gyms = []) {
  const [inputText, setInputText] = useState("");
  const [sortType, setSortType] = useState(DEFAULT_SORT);
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_REGION);
  const [page, setPage] = useState(1);

  const setSearchParams = ({
    search = inputText,
    sort = sortType,
    region = selectedRegion,
  }) => {
    setInputText(search);
    setSortType(sort);
    setSelectedRegion(region);
    setPage(1);
  };

  const filteredGyms = useMemo(() => {
    let result = Array.isArray(gyms) ? [...gyms] : [];

    if (inputText.trim()) {
      const keyword = inputText.trim().toLowerCase();
      result = result.filter((gym) =>
        [gym.name, gym.address, gym.region]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword))
      );
    }

    if (selectedRegion !== DEFAULT_REGION) {
      result = result.filter((gym) => {
        const region = gym.region || gym.address || "";
        return String(region).includes(selectedRegion);
      });
    }

    result.sort((a, b) => {
      if (sortType === "ganada") {
        return String(a.name || "").localeCompare(String(b.name || ""), "ko");
      }

      return Number(a.distance || 0) - Number(b.distance || 0);
    });

    return result.slice(0, page * DEFAULT_ITEMS_PER_PAGE);
  }, [gyms, inputText, page, selectedRegion, sortType]);

  const totalFilteredCount = useMemo(() => {
    let result = Array.isArray(gyms) ? [...gyms] : [];

    if (inputText.trim()) {
      const keyword = inputText.trim().toLowerCase();
      result = result.filter((gym) =>
        [gym.name, gym.address, gym.region]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword))
      );
    }

    if (selectedRegion !== DEFAULT_REGION) {
      result = result.filter((gym) => {
        const region = gym.region || gym.address || "";
        return String(region).includes(selectedRegion);
      });
    }

    return result.length;
  }, [gyms, inputText, selectedRegion]);

  return {
    inputText,
    setInputText,
    filteredGyms,
    sortType,
    selectedRegion,
    setSearchParams,
    page,
    setPage,
    hasMore: filteredGyms.length < totalFilteredCount,
  };
}

export default useListPage;
