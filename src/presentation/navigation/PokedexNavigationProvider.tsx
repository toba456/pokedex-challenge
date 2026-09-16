import { PropsWithChildren, useCallback, useMemo, useReducer } from 'react';

import { PokedexNavigationActionsContext, PokedexNavigationStateContext } from './navigationContexts';
import { initialNavigationState, navigationReducer } from './navigationReducer';

export function PokedexNavigationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(navigationReducer, initialNavigationState);

  const goToDetail = useCallback((id: number) => dispatch({ type: 'GO_TO_DETAIL', payload: { id } }), [dispatch]);
  const goToList = useCallback(() => dispatch({ type: 'GO_TO_LIST' }), [dispatch]);

  // goToDetail/goToList son estables (dependen solo de dispatch, que useReducer
  // garantiza estable), así que este objeto memoizado nunca cambia de referencia:
  // un consumidor que solo lea PokedexNavigationActionsContext (ej.
  // PokemonListScreen vía useNavigationActions) no se re-renderiza cuando cambia
  // el estado de navegación, aunque ese cambio sí golpee a quien lea
  // PokedexNavigationStateContext.
  const actions = useMemo(() => ({ goToDetail, goToList }), [goToDetail, goToList]);

  return (
    <PokedexNavigationActionsContext.Provider value={actions}>
      <PokedexNavigationStateContext.Provider value={state}>{children}</PokedexNavigationStateContext.Provider>
    </PokedexNavigationActionsContext.Provider>
  );
}
