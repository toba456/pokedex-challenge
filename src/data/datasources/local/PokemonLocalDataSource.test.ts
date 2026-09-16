import AsyncStorage from '@react-native-async-storage/async-storage';

import { POKEMON_LIST_STORAGE_KEY } from '@shared/constants';
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
});
