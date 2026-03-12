import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useUsers } from '../context/UserContext';
import { useSprint } from '../context/SprintContext';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import ObserversSelect from './ObserversSelect';
import './CreateTaskModal.css';

const CreateTaskModal = ({ isOpen, onClose }) => {
  const { addTask, formatTime } = useTasks();
  const { users } = useUsers();
  const { getRemainingTime } = useSprint();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    author: '',
    assignee: '',
    timeEstimate: '',
    description: '',
    comments: '',
    observers: [], // Массив ID наблюдателей
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const remainingDays = getRemainingTime();
  const remainingHours = remainingDays * 8;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок обязателен';
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = 'Подзаголовок обязателен';
    }

    if (!formData.author) {
      newErrors.author = 'Автор обязателен';
    }

    if (!formData.assignee) {
      newErrors.assignee = 'Исполнитель обязателен';
    }

    if (!formData.timeEstimate || formData.timeEstimate <= 0) {
      newErrors.timeEstimate = 'Время выполнения обязательно';
    } else if (formData.timeEstimate > remainingHours) {
      newErrors.timeEstimate = `Недостаточно времени в спринте. Доступно: ${formatTime(remainingHours)}`;
    }

    if (!formData.description.trim() || formData.description.length < 40) {
      newErrors.description = 'Описание должно содержать не менее 40 символов';
    }

    if (formData.comments && formData.comments.length < 40) {
      newErrors.comments = 'Комментарий должен содержать не менее 40 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      addTask({
        ...formData,
        timeEstimate: parseInt(formData.timeEstimate),
      });

      setFormData({
        title: '',
        subtitle: '',
        author: '',
        assignee: '',
        timeEstimate: '',
        description: '',
        comments: '',
        observers: [],
      });

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

  const handleObserversChange = (observers) => {
    setFormData(prev => ({ ...prev, observers }));
  };

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.fullName} (${user.position})`,
  }));

  const timeLeftMessage = remainingDays > 0
    ? `Осталось времени в спринте: ${formatTime(remainingHours)}`
    : 'Спринт завершен';

  return (
    <div className="modal-overlay">
      <div className="modal create-task-modal">
        <h2>Создание задачи</h2>
        <p className="time-left-info">{timeLeftMessage}</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Заголовок"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            placeholder="Краткое описание задачи"
          />

          <Input
            label="Подзаголовок"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            error={errors.subtitle}
            required
            placeholder="Уточняющая информация"
          />

          <Select
            label="Автор"
            name="author"
            value={formData.author}
            onChange={handleChange}
            options={userOptions}
            error={errors.author}
            required
          />

          <Select
            label="Исполнитель"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            options={userOptions}
            error={errors.assignee}
            required
          />

          <Input
            label="Время выполнения (часы)"
            type="number"
            name="timeEstimate"
            value={formData.timeEstimate}
            onChange={handleChange}
            error={errors.timeEstimate}
            required
            min="1"
            placeholder="Например: 8, 16, 24"
          />

          <Textarea
            label="Описание"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            required
            minLength={40}
            placeholder="Минимум 40 символов. Опишите задачу подробно..."
          />

          <Textarea
            label="Дополнительные комментарии"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            error={errors.comments}
            minLength={40}
            placeholder="Минимум 40 символов (необязательно)"
          />

          {/* Заменяем Input на ObserversSelect */}
          <ObserversSelect
            value={formData.observers}
            onChange={handleObserversChange}
          />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Создать задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;