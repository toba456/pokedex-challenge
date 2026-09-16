import { PokemonDetail } from '../entities/PokemonDetail';
import { PokemonListPage } from '../entities/PokemonListPage';

export interface IPokemonRepository {
  getPokemonList(limit: number, offset: number): Promise<PokemonListPage>;
  getPokemonDetail(id: number): Promise<PokemonDetail>;
}
