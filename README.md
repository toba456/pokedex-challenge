# Pokedex Challenge — React Native

Assessment técnico: aplicación móvil que consulta [PokéAPI](https://pokeapi.co/)
para mostrar un listado de los primeros 20 Pokémon y una pantalla de detalle con
información ampliada de cada uno.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npx expo start
```

Escaneá el QR con la app de Expo Go (Android/iOS) o corré en un simulador con `i`
(iOS) / `a` (Android) desde la terminal donde corre `expo start`.

## Tests

```bash
npm run test
```


## Arquitectura

El proyecto sigue **Clean Architecture** con tres capas:

- **`domain/`** — reglas de negocio puras. Entidades, interfaces de repositorios y
  casos de uso. No depende de React Native ni de ninguna otra capa.
- **`data/`** — implementación concreta del acceso a datos: datasource remoto
  (fetch a PokéAPI), datasource local (AsyncStorage) y los mappers que traducen la
  respuesta cruda de la API a las entidades de `domain`. Implementa las interfaces
  de repositorio definidas en `domain`.
- **`presentation/`** — pantallas, componentes, navegación y estado de UI. Consume
  los casos de uso de `domain` a través de hooks custom, nunca accede a `data`
  directamente.

La inyección de dependencias es manual (sin librería DI): los casos de uso reciben
sus repositorios por constructor/factory, lo que permite testearlos con mocks sin
depender de implementaciones concretas.



## Decisiones técnicas y librerías utilizadas

El enunciado pide no usar librerías externas de terceros más allá de lo que
provee React Native/Expo. Se tomaron dos excepciones puntuales, documentadas acá:

| Librería | Tipo | Justificación |
|---|---|---|
| `@react-native-async-storage/async-storage` | Producción | Es el estándar de facto para persistencia local en React Native (formó parte del core hasta RN 0.59, y sigue siendo mantenida por la comunidad RN oficial). No existe alternativa nativa equivalente sin escribir un módulo nativo propio, lo cual excede el alcance de este challenge. |
| Jest + `@testing-library/react-native` | Desarrollo (no llega a producción) | Se interpreta que la restricción del enunciado aplica a librerías de lógica de negocio en runtime (navegación, estado, networking, UI kits), no a herramientas de desarrollo/testing, que son estándar de la industria y no forman parte del bundle de la app. |
| ESLint + Prettier | Desarrollo | Mismo criterio que el anterior: tooling, no código de producción. |

Todo lo demás (navegación, estado global, networking, persistencia de la
*lógica* de acceso) está implementado únicamente con APIs de React Native, Expo
core y JavaScript estándar.

### Decisión de navegación
 
Se implementó un navegador manual con estado local (`useState`/context simple en el
componente raíz: `'list' | 'detail'` + Pokémon seleccionado), en lugar de una
librería de navegación como React Navigation o `expo-router`.
 
**Por qué, sabiendo que ambas alternativas existen:** el flujo real de la app es
lineal y de solo dos pantallas (listado → detalle → volver), sin tabs, deep linking
ni stacks anidados — exactamente el caso donde una librería de navegación no aporta
nada que no resuelva un `useState`. React Navigation se descarta directo por ser
librería de terceros (viola la restricción del enunciado). `expo-router` es más
discutible por venir con el core de Expo, pero arrastra dependencias adicionales
(`react-native-screens`, `react-native-safe-area-context` y potencialmente
`reanimated`/`gesture-handler`) que no se justifican para un flujo de 2 pantallas.
 
Trade-off asumido: no hay gestos nativos de swipe-back ni animaciones de transición
del sistema — cubre el flujo requerido sin agregar dependencias de producción.

**Límite de esta decisión:** esta solución es apropiada para el alcance actual (2
pantallas, flujo lineal, sin parámetros de ruta complejos). Si el proyecto creciera a
navegación anidada, tabs, deep linking o varias rutas con parámetros tipados, el costo
de mantener esto a mano crecería rápido —en ese punto reconsideraríamos usar
expo-router pese al peso adicional que trae al bundle. Elegir la solución mínima
suficiente para el alcance real, en vez de anticipar requisitos que el challenge no
pide, es una decisión de criterio, no una limitación no evaluada.

## Estrategia de persistencia

`PokemonRepositoryImpl` implementa una estrategia **network-first con fallback a
cache** tanto para el listado como para el detalle: siempre intenta primero traer
los datos de la PokéAPI y, si responde ok, guarda el resultado mapeado en
`AsyncStorage` (guardado fire-and-forget, no bloquea la respuesta). Si el request
remoto falla (sin red, error del servidor, etc.), el repositorio recurre a la
cache local disponible; si tampoco hay nada cacheado, propaga el error original
del datasource remoto en vez de uno genérico, para no perder la causa real de la
falla.

El listado se cachea como una única lista acumulada bajo `POKEMON_LIST_STORAGE_KEY`
(ver detalle de la estrategia por offset en la sección de paginación). El detalle
se cachea por Pokémon individual, bajo una key propia por id
(`getPokemonDetailStorageKey(id)`), para que el fallback de un id nunca devuelva
el detalle cacheado de otro.

## Estados de UI

La app maneja explícitamente los estados de carga, error y vacío tanto en el
listado como en el detalle, mediante un tipo `RequestState<T>` compartido
(ver `shared/types`).

## Diseño responsive

El contenido de las pantallas se limita a un ancho máximo de lectura
(`MAX_CONTENT_WIDTH`, `shared/constants/layout.ts`) y se centra cuando la
pantalla es más ancha que eso, calculado con `useWindowDimensions()`
(reacciona a rotación/resize, a diferencia del `Dimensions` estático). En el
listado, el heading y el `FlatList` respetan ese ancho; en el detalle, el
hero (imagen + fondo de color) sigue full-bleed, pero el contenido de la
sheet (nombre, chips, métricas, stats) se limita al mismo ancho, evitando
barras de stats desproporcionadamente largas en tablets. En pantallas de
teléfono normales el comportamiento es idéntico al anterior, porque el ancho
disponible ya es menor al máximo.

### Landscape en el detalle

Cuando el ancho de pantalla supera al alto (`orientation: "default"` en
`app.json`, sin bloqueo a portrait), la pantalla de detalle deja de apilar
hero + contenido dentro de un único scroll y pasa a un layout lado a lado:
el hero ocupa una franja fija a la izquierda (`DETAIL_HERO_LANDSCAPE_RATIO`,
`shared/constants/layout.ts`) y la sheet (nombre, chips, stats, botón) scrollea
de forma independiente a la derecha. Apilado en landscape obligaba a scrollear
para llegar al botón "Volver" en tablets apaisadas; lado a lado, el contenido
entra completo sin scroll en el alto disponible. El estado de carga
(`PokemonDetailSkeleton`) sigue el mismo criterio para no pegar un salto de
layout cuando terminan de cargar los datos.

### Landscape en el listado

El listado no tiene el problema de scroll del detalle (es una lista con
scroll natural y paginada, sin un "final" fijo), pero sí tenía el mismo
problema de márgenes vacíos que el detalle en pantallas anchas. A diferencia
del resto de la app, en landscape el listado no se centra con
`MAX_CONTENT_WIDTH`: no protege una columna de lectura larga (son filas
cortas, imagen + nombre), así que se alinea a la izquierda y usa un tope más
generoso (`LIST_MAX_CONTENT_WIDTH_LANDSCAPE`, `shared/constants/layout.ts`),
para que las filas ocupen más pantalla en vez de dejar aire vacío a ambos
lados.

## Funcionalidades bonus implementadas

### Paginación / carga incremental

El listado no trae los 20 Pokémon fijos y termina ahí: `usePokemonList` expone
`loadMore()`, que pide la siguiente página (offset +20) y la agrega al final de
la lista existente, activado por scroll (`onEndReached` del `FlatList`). La
cache local sigue la misma estrategia network-first: en la carga inicial
(offset 0) reemplaza la cache completa; en páginas siguientes, la mergea con lo
ya cacheado, evitando que una sesión de paginación vieja quede mezclada con un
listado nuevo tras reabrir la app.

### Manejo centralizado de errores

Un único punto (`getUserFriendlyErrorMessage`) traduce los errores tipados de
la capa de red (`PokemonApiError`: `network` / `http` / `parse`) a mensajes en
español sin jerga técnica, consumido tanto por la carga inicial como por los
fallos de `loadMore` (que se muestran inline, sin bloquear la lista ya
cargada, con opción de reintentar).

### Skeleton loaders

Reemplazan el spinner genérico durante la carga inicial del listado y del
detalle: bloques con la misma silueta y dimensiones que el contenido real
(evita el "salto" visual al terminar de cargar), con un único efecto de pulso
de opacidad (`Animated` del core de RN, sin librerías) aplicado al bloque
completo, no elemento por elemento.

### Transición animada al detalle

Único momento de animación deliberado de la app (evitando el fade-in genérico
por ítem en el listado): al entrar al detalle, la pantalla se desliza desde la
derecha con `translateX` + `opacity` (`Animated.timing`, ~220ms); al volver,
corre la animación inversa y recién cuando termina se desmonta el detalle y
se dispara la navegación real, revelando el listado (que ya estaba montado
debajo) a medida que se desliza afuera. Un guard por `ref` evita que un doble
tap sobre "Volver" dispare la navegación dos veces o deje la animación a
medio terminar.

### Optimización de rendimiento

`PokemonListItem` memoizado (`React.memo`), con las funciones de navegación
(`goToDetail`/`goToList`) estabilizadas con `useCallback` para que la
memoización tenga efecto real. El `FlatList` usa `getItemLayout` (evita medir
cada fila dinámicamente, ya que la altura es fija y conocida) y
`removeClippedSubviews`, con umbrales de renderizado por lote ajustados al
tamaño real de cada fila.

### Testing (unitario + integración)

Cobertura unitaria en las tres capas (casos de uso, mappers, repositorios,
reducers, hooks y pantallas), más un test de integración de punta a punta
(`App` completo sin mockear hooks ni navegación, solo la red) que verifica el
flujo real: listado → tap → detalle → volver.

### Accesibilidad

Roles y labels descriptivos para lector de pantalla en toda la interacción:
filas del listado anunciadas como una sola unidad ("Bulbasaur, número 1, ver
detalle") en vez de fragmentos sueltos, imágenes con nombre del Pokémon,
chips de tipo y barras de stats con su valor leído en voz (no solo color o
longitud visual como diferenciador), y los skeletons de carga ocultos
explícitamente del lector de pantalla para no anunciar contenido decorativo.
Contraste de texto verificado con cálculo real contra el fondo (offWhite
15:1, offWhiteMuted 5.31:1, ambos por encima del mínimo WCAG de 4.5:1). Los
textos de los botones "Volver" y "Reintentar" no calificaban para el umbral
reducido de "texto grande" (16px/13px, ninguno llega a 18px normal o 14px
bold), así que se ajustaron a blanco puro para cumplir 4.5:1 (5.10:1 y
18.05:1 respectivamente) sin modificar `pokedexRed`, que se mantiene intacto
como color de marca en el resto de la app.

## Estructura de carpetas

```
src/
├── domain/
│   ├── entities/          # Pokemon, PokemonDetail, PokemonListItem, PokemonListPage, PokemonStat: modelos puros de dominio
│   ├── repositories/      # IPokemonRepository: contrato que implementa la capa data
│   └── usecases/          # GetPokemonListUseCase, GetPokemonDetailUseCase: reglas de negocio, reciben el repositorio por interfaz
├── data/
│   ├── datasources/
│   │   ├── local/         # PokemonLocalDataSource: persistencia en AsyncStorage
│   │   └── remote/        # PokemonRemoteDataSource, DTOs y PokemonApiError: fetch a PokéAPI y sus tipos crudos
│   ├── mappers/           # pokemonMapper, pokemonDetailMapper: traducen DTO de la API a entidades de domain
│   └── repositories/      # PokemonRepositoryImpl: implementa IPokemonRepository con estrategia network-first + cache
├── presentation/
│   ├── components/        # Button, PokemonListItem y skeletons de listado/detalle: UI pura, memoizada donde aplica
│   ├── hooks/             # usePokemonList, usePokemonDetail, usePulseAnimation, useDetailTransition, useIsLandscape: conectan pantallas con los casos de uso y manejan animaciones y breakpoints de orientación
│   ├── navigation/        # navegador manual (reducer + context propio con estado 'list' | 'detail', sin librerías)
│   └── screens/
│       ├── PokemonList/   # pantalla de listado
│       └── PokemonDetail/ # pantalla de detalle
├── shared/
│   ├── constants/         # colores, tipografía, radios, breakpoints de tablet/landscape, URL de la API, claves de storage y colores/labels/stats por tipo de Pokémon
│   ├── types/              # RequestState<T>, PokemonType, PokemonStatName: tipado compartido entre capas
│   └── utils/               # capitalize, formatPokemonId, getUserFriendlyErrorMessage, safeAreaInsets: helpers genéricos
└── di/                       # container.ts: inyección de dependencias manual, arma repositorios y casos de uso
```

