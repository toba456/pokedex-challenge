import { Pressable, StyleSheet, Text, View } from 'react-native';

import { usePokedexNavigation } from '../../navigation';
import { colors, HEADING_FONT_FAMILY, MONOSPACE_FONT_FAMILY } from '../../../shared/constants';

// Placeholder mínimo para poder probar el flujo de navegación completo. El
// contenido real (tipos, habilidades, stats, peso, altura) se agrega en el
// próximo bloque de trabajo.
export function PokemonDetailScreen() {
  const { selectedPokemonId, goToList } = usePokedexNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.idText}>Pokémon #{selectedPokemonId ?? '—'}</Text>
      <Pressable style={styles.button} onPress={goToList} testID="pokemon-detail-back-button">
        <Text style={styles.buttonText}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.nearBlack,
    gap: 24,
  },
  idText: {
    color: colors.offWhite,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 20,
  },
  button: {
    backgroundColor: colors.pokedexRed,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
  },
});
