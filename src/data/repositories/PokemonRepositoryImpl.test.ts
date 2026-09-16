import { PokemonListItem } from '../../domain/entities/PokemonListItem';
import { PokemonLocalDataSource } from '../datasources/local/PokemonLocalDataSource';
import { PokemonApiError } from '../datasources/remote/PokemonApiError';
import { PokemonDetailDTO } from '../datasources/remote/PokemonDetailDTO';
import { PokemonListResponseDTO } from '../datasources/remote/PokemonListDTO';
import { PokemonRemoteDataSource } from '../datasources/remote/PokemonRemoteDataSource';
import { PokemonRepositoryImpl } from './PokemonRepositoryImpl';

const buildRemoteDataSourceMock = (): jest.Mocked<PokemonRemoteDataSource> =>
  ({
    getPokemonList: jest.fn(),
    getPokemonDetail: jest.fn(),
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
      next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
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
    expect(result).toEqual({
      items: [
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
      ],
      hasMore: true,
    });
  });

  it('devuelve una página vacía con hasMore false cuando la API no tiene resultados', async () => {
    const responseDTO: PokemonListResponseDTO = { count: 0, next: null, previous: null, results: [] };
    const remoteDataSource = buildRemoteDataSourceMock();
    remoteDataSource.getPokemonList.mockResolvedValue(responseDTO);
    const localDataSource = buildLocalDataSourceMock();
    const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

    const result = await repository.getPokemonList(20, 0);

    expect(result).toEqual({ items: [], hasMore: false });
  });

  it('en offset 0 guarda en cache solo los items de la página actual (sin mergear con cache previa)', async () => {
    const responseDTO: PokemonListResponseDTO = {
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };
    const remoteDataSource = buildRemoteDataSourceMock();
    remoteDataSource.getPokemonList.mockResolvedValue(responseDTO);
    const localDataSource = buildLocalDataSourceMock();
    const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

    const result = await repository.getPokemonList(20, 0);

    expect(localDataSource.getList).not.toHaveBeenCalled();
    expect(localDataSource.saveList).toHaveBeenCalledWith(result.items);
  });

  it('en offset > 0 guarda en cache el array acumulado (cache previa + página nueva)', async () => {
    const responseDTO: PokemonListResponseDTO = {
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=40',
      previous: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
      results: [{ name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }],
    };
    const remoteDataSource = buildRemoteDataSourceMock();
    remoteDataSource.getPokemonList.mockResolvedValue(responseDTO);
    const previousItems: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];
    const localDataSource = buildLocalDataSourceMock();
    localDataSource.getList.mockResolvedValue(previousItems);
    const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

    const result = await repository.getPokemonList(20, 20);

    expect(localDataSource.saveList).toHaveBeenCalledWith([...previousItems, ...result.items]);
  });

  it('si remote falla y hay cache disponible, devuelve la cache con hasMore false', async () => {
    const apiError = new PokemonApiError('network', 'No se pudo conectar con la PokéAPI');
    const remoteDataSource = buildRemoteDataSourceMock();
    remoteDataSource.getPokemonList.mockRejectedValue(apiError);
    const cachedItems: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];
    const localDataSource = buildLocalDataSourceMock();
    localDataSource.getList.mockResolvedValue(cachedItems);
    const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

    const result = await repository.getPokemonList(20, 0);

    expect(result).toEqual({ items: cachedItems, hasMore: false });
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

  describe('getPokemonDetail', () => {
    const pikachuDTO: PokemonDetailDTO = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      abilities: [{ ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 }],
      stats: [{ base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } }],
    };

    it('mapea el DTO del datasource remoto a la entidad de domain', async () => {
      const remoteDataSource = buildRemoteDataSourceMock();
      remoteDataSource.getPokemonDetail.mockResolvedValue(pikachuDTO);
      const localDataSource = buildLocalDataSourceMock();
      const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

      const result = await repository.getPokemonDetail(25);

      expect(remoteDataSource.getPokemonDetail).toHaveBeenCalledWith(25);
      expect(result).toEqual({
        id: 25,
        name: 'pikachu',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        types: ['electric'],
        abilities: ['static'],
        stats: [{ name: 'hp', baseValue: 35 }],
        height: 0.4,
        weight: 6,
        baseExperience: 112,
      });
    });

    it('no consulta ni escribe la cache local (el detalle no se cachea todavía)', async () => {
      const remoteDataSource = buildRemoteDataSourceMock();
      remoteDataSource.getPokemonDetail.mockResolvedValue(pikachuDTO);
      const localDataSource = buildLocalDataSourceMock();
      const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

      await repository.getPokemonDetail(25);

      expect(localDataSource.saveList).not.toHaveBeenCalled();
      expect(localDataSource.getList).not.toHaveBeenCalled();
    });

    it('propaga el error del datasource sin caer a ninguna cache', async () => {
      const apiError = new PokemonApiError('http', 'La PokéAPI respondió con un error (status 404)');
      const remoteDataSource = buildRemoteDataSourceMock();
      remoteDataSource.getPokemonDetail.mockRejectedValue(apiError);
      const localDataSource = buildLocalDataSourceMock();
      const repository = new PokemonRepositoryImpl(remoteDataSource, localDataSource);

      await expect(repository.getPokemonDetail(99999)).rejects.toBe(apiError);
      expect(localDataSource.getList).not.toHaveBeenCalled();
    });
  });
});
