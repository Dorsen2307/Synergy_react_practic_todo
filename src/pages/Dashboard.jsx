import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useSprint } from '../context/SprintContext';
import { useUsers } from '../context/UserContext';
import UserFilter from '../components/UserFilter';
import EnhancedStatsChart from '../components/EnhancedStatsChart';
import TaskDetailsModal from '../components/TaskDetailsModal';
import './Dashboard.css';

// Рабочий стол
const Dashboard = () => {
  const { tasks, getCompletedTasks, formatTime } = useTasks();
  const { currentSprint } = useSprint();
  const { users, selectedUserId } = useUsers();
  const [activeTab, setActiveTab] = useState('product');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const completedTasks = getCompletedTasks();

  // Фильтрация задач по выбранному пользователю
  const filterTasks = (tasksList) => {
    if (!selectedUserId) return tasksList;
    return tasksList.filter(task => task.assignee === selectedUserId);
  };

  const filteredCompletedTasks = filterTasks(completedTasks);
  const filteredAllTasks = filterTasks(tasks);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : 'Не назначен';
  };

  // Прогресс спринта
  const getSprintProgress = () => {
    if (!currentSprint?.startDate || !currentSprint?.endDate) return 0;

    const start = new Date(currentSprint.startDate);
    const end = new Date(currentSprint.endDate);
    const now = new Date();

    const total = end - start;
    const elapsed = now - start;
    const progress = (elapsed / total) * 100;

    return Math.min(100, Math.max(0, progress));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard">
      <h1>Рабочий стол</h1>

      {/* Информация о спринте */}
      <div className="sprint-info">
        <h2>Текущий спринт: {currentSprint?.name}</h2>
        <div className="sprint-details">
          <p>Цель: {currentSprint?.goal}</p>
          <p>Период: {currentSprint?.startDate} - {currentSprint?.endDate}</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getSprintProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Фильтр по пользователям */}
      <UserFilter />

      {/* Графики статистики */}
      <div className="stats-section">
        <EnhancedStatsChart
          tasks={tasks}
          filterUserId={selectedUserId}
        />
      </div>

      {/* Вкладки Product/Backlog */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'product' ? 'active' : ''}`}
          onClick={() => setActiveTab('product')}
        >
          Product
        </button>
        <button
          className={`tab ${activeTab === 'backlog' ? 'active' : ''}`}
          onClick={() => setActiveTab('backlog')}
        >
          Backlog
        </button>
      </div>

      {/* Список задач в зависимости от вкладки */}
      {activeTab === 'product' && (
        <div className="product-tab">
          <div className="completed-tasks">
            <h3>Выполненные задачи</h3>
            <div className="tasks-list">
              {filteredCompletedTasks.map(task => (
                <div
                  key={task.id}
                  className="task-item clickable"
                  onClick={() => handleTaskClick(task)}
                >
                  {/* Отображение задачи */}
                  <div className="task-header">
                    <span className="task-id">{task.id}</span>
                    <span className="task-status done">✓ Выполнено</span>
                  </div>
                  <h4>{task.title}</h4>
                  <p className="task-subtitle">{task.subtitle}</p>
                  <div className="task-footer">
                    <span>Исполнитель: {getUserName(task.assignee)}</span>
                    <span>Время: {formatTime(task.timeEstimate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'backlog' && (
        <div className="backlog-tab">
          <h3>Бэклог</h3>
          <div className="tasks-list">
            {filteredAllTasks.filter(task => task.status !== 'done').map(task => (
              <div
                key={task.id}
                className="task-item clickable"
                onClick={() => handleTaskClick(task)}
              >
                {/* Отображение задачи */}
                <div className="task-header">
                  <span className="task-id">{task.id}</span>
                  <span className={`task-status ${task.status}`}>
                    {task.status === 'todo' ? 'К выполнению' : 'В работе'}
                  </span>
                </div>
                <h4>{task.title}</h4>
                <p className="task-subtitle">{task.subtitle}</p>
                <div className="task-footer">
                  <span>Исполнитель: {getUserName(task.assignee)}</span>
                  <span>Время: {formatTime(task.timeEstimate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно с деталями задачи */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
};

export default Dashboard;