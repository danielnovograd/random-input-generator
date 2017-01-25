[![Travis](https://img.shields.io/travis/danielnovograd/random-input-generator.svg?style=flat)](https://travis-ci.org/danielnovograd/random-input-generator)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/danielnovograd/random-input-generator.svg?style=flat)](https://codecov.io/gh/danielnovograd/random-input-generator)
[![NPM Version](https://img.shields.io/npm/v/random-input-generator.svg?style=flat)](https://github.com/danielnovograd/random-input-generator)
[![License](https://img.shields.io/npm/l/random-character-name.svg?style=flat)](http://spdx.org/licenses/MIT)

# Introduction

random-input-generator is a simple, easily-configurable module that generates common JavaScript values for quick and easy seed data.

# Issues

If you happen to find any bugs or would like to recommend suggestions for future updates, please feel free to do so in the [github issue tracker](https://github.com/danielnovograd/random-input-generator/issues).

# Usage
To install the module, you can run `npm install random-input-generator` from your command line or you can add "random-input-generator" to your `package.json` and run `npm install`.

# Documentation

For your generation pleasure, this module provides methods for generating randomized strings, booleans, numbers, objects, and arrays. Primitive-generating methods accept multiple arguments, whereas objects accept configuration objects.

To get started, simply require in the module:
` var randomInput = require('random-input-generator'); `

If you're using ES6/ES2015, feel free to use destructuring syntax:
`const { generateNumber, generateString, generateBoolean, generateObject, generateArray, defaultGenerator } = require('random-input-generator');`

## generateNumber
**Parameters**
- `min` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Optional number representing the minimum (inclusive) randomly generated number. (optional, default `0`)
- `max` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Optional number representing the maximum (inclusive) randomly generated number. *Must be greater than `min`.* (optional, default `10000`)
- `rounded` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Optional true/false determining whether to return an integer or a number with a decimal value. (optional, default `true`)

**Examples**
```javascript
  var randomInput = require('random-input-generator');
  var generateNumber = randomInput.generateNumber;

  //with default parameters, method will return integer between 0 and 10000
  generateNumber(); //1538

  //can return a number within a specific range, or decimal value
  generateNumber(0,5,false); //4.633396897573343
```
## generateString
**Parameters**
- `minLength` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Optional number representing the minimum (inclusive) length of randomly generated string. (optional, default `4`)
- `max` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Optional number representing the maximum (inclusive) length of a randomly generated string. (optional, default `12`)
- `nonLetters` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Optional true/false determining whether to include non-letter characters between Unicode values 32-127. (optional, default `true`)
- `casing` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** Optional string, either `"upper"` or `"lower"`, provided if either uppercase or lowercase string is preferred. (optional)

**Examples**
```javascript
  var randomInput = require('random-input-generator');
  var generateString = randomInput.generateString;

  //with default parameters, method will return string between 4-12 characters with non-letters
  generateString(); //'XnB%tudFH>'

  //can return a string within a specific length range
  generateString(1,4,false); //'"SX'

  //can return a string with only letters
  generateString(6,10,false); //'SHqIHoF'

  //can enforce casing
  generateString(4,8,false,"upper"); //'CTEQTUE'
```

## generateBoolean
**Parameters**
- `weightPercentage` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Optional decimal value between `0` and `1` representing a weight towards either a return value of `false` or `true`. (optional, default `.5`)

**Examples**
```javascript
  var randomInput = require('random-input-generator');
  var generateBoolean = randomInput.generateBoolean;

  //with default parameters, theoretically equally likely to return true or false
  generateBoolean(); //true

  //with weight of .3, theoretically <30% likely to return true
  generateBoolean(.3); //false
```

*For non-primitive values, each generator function accepts a configuration object as its sole argument. While each specification is optional, if provided, each must conform to a specific type.*

## generateObject
**Parameters**
- `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** configuration Object
  - `options.keyValPairs` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** A specific number of key-value pairs of which the object will be comprised. (optional)
  - `options.optionalSkeleton` **([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>|[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))?** An object on which to generate new Object. If Array is provided, each element will be used as a key in the generated Object, with any additional key-value pairs added according to `options.keyValPairs` or `minKeyValPairs, maxKeyValPairs`. If Object is provided, each key-value pair will be used to extend an empty object, with any additional key-value pairs added according to `options.keyValPairs` or `minKeyValPairs, maxKeyValPairs`. (optional)
  - `options.valPreference` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>?** An array containing desired string value types for the generated Object. All strings in `valPreference` array must conform to one of the following value types `["string", "number", "boolean", "object", "array"]`. Strings contained in `valPreference` will be chosen at random to generate values. Duplicate types are permitted and will effectively weight random selection towards one of these value types. (optional, default `[]`)
  - `options.minKeyValPairs` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Number representing the minimum (inclusive) possible number of key-value pairs populated in generated Object. If `options.optionalSkeleton` is provided, `minKeyValPairs` **must** be greater than or equal to the length of skeleton array or number of key-value pairs in skeleton Object. (optional, default `2`)
  - `options.maxKeyValPairs` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Number representing the maximum (inclusive) possible number of key-value pairs populated in generated Object. (optional, default `6`)
  - `options.maxDepth` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** As randomly generating objects can potentially exceed the maximum call stack, a `maxDepth` option is provided to prevent object spelunking. `maxDepth` will dictate the depth of the deepest non-object value (optional), at which point the generator will only be allowed to produce primitive values for key-value pairs.









