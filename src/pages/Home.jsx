import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadTasks } from '../store/tasksSlice';
import { fetchWeather } from '../store/weatherSlice';
import { logoutUser } from '../store/authSlice';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import TaskInput from '../components/TaskInput';
import WeatherWidget from '../components/WeatherWidget';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { tasks, loading } = useSelector(state => state.tasks);
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  useEffect(() => {
    if (user) {
      dispatch(loadTasks(user.id));
      dispatch(fetchWeather());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="home-container">
      <Sidebar 
        user={user} 
        pendingCount={pendingTasks.length} 
        onLogout={handleLogout} 
      />
      
      <main className="main-content">
        <header className="main-header">
          <h1>DoIt</h1>
          <div className="header-widgets">
            <WeatherWidget />
            <ThemeToggle />
          </div>
          <button className="btn btn-outline logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>
        
        <div className="task-container">
          <TaskInput />
          
          <div className="task-lists">
            <div className="pending-tasks">
              <h2>Tasks ({pendingTasks.length})</h2>
              <TaskList 
                tasks={pendingTasks} 
                loading={loading} 
                userId={user?.id} 
              />
            </div>
            
            <div className="completed-tasks">
              <h2>Completed ({completedTasks.length})</h2>
              <TaskList 
                tasks={completedTasks} 
                loading={loading} 
                userId={user?.id} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;