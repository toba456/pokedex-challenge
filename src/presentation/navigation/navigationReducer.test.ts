import { initialNavigationState, navigationReducer } from './navigationReducer';

describe('navigationReducer', () => {
  it('arranca en el listado sin pokemon seleccionado', () => {
    expect(initialNavigationState).toEqual({ screen: 'list', selectedPokemonId: null });
  });

  it('GO_TO_DETAIL navega al detalle con el id seleccionado', () => {
    const state = navigationReducer(initialNavigationState, {
      type: 'GO_TO_DETAIL',
      payload: { id: 7 },
    });

    expect(state).toEqual({ screen: 'detail', selectedPokemonId: 7 });
  });

  it('GO_TO_LIST vuelve al listado y limpia el pokemon seleccionado', () => {
    const detailState = { screen: 'detail' as const, selectedPokemonId: 7 };

    const state = navigationReducer(detailState, { type: 'GO_TO_LIST' });

    expect(state).toEqual({ screen: 'list', selectedPokemonId: null });
  });
});
