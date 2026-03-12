import React, { useEffect } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import UserFilter from '../components/UserFilter';
import { useUsers } from '../context/UserContext';
import './ActiveSprint.css';

const ActiveSprint = () => {
  const { selectedUserId, setSelectedUserId } = useUsers();

  useEffect(() => {
    setSelectedUserId(null);

    return () => {
      setSelectedUserId(null);
    };
  }, []);

  return (
    <div className="active-sprint">
      <h1>Активный спринт</h1>

      <div className="sprint-controls">
        <UserFilter onFilterChange={setSelectedUserId} />
      </div>

      <KanbanBoard filterUserId={selectedUserId} />
    </div>
  );
};

export default ActiveSprint;