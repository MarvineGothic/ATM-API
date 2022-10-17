import { Nullable, hasNoValue, hasValue } from './nullable';


describe('Test for nullable types', () => {
  const nullableNumberWithValue: Nullable<number> = 5;
  const nullableNumberWithNull: Nullable<number> = null;
  const nullableNumberWithUndefined: Nullable<number> = undefined;

  it('hasValue test', () => {
    expect(hasValue(nullableNumberWithValue)).toBeTruthy();
    expect(hasValue(nullableNumberWithNull)).toBeFalsy();
    expect(hasValue(nullableNumberWithUndefined)).toBeFalsy();
  });

  it('hasNoValue', () => {
    expect(hasNoValue(nullableNumberWithValue)).toBeFalsy();
    expect(hasNoValue(nullableNumberWithNull)).toBeTruthy();
    expect(hasNoValue(nullableNumberWithUndefined)).toBeTruthy();
  });
});
