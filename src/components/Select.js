import React from 'react';

const Select = ({ label, value, onChange, options, error, required, ...props }) => {
  return (
    <div className="form-group">
      {label && <label>{label}{required && ' *'}</label>}
      <select
        className="form-control"
        value={value}
        onChange={onChange}
        {...props}
      >
        <option value="">Выберите...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Select;