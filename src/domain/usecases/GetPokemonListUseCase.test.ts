import { PokemonListItem } from '../entities/PokemonListItem';
import { IPokemonRepository } from '../repositories/IPokemonRepository';
import { GetPokemonListUseCase } from './GetPokemonListUseCase';

const buildRepositoryMock = (): jest.Mocked<IPokemonRepository> => ({
  getPokemonList: jest.fn(),
});

describe('GetPokemonListUseCase', () => {
  it('devuelve la lista de pokemon que provee el repositorio', async () => {
    const pokemonList: PokemonListItem[] = [
      { id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' },
      { id: 2, name: 'ivysaur', imageUrl: 'https://example.com/2.png' },
    ];
    const repository = buildRepositoryMock();
    repository.getPokemonList.mockResolvedValue(pokemonList);
    const useCase = new GetPokemonListUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual(pokemonList);
    expect(repository.getPokemonList).toHaveBeenCalledWith(20, 0);
  });

  it('propaga el error cuando el repositorio falla', async () => {
    const repository = buildRepositoryMock();
    repository.getPokemonList.mockRejectedValue(new Error('network error'));
    const useCase = new GetPokemonListUseCase(repository);

    await expect(useCase.execute()).rejects.toThrow('network error');
  });

  it('devuelve una lista vacía sin lanzar error cuando no hay pokemon', async () => {
    const repository = buildRepositoryMock();
    repository.getPokemonList.mockResolvedValue([]);
    const useCase = new GetPokemonListUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it('respeta limit y offset explícitos', async () => {
    const repository = buildRepositoryMock();
    repository.getPokemonList.mockResolvedValue([]);
    const useCase = new GetPokemonListUseCase(repository);

    await useCase.execute(10, 20);

    expect(repository.getPokemonList).toHaveBeenCalledWith(10, 20);
  });
});
