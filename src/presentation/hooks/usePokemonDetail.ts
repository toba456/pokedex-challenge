import { useEffect, useState } from 'react';

import { getPokemonDetailUseCase } from '../../di/container';
import { PokemonDetail } from '../../domain/entities';
import { RequestState } from '../../shared/types';

// Mismo criterio que usePokemonList (ver comentario ahí): 'loading' es el
// estado inicial declarado, nunca se setea sincrónicamente al montar.
export const initialPokemonDetailState: RequestState<PokemonDetail> = { status: 'loading' };

export function usePokemonDetail(id: number): RequestState<PokemonDetail> {
  const [state, setState] = useState<RequestState<PokemonDetail>>(initialPokemonDetailState);

  useEffect(() => {
    let isMounted = true;

    getPokemonDetailUseCase
      .execute(id)
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
  }, [id]);

  return state;
}
