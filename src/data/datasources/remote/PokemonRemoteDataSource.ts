import { POKEAPI_BASE_URL } from '../../../shared/constants';
import { PokemonApiError } from './PokemonApiError';
import { PokemonListResponseDTO } from './PokemonListDTO';

export class PokemonRemoteDataSource {
  async getPokemonList(limit: number, offset: number): Promise<PokemonListResponseDTO> {
    let response: Response;

    try {
      response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    } catch (error) {
      throw new PokemonApiError('network', 'No se pudo conectar con la PokéAPI', error);
    }

    if (!response.ok) {
      throw new PokemonApiError('http', `La PokéAPI respondió con un error (status ${response.status})`);
    }

    try {
      return (await response.json()) as PokemonListResponseDTO;
    } catch (error) {
      throw new PokemonApiError('parse', 'La respuesta de la PokéAPI no es un JSON válido', error);
    }
  }
}
