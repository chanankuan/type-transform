/**
 * Adds two values, performing type-appropriate addition.
 *
 * - If both values are arrays, returns their concatenation.
 * - If either value is an object (but not an array), throws an error.
 * - If either value is undefined, throws an error.
 * - For other primitive types (number, string, boolean), uses the built-in + operator.
 *
 * @param {*} a - The first value to add.
 * @param {*} b - The second value to add.
 * @returns {*} - The result of adding `a` and `b`.
 * @throws {Error} If addition is not possible (e.g. for objects or underfined).
 */
function addValues(a, b) {
  const typeA = typeof a;
  const typeB = typeof b;

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  }

  if (
    (typeA === "object" && a !== null && !Array.isArray(a)) ||
    (typeB === "object" && b !== null && !Array.isArray(b))
  ) {
    throw new Error(`Cannot add values of type "${typeA}" and "${typeB}".`);
  }

  if (a === undefined || b === undefined) {
    throw new Error("Cannot add undefined values.");
  }

  return a + b;
}

/**
 * Converts any value to its string representation.
 *
 * - For primitive types (string, number, boolean, bigint, symbol, undefined, null),
 *   uses String(val).
 * - For objects and arrays, uses JSON.stringify().
 *
 * @param {*} val - The value to stringify.
 * @returns {string} The string representation of the value.
 */
function stringifyValue(val) {
  const primitives = [
    "string",
    "number",
    "boolean",
    "bigint",
    "symbol",
    "undefined",
    "null",
  ];

  if (primitives.includes(typeof val)) {
    return String(val);
  }

  return JSON.stringify(val);
}

/**
 * Inverts a boolean value.
 *
 * @param {boolean} val - The boolean value to invert.
 * @returns {boolean} The inverted boolean value.
 * @throws {Error} If the argument is not a boolean.
 */
function invertBoolean(val) {
  if (typeof val !== "boolean") {
    throw new Error("Argument is not a boolean.");
  }

  return !val;
}

/**
 * Converts a value to a number.
 *
 * - If the value is already a number, returns it as is.
 * - If the value is a string, parses it to a number.
 * - If the value is a boolean, converts true → 1, false → 0.
 * - If the value is null, returns 0.
 * - If the value is undefined, throws an error.
 * - If the value is an object/array, attempts Number(value); throws error if conversion fails.
 * - For any other type, throws an error.
 *
 * @param {*} value - The value to convert to a number.
 * @returns {number} The numeric representation of the value.
 * @throws {Error} If the conversion is not possible.
 */
function convertToNumber(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    // Check for doubles as well
    const parsed = value.includes(".")
      ? parseFloat(value)
      : parseInt(value, 10);

    if (isNaN(parsed)) {
      throw new Error("Cannot convert string to number.");
    }

    return parsed;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (value === null) {
    return 0;
  }

  if (typeof value === "undefined") {
    throw new Error("Cannot convert undefined to number.");
  }

  if (typeof value === "object") {
    const num = Number(value);

    if (!isNaN(num)) {
      return num;
    }

    throw new Error("Cannot convert object to number.");
  }

  throw new Error(`Cannot convert type "${typeof value}" to number.`);
}

/**
 * Coerces a value to a specified type using type coercion.
 *
 * Supported target types:
 * - "string"
 * - "number"
 * - "boolean"
 * - "bigint"
 * - "object"
 * - "symbol"
 * - "undefined"
 *
 * @param {*} value - The value to convert.
 * @param {string} type - The target type to coerce to.
 * @returns {*} The coerced value.
 * @throws {Error} If coercion is not possible or type is unsupported.
 */
function coerceToType(value, type) {
  switch (type) {
    case "string":
      return String(value);

    case "number": {
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Cannot coerce value to number: ${value}`);
      }
      return num;
    }

    case "boolean":
      return Boolean(value);

    case "bigint": {
      // BigInt throws an error if not succeed
      try {
        return BigInt(value);
      } catch (err) {
        throw new Error(`Cannot coerce value to bigint: ${value}`);
      }
    }

    case "object":
      if (value === null || typeof value === "object") {
        return value;
      }
      throw new Error(
        `Cannot coerce value of type "${typeof value}" to object.`
      );

    case "symbol":
      if (typeof value === "symbol") {
        return value;
      }
      throw new Error(
        "Cannot coerce to symbol unless value is already a symbol."
      );

    case "undefined":
      if (typeof value === "undefined") {
        return undefined;
      }
      throw new Error(
        `Cannot coerce value of type "${typeof value}" to undefined.`
      );

    default:
      throw new Error(`Unsupported target type: "${type}".`);
  }
}

/**
 * Safely parses a JSON string into an object or value.
 *
 * @param {string} str - The JSON string to parse.
 * @param {*} fallback - The value to return if parsing fails.
 * @returns {*} The parsed value or the fallback.
 */
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

/**
 * Compares two values using both loose equality (==) and strict equality (===).
 * Returns a string explaining the comparison results and warns if type coercion happened.
 *
 * @param {*} a - The first value to compare.
 * @param {*} b - The second value to compare.
 * @returns {string} - A formatted string describing the comparison results.
 */

function paranoidEquals(a, b) {
  const looseEqual = a == b;
  const strictEqual = a === b;
  return `
    Comparing ${String(a)} (${typeof a}) and ${String(b)} (${typeof b}):

    ==  : ${looseEqual}
    === : ${strictEqual}

    ${
      looseEqual && !strictEqual
        ? "⚠️ Coercion happened in '=='. Be careful!"
        : ""
    }
`;
}

module.exports = {
  addValues,
  stringifyValue,
  invertBoolean,
  convertToNumber,
  coerceToType,
  safeJsonParse,
  paranoidEquals,
};
