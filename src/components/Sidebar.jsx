import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/Sidebar.css';

const Sidebar = ({ user, pendingCount, onLogout }) => {
  const { tasks } = useSelector(state => state.tasks);
  
  // Count tasks by priority
  const highPriorityCount = tasks.filter(task => !task.completed && task.priority === 'high').length;
  const mediumPriorityCount = tasks.filter(task => !task.completed && task.priority === 'medium').length;
  const lowPriorityCount = tasks.filter(task => !task.completed && task.priority === 'low').length;
  
  // Count starred tasks
  const starredCount = tasks.filter(task => task.starred).length;
  
  // Calculate completion percentage
  const completedPercentage = tasks.length > 0 
    ? tasks.filter(t => t.completed).length / tasks.length 
    : 0;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <p className="user-greeting">Hey, {user?.name || user?.username}</p>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item active">
            <button className="nav-button">
              <span className="nav-icon">📋</span>
              <span>All Tasks</span>
              <span className="count-badge">{tasks.length}</span>
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-button">
              <span className="nav-icon">📅</span>
              <span>Today</span>
              <span className="count-badge">{pendingCount}</span>
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-button">
              <span className="nav-icon">⭐</span>
              <span>Important</span>
              <span className="count-badge">{starredCount}</span>
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-button">
              <span className="nav-icon">📌</span>
              <span>Pinned</span>
              <span className="count-badge">{highPriorityCount}</span>
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-button">
              <span className="nav-icon">👤</span>
              <span>Assigned to me</span>
              <span className="count-badge">0</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="add-list-btn">
          <span className="add-icon">+</span>
          <span>Add list</span>
        </button>
        
        <div className="today-stats">
          <h3>Today Tasks</h3>
          <div className="task-count">{pendingCount}</div>
          <div className="task-progress">
            <div className="progress-ring">
              <svg viewBox="0 0 120 120" width="120" height="120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="10"
                />
                
                {/* Pending tasks segment (light green) */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#a5d6a7"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={0}
                  transform="rotate(-90 60 60)"
                />
                
                {/* Completed tasks segment (dark green) */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#2e7d32"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - completedPercentage)}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="progress-text">
                <span className="pending-text">Pending</span>
                <span className="done-text">Done</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;