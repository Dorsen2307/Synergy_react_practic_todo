import React, { createContext, useState, useContext } from 'react';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    {
      id: 'PR-1001',
      title: 'Реализовать авторизацию',
      subtitle: 'Добавить JWT аутентификацию',
      author: '1',
      assignee: '1',
      timeEstimate: 16, // в часах
      description: 'Необходимо реализовать JWT аутентификацию с refresh токенами. Добавить защиту роутов.',
      comments: '',
      observers: [],
      status: 'todo',
      createdAt: '2024-01-01',
    },
    {
      id: 'PR-1002',
      title: 'Настроить CI/CD',
      subtitle: 'GitHub Actions',
      author: '3',
      assignee: '3',
      timeEstimate: 8,
      description: 'Настроить автоматический деплой на staging при пуше в main',
      comments: 'Использовать GitHub Actions для деплоя',
      observers: ['2'],
      status: 'inProgress',
      createdAt: '2024-01-02',
    },
    {
      id: 'PR-1003',
      title: 'Написать тесты',
      subtitle: 'Покрыть основной функционал',
      author: '2',
      assignee: '2',
      timeEstimate: 12,
      description: 'Написать unit-тесты для компонентов React и интеграционные тесты',
      comments: '',
      observers: ['1', '3'],
      status: 'done',
      createdAt: '2024-01-03',
    },
  ]);

  const generateTaskId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array(2).fill(0)
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join('');
    const randomNumbers = Math.floor(Math.random() * 9000 + 1000);
    return `${randomLetters}-${randomNumbers}`;
  };

  const formatTime = (hours) => {
    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;

    if (days > 0 && remainingHours > 0) {
      return `${days}д ${remainingHours}ч`;
    } else if (days > 0) {
      return `${days}д`;
    } else {
      return `${hours}ч`;
    }
  };

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: generateTaskId(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'todo',
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.status === 'done');
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTaskStatus,
      getTasksByStatus,
      getCompletedTasks,
      formatTime,
    }}>
      {children}
    </TaskContext.Provider>
  );
};