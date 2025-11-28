import React from 'react';
import { useCompare } from './CompareContext';
import { useCart } from './CartContext';

const Compare = () => {
  const { compareItems, removeCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareItems.length === 0) return null;

  return (
    <div className="compare-panel">
      <div className="compare-header">
        <h3>Comparar (Entrenadores)</h3>
        <div>
          <button onClick={() => clearCompare()}>Limpiar</button>
        </div>
      </div>
      <div className="compare-grid">
        {compareItems.map(item => (
          <div key={item.id} className="compare-card">
            {/* Render trainer or fallback */}
            {item.type === 'trainer' ? (
              <>
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} />
                ) : (
                  <div style={{ width:80, height:80, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.03)', borderRadius:8 }}>👤</div>
                )}
                <h4>{item.name}</h4>
                <p>Nivel: {item.level}</p>
                <p>Especialidad: {item.specialty}</p>
                <div className="compare-actions">
                  <button onClick={() => addToCart({ ...item, price: item.price || (Math.random()*10+5) }, 1)}>Agregar al carrito</button>
                  <button onClick={() => removeCompare(item.id)}>Quitar</button>
                </div>
              </>
            ) : (
              // In case old pokemon items are present, render a fallback view but discourage
              <>
                <img src={item.sprites?.other?.['official-artwork']?.front_default} alt={item.name} />
                <h4>{item.name}</h4>
                <p>Tipo: {item.types?.map(t => t.type.name).join(', ')}</p>
                <div className="compare-actions">
                  <button onClick={() => addToCart({ ...item, price: item.price || (Math.random()*10+1) }, 1)}>Agregar al carrito</button>
                  <button onClick={() => removeCompare(item.id)}>Quitar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
