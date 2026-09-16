import { Image, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { Button, PokemonDetailSkeleton } from '../../components';
import { PokemonDetail, PokemonStat } from '@domain/entities';
import {
  colors,
  DETAIL_HERO_LANDSCAPE_RATIO,
  MAX_CONTENT_WIDTH,
  MAX_CONTENT_WIDTH_TABLET,
  POKEMON_STAT_LABELS,
  POKEMON_STAT_MAX_VALUE,
  POKEMON_TYPE_COLORS,
  POKEMON_TYPE_LABELS,
  TABLET_BREAKPOINT,
} from '@shared/constants';
import { useIsLandscape, usePokemonDetail } from '../../hooks';
import { usePokedexNavigation } from '../../navigation';
import { capitalize, formatPokemonId } from '@shared/utils';
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

function StatBar({
  stat,
  accentColor,
  isTablet,
}: {
  stat: PokemonStat;
  accentColor: string;
  isTablet: boolean;
}) {
  const widthPercent = (stat.baseValue / POKEMON_STAT_MAX_VALUE) * 100;
  const statLabel = POKEMON_STAT_LABELS[stat.name];
  return (
    <View
      style={[styles.statRow, isTablet && styles.statRowTablet]}
      accessible
      accessibilityLabel={`${statLabel}: ${stat.baseValue} sobre ${POKEMON_STAT_MAX_VALUE}`}
    >
      <Text style={[styles.statLabel, isTablet && styles.statLabelTablet]}>{statLabel}</Text>
      <View style={[styles.statTrack, isTablet && styles.statTrackTablet]}>
        <View style={[styles.statFill, { width: `${widthPercent}%`, backgroundColor: accentColor }]} />
      </View>
      <Text style={[styles.statValue, isTablet && styles.statValueTablet]}>{String(stat.baseValue)}</Text>
    </View>
  );
}

function DetailFields({
  pokemon,
  accentColor,
  isTablet,
}: {
  pokemon: PokemonDetail;
  accentColor: string;
  isTablet: boolean;
}) {
  return (
    <>
      <Text style={[styles.id, isTablet && styles.idTablet]}>{formatPokemonId(pokemon.id)}</Text>
      <Text style={[styles.name, isTablet && styles.nameTablet]}>{pokemon.name}</Text>

      <View style={[styles.chipRow, isTablet && styles.chipRowTablet]}>
        {pokemon.types.map((type) => {
          const typeColor = POKEMON_TYPE_COLORS[type];
          return (
            <View
              key={type}
              style={[
                styles.chip,
                isTablet && styles.chipTablet,
                { borderColor: typeColor, backgroundColor: `${typeColor}26` },
              ]}
              accessible
              accessibilityLabel={POKEMON_TYPE_LABELS[type]}
            >
              <Text style={[styles.chipText, isTablet && styles.chipTextTablet, { color: typeColor }]}>
                {POKEMON_TYPE_LABELS[type]}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.metricsRow, isTablet && styles.metricsRowTablet]}>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, isTablet && styles.metricLabelTablet]}>Altura</Text>
          <Text style={[styles.metricValue, isTablet && styles.metricValueTablet]}>
            {pokemon.height.toFixed(1)} m
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, isTablet && styles.metricLabelTablet]}>Peso</Text>
          <Text style={[styles.metricValue, isTablet && styles.metricValueTablet]}>
            {pokemon.weight.toFixed(1)} kg
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, isTablet && styles.metricLabelTablet]}>Exp. base</Text>
          <Text style={[styles.metricValue, isTablet && styles.metricValueTablet]}>
            {pokemon.baseExperience ?? '—'}
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>Habilidades</Text>
      <Text style={[styles.abilities, isTablet && styles.abilitiesTablet]}>{pokemon.abilities.join(', ')}</Text>

      <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>Estadísticas</Text>
      <View style={[styles.statsBlock, isTablet && styles.statsBlockTablet]}>
        {pokemon.stats.map((stat) => (
          <StatBar key={stat.name} stat={stat} accentColor={accentColor} isTablet={isTablet} />
        ))}
      </View>
    </>
  );
}

function PokemonDetailView({ pokemon }: { pokemon: PokemonDetail }) {
  const accentColor = POKEMON_TYPE_COLORS[pokemon.types[0]] ?? colors.pokedexRed;
  const displayName = capitalize(pokemon.name);
  const { width, height } = useWindowDimensions();
  // Landscape (tablet apaisada): hero y contenido van lado a lado en vez de
  // apilados, para no forzar un scroll largo cuando el alto disponible es
  // chico y sobra ancho.
  const isLandscape = useIsLandscape();
  const isTablet = Math.min(width, height) >= TABLET_BREAKPOINT;
  const maxContentWidth = isTablet ? MAX_CONTENT_WIDTH_TABLET : MAX_CONTENT_WIDTH;

  if (isLandscape) {
    const heroWidth = Math.round(width * DETAIL_HERO_LANDSCAPE_RATIO);
    const contentPaneWidth = width - heroWidth;
    const contentWidth = Math.min(contentPaneWidth, maxContentWidth);

    return (
      <View style={styles.screen} testID="pokemon-detail-content">
        <View style={styles.landscapeRow}>
          <View style={[styles.heroLandscape, { backgroundColor: accentColor, width: heroWidth }]}>
            <Image
              source={{ uri: pokemon.imageUrl }}
              style={[styles.heroImage, isTablet && styles.heroImageTablet]}
              resizeMode="contain"
              accessibilityLabel={displayName}
            />
          </View>

          <View style={styles.sheetLandscape}>
            <ScrollView style={styles.landscapeContentScroll} bounces={false}>
              <View style={[styles.content, isTablet && styles.contentTablet, { width: contentWidth }]}>
                <DetailFields pokemon={pokemon} accentColor={accentColor} isTablet={isTablet} />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  const contentWidth = Math.min(width, maxContentWidth);

  return (
    <View style={styles.screen} testID="pokemon-detail-content">
      <ScrollView bounces={false}>
        <View style={[styles.hero, isTablet && styles.heroTablet, { backgroundColor: accentColor }]}>
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={[styles.heroImage, isTablet && styles.heroImageTablet]}
            resizeMode="contain"
            accessibilityLabel={displayName}
          />
        </View>

        <View style={styles.sheet}>
          <View style={[styles.content, isTablet && styles.contentTablet, { width: contentWidth }]}>
            <DetailFields pokemon={pokemon} accentColor={accentColor} isTablet={isTablet} />
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

type PokemonDetailScreenProps = {
  // Le permite al contenedor de navegación (App.tsx) interceptar el botón de
  // volver para correr la animación de salida antes de desmontar la pantalla.
  // Sin wrapper (ej. en tests unitarios de esta pantalla) cae directo a
  // goToList, sin delay.
  onRequestBack?: () => void;
};

export function PokemonDetailScreen({ onRequestBack }: PokemonDetailScreenProps) {
  const { selectedPokemonId, goToList } = usePokedexNavigation();
  const handleBack = onRequestBack ?? goToList;

  return (
    <View style={styles.screenContainer}>
      <FloatingBackButton onPress={handleBack} />
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
