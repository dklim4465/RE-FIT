import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRoutine, deleteRoutine, setCurrentId } from "../../store/routineSlice";
import { requestRoutinePlan } from "./useFetch";

export function useAiRoutine() {
  const dispatch = useDispatch();
  const routerNavigate = useNavigate();
  const routines = useSelector((state) => state.routines.list);

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const generate = async (params) => {
    setIsLoading(true);
    setIsVisible(true);
    setContent("");

    try {
      const generatedRoutine = await requestRoutinePlan(params);
      setContent(generatedRoutine);
    } catch (error) {
      setContent(
        error instanceof Error
          ? error.message
          : "루틴 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveRoutine = (routineData) => {
    dispatch(
      addRoutine({
        id: Date.now().toString(),
        createdAt: new Date().toLocaleDateString("ko-KR"),
        scheduleStartDate: new Date().toISOString(),
        ...routineData,
      })
    );
  };

  const viewRoutine = (id) => {
    dispatch(setCurrentId(id));
    routerNavigate(`/ai-routine/${id}`);
  };

  const removeRoutine = (id) => {
    dispatch(deleteRoutine(id));
  };

  const navigate = (target) => {
    if (target === "generate" || target === "create") {
      routerNavigate("/ai-routine/create");
      return;
    }

    routerNavigate("/ai-routine");
  };

  const reset = () => {
    setContent("");
    setIsVisible(false);
  };

  return {
    routines,
    content,
    isLoading,
    isVisible,
    generate,
    saveRoutine,
    viewRoutine,
    removeRoutine,
    navigate,
    reset,
  };
}
