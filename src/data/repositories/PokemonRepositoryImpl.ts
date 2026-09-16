import { PokemonListItem } from '../../domain/entities/PokemonListItem';
import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';
import { PokemonRemoteDataSource } from '../datasources/remote/PokemonRemoteDataSource';
import { mapPokemonListItemDTOToEntity } from '../mappers/pokemonMapper';

export class PokemonRepositoryImpl implements IPokemonRepository {
  constructor(private readonly remoteDataSource: PokemonRemoteDataSource) {}

  async getPokemonList(limit: number, offset: number): Promise<PokemonListItem[]> {
    const response = await this.remoteDataSource.getPokemonList(limit, offset);
    return response.results.map(mapPokemonListItemDTOToEntity);
  }
}
