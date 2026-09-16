import { POKEAPI_OFFICIAL_ARTWORK_BASE_URL } from '../../shared/constants';
import { PokemonListItem } from '../../domain/entities/PokemonListItem';
import { PokemonListPage } from '../../domain/entities/PokemonListPage';
import { PokemonListItemDTO, PokemonListResponseDTO } from '../datasources/remote/PokemonListDTO';

function extractIdFromUrl(url: string): number {
  const segments = url.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return Number(lastSegment);
}

export function mapPokemonListItemDTOToEntity(dto: PokemonListItemDTO): PokemonListItem {
  const id = extractIdFromUrl(dto.url);

  return {
    id,
    name: dto.name,
    // Artwork oficial en vez del sprite pixelado default: mejor calidad para el
    // hero del detalle (sección 9) y sirve también para el listado.
    imageUrl: `${POKEAPI_OFFICIAL_ARTWORK_BASE_URL}/${id}.png`,
  };
}

export function mapPokemonListResponseDTOToPage(dto: PokemonListResponseDTO): PokemonListPage {
  return {
    items: dto.results.map(mapPokemonListItemDTOToEntity),
    hasMore: dto.next !== null,
  };
}
