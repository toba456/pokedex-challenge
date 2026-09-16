import { useContext } from 'react';

import { PokedexNavigationActionsContext } from './navigationContexts';

export function useNavigationActions() {
  const context = useContext(PokedexNavigationActionsContext);

  if (!context) {
    throw new Error('useNavigationActions debe usarse dentro de un PokedexNavigationProvider');
  }

  return context;
}
