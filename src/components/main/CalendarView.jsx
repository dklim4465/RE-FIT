import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView() {
  const [workouts, setWorkouts] = useState({});

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDateClick = (date) => {
    const key = formatDate(date);
    const input = prompt("운동 내용을 입력하세요.");

    if (!input) return;

    setWorkouts((prev) => {
      const prevData = prev[key] || [];

      return {
        ...prev,
        [key]: [...prevData, input],
      };
    });
  };

  const handleDelete = (date, index) => {
    const key = formatDate(date);

    setWorkouts((prev) => {
      const newArr = (prev[key] || []).filter((_, i) => i !== index);

      return {
        ...prev,
        [key]: newArr,
      };
    });
  };

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <h2>운동 기록 달력</h2>

      <Calendar
        onClickDay={handleDateClick}
        tileContent={({ date }) => {
          const key = formatDate(date);
          const items = workouts[key];

          if (!items?.length) {
            return null;
          }

          return (
            <ul style={{ fontSize: "10px", padding: 0, margin: 0 }}>
              {items.map((item, i) => (
                <li key={i} style={{ listStyle: "none" }}>
                  {item}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(date, i);
                    }}
                    style={{
                      marginLeft: "5px",
                      cursor: "pointer",
                    }}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          );
        }}
      />
    </div>
  );
}
