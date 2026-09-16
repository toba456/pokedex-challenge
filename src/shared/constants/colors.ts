// Paleta propia: near-black con un dejo azulado en
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
  // Hairline entre filas del listado: sutil sobre el fondo, no blanco puro.
  separator: '#26272F',
  // Fondo del contenedor de imagen en el listado, para que el radius se note
  // aunque el sprite tenga transparencia.
  imageBackdrop: '#1D1E26',
  // Highlight discreto al presionar una fila del listado.
  rowPressed: '#1B1C24',
  // Bloques sólidos de los skeletons (listado y detalle): un gris sutil que
  // se distingue del fondo pero no simula contenido real.
  skeletonBlock: '#23242C',
} as const;
