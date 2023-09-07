export function UseError<T extends (...args: any[]) => any, E extends Error>(
  factory: (e: unknown) => E,
) {
  return (
    _: object,
    __: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>>> {
      try {
        return await originalMethod.apply(this, args);
      } catch (e) {
        throw factory(e);
      }
    } as T;
  };
}
