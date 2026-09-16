import { PokemonDetail } from '../entities/PokemonDetail';
import { IPokemonRepository } from '../repositories/IPokemonRepository';

export class GetPokemonDetailUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute(id: number): Promise<PokemonDetail> {
    return this.pokemonRepository.getPokemonDetail(id);
  }
}
