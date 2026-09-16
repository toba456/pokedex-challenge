import { PokemonType } from '@shared/types';
import { PokemonStat } from './PokemonStat';

export interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  abilities: string[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  baseExperience: number | null;
}
