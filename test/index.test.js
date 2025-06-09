const {
  addValues,
  stringifyValue,
  invertBoolean,
  convertToNumber,
  coerceToType,
  safeJsonParse,
  paranoidEquals,
} = require("../src/index");

describe("addValues()", () => {
  // ✅ Valid cases
  test("adds two numbers", () => {
    expect(addValues(2, 3)).toBe(5);
  });

  test("concatenates two strings", () => {
    expect(addValues("Hello, ", "world")).toBe("Hello, world");
  });

  test("concatenates string and number", () => {
    expect(addValues("Age: ", 30)).toBe("Age: 30");
  });

  test("concatenates two arrays", () => {
    expect(addValues([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
  });

  test("adds booleans as numbers", () => {
    expect(addValues(true, false)).toBe(1);
  });

  test("adds null and number", () => {
    expect(addValues(null, 5)).toBe(5);
  });

  test("concatenates string and boolean", () => {
    expect(addValues("Value: ", true)).toBe("Value: true");
  });

  test("concatenates string and array", () => {
    expect(addValues("", [1, 2])).toBe("1,2");
  });

  test("adds number and boolean", () => {
    expect(addValues(10, true)).toBe(11);
  });

  // ❌ Invalid/error cases
  test("throws when first value is undefined", () => {
    expect(() => addValues(undefined, 1)).toThrow(
      "Cannot add undefined values."
    );
  });

  test("throws when second value is undefined", () => {
    expect(() => addValues(1, undefined)).toThrow(
      "Cannot add undefined values."
    );
  });

  test("throws when both values are undefined", () => {
    expect(() => addValues(undefined, undefined)).toThrow(
      "Cannot add undefined values."
    );
  });

  test("throws when adding object and number", () => {
    expect(() => addValues({}, 5)).toThrow(
      'Cannot add values of type "object" and "number".'
    );
  });

  test("throws when adding number and object", () => {
    expect(() => addValues(5, {})).toThrow(
      'Cannot add values of type "number" and "object".'
    );
  });

  test("throws when adding two objects", () => {
    expect(() => addValues({ a: 1 }, { b: 2 })).toThrow(
      'Cannot add values of type "object" and "object".'
    );
  });
});

// Tests for stringifyValue function

describe("stringifyValue", () => {
  test("should convert strings correctly", () => {
    expect(stringifyValue("hello")).toBe("hello");
    expect(stringifyValue("")).toBe("");
  });

  test("should convert numbers correctly", () => {
    expect(stringifyValue(42)).toBe("42");
    expect(stringifyValue(0)).toBe("0");
    expect(stringifyValue(-3.14)).toBe("-3.14");
  });

  test("should convert booleans correctly", () => {
    expect(stringifyValue(true)).toBe("true");
    expect(stringifyValue(false)).toBe("false");
  });

  test("should convert bigint correctly", () => {
    expect(stringifyValue(BigInt(9007199254740991))).toBe("9007199254740991");
  });

  test("should convert symbol correctly", () => {
    const sym = Symbol("test");
    // String(sym) returns "Symbol(test)"
    expect(stringifyValue(sym)).toBe(sym.toString());
  });

  test("should convert undefined correctly", () => {
    expect(stringifyValue(undefined)).toBe("undefined");
  });

  test("should convert null correctly", () => {
    expect(stringifyValue(null)).toBe("null");
  });

  test("should stringify arrays as JSON", () => {
    expect(stringifyValue([1, 2, 3])).toBe("[1,2,3]");
    expect(stringifyValue([])).toBe("[]");
  });

  test("should stringify objects as JSON", () => {
    expect(stringifyValue({ a: 1, b: "test" })).toBe('{"a":1,"b":"test"}');
    expect(stringifyValue({})).toBe("{}");
  });

  test("should stringify nested objects and arrays", () => {
    expect(stringifyValue({ x: [1, { y: "z" }], a: null })).toBe(
      '{"x":[1,{"y":"z"}],"a":null}'
    );
  });

  test("should handle functions by JSON.stringify returning undefined", () => {
    expect(stringifyValue(function () {})).toBe(undefined);
    // Note: JSON.stringify returns undefined for functions, so the function returns undefined
  });

  test("should handle symbols inside objects by JSON.stringify omitting them", () => {
    const obj = { a: 1, [Symbol("sym")]: "hidden" };
    expect(stringifyValue(obj)).toBe('{"a":1}');
  });
});

describe("invertBoolean", () => {
  test("should invert true to false", () => {
    expect(invertBoolean(true)).toBe(false);
  });

  test("should invert false to true", () => {
    expect(invertBoolean(false)).toBe(true);
  });

  test("should throw an error if argument is not boolean", () => {
    expect(() => invertBoolean(1)).toThrow("Argument is not a boolean.");
    expect(() => invertBoolean("true")).toThrow("Argument is not a boolean.");
    expect(() => invertBoolean(null)).toThrow("Argument is not a boolean.");
    expect(() => invertBoolean(undefined)).toThrow(
      "Argument is not a boolean."
    );
    expect(() => invertBoolean({})).toThrow("Argument is not a boolean.");
  });
});

describe("convertToNumber", () => {
  test("returns number as is", () => {
    expect(convertToNumber(42)).toBe(42);
    expect(convertToNumber(-3.14)).toBe(-3.14);
  });

  test("parses numeric strings correctly", () => {
    expect(convertToNumber("123")).toBe(123);
    expect(convertToNumber("45.67")).toBe(45.67);
    expect(convertToNumber("0")).toBe(0);
  });

  test("throws error on invalid numeric strings", () => {
    expect(() => convertToNumber("abc")).toThrow(
      "Cannot convert string to number."
    );
  });

  test("converts booleans to numbers", () => {
    expect(convertToNumber(true)).toBe(1);
    expect(convertToNumber(false)).toBe(0);
  });

  test("converts null to 0", () => {
    expect(convertToNumber(null)).toBe(0);
  });

  test("throws error when converting undefined", () => {
    expect(() => convertToNumber(undefined)).toThrow(
      "Cannot convert undefined to number."
    );
  });

  test("converts objects and arrays if possible", () => {
    expect(convertToNumber([123])).toBe(123); // Number([123]) === 123
    expect(convertToNumber("123")).toBe(123); // sanity check

    expect(() => convertToNumber({})).toThrow(
      "Cannot convert object to number."
    );
    expect(() => convertToNumber([1, 2])).toThrow(
      "Cannot convert object to number."
    );
  });

  test("throws error for other types", () => {
    expect(() => convertToNumber(Symbol("sym"))).toThrow(
      'Cannot convert type "symbol" to number.'
    );
    expect(() => convertToNumber(() => {})).toThrow(
      'Cannot convert type "function" to number.'
    );
  });
});

describe("coerceToType", () => {
  test("coerces to string", () => {
    expect(coerceToType(123, "string")).toBe("123");
    expect(coerceToType(true, "string")).toBe("true");
    expect(coerceToType(null, "string")).toBe("null");
    expect(coerceToType(undefined, "string")).toBe("undefined");
  });

  test("coerces to number", () => {
    expect(coerceToType("42", "number")).toBe(42);
    expect(coerceToType("3.14", "number")).toBe(3.14);
    expect(coerceToType(true, "number")).toBe(1);
    expect(coerceToType(false, "number")).toBe(0);
    expect(coerceToType(null, "number")).toBe(0);
  });

  test("throws error on invalid number coercion", () => {
    expect(() => coerceToType("abc", "number")).toThrow(
      "Cannot coerce value to number"
    );
    expect(() => coerceToType(undefined, "number")).toThrow(
      "Cannot coerce value to number"
    );
  });

  test("coerces to boolean", () => {
    expect(coerceToType("", "boolean")).toBe(false);
    expect(coerceToType("false", "boolean")).toBe(true);
    expect(coerceToType(0, "boolean")).toBe(false);
    expect(coerceToType(1, "boolean")).toBe(true);
    expect(coerceToType(null, "boolean")).toBe(false);
    expect(coerceToType({}, "boolean")).toBe(true);
  });

  test("coerces to bigint", () => {
    expect(coerceToType("123", "bigint")).toBe(BigInt(123));
    expect(coerceToType(123, "bigint")).toBe(BigInt(123));
    expect(coerceToType(BigInt(456), "bigint")).toBe(BigInt(456));
  });

  test("throws error on invalid bigint coercion", () => {
    expect(() => coerceToType("123.45", "bigint")).toThrow(
      "Cannot coerce value to bigint"
    );
    expect(() => coerceToType("abc", "bigint")).toThrow(
      "Cannot coerce value to bigint"
    );
  });

  test("coerces to object", () => {
    const obj = { a: 1 };
    expect(coerceToType(obj, "object")).toBe(obj);
    expect(coerceToType(null, "object")).toBeNull();
  });

  test("throws error on invalid object coercion", () => {
    expect(() => coerceToType(123, "object")).toThrow(
      'Cannot coerce value of type "number" to object.'
    );
    expect(() => coerceToType("string", "object")).toThrow(
      'Cannot coerce value of type "string" to object.'
    );
  });

  test("coerces to symbol only if already a symbol", () => {
    const sym = Symbol("test");
    expect(coerceToType(sym, "symbol")).toBe(sym);
  });

  test("throws error on invalid symbol coercion", () => {
    expect(() => coerceToType("sym", "symbol")).toThrow(
      "Cannot coerce to symbol unless value is already a symbol."
    );
    expect(() => coerceToType(123, "symbol")).toThrow(
      "Cannot coerce to symbol unless value is already a symbol."
    );
  });

  test("coerces to undefined only if value is undefined", () => {
    expect(coerceToType(undefined, "undefined")).toBeUndefined();
  });

  test("throws error on invalid undefined coercion", () => {
    expect(() => coerceToType(null, "undefined")).toThrow(
      'Cannot coerce value of type "object" to undefined.'
    );
    expect(() => coerceToType(0, "undefined")).toThrow(
      'Cannot coerce value of type "number" to undefined.'
    );
  });

  test("throws error on unsupported target type", () => {
    expect(() => coerceToType(123, "function")).toThrow(
      'Unsupported target type: "function".'
    );
  });
});

describe("safeJsonParse", () => {
  test("parses valid JSON string correctly", () => {
    expect(safeJsonParse('{"a":1,"b":2}')).toEqual({ a: 1, b: 2 });
    expect(safeJsonParse("[1,2,3]")).toEqual([1, 2, 3]);
    expect(safeJsonParse('"hello"')).toBe("hello");
    expect(safeJsonParse("123")).toBe(123);
    expect(safeJsonParse("true")).toBe(true);
    expect(safeJsonParse("null")).toBeNull();
  });

  test("returns fallback on invalid JSON string", () => {
    expect(safeJsonParse("not json")).toBeNull();
    expect(safeJsonParse("{missing:quotes}")).toBeNull();
    expect(safeJsonParse("")).toBeNull();
  });

  test("returns custom fallback when provided", () => {
    const fallbackValue = { error: true };
    expect(safeJsonParse("invalid json", fallbackValue)).toEqual(fallbackValue);
    expect(safeJsonParse("", fallbackValue)).toEqual(fallbackValue);
  });
});

describe("paranoidEquals", () => {
  test("returns correct comparison for strictly equal values", () => {
    const result = paranoidEquals(5, 5);
    expect(result).toContain("==  : true");
    expect(result).toContain("=== : true");
    expect(result).not.toContain("⚠️ Coercion happened");
  });

  test("returns warning when loose equality true but strict false", () => {
    const result = paranoidEquals(5, "5");
    expect(result).toContain("==  : true");
    expect(result).toContain("=== : false");
    expect(result).toContain("⚠️ Coercion happened");
  });

  test("returns false for both when values are different", () => {
    const result = paranoidEquals(5, 6);
    expect(result).toContain("==  : false");
    expect(result).toContain("=== : false");
    expect(result).not.toContain("⚠️ Coercion happened");
  });

  test("correctly handles null and undefined", () => {
    const result = paranoidEquals(null, undefined);
    expect(result).toContain("==  : true");
    expect(result).toContain("=== : false");
    expect(result).toContain("⚠️ Coercion happened");
  });

  test("handles comparing objects", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 1 };
    const result = paranoidEquals(obj1, obj2);
    expect(result).toContain("==  : false");
    expect(result).toContain("=== : false");
  });

  test("handles comparing arrays", () => {
    const arr1 = [1, 2];
    const arr2 = [1, 2];
    const result = paranoidEquals(arr1, arr2);
    expect(result).toContain("==  : false");
    expect(result).toContain("=== : false");
  });

  test("handles comparing booleans and numbers", () => {
    const result = paranoidEquals(true, 1);
    expect(result).toContain("==  : true");
    expect(result).toContain("=== : false");
    expect(result).toContain("⚠️ Coercion happened");
  });
});
