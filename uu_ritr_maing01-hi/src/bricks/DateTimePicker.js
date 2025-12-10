import { useState, useEffect, useRef, useMemo } from "react";
import "../styles/bricks/createTournamentModal.css";

export default function DateTimePicker({ value, onChange, label, locale = "en" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef(null);

  // Memoize localized strings and format preferences
  const { days, months, is12Hour } = useMemo(() => {
    const validLocale = locale || "en";

    const dayNames = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(2021, 7, 1 + i);
      dayNames.push(new Intl.DateTimeFormat(validLocale, { weekday: "short" }).format(date).slice(0, 2));
    }

    const monthNames = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(2021, i, 1);
      monthNames.push(new Intl.DateTimeFormat(validLocale, { month: "long" }).format(date));
    }

    // Check if locale uses 12-hour format
    const testDate = new Date(2021, 0, 1, 13, 0, 0);
    const parts = new Intl.DateTimeFormat(validLocale, { hour: "numeric" }).formatToParts(testDate);
    const is12 = parts.some((part) => part.type === "dayPeriod");

    return { days: dayNames, months: monthNames, is12Hour: is12 };
  }, [locale]);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setViewDate(date);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(viewDate.getFullYear());
    newDate.setMonth(viewDate.getMonth());
    newDate.setDate(day);

    setSelectedDate(newDate);
    triggerChange(newDate);
  };

  const handleTimeChange = (type, val) => {
    const newDate = new Date(selectedDate);

    if (type === "hour" || type === "minute") {
      let newVal = parseInt(val);
      if (isNaN(newVal)) return;

      if (type === "hour") {
        if (is12Hour) {
          // Handle 12-hour input (1-12)
          const pm = newDate.getHours() >= 12;
          newVal = Math.min(12, Math.max(1, newVal));

          if (newVal === 12) {
            newDate.setHours(pm ? 12 : 0);
          } else {
            newDate.setHours(pm ? newVal + 12 : newVal);
          }
        } else {
          // Handle 24-hour input (0-23)
          newVal = Math.min(23, Math.max(0, newVal));
          newDate.setHours(newVal);
        }
      } else {
        // minute
        newVal = Math.min(59, Math.max(0, newVal));
        newDate.setMinutes(newVal);
      }
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      if (val === "PM" && currentHours < 12) {
        newDate.setHours(currentHours + 12);
      } else if (val === "AM" && currentHours >= 12) {
        newDate.setHours(currentHours - 12);
      }
    }

    setSelectedDate(newDate);
    triggerChange(newDate);
  };

  const triggerChange = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date - offset).toISOString().slice(0, 16);
    onChange(localISOTime);
  };

  const changeMonth = (increment) => {
    const newViewDate = new Date(viewDate);
    newViewDate.setMonth(newViewDate.getMonth() + increment);
    setViewDate(newViewDate);
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

      calendarDays.push(
        <div key={day} className={`calendar-day ${isSelected ? "selected" : ""}`} onClick={() => handleDateClick(day)}>
          {day}
        </div>,
      );
    }

    return calendarDays;
  };

  const formatDisplayDate = (date) => {
    if (!date || isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(locale || "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: is12Hour,
    }).format(date);
  };

  const getDisplayHour = () => {
    const hours = selectedDate.getHours();
    if (is12Hour) {
      if (hours === 0) return 12;
      if (hours > 12) return hours - 12;
      return hours;
    }
    return hours;
  };

  return (
    <div className="date-time-picker-container" ref={containerRef}>
      {label && <label>{label}</label>}
      <div className="date-input-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          readOnly
          className="form-control"
          value={formatDisplayDate(selectedDate)}
          placeholder="Select date and time"
        />
        <span className="calendar-icon">📅</span>
      </div>

      {isOpen && (
        <div className="picker-dropdown">
          <div className="calendar-header">
            <button onClick={() => changeMonth(-1)}>&lt;</button>
            <span>
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button onClick={() => changeMonth(1)}>&gt;</button>
          </div>

          <div className="calendar-grid">
            {days.map((d, i) => (
              <div key={i} className="calendar-day-header">
                {d}
              </div>
            ))}
            {renderCalendar()}
          </div>

          <div className="time-selector">
            <div className="time-input-group">
              <label>Time</label>
              <div className="time-inputs">
                <input
                  type="number"
                  min={is12Hour ? "1" : "0"}
                  max={is12Hour ? "12" : "23"}
                  value={getDisplayHour().toString().padStart(2, "0")}
                  onChange={(e) => handleTimeChange("hour", e.target.value)}
                />
                <span>:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={selectedDate.getMinutes().toString().padStart(2, "0")}
                  onChange={(e) => handleTimeChange("minute", e.target.value)}
                />
                {is12Hour && (
                  <button
                    type="button"
                    className="ampm-toggle"
                    onClick={() => handleTimeChange("ampm", selectedDate.getHours() >= 12 ? "AM" : "PM")}
                  >
                    {selectedDate.getHours() >= 12 ? "PM" : "AM"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
