import { PokemonStatName } from '../types';

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
