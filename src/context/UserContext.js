import React, { createContext, useState, useContext } from 'react';
// Создание контекста для пользователей (для хранения глобальной переменной о пользователях)
const UserContext = createContext();

// Хук для удобного использования контекста
export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Состояние со списком пользователей
  const [users, setUsers] = useState([
    { id: '1', fullName: 'Иван Петров', position: 'Разработчик', department: 'Разработка' },
    { id: '2', fullName: 'Мария Иванова', position: 'Тестировщик', department: 'QA' },
    { id: '3', fullName: 'Алексей Сидоров', position: 'Team Lead', department: 'Разработка' },
  ]);

  // Состояние для фильтрации по пользователю
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Функция добавления нового пользователя
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now().toString(),
    };
    setUsers([...users, newUser]);
  };

  return (
    <UserContext.Provider value={{ users, addUser, selectedUserId, setSelectedUserId }}>
      {children}
    </UserContext.Provider>
  );
};