export type PokemonApiErrorType = 'network' | 'http' | 'parse';

export class PokemonApiError extends Error {
  constructor(
    public readonly type: PokemonApiErrorType,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'PokemonApiError';
  }
}
