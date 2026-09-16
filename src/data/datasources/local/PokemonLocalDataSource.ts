import AsyncStorage from '@react-native-async-storage/async-storage';

import { getPokemonDetailStorageKey, POKEMON_LIST_STORAGE_KEY } from '@shared/constants';
import { PokemonDetail } from '@domain/entities/PokemonDetail';
import { PokemonListItem } from '@domain/entities/PokemonListItem';

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

  async saveDetail(id: number, detail: PokemonDetail): Promise<void> {
    await AsyncStorage.setItem(getPokemonDetailStorageKey(id), JSON.stringify(detail));
  }

  async getDetail(id: number): Promise<PokemonDetail | null> {
    const raw = await AsyncStorage.getItem(getPokemonDetailStorageKey(id));

    if (raw === null) {
      return null;
    }

    return JSON.parse(raw) as PokemonDetail;
  }
}
