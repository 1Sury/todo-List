import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../store/tasksSlice';
import TaskDatePicker from './TaskDatePicker';
import '../styles/TaskInput.css';

const TaskInput = () => {
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [showOptions, setShowOptions] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  // Close date picker when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      const datePickerElement = document.querySelector('.date-picker-container');
      const calendarButton = document.querySelector('.calendar-button');
      
      if (showDatePicker && 
          datePickerElement && 
          !datePickerElement.contains(event.target) &&
          calendarButton && 
          !calendarButton.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDatePicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showDatePicker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!taskText.trim()) return;
    
    // Log the dueDate that's being sent to Redux
    console.log("Submitting task with due date:", dueDate);
    
    dispatch(addTask({
      text: taskText,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      userId: user.id
    }));
    
    // Reset form
    setTaskText('');
    setPriority('medium');
    setDueDate(null);
    setShowOptions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDateSelect = (date) => {
    console.log("Date selected from picker:", date);
    
    if (date) {
      setDueDate(date);
    } else {
      setDueDate(null);
    }
    
    setShowDatePicker(false);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    try {
      const displayDate = new Date(date);
      if (isNaN(displayDate.getTime())) {
        return ''; // Return empty string if date is invalid
      }
      
      return displayDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };

  // Render date picker
  const renderDatePicker = () => {
    if (!showDatePicker) return null;
    
    // For mobile, add a backdrop
    const isMobile = window.innerWidth <= 768;
    
    return (
      <>
        {isMobile && <div className="date-picker-backdrop" onClick={() => setShowDatePicker(false)}></div>}
        <TaskDatePicker 
          onSelectDate={handleDateSelect} 
          onClose={() => setShowDatePicker(false)}
          initialDate={dueDate}
        />
      </>
    );
  };

  return (
    <div className="task-input-container">
      <form onSubmit={handleSubmit} className="task-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a Task"
            className="task-input"
          />
          
          <div className="input-actions">
            <button
              type="button"
              className="task-option-btn"
              onClick={() => setShowOptions(!showOptions)}
              aria-label="Task options"
            >
              <span className="bell-icon">🔔</span>
            </button>
            
            <div className="date-picker-wrapper">
              <button
                type="button"
                className={`task-option-btn calendar-button ${dueDate ? 'has-date' : ''}`}
                onClick={() => setShowDatePicker(!showDatePicker)}
                aria-label="Set date"
              >
                <span className="calendar-icon">📅</span>
                {dueDate && <span className="date-badge">{formatDate(dueDate)}</span>}
              </button>
              
              {renderDatePicker()}
            </div>
            
            <button
              type="submit"
              className="add-task-btn"
              disabled={!taskText.trim()}
              aria-label="Add task"
            >
              ADD TASK
            </button>
          </div>
        </div>
        
        {showOptions && (
          <div className="task-options-dropdown">
            <div className="priority-selection">
              <span>Priority:</span>
              <div className="priority-buttons">
                <button
                  type="button"
                  className={`priority-btn ${priority === 'high' ? 'selected' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  High
                </button>
                <button
                  type="button"
                  className={`priority-btn ${priority === 'medium' ? 'selected' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`priority-btn ${priority === 'low' ? 'selected' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  Low
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskInput;