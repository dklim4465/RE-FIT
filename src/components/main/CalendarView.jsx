import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import RoutineContent from "../routines/RoutineContent";
import {
  buildRoutineCalendarMap,
  formatDateKey,
} from "../../utils/routineCalendar";
//요일 받기
const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function RoutineCalendarModal({ selectedRoutineEntry, onClose }) {
  const selectedRoutine = selectedRoutineEntry?.routine;

  //루틴이 없으면 값이 어차피 없기 때문에
  if (!selectedRoutine) {
    return null;
  }

  return createPortal(
    <div
      className="routine-calendar-modal"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="routine-calendar-modal__panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-routine-title"
      >
        <div className="routine-calendar-modal__header">
          <div>
            <p className="routine-calendar-modal__eyebrow">
              {selectedRoutineEntry?.dateKey} {/* 운동 시작날짜 */}
            </p>
            <h3
              id="calendar-routine-title"
              className="routine-calendar-modal__title"
            >
              {selectedRoutine.name} {/* 루틴 이름 */}
            </h3>
          </div>

          <button
            type="button"
            className="routine-calendar-modal__close"
            onClick={onClose}
          >
            닫기
          </button>
        </div>

        <div className="routine-calendar-modal__meta">
          <span>목표: {selectedRoutine.goal}</span>
          <span>레벨: {selectedRoutine.level}</span>
          <span>운동 빈도: {selectedRoutine.days}</span>
          <span>운동 시간: {selectedRoutine.duration}</span>
          <span>장비: {selectedRoutine.equipment}</span>
          {selectedRoutine.notes && (
            <span>추가 요청사항: {selectedRoutine.notes}</span>
          )}
        </div>

        <div className="routine-calendar-modal__content">
          <RoutineContent content={selectedRoutine.content} />{" "}
          {/* 부모에게 루틴 받아오기 */}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function CalendarView() {
  const routines = useSelector((state) => state.routines.list);
  const [selectedRoutineEntry, setSelectedRoutineEntry] = useState(null);

  const routineCalendarMap = useMemo(
    () => buildRoutineCalendarMap(routines),
    [routines]
  );

  const handleRoutineItemClick = (event, item) => {
    event.stopPropagation();
    setSelectedRoutineEntry(item);
  };

  const handleCloseRoutineModal = () => {
    setSelectedRoutineEntry(null);
  };

  //이 아래는 달력 표시되는곳, 캘린더 메인 화면 보이는곳
  return (
    <>
      <div className="calendar-view">
        <h2 className="calendar-view-title">운동 기록 달력</h2>

        <Calendar
          className="routine-calendar"
          calendarType="gregory"
          formatShortWeekday={(_, date) => WEEKDAY_LABELS[date.getDay()]}
          tileContent={({ date }) => {
            const key = formatDateKey(date);
            const routineItems = routineCalendarMap[key] || [];

            if (!routineItems.length) {
              return null;
            }

            return (
              <ul className="routine-calendar-items">
                {routineItems.map((item) => (
                  <li key={item.id} className="routine-calendar-item is-ai">
                    <button
                      type="button"
                      className="routine-calendar-entry-button"
                      onClick={(event) => handleRoutineItemClick(event, item)}
                    >
                      AI {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </div>

      <RoutineCalendarModal
        selectedRoutineEntry={selectedRoutineEntry}
        // 여기도 루틴 받아오기
        onClose={handleCloseRoutineModal}
      />
    </>
  );
}
