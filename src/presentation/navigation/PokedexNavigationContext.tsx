import { createContext, Dispatch, PropsWithChildren, useReducer } from 'react';

import { initialNavigationState, navigationReducer } from './navigationReducer';
import { PokedexNavigationAction, PokedexNavigationState } from './types';

interface PokedexNavigationContextValue {
  state: PokedexNavigationState;
  dispatch: Dispatch<PokedexNavigationAction>;
}

export const PokedexNavigationContext = createContext<PokedexNavigationContextValue | undefined>(undefined);

export function PokedexNavigationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(navigationReducer, initialNavigationState);

  return <PokedexNavigationContext.Provider value={{ state, dispatch }}>{children}</PokedexNavigationContext.Provider>;
}
