import { PokemonStatName } from '../types';

export const POKEMON_STAT_LABELS: Record<PokemonStatName, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. especial',
  'special-defense': 'Def. especial',
  speed: 'Velocidad',
};

export const POKEMON_STAT_MAX_VALUE = 255;
