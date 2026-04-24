const ROUTINE_WINDOW_DAYS = 21;
const KOREAN_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

//운동날이 말도안되는 패턴으로 안들어가게 함
const PRACTICAL_WEEKDAY_PATTERNS = {
  1: [1],
  2: [1, 4],
  3: [1, 3, 5],
  4: [1, 2, 4, 6],
  5: [1, 2, 3, 5, 6],
  6: [1, 2, 3, 4, 5, 6],
  7: [0, 1, 2, 3, 4, 5, 6],
};

// 날짜 비교가 흔들리지 않도록 시간을 자정으로 맞춘다.
function startOfDay(date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

// CalendarView에서 공통으로 쓰는 날짜 키 형식이다.
export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// "주 3회" 같은 문자열에서 주간 운동 횟수만 숫자로 뽑아낸다.
function parseWeeklyFrequency(daysLabel = "") {
  const matched = String(daysLabel).match(/(\d+)/);
  const count = matched ? Number(matched[1]) : 0;
  return Math.min(Math.max(count, 0), 7);
}

// 저장된 시작일이나 생성일을 Date 객체로 안전하게 바꾼다.
function parseStoredDate(value) {
  if (!value) {
    return null;
  }

  const directDate = new Date(value);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  const matched = String(value).match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!matched) {
    return null;
  }

  const [, year, month, day] = matched;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

// AI가 만든 본문에 "월요일", "수요일"이 들어 있으면 그 요일 정보를 우선 사용한다.
function extractWeekdaysFromContent(content = "") {
  const matches = [...String(content).matchAll(/([월화수목금토일])요일/g)];
  const weekdays = [];
  const seen = new Set();

  matches.forEach((match) => {
    const index = KOREAN_WEEKDAYS.indexOf(match[1]);
    if (index >= 0 && !seen.has(index)) {
      seen.add(index);
      weekdays.push(index);
    }
  });

  return weekdays;
}

function sortFromAnchor(weekdays, anchorDay) {
  return [...weekdays].sort(
    (left, right) =>
      ((left - anchorDay + 7) % 7) - ((right - anchorDay + 7) % 7)
  );
}

function hasUnsafeConsecutiveTrainingDays(weekdays) {
  if (weekdays.length >= 6) {
    return false;
  }

  const weekdaySet = new Set(weekdays);
  return weekdays.some((weekday) => weekdaySet.has((weekday + 1) % 7));
}

// 실제 운동 루틴처럼 회복일이 섞인 추천 요일 패턴을 사용한다.
function buildPracticalWeekdays(count, anchorDay) {
  const pattern = PRACTICAL_WEEKDAY_PATTERNS[count] || [];
  return sortFromAnchor(pattern, anchorDay);
}

// 루틴 하나를 어떤 요일에 반복할지 확정한다.
function resolveRoutineWeekdays(routine, startDate) {
  const weeklyFrequency = parseWeeklyFrequency(routine.days);

  if (weeklyFrequency === 0) {
    return [];
  }

  const parsedWeekdays = extractWeekdaysFromContent(routine.content).slice(
    0,
    weeklyFrequency
  );

  if (
    parsedWeekdays.length === weeklyFrequency &&
    !hasUnsafeConsecutiveTrainingDays(parsedWeekdays)
  ) {
    return sortFromAnchor(parsedWeekdays, startDate.getDay());
  }

  return buildPracticalWeekdays(weeklyFrequency, startDate.getDay());
}

// 일정 생성 시작일은 저장된 시작일을 우선 쓰고, 과거면 오늘로 끌어올린다.
function getRoutineStartDate(routine, today) {
  const storedDate =
    parseStoredDate(routine.scheduleStartDate) ||
    parseStoredDate(routine.createdAt) ||
    today;

  return startOfDay(storedDate < today ? today : storedDate);
}

// 저장된 루틴 목록을 캘린더가 바로 쓸 수 있는 날짜별 맵으로 변환한다.
// 오늘부터 3주만 계산해서 넣기 때문에 불필요하게 데이터가 커지지 않는다.
export function buildRoutineCalendarMap(routines, today = new Date()) {
  const normalizedToday = startOfDay(today);
  const lastDate = new Date(normalizedToday);
  lastDate.setDate(lastDate.getDate() + ROUTINE_WINDOW_DAYS - 1);

  return routines.reduce((calendarMap, routine) => {
    const startDate = getRoutineStartDate(routine, normalizedToday);
    const weekdays = resolveRoutineWeekdays(routine, startDate);

    if (weekdays.length === 0) {
      return calendarMap;
    }

    for (
      let cursor = new Date(startDate);
      cursor <= lastDate;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      if (!weekdays.includes(cursor.getDay())) {
        continue;
      }

      const key = formatDateKey(cursor);
      const entry = {
        id: `${routine.id}-${key}`,
        dateKey: key,
        routineId: routine.id,
        name: routine.name,
        duration: routine.duration,
        routine,
      };

      if (!calendarMap[key]) {
        calendarMap[key] = [entry];
        continue;
      }

      calendarMap[key].push(entry);
    }

    return calendarMap;
  }, {});
}
