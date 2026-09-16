import { PokemonType } from '@shared/types';
import { PokemonStat } from './PokemonStat';

export interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  abilities: string[];
  stats: PokemonStat[];
  // Convertidos a metros y kilogramos en el mapper (la PokéAPI los expone en
  // decímetros y hectogramos): domain no debería exponer unidades crudas de API.
  height: number;
  weight: number;
  // La PokéAPI lo tipa como nullable: no todas las formas/entradas lo traen.
  baseExperience: number | null;
}
