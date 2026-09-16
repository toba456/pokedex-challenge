import { PokemonListItem } from '../../domain/entities/PokemonListItem';
import { PokemonLocalDataSource } from '../datasources/local/PokemonLocalDataSource';
import { PokemonApiError } from '../datasources/remote/PokemonApiError';
import { PokemonListResponseDTO } from '../datasources/remote/PokemonListDTO';
import { PokemonRemoteDataSource } from '../datasources/remote/PokemonRemoteDataSource';
import { PokemonRepositoryImpl } from './PokemonRepositoryImpl';

const buildRemoteDataSourceMock = (): jest.Mocked<PokemonRemoteDataSource> =>
  ({
    getPokemonList: jest.fn(),
  }) as unknown as jest.Mocked<PokemonRemoteDataSource>;

const buildLocalDataSourceMock = (): jest.Mocked<PokemonLocalDataSource> =>
  ({
    saveList: jest.fn().mockResolvedValue(undefined),
    getList: jest.fn(),
  }) as unknown as jest.Mocked<PokemonLocalDataSource>;

describe('PokemonRepositoryImpl', () => {
  it('mapea el DTO del datasource a entidades de domain', async () => {
    const responseDTO: PokemonListResponseDTO = {
      count: 1302,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    };
    const remoteDataSource = buildRemoteDataSourceMock();
    remoteDataSource.getPokemonList.mockResolvedValue(responseDTO);
    const localDataSource = buildLocalDataSourceMock();
    const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

    const result = await repository.getPokemonList(20, 0);

    expect(remoteDataSource.getPokemonList).toHaveBeenCalledWith(20, 0);
    expect(result).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
      {
        id: 2,
        name: 'ivysaur',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
      },
    ]);
  });

  it('devuelve una lista vacía cuando la API no tiene resultados', async () => {
    const responseDTO: PokemonListResponseDTO = { count: 0, next: null, previous: null, results: [] };
    const remoteDataSource = buildRemoteDataSourceMock();
    remoteDataSource.getPokemonList.mockResolvedValue(responseDTO);
    const localDataSource = buildLocalDataSourceMock();
    const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

    const result = await repository.getPokemonList(20, 0);

    expect(result).toEqual([]);
  });

  it('si remote responde ok, guarda la lista mapeada en cache', async () => {
    const responseDTO: PokemonListResponseDTO = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };
    const remoteDataSource = buildRemoteDataSourceMock();
    remoteDataSource.getPokemonList.mockResolvedValue(responseDTO);
    const localDataSource = buildLocalDataSourceMock();
    const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

    const result = await repository.getPokemonList(20, 0);

    expect(localDataSource.saveList).toHaveBeenCalledWith(result);
  });

  it('si remote falla y hay cache disponible, devuelve la cache', async () => {
    const apiError = new PokemonApiError('network', 'No se pudo conectar con la PokéAPI');
    const remoteDataSource = buildRemoteDataSourceMock();
    remoteDataSource.getPokemonList.mockRejectedValue(apiError);
    const cachedItems: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];
    const localDataSource = buildLocalDataSourceMock();
    localDataSource.getList.mockResolvedValue(cachedItems);
    const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

    const result = await repository.getPokemonList(20, 0);

    expect(result).toEqual(cachedItems);
  });

  it('si remote falla y no hay cache, propaga el error original', async () => {
    const apiError = new PokemonApiError('network', 'No se pudo conectar con la PokéAPI');
    const remoteDataSource = buildRemoteDataSourceMock();
    remoteDataSource.getPokemonList.mockRejectedValue(apiError);
    const localDataSource = buildLocalDataSourceMock();
    localDataSource.getList.mockResolvedValue(null);
    const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

    await expect(repository.getPokemonList(20, 0)).rejects.toBe(apiError);
  });
});
