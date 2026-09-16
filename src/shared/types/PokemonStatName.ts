// La PokéAPI nombra los stats en kebab-case (ej. "special-attack"). Se adopta
// ese mismo formato como identificador canónico en vez de traducirlo acá: la
// traducción a texto legible (sección 9) es responsabilidad de la capa de
// presentación, no de este tipo compartido.
export type PokemonStatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';
