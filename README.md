# EnvArgs

 Load configuration through arguments, a .env file and environment variables in that order. Handling naming for you.

 ## Installation

 ```BASH
 npm install --save @inlustra/env-args
 ```

 ## Description

 An opinionated mechanism to load configuration from a given default configuration.
 By default, environment variables are prefixed with your package name (in package.json)

 Super simple example with `package.json > name` set to env-var:

**.env**
```
ENV_VAR_REQUIRED="won't throw an error!"
ENV_ARGS_REQUIRED_NUMBER=92
ENV_ARGS_OVERRIDDEN=This shouldnt appear
```

**index.js**
 ```javascript
 const defaultConfiguration = {
     foo: 'A default string',
     notRequired: null,
     requiredNumber: undefined, // Added in .env file
     alsoRequired: undefined, // Passed in through args below
     aNumber: undefined
 }

 const loadedConfiguration = loadConfig(defaultConfiguration)

 console.dir(loadedConfiguration)
 ```

**Command Line**

 `node index.js --alsoRequired="Fixed" --aNumber="4000" --overriden=wooh!`

 **Output**
```
{
    overridden: 'wooh!',
    aNumber: 4000,
    alsoRequired: 'Fixed',
    requiredNumber: 92,
    notRequired: null,
    foo: 'A default string'
}
```

## Configuration
| Key              |         Type         | Description                                                                                                 | Defaults To                                                                                                                 |   |
|------------------|:--------------------:|-------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|:-:|
| arguments        |      `string[]`      | The arguments to be parsed by minimist                                                                      | `process.env.slice(2)`                                                                                                      |   |
| envPrefix        |       `string`       | Used to override the environment variable, example: `required` would become `prefixrequired` when overriden | package name in constant format if run through npm, otherwise, empty.                                                       |   |
| throwUndefined   |       `boolean`      | Will enable/disable exceptions when there is missing config                                                 | `true`                                                                                                                      |   |
| logConfiguration |       `boolean`      | Will enable/disable the default logging once loaded                                                         | `true`                                                                                                                      |   |
| log              |   `(string) => any`  | Used to override the default logger                                                                         | `console.log`                                                                                                               |   |
| envKeyTransform  | `(string) => string` | Used to completely customise configuration key to environment variable mapping                              | If package name exists, `PACKAGE_NAME_FIELD`, if it doesn't exist, but envPrefix is set: `envprefixfield` otherwise `FIELD` |   |
| dotEnvPath       |       `string`       | Passed to dotenv to specify the location of the .env file                                                   | `undefined` (`.env`)                                                                                                        |   |
| dotEnvEncoding   |  `'utf8', 'base64'` | Passed to dotenv to specify the encoding of the variables in the dotenvfile                                 | `undefined` (`'utf8'`)                                                                                                      |   |

## Running tests
```bash
npm i
npm test
```
