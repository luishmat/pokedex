import React, { useState } from 'react';
import { useTheme, CARD_ORDERS } from './ThemeContext';
import './Settings.css';

const Settings = () => {
  const { currentTheme, setCurrentTheme, themes, cardOrder, setCardOrder, cardOrders } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button 
        className="settings-button"
        onClick={() => setShowSettings(!showSettings)}
        title="Abrir configuración"
      >
        ⚙️
      </button>

      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header">
            <h2>⚙️ Configuración</h2>
            <button 
              className="close-settings"
              onClick={() => setShowSettings(false)}
            >
              ✕
            </button>
          </div>

          <div className="settings-content">
            {/* Selector de Temas */}
            <div className="settings-section">
              <h3> Tema</h3>
              <div className="theme-selector">
                {Object.entries(themes).map(([themeKey, themeValue]) => (
                  <button
                    key={themeKey}
                    className={`theme-option ${currentTheme === themeKey ? 'active' : ''}`}
                    onClick={() => setCurrentTheme(themeKey)}
                    style={{
                      background: themeValue.background,
                      color: themeValue.primaryText
                    }}
                    title={themeValue.name}
                  >
                    {themeValue.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Orden de Tarjetas */}
            <div className="settings-section">
              <h3> Orden de Tarjetas</h3>
              <select 
                className="order-selector"
                value={cardOrder}
                onChange={(e) => setCardOrder(e.target.value)}
              >
                {Object.entries(cardOrders).map(([key, option]) => (
                  <option key={key} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Info */}
            <div className="settings-section info">
              <p> Los cambios se guardan automáticamente</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
