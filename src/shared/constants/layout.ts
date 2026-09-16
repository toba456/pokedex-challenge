// Ancho cómodo de lectura para una columna de contenido: en tablets o
// ventanas anchas, el listado y el detalle dejan de estirarse a lo ancho
// completo y se centran en esta medida, evitando filas con demasiado aire y
// barras de stats desproporcionadas. 680 (en vez de un valor más chico tipo
// 520) porque en una tablet real ("Medium Tablet", ~800dp de ancho lógico en
// portrait) un tope más angosto dejaba demasiado margen vacío a los costados;
// este valor todavía centra y limita el contenido, pero deja que ocupe más
// pantalla en tablets sin volver a estirarse por completo.
export const MAX_CONTENT_WIDTH = 680;
