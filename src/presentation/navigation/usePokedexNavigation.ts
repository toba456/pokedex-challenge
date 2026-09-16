import { useNavigationActions } from './useNavigationActions';
import { useNavigationState } from './useNavigationState';

// Combina ambos contextos para consumidores que necesitan estado y acciones
// a la vez (ej. PokemonDetailScreen, que lee selectedPokemonId y llama a
// goToList). Un componente que solo necesite acciones debería usar
// useNavigationActions directamente para no re-renderizarse en cada cambio
// de navegación: ver PokemonListScreen.
export function usePokedexNavigation() {
  const { screen, selectedPokemonId } = useNavigationState();
  const { goToDetail, goToList } = useNavigationActions();

  return { screen, selectedPokemonId, goToDetail, goToList };
}
