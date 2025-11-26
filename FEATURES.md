#  Pokédex Personal - Características

##  Características Principales

### 1. **Sistema de Temas **
La aplicación ahora incluye 5 temas diferentes que puedes cambiar en cualquier momento:

- **Claro**: Tema luminoso con colores vibrantes (naranja y amarillo)
- **Oscuro**: Tema oscuro elegante para trabajar de noche
- **Medianoche**: Tema con gradientes morados oscuros
- **Atardecer**: Colores cálidos con tonos naranjas
- **Océano**: Tonos azules refrescantes

**Acceso**: Haz clic en el botón ⚙️ en la esquina superior derecha para abrir el panel de configuración.

### 2. **Orden de Tarjetas **
Personaliza cómo se ordenan los Pokémon en el grid:

- **ID Ascendente**: Ordena por ID de menor a mayor
- **ID Descendente**: Ordena por ID de mayor a menor
- **Nombre A-Z**: Ordena alfabéticamente
- **Nombre Z-A**: Ordena alfabéticamente inverso

**Acceso**: En el panel de configuración, selecciona el orden deseado desde el dropdown.

### 3. **Panel de Configuración ⚙️**
Un panel lateral elegante que contiene:
- Selector visual de temas con preview
- Dropdown para orden de tarjetas
- Información sobre guardado automático
- Cierre rápido con botón X

**Características**:
- Se abre/cierra con animaciones suaves
- Los cambios se guardan automáticamente en localStorage
- Diseño responsive y atractivo

### 4. **Persistencia de Preferencias **
Todas tus configuraciones se guardan automáticamente:
- Tema seleccionado
- Orden de tarjetas preferido
- Pokémon personalizados guardados

Tus preferencias se cargan automáticamente al volver a la aplicación.

## Cómo Usar

### Cambiar Tema
1. Haz clic en el botón ⚙️ en la esquina superior derecha
2. Selecciona uno de los 5 temas disponibles
3. El cambio es inmediato

### Cambiar Orden de Tarjetas
1. Abre el panel de configuración (⚙️)
2. Selecciona un orden del dropdown " Orden de Tarjetas"
3. Las tarjetas se reorganizarán al instante

### Agregar Pokémon Personalizados
1. Haz clic en "Agregar Nuevo Pokémon"
2. Completa el formulario con:
   - Nombre
   - Tipo
   - URL de la imagen
   - Descripción
3. Haz clic en "Guardar"

### Editar Pokémon Personalizados
1. Selecciona un Pokémon personalizado
2. Haz clic en el botón "Editar"
3. Modifica los datos
4. Guarda los cambios

### Buscar Pokémon
Usa la barra de búsqueda para filtrar Pokémon originales por nombre.

## Tecnologías Utilizadas

- **React**: Librería de UI
- **Context API**: Gestión de estado global para temas
- **localStorage**: Persistencia de datos
- **CSS3**: Animaciones y diseño responsivo

##  Compatibilidad

-  Desktop (Chrome, Firefox, Safari, Edge)
-  Tablet
- Mobile (responsive design)

## Personalización Futura

El sistema está diseñado para ser fácilmente extensible. Puedes:
- Agregar nuevos temas editando `ThemeContext.js`
- Agregar nuevas opciones de configuración en `Settings.js`
- Modificar los colores en `THEMES` objeto
