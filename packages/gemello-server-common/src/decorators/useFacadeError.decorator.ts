import { UseError } from "@ember-soft/gemello-server-common";
import { InternalServerErrorException } from "@nestjs/common";

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "unknown facade error";

export const UseFacadeError = UseError(
  (e) => new InternalServerErrorException(getErrorMessage(e))
);
