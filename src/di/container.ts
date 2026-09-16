import { PokemonLocalDataSource } from '../data/datasources/local';
import { PokemonRemoteDataSource } from '../data/datasources/remote';
import { PokemonRepositoryImpl } from '../data/repositories';
import { GetPokemonListUseCase } from '../domain/usecases';

// Composition root: único lugar del proyecto donde se instancian clases de
// `data` directamente (sección 4 del CLAUDE.md). Todo lo demás consume estas
// instancias ya cableadas, nunca hace `new` de un datasource o repositorio.
const pokemonRemoteDataSource = new PokemonRemoteDataSource();
const pokemonLocalDataSource = new PokemonLocalDataSource();
const pokemonRepository = new PokemonRepositoryImpl(pokemonRemoteDataSource, pokemonLocalDataSource);

export const getPokemonListUseCase = new GetPokemonListUseCase(pokemonRepository);
