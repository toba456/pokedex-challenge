import { StatusBar } from 'expo-status-bar';
import { Animated, StyleSheet, View } from 'react-native';

import { useDetailTransition } from './src/presentation/hooks';
import { PokedexNavigationProvider, useNavigationActions, useNavigationState } from './src/presentation/navigation';
import { PokemonDetailScreen } from './src/presentation/screens/PokemonDetail';
import { PokemonListScreen } from './src/presentation/screens/PokemonList';
import { colors } from './src/shared/constants';

function AnimatedPokemonDetailScreen() {
  const { goToList } = useNavigationActions();
  const { animatedStyle, close } = useDetailTransition(goToList);

  return (
    <Animated.View style={[styles.detailOverlay, animatedStyle]}>
      <PokemonDetailScreen onRequestBack={close} />
    </Animated.View>
  );
}

function RootNavigator() {
  const { screen } = useNavigationState();
  const isDetailOpen = screen === 'detail';

  return (
    <View style={styles.container}>
      <View
        style={styles.screenSlot}
        accessibilityElementsHidden={isDetailOpen}
        importantForAccessibility={isDetailOpen ? 'no-hide-descendants' : 'auto'}
      >
        <PokemonListScreen />
      </View>
      {isDetailOpen && <AnimatedPokemonDetailScreen />}
    </View>
  );
}

export default function App() {
  return (
    <PokedexNavigationProvider>
      <RootNavigator />
      <StatusBar style="light" />
    </PokedexNavigationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.nearBlack,
  },
  screenSlot: {
    flex: 1,
  },
  detailOverlay: {
    ...StyleSheet.absoluteFill,
  },
});
