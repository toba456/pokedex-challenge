import { PokemonStatName } from '../types';

// Traducción a texto legible de los nombres kebab-case que trae la PokéAPI
// (ej. "special-attack"): el dato crudo se conserva tal cual en domain/data,
// esta tabla es la única que sabe cómo mostrarlo .
export const POKEMON_STAT_LABELS: Record<PokemonStatName, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. especial',
  'special-defense': 'Def. especial',
  speed: 'Velocidad',
};

// Máximo teórico de un stat base en los juegos principales (ej. el HP base de
// Blissey): se usa como denominador para el ancho proporcional de cada barra.
export const POKEMON_STAT_MAX_VALUE = 255;
