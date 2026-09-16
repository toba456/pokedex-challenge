import { renderHook, waitFor } from '@testing-library/react-native';

import { getPokemonListUseCase } from '../../di/container';
import { PokemonListItem } from '../../domain/entities';
import { initialPokemonListState, usePokemonList } from './usePokemonList';

jest.mock('../../di/container', () => ({
  getPokemonListUseCase: { execute: jest.fn() },
}));

const mockedExecute = getPokemonListUseCase.execute as jest.Mock;

describe('usePokemonList', () => {
  beforeEach(() => {
    mockedExecute.mockReset();
  });

  // El hook dispara la carga al montar, así que su estado inicial declarado
  // ya es 'loading' (ver comentario en usePokemonList.ts sobre por qué no se
  // hace el setState('loading') sincrónico dentro del efecto).
  it('declara loading como estado inicial, sin pasar por idle', () => {
    expect(initialPokemonListState).toEqual({ status: 'loading' });
  });

  it('pasa a loading al montar y dispara la carga a través del use case', async () => {
    mockedExecute.mockReturnValue(new Promise(() => undefined));

    const { result } = await renderHook(() => usePokemonList());

    expect(result.current.status).toBe('loading');
    expect(mockedExecute).toHaveBeenCalledTimes(1);
  });

  it('pasa a success con los datos cuando el use case resuelve', async () => {
    const pokemonList: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];
    mockedExecute.mockResolvedValue(pokemonList);

    const { result } = await renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(pokemonList);
  });

  it('pasa a error con el mensaje cuando el use case rechaza', async () => {
    mockedExecute.mockRejectedValue(new Error('network error'));

    const { result } = await renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe('network error');
  });
});
