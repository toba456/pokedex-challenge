import { PokemonDetail } from '@domain/entities/PokemonDetail';
import { PokemonListPage } from '@domain/entities/PokemonListPage';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
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
      // El fallback a cache solo aplica en offset 0: la cache guarda la lista
      // COMPLETA acumulada, no una página nueva. En offset > 0 devolverla
      // duplicaría los items ya renderizados; se propaga el error y lo
      // maneja usePokemonList (loadMoreError) sin tocar la lista visible.
      if (offset === 0) {
        const cachedItems = await this.localDataSource.getList();

        if (cachedItems !== null) {
          return { items: cachedItems, hasMore: false };
        }
      }

      throw error;
    }
  }

  // Mismo patrón network-first que getPokemonList, pero cacheado por id
  // individual: si el remote falla, solo hay fallback si ESE id puntual
  // tiene cache guardada (no cruza con el detalle de otro pokemon).
  async getPokemonDetail(id: number): Promise<PokemonDetail> {
    try {
      const dto = await this.remoteDataSource.getPokemonDetail(id);
      const detail = mapPokemonDetailDTOToEntity(dto);
      void this.localDataSource.saveDetail(id, detail).catch(() => undefined);
      return detail;
    } catch (error) {
      const cachedDetail = await this.localDataSource.getDetail(id);

      if (cachedDetail !== null) {
        return cachedDetail;
      }

      throw error;
    }
  }
}
