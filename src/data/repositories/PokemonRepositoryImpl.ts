import { PokemonDetail } from '../../domain/entities/PokemonDetail';
import { PokemonListPage } from '../../domain/entities/PokemonListPage';
import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';
import { PokemonLocalDataSource } from '../datasources/local/PokemonLocalDataSource';
import { PokemonRemoteDataSource } from '../datasources/remote/PokemonRemoteDataSource';
import { mapPokemonDetailDTOToEntity } from '../mappers/pokemonDetailMapper';
import { mapPokemonListResponseDTOToPage } from '../mappers/pokemonMapper';

export class PokemonRepositoryImpl implements IPokemonRepository {
  constructor(
    private readonly remoteDataSource: PokemonRemoteDataSource,
    private readonly localDataSource: PokemonLocalDataSource,
  ) {}

  async getPokemonList(limit: number, offset: number): Promise<PokemonListPage> {
    try {
      const response = await this.remoteDataSource.getPokemonList(limit, offset);
      const page = mapPokemonListResponseDTOToPage(response);
      // offset 0 es siempre una carga desde cero (primer montado o refresh):
      // la cache se reemplaza en vez de mergearse con una sesión de paginación
      // anterior que ya no corresponde al listado que se está mostrando.
      const previousItems = offset === 0 ? [] : ((await this.localDataSource.getList()) ?? []);
      const accumulatedItems = [...previousItems, ...page.items];
      void this.localDataSource.saveList(accumulatedItems).catch(() => undefined);
      return page;
    } catch (error) {
      const cachedItems = await this.localDataSource.getList();

      if (cachedItems !== null) {
        return { items: cachedItems, hasMore: false };
      }

      throw error;
    }
  }

  // Sin cache local a diferencia de getPokemonList: el detalle no se cachea
  // todavía (a evaluar más adelante como paso aparte, no se asume acá).
  async getPokemonDetail(id: number): Promise<PokemonDetail> {
    const dto = await this.remoteDataSource.getPokemonDetail(id);
    return mapPokemonDetailDTOToEntity(dto);
  }
}
