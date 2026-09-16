import { PokemonListPage } from '../entities/PokemonListPage';
import { IPokemonRepository } from '../repositories/IPokemonRepository';
import { GetPokemonListUseCase } from './GetPokemonListUseCase';

const buildRepositoryMock = (): jest.Mocked<IPokemonRepository> => ({
  getPokemonList: jest.fn(),
  getPokemonDetail: jest.fn(),
});

describe('GetPokemonListUseCase', () => {
  it('devuelve la página de pokemon que provee el repositorio', async () => {
    const page: PokemonListPage = {
      items: [
        { id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' },
        { id: 2, name: 'ivysaur', imageUrl: 'https://example.com/2.png' },
      ],
      hasMore: true,
    };
    const repository = buildRepositoryMock();
    repository.getPokemonList.mockResolvedValue(page);
    const useCase = new GetPokemonListUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual(page);
    expect(repository.getPokemonList).toHaveBeenCalledWith(20, 0);
  });

  it('propaga el error cuando el repositorio falla', async () => {
    const repository = buildRepositoryMock();
    repository.getPokemonList.mockRejectedValue(new Error('network error'));
    const useCase = new GetPokemonListUseCase(repository);

    await expect(useCase.execute()).rejects.toThrow('network error');
  });

  it('devuelve una página vacía con hasMore false sin lanzar error cuando no hay pokemon', async () => {
    const emptyPage: PokemonListPage = { items: [], hasMore: false };
    const repository = buildRepositoryMock();
    repository.getPokemonList.mockResolvedValue(emptyPage);
    const useCase = new GetPokemonListUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual(emptyPage);
  });

  it('respeta limit y offset explícitos', async () => {
    const repository = buildRepositoryMock();
    repository.getPokemonList.mockResolvedValue({ items: [], hasMore: false });
    const useCase = new GetPokemonListUseCase(repository);

    await useCase.execute(10, 20);

    expect(repository.getPokemonList).toHaveBeenCalledWith(10, 20);
  });
});
