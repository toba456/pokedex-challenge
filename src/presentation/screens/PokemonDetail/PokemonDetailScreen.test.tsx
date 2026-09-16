import { fireEvent, render } from '@testing-library/react-native';

import { PokemonDetail } from '../../../domain/entities';
import { usePokemonDetail } from '../../hooks';
import { usePokedexNavigation } from '../../navigation';
import { PokemonDetailScreen } from './PokemonDetailScreen';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks/usePulseAnimation'),
  usePokemonDetail: jest.fn(),
}));

jest.mock('../../navigation', () => ({
  usePokedexNavigation: jest.fn(),
}));

const mockedUsePokemonDetail = usePokemonDetail as jest.Mock;
const mockedUsePokedexNavigation = usePokedexNavigation as jest.Mock;
const goToList = jest.fn();

const buildPokemonDetail = (): PokemonDetail => ({
  id: 25,
  name: 'pikachu',
  imageUrl: 'https://example.com/25.png',
  types: ['electric'],
  abilities: ['static', 'lightning-rod'],
  stats: [
    { name: 'hp', baseValue: 35 },
    { name: 'special-attack', baseValue: 50 },
  ],
  height: 0.4,
  weight: 6,
  baseExperience: 112,
});

describe('PokemonDetailScreen', () => {
  beforeEach(() => {
    goToList.mockReset();
    mockedUsePokedexNavigation.mockReturnValue({
      screen: 'detail',
      selectedPokemonId: 25,
      goToDetail: jest.fn(),
      goToList,
    });
  });

  it('muestra el skeleton de carga en estado idle', async () => {
    mockedUsePokemonDetail.mockReturnValue({ status: 'idle' });

    const { getByTestId } = await render(<PokemonDetailScreen />);

    expect(getByTestId('pokemon-detail-skeleton')).toBeTruthy();
  });

  it('muestra el skeleton de carga en estado loading', async () => {
    mockedUsePokemonDetail.mockReturnValue({ status: 'loading' });

    const { getByTestId } = await render(<PokemonDetailScreen />);

    expect(getByTestId('pokemon-detail-skeleton')).toBeTruthy();
  });

  it('muestra el mensaje de error en estado error', async () => {
    mockedUsePokemonDetail.mockReturnValue({ status: 'error', error: 'algo falló' });

    const { getByTestId, getByText } = await render(<PokemonDetailScreen />);

    expect(getByTestId('pokemon-detail-error')).toBeTruthy();
    expect(getByText('algo falló')).toBeTruthy();
  });

  it('muestra el estado de "no seleccionado" cuando no hay selectedPokemonId', async () => {
    mockedUsePokedexNavigation.mockReturnValue({
      screen: 'detail',
      selectedPokemonId: null,
      goToDetail: jest.fn(),
      goToList,
    });
    mockedUsePokemonDetail.mockReturnValue({ status: 'idle' });

    const { getByTestId } = await render(<PokemonDetailScreen />);

    expect(getByTestId('pokemon-detail-error')).toBeTruthy();
  });

  it('renderiza el detalle en success con tipos, stats y datos numéricos', async () => {
    mockedUsePokemonDetail.mockReturnValue({ status: 'success', data: buildPokemonDetail() });

    const { getByTestId, getByText } = await render(<PokemonDetailScreen />);

    expect(getByTestId('pokemon-detail-content')).toBeTruthy();
    expect(getByText('pikachu')).toBeTruthy();
    expect(getByText('#025')).toBeTruthy();
    expect(getByText('Eléctrico')).toBeTruthy();
    expect(getByText('static, lightning-rod')).toBeTruthy();
    expect(getByText('0.4 m')).toBeTruthy();
    expect(getByText('6.0 kg')).toBeTruthy();
    expect(getByText('112')).toBeTruthy();
  });

  it('vuelve al listado al tocar el botón Volver', async () => {
    mockedUsePokemonDetail.mockReturnValue({ status: 'success', data: buildPokemonDetail() });

    const { getByTestId } = await render(<PokemonDetailScreen />);

    await fireEvent.press(getByTestId('pokemon-detail-back-button'));

    expect(goToList).toHaveBeenCalledTimes(1);
  });
});
