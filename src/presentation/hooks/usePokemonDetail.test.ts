import { renderHook, waitFor } from '@testing-library/react-native';

import { getPokemonDetailUseCase } from '../../di/container';
import { PokemonDetail } from '../../domain/entities';
import { initialPokemonDetailState, usePokemonDetail } from './usePokemonDetail';

jest.mock('../../di/container', () => ({
  getPokemonDetailUseCase: { execute: jest.fn() },
}));

const mockedExecute = getPokemonDetailUseCase.execute as jest.Mock;

const buildPokemonDetail = (): PokemonDetail => ({
  id: 25,
  name: 'pikachu',
  imageUrl: 'https://example.com/25.png',
  types: ['electric'],
  abilities: ['static'],
  stats: [{ name: 'hp', baseValue: 35 }],
  height: 0.4,
  weight: 6,
  baseExperience: 112,
});

describe('usePokemonDetail', () => {
  beforeEach(() => {
    mockedExecute.mockReset();
  });

  it('declara loading como estado inicial, sin pasar por idle', () => {
    expect(initialPokemonDetailState).toEqual({ status: 'loading' });
  });

  it('pasa a loading al montar y dispara la carga a través del use case con el id recibido', async () => {
    mockedExecute.mockReturnValue(new Promise(() => undefined));

    const { result } = await renderHook(() => usePokemonDetail(25));

    expect(result.current.status).toBe('loading');
    expect(mockedExecute).toHaveBeenCalledWith(25);
  });

  it('pasa a success con los datos cuando el use case resuelve', async () => {
    const pokemonDetail = buildPokemonDetail();
    mockedExecute.mockResolvedValue(pokemonDetail);

    const { result } = await renderHook(() => usePokemonDetail(25));

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(pokemonDetail);
  });

  it('pasa a error con el mensaje cuando el use case rechaza', async () => {
    mockedExecute.mockRejectedValue(new Error('La PokéAPI respondió con un error (status 404)'));

    const { result } = await renderHook(() => usePokemonDetail(99999));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe('La PokéAPI respondió con un error (status 404)');
  });
});
