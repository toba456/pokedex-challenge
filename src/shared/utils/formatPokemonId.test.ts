import { formatPokemonId } from './formatPokemonId';

describe('formatPokemonId', () => {
  it('rellena con ceros a la izquierda hasta 3 dígitos', () => {
    expect(formatPokemonId(1)).toBe('#001');
  });

  it('no trunca ids de 3 dígitos', () => {
    expect(formatPokemonId(150)).toBe('#150');
  });

  it('no trunca ids de más de 3 dígitos', () => {
    expect(formatPokemonId(1024)).toBe('#1024');
  });
});
