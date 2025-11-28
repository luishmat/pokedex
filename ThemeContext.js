import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  light: {
    name: 'Claro',
    background: 'linear-gradient(135deg, #ff5757, #ffcc33)',
    primaryText: '#fff',
    secondaryText: '#333',
    cardBackground: '#ffffff',
    cardText: '#333',
    accentColor: '#4CAF50',
    panelBackground: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#ddd',
    carouselBg: 'rgba(255, 255, 255, 0.2)',
    carouselBgActive: 'rgba(255, 255, 255, 0.4)'
  },
  dark: {
    name: 'Oscuro',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    primaryText: '#fff',
    secondaryText: '#e0e0e0',
    cardBackground: '#2d2d44',
    cardText: '#e0e0e0',
    accentColor: '#64dd17',
    panelBackground: 'rgba(255, 255, 255, 0.05)',
    borderColor: '#444',
    carouselBg: 'rgba(255, 255, 255, 0.1)',
    carouselBgActive: 'rgba(255, 255, 255, 0.2)'
  },
  midnight: {
    name: 'Medianoche',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    primaryText: '#fff',
    secondaryText: '#b0b0b0',
    cardBackground: '#1a1633',
    cardText: '#b0b0b0',
    accentColor: '#a78bfa',
    panelBackground: 'rgba(167, 139, 250, 0.1)',
    borderColor: '#553399',
    carouselBg: 'rgba(167, 139, 250, 0.15)',
    carouselBgActive: 'rgba(167, 139, 250, 0.3)'
  },
  sunset: {
    name: 'Atardecer',
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e53, #ffa85c)',
    primaryText: '#fff',
    secondaryText: '#2d2d2d',
    cardBackground: '#ffe5cc',
    cardText: '#2d2d2d',
    accentColor: '#ff6348',
    panelBackground: 'rgba(255, 255, 255, 0.15)',
    borderColor: '#ff8e53',
    carouselBg: 'rgba(255, 255, 255, 0.2)',
    carouselBgActive: 'rgba(255, 255, 255, 0.35)'
  },
  ocean: {
    name: 'Océano',
    background: 'linear-gradient(135deg, #0066cc, #00ccff)',
    primaryText: '#fff',
    secondaryText: '#e8f4f8',
    cardBackground: '#004d99',
    cardText: '#e8f4f8',
    accentColor: '#00ff88',
    panelBackground: 'rgba(0, 204, 255, 0.1)',
    borderColor: '#0099cc',
    carouselBg: 'rgba(0, 204, 255, 0.15)',
    carouselBgActive: 'rgba(0, 204, 255, 0.3)'
  }
};

export const CARD_ORDERS = {
  idAsc: { name: 'ID Ascendente', value: 'id-asc' },
  idDesc: { name: 'ID Descendente', value: 'id-desc' },
  nameAsc: { name: 'Nombre A-Z', value: 'name-asc' },
  nameDesc: { name: 'Nombre Z-A', value: 'name-desc' }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [cardOrder, setCardOrder] = useState('id-asc');

  // Cargar preferencias desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('pokedexTheme');
    const savedOrder = localStorage.getItem('pokedexCardOrder');
    
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    if (savedOrder) {
      setCardOrder(savedOrder);
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('pokedexTheme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('pokedexCardOrder', cardOrder);
  }, [cardOrder]);

  const value = {
    currentTheme,
    setCurrentTheme,
    theme: THEMES[currentTheme],
    cardOrder,
    setCardOrder,
    themes: THEMES,
    cardOrders: CARD_ORDERS
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};
