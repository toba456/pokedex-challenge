import { PokemonDetail, PokemonStat } from '../../domain/entities';
import { POKEAPI_OFFICIAL_ARTWORK_BASE_URL } from '../../shared/constants';
import { PokemonStatName, PokemonType } from '../../shared/types';
import { PokemonDetailDTO, PokemonStatSlotDTO } from '../datasources/remote/PokemonDetailDTO';

const DECIMETRES_PER_METRE = 10;
const HECTOGRAMS_PER_KILOGRAM = 10;

function mapStatSlot(statSlot: PokemonStatSlotDTO): PokemonStat {
  return {
    // La PokéAPI ya nombra los stats en kebab-case (ej. "special-attack"), que
    // es exactamente el formato de PokemonStatName: se castea tal cual en vez
    // de armar una tabla de traducción acá. Traducir a texto legible ("At.
    // especial") es responsabilidad de la capa de presentación.
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
