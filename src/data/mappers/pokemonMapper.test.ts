import { PokemonListItemDTO } from '../datasources/remote/PokemonListDTO';
import { mapPokemonListItemDTOToEntity } from './pokemonMapper';

describe('mapPokemonListItemDTOToEntity', () => {
  it('mapea bulbasaur (id de un dígito, url con trailing slash)', () => {
    const dto: PokemonListItemDTO = { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' };

    expect(mapPokemonListItemDTOToEntity(dto)).toEqual({
      id: 1,
      name: 'bulbasaur',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    });
  });

  it('mapea ditto (id de dos dígitos)', () => {
    const dto: PokemonListItemDTO = { name: 'ditto', url: 'https://pokeapi.co/api/v2/pokemon/132/' };

    expect(mapPokemonListItemDTOToEntity(dto)).toEqual({
      id: 132,
      name: 'ditto',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png',
    });
  });

  it('mapea correctamente una url sin trailing slash', () => {
    const dto: PokemonListItemDTO = { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25' };

    expect(mapPokemonListItemDTOToEntity(dto)).toEqual({
      id: 25,
      name: 'pikachu',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    });
  });

  it('mapea un id de tres dígitos como mewtwo', () => {
    const dto: PokemonListItemDTO = { name: 'mewtwo', url: 'https://pokeapi.co/api/v2/pokemon/150/' };

    expect(mapPokemonListItemDTOToEntity(dto)).toEqual({
      id: 150,
      name: 'mewtwo',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    });
  });
});
