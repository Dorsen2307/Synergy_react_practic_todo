import React, {useState} from 'react';
import {useUsers} from '../context/UserContext';
import './ObserversSelect.css';

// Выбор наблюдателей
const ObserversSelect = ({ value = [], onChange }) => {
  const { users } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Массив для выбранных наблюдателей
  const selectedObservers = Array.isArray(value) ? value : [];

  // Добавление/удаление наблюдателя
  const handleToggleObserver = (userId) => {
    let newObservers;
    if (selectedObservers.includes(userId)) {
      newObservers = selectedObservers.filter(id => id !== userId); // Если уже выбран - удаляем
    } else {
      newObservers = [...selectedObservers, userId]; // Если не выбран - добавляем
    }
    onChange(newObservers); // Возвращаем новый массив
  };

  const handleRemoveObserver = (userId, e) => {
    e.stopPropagation();
    const newObservers = selectedObservers.filter(id => id !== userId);
    onChange(newObservers);
  };

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedUsersDetails = () => {
    return selectedObservers
      .map(id => users.find(u => u.id === id))
      .filter(Boolean);
  };

  return (
    <div className="observers-select-container">
      <label>Наблюдатели</label>

      {/* Выбранные наблюдатели */}
      <div className="selected-observers">
        {getSelectedUsersDetails().map(user => (
          <div key={user.id} className="selected-observer-tag">
            <span className="observer-info">
              <span className="observer-name">{user.fullName}</span>
              <span className="observer-position">{user.position}</span>
            </span>
            {/* Кнопка удаления из выбранных */}
            <button
              type="button"
              className="remove-observer"
              onClick={(e) => handleRemoveObserver(user.id, e)}
              title="Удалить"
            >
              ×
            </button>
          </div>
        ))}
        {selectedObservers.length === 0 && (
          <div className="no-observers">Наблюдатели не выбраны</div>
        )}
      </div>

      {/* Кнопка для открытия/закрытия списка */}
      <button
        type="button"
        className="btn btn-secondary select-observers-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '▼ Скрыть список' : '▶ Выбрать наблюдателей'}
      </button>

      {/* Список для выбора */}
      {isOpen && (
        <div className="observers-dropdown">
          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск по имени или должности..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              autoFocus
            />
          </div>

          {/* Список пользователей */}
          <div className="observers-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`observer-item ${selectedObservers.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => handleToggleObserver(user.id)}
                >
                  <div className="observer-checkbox">
                    {selectedObservers.includes(user.id) && '✓'}
                  </div>
                  <div className="observer-details">
                    <span className="observer-name">{user.fullName}</span>
                    <span className="observer-position">{user.position}</span>
                    <span className="observer-department">{user.department}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">Пользователи не найдены</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObserversSelect;