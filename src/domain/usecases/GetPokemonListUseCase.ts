import { PokemonListPage } from '../entities/PokemonListPage';
import { IPokemonRepository } from '../repositories/IPokemonRepository';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export class GetPokemonListUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute(limit: number = DEFAULT_LIMIT, offset: number = DEFAULT_OFFSET): Promise<PokemonListPage> {
    return this.pokemonRepository.getPokemonList(limit, offset);
  }
}
