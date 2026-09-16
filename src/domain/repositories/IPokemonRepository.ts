import { PokemonDetail } from '../entities/PokemonDetail';
import { PokemonListItem } from '../entities/PokemonListItem';

export interface IPokemonRepository {
  getPokemonList(limit: number, offset: number): Promise<PokemonListItem[]>;
  getPokemonDetail(id: number): Promise<PokemonDetail>;
}
