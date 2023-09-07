import { RepositoryError } from '../errors/repository.error';
import { UseError } from '../utils/useError';

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : 'unknown repository error';

export function UseRepositoryError() {
  return UseError((e) => new RepositoryError(getErrorMessage(e)));
}
