import React, { useMemo, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useUsers } from '../context/UserContext';
import TaskDetailsModal from './TaskDetailsModal';
import './KanbanBoard.css';

// Доска задач
const KanbanBoard = ({ filterUserId }) => {
  const { tasks, updateTaskStatus, formatTime } = useTasks();
  const { users } = useUsers();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : 'Не назначен';
  };

  // Фильтрация задач
  const filteredTasks = useMemo(() => {
    if (!filterUserId) return tasks;
    return tasks.filter(task => task.assignee === filterUserId);
  }, [tasks, filterUserId]);

  const columns = [
    { id: 'todo', title: 'К выполнению', color: '#ffab00' },
    { id: 'inProgress', title: 'В работе', color: '#0052cc' },
    { id: 'done', title: 'Выполнено', color: '#36b37e' },
  ];

  // Drag-and-drop обработчики
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    updateTaskStatus(taskId, status);
  };

  const handleTaskClick = (task, e) => {
    // Предотвращаем срабатывание при перетаскивании
    if (!e.defaultPrevented) {
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  // Получение задач для конкретной колонки
  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  return (
    <>
      <div className="kanban-board">
        {columns.map(column => (
          <div
            key={column.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Заголовок колонки с количеством задач */}
            <div className="column-header" style={{ backgroundColor: column.color }}>
              <h3>{column.title}</h3>
              <span className="task-count">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            {/* Задачи в колонке */}
            <div className="column-content">
              {getTasksByStatus(column.id).map(task => (
                <div
                  key={task.id}
                  className="task-card clickable"
                  draggable // Делаем карточку перетаскиваемой
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={(e) => handleTaskClick(task, e)}
                >
                  <div className="task-id">{task.id}</div>
                  <h4 className="task-title">{task.title}</h4>
                  <p className="task-subtitle">{task.subtitle}</p>
                  <div className="task-meta">
                    <span className="task-assignee">
                      👤 {getUserName(task.assignee)}
                    </span>
                    <span className="task-time">
                      ⏱ {formatTime(task.timeEstimate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
      />
    </>
  );
};

export default KanbanBoard;