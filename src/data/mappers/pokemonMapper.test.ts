import { PokemonListItemDTO, PokemonListResponseDTO } from '../datasources/remote/PokemonListDTO';
import { mapPokemonListItemDTOToEntity, mapPokemonListResponseDTOToPage } from './pokemonMapper';

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

describe('mapPokemonListResponseDTOToPage', () => {
  it('deriva hasMore true cuando el DTO trae next', () => {
    const dto: PokemonListResponseDTO = {
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };

    const result = mapPokemonListResponseDTOToPage(dto);

    expect(result).toEqual({
      items: [
        {
          id: 1,
          name: 'bulbasaur',
          imageUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        },
      ],
      hasMore: true,
    });
  });

  it('deriva hasMore false cuando el DTO trae next null', () => {
    const dto: PokemonListResponseDTO = {
      count: 1,
      next: null,
      previous: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };

    const result = mapPokemonListResponseDTOToPage(dto);

    expect(result.hasMore).toBe(false);
  });

  it('mapea una página vacía cuando no hay resultados', () => {
    const dto: PokemonListResponseDTO = { count: 0, next: null, previous: null, results: [] };

    const result = mapPokemonListResponseDTOToPage(dto);

    expect(result).toEqual({ items: [], hasMore: false });
  });
});
