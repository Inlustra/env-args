const envVar = require('../dist/index')

const defaultConfiguration = {
    foo: 'A default string',
    notRequired: null,
    requiredNumber: undefined, // Added in .env file
    alsoRequired: undefined, // Passed in through args below
    aNumber: undefined,
    overridden: 10
}

const loadedConfiguration = envVar.load(defaultConfiguration)

console.dir(loadedConfiguration)
