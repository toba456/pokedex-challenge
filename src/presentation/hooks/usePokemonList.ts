import { useEffect, useState } from 'react';

import { getPokemonListUseCase } from '../../di/container';
import { PokemonListItem } from '../../domain/entities';
import { RequestState } from '../../shared/types';

// El hook siempre dispara la carga al montar, así que el estado 'loading' es
// el valor inicial: seteárselo desde adentro del efecto generaría un render
// en cascada evitable (regla react-hooks/set-state-in-effect). 'idle' queda
// declarado en RequestState (sección 6) para hooks que sí necesiten un estado
// previo a disparar la carga, pero este no llega a producirlo en runtime.
export const initialPokemonListState: RequestState<PokemonListItem[]> = { status: 'loading' };

export function usePokemonList(): RequestState<PokemonListItem[]> {
  const [state, setState] = useState<RequestState<PokemonListItem[]>>(initialPokemonListState);

  useEffect(() => {
    let isMounted = true;

    getPokemonListUseCase
      .execute()
      .then((data) => {
        if (isMounted) {
          setState({ status: 'success', data });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState({
            status: 'error',
            error: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
