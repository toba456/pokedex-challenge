// Paleta propia (sección 9 del CLAUDE.md): near-black con un dejo azulado en
// vez de negro puro, y un off-white con temperatura neutra en vez del crema
// genérico típico de UI "hecha con IA". El rojo Pokédex es el único acento
// estructural, reservado para navegación/acción, no como fondo protagonista.
export const colors = {
  nearBlack: '#15161C',
  offWhite: '#EDEAE2',
  offWhiteMuted: '#8F8B82',
  pokedexRed: '#D5242A',
  // Track de las barras de stats en el detalle (sección 9): un gris-azulado
  // apenas por encima del near-black, no un gris neutro genérico.
  statTrack: '#2A2B33',
} as const;
