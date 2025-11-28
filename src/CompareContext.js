import React, { createContext, useState, useContext, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('pokedexCompare');
    if (saved) setCompareItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('pokedexCompare', JSON.stringify(compareItems));
  }, [compareItems]);

  const addCompare = (item) => {
    setCompareItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      // limit to 4 items
      if (prev.length >= 4) return prev;
      return [...prev, item];
    });
  };

  const removeCompare = (id) => {
    setCompareItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider value={{ compareItems, addCompare, removeCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
