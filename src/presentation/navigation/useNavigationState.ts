import { useContext } from 'react';

import { PokedexNavigationStateContext } from './navigationContexts';

export function useNavigationState() {
  const context = useContext(PokedexNavigationStateContext);

  if (!context) {
    throw new Error('useNavigationState debe usarse dentro de un PokedexNavigationProvider');
  }

  return context;
}
