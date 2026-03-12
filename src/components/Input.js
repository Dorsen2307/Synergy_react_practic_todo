import React from 'react';

const Input = ({ label, type = 'text', value, onChange, error, required, ...props }) => {
  return (
    <div className="form-group">
      {label && <label>{label}{required && ' *'}</label>}
      <input
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Input;