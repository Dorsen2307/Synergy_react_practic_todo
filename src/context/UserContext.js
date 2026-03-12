import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([
    { id: '1', fullName: 'Иван Петров', position: 'Разработчик', department: 'Разработка' },
    { id: '2', fullName: 'Мария Иванова', position: 'Тестировщик', department: 'QA' },
    { id: '3', fullName: 'Алексей Сидоров', position: 'Team Lead', department: 'Разработка' },
  ]);

  const [selectedUserId, setSelectedUserId] = useState(null);

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