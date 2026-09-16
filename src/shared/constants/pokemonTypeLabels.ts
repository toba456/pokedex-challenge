import { PokemonType } from '../types';

// Traducción a texto legible de los tipos en inglés/kebab-case que trae la
// PokéAPI: el PokemonType interno se conserva tal cual (es la key de
// POKEMON_TYPE_COLORS y de la lógica), esta tabla es la única que sabe cómo
// mostrarlo (sección 9).
export const POKEMON_TYPE_LABELS: Record<PokemonType, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};
