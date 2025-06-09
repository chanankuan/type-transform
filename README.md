# type-transform

🧙‍♂️ A tiny JavaScript utility library for advanced type conversion, coercion, and value transformation.  
Useful for type-safe operations, debugging coercion, and experimenting with JavaScript’s type system.

## Features

✅ Add values of different types  
✅ Convert any value to string  
✅ Invert boolean values  
✅ Convert values to number  
✅ Coerce values to any primitive type  
✅ Safe JSON parsing  
✅ Debug equality coercion with `paranoidEquals`

---

## Installation

```bash
npm install @chanankuan/type-transform
```

or

```
yarn add @chanankuan/type-transform
```

## Usage

```
const {
  addValues,
  stringifyValue,
  invertBoolean,
  convertToNumber,
  coerceToType,
  safeJsonParse,
  paranoidEquals,
} = require("type-transform");

// Add values
console.log(addValues([1, 2], [3, 4]));       // [1, 2, 3, 4]
console.log(addValues(5, 10));                // 15
console.log(addValues("Hello, ", "world!"));  // "Hello, world!"

// Stringify values
console.log(stringifyValue({ foo: "bar" }));  // '{"foo":"bar"}'

// Invert boolean
console.log(invertBoolean(true));             // false
console.log(invertBoolean(false));            // true

// Convert to number
console.log(convertToNumber("42"));           // 42
console.log(convertToNumber(true));           // 1

// Coerce to type
console.log(coerceToType("123", "number"));   // 123
console.log(coerceToType(1, "boolean"));      // true
console.log(coerceToType(123, "string"));     // "123"

// Safe JSON parse
console.log(safeJsonParse('{"a":1}'));        // { a: 1 }
console.log(safeJsonParse("not json", {}));   // fallback: {}

// Paranoid equals
console.log(paranoidEquals(0, false));

```

## API Reference

`addValues(a, b)`

Arrays → concatenates

Objects → throws error

Undefined → throws error

Primitives → adds with + operator

`stringifyValue(val)`

Converts value to string.

Objects/arrays use JSON.stringify.

`invertBoolean(val)`

Inverts a boolean value.

Throws if input is not a boolean.

`convertToNumber(val)`

Converts value to number with proper rules:

strings, booleans, null → supported

undefined, bad object → throws

`coerceToType(value, type)`

Supported types:

- `"string"`
- `"number"`
- `"boolean"`
- `"bigint"`
- `"object"`
- `"symbol"`
- `"undefined"`

Throws on unsupported types or failed conversion.

`safeJsonParse(str, fallback)`

Parses JSON string, returns fallback if parsing fails.

`paranoidEquals(a, b)`

Returns a formatted string comparing == vs === and warns if coercion occurred.

## License

MIT

## Author

Built with ❤️ by Antony Chan.
