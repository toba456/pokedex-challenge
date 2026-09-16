import { PokemonListItem } from '../../domain/entities/PokemonListItem';
import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';
import { PokemonLocalDataSource } from '../datasources/local/PokemonLocalDataSource';
import { PokemonRemoteDataSource } from '../datasources/remote/PokemonRemoteDataSource';
import { mapPokemonListItemDTOToEntity } from '../mappers/pokemonMapper';

export class PokemonRepositoryImpl implements IPokemonRepository {
  constructor(
    private readonly remoteDataSource: PokemonRemoteDataSource,
    private readonly localDataSource: PokemonLocalDataSource,
  ) {}

  async getPokemonList(limit: number, offset: number): Promise<PokemonListItem[]> {
    try {
      const response = await this.remoteDataSource.getPokemonList(limit, offset);
      const items = response.results.map(mapPokemonListItemDTOToEntity);
      void this.localDataSource.saveList(items).catch(() => undefined);
      return items;
    } catch (error) {
      const cachedItems = await this.localDataSource.getList();

      if (cachedItems !== null) {
        return cachedItems;
      }

      throw error;
    }
  }
}
