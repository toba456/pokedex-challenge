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


## Estados de UI

La app maneja explícitamente los estados de carga, error y vacío tanto en el
listado como en el detalle, mediante un tipo `RequestState<T>` compartido
(ver `shared/types`).

## Estructura de carpetas

Ver el detalle completo en `CLAUDE.md` (sección 4). Resumen:

```
src/
  domain/        → entidades, interfaces de repositorio, casos de uso
  data/          → datasources, implementación de repositorios, mappers
  presentation/  → screens, componentes, navegación, contexto/estado
  shared/        → types, utils, constants
```

