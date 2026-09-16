export interface PokemonTypeSlotDTO {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbilitySlotDTO {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStatSlotDTO {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonDetailDTO {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: PokemonTypeSlotDTO[];
  abilities: PokemonAbilitySlotDTO[];
  stats: PokemonStatSlotDTO[];
}
