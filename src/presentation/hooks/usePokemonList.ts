import { useCallback, useEffect, useRef, useState } from 'react';

import { getPokemonListUseCase } from '../../di/container';
import { PokemonListItem } from '../../domain/entities';
import { RequestState } from '../../shared/types';
import { getUserFriendlyErrorMessage } from '../../shared/utils';

const PAGE_SIZE = 20;

export interface UsePokemonListResult {
  state: RequestState<PokemonListItem[]>;
  loadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMoreError: string | null;
}

// El hook siempre dispara la carga al montar, así que el estado 'loading' es
// el valor inicial: seteárselo desde adentro del efecto generaría un render
// en cascada evitable (regla react-hooks/set-state-in-effect). 'idle' queda
// declarado en RequestState (sección 6) para hooks que sí necesiten un estado
// previo a disparar la carga, pero este no llega a producirlo en runtime.
export const initialPokemonListState: RequestState<PokemonListItem[]> = { status: 'loading' };

export function usePokemonList(): UsePokemonListResult {
  const [state, setState] = useState<RequestState<PokemonListItem[]>>(initialPokemonListState);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  // Guards en ref, no en state: onEndReached puede disparar loadMore varias
  // veces antes de que el re-render con isLoadingMore=true llegue a
  // aplicarse, así que el guard necesita leer un valor sincrónico.
  const offsetRef = useRef(0);
  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);

  useEffect(() => {
    let isMounted = true;

    getPokemonListUseCase
      .execute(PAGE_SIZE, 0)
      .then((page) => {
        if (isMounted) {
          setState({ status: 'success', data: page.items });
          hasMoreRef.current = page.hasMore;
          setHasMore(page.hasMore);
          offsetRef.current = PAGE_SIZE;
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState({ status: 'error', error: getUserFriendlyErrorMessage(error) });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const loadMore = useCallback(() => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) {
      return;
    }

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(null);

    getPokemonListUseCase
      .execute(PAGE_SIZE, offsetRef.current)
      .then((page) => {
        setState((previous) => ({ status: 'success', data: [...(previous.data ?? []), ...page.items] }));
        hasMoreRef.current = page.hasMore;
        setHasMore(page.hasMore);
        offsetRef.current += PAGE_SIZE;
      })
      .catch((error: unknown) => {
        setLoadMoreError(getUserFriendlyErrorMessage(error));
      })
      .finally(() => {
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      });
  }, []);

  return { state, loadMore, isLoadingMore, hasMore, loadMoreError };
}
