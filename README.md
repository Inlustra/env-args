# [env-args](https://www.npmjs.com/package/@inlustra/env-args)

Load configuration through arguments, a .env file and environment variables in that order. Handling naming for you.

By default, env-args will output logging information, and inform you if you're missing required arguments or environment variables.

## Installation

```BASH
npm install --save @inlustra/env-args
```

## More in-depth

An opinionated mechanism to load configuration from a given default configuration.
By default, environment variables are prefixed with your package name (in package.json)

Will automatically coerce both args and environment variables to their correct types:
- `--myVar='3000'`: would become `{myVar: 3000}`
- `--myVar='a full on string'`: would become `{myVar: 'a full on string'}`
- `--myVar=null`: would become `{myVar: null}`
- `--myVar=undefined`: would become `{myVar: undefined}`
- `--myVar='{test: 10}'`: would become `{myVar: test: 10}`

Uses:
- [minimist](https://www.npmjs.com/package/minimist) to parse the arguments
- [dotenv](https://www.npmjs.com/package/dotenv) to parse the .env file



### Short Example

Starting a project named `exampleProject`

Providing the following configuration to the load method: `{required: undefined}`

Running via npm (`npm start`) would require either an environment variable set as `EXAMPLE_PROJECT_REQUIRED` or the `--required='my var'` command line argument set.

Running a node script (`node index.js`) would require either an environment variable set as `REQUIRED` or the `--required='my var'` command line argument set.

All of this can be changed in using the provided configuration

### Full Example

This example can be run by using `npm i && npm start`

**With `package.json > name` set to `@inlustra/env-args`**

**index.js**

```javascript
const envArgs = require('@inlustra/env-args')

const defaultConfiguration = {
  foo: 'A default string',
  notRequired: null,
  requiredNumber: undefined, // Passed in through .env file above
  alsoRequired: undefined, // Passed in through args below
  aNumber: undefined, // Passed in through args below
  overridden: 10 // Passed in through both, args, and .env file (Args takes preference)
}

const loadedConfiguration = envArgs.load(defaultConfiguration, {
  envPrefix: 'ENV_ARGS'
})

console.dir(loadedConfiguration)
```

**.env**

```
INLUSTRA_ENV_ARGS_REQUIRED_NUMBER=92
INLUSTRA_ENV_ARGS_OVERRIDDEN=This shouldnt appear
```

**Command Line**

`node index.js --alsoRequired="Fixed" --aNumber="4000" --overriden=wooh!`

**Output**

```
------------ Start Environment Configuration ------------
    overridden: wooh!
    aNumber: 4000
    alsoRequired: Fixed
    requiredNumber: 92
    notRequired: null
    foo: A default string
------------ End Environment Configuration --------------
{ overridden: 'wooh!',
  aNumber: 4000,
  alsoRequired: 'Fixed',
  requiredNumber: 92,
  notRequired: null,
  foo: 'A default string' }
```

**Example output if arguments not supplied**

```
------------ Environment configuration not set ------------
Remember, you can override these by placing a .env file in your package.
Argument --alsoRequired or environment variable ENV_ARGS_ALSO_REQUIRED
Argument --aNumber or environment variable ENV_ARGS_A_NUMBER

/Users/the_nairn/Documents/Projects/envOrArgs/dist/index.js:58
        throw new EnvironmentNotSetError();
        ^

Error: Missing environment configuration
```

## Configuration

| Key              |         Type         | Description                                                                                                  | Defaults To                                                                                                                 |     |
| ---------------- | :------------------: | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| arguments        |      `string[]`      | The arguments to be parsed by minimist                                                                       | `process.env.slice(2)`                                                                                                      |
| envPrefix        |       `string`       | Used to override the environment variable, example: `required` would become `PREFIX_REQUIRED` when overriden | package name in constant format if run through npm, otherwise, empty.                                                       |     |
| throwUndefined   |      `boolean`       | Will enable/disable exceptions when there is missing config                                                  | `true`                                                                                                                      |
| logConfiguration |      `boolean`       | Will enable/disable the default logging once loaded                                                          | `true`                                                                                                                      |
| log              |  `(string) => any`   | Used to override the default logger                                                                          | `console.log`                                                                                                               |
| envKeyTransform  | `(string) => string` | Used to completely customise configuration key to environment variable mapping                               | If package name exists, `PACKAGE_NAME_FIELD`, if it doesn't exist, but envPrefix is set: `envprefixfield` otherwise `FIELD` |     |
| dotEnvPath       |       `string`       | Passed to dotenv to specify the location of the .env file                                                    | `undefined` (`.env`)                                                                                                        |
| dotEnvEncoding   |  `'utf8', 'base64'`  | Passed to dotenv to specify the encoding of the variables in the dotenvfile                                  | `undefined` (`'utf8'`)                                                                                                      |

## Running tests

```bash
npm i
npm test
```
