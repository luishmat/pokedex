import React from 'react';
import './PokedexView.css';

const PokedexView = ({
  pokemon,
  onClose,
  onEdit,
  onDelete,
  onAddToCart,
  onPrev,
  onNext,
  onSelect
}) => {
  if (!pokemon) return null;

  const img = pokemon.sprites?.other?.['official-artwork']?.front_default || '';

  return (
    <div className="pokedex-shell">
      <div className="pokedex-left">
        <div className="pokedex-top">
          <div className="pokedex-lamp" />
          <div className="pokedex-lamp small" />
          <div className="pokedex-lamp small" />
        </div>

        <div className="pokedex-screen">
          {img ? (
            <img src={img} alt={pokemon.name} />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>

        <div className="pokedex-controls">
          <button onClick={onPrev}>◀</button>
          <button onClick={() => onSelect(pokemon)}>●</button>
          <button onClick={onNext}>▶</button>
        </div>
      </div>

      <div className="pokedex-right">
        <div className="pokedex-info">
          <h2>{pokemon.name.toUpperCase()}</h2>
          <div className="pokedex-info-row">
            <div><strong>Tipo:</strong> {pokemon.types?.map(t => t.type.name).join(', ')}</div>
            <div><strong>ID:</strong> {pokemon.id}</div>
          </div>
          {pokemon.description && <p className="desc">{pokemon.description}</p>}
          {/* Stats */}
          {pokemon.stats && (
            <div className="pokedex-stats">
              {pokemon.stats.map(s => (
                <div key={s.stat.name} className="stat">
                  <div style={{fontWeight:700}}>{s.stat.name.toUpperCase()}</div>
                  <div>{s.base_stat}</div>
                </div>
              ))}
            </div>
          )}
          {/* Top moves (first 8) */}
          {pokemon.moves && (
            <div className="moves-list">
              {pokemon.moves.slice(0,8).map(m => (
                <div key={m.move.name} className="move-pill">{m.move.name}</div>
              ))}
            </div>
          )}
        </div>

        <div className="pokedex-actions">
          <div className="action-row">
            <button onClick={() => onAddToCart(pokemon)}>🛒 Comprar</button>
            {pokemon.isCustom ? (
              <button onClick={() => onEdit(pokemon)}>✎ Editar</button>
            ) : (
              <button onClick={() => onEdit(pokemon)}>✎ Clonar y editar</button>
            )}
            {pokemon.isCustom && (
              <button className="danger" onClick={() => onDelete(pokemon.id)}>🗑️ Eliminar</button>
            )}
          </div>

          <div className="action-row small">
            <button onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokedexView;
