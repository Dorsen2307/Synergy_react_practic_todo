import React from 'react';
import { useUsers } from '../context/UserContext';
import { useTasks } from '../context/TaskContext';
import './TaskDetailsModal.css';

const TaskDetailsModal = ({ task, isOpen, onClose }) => {
  const { users } = useUsers();
  const { formatTime } = useTasks();

  if (!isOpen || !task) return null;

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : 'Не назначен';
  };

  const getObserversNames = (observerIds) => {
    if (!observerIds || observerIds.length === 0) return 'Нет наблюдателей';
    return observerIds
      .map(id => getUserName(id))
      .join(', ');
  };

  const getStatusText = (status) => {
    const statusMap = {
      todo: 'К выполнению',
      inProgress: 'В работе',
      done: 'Выполнено'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal task-details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Детали задачи</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="task-details">
          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">ID задачи:</span>
              <span className="detail-value task-id-badge">{task.id}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Статус:</span>
              <span className={`status-badge ${task.status}`}>
                {getStatusText(task.status)}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>{task.title}</h3>
            <p className="subtitle">{task.subtitle}</p>
          </div>

          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">Автор:</span>
              <span className="detail-value">{getUserName(task.author)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Исполнитель:</span>
              <span className="detail-value">{getUserName(task.assignee)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Время выполнения:</span>
              <span className="detail-value">{formatTime(task.timeEstimate)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Создана:</span>
              <span className="detail-value">
                {new Date(task.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <span className="detail-label">Описание:</span>
            <p className="description-text">{task.description}</p>
          </div>

          {task.comments && (
            <div className="detail-section">
              <span className="detail-label">Комментарии:</span>
              <p className="comments-text">{task.comments}</p>
            </div>
          )}

          <div className="detail-section">
            <span className="detail-label">Наблюдатели:</span>
            <p className="observers-text">{getObserversNames(task.observers)}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;