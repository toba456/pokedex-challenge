// Ancho cómodo de lectura para una columna de contenido: en tablets o
// ventanas anchas, el listado y el detalle dejan de estirarse a lo ancho
// completo y se centran en esta medida, evitando filas con demasiado aire y
// barras de stats desproporcionadas. 680 (en vez de un valor más chico tipo
// 520) porque en una tablet real ("Medium Tablet", ~800dp de ancho lógico en
// portrait) un tope más angosto dejaba demasiado margen vacío a los costados;
// este valor todavía centra y limita el contenido, pero deja que ocupe más
// pantalla en tablets sin volver a estirarse por completo.
export const MAX_CONTENT_WIDTH = 680;

// Fracción del ancho que ocupa el hero (imagen) del detalle cuando la pantalla
// está en landscape (ancho > alto, típicamente una tablet apaisada): en vez
// de apilar hero + contenido como en portrait (lo que obliga a scrollear para
// llegar al botón "Volver" cuando el alto disponible es chico), se muestran
// lado a lado aprovechando el ancho sobrante.
export const DETAIL_HERO_LANDSCAPE_RATIO = 0.4;

// El listado, a diferencia del detalle, no tiene una columna de lectura larga
// que proteger (son filas cortas: imagen + nombre), así que en landscape no
// se centra con MAX_CONTENT_WIDTH: se alinea a la izquierda y usa un tope más
// generoso, para no dejar el margen vacío de ambos lados que sí tiene sentido
// en portrait. Tope absoluto (960) para que las filas no vuelvan a verse con
// demasiado aire a la derecha en pantallas muy anchas.
export const LIST_CONTENT_WIDTH_LANDSCAPE_RATIO = 0.7;
export const LIST_MAX_CONTENT_WIDTH_LANDSCAPE = 960;
