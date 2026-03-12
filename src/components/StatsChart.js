import React from 'react';
import './StatsChart.css';

const StatsChart = ({ tasks }) => {
  const getStatusCounts = () => {
    return {
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'inProgress').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
  };

  const counts = getStatusCounts();
  const total = tasks.length;

  return (
    <div className="stats-chart">
      <h3>Статистика задач</h3>
      <div className="chart-container">
        <div className="chart-bar">
          <div className="bar todo" style={{ width: `${(counts.todo / total) * 100}%` }}>
            {counts.todo} To Do
          </div>
          <div className="bar inProgress" style={{ width: `${(counts.inProgress / total) * 100}%` }}>
            {counts.inProgress} In Progress
          </div>
          <div className="bar done" style={{ width: `${(counts.done / total) * 100}%` }}>
            {counts.done} Done
          </div>
        </div>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="color-box todo"></span>
          <span>К выполнению</span>
        </div>
        <div className="legend-item">
          <span className="color-box inProgress"></span>
          <span>В работе</span>
        </div>
        <div className="legend-item">
          <span className="color-box done"></span>
          <span>Выполнено</span>
        </div>
      </div>
    </div>
  );
};

export default StatsChart;