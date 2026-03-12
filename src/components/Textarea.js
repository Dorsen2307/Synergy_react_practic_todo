import React from 'react';
import CharCounter from './CharCounter';

const Textarea = ({
                    label,
                    value,
                    onChange,
                    error,
                    required,
                    minLength,
                    showCharCounter = true,
                    ...props
                  }) => {
  const currentLength = value?.length || 0;

  return (
    <div className="form-group">
      {label && (
        <label>
          {label}{required && ' *'}
          {minLength && (
            <span className="char-hint"> (мин. {minLength} симв.)</span>
          )}
        </label>
      )}
      <textarea
        className={`form-control ${error ? 'error' : ''}`}
        value={value}
        onChange={onChange}
        {...props}
      />
      {showCharCounter && minLength && (
        <CharCounter
          current={currentLength}
          min={minLength}
        />
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Textarea;