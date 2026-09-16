export const POKEMON_LIST_STORAGE_KEY = '@pokedex/pokemon-list';

export const getPokemonDetailStorageKey = (id: number): string => `@pokedex/pokemon-detail:${id}`;
