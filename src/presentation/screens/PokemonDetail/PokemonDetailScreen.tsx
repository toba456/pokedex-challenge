import { Image, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { Button, PokemonDetailSkeleton } from '../../components';
import { PokemonDetail, PokemonStat } from '@domain/entities';
import {
  colors,
  DETAIL_HERO_LANDSCAPE_RATIO,
  MAX_CONTENT_WIDTH,
  POKEMON_STAT_LABELS,
  POKEMON_STAT_MAX_VALUE,
  POKEMON_TYPE_COLORS,
  POKEMON_TYPE_LABELS,
} from '@shared/constants';
import { usePokemonDetail } from '../../hooks';
import { usePokedexNavigation } from '../../navigation';
import { styles } from './PokemonDetailScreen.styles';

function FloatingBackButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.floatingBackButton}>
      <Button
        variant="icon"
        label="Volver"
        onPress={onPress}
        testID="pokemon-detail-back-button"
        accessibilityLabel="Volver al listado"
      />
    </View>
  );
}

function StatBar({ stat, accentColor }: { stat: PokemonStat; accentColor: string }) {
  const widthPercent = (stat.baseValue / POKEMON_STAT_MAX_VALUE) * 100;
  const statLabel = POKEMON_STAT_LABELS[stat.name];
  return (
    <View
      style={styles.statRow}
      accessible
      accessibilityLabel={`${statLabel}: ${stat.baseValue} sobre ${POKEMON_STAT_MAX_VALUE}`}
    >
      <Text style={styles.statLabel}>{statLabel}</Text>
      <View style={styles.statTrack}>
        <View style={[styles.statFill, { width: `${widthPercent}%`, backgroundColor: accentColor }]} />
      </View>
      <Text style={styles.statValue}>{String(stat.baseValue)}</Text>
    </View>
  );
}

function DetailFields({ pokemon, accentColor }: { pokemon: PokemonDetail; accentColor: string }) {
  return (
    <>
      <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
      <Text style={styles.name}>{pokemon.name}</Text>

      <View style={styles.chipRow}>
        {pokemon.types.map((type) => {
          const typeColor = POKEMON_TYPE_COLORS[type];
          return (
            <View
              key={type}
              style={[styles.chip, { borderColor: typeColor, backgroundColor: `${typeColor}26` }]}
              accessible
              accessibilityLabel={POKEMON_TYPE_LABELS[type]}
            >
              <Text style={[styles.chipText, { color: typeColor }]}>{POKEMON_TYPE_LABELS[type]}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Altura</Text>
          <Text style={styles.metricValue}>{pokemon.height.toFixed(1)} m</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Peso</Text>
          <Text style={styles.metricValue}>{pokemon.weight.toFixed(1)} kg</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Exp. base</Text>
          <Text style={styles.metricValue}>{pokemon.baseExperience ?? '—'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Habilidades</Text>
      <Text style={styles.abilities}>{pokemon.abilities.join(', ')}</Text>

      <Text style={styles.sectionTitle}>Estadísticas</Text>
      <View style={styles.statsBlock}>
        {pokemon.stats.map((stat) => (
          <StatBar key={stat.name} stat={stat} accentColor={accentColor} />
        ))}
      </View>
    </>
  );
}

function PokemonDetailView({ pokemon }: { pokemon: PokemonDetail }) {
  const accentColor = POKEMON_TYPE_COLORS[pokemon.types[0]] ?? colors.pokedexRed;
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const { width, height } = useWindowDimensions();
  // Landscape (tablet apaisada): hero y contenido van lado a lado en vez de
  // apilados, para no forzar un scroll largo cuando el alto disponible es
  // chico y sobra ancho.
  const isLandscape = width > height;

  if (isLandscape) {
    const heroWidth = Math.round(width * DETAIL_HERO_LANDSCAPE_RATIO);
    const contentPaneWidth = width - heroWidth;
    const contentWidth = Math.min(contentPaneWidth, MAX_CONTENT_WIDTH);

    return (
      <View style={styles.screen} testID="pokemon-detail-content">
        <View style={styles.landscapeRow}>
          <View style={[styles.heroLandscape, { backgroundColor: accentColor, width: heroWidth }]}>
            <Image
              source={{ uri: pokemon.imageUrl }}
              style={styles.heroImage}
              resizeMode="contain"
              accessibilityLabel={displayName}
            />
          </View>

          <View style={styles.sheetLandscape}>
            <ScrollView style={styles.landscapeContentScroll} bounces={false}>
              <View style={[styles.content, { width: contentWidth }]}>
                <DetailFields pokemon={pokemon} accentColor={accentColor} />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);

  return (
    <View style={styles.screen} testID="pokemon-detail-content">
      <ScrollView bounces={false}>
        <View style={[styles.hero, { backgroundColor: accentColor }]}>
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel={displayName}
          />
        </View>

        <View style={styles.sheet}>
          <View style={[styles.content, { width: contentWidth }]}>
            <DetailFields pokemon={pokemon} accentColor={accentColor} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PokemonDetailContent({ id }: { id: number }) {
  const state = usePokemonDetail(id);

  if (state.status === 'idle' || state.status === 'loading') {
    return <PokemonDetailSkeleton />;
  }

  if (state.status === 'error' || !state.data) {
    return (
      <View style={styles.centeredSafe} testID="pokemon-detail-error">
        <Text style={styles.message}>{state.error ?? 'Ocurrió un error inesperado.'}</Text>
      </View>
    );
  }

  return <PokemonDetailView pokemon={state.data} />;
}

export function PokemonDetailScreen() {
  const { selectedPokemonId, goToList } = usePokedexNavigation();

  return (
    <View style={styles.screenContainer}>
      <FloatingBackButton onPress={goToList} />
      {selectedPokemonId === null ? (
        <View style={styles.centeredSafe} testID="pokemon-detail-error">
          <Text style={styles.message}>No se seleccionó ningún pokémon.</Text>
        </View>
      ) : (
        <PokemonDetailContent id={selectedPokemonId} />
      )}
    </View>
  );
}
