import React, { useState } from 'react';
import { useUsers } from '../context/UserContext';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateSprintModal from '../components/CreateSprintModal';
import CreateUserModal from '../components/CreateUserModal';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeModal, setActiveModal] = useState(null);
  const { users } = useUsers();

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>

      <div className="admin-actions">
        <button
          className="btn btn-primary"
          onClick={() => setActiveModal('task')}
        >
          Создать задачу
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setActiveModal('sprint')}
        >
          Создать спринт
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setActiveModal('user')}
        >
          Добавить участника
        </button>
      </div>

      <div className="users-list">
        <h2>Участники команды</h2>
        <div className="users-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <h3>{user.fullName}</h3>
              <p>Должность: {user.position}</p>
              <p>Подразделение: {user.department}</p>
              <p className="user-id">ID: {user.id}</p>
            </div>
          ))}
        </div>
      </div>

      <CreateTaskModal
        isOpen={activeModal === 'task'}
        onClose={() => setActiveModal(null)}
      />

      <CreateSprintModal
        isOpen={activeModal === 'sprint'}
        onClose={() => setActiveModal(null)}
      />

      <CreateUserModal
        isOpen={activeModal === 'user'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default AdminPanel;