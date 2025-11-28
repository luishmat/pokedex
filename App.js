import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { useTheme, CARD_ORDERS } from "./ThemeContext";
import Settings from "./Settings";
import PokedexView from './PokedexView';
import { useCart } from './CartContext';
import Cart from './Cart';
import { useCompare } from './CompareContext';
import Compare from './Compare';

function App() {
  const { theme, cardOrder } = useTheme();
  const { addToCart } = useCart();
  const { addCompare } = useCompare();
  const [showPokedexView, setShowPokedexView] = useState(false);

  // Trainers (separate from pokemons) - users can add trainers to compare
  const [trainers, setTrainers] = useState([
    { id: 1, name: 'Ash Ketchum', level: 50, specialty: 'Electric', avatar: '', type: 'trainer' },
    { id: 2, name: 'Misty', level: 48, specialty: 'Water', avatar: '', type: 'trainer' }
  ]);
  const [trainerForm, setTrainerForm] = useState({ name: '', level: '', specialty: '', avatar: '' });

  const handleAddTrainer = (e) => {
    e.preventDefault();
    const newTrainer = { id: Date.now(), ...trainerForm, level: Number(trainerForm.level) || 1, type: 'trainer' };
    setTrainers(prev => [...prev, newTrainer]);
    setTrainerForm({ name: '', level: '', specialty: '', avatar: '' });
  };

  // Estados
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [myPokemons, setMyPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pokemonToEditId, setPokemonToEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    imageUrl: "",
    description: ""
  });

  // Lista combinada para el carrusel usando useMemo
  const allPokemonsForCarousel = useMemo(() => {
    return [...myPokemons, ...pokemons].sort((a, b) => {
      const idA = typeof a.id === 'number' ? a.id : Infinity;
      const idB = typeof b.id === 'number' ? b.id : Infinity;
      return idA - idB;
    });
  }, [myPokemons, pokemons]);

  // --- Lógica de Carga y Guardado ---
  useEffect(() => {
    const fetchPokemons = async () => {
      // Nota: Limitar a 151 para mantener el rendimiento
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await response.json();
      const detailedData = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );
      setPokemons(detailedData);
    };
    fetchPokemons();

    const savedPokemons = localStorage.getItem('myPokemons');
    if (savedPokemons) {
      setMyPokemons(JSON.parse(savedPokemons));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myPokemons', JSON.stringify(myPokemons));
    // Después de cargar o guardar, si no hay seleccionado, selecciona el primero
    if (!selectedPokemon && allPokemonsForCarousel.length > 0) {
        setSelectedPokemon(allPokemonsForCarousel[0]);
    }
    // Asegura que el Pokémon seleccionado siga siendo el correcto después de una operación
    if (selectedPokemon) {
        const updatedSelected = allPokemonsForCarousel.find(p => p.id === selectedPokemon.id);
        if (updatedSelected) {
            setSelectedPokemon(updatedSelected);
        } else if (allPokemonsForCarousel.length > 0) {
            setSelectedPokemon(allPokemonsForCarousel[0]);
        } else {
            setSelectedPokemon(null);
        }
    }
  }, [myPokemons, pokemons, selectedPokemon, allPokemonsForCarousel]); // Añadidas todas las dependencias

  // Si selectedPokemon es null, usa el primero de la lista para el showcase
  const currentShowcasePokemon = selectedPokemon || allPokemonsForCarousel[0] || null;

  // Actualiza el currentIndex cuando cambia el selectedPokemon
  useEffect(() => {
    if (currentShowcasePokemon) {
        const index = allPokemonsForCarousel.findIndex(p => p.id === currentShowcasePokemon.id);
        if (index !== -1) {
            setCurrentIndex(index);
        }
    }
  }, [currentShowcasePokemon, allPokemonsForCarousel]);


  // --- Funciones del Formulario ---
  const handleOpenForm = (pokemon = null) => {
    if (pokemon && pokemon.isCustom) {
      setIsEditing(true);
      setPokemonToEditId(pokemon.id);
      setFormData({
        name: pokemon.name,
        type: pokemon.types[0].type.name,
        // Accede a la URL de imagen de la misma forma que en el renderizado
        imageUrl: pokemon.sprites?.other?.["official-artwork"]?.front_default || "", 
        description: pokemon.description || ""
      });
    } else {
      setIsEditing(false);
      setPokemonToEditId(null);
      setFormData({ name: "", type: "", imageUrl: "", description: "" });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setPokemonToEditId(null);
    setFormData({ name: "", type: "", imageUrl: "", description: "" });
  };


  const handleAddOrUpdatePokemon = (e) => {
    e.preventDefault();
    const basePokemon = {
      name: formData.name,
      types: [{ type: { name: formData.type.toLowerCase() } }], // Asegura minúsculas para el CSS
      sprites: {
        other: {
          "official-artwork": {
            front_default: formData.imageUrl
          }
        }
      },
      description: formData.description,
      isCustom: true
    };

    if (isEditing) {
        // Lógica de edición
        setMyPokemons(myPokemons.map(p => 
            p.id === pokemonToEditId 
                ? { ...p, ...basePokemon }
                : p
        ));
    } else {
        // Lógica de adición
        const newPokemon = { id: Date.now(), ...basePokemon };
        setMyPokemons([...myPokemons, newPokemon]);
    }
    handleCloseForm();
  };

  const handleDeletePokemon = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este Pokémon?")) {
        const updatedList = myPokemons.filter(pokemon => pokemon.id !== id);
        setMyPokemons(updatedList);
        // Si eliminamos el seleccionado, seleccionamos el primero de la nueva lista
        if (currentShowcasePokemon && currentShowcasePokemon.id === id) {
            setSelectedPokemon(null);
        }
    }
  };

  // --- Editar cualquier Pokémon (API o personalizado) ---
  const handleEditAnyPokemon = (pokemon) => {
    // Si ya es personalizado, abrir directamente el formulario de edición
    if (pokemon.isCustom) {
      handleOpenForm(pokemon);
      return;
    }

    // Para Pokémon de la API: clonarlo en myPokemons como personalizado y abrir el form
    const cloned = {
      ...pokemon,
      id: Date.now(), // nuevo id único para el personalizado
      isCustom: true,
      description: pokemon.description || ""
    };

    // Añadir a mis pokémons y seleccionar el clon
    setMyPokemons((prev) => {
      const next = [...prev, cloned];
      return next;
    });

    // Seleccionar y abrir formulario (con pequeño retardo para asegurar estado)
    setSelectedPokemon(cloned);
    // Abrir el formulario con los datos del clon en modo edición
    setTimeout(() => handleOpenForm(cloned), 0);
  };

  const openPokedexView = (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowPokedexView(true);
  };

  const closePokedexView = () => setShowPokedexView(false);


  // --- Lógica del Carrusel 3D ---
  const totalPokemon = allPokemonsForCarousel.length;
  const itemsToShow = 10;
  const angleStep = (2 * Math.PI) / itemsToShow;
  const radius = 200;

  const getItemStyle = (index) => {
    // El cálculo del ángulo ahora se basa en el índice dentro de la lista combinada
    const angle = angleStep * (index - currentIndex);
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const scale = z < 0 ? 0.6 : 1;
    const opacity = z < 0 ? 0.3 : 1;

    return {
      transform: `translate3d(${x}px, 0, ${z}px) scale(${scale})`,
      opacity,
      zIndex: Math.round(z * 100)
    };
  };

  // --- Helpers para carrito/compare ---
  const getItemForCart = (pokemon) => {
    const id = pokemon.id ?? Date.now();
    const price = pokemon.price ?? parseFloat(((typeof id === 'number' ? (id % 100) / 10 + 1 : Math.random() * 10 + 1)).toFixed(2));
    return {
      id,
      name: pokemon.name,
      sprites: pokemon.sprites,
      avatar: pokemon.avatar,
      types: pokemon.types,
      price,
    };
  };

  const nextPokemon = () => {
    setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1 >= totalPokemon ? 0 : prevIndex + 1;
        setSelectedPokemon(allPokemonsForCarousel[newIndex]);
        return newIndex;
    });
  };

  const prevPokemon = () => {
    setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex - 1 < 0 ? totalPokemon - 1 : prevIndex - 1;
        setSelectedPokemon(allPokemonsForCarousel[newIndex]);
        return newIndex;
    });
  };


  // --- Filtrado para el Grid inferior (Solo API Pokémons) ---
  const filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- Función para ordenar tarjetas ---
  const sortPokemons = (pokemonArray) => {
    const sortedArray = [...pokemonArray];
    switch (cardOrder) {
      case 'id-asc':
        return sortedArray.sort((a, b) => {
          const idA = typeof a.id === 'number' ? a.id : Infinity;
          const idB = typeof b.id === 'number' ? b.id : Infinity;
          return idA - idB;
        });
      case 'id-desc':
        return sortedArray.sort((a, b) => {
          const idA = typeof a.id === 'number' ? a.id : Infinity;
          const idB = typeof b.id === 'number' ? b.id : Infinity;
          return idB - idA;
        });
      case 'name-asc':
        return sortedArray.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortedArray.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sortedArray;
    }
  };

  const sortedFilteredPokemons = sortPokemons(filteredPokemons);
  
  // --- Renderizado ---
  return (
    <div 
      className="pokedex-container"
      style={{ background: theme.background }}
    >
      <Settings />
      <Cart />
      <Compare />

      <h1 className="pokedex-title" style={{ color: theme.primaryText }}> Mi Pokédex Personal</h1>

      {/* Panel de control */}
      <div className="control-panel" style={{ 
        background: theme.panelBackground,
        borderRadius: '15px',
        padding: '20px'
      }}>
        <button 
          onClick={() => handleOpenForm(null)} 
          className="add-button"
          style={{ 
            backgroundColor: theme.accentColor,
            borderColor: theme.accentColor
          }}
        >
          Agregar Nuevo Pokémon
        </button>
        <input
          type="text"
          placeholder=" Buscar Pokémon..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: theme.cardBackground,
            color: theme.cardText,
            borderColor: theme.borderColor
          }}
        />
      </div>

      {/* Formulario para agregar/editar Pokémon */}
      {showForm && (
        <div className="pokemon-form" style={{
          background: theme.cardBackground,
          color: theme.cardText
        }}>
          <form onSubmit={handleAddOrUpdatePokemon}>
            <h3>{isEditing ? "Editar Pokémon Personalizado" : "Agregar Nuevo Pokémon"}</h3>
            <input
              type="text"
              placeholder="Nombre del Pokémon"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{
                background: theme.panelBackground,
                color: theme.cardText,
                borderColor: theme.borderColor
              }}
              required
            />
            <input
              type="text"
              placeholder="Tipo"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              style={{
                background: theme.panelBackground,
                color: theme.cardText,
                borderColor: theme.borderColor
              }}
              required
            />
            <input
              type="url"
              placeholder="URL de la imagen"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              style={{
                background: theme.panelBackground,
                color: theme.cardText,
                borderColor: theme.borderColor
              }}
              required
            />
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{
                background: theme.panelBackground,
                color: theme.cardText,
                borderColor: theme.borderColor
              }}
              required
            />
            <div className="form-buttons">
              <button 
                type="submit"
                style={{ backgroundColor: theme.accentColor }}
              >
                Guardar
              </button>
              <button 
                type="button" 
                onClick={handleCloseForm}
                style={{ backgroundColor: '#f44336' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Visualizador principal del Pokémon seleccionado (Showcase) */}
      {currentShowcasePokemon && (
        <>
          <h2 className="section-title" style={{ color: theme.primaryText }}> Pokémon Seleccionado</h2>
          <div 
            className="pokemon-showcase"
            style={{
              background: theme.panelBackground,
              borderColor: theme.borderColor
            }}
          >
            <div className="pokemon-details">
              <img
                src={currentShowcasePokemon.sprites.other["official-artwork"].front_default}
                alt={currentShowcasePokemon.name}
                className="pokemon-showcase-img"
              />
              <div className="pokemon-info-large">
                <h2 style={{ color: theme.primaryText }}>{currentShowcasePokemon.name.toUpperCase()}</h2>
                <p style={{ color: theme.secondaryText }}><strong>Tipo:</strong> {currentShowcasePokemon.types.map(t => t.type.name).join(", ")}</p>
                {/* Se necesita otra llamada a la API o manejar la descripción para los pokemons de la API si quieres mostrarla */}
                {currentShowcasePokemon.description && (
                  <p style={{ color: theme.secondaryText }}><strong>Descripción:</strong> {currentShowcasePokemon.description}</p>
                )}
                <div className="pokemon-controls">
                  {/* El botón de editar/eliminar solo aparece para Pokémon personalizados */}
                  {currentShowcasePokemon.isCustom && (
                    <>
                      <button 
                        onClick={() => handleOpenForm(currentShowcasePokemon)}
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        Editar
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDeletePokemon(currentShowcasePokemon.id)}
                        style={{ backgroundColor: '#f44336' }}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  {/* Add to cart for showcase; compare removed for pokemons */}
                  <button
                    onClick={() => addToCart(getItemForCart(currentShowcasePokemon), 1)}
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    🛒 Agregar al carrito
                  </button>
                  <button
                    onClick={() => openPokedexView(currentShowcasePokemon)}
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: theme.primaryText }}
                  >
                    Abrir Pokédex
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Pokedex full view modal */}
      {showPokedexView && currentShowcasePokemon && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ width: '95%', maxWidth: 1000 }}>
            <PokedexView
              pokemon={currentShowcasePokemon}
              onClose={closePokedexView}
              onEdit={(p) => { closePokedexView(); handleEditAnyPokemon(p); }}
              onDelete={(id) => { handleDeletePokemon(id); closePokedexView(); }}
              onAddToCart={(p) => { addToCart(getItemForCart(p), 1); }}
              onPrev={() => prevPokemon()}
              onNext={() => nextPokemon()}
              onSelect={(p) => { setSelectedPokemon(p); closePokedexView(); }}
            />
          </div>
        </div>
      )}
      
      {/* Carrusel Circular de Pokémon */}
      {allPokemonsForCarousel.length > 0 && (
        <>
          <h2 className="section-title" style={{ color: theme.primaryText }}> Carrusel de Pokémon</h2>
          <div className="circular-carousel-container">
            <button 
              onClick={prevPokemon} 
              className="carousel-button prev"
              style={{
                background: theme.carouselBg,
                borderColor: theme.borderColor
              }}
            >
              ←
            </button>
            <div className="circular-carousel">
              <div className="carousel-items">
                {/* Usar la lista combinada para el carrusel */}
                {allPokemonsForCarousel.map((pokemon, index) => (
                  <div
                    key={pokemon.id}
                    className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
                    style={getItemStyle(index)}
                    onClick={() => setSelectedPokemon(pokemon)} // Selecciona el Pokémon al hacer click
                  >
                    {/* Edit button for API pokemons */}
                    {!pokemon.isCustom && (
                      <button
                        className="carousel-edit-button"
                        onClick={(e) => { e.stopPropagation(); handleEditAnyPokemon(pokemon); }}
                        title="Editar este Pokémon"
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          zIndex: 6,
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: 'none',
                          cursor: 'pointer',
                          background: theme.accentColor,
                          color: theme.primaryText,
                          fontWeight: 700
                        }}
                      >
                        ✎
                      </button>
                    )}
                    <div className="pokemon-circle">
                      <img
                        src={pokemon.sprites.other["official-artwork"].front_default}
                        alt={pokemon.name}
                        className="carousel-img"
                      />
                      <p className="pokemon-name">{pokemon.name}</p>
                    </div>
                    {/* small actions on carousel item */}
                    <div style={{ position: 'absolute', left: 6, top: 6, display: 'flex', gap: 6, zIndex: 6 }}>
                      <button
                        className="carousel-add-cart"
                        onClick={(e) => { e.stopPropagation(); addToCart(getItemForCart(pokemon), 1); }}
                        title="Agregar al carrito"
                        style={{ padding: '4px 6px', borderRadius: 6, border: 'none', cursor: 'pointer', background: theme.accentColor, color: theme.primaryText }}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={nextPokemon} 
              className="carousel-button next"
              style={{
                background: theme.carouselBg,
                borderColor: theme.borderColor
              }}
            >
              →
            </button>
          </div>
        </>
      )}


      {/* Grid de Pokémon de la API (Sin cambios) */}
      <h2 className="section-title" style={{ color: theme.primaryText }}>Pokémon Originales (Búsqueda)</h2>
      <div className="pokemon-grid">
        {sortedFilteredPokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className={`pokemon-card type-${pokemon.types[0].type.name}`}
            onClick={() => setSelectedPokemon(pokemon)} // Selecciona al hacer clic en el grid
            onDoubleClick={() => openPokedexView(pokemon)} // Doble click abre la vista Pokédex
            style={{
              background: theme.cardBackground,
              color: theme.cardText,
              borderColor: theme.borderColor,
              position: 'relative'
            }}
          >
            {/* Botón editar (no evita selección al hacer click) */}
            <button
              className="card-edit-button"
              onClick={(e) => { e.stopPropagation(); handleEditAnyPokemon(pokemon); }}
              title="Editar este Pokémon"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '6px 10px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: theme.accentColor,
                color: theme.primaryText,
                fontWeight: 700,
                zIndex: 5
              }}
            >
              ✎
            </button>

            <div className="pokemon-info">
              <h2>{pokemon.name.toUpperCase()}</h2>
              <p>#{pokemon.id}</p>
              <p>
                <strong>Tipo:</strong>{" "}
                {pokemon.types.map((t) => t.type.name).join(", ")}
              </p>
            </div>
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              className="pokemon-img"
            />
            {/* Add to cart actions (compare removed for pokemons) */}
      <div style={{ position: 'absolute', left: 8, bottom: 8, display: 'flex', gap: 8 }}
        onDoubleClick={(e) => { e.stopPropagation(); openPokedexView(pokemon); }}
      >
              <button
                className="card-add-cart"
                onClick={(e) => { e.stopPropagation(); addToCart(getItemForCart(pokemon), 1); }}
                title="Agregar al carrito"
                style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: theme.accentColor, color: theme.primaryText }}
              >
                🛒 Agregar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trainers section: add trainers and compare them */}
      <h2 className="section-title" style={{ color: theme.primaryText, marginTop: 40 }}>Entrenadores</h2>
      <div className="trainer-panel" style={{ maxWidth: 1000, margin: '0 auto 20px' }}>
        <form onSubmit={handleAddTrainer} style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
          <input placeholder="Nombre" value={trainerForm.name} onChange={e => setTrainerForm({...trainerForm, name: e.target.value})} required />
          <input placeholder="Nivel" type="number" value={trainerForm.level} onChange={e => setTrainerForm({...trainerForm, level: e.target.value})} style={{ width: 80 }} />
          <input placeholder="Especialidad" value={trainerForm.specialty} onChange={e => setTrainerForm({...trainerForm, specialty: e.target.value})} />
          <input placeholder="URL avatar (opcional)" value={trainerForm.avatar} onChange={e => setTrainerForm({...trainerForm, avatar: e.target.value})} />
          <button type="submit" style={{ background: theme.accentColor, color: theme.primaryText }}>Agregar Entrenador</button>
        </form>

        <div className="pokemon-grid">
          {trainers.map(t => (
            <div key={t.id} className="pokemon-card" style={{ background: theme.cardBackground, color: theme.cardText, position: 'relative' }}>
              <div style={{ paddingBottom: 8 }}>
                {t.avatar ? <img src={t.avatar} alt={t.name} style={{ width: 100, height: 100, objectFit: 'cover' }} /> : <div style={{ width:100,height:100,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.03)',borderRadius:8}}>👤</div>}
              </div>
              <h3>{t.name}</h3>
              <p>Nivel: {t.level}</p>
              <p>Especialidad: {t.specialty}</p>
              <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:8 }}>
                <button onClick={() => addCompare(t)} style={{ padding: '6px 10px', borderRadius:8, background: 'rgba(255,255,255,0.08)', color: theme.primaryText }}>⚖️ Comparar</button>
                <button onClick={() => addToCart(getItemForCart(t),1)} style={{ padding: '6px 10px', borderRadius:8, background: theme.accentColor, color: theme.primaryText }}>🛒 Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;