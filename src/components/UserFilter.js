import React from 'react';
import { useUsers } from '../context/UserContext';
import './UserFilter.css';

const UserFilter = ({ onFilterChange }) => {
  const { users, selectedUserId, setSelectedUserId } = useUsers();

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    onFilterChange?.(userId);
  };

  return (
    <div className="user-filter">
      <label>Фильтр по исполнителю:</label>
      <select value={selectedUserId || ''} onChange={handleUserChange} className="filter-select">
        <option value="">Вся команда</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.fullName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserFilter;