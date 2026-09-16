import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { PokedexNavigationProvider, useNavigationState } from './src/presentation/navigation';
import { PokemonDetailScreen } from './src/presentation/screens/PokemonDetail';
import { PokemonListScreen } from './src/presentation/screens/PokemonList';
import { colors } from './src/shared/constants';

function RootNavigator() {
  const { screen } = useNavigationState();

  return (
    <View style={styles.container}>
      <View style={[styles.screenSlot, screen === 'detail' && styles.hidden]}>
        <PokemonListScreen />
      </View>
      {screen === 'detail' && <PokemonDetailScreen />}
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
  hidden: {
    display: 'none',
  },
});
