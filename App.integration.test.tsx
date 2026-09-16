import { fireEvent, render, waitFor } from '@testing-library/react-native';

import App from './App';
import { PokemonDetailDTO } from './src/data/datasources/remote/PokemonDetailDTO';
import { PokemonListResponseDTO } from './src/data/datasources/remote/PokemonListDTO';

// Mock oficial de AsyncStorage (no hay uno global en la config de Jest):
// evita tocar el módulo nativo real durante el test y persiste en memoria,
// que es exactamente lo que PokemonRepositoryImpl necesita para su cache.
jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock hoistea el factory, no puede usar un import de módulo externo
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const FIRST_TWENTY_POKEMON_NAMES = [
  'bulbasaur',
  'ivysaur',
  'venusaur',
  'charmander',
  'charmeleon',
  'charizard',
  'squirtle',
  'wartortle',
  'blastoise',
  'caterpie',
  'metapod',
  'butterfree',
  'weedle',
  'kakuna',
  'beedrill',
  'pidgey',
  'pidgeotto',
  'pidgeot',
  'rattata',
  'raticate',
];

function buildPokemonListResponseDTO(): PokemonListResponseDTO {
  return {
    count: 1302,
    next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
    previous: null,
    results: FIRST_TWENTY_POKEMON_NAMES.map((name, index) => ({
      name,
      url: `https://pokeapi.co/api/v2/pokemon/${index + 1}/`,
    })),
  };
}

function buildBulbasaurDetailDTO(): PokemonDetailDTO {
  return {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    base_experience: 64,
    types: [
      { slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } },
      { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } },
    ],
    abilities: [{ ability: { name: 'overgrow', url: 'https://pokeapi.co/api/v2/ability/65/' }, is_hidden: false, slot: 1 }],
    stats: [
      { base_stat: 45, effort: 0, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } },
      { base_stat: 49, effort: 0, stat: { name: 'attack', url: 'https://pokeapi.co/api/v2/stat/2/' } },
    ],
  };
}

describe('App (flujo listado -> detalle -> volver)', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/pokemon/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(buildBulbasaurDetailDTO()),
        } as Response);
      }

      if (url.includes('/pokemon?')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(buildPokemonListResponseDTO()),
        } as Response);
      }

      return Promise.reject(new Error(`fetch no mockeado para: ${url}`));
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renderiza el listado real, navega al detalle real al tocar un item y vuelve al listado con "Volver"', async () => {
    const { findByText, findByTestId, queryByTestId } = await render(<App />);

    expect(await findByText('bulbasaur')).toBeTruthy();
    expect(await findByText('ivysaur')).toBeTruthy();

    await fireEvent.press(await findByTestId('pokemon-item-1'));

    const detailContent = await findByTestId('pokemon-detail-content');
    expect(detailContent).toBeTruthy();
    expect(await findByText('#001')).toBeTruthy();

    await fireEvent.press(await findByTestId('pokemon-detail-back-button'));

    // El botón de volver dispara primero la animación de salida (translateX +
    // opacity) y recién al terminar desmonta el detalle, así que la
    // desaparición no es inmediata: hay que esperarla en vez de asertarla
    // sincrónicamente.
    expect(await findByTestId('pokemon-list')).toBeTruthy();
    await waitFor(() => expect(queryByTestId('pokemon-detail-content')).toBeNull());
  });
});
