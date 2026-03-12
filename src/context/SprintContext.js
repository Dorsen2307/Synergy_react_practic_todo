import React, { createContext, useState, useContext } from 'react';

const SprintContext = createContext();

export const useSprint = () => useContext(SprintContext);

export const SprintProvider = ({ children }) => {
  const [currentSprint, setCurrentSprint] = useState({
    id: 'sprint-1',
    name: 'Спринт 1',
    goal: 'Реализация основного функционала',
    startDate: '2024-01-01',
    endDate: '2024-01-14',
    duration: 14,
  });

  const [sprints, setSprints] = useState([currentSprint]);

  const addSprint = (sprint) => {
    const newSprint = {
      ...sprint,
      id: `sprint-${Date.now()}`,
    };
    setSprints([...sprints, newSprint]);
    setCurrentSprint(newSprint);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRemainingTime = () => {
    if (!currentSprint?.endDate) return 0;
    const now = new Date();
    const end = new Date(currentSprint.endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <SprintContext.Provider value={{
      currentSprint,
      sprints,
      addSprint,
      calculateDuration,
      getRemainingTime,
    }}>
      {children}
    </SprintContext.Provider>
  );
};