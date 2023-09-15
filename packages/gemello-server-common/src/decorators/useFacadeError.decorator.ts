import { InternalServerErrorException } from "@nestjs/common";
import { UseError } from "../utils/useError";

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "unknown facade error";

export const UseFacadeError = UseError(
  (e) => new InternalServerErrorException(getErrorMessage(e))
);
