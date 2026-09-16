import { PokemonApiError } from '../datasources/remote/PokemonApiError';
import { PokemonListResponseDTO } from '../datasources/remote/PokemonListDTO';
import { PokemonRemoteDataSource } from '../datasources/remote/PokemonRemoteDataSource';
import { PokemonRepositoryImpl } from './PokemonRepositoryImpl';

const buildDataSourceMock = (): jest.Mocked<PokemonRemoteDataSource> =>
  ({
    getPokemonList: jest.fn(),
  }) as unknown as jest.Mocked<PokemonRemoteDataSource>;

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
    const dataSource = buildDataSourceMock();
    dataSource.getPokemonList.mockResolvedValue(responseDTO);
    const repository = new PokemonRepositoryImpl(dataSource);

    const result = await repository.getPokemonList(20, 0);

    expect(dataSource.getPokemonList).toHaveBeenCalledWith(20, 0);
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

  it('propaga el error del datasource sin envolverlo', async () => {
    const dataSource = buildDataSourceMock();
    const apiError = new PokemonApiError('network', 'No se pudo conectar con la PokéAPI');
    dataSource.getPokemonList.mockRejectedValue(apiError);
    const repository = new PokemonRepositoryImpl(dataSource);

    await expect(repository.getPokemonList(20, 0)).rejects.toBe(apiError);
  });

  it('devuelve una lista vacía cuando la API no tiene resultados', async () => {
    const responseDTO: PokemonListResponseDTO = { count: 0, next: null, previous: null, results: [] };
    const dataSource = buildDataSourceMock();
    dataSource.getPokemonList.mockResolvedValue(responseDTO);
    const repository = new PokemonRepositoryImpl(dataSource);

    const result = await repository.getPokemonList(20, 0);

    expect(result).toEqual([]);
  });
});
