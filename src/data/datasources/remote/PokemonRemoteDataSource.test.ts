import { PokemonApiError } from './PokemonApiError';
import { PokemonRemoteDataSource } from './PokemonRemoteDataSource';
import { PokemonListResponseDTO } from './PokemonListDTO';

describe('PokemonRemoteDataSource', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('devuelve el DTO crudo cuando la respuesta es exitosa', async () => {
    const responseBody: PokemonListResponseDTO = {
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(responseBody),
    }) as unknown as typeof fetch;
    const dataSource = new PokemonRemoteDataSource();

    const result = await dataSource.getPokemonList(20, 0);

    expect(result).toEqual(responseBody);
    expect(globalThis.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
  });

  it('lanza PokemonApiError de tipo http cuando la respuesta no es ok', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn(),
    }) as unknown as typeof fetch;
    const dataSource = new PokemonRemoteDataSource();

    await expect(dataSource.getPokemonList(20, 0)).rejects.toMatchObject({
      type: 'http',
    } satisfies Partial<PokemonApiError>);
  });

  it('lanza PokemonApiError de tipo network cuando el fetch rechaza', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('sin conexión')) as unknown as typeof fetch;
    const dataSource = new PokemonRemoteDataSource();

    await expect(dataSource.getPokemonList(20, 0)).rejects.toMatchObject({
      type: 'network',
    } satisfies Partial<PokemonApiError>);
  });

  it('lanza PokemonApiError de tipo parse cuando el JSON es inválido', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new Error('unexpected token')),
    }) as unknown as typeof fetch;
    const dataSource = new PokemonRemoteDataSource();

    await expect(dataSource.getPokemonList(20, 0)).rejects.toMatchObject({
      type: 'parse',
    } satisfies Partial<PokemonApiError>);
  });
});
