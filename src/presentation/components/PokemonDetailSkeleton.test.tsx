import { render } from '@testing-library/react-native';
import { useWindowDimensions } from 'react-native';

import { PokemonDetailSkeleton } from './PokemonDetailSkeleton';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks/usePulseAnimation'),
  ...jest.requireActual('../hooks/useIsLandscape'),
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions');

const mockedUseWindowDimensions = useWindowDimensions as jest.Mock;

describe('PokemonDetailSkeleton', () => {
  it('se renderiza en portrait (layout apilado)', async () => {
    mockedUseWindowDimensions.mockReturnValue({ width: 390, height: 844, scale: 2, fontScale: 1 });

    const { getByTestId } = await render(<PokemonDetailSkeleton />);

    expect(getByTestId('pokemon-detail-skeleton', { includeHiddenElements: true })).toBeTruthy();
  });

  it('se renderiza en landscape (layout lado a lado) sin romper', async () => {
    mockedUseWindowDimensions.mockReturnValue({ width: 1280, height: 800, scale: 2, fontScale: 1 });

    const { getByTestId } = await render(<PokemonDetailSkeleton />);

    expect(getByTestId('pokemon-detail-skeleton', { includeHiddenElements: true })).toBeTruthy();
  });
});
