import { PokemonApiError } from '@data/datasources/remote/PokemonApiError';

const GENERIC_ERROR_MESSAGE = 'Ocurrió un error inesperado. Intentá de nuevo.';

export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof PokemonApiError) {
    switch (error.type) {
      case 'network':
        return 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.';
      case 'http':
        return 'Hubo un problema al obtener los datos. Intentá de nuevo en unos segundos.';
      case 'parse':
        return 'Recibimos una respuesta inesperada del servidor.';
    }
  }

  return GENERIC_ERROR_MESSAGE;
}
