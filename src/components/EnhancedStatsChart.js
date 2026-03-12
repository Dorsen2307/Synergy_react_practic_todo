import React, {useState} from 'react';
import {useUsers} from '../context/UserContext';
import './EnhancedStatsChart.css';

const EnhancedStatsChart = ({ tasks, filterUserId }) => {
  const { users } = useUsers();
  const [chartType, setChartType] = useState('status');

  // Фильтруем задачи если выбран пользователь
  const filteredTasks = filterUserId
    ? tasks.filter(task => task.assignee === filterUserId)
    : tasks;

  // Статистика по статусам
  const getStatusStats = () => {
    const stats = {
      todo: filteredTasks.filter(t => t.status === 'todo').length,
      inProgress: filteredTasks.filter(t => t.status === 'inProgress').length,
      done: filteredTasks.filter(t => t.status === 'done').length,
    };

    const total = filteredTasks.length;

    return {
      ...stats,
      total,
      percentages: {
        todo: total ? ((stats.todo / total) * 100).toFixed(1) : 0,
        inProgress: total ? ((stats.inProgress / total) * 100).toFixed(1) : 0,
        done: total ? ((stats.done / total) * 100).toFixed(1) : 0,
      }
    };
  };

  // Статистика по исполнителям
  const getAssigneeStats = () => {
    const stats = {};

    users.forEach(user => {
      stats[user.id] = {
        name: user.fullName,
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
      };
    });

    filteredTasks.forEach(task => {
      if (stats[task.assignee]) {
        stats[task.assignee].total++;
        stats[task.assignee][task.status]++;
      }
    });

    return stats;
  };

  // Статистика по времени
  const getTimeStats = () => {
    const totalHours = filteredTasks.reduce((sum, task) => sum + task.timeEstimate, 0);
    const completedHours = filteredTasks
      .filter(t => t.status === 'done')
      .reduce((sum, task) => sum + task.timeEstimate, 0);

    const averageTimePerTask = filteredTasks.length
      ? (totalHours / filteredTasks.length).toFixed(1)
      : 0;

    return {
      totalHours,
      completedHours,
      remainingHours: totalHours - completedHours,
      averageTimePerTask,
    };
  };

  const statusStats = getStatusStats();
  const assigneeStats = getAssigneeStats();
  const timeStats = getTimeStats();

  const getMaxAssigneeTasks = () => {
    return Math.max(...Object.values(assigneeStats).map(s => s.total), 1);
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: '#ffab00',
      inProgress: '#0052cc',
      done: '#36b37e'
    };
    return colors[status] || '#dfe1e6';
  };

  // Компонент круговой диаграммы
  const PieChart = ({ stats }) => {
    if (stats.total === 0) {
      return <div className="no-data">Нет данных</div>;
    }

    // Создаем градиент для круговой диаграммы
    const createConicGradient = () => {
      let gradient = 'conic-gradient(';
      let currentAngle = 0;

      if (stats.todo > 0) {
        gradient += `${getStatusColor('todo')} ${currentAngle}deg ${currentAngle + stats.percentages.todo * 3.6}deg`;
        currentAngle += stats.percentages.todo * 3.6;
      }

      if (stats.inProgress > 0) {
        if (stats.todo > 0) gradient += ', ';
        gradient += `${getStatusColor('inProgress')} ${currentAngle}deg ${currentAngle + stats.percentages.inProgress * 3.6}deg`;
        currentAngle += stats.percentages.inProgress * 3.6;
      }

      if (stats.done > 0) {
        if (stats.todo > 0 || stats.inProgress > 0) gradient += ', ';
        gradient += `${getStatusColor('done')} ${currentAngle}deg ${currentAngle + stats.percentages.done * 3.6}deg`;
      }

      gradient += ')';
      return gradient;
    };

    return (
      <div
        className="pie-chart"
        style={{ background: createConicGradient() }}
      >
        <div className="pie-center">
          <span className="pie-total">{stats.total}</span>
          <span className="pie-total-label">всего</span>
        </div>
      </div>
    );
  };

  return (
    <div className="enhanced-stats-chart">
      <div className="chart-header">
        <h3>Аналитика задач</h3>
        <div className="chart-type-selector">
          <button
            className={`chart-type-btn ${chartType === 'status' ? 'active' : ''}`}
            onClick={() => setChartType('status')}
          >
            По статусам
          </button>
          <button
            className={`chart-type-btn ${chartType === 'assignee' ? 'active' : ''}`}
            onClick={() => setChartType('assignee')}
          >
            По исполнителям
          </button>
          <button
            className={`chart-type-btn ${chartType === 'time' ? 'active' : ''}`}
            onClick={() => setChartType('time')}
          >
            По времени
          </button>
        </div>
      </div>

      {chartType === 'status' && (
        <div className="status-chart">
          <div className="pie-chart-container">
            <PieChart stats={statusStats} />
          </div>

          <div className="stats-cards">
            <div className="stat-card todo">
              <div className="stat-value">{statusStats.todo}</div>
              <div className="stat-label">К выполнению</div>
              <div className="stat-percentage">{statusStats.percentages.todo}%</div>
            </div>
            <div className="stat-card inProgress">
              <div className="stat-value">{statusStats.inProgress}</div>
              <div className="stat-label">В работе</div>
              <div className="stat-percentage">{statusStats.percentages.inProgress}%</div>
            </div>
            <div className="stat-card done">
              <div className="stat-value">{statusStats.done}</div>
              <div className="stat-label">Выполнено</div>
              <div className="stat-percentage">{statusStats.percentages.done}%</div>
            </div>
          </div>

          <div className="legend-container">
            <div className="legend-item">
              <span className="legend-color todo"></span>
              <span className="legend-label">К выполнению ({statusStats.todo})</span>
            </div>
            <div className="legend-item">
              <span className="legend-color inProgress"></span>
              <span className="legend-label">В работе ({statusStats.inProgress})</span>
            </div>
            <div className="legend-item">
              <span className="legend-color done"></span>
              <span className="legend-label">Выполнено ({statusStats.done})</span>
            </div>
          </div>
        </div>
      )}

      {chartType === 'assignee' && (
        <div className="assignee-chart">
          {Object.values(assigneeStats).map(stat => (
            <div key={stat.name} className="assignee-bar-container">
              <div className="assignee-info">
                <span className="assignee-name">{stat.name}</span>
                <span className="assignee-total">{stat.total} задач</span>
              </div>
              <div className="assignee-bars">
                <div className="bar-stack">
                  {stat.todo > 0 && (
                    <div
                      className="bar-segment todo"
                      style={{
                        width: `${(stat.todo / getMaxAssigneeTasks()) * 100}%`,
                        backgroundColor: getStatusColor('todo')
                      }}
                      title={`К выполнению: ${stat.todo}`}
                    />
                  )}
                  {stat.inProgress > 0 && (
                    <div
                      className="bar-segment inProgress"
                      style={{
                        width: `${(stat.inProgress / getMaxAssigneeTasks()) * 100}%`,
                        backgroundColor: getStatusColor('inProgress')
                      }}
                      title={`В работе: ${stat.inProgress}`}
                    />
                  )}
                  {stat.done > 0 && (
                    <div
                      className="bar-segment done"
                      style={{
                        width: `${(stat.done / getMaxAssigneeTasks()) * 100}%`,
                        backgroundColor: getStatusColor('done')
                      }}
                      title={`Выполнено: ${stat.done}`}
                    />
                  )}
                </div>
              </div>
              <div className="assignee-details">
                {stat.todo > 0 && <span className="detail-badge todo">{stat.todo}</span>}
                {stat.inProgress > 0 && <span className="detail-badge inProgress">{stat.inProgress}</span>}
                {stat.done > 0 && <span className="detail-badge done">{stat.done}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {chartType === 'time' && (
        <div className="time-chart">
          <div className="time-stats-grid">
            <div className="time-stat-card">
              <div className="time-stat-value">{timeStats.totalHours}ч</div>
              <div className="time-stat-label">Всего часов</div>
            </div>
            <div className="time-stat-card">
              <div className="time-stat-value">{timeStats.completedHours}ч</div>
              <div className="time-stat-label">Выполнено</div>
            </div>
            <div className="time-stat-card">
              <div className="time-stat-value">{timeStats.remainingHours}ч</div>
              <div className="time-stat-label">Осталось</div>
            </div>
            <div className="time-stat-card">
              <div className="time-stat-value">{timeStats.averageTimePerTask}ч</div>
              <div className="time-stat-label">Среднее на задачу</div>
            </div>
          </div>

          <div className="progress-chart">
            <div className="progress-label">
              <span>Прогресс выполнения по времени</span>
              <span>{Math.round((timeStats.completedHours / timeStats.totalHours) * 100 || 0)}%</span>
            </div>
            <div className="progress-bar-container large">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(timeStats.completedHours / timeStats.totalHours) * 100 || 0}%`,
                  backgroundColor: '#36b37e'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedStatsChart;