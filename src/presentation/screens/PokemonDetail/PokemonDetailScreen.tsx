import { Image, ScrollView, Text, View } from 'react-native';

import { Button, PokemonDetailSkeleton } from '../../components';
import { PokemonDetail, PokemonStat } from '../../../domain/entities';
import {
  colors,
  POKEMON_STAT_LABELS,
  POKEMON_STAT_MAX_VALUE,
  POKEMON_TYPE_COLORS,
  POKEMON_TYPE_LABELS,
} from '../../../shared/constants';
import { usePokemonDetail } from '../../hooks';
import { usePokedexNavigation } from '../../navigation';
import { styles } from './PokemonDetailScreen.styles';

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Button
      variant="primary"
      label="Volver"
      onPress={onPress}
      testID="pokemon-detail-back-button"
      accessibilityLabel="Volver al listado"
    />
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
      <Text style={styles.statValue}>{String(stat.baseValue).padStart(3, '0')}</Text>
    </View>
  );
}

function PokemonDetailView({ pokemon, onGoToList }: { pokemon: PokemonDetail; onGoToList: () => void }) {
  const accentColor = POKEMON_TYPE_COLORS[pokemon.types[0]] ?? colors.pokedexRed;
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

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
