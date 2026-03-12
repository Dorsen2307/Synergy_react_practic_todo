import React, { useState } from 'react';
import { useUsers } from '../context/UserContext';
import Input from './Input';
import Select from './Select';

const CreateUserModal = ({ isOpen, onClose }) => {
  const { addUser } = useUsers();

  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    department: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'ФИО обязательно';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Должность обязательна';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Подразделение обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      addUser(formData);
      setFormData({
        fullName: '',
        position: '',
        department: '',
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

  const departmentOptions = [
    { value: 'Разработка', label: 'Разработка' },
    { value: 'QA', label: 'QA' },
    { value: 'Аналитика', label: 'Аналитика' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Дизайн', label: 'Дизайн' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Добавление участника</h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="ФИО"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <Input
            label="Должность"
            name="position"
            value={formData.position}
            onChange={handleChange}
            error={errors.position}
            required
          />

          <Select
            label="Подразделение"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={departmentOptions}
            error={errors.department}
            required
          />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Добавить участника
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;