import React from 'react';
import './CharCounter.css';

const CharCounter = ({ current, min, showProgress = true }) => {
  const percentage = Math.min((current / min) * 100, 100);
  const isValid = current >= min;
  const isNearLimit = current >= min * 0.8 && current < min;

  return (
    <div className="char-counter">
      <div className="counter-info">
        <span className={isValid ? 'valid' : isNearLimit ? 'near-limit' : 'invalid'}>
          {current} / {min} символов
        </span>
        {!isValid && (
          <span className="remaining">
            Осталось {min - current} символов
          </span>
        )}
      </div>
      {showProgress && (
        <div className="progress-bar-container">
          <div
            className={`progress-bar ${isValid ? 'valid' : isNearLimit ? 'near-limit' : 'invalid'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default CharCounter;