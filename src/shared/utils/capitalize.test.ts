import { capitalize } from './capitalize';

describe('capitalize', () => {
  it('pone en mayúscula la primera letra y deja el resto igual', () => {
    expect(capitalize('bulbasaur')).toBe('Bulbasaur');
  });

  it('no rompe con un string de un solo carácter', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('deja intacto un string vacío', () => {
    expect(capitalize('')).toBe('');
  });
});
