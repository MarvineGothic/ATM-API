export type Nullable<NullableType> = NullableType | null | undefined;

export const hasNoValue = <Type>(
  subject: Nullable<Type>,
): subject is undefined | null => subject === null || subject === undefined;

export const hasValue = <Type>(subject: Nullable<Type>): subject is Type =>
  !hasNoValue(subject);
