import { createSlice } from "@reduxjs/toolkit";

function loadFromStorage() {
  try {
    const saved = localStorage.getItem("fitai_routines");
    if (saved === null) {
      return [];
    }

    return JSON.parse(saved);
  } catch {
    return [];
  }
}

const initialState = {
  list: loadFromStorage(),
  currentId: null,
  page: "list",
};

const routineSlice = createSlice({
  name: "routines",
  initialState,
  reducers: {
    addRoutine(state, action) {
      state.list.unshift(action.payload);
      localStorage.setItem("fitai_routines", JSON.stringify(state.list));
    },
    updateRoutine(state, action) {
      const { id, ...updatedFields } = action.payload;
      const targetIndex = state.list.findIndex((routine) => routine.id === id);

      if (targetIndex === -1) {
        return;
      }

      state.list[targetIndex] = {
        ...state.list[targetIndex],
        ...updatedFields,
      };
      localStorage.setItem("fitai_routines", JSON.stringify(state.list));
    },
    deleteRoutine(state, action) {
      state.list = state.list.filter((routine) => routine.id !== action.payload);
      localStorage.setItem("fitai_routines", JSON.stringify(state.list));
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setCurrentId(state, action) {
      state.currentId = action.payload;
    },
  },
});

export const {
  addRoutine,
  updateRoutine,
  deleteRoutine,
  setPage,
  setCurrentId,
} = routineSlice.actions;

export default routineSlice.reducer;
