import { PokemonDetail, PokemonStat } from '@domain/entities';
import { POKEAPI_OFFICIAL_ARTWORK_BASE_URL } from '@shared/constants';
import { PokemonStatName, PokemonType } from '@shared/types';
import { PokemonDetailDTO, PokemonStatSlotDTO } from '../datasources/remote/PokemonDetailDTO';

const DECIMETRES_PER_METRE = 10;
const HECTOGRAMS_PER_KILOGRAM = 10;

function mapStatSlot(statSlot: PokemonStatSlotDTO): PokemonStat {
  return {
    name: statSlot.stat.name as PokemonStatName,
    baseValue: statSlot.base_stat,
  };
}

export function mapPokemonDetailDTOToEntity(dto: PokemonDetailDTO): PokemonDetail {
  return {
    id: dto.id,
    name: dto.name,
    imageUrl: `${POKEAPI_OFFICIAL_ARTWORK_BASE_URL}/${dto.id}.png`,
    types: dto.types.map((typeSlot) => typeSlot.type.name as PokemonType),
    abilities: dto.abilities.map((abilitySlot) => abilitySlot.ability.name),
    stats: dto.stats.map(mapStatSlot),
    height: dto.height / DECIMETRES_PER_METRE,
    weight: dto.weight / HECTOGRAMS_PER_KILOGRAM,
    baseExperience: dto.base_experience,
  };
}
