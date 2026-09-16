import { fireEvent, render } from '@testing-library/react-native';

import { PokemonListItem } from '../../../domain/entities';
import { usePokemonList } from '../../hooks';
import { usePokedexNavigation } from '../../navigation';
import { PokemonListScreen } from './PokemonListScreen';

jest.mock('../../hooks', () => ({
  usePokemonList: jest.fn(),
}));

jest.mock('../../navigation', () => ({
  usePokedexNavigation: jest.fn(),
}));

const mockedUsePokemonList = usePokemonList as jest.Mock;
const mockedUsePokedexNavigation = usePokedexNavigation as jest.Mock;
const goToDetail = jest.fn();

describe('PokemonListScreen', () => {
  beforeEach(() => {
    goToDetail.mockReset();
    mockedUsePokedexNavigation.mockReturnValue({
      screen: 'list',
      selectedPokemonId: null,
      goToDetail,
      goToList: jest.fn(),
    });
  });

  const buildHookResult = (overrides: Partial<ReturnType<typeof mockedUsePokemonList>> = {}) => ({
    state: { status: 'idle' },
    loadMore: jest.fn(),
    isLoadingMore: false,
    hasMore: true,
    ...overrides,
  });

  it('muestra un indicador de carga en estado idle', async () => {
    mockedUsePokemonList.mockReturnValue(buildHookResult({ state: { status: 'idle' } }));

    const { getByTestId } = await render(<PokemonListScreen />);

    expect(getByTestId('pokemon-list-loading')).toBeTruthy();
  });

  it('muestra un indicador de carga en estado loading', async () => {
    mockedUsePokemonList.mockReturnValue(buildHookResult({ state: { status: 'loading' } }));

    const { getByTestId } = await render(<PokemonListScreen />);

    expect(getByTestId('pokemon-list-loading')).toBeTruthy();
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
});
