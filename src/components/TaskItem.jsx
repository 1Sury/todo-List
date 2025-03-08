import React, { useState, useRef, useEffect } from 'react';
import '../styles/TaskItem.css';

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onToggleStar, 
  onDelete, 
  onUpdatePriority 
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getFormattedDate = () => {
    // Check if dueDate exists and display it instead of createdAt
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    // Fallback to createdAt if no dueDate exists
    const date = new Date(task.createdAt);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Position dropdown to the left of the options button
  useEffect(() => {
    if (showOptions && optionsButtonRef.current && dropdownRef.current) {
      const buttonRect = optionsButtonRef.current.getBoundingClientRect();
      const dropdownWidth = dropdownRef.current.offsetWidth;
      
      // Position dropdown to the left of the button
      dropdownRef.current.style.top = `${buttonRect.bottom}px`;
      dropdownRef.current.style.left = `${buttonRect.left - dropdownWidth}px`;
    }
  }, [showOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (showOptions) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.task-options')) {
          setShowOptions(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showOptions]);

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${getPriorityClass()}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          id={`task-${task.id}`}
        />
        <label htmlFor={`task-${task.id}`}></label>
      </div>
      
      <div className="task-content">
        <p className="task-text">{task.text}</p>
        <div className="task-metadata">
          {task.dueDate && (
            <span className="task-due-date">Due: {getFormattedDate()}</span>
          )}
          {!task.dueDate && (
            <span className="task-date">Created: {getFormattedDate()}</span>
          )}
        </div>
      </div>
      
      <div className="task-actions">
        <button 
          className={`star-button ${task.starred ? 'starred' : ''}`}
          onClick={() => onToggleStar(task.id)}
          aria-label={task.starred ? "Unstar task" : "Star task"}
        >
          {task.starred ? '★' : '☆'}
        </button>
        
        <div className="task-options">
          <button 
            ref={optionsButtonRef}
            className="options-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            aria-label="Task options"
          >
            ⋯
          </button>
          
          {showOptions && (
            <div ref={dropdownRef} className="options-dropdown">
              <div className="priority-options">
                <p>Priority:</p>
                <button 
                  className={`priority-btn ${task.priority === 'high' ? 'active' : ''}`}
                  onClick={() => onUpdatePriority(task.id, 'high')}
                >
                  High
                </button>
                <button 
                  className={`priority-btn ${task.priority === 'medium' ? 'active' : ''}`}
                  onClick={() => onUpdatePriority(task.id, 'medium')}
                >
                  Medium
                </button>
                <button 
                  className={`priority-btn ${task.priority === 'low' ? 'active' : ''}`}
                  onClick={() => onUpdatePriority(task.id, 'low')}
                >
                  Low
                </button>
              </div>
              <button 
                className="delete-btn"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;