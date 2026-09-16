import { PokemonApiError } from '@data/datasources/remote/PokemonApiError';
import { getUserFriendlyErrorMessage } from './getUserFriendlyErrorMessage';

describe('getUserFriendlyErrorMessage', () => {
  it('mapea un PokemonApiError de tipo network a un mensaje de conexión', () => {
    const error = new PokemonApiError('network', 'No se pudo conectar con la PokéAPI');

    expect(getUserFriendlyErrorMessage(error)).toBe('No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.');
  });

  it('mapea un PokemonApiError de tipo http a un mensaje de reintento', () => {
    const error = new PokemonApiError('http', 'La PokéAPI respondió con un error (status 404)');

    expect(getUserFriendlyErrorMessage(error)).toBe(
      'Hubo un problema al obtener los datos. Intentá de nuevo en unos segundos.',
    );
  });

  it('mapea un PokemonApiError de tipo parse a un mensaje de respuesta inesperada', () => {
    const error = new PokemonApiError('parse', 'La respuesta de la PokéAPI no es un JSON válido');

    expect(getUserFriendlyErrorMessage(error)).toBe('Recibimos una respuesta inesperada del servidor.');
  });

  it('devuelve un mensaje genérico para cualquier otro Error o valor no reconocido', () => {
    expect(getUserFriendlyErrorMessage(new Error('algo random'))).toBe(
      'Ocurrió un error inesperado. Intentá de nuevo.',
    );
    expect(getUserFriendlyErrorMessage('un string cualquiera')).toBe('Ocurrió un error inesperado. Intentá de nuevo.');
    expect(getUserFriendlyErrorMessage(null)).toBe('Ocurrió un error inesperado. Intentá de nuevo.');
  });
});
