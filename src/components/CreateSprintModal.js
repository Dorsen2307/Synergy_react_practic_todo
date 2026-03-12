import React, { useState, useEffect } from 'react';
import { useSprint } from '../context/SprintContext';
import Input from './Input';
import Textarea from './Textarea';
import './CreateSprintModal.css';

const CreateSprintModal = ({ isOpen, onClose }) => {
  const { addSprint, calculateDuration } = useSprint();

  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
  });

  const [duration, setDuration] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end > start) {
        const calculatedDuration = calculateDuration(formData.startDate, formData.endDate);
        setDuration(calculatedDuration);
      } else {
        setDuration(null);
      }
    } else {
      setDuration(null);
    }
  }, [formData.startDate, formData.endDate, calculateDuration]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя спринта обязательно';
    }

    if (!formData.goal.trim()) {
      newErrors.goal = 'Цель спринта обязательна';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Дата начала обязательна';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Дата окончания обязательна';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end <= start) {
        newErrors.endDate = 'Дата окончания должна быть позже даты начала';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      addSprint({
        ...formData,
        duration,
      });

      setFormData({
        name: '',
        goal: '',
        startDate: '',
        endDate: '',
      });
      setDuration(null);

      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const formatDuration = (days) => {
    if (days === 1) return '1 день';
    if (days >= 2 && days <= 4) return `${days} дня`;
    return `${days} дней`;
  };

  const getWeekendDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    let weekends = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends++;
      }
      current.setDate(current.getDate() + 1);
    }

    return weekends;
  };

  const workingDays = duration ? duration - getWeekendDays() : 0;

  return (
    <div className="modal-overlay">
      <div className="modal create-sprint-modal">
        <h2>Создание спринта</h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="Имя спринта"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Например: Спринт 2024.1"
          />

          <Textarea
            label="Цель спринта"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            error={errors.goal}
            required
            placeholder="Опишите основную цель спринта..."
            rows={3}
          />

          <div className="date-fields">
            <Input
              label="Дата начала"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />

            <Input
              label="Дата окончания"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              required
            />
          </div>

          {/* Блок с информацией о длительности */}
          {duration !== null && (
            <div className="duration-info-card">
              <h4>Информация о спринте</h4>

              <div className="duration-details">
                <div className="duration-item">
                  <span className="duration-label">Общая длительность:</span>
                  <span className="duration-value highlight">{formatDuration(duration)}</span>
                </div>

                <div className="duration-item">
                  <span className="duration-label">Рабочих дней:</span>
                  <span className="duration-value">{workingDays}</span>
                </div>

                <div className="duration-item">
                  <span className="duration-label">Выходных дней:</span>
                  <span className="duration-value">{getWeekendDays()}</span>
                </div>

                <div className="duration-progress">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar working"
                      style={{ width: `${(workingDays / duration) * 100}%` }}
                      title={`Рабочие дни: ${workingDays}`}
                    />
                    <div
                      className="progress-bar weekend"
                      style={{ width: `${(getWeekendDays() / duration) * 100}%` }}
                      title={`Выходные дни: ${getWeekendDays()}`}
                    />
                  </div>
                  <div className="progress-labels">
                    <span className="working-label">👔 Рабочие дни</span>
                    <span className="weekend-label">🎉 Выходные</span>
                  </div>
                </div>

                <div className="date-range-preview">
                  <div className="preview-item">
                    <span className="preview-label">С:</span>
                    <span className="preview-value">
                      {new Date(formData.startDate).toLocaleDateString('ru-RU', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">По:</span>
                    <span className="preview-value">
                      {new Date(formData.endDate).toLocaleDateString('ru-RU', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Создать спринт
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSprintModal;