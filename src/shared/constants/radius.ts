// Radius único (sección 9): un solo valor de esquina reutilizado en toda la
// app (imagen del listado, chips y botón del detalle) en vez de que cada
// componente definiera el suyo.
export const RADIUS = 16;

// Radius propio de la sheet del detalle (sección 9): es un patrón
// estructural distinto (overlap hero/sheet), no un componente más, por eso
// tiene su propio token en vez de reutilizar RADIUS.
export const SHEET_RADIUS = 28;
