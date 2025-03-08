import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  toggleComplete, 
  toggleStar, 
  deleteTask, 
  updateTaskPriority 
} from '../store/tasksSlice';
import TaskItem from './TaskItem';
import '../styles/TaskList.css';

const TaskList = ({ tasks, loading, userId }) => {
  const dispatch = useDispatch();

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete({ id, userId }));
  };

  const handleToggleStar = (id) => {
    dispatch(toggleStar({ id, userId }));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask({ id, userId }));
  };

  const handleUpdatePriority = (id, priority) => {
    dispatch(updateTaskPriority({ id, priority, userId }));
  };

  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-task-list">
        <p>No tasks found</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={handleToggleComplete}
          onToggleStar={handleToggleStar}
          onDelete={handleDeleteTask}
          onUpdatePriority={handleUpdatePriority}
        />
      ))}
    </div>
  );
};

export default TaskList;