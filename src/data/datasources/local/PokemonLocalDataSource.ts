import AsyncStorage from '@react-native-async-storage/async-storage';

import { POKEMON_LIST_STORAGE_KEY } from '../../../shared/constants';
import { PokemonListItem } from '../../../domain/entities/PokemonListItem';

export class PokemonLocalDataSource {
  async saveList(items: PokemonListItem[]): Promise<void> {
    await AsyncStorage.setItem(POKEMON_LIST_STORAGE_KEY, JSON.stringify(items));
  }

  async getList(): Promise<PokemonListItem[] | null> {
    const raw = await AsyncStorage.getItem(POKEMON_LIST_STORAGE_KEY);

    if (raw === null) {
      return null;
    }

    return JSON.parse(raw) as PokemonListItem[];
  }
}
