import { act, renderHook, waitFor } from '@testing-library/react-native';

import { getPokemonListUseCase } from '../../di/container';
import { PokemonListItem, PokemonListPage } from '../../domain/entities';
import { initialPokemonListState, usePokemonList } from './usePokemonList';

jest.mock('../../di/container', () => ({
  getPokemonListUseCase: { execute: jest.fn() },
}));

const mockedExecute = getPokemonListUseCase.execute as jest.Mock;

const pokemon = (id: number): PokemonListItem => ({ id, name: `pokemon-${id}`, imageUrl: `https://example.com/${id}.png` });

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

  it('pasa a loading al montar y dispara la carga inicial a través del use case', async () => {
    mockedExecute.mockReturnValue(new Promise(() => undefined));

    const { result } = await renderHook(() => usePokemonList());

    expect(result.current.state.status).toBe('loading');
    expect(mockedExecute).toHaveBeenCalledTimes(1);
    expect(mockedExecute).toHaveBeenCalledWith(20, 0);
  });

  it('pasa a success con los items y hasMore de la primera página', async () => {
    const page: PokemonListPage = { items: [pokemon(1)], hasMore: true };
    mockedExecute.mockResolvedValue(page);

    const { result } = await renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.state.status).toBe('success'));
    expect(result.current.state.data).toEqual(page.items);
    expect(result.current.hasMore).toBe(true);
  });

  it('pasa a error con el mensaje cuando el use case rechaza', async () => {
    mockedExecute.mockRejectedValue(new Error('network error'));

    const { result } = await renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.state.status).toBe('error'));
    expect(result.current.state.error).toBe('network error');
  });

  it('loadMore exitoso appendea los items de la siguiente página al offset correcto', async () => {
    const firstPage: PokemonListPage = { items: [pokemon(1)], hasMore: true };
    const secondPage: PokemonListPage = { items: [pokemon(2)], hasMore: false };
    mockedExecute.mockResolvedValueOnce(firstPage).mockResolvedValueOnce(secondPage);

    const { result } = await renderHook(() => usePokemonList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    await act(async () => {
      result.current.loadMore();
    });

    expect(mockedExecute).toHaveBeenNthCalledWith(2, 20, 20);
    await waitFor(() => expect(result.current.state.data).toEqual([...firstPage.items, ...secondPage.items]));
    expect(result.current.hasMore).toBe(false);
    expect(result.current.isLoadingMore).toBe(false);
  });

  it('loadMore no hace nada cuando hasMore es false', async () => {
    const onlyPage: PokemonListPage = { items: [pokemon(1)], hasMore: false };
    mockedExecute.mockResolvedValue(onlyPage);

    const { result } = await renderHook(() => usePokemonList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));
    expect(result.current.hasMore).toBe(false);

    mockedExecute.mockClear();

    await act(async () => {
      result.current.loadMore();
    });

    expect(mockedExecute).not.toHaveBeenCalled();
  });

  it('el guard contra doble llamada evita disparar loadMore de nuevo mientras isLoadingMore es true', async () => {
    const firstPage: PokemonListPage = { items: [pokemon(1)], hasMore: true };
    mockedExecute.mockResolvedValueOnce(firstPage).mockReturnValueOnce(new Promise(() => undefined));

    const { result } = await renderHook(() => usePokemonList());
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    // Dos llamadas sincrónicas seguidas, sin esperar entre medio: la segunda
    // debe quedar bloqueada por el guard de isLoadingMoreRef antes de que
    // haya oportunidad de re-renderizar.
    act(() => {
      result.current.loadMore();
      result.current.loadMore();
    });

    expect(mockedExecute).toHaveBeenCalledTimes(2);
  });
});
