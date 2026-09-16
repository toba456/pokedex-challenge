import { createContext } from 'react';

import { PokedexNavigationState } from './types';

export interface PokedexNavigationActions {
  goToDetail: (id: number) => void;
  goToList: () => void;
}

export const PokedexNavigationStateContext = createContext<PokedexNavigationState | undefined>(undefined);
export const PokedexNavigationActionsContext = createContext<PokedexNavigationActions | undefined>(undefined);
