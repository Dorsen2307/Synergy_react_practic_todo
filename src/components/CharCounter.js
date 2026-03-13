import React from 'react';
import './CharCounter.css';

// Счетчик символов
const CharCounter = ({ current, min, showProgress = true }) => {
  // Вычисляем процент заполнения (не более 100%)
  const percentage = Math.min((current / min) * 100, 100);
  // Проверяем валидность
  const isValid = current >= min;
  // Проверяем, близко ли к минимуму (80-99%)
  const isNearLimit = current >= min * 0.8 && current < min;

  return (
    <div className="char-counter">
      <div className="counter-info">
        {/* Цвет зависит от состояния: зеленый, желтый или красный */}
        <span className={isValid ? 'valid' : isNearLimit ? 'near-limit' : 'invalid'}>
          {current} / {min} символов
        </span>

        {/* Показываем сколько осталось, если не хватает */}
        {!isValid && (
          <span className="remaining">
            Осталось {min - current} символов
          </span>
        )}
      </div>

      {/* Прогресс-бар с соответствующей цветовой индикацией */}
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