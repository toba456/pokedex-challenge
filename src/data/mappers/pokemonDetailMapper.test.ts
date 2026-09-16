import { PokemonDetailDTO } from '../datasources/remote/PokemonDetailDTO';
import { mapPokemonDetailDTOToEntity } from './pokemonDetailMapper';

// Fixture recortado del shape real que devuelve GET /pokemon/25 (pikachu),
// suficiente para ejercitar el mapper sin copiar el JSON completo de la API.
const pikachuDTO: PokemonDetailDTO = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }],
  abilities: [
    { ability: { name: 'static', url: 'https://pokeapi.co/api/v2/ability/9/' }, is_hidden: false, slot: 1 },
    { ability: { name: 'lightning-rod', url: 'https://pokeapi.co/api/v2/ability/31/' }, is_hidden: true, slot: 3 },
  ],
  stats: [
    { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
    { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
    { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: '' } },
    { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: '' } },
    { base_stat: 90, effort: 2, stat: { name: 'speed', url: '' } },
  ],
};

describe('mapPokemonDetailDTOToEntity', () => {
  it('mapea el detalle real de pikachu, incluyendo stats en kebab-case', () => {
    expect(mapPokemonDetailDTOToEntity(pikachuDTO)).toEqual({
      id: 25,
      name: 'pikachu',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      types: ['electric'],
      abilities: ['static', 'lightning-rod'],
      stats: [
        { name: 'hp', baseValue: 35 },
        { name: 'attack', baseValue: 55 },
        { name: 'defense', baseValue: 40 },
        { name: 'special-attack', baseValue: 50 },
        { name: 'special-defense', baseValue: 50 },
        { name: 'speed', baseValue: 90 },
      ],
      height: 0.4,
      weight: 6,
      baseExperience: 112,
    });
  });

  it('convierte decímetros/hectogramos a metros/kilogramos', () => {
    const bulbasaurDTO: PokemonDetailDTO = { ...pikachuDTO, id: 1, name: 'bulbasaur', height: 7, weight: 69 };

    const result = mapPokemonDetailDTOToEntity(bulbasaurDTO);

    expect(result.height).toBeCloseTo(0.7);
    expect(result.weight).toBeCloseTo(6.9);
  });

  it('mapea multiples tipos cuando el pokemon tiene doble tipo', () => {
    const dto: PokemonDetailDTO = {
      ...pikachuDTO,
      types: [
        { slot: 1, type: { name: 'grass', url: '' } },
        { slot: 2, type: { name: 'poison', url: '' } },
      ],
    };

    const result = mapPokemonDetailDTOToEntity(dto);

    expect(result.types).toEqual(['grass', 'poison']);
  });

  it('preserva baseExperience null cuando la API no lo expone', () => {
    const dto: PokemonDetailDTO = { ...pikachuDTO, base_experience: null };

    const result = mapPokemonDetailDTOToEntity(dto);

    expect(result.baseExperience).toBeNull();
  });
});
