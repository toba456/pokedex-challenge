import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PokemonDetailSkeleton } from '../../components';
import { PokemonDetail, PokemonStat } from '../../../domain/entities';
import {
  colors,
  HEADING_FONT_FAMILY,
  MONOSPACE_FONT_FAMILY,
  POKEMON_STAT_LABELS,
  POKEMON_STAT_MAX_VALUE,
  POKEMON_TYPE_COLORS,
  POKEMON_TYPE_LABELS,
  RADIUS,
  SHEET_RADIUS,
} from '../../../shared/constants';
import { getSafeAreaInsets } from '../../../shared/utils';
import { usePokemonDetail } from '../../hooks';
import { usePokedexNavigation } from '../../navigation';

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress} testID="pokemon-detail-back-button">
      <Text style={styles.buttonText}>Volver</Text>
    </Pressable>
  );
}

function StatBar({ stat, accentColor }: { stat: PokemonStat; accentColor: string }) {
  const widthPercent = (stat.baseValue / POKEMON_STAT_MAX_VALUE) * 100;

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{POKEMON_STAT_LABELS[stat.name]}</Text>
      <View style={styles.statTrack}>
        <View style={[styles.statFill, { width: `${widthPercent}%`, backgroundColor: accentColor }]} />
      </View>
      <Text style={styles.statValue}>{String(stat.baseValue).padStart(3, '0')}</Text>
    </View>
  );
}

function PokemonDetailView({ pokemon, onGoToList }: { pokemon: PokemonDetail; onGoToList: () => void }) {
  const accentColor = POKEMON_TYPE_COLORS[pokemon.types[0]] ?? colors.pokedexRed;

  return (
    <View style={styles.screen} testID="pokemon-detail-content">
      <ScrollView bounces={false}>
        <View style={[styles.hero, { backgroundColor: accentColor }]}>
          <Image source={{ uri: pokemon.imageUrl }} style={styles.heroImage} resizeMode="contain" />
        </View>

        <View style={styles.sheet}>
          <View style={styles.content}>
            <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
            <Text style={styles.name}>{pokemon.name}</Text>

            <View style={styles.chipRow}>
              {pokemon.types.map((type) => {
                const typeColor = POKEMON_TYPE_COLORS[type];
                return (
                  <View
                    key={type}
                    style={[styles.chip, { borderColor: typeColor, backgroundColor: `${typeColor}26` }]}
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

            <BackButton onPress={onGoToList} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PokemonDetailContent({ id, onGoToList }: { id: number; onGoToList: () => void }) {
  const state = usePokemonDetail(id);

  if (state.status === 'idle' || state.status === 'loading') {
    return <PokemonDetailSkeleton />;
  }

  if (state.status === 'error' || !state.data) {
    return (
      <View style={styles.centeredSafe} testID="pokemon-detail-error">
        <Text style={styles.message}>{state.error ?? 'Ocurrió un error inesperado.'}</Text>
        <BackButton onPress={onGoToList} />
      </View>
    );
  }

  return <PokemonDetailView pokemon={state.data} onGoToList={onGoToList} />;
}

export function PokemonDetailScreen() {
  const { selectedPokemonId, goToList } = usePokedexNavigation();

  if (selectedPokemonId === null) {
    return (
      <View style={styles.centeredSafe} testID="pokemon-detail-error">
        <Text style={styles.message}>No se seleccionó ningún pokémon.</Text>
        <BackButton onPress={goToList} />
      </View>
    );
  }

  return <PokemonDetailContent id={selectedPokemonId} onGoToList={goToList} />;
}

const insets = getSafeAreaInsets();

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.nearBlack,
  },
  centeredSafe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.nearBlack,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    padding: 24,
    gap: 24,
  },
  message: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
    textAlign: 'center',
  },
  hero: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 220,
    height: 220,
  },
  sheet: {
    marginTop: -SHEET_RADIUS,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    backgroundColor: colors.nearBlack,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 20 + insets.bottom,
    gap: 4,
  },
  id: {
    color: colors.offWhiteMuted,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 14,
  },
  name: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 28,
    textTransform: 'capitalize',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 24,
  },
  metric: {
    gap: 2,
  },
  metricLabel: {
    color: colors.offWhiteMuted,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 12,
  },
  metricValue: {
    color: colors.offWhite,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 16,
  },
  sectionTitle: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
    marginTop: 28,
    marginBottom: 8,
  },
  abilities: {
    color: colors.offWhite,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  statsBlock: {
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: {
    color: colors.offWhiteMuted,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 12,
    width: 84,
  },
  statTrack: {
    flex: 1,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.statTrack,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 2,
  },
  statValue: {
    color: colors.offWhite,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 12,
    width: 30,
    textAlign: 'right',
  },
  button: {
    backgroundColor: colors.pokedexRed,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS,
    alignSelf: 'flex-start',
    marginTop: 28,
  },
  buttonText: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
  },
});
