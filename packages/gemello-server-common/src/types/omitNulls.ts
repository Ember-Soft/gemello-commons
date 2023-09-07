export type OmitNulls<T> = {
  [K in keyof T]: T[K] extends null ? undefined : T[K];
};
