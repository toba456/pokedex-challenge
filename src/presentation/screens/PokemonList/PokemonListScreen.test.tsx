import { fireEvent, render } from '@testing-library/react-native';

import { PokemonListItem } from '../../../domain/entities';
import { usePokemonList } from '../../hooks';
import { useNavigationActions } from '../../navigation';
import { PokemonListScreen } from './PokemonListScreen';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks/usePulseAnimation'),
  usePokemonList: jest.fn(),
}));

jest.mock('../../navigation', () => ({
  useNavigationActions: jest.fn(),
}));

const mockedUsePokemonList = usePokemonList as jest.Mock;
const mockedUseNavigationActions = useNavigationActions as jest.Mock;
const goToDetail = jest.fn();

describe('PokemonListScreen', () => {
  beforeEach(() => {
    goToDetail.mockReset();
    mockedUseNavigationActions.mockReturnValue({
      goToDetail,
      goToList: jest.fn(),
    });
  });

  const buildHookResult = (overrides: Partial<ReturnType<typeof mockedUsePokemonList>> = {}) => ({
    state: { status: 'idle' },
    loadMore: jest.fn(),
    isLoadingMore: false,
    hasMore: true,
    loadMoreError: null,
    ...overrides,
  });

  it('muestra el skeleton de carga en estado idle', async () => {
    mockedUsePokemonList.mockReturnValue(buildHookResult({ state: { status: 'idle' } }));

    const { getByTestId } = await render(<PokemonListScreen />);

    expect(getByTestId('pokemon-list-skeleton')).toBeTruthy();
  });

  it('muestra el skeleton de carga en estado loading', async () => {
    mockedUsePokemonList.mockReturnValue(buildHookResult({ state: { status: 'loading' } }));

    const { getByTestId } = await render(<PokemonListScreen />);

    expect(getByTestId('pokemon-list-skeleton')).toBeTruthy();
  });

  it('muestra el mensaje de error en estado error', async () => {
    mockedUsePokemonList.mockReturnValue(buildHookResult({ state: { status: 'error', error: 'algo falló' } }));

    const { getByTestId, getByText } = await render(<PokemonListScreen />);

    expect(getByTestId('pokemon-list-error')).toBeTruthy();
    expect(getByText('algo falló')).toBeTruthy();
  });

  it('muestra el estado vacío cuando success trae una lista vacía', async () => {
    mockedUsePokemonList.mockReturnValue(buildHookResult({ state: { status: 'success', data: [] } }));

    const { getByTestId } = await render(<PokemonListScreen />);

    expect(getByTestId('pokemon-list-empty')).toBeTruthy();
  });

  it('renderiza la lista en success y navega al detalle al tocar un item', async () => {
    const pokemonList: PokemonListItem[] = [
      { id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' },
      { id: 2, name: 'ivysaur', imageUrl: 'https://example.com/2.png' },
    ];
    mockedUsePokemonList.mockReturnValue(buildHookResult({ state: { status: 'success', data: pokemonList } }));

    const { getByTestId, getByText } = await render(<PokemonListScreen />);

    expect(getByText('bulbasaur')).toBeTruthy();
    expect(getByText('ivysaur')).toBeTruthy();

    await fireEvent.press(getByTestId('pokemon-item-1'));

    expect(goToDetail).toHaveBeenCalledWith(1);
  });

  it('muestra el spinner de "cargando más" en el footer cuando isLoadingMore es true', async () => {
    const pokemonList: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];
    mockedUsePokemonList.mockReturnValue(
      buildHookResult({ state: { status: 'success', data: pokemonList }, isLoadingMore: true }),
    );

    const { getByTestId } = await render(<PokemonListScreen />);

    expect(getByTestId('pokemon-list-loading-more')).toBeTruthy();
  });

  it('no muestra el spinner de "cargando más" cuando isLoadingMore es false', async () => {
    const pokemonList: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];
    mockedUsePokemonList.mockReturnValue(
      buildHookResult({ state: { status: 'success', data: pokemonList }, isLoadingMore: false }),
    );

    const { queryByTestId } = await render(<PokemonListScreen />);

    expect(queryByTestId('pokemon-list-loading-more')).toBeNull();
  });

  it('no muestra el error de "cargar más" cuando loadMoreError es null', async () => {
    const pokemonList: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];
    mockedUsePokemonList.mockReturnValue(
      buildHookResult({ state: { status: 'success', data: pokemonList }, loadMoreError: null }),
    );

    const { queryByTestId } = await render(<PokemonListScreen />);

    expect(queryByTestId('pokemon-list-load-more-error')).toBeNull();
  });

  it('muestra el error de "cargar más" en forma inline sin ocultar la lista ya cargada', async () => {
    const pokemonList: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];
    mockedUsePokemonList.mockReturnValue(
      buildHookResult({
        state: { status: 'success', data: pokemonList },
        loadMoreError: 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.',
      }),
    );

    const { getByTestId, getByText } = await render(<PokemonListScreen />);

    expect(getByTestId('pokemon-list')).toBeTruthy();
    expect(getByTestId('pokemon-list-load-more-error')).toBeTruthy();
    expect(getByText('No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.')).toBeTruthy();
  });

  it('el botón "Reintentar" del error de "cargar más" vuelve a llamar loadMore', async () => {
    const pokemonList: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];
    const loadMore = jest.fn();
    mockedUsePokemonList.mockReturnValue(
      buildHookResult({
        state: { status: 'success', data: pokemonList },
        loadMore,
        loadMoreError: 'Hubo un problema al obtener los datos. Intentá de nuevo en unos segundos.',
      }),
    );

    const { getByTestId } = await render(<PokemonListScreen />);

    await fireEvent.press(getByTestId('pokemon-list-load-more-retry'));

    expect(loadMore).toHaveBeenCalledTimes(1);
  });
});
