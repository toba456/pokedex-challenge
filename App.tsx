import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { PokedexNavigationProvider, usePokedexNavigation } from './src/presentation/navigation';
import { PokemonDetailScreen } from './src/presentation/screens/PokemonDetail';
import { PokemonListScreen } from './src/presentation/screens/PokemonList';
import { colors } from './src/shared/constants';

function RootNavigator() {
  const { screen } = usePokedexNavigation();

  return <View style={styles.container}>{screen === 'list' ? <PokemonListScreen /> : <PokemonDetailScreen />}</View>;
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
});
