import React, { useState, useRef, useEffect } from 'react';
import '../styles/TaskDatePicker.css';

const TaskDatePicker = ({ onSelectDate, onClose, initialDate = null }) => {
  console.log("TaskDatePicker initialDate:", initialDate);
  
  // Parse initialDate if it's a string (like an ISO date string)
  const parsedInitialDate = initialDate 
    ? (typeof initialDate === 'string' ? new Date(initialDate) : initialDate) 
    : null;
  
  const [selectedDate, setSelectedDate] = useState(parsedInitialDate || new Date());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const datePickerRef = useRef(null);
  
  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week for first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  
  // Navigate to next month
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  
  // Handle date selection
  const handleDateSelect = (day) => {
    // Create the date at noon to avoid timezone issues
    const newDate = new Date(year, month, day, 12, 0, 0);
    setSelectedDate(newDate);
    console.log("Selected date in picker:", newDate);
    onSelectDate(newDate);
  };
  
  // Quick date options
  const handleQuickOption = (option) => {
    const today = new Date();
    let newDate;
    
    switch (option) {
      case 'today':
        // Set to noon to avoid timezone issues
        newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
        break;
      case 'tomorrow':
        // Set to noon to avoid timezone issues
        newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 0, 0);
        break;
      case 'next-week':
        // Set to noon to avoid timezone issues
        newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 12, 0, 0);
        break;
      default:
        newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
    }
    
    setSelectedDate(newDate);
    setMonth(newDate.getMonth());
    setYear(newDate.getFullYear());
    console.log("Quick option selected date:", newDate);
    onSelectDate(newDate);
  };
  
  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Render calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  // Get month name
  const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  };
  
  return (
    <div className="date-picker-container" ref={datePickerRef}>
      <div className="date-picker-header">
        <div className="selected-date">
          {selectedDate ? formatDate(selectedDate) : 'Select date'}
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="quick-options">
        <button onClick={() => handleQuickOption('today')}>Today</button>
        <button onClick={() => handleQuickOption('tomorrow')}>Tomorrow</button>
        <button onClick={() => handleQuickOption('next-week')}>Next week</button>
      </div>
      
      <div className="calendar">
        <div className="calendar-header">
          <button className="month-nav" onClick={prevMonth}>‹</button>
          <div className="current-month">{getMonthName(month)} {year}</div>
          <button className="month-nav" onClick={nextMonth}>›</button>
        </div>
        
        <div className="weekdays">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>
      
      <div className="date-picker-footer">
        <button className="clear-btn" onClick={() => onSelectDate(null)}>Clear</button>
        <button className="save-btn" onClick={() => onSelectDate(selectedDate)}>Save</button>
      </div>
    </div>
  );
};

export default TaskDatePicker;