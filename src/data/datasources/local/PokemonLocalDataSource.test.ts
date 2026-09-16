import AsyncStorage from '@react-native-async-storage/async-storage';

import { getPokemonDetailStorageKey, POKEMON_LIST_STORAGE_KEY } from '@shared/constants';
import { PokemonDetail } from '@domain/entities/PokemonDetail';
import { PokemonListItem } from '@domain/entities/PokemonListItem';
import { PokemonLocalDataSource } from './PokemonLocalDataSource';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('PokemonLocalDataSource', () => {
  const items: PokemonListItem[] = [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('guarda la lista serializada bajo la key de storage', async () => {
    const dataSource = new PokemonLocalDataSource();

    await dataSource.saveList(items);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(POKEMON_LIST_STORAGE_KEY, JSON.stringify(items));
  });

  it('recupera la lista cacheada previamente guardada', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(items));
    const dataSource = new PokemonLocalDataSource();

    const result = await dataSource.getList();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith(POKEMON_LIST_STORAGE_KEY);
    expect(result).toEqual(items);
  });

  it('devuelve null si todavía no hay nada guardado', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const dataSource = new PokemonLocalDataSource();

    const result = await dataSource.getList();

    expect(result).toBeNull();
  });

  describe('detalle por id', () => {
    const pikachu: PokemonDetail = {
      id: 25,
      name: 'pikachu',
      imageUrl: 'https://example.com/25.png',
      types: ['electric'],
      abilities: ['static'],
      stats: [{ name: 'hp', baseValue: 35 }],
      height: 0.4,
      weight: 6,
      baseExperience: 112,
    };

    it('guarda el detalle serializado bajo la key con el id del pokemon', async () => {
      const dataSource = new PokemonLocalDataSource();

      await dataSource.saveDetail(25, pikachu);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(getPokemonDetailStorageKey(25), JSON.stringify(pikachu));
    });

    it('recupera el detalle cacheado previamente guardado para ese id', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(pikachu));
      const dataSource = new PokemonLocalDataSource();

      const result = await dataSource.getDetail(25);

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(getPokemonDetailStorageKey(25));
      expect(result).toEqual(pikachu);
    });

    it('devuelve null si no hay nada guardado para ese id', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const dataSource = new PokemonLocalDataSource();

      const result = await dataSource.getDetail(25);

      expect(result).toBeNull();
    });
  });
});
