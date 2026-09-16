import { PokemonDetail } from '../entities/PokemonDetail';
import { IPokemonRepository } from '../repositories/IPokemonRepository';
import { GetPokemonDetailUseCase } from './GetPokemonDetailUseCase';

const buildRepositoryMock = (): jest.Mocked<IPokemonRepository> => ({
  getPokemonList: jest.fn(),
  getPokemonDetail: jest.fn(),
});

const buildPokemonDetail = (): PokemonDetail => ({
  id: 25,
  name: 'pikachu',
  imageUrl: 'https://example.com/25.png',
  types: ['electric'],
  abilities: ['static', 'lightning-rod'],
  stats: [
    { name: 'hp', baseValue: 35 },
    { name: 'speed', baseValue: 90 },
  ],
  height: 0.4,
  weight: 6,
  baseExperience: 112,
});

describe('GetPokemonDetailUseCase', () => {
  it('devuelve el detalle que provee el repositorio', async () => {
    const pokemonDetail = buildPokemonDetail();
    const repository = buildRepositoryMock();
    repository.getPokemonDetail.mockResolvedValue(pokemonDetail);
    const useCase = new GetPokemonDetailUseCase(repository);

    const result = await useCase.execute(25);

    expect(result).toEqual(pokemonDetail);
    expect(repository.getPokemonDetail).toHaveBeenCalledWith(25);
  });

  it('propaga el error cuando el repositorio falla', async () => {
    const repository = buildRepositoryMock();
    repository.getPokemonDetail.mockRejectedValue(new Error('network error'));
    const useCase = new GetPokemonDetailUseCase(repository);

    await expect(useCase.execute(25)).rejects.toThrow('network error');
  });

  it('propaga el error cuando el pokemon no existe (404)', async () => {
    const repository = buildRepositoryMock();
    repository.getPokemonDetail.mockRejectedValue(new Error('La PokéAPI respondió con un error (status 404)'));
    const useCase = new GetPokemonDetailUseCase(repository);

    await expect(useCase.execute(99999)).rejects.toThrow('status 404');
  });
});
