import { PokemonListItem } from '../entities/PokemonListItem';
import { IPokemonRepository } from '../repositories/IPokemonRepository';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export class GetPokemonListUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute(limit: number = DEFAULT_LIMIT, offset: number = DEFAULT_OFFSET): Promise<PokemonListItem[]> {
    return this.pokemonRepository.getPokemonList(limit, offset);
  }
}
